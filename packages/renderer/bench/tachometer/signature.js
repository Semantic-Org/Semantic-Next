/*

  Signature convention micro-benchmark.

  Drives the step-1 decision from ai/plans/native-renderer-blocks.md:
  does renderAST({ ast, scope, data }) destructured cost measurably more
  than renderAST(ast, scope, data) positional on hot-path call counts?

  Strategy: measure call-site overhead for both signatures in a tight loop
  sized to simulate a 1000-item each-loop render (~1M renderAST calls).
  The two functions do identical trivial work so the delta isolates the
  signature cost (argument binding, destructure, escape analysis) from any
  renderer work. Tachometer's same-session round-robin produces a
  statistically significant confidence interval for the delta.

  Interpretation: if tachometer reports the destructured variant as "unsure"
  or the confidence intervals overlap zero, consistency wins and destructured
  stands. If tachometer reports "slower" with non-overlapping CI, the
  signature convention revises to adopt hot-path-positional.

*/

// eslint-disable-next-line no-unused-vars
function renderASTDestructured({ ast, scope, data, isSVG = false } = {}) {
  // Trivial work representative of readAST's entry-line access pattern.
  // Touch every destructured arg so V8 can't eliminate them.
  let n = ast.length;
  if (isSVG) { n++; }
  if (scope) { n++; }
  if (data) { n++; }
  return n;
}

function renderASTPositional(ast, scope, data, isSVG = false) {
  let n = ast.length;
  if (isSVG) { n++; }
  if (scope) { n++; }
  if (data) { n++; }
  return n;
}

// Representative inputs — mirror real AST / scope / data shapes so V8
// sees consistent object shapes across iterations (monomorphic call sites).
const ast = Array.from({ length: 100 }, (_, i) => ({ type: 'text', value: `node ${i}` }));
const scope = { track: () => {}, children: [], reactions: [] };
const data = { count: 42, label: 'hi', items: [1, 2, 3], active: true };

// ~1M calls — simulates a 1000-item each-loop that calls renderAST ~1000×
// per render, scaled up for statistical stability. Matches the order of
// magnitude a real render produces over a burst of reactive updates.
const ITERS = 1_000_000;

function waitForFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

async function run() {
  // Warm up JIT. Interleave both variants so V8 tiers them together.
  let warmup = 0;
  for (let i = 0; i < 200_000; i++) {
    warmup += renderASTDestructured({ ast, scope, data, isSVG: false });
    warmup += renderASTPositional(ast, scope, data, false);
  }
  // Prevent warmup from being dead-code-eliminated.
  window.__warmup = warmup;

  await waitForFrame();

  // Destructured variant
  {
    let total = 0;
    performance.mark('destructured-start');
    for (let i = 0; i < ITERS; i++) {
      total += renderASTDestructured({ ast, scope, data, isSVG: false });
    }
    performance.measure('destructured', 'destructured-start');
    window.__destructuredTotal = total;
  }

  await waitForFrame();

  // Positional variant
  {
    let total = 0;
    performance.mark('positional-start');
    for (let i = 0; i < ITERS; i++) {
      total += renderASTPositional(ast, scope, data, false);
    }
    performance.measure('positional', 'positional-start');
    window.__positionalTotal = total;
  }
}

run();
