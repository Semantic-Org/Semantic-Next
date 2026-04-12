import { isDevelopment } from '@semantic-ui/utils';

/*

  defineBlock — infrastructure for per-block lifecycle modules.

  Mirrors defineComponent's shape: a single factory call with a config object
  and named lifecycle hooks (create, render, hydrate, update, destroy, error).
  Each hook receives the same destructured 9-key author bag — take what you
  need.

  The infrastructure owns:
    • Reaction wiring with auto-context for dev tracing
    • first-run dispatch to render() or hydrate() based on the dispatch-level
      `hydrating` flag
    • try/catch wrapping every hook, structured error emission on throw
    • hydrate-throw fallthrough to render() (server DOM untrustworthy)
    • render/update throw → reaction disposal (no silent retry-loop on ticks)
    • create-throw → skip mount entirely (no self means render would loop)
    • destroy-throw → swallow (scope is disposing regardless)
    • error-hook-throw → re-throw in dev, swallow in prod
    • onUpdated microtask notification after every successful DOM-writing hook

  The block author never touches scope.reaction, DynamicRegion, comp.firstRun,
  Reaction.setContext, try/catch, or onUpdated scheduling.

*/

const EMOJI = '🔴';

// Best-effort template-syntax reconstruction for the error-log header.
// Nodes are AST structures; field shapes vary by block type. Forgiving — if a
// field is missing or shaped unexpectedly, produces what it can rather than
// throwing.
function nodeSyntax(node) {
  if (!node) { return ''; }
  const expr = (val) => {
    if (val == null) { return ''; }
    if (typeof val === 'string') { return val; }
    if (typeof val === 'object') {
      if (val.value != null) { return String(val.value); }
      if (Array.isArray(val.tokens)) { return val.tokens.map((t) => t.value ?? t).join(' '); }
    }
    return String(val);
  };
  switch (node.type) {
    case 'if':
      return `{#if ${expr(node.condition)}}`;
    case 'elseif':
      return `{:elseif ${expr(node.condition)}}`;
    case 'each': {
      const as = node.as ? ` as ${node.as}` : '';
      return `{#each ${expr(node.over)}${as}}`;
    }
    case 'async':
      return `{#async ${expr(node.expression)}}`;
    case 'rerender':
      return `{#rerender${node.expression ? ' ' + expr(node.expression) : ''}}`;
    case 'template':
      return `{> ${expr(node.name)}}`;
    case 'snippet':
      return `{#snippet ${node.name || ''}}`;
    default:
      return `{#${node.type}}`;
  }
}

// Structured error log — the agentic feedback loop that turns opaque throws
// into parseable records. V2 extensions (resolution trail, report() facade,
// dedup) extend this one function rather than introducing parallel pipelines.
// Dev-only — tree-shakes in prod.
export function reportBlockError(blockName, node, hook, err) {
  if (!isDevelopment) { return; }
  const syntax = nodeSyntax(node);
  const header = `${EMOJI} ${blockName}  ${syntax}`;
  const message = err?.message ?? String(err);
  if (typeof console.groupCollapsed === 'function') {
    console.groupCollapsed(header);
    console.error(message);
    console.log(`hook: ${hook}`);
    if (err?.stack) { console.log(err.stack); }
    console.groupEnd();
  }
  else {
    console.error(`${header}\n  ${message}\n  hook: ${hook}`);
    if (err?.stack) { console.log(err.stack); }
  }
}

// Exposed for testing — not part of the public block-author surface.
export { nodeSyntax as _nodeSyntax };

export function defineBlock(config) {
  const { name, create, render, hydrate, update, destroy, error: errorHook, evaluateText } = config;

  const dispatch = function(ctx) {
    const { node, data, scope, region, isSVG, serverMeta, hydrating, renderer } = ctx;

    // create() runs once, outside any reaction, with the dispatch-level
    // 8-key context. The seam for blocks that need renderer internals (e.g.,
    // TemplateBlock stashes renderer.subTemplates into self). A throw skips
    // mount entirely — without self, render() would throw immediately and
    // loop. The structured log is the terminal state.
    let self;
    if (create) {
      try {
        self = create(ctx) || {};
      }
      catch (err) {
        reportBlockError(name, node, 'create', err);
        return;
      }
    }
    else {
      self = {};
    }

    // Closures for the 9-key author bag. Data is captured at dispatch time;
    // renderAST accepts overrides for scope/data/isSVG but falls through to
    // the captured values — covers the common case where a block renders
    // branch content with the parent data context.
    const lookupExpression = (expression) => renderer.lookupExpression(expression, data);
    const renderAST = ({
      ast,
      scope: childScope = scope,
      data: childData = data,
      isSVG: childIsSVG = isSVG,
    } = {}) => renderer.readAST({ ast, scope: childScope, data: childData, isSVG: childIsSVG });

    const buildBag = (extra) => {
      const bag = { node, data, scope, region, isSVG, serverMeta, self, lookupExpression, renderAST };
      return extra ? Object.assign(bag, extra) : bag;
    };

    // Signal DOM change to the template's onUpdated lifecycle. Coalesced
    // via renderer.notifyUpdate's microtask gate — multiple hook runs in
    // the same tick fire onUpdated once.
    const onSuccess = () => {
      if (typeof renderer.notifyUpdate === 'function') {
        renderer.notifyUpdate();
      }
    };

    const handleThrow = (hookName, err, extra) => {
      reportBlockError(name, node, hookName, err);
      if (errorHook) {
        try {
          errorHook(buildBag({ hook: hookName, err, ...extra }));
        }
        catch (errorErr) {
          reportBlockError(name, node, 'error', errorErr);
          if (isDevelopment) { throw errorErr; }
        }
      }
      else {
        region.clear();
      }
    };

    // The region's anchor text node is stable across content swaps and
    // hydration — safe to use as the isConnected guard target.
    const reactionAnchor = region.anchor;

    scope.reaction(reactionAnchor, (comp) => {
      if (comp.firstRun) {
        const firstHook = hydrating && hydrate ? 'hydrate' : 'render';
        try {
          if (firstHook === 'hydrate') { hydrate(buildBag()); }
          else { render(buildBag()); }
          onSuccess();
        }
        catch (err) {
          if (firstHook === 'hydrate') {
            // Hydrate-throw fallthrough: server DOM is untrustworthy, clear
            // the region and try render() within the same reaction. Whatever
            // render() does then governs the reaction's fate — success
            // continues normally, throw disposes below.
            reportBlockError(name, node, 'hydrate', err);
            region.clear();
            try {
              render(buildBag());
              onSuccess();
            }
            catch (renderErr) {
              handleThrow('render', renderErr);
              comp.stop();
            }
          }
          else {
            handleThrow('render', err);
            comp.stop();
          }
        }
      }
      else {
        // Subsequent runs — update only. No silent fallback to render: authors
        // must write update() explicitly so the fresh-mount-vs-subsequent-run
        // asymmetry is visible. Blocks where they happen to coincide (e.g.,
        // rerender) alias update = render in their config.
        if (!update) { return; }
        try {
          update(buildBag());
          onSuccess();
        }
        catch (err) {
          handleThrow('update', err);
          comp.stop();
        }
      }
    }, {
      message: `${name}:${node.type}`,
      block: name,
      node,
    });

    scope.onDispose(() => {
      if (destroy) {
        try {
          destroy(buildBag());
        }
        catch (err) {
          reportBlockError(name, node, 'destroy', err);
          // Swallow — scope is disposing regardless; re-throwing would
          // strand sibling blocks mid-teardown.
        }
      }
      region.clear();
    });
  };

  // Static — evaluateText is called outside the reaction/region/self
  // lifecycle, from the raw-text walker. Receives dispatch-level context
  // only. Blocks not legal in raw-text contexts (async, rerender) omit it;
  // the walker errors if it encounters a block type without the static.
  if (evaluateText) {
    dispatch.evaluateText = evaluateText;
  }

  dispatch.definition = config;
  return dispatch;
}
