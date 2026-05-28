import { nonreactive, reaction } from '@semantic-ui/reactivity';
import { isRecovery, isTracing, unwrap } from '../../helpers.js';
import { makePlace, UNSAFE_HTML } from './commit-hooks.js';

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
  if (typeof config.compute === 'function' && (config.render || config.update)) {
    throw new Error(
      `Block "${config.name}" defines both 'compute' and 'render'/'update' — pick one shape.`,
    );
  }

  // `type: 'value'` selects the lean dispatch (see defineValueBlock
  // below). The renderer reads `dispatch.type === 'value'` and skips
  // DynamicRegion allocation.
  if (config.type === 'value') {
    return defineValueBlock(config);
  }

  // Hooks (compute/render/update/hydrate/create/destroy/error) are invoked
  // as `config.X(bag)` so `this === config` — authors stash helper methods
  // on the same config object and reach them as `this.helperName(...)`.
  const { name, shouldRecover, evaluateText, syntax } = config;
  const errorHook = config.error;
  const hasCompute = typeof config.compute === 'function';

  // compute is sugar for `bag.place(compute(bag))` on both render and
  // update. Authors needing explicit lifecycle (each, async) supply
  // render/update instead and omit compute.
  const render = hasCompute
    ? (bag) => bag.place(config.compute(bag))
    : config.render && ((bag) => config.render(bag));
  const update = hasCompute
    ? (bag) => bag.place(config.compute(bag))
    : config.update && ((bag) => config.update(bag));
  const hydrate = config.hydrate && ((bag) => config.hydrate(bag));
  const create = config.create && ((ctx) => config.create(ctx));
  const destroy = config.destroy && ((bag) => config.destroy(bag));

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

    // place(astOrNull) commits to the region with reference-equality dedup.
    // matchPlace records hydrate's return so the first post-hydrate tick
    // dedups against server DOM instead of re-rendering over it.
    const { place, match: matchPlace } = makePlace({ region, scope, renderer, data, isSVG });

    // hook/err pre-allocated so the error path is field writes, not an
    // Object.assign extension.
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

    // notifyUpdate signals "post-mount reactive DOM change" to the host —
    // initial render uses the `rendered` lifecycle and shouldn't fire it.
    // Pass suppressNotify on the firstRun call sites to skip.
    const onSuccess = (suppressNotify) => {
      if (suppressNotify) { return; }
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
      ? (hookName, fn, comp, suppressNotify) => {
        try {
          fn();
          onSuccess(suppressNotify);
        }
        catch (err) {
          reportBlockError({ name, syntax: syntax?.(node), hook: hookName, err });
          if (errorHook) {
            bag.hook = hookName;
            bag.err = err;
            try {
              config.error(bag);
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
      : (_hookName, fn, _comp, suppressNotify) => {
        fn();
        onSuccess(suppressNotify);
      };

    const reactionAnchor = region.anchor;

    scope.reaction(reactionAnchor, (comp) => {
      if (comp.firstRun) {
        const isHydrating = hydrating && hydrate;
        safeRun(
          isHydrating ? 'hydrate' : 'render',
          () => {
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
          },
          comp,
          /* suppressNotify */ true,
        );
      }
      else if (update) {
        safeRun('update', () => update(bag), comp, /* suppressNotify */ false);
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
    // Wrap so `this === config` inside evaluateText, matching the other
    // hooks. Block authors can call `this.helperName(...)` to reach
    // helpers defined on the same config object.
    dispatch.evaluateText = (bag) => config.evaluateText(bag);
  }

  dispatch.definition = config;
  return dispatch;
}

// shared commit fn for text-value dispatches
function commitText(state, comp) {
  if (comp.firstRun && state.hydrating) {
    state.compute(state);
    return;
  }
  state.anchor.data = unwrap(state.compute(state)) ?? '';
}

// mutable fields (ownedNodes, endAnchor) live on state so re-fires can update them
function commitUnsafeHTML(state, comp) {
  if (comp.firstRun && state.hydrating) {
    state.compute(state);
    return;
  }
  const value = state.compute(state);
  if (state.ownedNodes !== null) {
    for (let i = 0; i < state.ownedNodes.length; i++) { state.ownedNodes[i].remove(); }
  }
  state.ownedNodes = null;
  const html = value == null || value[UNSAFE_HTML] == null
    ? ''
    : String(value[UNSAFE_HTML]);
  if (html) {
    const parsed = state.renderer.parseHTML(html);
    const nodes = [...parsed.childNodes];
    // Doctype/comment-only inputs strip to an empty fragment when parsed
    // into a <template>. Skip the insert + endAnchor wiring rather than
    // dereferencing nodes[-1].
    if (nodes.length) {
      state.anchor.after(parsed);
      state.ownedNodes = nodes;
      if (!state.endAnchor) { state.endAnchor = document.createTextNode(''); }
      nodes[nodes.length - 1].after(state.endAnchor);
      return;
    }
  }
  if (state.endAnchor) {
    state.endAnchor.remove();
    state.endAnchor = null;
  }
}

// Lean dispatch for `type: 'value'` blocks (currently: expression).
// Compute returns a primitive, an `unsafeHTML(value)` wrapper, or null.
// The dispatch owns a single anchor text node and skips DynamicRegion +
// safeRun + notifyUpdate. Config hooks:
//   • compute(state) — called as state.compute(state); no `this` binding.
//     state = { compute, node, data, renderer, anchor, hydrating, self,
//     ownedNodes, endAnchor }. Returns the value to commit.
//   • hydrate(state) — called as hydrate.call(config, state); `this ===
//     config`. state adds `comment`. Returns { anchor, ownedNodes }.
//   • create(ctx) — returns `self`, reached as state.self.
//   • evaluateText — forwarded for raw-text contexts.
//   • static(node) — when truthy, skip Reaction wiring; write once.
function defineValueBlock(config) {
  const create = config.create;
  const compute = config.compute;
  const hydrate = config.hydrate;
  const isStatic = config.static;

  const dispatch = function(ctx) {
    const { comment, node, data, scope, renderer, hydrating } = ctx;

    // self stays null when there's no `create` hook — skips the empty-obj
    // allocation. Authors who do declare `create` get its return value
    // through `state.self` (compute reads state directly).
    const self = create ? (create.call(config, ctx) || null) : null;
    const staticValue = isStatic ? isStatic(node) : false;

    let anchor;
    let ownedNodes = null;

    if (hydrating && hydrate) {
      // Hydrate gets its own state with a `comment` field for the
      // adoption logic. `this === config` inside the hook so authors
      // reach config helpers via `this.X(...)`.
      const hydrateState = {
        compute,
        node,
        data,
        renderer,
        anchor: null,
        hydrating: true,
        self,
        ownedNodes: null,
        endAnchor: null,
        comment,
      };
      const adopted = nonreactive(() => hydrate.call(config, hydrateState));
      anchor = adopted.anchor;
      ownedNodes = adopted.ownedNodes || null;
    }
    else {
      anchor = document.createTextNode('');
      comment.parentNode.replaceChild(anchor, comment);
    }

    const state = {
      compute,
      node,
      data,
      renderer,
      anchor,
      hydrating,
      self,
      ownedNodes,
      endAnchor: null,
    };

    // Static dispatches skip Reaction wiring. Hydration is a no-op —
    // the adopted text node already carries the server-rendered value.
    if (staticValue) {
      if (!hydrating) {
        anchor.data = String(compute(state) ?? '');
      }
      return;
    }

    const commit = node.unsafeHTML ? commitUnsafeHTML : commitText;
    scope.track(reaction((comp) => {
      if (!comp.firstRun && !anchor.isConnected) {
        comp.stop();
        return;
      }
      commit(state, comp);
    }));
  };

  if (config.evaluateText) {
    dispatch.evaluateText = (bag) => config.evaluateText(bag);
  }
  dispatch.definition = config;
  dispatch.type = 'value';
  return dispatch;
}
