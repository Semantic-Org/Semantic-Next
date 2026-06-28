# Heap bot

Canaries runtime memory on a PR, posted as a single comment by **Semantic Heap
Bot**. It's the third of the suite, after the performance bot (runtime) and the
bundle-size bot (shipped bytes): same two-workflow shape, same comment grammar,
so the three read together.

The headline is a **leak verdict**, not a memory number. The gate is exact: the
framework's own teardown invariants must return to baseline after a churn cycle.
Memory bytes are a noisy secondary trend.

## What it measures

Two signals, two methodologies — mirroring the perf/bundle split in
`read-ci-reports`.

### The gate — teardown invariants (deterministic)

After a warmup and **7** (prime) create -> destroy churn cycles, the count of
each live framework structure must return **exactly** to its pre-churn baseline.
A residual is a leak, reported as a per-cycle multiple (a `+7000` after 7 cycles
reads as `+1000/cycle`). Counted via CDP `Runtime.queryObjects(prototype)` — no
framework change, no snapshot, so the gate is cheap enough to run every PR.

The invariants, mapped to SUI's actual structures (`targets.js`):

| invariant | what it is |
|---|---|
| `Reaction` | one per binding; `ReactionScope.dispose()` stops them on teardown |
| `ReactionScope` | per-component / per-each-item scope; `dispose()` recurses the tree |
| `DynamicRegion` | one per each / if / async block; `clear()` drops owned nodes + child scopes |
| `Dependency` | per-key reactive channel; its `subscribers` Set is the classic retain-after-teardown surface |
| `Signal` | per-key value cell, released with the item context |
| detached DOM | marker-bounded item content `disposeRecordDOM()` should remove |

The workload reuses the krausest each-block table (the prime leak surface), and
includes a **move-vs-removal** case (detach + reattach in one task) to exercise
the reconnection guard. Every count is read only after a correct `settle()` —
async teardown drains, then GC runs twice — so the equality is honest.

### The trend — footprint (statistical)

Post-GC retained heap for a mounted scene, and a Node `--expose-gc` reactivity
micro (10k signals + computeds + reactions). Both are classified against a
percent noise floor (±4% to start) and **never fail CI** — heap KB stays noisy
even post-GC (fragmentation, JIT/IC caches). A collapsed trend, not a gate.

## The comment

The banner leads with the verdict: `{state} for {sha} on Heap Analysis 🧠`.
State is a small vocabulary, red reserved for a broken invariant (a real leak):

| state | icon | alert | when |
|---|:---:|---|---|
| no leak | ⚪ | NOTE | all invariants held, footprint within noise |
| improvement | 🟢 | TIP | the PR fixes a leak `main` had |
| watch | 🟡 | WARNING | invariants held but footprint grew past the floor |
| leak | 🔴 | CAUTION | an invariant grew — counts didn't return to baseline |

The invariants table is the story (expanded); footprint and the reactivity micro
are collapsed. `🎯` marks the invariant this PR moved. The footer reports the run
parameters — cycles, GC passes, pinned Chrome version, noise floor — so a reader
can trust the numbers.

## How it runs

Two workflows, the same split the Bundle Size and Benchmarks suites use:

- **`memory.yml`** builds the bench bundle and measures the PR head and the
  merge base, then uploads both snapshots. It builds and runs untrusted PR code
  in a browser, so it holds only `contents: read` and never posts.
- **`memory-report.yml`** runs after that completes, in the base-repo context
  where the bot secrets live (so it works for fork PRs). It renders the comment
  and posts it.

The browser half drives a dedicated bench page
(`packages/component/bench/tachometer/bench-memory.js`, built by `build-ci.js`
into `dist/{current,baseline}/`). That page is **test harness, not framework
source** — it exposes the reactivity / renderer prototypes on `window.__heap` so
`queryObjects` can count them. The shipped framework exposes nothing, so the
counting path adds **zero production bytes** — and the bundle bot guards that: if
any instrumentation leaked into the shipped build, the `component` bundle would
grow and the bundle bot would flag it.

### Author neutrality

The scorecard (`tools/ci/memory/`) is overlaid from `main` in both workflows, so
a PR can't reshape how its own memory is judged. The bench driver
(`bench-memory.js`) is the measured instrument and is kept from the PR head on
both sides — only the framework source differs between the two builds. On the PR
that first adds this harness, `main` doesn't have it yet, so the overlay no-ops
and the PR's own copy runs (a self-test), same as the other two suites.

### Chrome is pinned

GC and heap-snapshot internals drift between Chrome builds, so an unpinned
browser produces spurious regressions. The workflow installs the Chromium build
the repo's `playwright` dep resolves to (committed in `package-lock.json`), and
the comment footer reports the version so cross-run comparisons are trustworthy.

## Tier 2 — leak attribution (best-effort v1)

On a broken invariant (or a `/memory-deep` label), `retainers.js` captures a
heap snapshot, finds the leaked / detached set, and walks edges backward to the
nearest named retainer — collapsing a thousand identical leaks into one named
pattern + count. SUI's internals are named (`Dependency.subscribers`,
`ReactionScope.reactions`), so the paths come out human-readable.

This is **v1 and needs validation** (see the `TODO` in `retainers.js`): the
shape key is edge-name-only, and the BFS is validated against synthetic fixtures
in `retainers.test.js`, not yet against a real planted-leak snapshot. It is gated
strictly off the Tier-1 verdict, so it never blocks the gate. MemLab
(`@memlab/api findLeaks`) does this out of the box and is worth reaching for in a
local `leak:debug` session — but it stays **off the CI path** to keep the gate
dependency-free.

## Setup (one time)

1. Create a GitHub App named **Semantic Heap Bot**.
   - Repository permissions: **Pull requests: Read & write**, **Contents: Read**.
   - Upload `avatar.png` as the App's logo (a placeholder ships here — replace it
     with a logo in the green-bot suite family).
   - Install it on the repository.
2. Add repository secrets:
   - `SEMANTIC_HEAP_BOT_CLIENT_ID` — the App's client id
   - `SEMANTIC_HEAP_BOT_PRIVATE_KEY` — a generated private key (full PEM)
3. Open a PR that touches `packages/{reactivity,renderer,templating,component}/**`
   to see the comment.

## Running locally

```sh
# build the bench bundle(s)
node packages/component/bench/tachometer/build-ci.js current
node packages/component/bench/tachometer/build-ci.js baseline

# smoke-check the runner against the current bundle (counts + footprint)
node tools/ci/memory/runner.js

# the reactivity micro on its own (re-execs under --expose-gc)
node tools/ci/memory/reactivity-micro.js

# collect one tree into a JSON snapshot, then diff two into a comment
node tools/ci/memory/collect.js --label current --side current --out /tmp/m/current.json
node tools/ci/memory/collect.js --label baseline --side baseline --out /tmp/m/baseline.json
node tools/ci/memory/reporter.js --results /tmp/m --sha "$(git rev-parse HEAD)" \
  --repo Semantic-Org/Semantic-Next --out /tmp/m/report
cat /tmp/m/report/comment.md
```

## Files

| file | role |
|---|---|
| `targets.js` | the invariants, footprint scenes, churn params, and noise floors |
| `runner.js` | Playwright + CDP: `settle()`, churn cycles, `queryObjects` counts, post-GC footprint |
| `reactivity-micro.js` | Node `--expose-gc` reactivity-graph footprint |
| `census.js` | instance counting (queryObjects for Tier 1, snapshot census for Tier 2) |
| `retainers.js` | Tier 2: snapshot parse -> leaked set -> backward-BFS -> aggregate shapes |
| `collect.js` | CLI: drive runner + micro into one JSON snapshot |
| `reporter.js` | CLI: diff two snapshots into `comment.md` + `memory-report.json` |
| `*.test.js` | `node --test` suites for the pure logic |
| `avatar.png` | the bot's avatar (placeholder) |

The in-browser driver lives with the bench suite, not here:
`packages/component/bench/tachometer/bench-memory.js` and its
`ci-{current,baseline}-memory.html` pages.

## Known limits

- **The gate's determinism rests entirely on `settle()`.** A flaky count means
  it read before async teardown finished — add a frame or a GC round, don't
  widen a threshold.
- **The counters must net to zero per cycle.** They target per-component churned
  structures, not shared caches (compiled AST, registries) that legitimately
  persist — those would read as false leaks and are excluded.
- **Heap KB is noisy even post-GC.** It's a footprint trend, never a gate. The
  reactivity micro's residual-after-teardown is a trend signal, not a leak claim
  (V8 doesn't return freed pages to baseline).
- **`queryObjects` counts by prototype, so esbuild's name munging is harmless
  for the gate.** The Tier 2 snapshot census reads constructor *names* and folds
  the esbuild `_`-prefix artifact (`_ReactionScope` -> `ReactionScope`).
- **Retainer paths are heuristic** — multiple valid paths, weak / internal
  edges. A likely hint that names a field, not gospel.
- **The 7 GB runner caps snapshot scenes at ~1k.** Tier 1 metric scenes (no
  snapshot held) can run larger.
- **Validate against null PRs** before trusting it: a behavior-preserving PR
  must produce zero confident findings.
