import { isRecovery, isTracing } from '../../helpers.js';
import { makePlace } from './commit-hooks.js';

// Block-author helper: create a child data context that inherits from
// `parent` via the prototype chain, with `extras` layered on as own
// properties. Use when a block renders inner content with the parent
// context plus a few additional keys (sample/async/each).
//
// Why prototype-chain inheritance (not spread): block data contexts
// can themselves be lazy-getter records (subtemplate / snippet args
// via buildArgsRecord). A spread `{ ...data, extras }` invokes any
// getters and snapshots their values, losing reactivity for parent
// reads inside the inner content. Object.create preserves those
// getters: child reads inherited keys live, source-signal deps
// register on whichever Reaction is running.
//
// Exported for server.js (SSR has no bag) and provided through the
// block bag (`bag.childContext`) so registered blocks don't need to
// import it.
export function childContext(parent, extras) {
  const child = Object.create(parent);
  if (extras) { Object.assign(child, extras); }
  return child;
}

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
  const {
    name,
    create,
    hydrate,
    destroy,
    error: errorHook,
    shouldRecover,
    evaluateText,
    syntax,
    compute,
  } = config;

  // When `compute` is provided, synthesize render and update as
  // `bag.place(compute(bag))`. Block authors who need direct lifecycle
  // control (each, async) provide explicit render/update instead and omit
  // compute. hydrate stays as the author wrote it — server-DOM adoption
  // has a distinct contract (no rebuild) that compute can't synthesize.
  const render = compute
    ? (bag) => bag.place(compute(bag))
    : config.render;
  const update = compute
    ? (bag) => bag.place(compute(bag))
    : config.update;

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
    } = {}) => renderer.hydrateInnerContent({ ownedNodes, innerAST, data: innerData, scope: innerScope });
    const hydrateInto = ({
      innerAST,
      data: innerData = data,
      scope: innerScope = scope,
      asChild,
    } = {}) => renderer.hydrateInto({ region, innerAST, data: innerData, scope: innerScope, asChild });

    // place is the text-position placement primitive: takes an AST array
    // (or null to clear) and handles child-scope allocation + renderAST +
    // region.setContent with reference-equality dedup. Blocks using
    // `compute` reach bag.place implicitly; blocks with explicit
    // render/update can use it to collapse the rebuild boilerplate. match
    // is the internal counterpart — defineBlock calls it with hydrate's
    // return value (when non-undefined) so the first post-hydrate update
    // dedups instead of overwriting server DOM.
    const { place, match: matchPlace } = makePlace({ region, scope, renderer, data, isSVG });

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
      hydrateInto,
      childContext,
      place,
      hook: null,
      err: null,
    };

    const onSuccess = () => {
      if (typeof renderer.notifyUpdate === 'function') {
        renderer.notifyUpdate();
      }
    };

    // Recovery wraps each hook in try/catch. Without recovery, throws
    // propagate so failures are loud — the browser logs uncaught errors
    // with full stack, no extra wrapping needed. With recovery + errorHook:
    // hook decides what to render. With recovery alone (global flag, no
    // hook): default-isolate via region.clear() + reaction stop.
    const safeRun = wantsRecovery
      ? (hookName, fn, comp) => {
        try {
          fn();
          onSuccess();
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
      }
      : (_hookName, fn) => {
        fn();
        onSuccess();
      };

    const reactionAnchor = region.anchor;

    scope.reaction(reactionAnchor, (comp) => {
      if (comp.firstRun) {
        const isHydrating = hydrating && hydrate;
        safeRun(isHydrating ? 'hydrate' : 'render', () => {
          if (isHydrating) {
            // hydrate returns the AST that matches the server-rendered
            // DOM (when applicable). Records the match on `place` so the
            // first compute-driven update tick dedups instead of
            // re-rendering over server bytes. Returning undefined is the
            // backward-compatible no-op for blocks (each, async, etc.)
            // that don't use compute / don't need the match hook.
            const matched = hydrate(bag);
            if (matched !== undefined) { matchPlace(matched); }
          }
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
