import { Reaction } from '@semantic-ui/reactivity';
import { isRecovery, isTracing } from '../../helpers.js';
import { isUnsafeHTML, makePlace, UNSAFE_HTML } from './commit-hooks.js';

// Sentinel for "no content placed yet" — distinct from any real value
// so the first compute write always commits.
const PLACE_INIT = Symbol('valueDispatch:init');

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
  // `kind: 'value'` opts into the lean dispatch in valueDispatch.js — for
  // blocks whose `compute` returns a primitive (or unsafeHTML wrapper, or
  // null) rather than an AST array. The renderer sees `dispatch.shape ===
  // 'value'` and skips the DynamicRegion allocation; the lean dispatch
  // manages its own anchor / ownedNodes pair without DR's full machinery.
  // Authoring shape is identical (defineBlock + compute + helpers via this).
  if (config.kind === 'value') {
    return makeValueDispatch(config);
  }

  // Read identity/diagnostic fields directly — they don't need `this`.
  // Hook fields (compute/render/update/hydrate/create/destroy/error) are
  // invoked as `config.X(bag)` below so `this === config` inside the hook,
  // letting authors stash helper methods on the same config object and
  // call them as `this.helperName(...)`. V8 inlines this via the monomorphic
  // inline cache on config's stable shape (config is constructed once at
  // module load and never mutated).
  const { name, shouldRecover, evaluateText, syntax } = config;
  const errorHook = config.error;
  const hasCompute = typeof config.compute === 'function';

  // When `compute` is provided, synthesize render and update as
  // `bag.place(compute(bag))`. Block authors who need direct lifecycle
  // control (each, async) provide explicit render/update instead and omit
  // compute. hydrate stays as the author wrote it — server-DOM adoption
  // has a distinct contract (no rebuild) that compute can't synthesize.
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

// Lean dispatch path for `kind: 'value'` blocks (currently: expression).
//
// What it elides vs. the regular dispatch (per-instance, hot):
//   • No DynamicRegion — the renderer skips the DR allocation entirely
//     (shape flag below). The anchor IS the single value text node in
//     the primitive case (no separate "positional" anchor), matching the
//     pre-unification bindTextExpression shape.
//   • No helper closures on the bag (lookupExpression / renderAST /
//     hydrateInnerContent / hydrateInto). Authors reach renderer methods
//     directly via the `renderer` bag field.
//   • No makePlace (no place/match/clearOwnedSiblings closures). The
//     Reaction body inlines the polymorphic write — primitive, unsafeHTML
//     wrapper, or null — against the dispatch-local anchor/ownedNodes.
//   • No safeRun wrapper. Tracing/recovery are not supported on value
//     blocks; authors who need them should use the region path.
//   • No notifyUpdate. Text-position expression writes never bubbled to
//     the host's `updated` lifecycle in the pre-unification path; preserve
//     that semantics here so coarsely-reactive subtemplates don't pay a
//     microtask per inner-expression update.
//   • No onDispose registration when there's no destroy hook. The Reaction
//     stops via scope.dispose; the text node either dies with its parent
//     (each-item removal, branch swap) or with the shadow root (unmount).
//
// What it preserves (so expression.js still reads like a defineBlock):
//   • `compute({ node, data, self, renderer })` returns a primitive,
//     `unsafeHTML(value)` wrapper, or null. Hook is called as
//     `compute.call(config, bag)` so `this === config` and helpers on the
//     config object are reachable as `this.helperName(...)`.
//   • `hydrate(bag)` adopts server DOM and returns `{ anchor, ownedNodes,
//     matched }`. `anchor` becomes the dispatch's reactive text node;
//     `ownedNodes` populates the unsafeHTML payload tracking; `matched`
//     primes lastContent so the first reactive re-fire dedups against it.
//   • `create(ctx)` returns `self` — same contract.
//   • `evaluateText` is forwarded for raw-text contexts (each / async fall
//     through to expression's evaluator when nested in a raw-text element).
function makeValueDispatch(config) {
  const create = config.create;
  const compute = config.compute;
  const hydrate = config.hydrate;

  function valueDispatch(ctx) {
    const { comment, node, data, scope, renderer, hydrating } = ctx;

    const self = create ? (create.call(config, ctx) || {}) : {};

    // Reusable bag — same hidden-class shape across firstRun and every
    // subsequent re-fire. comment is filled for the hydrate-call use case
    // and stays as a dead field on the update path (V8 hidden class is
    // shared either way).
    const bag = { node, data, self, renderer, comment };

    let anchor;
    let ownedNodes = null;
    let endAnchor = null;
    let lastContent = PLACE_INIT;

    if (hydrating && hydrate) {
      // Hydrate hook adopts server DOM and reports back the reactive node
      // identity. Wrap in Reaction.nonreactive so any signal reads inside
      // the hook (e.g. lookupExpression for serverValue splitting) don't
      // register on a parent block's outer Reaction — the per-expression
      // Reaction below registers fresh deps via firstRun.
      const adopted = Reaction.nonreactive(() => hydrate.call(config, bag));
      anchor = adopted.anchor;
      ownedNodes = adopted.ownedNodes || null;
      if (adopted.matched !== undefined) { lastContent = adopted.matched; }
    }
    else {
      anchor = document.createTextNode('');
      comment.parentNode.replaceChild(anchor, comment);
    }

    scope.reaction(anchor, (comp) => {
      // firstRun + hydrating: register Signal deps without overwriting the
      // server-trusted DOM. lastContent was primed from hydrate.matched.
      if (comp.firstRun && hydrating) {
        compute.call(config, bag);
        return;
      }
      const value = compute.call(config, bag);
      if (value === lastContent && !comp.firstRun) { return; }
      lastContent = value;

      // Inline polymorphic write — replaces the makePlace closure path.
      if (value == null) {
        if (ownedNodes !== null) {
          for (let i = 0; i < ownedNodes.length; i++) { ownedNodes[i].remove(); }
          ownedNodes = null;
          if (endAnchor) {
            endAnchor.remove();
            endAnchor = null;
          }
        }
        if (anchor.data !== '') { anchor.data = ''; }
        return;
      }

      if (isUnsafeHTML(value)) {
        // unsafeHTML — anchor stays empty, ownedNodes carry the parsed
        // siblings, endAnchor bounds the region for Template.isNodeInRange.
        if (ownedNodes !== null) {
          for (let i = 0; i < ownedNodes.length; i++) { ownedNodes[i].remove(); }
        }
        ownedNodes = null;
        if (anchor.data !== '') { anchor.data = ''; }
        const html = value[UNSAFE_HTML];
        const str = html == null ? '' : String(html);
        if (str) {
          const parsed = renderer.parseHTML(str);
          const nodes = [...parsed.childNodes];
          anchor.after(parsed);
          ownedNodes = nodes;
          if (!endAnchor) { endAnchor = document.createTextNode(''); }
          nodes[nodes.length - 1].after(endAnchor);
        }
        else if (endAnchor) {
          endAnchor.remove();
          endAnchor = null;
        }
        return;
      }

      // Primitive — write directly into the anchor text node. If we were
      // in unsafeHTML mode, clear owned siblings first.
      if (ownedNodes !== null) {
        for (let i = 0; i < ownedNodes.length; i++) { ownedNodes[i].remove(); }
        ownedNodes = null;
        if (endAnchor) {
          endAnchor.remove();
          endAnchor = null;
        }
      }
      const str = String(value);
      if (anchor.data !== str) { anchor.data = str; }
    }, { message: `${config.name}:${node.type}`, block: config.name, node });
  }

  if (config.evaluateText) {
    valueDispatch.evaluateText = (bag) => config.evaluateText(bag);
  }
  valueDispatch.definition = config;
  valueDispatch.shape = 'value';
  return valueDispatch;
}
