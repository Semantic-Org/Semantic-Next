import * as reactivity from '@semantic-ui/reactivity';

// Compat shim: bench harness is pinned to main and runs against both this-change
// (PR source) and tip-of-tree (main source). The functional-surface PR removes
// the Reaction.X / Signal.computed statics, so we resolve to the module-level
// helpers when present and fall back to the class statics otherwise. Drop once
// the migration lands and main no longer needs the fallback.
const { Reaction, Signal } = reactivity;
const reaction = reactivity.reaction ?? ((callback, options) => Reaction.create(callback, options));
const flush = reactivity.flush ?? (() => Reaction.flush());
const computed = reactivity.computed ?? ((fn, options) => Signal.computed(fn, options));

const startMark = (name) => `${name}-start`;

/*******************************
      Fixtures
*******************************/

const makeRecords = (n) => {
  const out = new Array(n);
  for (let i = 0; i < n; i++) {
    out[i] = {
      id: `rec-${i}`,
      name: `Record ${i}`,
      active: i % 3 !== 0,
      tags: ['a', 'b'],
    };
  }
  return out;
};

const makeDoc = () => ({
  title: 'Untitled',
  meta: { author: 'anon', created: 0, updated: 0, tags: ['draft'] },
  settings: { theme: 'light', fontSize: 14, autosave: true },
  body: { blocks: ['intro', 'body', 'outro'], wordCount: 0 },
});

let sink = null;

/*******************************
      Primitive Signal hot paths
      (placed first to isolate from
       cross-bench heap/JIT state)
*******************************/

// set-same-10m — exercises the equality short-circuit. With no
// subscribers attached, set(same) collapses to an equality check + early
// return. V8 JIT inlines aggressively here (each set is ~8ns), so 10M
// iterations are needed to land above the σ-floor. A regression that
// bypasses the short-circuit (e.g., always-notify) inflates the per-set
// cost an order of magnitude and lights up immediately.
{
  const sig = new Signal(42);
  // purpose: Sets a signal to its current value 10000000 times. Exercises the no-op fast path when nothing changes.
  performance.mark(startMark('set-same-10m'));
  for (let i = 0; i < 10_000_000; i++) {
    sig.set(42);
  }
  performance.measure('set-same-10m', startMark('set-same-10m'));
}

// sub-unsub-100k — measures the per-create/per-destroy cost of a
// subscriber that reads one signal. Components with frequent mount/unmount
// (modal dialogs, list virtualization, route transitions) hit this path
// continuously. 100k cycles to clear the σ-floor at ~340ns/cycle.
{
  const sig = new Signal(0);
  // purpose: Creates and tears down a subscriber on one signal across 100000 cycles. Subscription churn cost.
  performance.mark(startMark('sub-unsub-100k'));
  for (let i = 0; i < 100_000; i++) {
    const r = reaction(() => {
      sink = sig.get();
    });
    r.stop();
  }
  performance.measure('sub-unsub-100k', startMark('sub-unsub-100k'));
}

/*******************************
      Reactive machinery
*******************************/

// reactive-fanout-500x1200
{
  const sig = new Signal(0);
  const reactions = new Array(500);
  for (let i = 0; i < 500; i++) {
    reactions[i] = reaction(() => {
      sink = sig.get();
    });
  }
  // purpose: Fans out one signal's value change to 500 subscribers across 1200 successive updates.
  performance.mark(startMark('reactive-fanout-500x1200'));
  for (let i = 0; i < 1200; i++) {
    sig.set(i + 1);
    flush();
  }
  performance.measure('reactive-fanout-500x1200', startMark('reactive-fanout-500x1200'));
  for (let i = 0; i < 500; i++) { reactions[i].stop(); }
}

// computed-chain-10x60k — doubled outer iterations (30k → 60k)
// after the 30k run showed run-to-run boundary variance.
{
  const root = new Signal(0);
  const chain = [root];
  for (let i = 0; i < 10; i++) {
    const prev = chain[chain.length - 1];
    chain.push(prev.derive(v => v + 1));
  }
  const end = chain[chain.length - 1];
  const observer = reaction(() => {
    sink = end.get();
  });
  // purpose: Propagates a value change from root to leaf through a 10-deep chain of derived signals 60000 times.
  performance.mark(startMark('computed-chain-10x60k'));
  for (let i = 0; i < 60_000; i++) {
    root.set(i + 1);
    flush();
  }
  performance.measure('computed-chain-10x60k', startMark('computed-chain-10x60k'));
  observer.stop();
}

// reactive-multi-read-5x160k — doubled outer iterations (16k → 32k,
// so 5 signals × 32k = 160k total flushes) after the 80k variant showed
// run-to-run boundary variance.
{
  const sigs = [new Signal(0), new Signal(0), new Signal(0), new Signal(0), new Signal(0)];
  const r = reaction(() => {
    sink = sigs[0].get() + sigs[1].get() + sigs[2].get() + sigs[3].get() + sigs[4].get();
  });
  // purpose: Changes five signals in turn for 32000 rounds with one subscriber reading all five.
  performance.mark(startMark('reactive-multi-read-5x160k'));
  for (let i = 0; i < 32_000; i++) {
    for (let j = 0; j < 5; j++) {
      sigs[j].set(i * 5 + j);
      flush();
    }
  }
  performance.measure('reactive-multi-read-5x160k', startMark('reactive-multi-read-5x160k'));
  r.stop();
}

/*******************************
      Large array-of-objects
*******************************/

// reactive-list-replace-1000x1000 — doubled iterations from 500
// to 1000 so the per-sample allocator/GC variance averages out.
// Previous 500-iter runs held Inconclusive (observed CI ~5-7× expected).
{
  const items = new Signal(makeRecords(1000));
  const r = reaction(() => {
    const list = items.get();
    let active = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].active) { active++; }
    }
    sink = active;
  });
  // purpose: Replaces a 1000-item list signal with a fresh 1000-item array and rescans it 1000 times.
  performance.mark(startMark('reactive-list-replace-1000x1000'));
  for (let i = 0; i < 1000; i++) {
    items.set(makeRecords(1000));
    flush();
  }
  performance.measure('reactive-list-replace-1000x1000', startMark('reactive-list-replace-1000x1000'));
  r.stop();
}

// reactive-list-filter-1000x300
{
  const items = new Signal(makeRecords(1000));
  const search = new Signal('');
  const r = reaction(() => {
    const list = items.get();
    const term = search.get();
    let count = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].name.includes(term)) { count++; }
    }
    sink = count;
  });
  // purpose: Changes a search-term signal 300 times, re-scanning a 1000-item list on each change.
  performance.mark(startMark('reactive-list-filter-1000x300'));
  for (let i = 0; i < 300; i++) {
    search.set(`q-${i}`);
    flush();
  }
  performance.measure('reactive-list-filter-1000x300', startMark('reactive-list-filter-1000x300'));
  r.stop();
}

/*******************************
      Helpers with subscriber
*******************************/

// reactive-push-2000x20 — doubled outer reset cycles from 1000
// to 2000 so each push op's cost is averaged across more iterations.
// Previous 1000-cycle run held at ±2.3% (Inconclusive at ±1% expected).
{
  const sig = new Signal([]);
  const r = reaction(() => {
    const list = sig.get();
    let count = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].active) { count++; }
    }
    sink = count;
  });
  // purpose: Appends 20 items onto an empty list signal with a subscriber, across 2000 reset cycles.
  performance.mark(startMark('reactive-push-2000x20'));
  for (let c = 0; c < 2000; c++) {
    sig.set([]);
    flush();
    for (let p = 0; p < 20; p++) {
      sig.push({ id: `rec-${p}`, name: `Record ${p}`, active: p % 3 !== 0, tags: ['a', 'b'] });
      flush();
    }
  }
  performance.measure('reactive-push-2000x20', startMark('reactive-push-2000x20'));
  r.stop();
}

// reactive-set-index-300
{
  const sig = new Signal(makeRecords(1000));
  const r = reaction(() => {
    const list = sig.get();
    let active = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].active) { active++; }
    }
    sink = active;
  });
  // purpose: Replaces one item by index in a 1000-item list signal across 300 updates, with a subscriber.
  performance.mark(startMark('reactive-set-index-300'));
  for (let i = 0; i < 300; i++) {
    sig.setIndex(i % 1000, {
      id: `rec-${i % 1000}`,
      name: `Record ${i}`,
      active: i % 2 === 0,
      tags: ['x'],
    });
    flush();
  }
  performance.measure('reactive-set-index-300', startMark('reactive-set-index-300'));
  r.stop();
}

// reactive-set-property-by-id-200 — alternating front/back averages N/2 scan.
// 100 iterations landed at ~113ms with observed CI ~2.5× expected (straddled
// ±2%); 200 doubles the workload to ~225ms so per-sample jitter becomes a
// smaller fraction of the total and the CI resolves.
{
  const sig = new Signal(makeRecords(1000));
  const r = reaction(() => {
    const list = sig.get();
    let active = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].active) { active++; }
    }
    sink = active;
  });
  const ids = new Array(200);
  for (let i = 0; i < 200; i++) {
    const idx = (i % 2 === 0) ? (i / 2) % 1000 : 999 - (((i - 1) / 2) % 1000);
    ids[i] = `rec-${idx}`;
  }
  // purpose: Finds an item by id and updates one field in a 1000-item list signal across 200 alternating updates.
  performance.mark(startMark('reactive-set-property-by-id-200'));
  for (let i = 0; i < 200; i++) {
    sig.setItemProperty(ids[i], 'active', i % 2 === 0);
    flush();
  }
  performance.measure('reactive-set-property-by-id-200', startMark('reactive-set-property-by-id-200'));
  r.stop();
}

/*******************************
      Mutate dirty-detection
      (no subscriber — isolates the
       clone-before / compare-after
       cost the proxy rewrite targets)
*******************************/

// mutate-grid-row-edit-600 — edits two fields of one row in a 1000-row grid
// in place. mutate() clones the whole list up front and deep-compares after, so
// the cost is O(list) (~340µs/op here) no matter how little the callback
// touches — the shape a revocable-proxy dirty-check would collapse to O(touched).
// 600 iters lands ~200ms, comfortably above the σ-floor.
{
  const sig = new Signal(makeRecords(1000));
  // purpose: Edits two fields of one row in a 1000-row list signal via mutate(), in place, 600 times. Clone-before/compare-after cost.
  performance.mark(startMark('mutate-grid-row-edit-600'));
  for (let i = 0; i < 600; i++) {
    const idx = i % 1000;
    sig.mutate(rows => {
      rows[idx].name = `Record ${i}`;
      rows[idx].active = !rows[idx].active;
    });
  }
  performance.measure('mutate-grid-row-edit-600', startMark('mutate-grid-row-edit-600'));
}

// mutate-doc-nested-200k — edits two nested fields of a small structured
// document in place. Cheap to clone and compare (~1.1µs/op), so this is where a
// per-call Proxy setup cost has to earn itself — the honesty counterpart to the
// grid case, not a win-flattering one. 200k iters lands ~230ms.
{
  const sig = new Signal(makeDoc());
  // purpose: Edits two nested fields of a structured document signal via mutate(), in place, 200000 times. Small-object clone/compare baseline.
  performance.mark(startMark('mutate-doc-nested-200k'));
  for (let i = 0; i < 200_000; i++) {
    sig.mutate(doc => {
      doc.meta.updated = i;
      doc.body.wordCount = i & 1023;
    });
  }
  performance.measure('mutate-doc-nested-200k', startMark('mutate-doc-nested-200k'));
}

/*******************************
      Reaction scheduler
*******************************/

// reaction-flush-noop-5m — pure scheduler dispatch with no pending work.
// Every microtask boundary that the framework reaches calls into the
// scheduler; if dispatch has overhead, it accumulates across all reactive
// activity. 5M iterations to comfortably clear σ-floor after V8 inlines
// the empty path.
{
  // purpose: Calls flush() 5000000 times with no pending work. Scheduler dispatch overhead.
  performance.mark(startMark('reaction-flush-noop-5m'));
  for (let i = 0; i < 5_000_000; i++) {
    flush();
  }
  performance.measure('reaction-flush-noop-5m', startMark('reaction-flush-noop-5m'));
}

// reaction-coalesce-400x100 — 400 bursts, each setting the signal 100
// times before one flush. With coalescing, all 100 subscribers wake once
// per burst regardless of set count. Without coalescing, each subscriber
// wakes 100 times per burst — wall-clock balloons proportionally.
{
  const sig = new Signal(0);
  const subs = new Array(100);
  for (let i = 0; i < 100; i++) {
    subs[i] = reaction(() => {
      sink = sig.get();
    });
  }
  // purpose: Sets one signal 100 times then flushes once across 400 bursts so 100 subscribers wake one time per burst.
  performance.mark(startMark('reaction-coalesce-400x100'));
  for (let burst = 0; burst < 400; burst++) {
    for (let setN = 0; setN < 100; setN++) {
      sig.set(burst * 100 + setN + 1);
    }
    flush();
  }
  performance.measure('reaction-coalesce-400x100', startMark('reaction-coalesce-400x100'));
  for (let i = 0; i < 100; i++) { subs[i].stop(); }
}

// reaction-dep-diff-45k — a subscriber that reads a different signal
// depending on a toggle. Each cycle flips the toggle, so the reaction's
// dependency set changes (drops one signal, picks up another). Exercises
// the per-run dep-set diffing path that fires on every reactive
// expression's re-run in real components. 45k cycles to comfortably clear
// the σ-floor at ~1µs/cycle.
{
  const sigA = new Signal('a');
  const sigB = new Signal('b');
  const toggle = new Signal(false);
  const r = reaction(() => {
    sink = toggle.get() ? sigA.get() : sigB.get();
  });
  // purpose: Toggles which of two signals a subscriber reads across 45000 cycles. Per-run dep-set diffing.
  performance.mark(startMark('reaction-dep-diff-45k'));
  for (let i = 0; i < 45_000; i++) {
    toggle.set(i % 2 === 0);
    flush();
  }
  performance.measure('reaction-dep-diff-45k', startMark('reaction-dep-diff-45k'));
  r.stop();
}

/*******************************
      Reactivity Hardening — Items 5 / 8 / 9
*******************************/

// Stable-dependency churn — gates Item 9 dep-tracking rewrite.
// N reactions × stable deps × M invalidations. Existing reaction-dep-diff-45k
// measures the changing-dependency case; these isolate the stable-set churn
// hypothesized to dominate per-expression workloads.

// reactive-stable-fanout-5000x100 — wide-fan case, single stable dep per reaction
{
  const sig = new Signal(0);
  const reactions = new Array(5000);
  for (let i = 0; i < 5000; i++) {
    reactions[i] = reaction(() => {
      sink = sig.get();
    });
  }
  // purpose: 5000 reactions × 1 signal × 100 invalidations. Per-run Set.delete + add on a stable dep edge.
  performance.mark(startMark('reactive-stable-fanout-5000x100'));
  for (let i = 0; i < 100; i++) {
    sig.set(i + 1);
    flush();
  }
  performance.measure('reactive-stable-fanout-5000x100', startMark('reactive-stable-fanout-5000x100'));
  for (let i = 0; i < 5000; i++) { reactions[i].stop(); }
}

// reactive-stable-deps-3reads-5000x100 — median templating shape, 3 stable deps per reaction
{
  const sigA = new Signal(0);
  const sigB = new Signal(0);
  const sigC = new Signal(0);
  const reactions = new Array(5000);
  for (let i = 0; i < 5000; i++) {
    reactions[i] = reaction(() => {
      sink = sigA.get() + sigB.get() + sigC.get();
    });
  }
  // purpose: 5000 reactions × 3 signals × 100 cycles. Each run clears + re-adds 3 stable dep edges.
  performance.mark(startMark('reactive-stable-deps-3reads-5000x100'));
  for (let i = 0; i < 100; i++) {
    sigA.set(i + 1);
    flush();
  }
  performance.measure('reactive-stable-deps-3reads-5000x100', startMark('reactive-stable-deps-3reads-5000x100'));
  for (let i = 0; i < 5000; i++) { reactions[i].stop(); }
}

// Computed lifecycle — informs Item 8 lazy refcounted computed.

// computed-unobserved-200x500 — eager-recompute baseline.
// Under the current code, computeds re-run on every source change regardless
// of whether anyone observes them. Post-Item-8 this drops to near-zero — the
// computed stays dormant without subscribers.
{
  const root = new Signal(0);
  const computeds = new Array(200);
  for (let i = 0; i < 200; i++) {
    computeds[i] = computed(() => root.get() + i);
  }
  // anchor to keep the array live for DCE; values read outside any reaction so no subscriber attaches
  let preamble = 0;
  for (let i = 0; i < 200; i++) { preamble += computeds[i].get(); }
  sink = preamble;
  // purpose: 200 unobserved computed signals, root updated 500 times. Measures the eager-recompute cost the refcount removes.
  performance.mark(startMark('computed-unobserved-200x500'));
  for (let i = 0; i < 500; i++) {
    root.set(i + 1);
    flush();
  }
  performance.measure('computed-unobserved-200x500', startMark('computed-unobserved-200x500'));
}

// computed-subscribe-unsubscribe-10k — refcount machinery overhead on the subscribe/unsubscribe path.
// Function-scoped fixture so each cycle's computed + observer are GC-eligible.
{
  const root = new Signal(0);
  const cycle = () => {
    const c = computed(() => root.get() + 1);
    const r = reaction(() => {
      sink = c.get();
    });
    r.stop();
  };
  // purpose: 10000 create-computed + attach-observer + detach cycles. Lifecycle cost the refcount path must keep acceptable.
  performance.mark(startMark('computed-subscribe-unsubscribe-10k'));
  for (let i = 0; i < 10_000; i++) { cycle(); }
  performance.measure('computed-subscribe-unsubscribe-10k', startMark('computed-subscribe-unsubscribe-10k'));
}

// Scheduler allocation — verifies Item 5 set-swap.

// flush-fanout-allocation-1000x500 — amplified per-flush spread cost.
// Existing reactive-fanout-500x1200 measures the same shape at 90ms; this
// runs more flushes (1000) so per-flush array allocation is proportionally
// more of the total. Set-swap eliminates the spread.
{
  const sig = new Signal(0);
  const reactions = new Array(500);
  for (let i = 0; i < 500; i++) {
    reactions[i] = reaction(() => {
      sink = sig.get();
    });
  }
  // purpose: 500 subscribers fanout across 1000 flush cycles. Each flush spreads pendingReactions; tests per-flush allocation churn.
  performance.mark(startMark('flush-fanout-allocation-1000x500'));
  for (let i = 0; i < 1000; i++) {
    sig.set(i + 1);
    flush();
  }
  performance.measure('flush-fanout-allocation-1000x500', startMark('flush-fanout-allocation-1000x500'));
  for (let i = 0; i < 500; i++) { reactions[i].stop(); }
}

/*******************************
      Results
*******************************/

performance.getEntriesByType('measure')
  .forEach(m => console.log(`${m.name}: ${m.duration.toFixed(3)}ms`));

if (sink === Symbol()) { console.log('noop'); }
