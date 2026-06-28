/*
  What the heap bot measures: the teardown invariants (the gate), the footprint
  ops (the soft trend), and the noise floors that separate signal from runner
  drift.

  Two kinds of signal, two methodologies — mirroring the perf/bundle split in
  read-ci-reports:

    - INVARIANTS are deterministic once settle() is correct. Live-instance
      counts of the framework's own churned structures must return *exactly* to
      their pre-churn baseline after N create -> destroy cycles. Any residual is
      a leak, reported as a per-cycle multiple. No noise floor — an exact
      integer === baseline, the way Vue's effectScope.spec asserts
      `scope.effects.length === 0` after stop().

    - FOOTPRINT (post-GC retained heap KB / node / listener counts) is
      statistical even post-GC (fragmentation, JIT/IC caches). It's a trend, not
      a gate: classified against a percent noise floor, never fails CI.

  The invariant ids match the prototype keys bench-memory.js hangs on
  window.__heap.prototypes — the runner counts each via queryObjects(prototype).
*/

// Churned framework structures. Each is created per-component / per-each-item
// and disposed on teardown, so a clean cycle nets to the pre-churn baseline.
// `perItem` flags counters that scale with row count (the ones a per-row leak
// multiplies) versus fixed per-component structure.
export const INVARIANTS = [
  {
    id: 'Reaction',
    label: 'live `Reaction`',
    perItem: true,
    why: 'each binding owns a Reaction; ReactionScope.dispose() stops them on teardown',
  },
  {
    id: 'ReactionScope',
    label: 'live `ReactionScope`',
    perItem: true,
    why: 'each item gets scope.child(); dispose() recurses and empties the tree',
  },
  {
    id: 'DynamicRegion',
    label: 'live `DynamicRegion`',
    perItem: false,
    why: 'one region per each/if/async block; clear() drops ownedNodes + childScopes',
  },
  {
    id: 'Dependency',
    label: 'live `Dependency`',
    perItem: true,
    why: 'per-key reactive channel; subscribers Set is the classic retain-after-teardown surface',
  },
  {
    id: 'Signal',
    label: 'live `Signal`',
    perItem: true,
    why: 'per-key value cell created with the item context, released with it',
  },
  {
    id: 'detachedNodes',
    label: 'detached DOM nodes',
    perItem: true,
    census: 'detached',
    why: 'disposeRecordDOM() removes marker-bounded content; survivors are leaked <tr>/<td>',
  },
];

// Footprint scenes — mounted, measured post-GC, torn down. Reported as a
// collapsed trend, classified against NOISE_FLOOR.heapPercent.
export const FOOTPRINT_OPS = [
  { id: 'mount-1k', rows: 1000, label: 'create-1k' },
  { id: 'mount-5k', rows: 5000, label: 'create-5k' },
];

// The churn workload. One warmup (excluded — one-time JIT/setup), then a prime
// number of measured cycles so a per-cycle leak reads as an unambiguous
// multiple. The runner mounts -> run(rows) -> clear -> destroy each cycle and
// counts after settle().
export const CHURN = {
  warmupCycles: 1,
  cycles: 7, // prime: a per-cycle leak shows as ×7
  rows: 1000,
};

// Noise floor. Counts are exact (no floor). Post-GC retained heap KB is
// statistical — within the floor reads as "within noise", never a fail.
export const NOISE_FLOOR = {
  heapPercent: 4, // post-GC retained heap; start ±4%, calibrate on null PRs
};

// Top-N leaked retainer shapes to report from Tier 2 aggregation. The source of
// truth for retainers.js's aggregateByShape / attributeLeak default.
export const RETAINER_TOP_N = 3;
