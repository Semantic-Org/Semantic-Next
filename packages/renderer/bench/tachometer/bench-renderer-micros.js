/*
  Renderer hot-path micros. Per-file isolation benches that catch
  sub-noise-floor regressions on PRs touching renderer hot paths
  (expression-evaluator, build-html-string, dom-walker). The macro suite
  shifts only 2-3% on a 20% regression in these files — below the
  resolution floor. Per-file micros surface those.

  Workloads use realistic data shapes (component-shaped data context with
  Signals, helper set mirroring the templating package) so V8 sees the
  same object shapes the production renderer sees.
*/

import { TemplateCompiler } from '@semantic-ui/compiler';
import { Signal } from '@semantic-ui/reactivity';
import { buildHTMLString, ExpressionEvaluator, Renderer } from '@semantic-ui/renderer';

// Aggressive major collect that reclaims old-space sizing, not just live garbage,
// so the next op measures on a freed heap. last-resort is krausest's flavor. The
// plain gc() fallback covers setups that lack it.
function settle() {
  if (globalThis.gc) {
    try {
      globalThis.gc({ type: 'major', execution: 'sync', flavor: 'last-resort' });
    }
    catch {
      globalThis.gc();
    }
  }
}

// Mark, run, and measure one op. The collect leads the marks so the op measures on
// a freed heap. Because it leads, the previous op's teardown (plain code after its
// call) has already run and is reclaimable.
async function measureOp(name, run) {
  settle();
  performance.mark(`${name}-start`);
  const result = run();
  if (result?.then) { await result; }
  performance.measure(name, `${name}-start`);
}

/*******************************
      Fixtures
*******************************/

// Helper set — mirrors a representative slice of the templating package's
// runtime helpers. Same shape that production templates have access to.
const helpers = {
  exists(a) {
    return a != null && a !== '';
  },
  isEmpty(a) {
    return a == null || a === '' || (Array.isArray(a) && a.length === 0);
  },
  not(a) {
    return !a;
  },
  is(a, b) {
    return a == b;
  },
  concat(...args) {
    return args.join('');
  },
  classIf(expr, trueClass = '', falseClass = '') {
    return expr ? `${trueClass} ` : falseClass ? `${falseClass} ` : '';
  },
  maybe(expr, a, b) {
    return expr ? a : b;
  },
  capitalize(s) {
    return s ? s[0].toUpperCase() + s.slice(1) : '';
  },
  activeIf(expr) {
    return expr ? 'active' : '';
  },
  classMap(obj) {
    return Object.entries(obj).filter(([, v]) => v).map(([k]) => k).join(' ');
  },
  isClient: true,
  isServer: false,
};

// Data context shape with Signals for state — production reality. Settings
// are plain values, state is Signal-wrapped, computed are functions.
const data = {
  type: 'button',
  variant: 'primary',
  size: 'medium',
  disabled: false,
  icon: 'check',
  label: 'Submit',
  classes: 'ui primary button',
  count: new Signal(42),
  value: new Signal(1),
  isOpen: new Signal(false),
  isTrue: new Signal(true),
  isActive: new Signal(true),
  fruit: new Signal('cherry'),
  items: new Signal(['one', 'two', 'three']),
  user: { name: new Signal('Jack'), role: 'admin', settings: { theme: 'dark' } },
};

/*******************************
      Expression evaluator
*******************************/

// The expression-evaluator metrics call `evaluator.evaluate(...)` and
// discard the return value. V8 cannot DCE the call because `evaluate`
// has observable side effects (cache writes, dependency tracking via
// the bound Reaction). The discard is safe and intentional — what we're
// timing is dispatch + cache + parse, not what we'd do with the result.

// expr-simple-100k — property-lookup hot path. Production
// distribution puts ~79% of expression evaluations here (60% simple
// identifier, ~21% dotted path). Two evaluations per iteration covers
// both shapes with the same instance + cache state.
{
  const evaluator = new ExpressionEvaluator({ data, helpers });
  // purpose: Evaluates one simple identifier and one dotted path 100000 times each. Property-lookup hot path.
  await measureOp('expr-simple-100k', () => {
    for (let i = 0; i < 100_000; i++) {
      evaluator.evaluate('count', data);
      evaluator.evaluate('user.name', data);
    }
  });
}

// expr-lisp-50k — Lisp-style helper invocation. Production
// distribution puts ~19% of evaluations here. Each call goes through
// parse-cache lookup + helper dispatch.
{
  const evaluator = new ExpressionEvaluator({ data, helpers });
  // purpose: Evaluates one Lisp-style helper call 50000 times. Parse-cache lookup and helper dispatch.
  await measureOp('expr-lisp-50k', () => {
    for (let i = 0; i < 50_000; i++) {
      evaluator.evaluate("classIf isActive 'active'", data);
    }
  });
}

// expr-js-10k — JS expression eval via new Function + Proxy.
// Production distribution puts ~2% of evaluations here, but the per-call
// cost is high enough that it's worth isolating — a regression that
// rebuilds the function per call would be invisible in macro suites.
{
  const evaluator = new ExpressionEvaluator({ data, helpers });
  // purpose: Evaluates one arithmetic expression and one ternary 10000 times each. JS-eval hot path.
  await measureOp('expr-js-10k', () => {
    for (let i = 0; i < 10_000; i++) {
      evaluator.evaluate('count + 1', data);
      evaluator.evaluate("isOpen ? 'open' : 'closed'", data);
    }
  });
}

/*******************************
      buildHTMLString throughput
*******************************/

// Realistic leaf-component shape — header/body/footer with attributes,
// mixed static + dynamic text, an interpolated class, and a boolean attr
// binding. Class names follow the repo's semantic / role-based
// convention. Same AST every iter so the measurement isolates HTML
// assembly cost.
{
  const buildHTMLStringTemplate = `<div class="card {activeIf isActive}" data-id="{id}">
    <header class="header"><h2 class="title">{title}</h2><span class="badge">{count}</span></header>
    <section class="body"><p class="description">{description}</p></section>
    <footer class="footer"><button class="action" disabled={busy}>{label}</button></footer>
  </div>`;
  const buildHTMLStringAST = new TemplateCompiler(buildHTMLStringTemplate).compile();

  // purpose: Builds the HTML string for a realistic card AST 10000 times. Raw assembly throughput.
  await measureOp('build-html-string-10k', () => {
    for (let i = 0; i < 10_000; i++) {
      buildHTMLString(buildHTMLStringAST);
    }
  });
}

/*******************************
      DOM walker (bindMarkers)
*******************************/

// Realistic flat tree of 100 cards — ~1000 elements, ~600 comments,
// ~1000 marker entries (mixed attribute, property, event, and text
// expressions). No block markers: the each-block path recurses into
// child renders, which would dominate the measurement and bury the
// TreeWalker pass cost we want to isolate. Fixture setup (compile,
// build HTML string, parse, clone) lives outside the timed window —
// each iter consumes a virgin fragment so bindMarkers' DOM mutations
// (replace comment markers, strip property/event attrs) don't poison
// the next pass.
//
// This block reaches into renderer internals on purpose (`bindMarkers`,
// `parseHTML`, `buildHTMLString`). That coupling is the bench. If those
// methods get renamed or their signatures change, this bench needs to
// follow — there is no public API that exposes the same isolation.
{
  let cardRows = '';
  for (let i = 0; i < 100; i++) {
    cardRows += `
      <article class="card" data-id="{id}" .index={i}>
        <header class="header">
          <h3 class="title">{title}</h3>
          <span class="subtitle">{subtitle}</span>
        </header>
        <div class="body">
          <p class="description">{lead}</p>
          <span class="tag">{metaA}</span>
          <span class="status">{metaB}</span>
        </div>
        <footer class="footer">
          <button class="action" .disabled={disabled} @click={onClick}>{label}</button>
        </footer>
      </article>
    `;
  }
  const domWalkerAST = new TemplateCompiler(`<section class="grid">${cardRows}</section>`).compile();
  const domWalkerData = {
    id: 'x',
    i: 0,
    title: 't',
    subtitle: 's',
    lead: 'l',
    metaA: 'a',
    metaB: 'b',
    disabled: false,
    onClick: () => {},
    label: 'Go',
  };

  // Pre-build per-iter fragments + renderers. Each renderer owns its
  // own ReactionScope — bindMarkers wires Reactions into scope, and a
  // shared scope would accumulate ~15 generations of stale Reactions
  // across the timed loop, distorting later iterations.
  //
  // REPS=15 looks small but lands at ~90ms in chromium smoke
  // (1000-node tree × 15 walks) — comfortably above the σ-floor.
  // Don't lower without re-checking; don't raise without reason.
  const REPS = 15;
  const domWalkerFragments = new Array(REPS);
  const domWalkerRenderers = new Array(REPS);
  for (let r = 0; r < REPS; r++) {
    const renderer = new Renderer({ ast: domWalkerAST, data: domWalkerData });
    const { htmlString } = renderer.buildHTMLString(domWalkerAST, false);
    domWalkerFragments[r] = renderer.parseHTML(htmlString, false);
    domWalkerRenderers[r] = renderer;
  }
  // Entries shape is shared across iterations — the cached buildHTMLString
  // returns the same { entries } reference for the same AST.
  const { entries: domWalkerEntries } = domWalkerRenderers[0].buildHTMLString(domWalkerAST, false);

  // purpose: Runs bindMarkers across a 1000-node card fragment 15 times. TreeWalker pass and binding dispatch.
  await measureOp('dom-walker-1000x15', () => {
    for (let r = 0; r < REPS; r++) {
      const renderer = domWalkerRenderers[r];
      renderer.bindMarkers(domWalkerFragments[r], domWalkerEntries, domWalkerData, renderer.scope, domWalkerAST);
    }
  });
}

/*******************************
      Results
*******************************/

performance.getEntriesByType('measure')
  .forEach((m) => console.log(`${m.name}: ${m.duration.toFixed(3)}ms`));
