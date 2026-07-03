---
title: Reading CI Reports on PRs
description: How to interpret the two CI bot comments on a PR — the performance bot (tachometer bench) and the bundle-size bot. What each section means, what to chase, what to ignore.
keywords: [benchmark, tachometer, bundle size, PR comment, bench report, bundle report, regression, headline, noise floor, unsure, JND, tree-shaken, severity, confidence interval, ci reports]
audience: contributing
skill: read-ci-reports
type: skill
---

# Reading CI Reports on PRs

> **Skill:** `read-ci-reports`
> **Purpose:** Correctly interpret the two CI bot comments on a PR — the performance bot and the bundle-size bot. What each section means, what to chase, what to ignore.

**Golden rule: read for confident signal, not noise.**

- *Performance:* the signal lives in the Faster and Slower buckets. `🔍 Unsure` means "the measurement did not resolve," never "regression to investigate."
- *Bundle size:* the state is deterministic signal, but a tree-shaken `†` bundle is an upper bound (not a per-consumer cost), and sub-noise wiggles are already filtered out.

In both, the headline names the one thing that matters. Chase that; collapse the rest.

---

## The reports

Three bots each post one comment on a PR. They share a grammar — separate confident signal from noise, headline the metric that matters, collapse the rest — but they measure different things and reason about uncertainty differently. This skill is the home for reading all of them; it grows a section per report, so consult whichever the PR triggered.

| | Performance bot | Bundle-size bot | Heap bot |
|---|---|---|---|
| Comment title | `… on Benchmark Suite 📊` | `Bundle size … 📦` | `… on Heap Analysis 🧠` |
| Measures | runtime, in real headless Chrome | shipped bytes (brotli / gzip / raw) + lines of code | runtime memory: teardown-invariant leaks + footprint |
| Uncertainty | statistical — 95% CI, noise floor | none — deterministic build, a delta is exact | split — counts are exact, heap KB is statistical |
| Confident signal | the Faster / Slower buckets | the state itself (sub-noise filtered) | the leak verdict (a broken count invariant) |
| Raw adjunct | `bench-report.json` | `size-report.json` | `memory-report.json` |

The load-bearing difference: a bench number carries a confidence interval, so **Unsure** is a real category and most of the bench skill is about not mistaking it for a regression. A bundle number is exact, so there is no Unsure — instead the bot suppresses sub-threshold wiggles and marks which bundles are real shipped cost versus tree-shaken upper bounds. The heap bot is a hybrid: its **gate is exact** (a live-instance count either returns to baseline or it doesn't), but its **footprint trend is statistical** (heap KB is noisy even post-GC) — so read the leak verdict like a bundle delta and the footprint like a bench sample.

---

## Reading a performance report — the bench bot

**Confident signals live in the Faster and Slower sections.** `🔍 Unsure` means "the measurement did not resolve," *not* "regression to investigate." A metric in "Too Fast to Measure Precisely" will stay unsure on zero-delta PRs by physics — chasing it wastes time. A metric in "Inconclusive" might resolve with more samples but isn't an actionable signal today.

### Comment anatomy

Every bench comment follows the same shape. Top to bottom:

```
### <state-emoji> <State phrase> for <sha-link> on Benchmark Suite 📊

**Base:** [main](commit) · **Action:** [run ↗] · **Raw:** [bench-report.json]

<sup>Commit message</sup>

> [!<alert>]
> Verdict sentence.

✅ N faster · ❌ N slower · 🔍 N unsure · ⚪ N no change

---

#### ✅ Faster (N)       ← expanded when ≤ 15 rows
#### ❌ Slower (N)       ← same
<details>⚪ No Change</details>  ← always collapsed
<details>🔍 Unsure</details>     ← always collapsed, two subsections inside

<sub>Sample size · Resolution floor · Timeout · Wall-clock</sub>
```

### Header state — what the headline says

Six possible states based on the count of faster and slower metrics. The emoji and the GitHub alert color both encode the state; use either as your entry point.

| State | Emoji | Alert | Meaning |
|-------|:---:|:---:|---------|
| Improvement | ✅ | `[!TIP]` green | At least one faster, zero slower. Clean win. |
| Regression | ❌ | `[!CAUTION]` red | At least one slower, zero faster. Investigate. |
| Mixed — Net Positive | 🟡 | `[!WARNING]` yellow | More faster than slower. Look at the slower table first. |
| Mixed — Net Negative | 🟡 | `[!WARNING]` yellow | More slower than faster. Investigate which regressions outweigh the wins. |
| Mixed — Balanced | 🟡 | `[!WARNING]` yellow | Equal count. Magnitude matters more than count here. |
| No Meaningful Change | ⚪ | `[!NOTE]` blue | Zero faster, zero slower. Docs/CI-only PRs; refactor PRs that preserve perf. |

Net modifier uses **count**, not magnitude-weighted score. 9 wins × 5% improvement outweighs 1 regression × 30% regression in user-observable impact, but the count-based label still says "Net Positive." The individual tables show magnitudes — trust those for the real tradeoff judgment.

### Faster / Slower — the headline verdicts

Metrics land in Faster or Slower only when their 95% CI is entirely above or below ±2%. This is the confident-signal bucket. If a metric is here, **there's a real perf change to discuss.**

#### A confident finding is a real cost, not a measurement artifact

A metric in Faster or Slower has already cleared the noise floor and the per-metric expected-noise check. It is not flakiness, GC jitter, or "bundle perturbation." Those explanations are falsifiable, and they have been falsified: behavior-preserving changes produce `0 faster · 0 slower`, including bundled hot-path refactors (PR #228) as well as non-bundled build edits (PR #143, #149). The harness does not fabricate confident findings.

So when a confident regression lands on a bench whose code you did not touch, the cost is real and reachable, often not where you expect but locatable. Do not migrate the conclusion to the least-falsifiable region (V8 internals, GC, the harness) because reading did not surface it. Bisect instead: revert only the suspect on the same branch and re-bench. The `improve-performance` skill's "elimination trap" has the worked example, a confident +22% that read as a "profile-only V8 effect" and turned out to be three `.bind()` calls, found in one revert cycle.

#### Reading a row

```
| `update-10th` | -62% (34ms) 🌟 |
```

- **`update-10th`** — metric name, links to its `performance.measure(...)` line in the bench source at the run's SHA. Click to see what's actually being benchmarked.
- **`-62%`** — midpoint of the 95% CI for percent change. Sign carries direction (negative = faster; positive = slower). The CI itself is in `bench-report.json`.
- **`(34ms)`** — midpoint absolute-ms delta, unsigned (sign inferred from the section — Faster means time *saved*, Slower means time *added*).
- **`🌟`** — severity emoji. Appears *after* the values so number columns align vertically; lets you scan magnitudes at a glance.

#### Severity emoji by |midpoint%|

| Threshold | Faster | Slower | Category |
|---|:---:|:---:|---|
| ≥ 75% | 🏆 | 🚨 | Extreme |
| 35–75% | 🌟 | ‼️ | Very significant |
| 15–35% | ⭐ | ❗ | Significant |
| < 15% | *(none)* | *(none)* | Below threshold — still a real signal, just lower magnitude |

Rows sorted by `|midpoint|` descending, so the biggest effects are at the top.

#### Teaser pattern for big PRs

If Faster or Slower has more than 15 rows, the section shows a top-5 teaser above a collapsible with the full list:

```markdown
#### ✅ Faster (18) — top 5 shown
<5-row table>
<details>
<summary>Show all 18 faster metrics</summary>
<full 18-row table>
</details>
```

The teaser prevents the comment from blowing up while keeping the headline-worthy wins visible.

### No Change — confirmed unchanged

Metrics with CI entirely inside ±2%. These are the *positive* signal for a refactor or cleanup PR — proof you didn't regress anything. Always collapsed so the list doesn't dominate mixed-outcome comments, but expand when:

- You're reviewing a refactor and want confirmation nothing moved.
- You want to double-check that a metric you expected to improve didn't actually shift.

Don't expand reflexively on a mixed PR — the Faster/Slower tables have the story.

### Unsure — the two subsections

Unsure metrics have CIs that straddle the ±2% threshold. The reporter splits them into two buckets by **duration-derived noise analysis**, because they need different responses.

#### Inconclusive — boundary cases, more samples might help

```
| `bulk-add-50` | +0.2% – +3.8% | ±4% |
```

- **Change**: CI range straddling ±2%.
- **Expected Noise**: the CI width predicted by the bench's absolute duration and the GHA σ≈2ms jitter floor. The `±4%` here says "at this bench's duration, we'd expect the CI to narrow to about ±4% wide."

A metric lands in Inconclusive when its observed CI width is **more than 2× the expected width** for its duration. That's the "we tried to resolve and couldn't" signal — either more sampling time would settle it, or the bench is genuinely noisier than its duration predicts (worth a second look at the bench itself).

#### ✅ When to investigate an Inconclusive row

`create-1k` (~130ms mean) shows CI width ~3.5% while expected is ~1.3%. **2.7× expected** — long benches shouldn't have wide CIs. That's a "this bench has unusual per-sample variance" signal worth tracing to a setup issue or a legitimate GC/allocation pattern.

#### ❌ When NOT to investigate

`bulk-add-50` shows CI `+0.2% to +3.8%` with expected `±4%`. **Roughly 1× expected** — this is the boundary CI narrowing right up against the expected noise floor. More samples won't narrow it materially. Treat as no-signal.

#### Too Fast to Measure Precisely — physics-limited, ignore

```
| `clear` | -10.2% – +10.7% | ~13ms | ±12% |
```

- **Change**: CI range; often wide on short benches.
- **Test Time**: mean absolute duration.
- **Expected Noise**: at 13ms, GHA's ~2ms absolute jitter becomes ±12% relative. The observed CI width is right at that floor.

These are benches whose duration is short enough that per-sample OS/GC/JIT jitter dominates sub-5% changes. Tachometer literally cannot resolve the signal on zero-delta runs — not a tuning issue, a physical limit of the hardware.

**These benches still work under real perf deltas.** A genuine 30% improvement on `clear` will clear the ±12% noise floor and show up in the Faster section. What they *won't* do is confirm "no change" — they'll default to unsure whenever the true delta is smaller than the noise floor.

#### ❌ Common mistake

> "`remove-last` is marked unsure — we regressed it!"

Check if it's in the Too Fast subsection. If the Expected Noise is comparable to the observed CI width, the bench is noise-floor-limited and the verdict is neither regression nor improvement. **Not a regression signal.**

#### ✅ Correct reading

> "`remove-last` is in Too Fast to Measure Precisely — mean ~8ms, expected noise ±20%. Zero-delta PRs will always show this as unsure. Move on unless there's a substantive change in the PR that should have affected this code path."

### Footer metadata

```
<sub>Sample size: 50 · Resolution floor: ±2% · Timeout: 3min · Wall-clock: 10m42s</sub>
```

Useful when something looks off — tells you the parameters the run used without opening the raw JSON. If a bench comment is missing metrics, check Wall-clock — if the cell hit the 25-min job cap, some metrics may have timed out before finishing initial samples.

### bench-report.json — for agents

The `bench-report.json` artifact (linked from the **Raw:** line in the metadata header) contains the full structured output:

```json
{
  "head": { "sha": "...", "msg": "...", "ref": "..." },
  "base": { "sha": "...", "ref": "main" },
  "run":  { "url": "..." },
  "repo": "Semantic-Org/Semantic-Next",
  "wall_clock_seconds": 642,
  "noise_floor_percent": 2,
  "sigma_abs_ms": 2,
  "noise_ratio_tolerance": 2,
  "summary": { "faster": 10, "slower": 5, "within-noise": 3, "unsure": 0, "noise-floor-limited": 3 },
  "metrics": [
    {
      "name": "update-10th",
      "status": "faster",
      "percent_change_ci": [-63.1, -60.4],
      "absolute_ms_ci":    [-35.7, -33.17],
      "this_change_ms_ci": [8.2, 8.5],
      "tip_of_tree_ms_ci": [22.5, 22.8],
      "mean_ms": 8.35,
      "expected_noise_pp": 0.94,
      "observed_noise_ratio": 2.87,
      "source": { "path": "packages/component/bench/tachometer/bench.js", "line": 180 }
    }
  ]
}
```

#### Fields agents care about

| Field | Agent use |
|-------|-----------|
| `summary` | One-shot verdict counts; drives decision trees |
| `metrics[].status` | Classification without re-parsing CIs |
| `metrics[].percent_change_ci` | Exact CI bounds for cross-run comparison |
| `metrics[].mean_ms` | Duration for noise-floor reasoning |
| `metrics[].expected_noise_pp` | Floor this run would be limited by |
| `metrics[].observed_noise_ratio` | Ratio ≤ 2 → expected; > 2 → investigate |
| `metrics[].source` | Jump to bench source at this SHA |

#### ✅ Good agent query

"For any metric with `status: slower` and `observed_noise_ratio < 1.5`, the regression is real and the CI is tight — worth surfacing to the reviewer."

#### ❌ Bad agent query

"Count all `unsure` entries and flag regression." Unsure ≠ regression; the category is defined by "CI straddles ±2% boundary," not direction. Count `slower` instead.

### Methodology shifts — uniform suite-wide swings

If many unrelated metrics suddenly show enormous magnitude changes — 50%+ improvements or regressions across benches that share no functional code path — suspect a measurement methodology shift, not a real perf change. The signature: shifts are **uniform** across metrics whose only commonality is the bench harness, often coincident with a bench-infra commit on main.

Past examples of methodology shifts on this suite:

- **`await rAF` → `flush()` in cycle loops.** Wall-clock for previously rAF-bound metrics drops from ~833ms (`50 × 16.66ms` frame floor) to whatever the actual work is — often tens of ms. Looks like a 90%+ improvement on every metric that had a 50-cycle loop with `await flush()` inside.
- **`sampleSize` or `timeout` knob changes.** Tighter convergence shifts CIs uniformly; coarser sampling widens them. Distinct from a real change because the shape (CI width vs midpoint) moves, not the midpoint specifically.
- **Bench-bot reporter rendering changes.** No actual measurement shift, but the comment looks dramatically different — peak attribution, drift footnotes, column headers.

Real perf changes have **selective** shape: faster where the PR touched, flat where it didn't. A PR that touches `each.js` shouldn't cause `signal-set-same-10m` to swing 70%. If it appears to, you're reading methodology, not code.

Methodology-shift symptoms also fire the bench-bot's per-PR peak history. The first run after a methodology shift on main will show every metric as either `New Peak` or `Regression from peak` — the prior PR push was on the old methodology, the new one isn't comparable. After a few main commits land on the new methodology, peaks rebuild from those entries and the noise resolves. **Trust the second-run report more than the first.**

### Decision tree

```
Headline state says Improvement or No Meaningful Change
  └─ Default trust. Spot-check Slower (empty) and Unsure (curiosity only).

Headline state says Regression or Mixed Net Negative
  └─ Go straight to the Slower table. The sort order puts the biggest
     regressions at top. Click the metric name to see what the bench does.

A specific metric reads wrong (e.g. expected a win, didn't get one)
  └─ Check Unsure first. It might be in Too Fast — physics-limited,
     not a failure. If it's in Inconclusive at ratio > 2, real investigation.

Reviewing a refactor / cleanup PR
  └─ Expand No Change. Confirm the expected metrics are there, not
     surprise-Slower.

An agent needs the data
  └─ bench-report.json from the metadata Raw link. Parse, act.
```

---

## Reading a bundle-size report — the bundle bot

This bot measures the bytes a PR actually ships. Sizes come from a deterministic build, so a nonzero delta is a real change — there's no confidence interval, and no Unsure. Instead the bot filters two ways: it suppresses sub-noise wiggles (a just-noticeable-difference floor), and it marks bundles whose whole-package size is an upper bound rather than a per-consumer cost.

### Comment anatomy

```
### <state-emoji> Bundle size<word>: <headline bundle> <Δ brotli> · <shipped LOC> for <sha>

**Base:** [main](commit) · **Run:** [#id] · **Raw:** [size-report.json]

<sup>Commit message</sup>

> [!<alert>]
> One-sentence verdict, led by the headline bundle.

**N larger · N smaller · N unchanged · ±N shipped LOC · ±N comment LOC**

#### Bundles that changed (N of M)
| bundle | brotli | Δ brotli | change | from |

<details> Tracked import costs (query · reactivity · utils) </details>
<details> LOC by scope </details>
<details> All bundles, gzip, and raw </details>

<sub>brotli q11 · gzip l9 · vs main · fresh build both sides · wall-clock</sub>
```

The title leads with the two numbers worth scanning: the **headline bundle's brotli delta** and **shipped LOC**.

### The state — what the banner says

Red is reserved for CI-failing-grade growth; warnings stay yellow. Severity keys off the **worst single bundle**, never a cross-bundle sum (the bundles overlap, so summing double-counts).

| State | Emoji | Alert | When |
|-------|:---:|:---:|------|
| No meaningful change | ⚪ | `[!NOTE]` | Nothing cleared the JND, or only tree-shaken bundles moved |
| Improvement | 🟢 | `[!NOTE]` | Only shrinks |
| Mixed | 🟡 | `[!WARNING]` | Both directions, or a lone small increase |
| Warning | 🟡 | `[!WARNING]` | A real bundle grew ≥ 512 B or ≥ 2% |
| Regression | 🔴 | `[!CAUTION]` | A real bundle grew ≥ 5 KB, or ≥ 10% on a ≥ 2 KB move |

Percent can escalate a tier, but only paired with a real absolute move — a tiny primitive at +100 B / +14% is a warning, not a regression.

### The headline bundle

The headline is **`@semantic-ui/component`** whenever its bundle moved. It already contains reactivity, renderer, templating and the rest, so its delta is the real cost a component shipper pays — there is no cross-bundle sum to take. When component didn't move, the changed package whose source shipped the most code is promoted to headline instead. The single **largest increase**, when it's a different bundle, is named in the alert (`🎯` marks the headline; the largest grower may sit below it in the table).

### Deterministic — a delta is exact, not a sample

There is no confidence interval to reason about; the build is reproducible. The bot filters two ways instead:

- **JND (just-noticeable difference): 128 B or 0.5% brotli.** Below this, a bundle counts as unchanged — a sub-noise wiggle, not worth a reviewer's eye.
- **Tree-shaken `†` (e.g. `utils`).** A few packages are consumed piecemeal, so their whole-package bundle is an *upper bound*, not a per-consumer cost: a new export adds bytes there but tree-shakes to zero for real consumers, and its real cost (if any) already shows up in the `component` bundle. These rows are measured and shown, marked `†`, but they never raise the banner.

### Reading a changed row

```
| `component` 🎯 | 57.1 KB | +8.76 KB | +18.1% |
```

- **bundle** — name; `🎯` = the headline (PR-relevant) bundle, `†` = tree-shaken upper bound.
- **brotli** — absolute size on the PR head.
- **Δ brotli** — signed delta. `new` / `removed` for added or deleted bundles.
- **change** — brotli percent.

Sorted increases-first by absolute Δ, real signals before tree-shaken. Severity lives in the sort and the banner, not per-row emoji.

### The two LOC numbers

The bot also counts lines of code, so a comment-heavy PR doesn't read as a big change.

- **Shipped LOC** — code lines that ship, comments and blank lines stripped. The real "how much code changed."
- **Comment LOC** — non-executable. A PR with `+0 shipped LOC · +200 comment LOC` is comments-only, and the verdict says so.

The two axes are independent: a CSS change grows a bundle with `+0 shipped LOC`; a new tree-shaken `utils` helper adds shipped LOC with no real-consumer bundle change (`⚪`, with the LOC delta carrying the signal).

### size-report.json — for agents

The `size-report.json` artifact (linked from **Raw:**) carries the structured output:

| Field | Agent use |
|-------|-----------|
| `state` | One-shot verdict — `no-change` / `improvement` / `mixed` / `warning` / `regression` |
| `fail` | `true` past the CI-failing threshold (≥ 10 KB). Advisory — not wired to block merges. |
| `summary` | Counts: `larger` / `smaller` / `unchanged` / `added` / `removed` |
| `headline` / `largest_increase` | Bundle ids — the PR-relevant bundle and the biggest grower |
| `metrics[].status` | Per-bundle classification |
| `metrics[].delta` / `.pct` | Exact byte and percent deltas |
| `metrics[].treeShaken` | `true` → upper bound; exclude from severity reasoning |
| `loc.total` / `loc.byScope` | Shipped + comment LOC deltas, overall and per package |

#### ✅ Good agent query

"For any `metrics[]` entry with `status: larger` and `treeShaken: false` whose `delta.brotli ≥ 5120`, the regression is real shipped cost — surface it."

#### ❌ Bad agent query

"Flag every bundle that grew." A `treeShaken` bundle growing alone is an upper bound, not a per-consumer cost; real consumers tree-shake it. Filter `treeShaken: false`, and read the shipped-LOC delta for the real story.

### Attribution and tracked import costs

Both come from the harness's own esbuild pass over source (minified pre-compression bytes, main-pinned on both sides). Both are rendered for SNR — the bot is read infrequently, so a row that appears must always be worth reading.

- **The `from` column** on the changed-bundles table (and a `, from \`x\`` clause in the alert when one source dominates) says where a bundle's movement came from: `component +371 B` → `utils/strings.js 100%`. One cell, at most two sources named. Traceless snapshots render the table without the column.
- **Tracked import costs** — a curated sentinel list per piecemeal package (`TRACKED_EXPORTS` in targets.js), each priced standalone per PR. Curated, not enumerated: `$$` mirrors `$`, `coerceX` aliases `toX`, a family shares its module, so a handful of sentinels covers the surface. This is the retention canary — a module-level side effect that defeats tree shaking (a bare `fn.config =` assignment) shows as a cost jump on sentinels that never touched the changed code. Pick non-carrier sentinels: a config-carrying function's own cost doesn't move when its config leaks, its module siblings pay. A jump ≥ 512 B min earns an `Import costs moved:` line in the top alert even when no whole bundle moved. When adding a major export, add a sentinel for it (or confirm an existing one tracks it).
- `size-report.json` carries the structured forms: `metrics[].moduleDeltas` and `metrics[].exportDeltas`.

### What to chase / what to ignore (bundle)

- **Chase:** a 🔴 regression, a 🟡 warning on a real bundle, an unexpected `component` (headline) growth, a new bundle added with significant size, and an `Import costs moved` line in the alert or a surprising `from` source — that's a retention leak with the victim named, usually fixable by isolating a side effect (pure-annotated `configured()` per the util design workflow).
- **Ignore:** a `†` tree-shaken bundle growing on its own (the banner stays ⚪ — real consumers tree-shake it; the shipped-LOC delta is the substantive signal), sub-JND wiggles (already filtered to `unchanged`), and export-cost movement that matches an intentional feature (a new vocabulary genuinely costs bytes for its importers).

---

## Reading a heap report — the heap bot

This bot canaries runtime memory. It is a hybrid of the other two: the **gate is deterministic** like the bundle bot, the **footprint is statistical** like the bench bot, and the headline is a **leak verdict**, not a memory number.

The gate works by churning the framework: it mounts a scene, tears it down, and repeats **7** (prime) times, then asserts that the count of each live framework structure has returned **exactly** to its pre-churn baseline. A residual is a leak — reported as a per-cycle multiple, so `+7000` after 7 cycles reads as `+1000/cycle`. This is the same thing reactive frameworks assert internally (Vue's `effectScope.spec` checks `scope.effects.length === 0` after `stop()`); it's exact and cheap precisely because it counts live instances (via CDP `queryObjects`) rather than weighing bytes.

### Comment anatomy

```
### <state-emoji> <verdict> for <sha> on Heap Analysis 🧠

**Base:** [main](commit) · **Run:** [#id] · **Raw:** [memory-report.json]

<sup>Commit message</sup>

> [!<alert>]
> One-sentence verdict, led by the leak.

**<broken count> · <held count> · 📊 <footprint state>**

| invariant | baseline | after 7 cycles | verdict |   ← the story, expanded

<details> Footprint by scene (post-GC retained heap) </details>
<details> Reactivity micro (Node, --expose-gc) </details>

<sub>7 cycles · GC ×2/sample · Chrome NNN (pinned) · counts exact · heap ±4% floor · wall-clock</sub>
```

### The state — what the banner says

Red is reserved for a **broken teardown invariant** — a real leak. Footprint movement alone never goes red.

| State | Emoji | Alert | When |
|-------|:---:|:---:|------|
| No leak | ⚪ | `[!NOTE]` | All invariants held, footprint within noise |
| Improvement | 🟢 | `[!TIP]` | The PR fixes a leak `main` had |
| Watch | 🟡 | `[!WARNING]` | Invariants held, but footprint grew past the floor |
| Leak | 🔴 | `[!CAUTION]` | An invariant grew — counts didn't return to baseline |

The leak verdict is computed per side and compared: a residual on the head that the base didn't have is **broken** (the PR introduced it); an equal pre-existing residual is **held** (not blamed on this PR); a clean head where the base leaked is **fixed**.

### The invariants — counts are exact, not sampled

The invariants target SUI's own churned structures, each created per-component or per-each-item and disposed on teardown, so a clean cycle nets to baseline:

| invariant | what a residual means |
|---|---|
| `Reaction` | a binding's reaction wasn't stopped (`ReactionScope.dispose` missed it) |
| `ReactionScope` | a scope wasn't disposed — its whole subtree leaks |
| `DynamicRegion` | an each / if / async block's region wasn't cleared |
| `Dependency` | a `subscribers` Set still holds a dead reaction |
| `Signal` | a per-key value cell outlived its item |
| detached DOM | marker-bounded item content wasn't removed — survives as detached `<tr>`/`<td>` |

A residual is exact — there's no confidence interval, no Unsure. `🎯` marks the invariant this PR moved. Determinism rests on a correct `settle()` (drain async teardown, then GC twice); if the gate ever flakes, `settle()` read too early — that's a harness bug, not a threshold to widen.

### The footprint — statistical, never a gate

Post-GC retained heap for a mounted scene and a Node reactivity micro live in collapsed `<details>`. Both are classified against a percent noise floor (±4% to start) and **never fail CI** — heap KB is noisy even post-GC (fragmentation, JIT/IC caches). It's a footprint *trend*. The micro's residual-after-teardown is a trend signal too, not a leak claim (V8 doesn't hand freed pages back to the OS).

### memory-report.json — for agents

| Field | Agent use |
|-------|-----------|
| `state` | One-shot verdict — `no-leak` / `improvement` / `watch` / `leak` |
| `fail` | `true` when an invariant broke (a real leak) |
| `summary` | Counts: `broken` / `held` / `fixed` |
| `headline` | The invariant id this PR moved |
| `invariants[].verdict` | Per-invariant `held` / `broken` / `fixed` |
| `invariants[].residual` / `.perCycle` | The leak size and per-cycle multiple |
| `footprint` / `reactivity_micro` | The statistical trend — read, don't gate on |

#### ✅ Good agent query

"If any `invariants[]` entry has `verdict: broken`, that's a real leak — name the structure (`label`), the residual size (`residual`), and the per-cycle rate (`perCycle`). That's the confident signal; the leaked structure and its multiple are the lead for tracing the leak."

#### ❌ Bad agent query

"Flag the footprint growth." Heap KB is a noisy trend, never a gate — a `watch` is worth a glance, not a block. The broken count invariant is the only confident leak signal.

### Tier 2 — retainer attribution (planned)

Naming *what retains* a leaked object — the backward retainer path from a leaked structure to a GC root — is a planned Tier-2 follow-up, not part of today's comment. The bot today reports the broken invariant(s), the exact counts, and the per-cycle multiple; it does not yet capture a `.heapsnapshot` or print a retainer shape. When wired, Tier 2 will run only on a broken invariant and surface the retainer path that names the holder.

### What to chase / what to ignore (heap)

- **Chase:** any 🔴 broken invariant (a confident leak) — the structure and its per-cycle multiple are the lead.
- **Ignore:** a 🟡 watch on its own (footprint within a few percent is runner drift, not a leak), and the reactivity-micro residual (V8 page-return noise).

---

## Quick Reference

**Performance — section inclusion thresholds:**

- `✅ Faster` — CI entirely below -2% (confident improvement)
- `❌ Slower` — CI entirely above +2% (confident regression)
- `⚪ No Change` — CI entirely inside ±2% (confident unchanged)
- `🔍 Unsure > Inconclusive` — CI straddles ±2% AND observed/expected ratio > 2× (could resolve with more samples or bench is unusually noisy)
- `🔍 Unsure > Too Fast to Measure Precisely` — CI straddles ±2% AND observed ≤ 2× expected (noise floor limited by duration; won't resolve)

**Performance — severity emoji:**

| Emoji | Faster / Slower | |midpoint%| |
|:---:|---|---|
| 🏆 / 🚨 | Extreme | ≥ 75% |
| 🌟 / ‼️ | Very significant | 35 – 75% |
| ⭐ / ❗ | Significant | 15 – 35% |
| (none) | Below threshold | < 15% |

**Bundle — state thresholds (on the worst single real bundle's brotli growth):**

- `⚪ No meaningful change` — nothing cleared the JND, or only `†` bundles moved
- `🟢 Improvement` — only shrinks
- `🟡 Mixed` — both directions, or a lone small increase
- `🟡 Warning` — ≥ 512 B or ≥ 2%
- `🔴 Regression` — ≥ 5 KB, or ≥ 10% on a ≥ 2 KB move
- JND floor (counts as changed): 128 B or 0.5% brotli · `†` = tree-shaken upper bound, never raises the banner

**Heap — state (on the teardown count invariants after 7 churn cycles):**

- `⚪ No leak` — every invariant returned to baseline, footprint within noise
- `🟢 Improvement` — the PR fixes a leak `main` had
- `🟡 Watch` — invariants held but footprint grew past the ±4% floor (never fails CI)
- `🔴 Leak` — an invariant didn't return to baseline (exact count, reported as a per-cycle multiple)
- Counts are exact (no floor) · heap KB is statistical (±4% floor) · `🎯` = the invariant this PR moved

**What to ignore:**

- Bench: Unsure rows in "Too Fast to Measure Precisely" on zero-delta PRs (physics); noise in No Change (absence of signal is the signal for a refactor); count modifiers in Mixed states (magnitude in the tables matters more).
- Bundle: a `†` tree-shaken bundle growing alone (⚪ by design); sub-JND wiggles (already filtered).
- Heap: a 🟡 watch on its own (footprint within a few percent is runner drift); the reactivity-micro residual (V8 page-return noise, not a leak).

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Extend Bench Suite** | `/extend-bench-suite` | Adding a new benchmark to the suite |
| **Improve Performance** | `/improve-performance` | The audit → trace → fix → measure cycle |
| **Investigate Performance** | `/investigate-performance` | A confident bench regression you need to localize |
| **Agent Lessons** | `/agent-lessons` | Understanding how past perf work went |
