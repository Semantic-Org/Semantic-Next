# SSR Hydration Skill Update — Eval Results

## Summary

Three iterations of the eval loop. Final scores against the 27-assertion rubric (5 evals, opus judge):

| Configuration | Score | % |
|---|---|---|
| **Baseline (no skill, allowed source code reads)** | 21/27 | 78% |
| **Iteration 1 (skill snapshot, pre-update)** | 25/27 | 93% |
| **Iteration 2 (skill update: gotchas + classifier + skipFirstWrite)** | 26/27 | 96% |
| **Iteration 3 (polish: name skipFirstWrite as grep-able)** | 27/27 | 100% |

**Final delta: +22 percentage points** over baseline (78% → 100%).

The baseline ran high (78%) because subagents aggressively read source code to derive answers. The skill's value is in *elevating* the signal — making non-obvious findings immediately accessible without requiring multi-file source archaeology, and establishing canonical framings (e.g., snippet-in-each is the same family as each-external-state).

## Per-eval breakdown

| Eval | Concept | Baseline | Iter 1 | Iter 3 | Δ vs baseline |
|---|---|---|---|---|---|
| 0 | innerHTML doesn't process DSD | 4/5 | 5/5 | 5/5 | +1 |
| 1 | Template.isServer in browser env | 5/5 | 5/5 | 5/5 | 0 |
| 2 | each-block external state | 5/6 | 5/6 | 6/6 | +1 |
| 3 | Bench noise floor scaling | 5/6 | 6/6 | 6/6 | +1 |
| 4 | Snippet-in-each (same family) | 2/5 | 4/5 | 5/5 | **+3** |

The biggest absolute gain (eval 4) was framing snippet-in-each as the same root cause as the each-external-state bug, plus naming PR #175's classifier and the unskipped regression test. Without the skill, baseline agents pursued plausible but wrong alternative theories.

## Skill changes landed

1. **New "Critical gotchas" section near the top** — covers innerHTML/DSD, Template.isServer, bench noise floor, cross-session phantom regressions. These are silent-failure modes that cost real investigation time when missed.
2. **`hydrateMarkers` Pass 1 description updated** — replaced the legacy "reference DOM parallel walk" framing with the Plan 04 `data-sui-bind` fast path; legacy walker noted as fallback.
3. **New "skipFirstWrite contract" subsection** — explicitly names the flag, explains evaluation-as-witness, ties to `Dependency.depend()` no-op outside Reactions.
4. **New "Each-block hydration: lazy by default, eager when content reads external state" section** — covers the lazy/eager classifier, conservative bails (no-`as`, snippet/template/rerender/async), the inpage-menu canonical repro, and per-AST identity caching.
5. **Quick Reference updated** — added EACH BLOCK HYDRATION block and TESTING/BENCHING TRAPS block with the four silent-failure modes.
6. **Key Files updated** — added `each-content-classifier.js`, `reactive-data.js`, the canonical test files.

## Methodology notes

- **Baseline = no skill, but allowed source reads.** This is the harshest baseline because subagents are good at code archaeology. A weaker baseline (no source access) would show a much larger delta but wouldn't reflect real-world agent behavior.
- **Opus grader** per user direction (technical content). Strict pass/fail per assertion.
- **Iteration baseline reuse**: baseline runs from iteration 1 were reused for iteration 2 since the baseline configuration didn't change.
- **One assertion (eval 2 F) was a strictness call**: iteration 2's answer conveyed the substantive content of the skipFirstWrite contract but didn't name the flag literally; grader marked FAIL. The iteration 3 polish prompted the skill to surface the flag name explicitly, which fixed it.

## Files

- Skill (updated): `/home/jack/semantic/next/ai/skills/authoring/ssr-hydration.md`
- Skill snapshot (pre-update): `skill-snapshot/ssr-hydration.md`
- Eval prompts: `evals.json`
- Rubric: `rubric.md`
- Per-iteration outputs and grading: `iteration-1/`, `iteration-2/`, `iteration-3/`
