import { isRecovery, isTracing } from '../../helpers.js';

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

export { nodeSyntax };

// Always-on breadcrumb. Fires once per (block, component) pair so a
// visibly broken region in a 1000-item list doesn't spam 1000 logs —
// dedup is the whole point. Component identity uses element.localName
// so cross-instance breadcrumbs collapse.
const announcedErrors = new Set();

function announceBlockError(blockName, componentName, node, hookName, err) {
  const key = `${blockName}:${componentName || '?'}`;
  if (announcedErrors.has(key)) { return; }
  announcedErrors.add(key);
  const syntax = nodeSyntax(node);
  const where = componentName ? `<${componentName}>` : 'render tree';
  const msg = err?.message ?? String(err);
  console.error(
    `[sui] ${syntax} threw in ${where} (${hookName}): ${msg}. `
      + `Call setTracing(true) for full context.`,
  );
}

export function defineBlock(config) {
  const { name, create, render, hydrate, update, destroy, error: errorHook, shouldRecover, evaluateText } = config;

  const dispatch = function(ctx) {
    const { node, data, scope, region, isSVG, serverMeta, hydrating, renderer } = ctx;

    // Recovery is on when the global flag forces it OR when the block has
    // an error hook and (optionally) shouldRecover(node) returns true. The
    // shouldRecover gate lets blocks skip wrapping for AST shapes that
    // can't usefully recover (e.g., async with no errorContent).
    const wantsRecovery = isRecovery()
      || (errorHook && (!shouldRecover || shouldRecover(node)));

    let self;
    if (create) {
      if (wantsRecovery) {
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

    // Interned per-instance bag — same hidden-class shape across all hook
    // calls. hook/err keys are present from construction so the error-hook
    // extension is just two field writes, not an Object.assign.
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
      hook: null,
      err: null,
    };

    const onSuccess = () => {
      if (typeof renderer.notifyUpdate === 'function') {
        renderer.notifyUpdate();
      }
    };

    // Recovery wraps each hook in try/catch. Without recovery, throws
    // propagate so failures are loud. With recovery + errorHook: hook
    // decides what to render. With recovery alone (global flag, no hook):
    // default-isolate via region.clear() + reaction stop.
    const componentName = renderer.template?.element?.localName;

    const safeRun = wantsRecovery
      ? (hookName, fn, comp) => {
        try {
          fn();
          onSuccess();
        }
        catch (err) {
          reportBlockError(name, node, hookName, err);
          if (errorHook) {
            bag.hook = hookName;
            bag.err = err;
            try {
              errorHook(bag);
            }
            catch (errorErr) {
              reportBlockError(name, node, 'error', errorErr);
              throw errorErr;
            }
            finally {
              bag.hook = null;
              bag.err = null;
            }
          }
          else {
            region.clear();
            comp?.stop();
          }
        }
      }
      : (hookName, fn) => {
        try {
          fn();
          onSuccess();
        }
        catch (err) {
          announceBlockError(name, componentName, node, hookName, err);
          throw err;
        }
      };

    const reactionAnchor = region.anchor;

    scope.reaction(reactionAnchor, (comp) => {
      if (comp.firstRun) {
        const isHydrating = hydrating && hydrate;
        safeRun(isHydrating ? 'hydrate' : 'render', () => {
          if (isHydrating) { hydrate(bag); }
          else { render(bag); }
        }, comp);
      }
      else if (update) {
        safeRun('update', () => update(bag), comp);
      }
    }, {
      message: `${name}:${node.type}`,
      block: name,
      node,
    });

    scope.onDispose(() => {
      // Destroy throws propagate. Stranding sibling cleanup is the trade-
      // off — silent recovery hides destroy bugs harder than DOM leaks do.
      if (destroy) { destroy(bag); }
      region.clear();
    });
  };

  if (evaluateText) {
    dispatch.evaluateText = evaluateText;
  }

  dispatch.definition = config;
  return dispatch;
}
