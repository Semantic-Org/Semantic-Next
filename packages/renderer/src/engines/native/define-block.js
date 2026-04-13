import { isTracing } from '../../helpers.js';

const EMOJI = '🔴';

// Best-effort template-syntax reconstruction for the error-log header.
// Forgiving — produces what it can rather than throwing on missing fields.
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

// Structured error log — opt-in via setTracing(true). Tree-shakes when off.
export function reportBlockError(blockName, node, hook, err) {
  if (!isTracing()) { return; }
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

export { nodeSyntax as _nodeSyntax };

export function defineBlock(config) {
  const { name, create, render, hydrate, update, destroy, error: errorHook, evaluateText } = config;

  const dispatch = function(ctx) {
    const { node, data, scope, region, isSVG, serverMeta, hydrating, renderer } = ctx;

    // create runs outside any reaction; without an error hook a throw
    // propagates so the bug is loud at mount.
    let self;
    if (create) {
      if (errorHook) {
        try {
          self = create(ctx) || {};
        }
        catch (err) {
          reportBlockError(name, node, 'create', err);
          return;
        }
      }
      else {
        self = create(ctx) || {};
      }
    }
    else {
      self = {};
    }

    const lookupExpression = (expression) => renderer.lookupExpression(expression, data);
    const renderAST = ({
      ast,
      scope: childScope = scope,
      data: childData = data,
      isSVG: childIsSVG = isSVG,
    } = {}) => renderer.readAST({ ast, scope: childScope, data: childData, isSVG: childIsSVG });
    const hydrateInnerContent = ({
      ownedNodes,
      innerAST,
      data: innerData = data,
      scope: innerScope = scope,
    } = {}) => renderer.hydrateInnerContent(ownedNodes, innerAST, innerData, innerScope);

    const buildBag = (extra) => {
      const bag = {
        node,
        data,
        scope,
        region,
        isSVG,
        serverMeta,
        self,
        lookupExpression,
        renderAST,
        hydrateInnerContent,
      };
      return extra ? Object.assign(bag, extra) : bag;
    };

    const onSuccess = () => {
      if (typeof renderer.notifyUpdate === 'function') {
        renderer.notifyUpdate();
      }
    };

    // Recovery is per-block. Blocks with an error hook get try/catch
    // wrapping; blocks without let throws propagate so failures are loud.
    const safeRun = errorHook
      ? (hookName, fn) => {
        try {
          fn();
          onSuccess();
        }
        catch (err) {
          reportBlockError(name, node, hookName, err);
          try {
            errorHook(buildBag({ hook: hookName, err }));
          }
          catch (errorErr) {
            reportBlockError(name, node, 'error', errorErr);
            throw errorErr;
          }
        }
      }
      : (_, fn) => {
        fn();
        onSuccess();
      };

    const reactionAnchor = region.anchor;

    scope.reaction(reactionAnchor, (comp) => {
      if (comp.firstRun) {
        const isHydrating = hydrating && hydrate;
        safeRun(isHydrating ? 'hydrate' : 'render', () => {
          if (isHydrating) { hydrate(buildBag()); }
          else { render(buildBag()); }
        });
      }
      else if (update) {
        safeRun('update', () => update(buildBag()));
      }
    }, {
      message: `${name}:${node.type}`,
      block: name,
      node,
    });

    scope.onDispose(() => {
      if (destroy) {
        // Destroy is always isolated — a throw here would strand sibling
        // cleanup. Loud console.error keeps it visible without tracing.
        try {
          destroy(buildBag());
        }
        catch (err) {
          console.error(`destroy threw in ${name} block:`, err);
        }
      }
      region.clear();
    });
  };

  if (evaluateText) {
    dispatch.evaluateText = evaluateText;
  }

  dispatch.definition = config;
  return dispatch;
}
