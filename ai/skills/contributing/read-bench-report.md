---
title: Reading Bench Reports on PRs
description: How to interpret the in-house bench reporter's PR comment — state banner, severity emoji, the two Unsure subsections, and the JSON adjunct for agent consumption.
keywords: [benchmark, tachometer, PR comment, bench report, noise floor, unsure, autoresearch, confidence interval]
audience: contributing
skill: read-bench-report
type: skill
---

# Reading Bench Reports on PRs

> **Skill:** `read-bench-report`
> **Purpose:** Correctly interpret the bench reporter comment on a PR — what each section means, what to chase, what to ignore.

**Golden rule: confident signals live in the Faster and Slower sections.** `🔍 Unsure` means "the measurement did not resolve," *not* "regression to investigate." A metric in "Too Fast to Measure Precisely" will stay unsure on zero-delta PRs by physics — chasing it wastes time. A metric in "Inconclusive" might resolve with more samples but isn't an actionable signal today.

---

## Comment Anatomy

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

---

## Top Header State — What the Headline Says

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

---

## Faster / Slower — The Headline Verdicts

Metrics land in Faster or Slower only when their 95% CI is entirely above or below ±2%. This is the confident-signal bucket. If a metric is here, **there's a real perf change to discuss.**

### Reading a row

```
| `update-10th` | -62% (34ms) 🌟 |
```

- **`update-10th`** — metric name, links to its `performance.measure(...)` line in the bench source at the run's SHA. Click to see what's actually being benchmarked.
- **`-62%`** — midpoint of the 95% CI for percent change. Sign carries direction (negative = faster; positive = slower). The CI itself is in `bench-report.json`.
- **`(34ms)`** — midpoint absolute-ms delta, unsigned (sign inferred from the section — Faster means time *saved*, Slower means time *added*).
- **`🌟`** — severity emoji. Appears *after* the values so number columns align vertically; lets you scan magnitudes at a glance.

### Severity emoji by |midpoint%|

| Threshold | Faster | Slower | Category |
|---|:---:|:---:|---|
| ≥ 75% | 🏆 | 🚨 | Extreme |
| 35–75% | 🌟 | ‼️ | Very significant |
| 15–35% | ⭐ | ❗ | Significant |
| < 15% | *(none)* | *(none)* | Below threshold — still a real signal, just lower magnitude |

Rows sorted by `|midpoint|` descending, so the biggest effects are at the top.

### Teaser pattern for big PRs

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

---

## No Change — Confirmed Unchanged

Metrics with CI entirely inside ±2%. These are the *positive* signal for a refactor or cleanup PR — proof you didn't regress anything. Always collapsed so the list doesn't dominate mixed-outcome comments, but expand when:

- You're reviewing a refactor and want confirmation nothing moved.
- You want to double-check that a metric you expected to improve didn't actually shift.

Don't expand reflexively on a mixed PR — the Faster/Slower tables have the story.

---

## Unsure — The Two Subsections

Unsure metrics have CIs that straddle the ±2% threshold. The reporter splits them into two buckets by **duration-derived noise analysis**, because they need different responses.

### Inconclusive — boundary cases, more samples might help

```
| `bulk-add-50` | +0.2% – +3.8% | ±4% |
```

- **Change**: CI range straddling ±2%.
- **Expected Noise**: the CI width predicted by the bench's absolute duration and the GHA σ≈2ms jitter floor. The `±4%` here says "at this bench's duration, we'd expect the CI to narrow to about ±4% wide."

A metric lands in Inconclusive when its observed CI width is **more than 2× the expected width** for its duration. That's the "we tried to resolve and couldn't" signal — either more sampling time would settle it, or the bench is genuinely noisier than its duration predicts (worth a second look at the bench itself).

### ✅ When to investigate an Inconclusive row

`create-1k` (~130ms mean) shows CI width ~3.5% while expected is ~1.3%. **2.7× expected** — long benches shouldn't have wide CIs. That's a "this bench has unusual per-sample variance" signal worth tracing to a setup issue or a legitimate GC/allocation pattern.

### ❌ When NOT to investigate

`bulk-add-50` shows CI `+0.2% to +3.8%` with expected `±4%`. **Roughly 1× expected** — this is the boundary CI narrowing right up against the expected noise floor. More samples won't narrow it materially. Treat as no-signal.

### Too Fast to Measure Precisely — physics-limited, ignore

```
| `clear` | -10.2% – +10.7% | ~13ms | ±12% |
```

- **Change**: CI range; often wide on short benches.
- **Test Time**: mean absolute duration.
- **Expected Noise**: at 13ms, GHA's ~2ms absolute jitter becomes ±12% relative. The observed CI width is right at that floor.

These are benches whose duration is short enough that per-sample OS/GC/JIT jitter dominates sub-5% changes. Tachometer literally cannot resolve the signal on zero-delta runs — not a tuning issue, a physical limit of the hardware.

**These benches still work under real perf deltas.** A genuine 30% improvement on `clear` will clear the ±12% noise floor and show up in the Faster section. What they *won't* do is confirm "no change" — they'll default to unsure whenever the true delta is smaller than the noise floor.

### ❌ Common mistake

> "`remove-last` is marked unsure — we regressed it!"

Check if it's in the Too Fast subsection. If the Expected Noise is comparable to the observed CI width, the bench is noise-floor-limited and the verdict is neither regression nor improvement. **Not a regression signal.**

### ✅ Correct reading

> "`remove-last` is in Too Fast to Measure Precisely — mean ~8ms, expected noise ±20%. Zero-delta PRs will always show this as unsure. Move on unless there's a substantive change in the PR that should have affected this code path."

---

## Footer Metadata

```
<sub>Sample size: 50 · Resolution floor: ±2% · Timeout: 3min · Wall-clock: 10m42s</sub>
```

Useful when something looks off — tells you the parameters the run used without opening the raw JSON. If a bench comment is missing metrics, check Wall-clock — if the cell hit the 10-min job cap, some metrics may have timed out before finishing initial samples.

---

## JSON Adjunct — for Agents

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

### Fields agents care about

| Field | Agent use |
|-------|-----------|
| `summary` | One-shot verdict counts; drives decision trees |
| `metrics[].status` | Classification without re-parsing CIs |
| `metrics[].percent_change_ci` | Exact CI bounds for cross-run comparison |
| `metrics[].mean_ms` | Duration for noise-floor reasoning |
| `metrics[].expected_noise_pp` | Floor this run would be limited by |
| `metrics[].observed_noise_ratio` | Ratio ≤ 2 → expected; > 2 → investigate |
| `metrics[].source` | Jump to bench source at this SHA |

### ✅ Good agent query

"For any metric with `status: slower` and `observed_noise_ratio < 1.5`, the regression is real and the CI is tight — worth surfacing to the reviewer."

### ❌ Bad agent query

"Count all `unsure` entries and flag regression." Unsure ≠ regression; the category is defined by "CI straddles ±2% boundary," not direction. Count `slower` instead.

---

## Reading Decision Tree

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

## Quick Reference

**What each section's inclusion threshold means:**

- `✅ Faster` — CI entirely below -2% (confident improvement)
- `❌ Slower` — CI entirely above +2% (confident regression)
- `⚪ No Change` — CI entirely inside ±2% (confident unchanged)
- `🔍 Unsure > Inconclusive` — CI straddles ±2% AND observed/expected ratio > 2× (could resolve with more samples or bench is unusually noisy)
- `🔍 Unsure > Too Fast to Measure Precisely` — CI straddles ±2% AND observed ≤ 2× expected (noise floor limited by duration; won't resolve)

**Severity emoji cheat sheet:**

| Emoji | Faster / Slower | |midpoint%| |
|:---:|---|---|
| 🏆 / 🚨 | Extreme | ≥ 75% |
| 🌟 / ‼️ | Very significant | 35 – 75% |
| ⭐ / ❗ | Significant | 15 – 35% |
| (none) | Below threshold | < 15% |

**What to ignore:**

- Unsure rows in "Too Fast to Measure Precisely" on zero-delta PRs — physics.
- Noise in the No Change section — that's the *absence* of signal, which is the signal for a refactor.
- Count modifiers in Mixed states (Net Positive/Negative/Balanced) — magnitude in the tables matters more than count.

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Extend Bench Suite** | `/extend-bench-suite` | Adding a new benchmark to the suite |
| **Agent Lessons** | `/agent-lessons` | Understanding how past perf work went |
