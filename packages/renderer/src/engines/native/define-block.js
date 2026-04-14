import { isRecovery, isTracing } from '../../helpers.js';

const NOOP = () => {};

// Structured error log — opt-in via setTracing(true). Tree-shakes when off.
// `syntax` is the block's own template-syntax representation (each block
// owns its formatting via the `syntax` config hook).
export function reportBlockError({ name, syntax, hook, err }) {
  if (!isTracing()) { return; }
  const header = syntax ? `[sui] ${name} ${syntax}` : `[sui] ${name}`;
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

export function defineBlock(config) {
  const { name, create, render, hydrate, update, destroy, error: errorHook, shouldRecover, evaluateText, syntax } =
    config;

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
          reportBlockError({ name, syntax: syntax?.(node), hook: 'create', err });
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

    // Hoisted once per block instance — the per-reaction hot path can't
    // afford a `typeof` hop, and `renderer.notifyUpdate` is a stable
    // bound arrow on Renderer, safe to call directly. Fallback is the
    // no-op case (some test renderers omit it).
    const notifyUpdate = renderer.notifyUpdate || NOOP;

    const isHydrating = hydrating && Boolean(hydrate);
    const reactionAnchor = region.anchor;
    const reactionContext = { message: `${name}:${node.type}`, block: name, node };

    // Two reaction-callback shapes, chosen at block-construction time.
    // The wantsRecovery branch keeps the try/catch + error-hook ceremony;
    // the no-recovery branch runs hooks directly and inlines onSuccess,
    // avoiding the ~N×M closure allocation per reaction invocation that
    // safeRun forced via `() => update(bag)` in the common case (visible
    // as ~10-15 ms of GC + indirection on update-10th / toggle-last).
    // Hook exceptions in the fast path propagate directly to
    // reaction.run's try/finally — same observable behavior as the
    // pre-decomposition renderer.
    let reactionCallback;
    if (wantsRecovery) {
      const safeRun = (hookName, fn, comp) => {
        try {
          fn();
          notifyUpdate();
        }
        catch (err) {
          reportBlockError({ name, syntax: syntax?.(node), hook: hookName, err });
          if (errorHook) {
            bag.hook = hookName;
            bag.err = err;
            try {
              errorHook(bag);
            }
            catch (errorErr) {
              reportBlockError({ name, syntax: syntax?.(node), hook: 'error', err: errorErr });
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
      };
      reactionCallback = (comp) => {
        if (comp.firstRun) {
          safeRun(isHydrating ? 'hydrate' : 'render', () => {
            if (isHydrating) { hydrate(bag); }
            else if (render) { render(bag); }
          }, comp);
        }
        else if (update) {
          safeRun('update', () => update(bag), comp);
        }
      };
    }
    else {
      reactionCallback = (comp) => {
        if (comp.firstRun) {
          if (isHydrating) { hydrate(bag); }
          else if (render) { render(bag); }
          notifyUpdate();
        }
        else if (update) {
          update(bag);
          notifyUpdate();
        }
      };
    }

    scope.reaction(reactionAnchor, reactionCallback, reactionContext);

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
