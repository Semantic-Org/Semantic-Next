---
title: Contributor Calibration
description: The objective functions this codebase optimizes and the epistemic rules for claims made while contributing — what counts as evidence, what to optimize, and how agents and human contributors keep each other calibrated.
keywords: [calibration, objective function, evidence, hypothesis, verification, benchmarks, failing test, bisect, provenance, collaboration, epistemics]
audience: contributing
skill: calibration
type: skill
---

# Contributor Calibration

> **Skill:** `calibration`
> **Purpose:** What this codebase optimizes, what counts as evidence for a claim, and how contributors — human and agent — keep each other calibrated

**Golden rule: calibration is two skills — choosing the right objective and knowing when a claim is actually established. The expensive mistakes in this repo's history are competent optimizations of the wrong objective, and confident claims that were never tested.**

---

## The Objective Functions

These are what the project optimizes, in the order conflicts resolve. When two of them collide, the one higher in this table wins.

| Objective | What it means in practice |
|---|---|
| User-felt behavior | A change users can feel beats any internal metric. A perf win below human perception that costs debugging ergonomics is a net loss. |
| Externally visible benchmarks | The js-framework-benchmark numbers are the public record. A change that wins internal benches and loses krausest gets reverted — internal metrics do not compensate. |
| Shipped bytes | Most compiles happen in the browser via CDN, so runtime-package size is user-facing performance. Measure minified + brotli on any runtime-shipped change without being asked — CI reports timing only, so byte costs are silent by default. |
| First-contact ergonomics | Design APIs for the first five seconds of real use. The most common act on any value a handler receives is logging it — a design that survives spec review but fails `console.log` inspection is the wrong design. |
| Best API over compatibility | Pre-1.0, propose the cleanest design first and verify actual blast radius. Do not preserve dual formats to protect output that was buggy — wipe and reset beats compatibility cruft. |
| Smallest structure the constraint demands | Size a change from the constraint and the existing seam, not from pattern completion. When the implementation estimate far exceeds the conceptual delta, that gap is the signal you are building symmetry, not solving the problem. |

```text
❌ "This refactor improves our internal each-mount bench 9%" (krausest regressed 4%)
✅ Revert. The externally visible number is the objective.

❌ A second helper, an export, and a registry entry "for consistency" with a sibling module
✅ The three lines the constraint actually demands, at the existing seam
```

Description length follows the same logic: artifacts scale with the diff, not with how interesting the work was. A two-line fix gets one sentence and a risk score. The diff is the evidence — the text gives orientation, in words a competent engineer with zero knowledge of this codebase's internal vocabulary can follow. Name code regions by their job ("the code that builds the arguments every event handler receives"), never by terms coined during the work.

---

## Epistemic Classes

Every claim a contributor makes belongs to a class, and the class determines what you may say about it.

| You have | You may claim | You may not claim |
|---|---|---|
| A source-reading trace, however careful | A hypothesis | "Verified", "confirmed", a bug report |
| A failing test that reproduces it | A fact, scoped to what the test shows | Anything broader than the test's shape |
| A bench verdict in the confident bucket | A real cost, located somewhere reachable | That you know *where* the cost is paid |
| A passing suite | The checked surface holds | That unstated invariants hold |
| "Nothing I tried could disprove X" | Nothing | "The evidence points to X" |

The last row is the elimination trap. A conclusion that survives because it cannot be falsified — V8 internals, GC, harness noise — carries no evidentiary weight. When reading cannot localize a cost, the move is mechanical, not clever: bisect. Revert only the suspect on the same branch and re-measure. PR #229's "profile-only V8 effect" was three `.bind()` calls, found in one revert cycle after extended reading had parked it in fog.

### Rules that follow

**Write the failing test first, watch it fail, then fix.** A hypothesis-class finding becomes a fact at the moment a test reproduces it, and not before. The failing run also pins the exact repro, so the fix cannot quietly solve an adjacent problem and leave the original breathing. No fix ships without its repro test.

**One failing expectation is evidence about your test first.** Generalizing from a single failing assertion to "the framework doesn't support X" is the most common overclaim shape. Before claiming a defect, vary the shape: the same behavior in a different structural position usually splits "broken" into "broken in exactly this shape," which is a different and more useful fact.

```text
❌ "Subtemplate events don't fire" (one failing expect, published as a finding)
✅ Three variants: top-level passes, wrapped-in-each passes, bare-in-each fails.
   The claim is now "events fail when the invocation is the top level of
   each-item content" — narrow, mechanical, and it survived review.
```

**Untested is not the same as working.** The complementary failure: a behavior nobody wrote a test for can be silently broken for months while every example happens to avoid the failing shape. Rewrites are the classic source — they preserve the checked surface (tests, examples) and shed invariants nobody wrote down. When a behavior matters, the invariant belongs in a test, not in someone's head.

**Date a bug before attributing it.** `git log -S` on the construct, or an engine-forked test when two implementations exist, tells you which change introduced a defect. Provenance narrows the mechanism and keeps the report factual — "introduced in the X refactor" is a different and better claim than "this system is broken."

**Know what a measurement actually compared.** CI builds benchmarks from the main branch in both arms, so a PR that only changes bench files produces a null comparison by design — its per-metric verdicts measured nothing about the change. The anti-gaming property is deliberate: an agent optimizing perf must not be able to improve numbers by editing the measuring stick. Read every report by first asking what was on each side.

**Confident measurements beat your mechanism model.** The harness has been validated against null changes — behavior-preserving PRs produce zero confident verdicts. When a confident result contradicts your model of the code, the model is wrong. Update cleanly and without ceremony: no "I'm not an expert but" disclaimers on the way in, no self-flagellation on the way out.

**A wall is a hypothesis.** "Not possible", "not permitted", "the tool can't" — when evidence contradicts a wall, investigate the wall. The same applies to giving up: "structural problem" and "diminishing returns" are signals to bring fresh eyes, not conclusions. Repeatedly in this repo's history, the push past a graceful-completion summary is where the actual progress was.

---

## Working With Each Other

Contribution here is collaborative between humans and agents, and the calibration burden is mutual.

**Surface findings and propose the fix shape before editing.** Even small changes, even when working in parallel. A finding presented with a proposed shape invites correction at the cheapest possible moment — before any code exists to be attached to.

**Push back with evidence.** Agreement is not a contribution. When you hold evidence that a suggestion is wrong — a trace, a measurement, a prior PR that tried it — present it directly. The counterpart rule: when someone pushes back on your claim and they hold contradictory experience, treat their pushback as data about your claim's scope, not as resistance to overcome. Both directions of this loop have caught real bugs.

**Fresh eyes need pruned context.** A second opinion contaminated by your solution momentum explores your neighborhood and confirms your direction. When delegating for a genuinely independent take, transfer the problem knowledge — constraints, symptoms, invariants — and structurally withhold every approach you have tried. The `fresh-take` skill is the procedure. Independent reconvergence is strong evidence; a fresh derivation that lands on your same wall means the wall is probably real.

**Report state, not effort.** Outcomes faithfully: failing tests with their output, skipped steps named as skipped, done things stated plainly without hedging. Process narration — "verified", "carefully checked", "ran the full suite" — performs thoroughness without adding information. The diff, the test counts, and the measurements are the report.

**Prior attempts are searchable history.** Before proposing an optimization or design, check whether a closed PR already tried it and what the measurement said. An idea that was tried and measured flat needs a new argument, not a re-proposal. Equally: record *why* something was closed, because the next contributor's good idea is often the last contributor's closed PR.

---

## Quick Reference

```text
Conflict resolution:   user-felt > krausest > bytes > ergonomics > clean API > less structure
Claim classes:         reading = hypothesis · failing test = fact · confident bench = real cost
                       "couldn't disprove" = nothing
Before claiming a bug: vary the shape, date it with git log -S, then write the failing test
Before optimizing:     check closed PRs, know what the bench compares, measure bytes
Before editing:        surface the finding, propose the shape, wait for sign-off
When stuck:            bisect before theorizing · fresh-take before giving up
When measured:         the data wins, update cleanly
```

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Fresh Take** | `fresh-take` | Delegating for an uncontaminated second opinion |
| **Improve Performance** | `improve-performance` | The full audit, trace, fix, measure cycle |
| **Reading Bench Reports** | `read-bench-report` | Interpreting CI bench verdicts on a PR |
| **Authoring Pull Requests** | `author-pull-requests` | Titles and descriptions that scale with the diff |
| **Agent Lessons** | `agent-lessons` | Distilled traps from previous agent sessions |
