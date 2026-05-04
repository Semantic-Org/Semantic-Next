---
title: Authoring Pull Request Titles and Descriptions
description: How to write PR titles and bodies that read like a colleague's quick note, not AI prose. Covers tier triage, title compression, body shape per tier, the AI tells that betray inauthentic writing, and the underlying instincts behind them. Use this skill before drafting any PR title or body, before invoking `gh pr create`, or whenever editing a PR description — even when not explicitly asked.
keywords: [pull request, PR, title, description, body, gh pr create, review, tier, risk, anti-patterns, prose, human writing, AI tells]
audience: contributing
skill: author-pull-requests
type: skill
---

# Authoring Pull Request Titles and Descriptions

> **Skill:** `author-pull-requests`
> **Purpose:** Drive PR titles and bodies that read like a colleague's quick note rather than AI prose

**Companion skills:**
- `docs-ai-tropes` — catalog of 30+ named AI writing tells (em-dash addiction, magic adverbs, "Here's the kicker", etc.). Load when you suspect prose drift beyond the PR-specific patterns below.
- `docs-writing` — broader prose quality framework for documentation; some principles transfer.

---

## Why this matters

PR descriptions on this repo are public. They're read by community users, downstream consumers, and contributors browsing GitHub. Write them as a public changelog entry for an open source project, in the tone of a colleague leaving a quick note.

Public changelog tone is matter-of-fact. State what changed and why a consumer should care. Don't argue. Don't perform thoroughness. Don't assume the reader has been following along.

AI-written prose tells immediately because it's trying to convince the reader the work was thorough and correct. Humans spot it. The diff is the evidence. Your text gives orientation.

If you catch yourself writing to demonstrate thoroughness or pre-empt skepticism, stop. Cut the offending text and go back to plain description.

---

## What the reader actually wants

The reader opens GitHub, glances at the title, skims the body, then reads the diff if they're a reviewer. Your text gives them just enough to:

1. Know what kind of change this is — **the title**
2. Know why it exists as a unit — **the framing**
3. Know what's now true after merge — **outcome bullets**

That's the entire job. Anything beyond is noise that erodes trust.

---

## Tier triage (do this first)

Tier by what the reviewer has to do, not by line count. A 500-line docs PR is Small; a 30-line change to the renderer's hot path is Large.

| Tier | Reviewer behavior | Examples |
|---|---|---|
| **Small** | Rubber-stamp | Chores, docs, harness, comments, dead-code removal, dep bumps with no API change, content additions |
| **Medium** | Read the diff carefully | Code change with bounded user-visible effect; one feature or module |
| **Large** | Slow down; consider failure modes | Implements a plan, crosses package boundaries, touches load-bearing internals (renderer, reactivity, templating, compiler), or changes a public API |

**Self-test, in order:**

- If you can't name a failure mode worth listing → it's not Large
- If you can't name a user-facing behavior change → it's not Medium

If both fail, it's Small. Most PRs are Small. Resist the urge to upgrade — Medium/Large machinery on a Small PR is itself an AI tell.

---

## Title

Format: `Category: Description` (matches `<commit_format>` in AGENTS.md).

After the prefix:

- **3–5 words.** Each one carries meaning. After drafting, do a Hemingway pass: remove every word that doesn't pull weight.
- **Concept names, not paths.** `Make Integrations Folder`, not `Move integrations/astro/src/`. Paths belong in body bullets if they help; titles work at concept level.
- **Concrete verbs.** Make / Move / Swap / Group / Add / Remove. Avoid Relocate / Re-anchor / Configure (formal/abstract). Avoid Drop (SQL connotations).
- **Title is the primary change only.** Secondary work goes in body bullets — never `X and Y` titles.
- **Don't lead with `BREAKING:` even for breaking changes.** The Risk score + changelog automation already signal the breaking nature. Use the prefix that describes the change *kind* — `Refactor:`, `Perf:`, `Feat:` — and let the Risk/changelog do the warning work.

### Worked examples (real PRs from this project)

| First-draft (AI-shaped) | Final (human-shaped) | What changed |
|---|---|---|
| `Refactor: Relocate astro integration to integrations/ and prep for publish` | `Chore: Make Integrations Folder and Move Astro` | Stripped destination path; dropped secondary "prep for publish"; concept names |
| `Build: Move bench tooling under tools/ci/bench/ and relocate bench-history.json` | `Chore: Group CI Bench Tools` | Dropped destination path; dropped `and` clause; concept-level verb |
| `Chore: Remove broken package.json refs` | `Chore: Remove Vestigial package.json Entries` | Word precision — "vestigial" matched the actual nature (harmless leftovers); "broken" implied active failure |

The recurring fix: cut implementation detail, pick precise words, keep one idea per title.

---

## Body shape

### Small tier

One framing sentence. `## Changes` is optional — omit when the title says it all.

```markdown
Cleanup — remove configs and assets that aren't wired up.

## Changes
- Remove stale dotfiles and workflows
```

That's the whole body. No section headers beyond `## Changes`. No risk score. No test plan.

### Medium tier

```markdown
[Framing. One or more sentences. Methodology fixes often need a paragraph
or two to explain what was wrong before what's fixed. State the problem
in plain language a downstream consumer can act on.]

## Changes
- [Outcome bullet]
- [Outcome bullet]

## Risk
N/10 — [one-line reason].
Failure modes: [bulleted list — only when score ≥ 5 or blast radius is non-obvious]

## How to Test
- [Deviations from standard only. Skip "rerun tests" / "CI passes" — those are assumed.]
```

**Framing length.** As many sentences as the change genuinely needs to explain itself. Methodology bugs typically take 2–3 paragraphs (what was wrong, why it was wrong, what's fixed). Refactors take one. The test is whether removing a sentence loses information a downstream consumer needs. If not, cut.

**Bullet count.** As many bullets as there are distinct outcomes. Two outcomes means two bullets. Don't pad to reach a target. Don't compress past clarity.

**Word target.** Most bodies land 80–200 words. Past 300 is usually restating the diff. After drafting, expect to cut roughly a third. The AI default is twice the length humans actually write.

### Large tier

Same as Medium, plus:

- If plan-driven, open with `Implements [plan name](permalink-at-PR-creation-SHA).` on its own line, then a paragraph break, then the framing. Don't fold the plan link into the same sentence as the framing. Separation makes both surfaces easier to scan. Get the SHA via `git log -1 --format=%H ai/plans/foo.md` and form `https://github.com/Semantic-Org/Semantic-Next/blob/<sha>/ai/plans/foo.md`.
- `## Risk` failure-modes list is mandatory.
- Body may be longer, but bullets still describe outcomes, not mechanisms.

---

## Terseness — match how humans actually write

The single most common drift in AI-authored bullets is verbosity. A bullet that takes 15 words to say what 5 words could say is performing thoroughness. Humans don't write that way when describing state — they say the thing and stop.

### Three terseness rules

**1. Cut justification clauses.** When you remove something, don't explain why in the bullet. The "why" goes in the commit message or PR conversation if it matters. Bullets just name the thing.

| ❌ Justifies the change | ✅ Just names it |
|---|---|
| Remove the `_studio.yml` workflow now that Astro Studio is sunset | Remove Astro Studio workflow |
| Drop the root `prettify` script that called an uninstalled binary | Drop vestigial `prettify` script |
| Remove `.env` since it only contained `OCO_*` opencommit vars | Remove `.env` |

The "now that X is sunset" / "that called Y" / "since Z" clauses are all the same instinct: defending the removal. Cut them.

**2. Cut scaffolding bullets.** A bullet that's *implied* by the bullets above it is scaffolding. Reviewers see the implication; spelling it out is padding.

| ❌ Scaffolding | ✅ Removed |
|---|---|
| - Move `bench-matrix` and `bench-reporter` under `tools/ci/bench/`<br>- Move `bench-history.json` next to the reporter<br>- **Update workflow and script path references to match** | Three bullets become two — the path-update bullet is implied by the moves and visible in the diff |

If a bullet's outcome is the obvious consequence of bullets above it, drop it.

**3. Tight framing sentences.** Don't pad the framing line with explanatory tail clauses.

| ❌ Padded | ✅ Tight |
|---|---|
| Routine refresh of direct deps in `docs/` and root, plus the lockfile churn that follows. | Routine dep refresh in `docs/` and root, plus lockfile. |
| CI-only bench tooling lives under `tools/ci/bench/` so the top-level `tools/` directory only contains developer-runnable harnesses. | CI bench tooling lives under `tools/ci/bench/`. |

If the framing sentence has a "so that" / "plus the X that follows" / "in order to" tail, the tail is usually padding.

### Subgroup long sections

If a `## Changes` subsystem section grows past ~8 bullets, split with bold sub-labels rather than adding heading levels (the navigation generator reserves `####` and below for in-page menus):

```markdown
### Templates

**Events**
- ...
- ...

**Keys**
- ...

**Tree traversal & wiring**
- ...
```

The labels match the natural axes a reviewer scans by — what surface area they care about. Pick labels that match the headings the package's docs use, not arbitrary categories.

### Bullet shape

Bullets describe state in plain language. Either short noun phrases or full sentences in present tense work. The AI tell isn't full sentences per se. It's *corporate-prose* sentences ("This update enhances...", "This change provides...", "We have added..."). The smell test: would you text this to the reviewer?

```
❌ "This change enables the system to remove the throwaway profiling artifacts."
❌ "Remove the throwaway profiling and screenshot artifacts from the repo root."
✅ "Remove root profiling/screenshot artifacts"
✅ "Test runner now shows drift if main has changed significantly between iterations"
```

**Pick one voice across all bullets.** Don't mix imperative ("Remove X"), declarative state ("X removed"), and active past with for-clause ("Dropped X for Y"). Mixed tenses read AI-shaped. No human drifts mid-list.

### Italics for contrast pairs

Use `*X* vs *Y*` when the body needs the reader's eye to land on a comparison. Sparing. Once or twice per body, not a stylistic mannerism.

```
✅ "Helps determine whether regressions represent *changes in the PR* versus *changes in main*"
```

---

## Selectivity — don't bullet everything

A bullet should answer one question: **what does the reviewer take away that the diff doesn't make obvious?** Trivial cleanup that accompanies the main change goes silently in the diff. If a reviewer would shrug and say "yeah obviously," the bullet shouldn't exist.

| ❌ Bulleting trivia | ✅ Selective |
|---|---|
| - Remove unused linter configs<br>- Remove sunset Astro Studio workflow<br>- Remove root profiling/screenshot artifacts<br>- Drop vestigial `prettify` script<br>- **Convert `light-dom-prerender` plan to `.md` and drop duplicate `-tdd.html`** | Same four bullets without the last one — the rename is incidental cleanup that lives in the diff, not in the body |

When in doubt: if a bullet is a different *kind* of action than the others (rename amid removals; doc-link fix amid moves), it's probably trivia. Cut it or roll it up.

### Roll up bullets that share an action

Five "Remove …" bullets describing the same kind of cleanup should collapse to one. Reviewers learn nothing extra from the splits.

| ❌ Split | ✅ Rolled up |
|---|---|
| - Remove `.eslintrc.cjs`<br>- Remove `biome.json`<br>- Remove `.commitlintrc.cjs`<br>- Remove `.prettierrc.json`<br>- Remove `.prettierignore` | - Remove unused linter/formatter dotfiles |

The list of specific files belongs in the diff. The bullet's job is to tell the reviewer the *category* of cleanup.

---

## Intent over state, state over mechanism

There are four layers a bullet can sit at. Reach for the highest one that's still accurate.

| Layer | Example | Why |
|---|---|---|
| ❌❌ Internals | Let `deep` events bypass the line-538 range filter alongside `global` | Narrates the diff at the internal-mechanism level; means nothing to a reader who hasn't traced the call graph |
| ❌ Mechanism | Update path references across 4 workflow YAMLs and 6 scripts | Restates the diff |
| ✅ State | `deep` events fire on slotted content (was filtered out) | Describes what's now true at the user-facing layer |
| ✅✅ Intent | Move `bench-matrix` and `bench-reporter` under `tools/ci/bench/` so CI-only tooling lives in one place | Captures the developer's purpose — what the change *was for* |

The single most reliable test: **would this bullet mean anything to a reader who hasn't read the diff?** If the bullet references line numbers, internal field names that aren't public API, or "alongside X" cross-references that only resolve once you've traced the code path, you're in the Internals row. Rewrite at the State or Intent layer.

When you can name the *why* in one short clause, lead with that. State bullets are fine when intent isn't crisp — but if the intent is clear (you're creating a category, simplifying a surface, separating concerns), the bullet should *say* it.

A useful test: read each bullet aloud. If it describes work you performed (verbs of editing — *update, add, drop, edit, rename*), rewrite to describe state. Then ask: "is there an intent-level rephrasing that captures the *why*?" If yes, prefer that.

### Explain the reasoning, not the failure of the previous mode

A subtle bullet drift: writing the change as "X no longer does Y" or "Y is now Z" describes the delta — what flipped. That's a step better than mechanism, but the strongest version explains *the reasoning that produced the change*: the technique, the design choice, the insight.

| Layer | Example (perf rewrite of `weightedObjectSearch`) |
|---|---|
| ❌ Delta | Equal-weight items no longer return in first-seen order |
| ✅ State | Equal-weight items now return in randomized order |
| ✅✅ Reasoning | Implements a single-pass weighted reservoir; equal-weight tie order is random as a consequence of the algorithm |

The reasoning version tells the reviewer *why* (the algorithm choice) and *what falls out* (the tie-order shift) in one breath. The delta version frames the same change as the prior code's failure.

### Lead with the headline

If the PR has a single headline metric or fact (a measured perf win, a removed dependency, an API consolidation), lead the framing sentence with it. Don't bury it in a bullet.

| ❌ Buried | ✅ Lede |
|---|---|
| *Framing:* Replace the O(n²) ranking scan with a single-pass weighted reservoir.<br>- Single-pass weighted reservoir replaces the quadratic scan<br>- 8× faster on 1k lists, 50× on 10k | *Framing:* 8× faster on 1k-item lists, 50× on 10k. Single-pass weighted reservoir replaces the O(n²) ranking scan in `weightedObjectSearch`. |

The reviewer's eye should land on the headline first.

### When a bullet sounds weird, investigate before polishing

A meta-principle: if a bullet you're about to write makes you ask "wait, why is that the case?" (e.g., "the function now returns in random order" — *why would anyone want that?*), that's a signal the change itself needs investigation, not a sentence to polish around. Either:

- Justify the trade-off explicitly (deliberate)
- Flag it as a humility check in failure-modes
- Or fix the underlying issue before the PR ships

Authors who polish suspicious bullets into smooth prose ship subtle bugs. Reviewers who read smooth prose without questioning it merge them.

---

## Risk score is routing metadata, not a confidence performance

The Risk score is the chance of regression from this changeset, anchored to surface area — how many users sit on the affected code path. Don't catastrophize. Don't pad to look responsible. Don't deflate to look confident.

| Score | When to use |
|---|---|
| **0/10** | Tests, harness, docs only. No public code modified. Always 0 in this case. |
| **1–4** | Public code touched, but usage estimates suggest the path is rarely hit. |
| **5–6** | Coin toss whether a given user is on this code path. |
| **7–10** | Common code path. Effectively all users sit on it. |

**Risk section is shorter than other sections.** It doesn't list each failure verbatim. It points to where to look for downstream effects. "This modifies the `Template` class which has downstream implications for the renderer" is enough — the reviewer chases the thread. A failure-modes list goes in only when the surface is genuinely non-obvious (see below).

## Failure modes are humility checks, not breaking-change rehash

The failure-modes list serves a specific purpose: **giving a red-team reviewer a map of where you might have made a mistake.** It's a humility artifact — "I think I did everything, but if I didn't, here's the blast radius."

It is not:
- A list of predictable consequences of breaking changes (those go in the Changes list)
- User-impact warnings ("downstream importers break at module load")
- Things the diff already makes obvious

It *is*:
- Subtle behavior shifts you can't fully prove out (e.g., "subtle reactivity changes in the component renderer due to signal ergonomics — worth a careful read of the renderer's hot path")
- Areas where the test surface is thin and you're relying on intuition
- Latent bugs you know about but couldn't fix in this PR
- Performance regressions you observed but couldn't fully characterize

Test: for each failure mode, ask "would this give a reviewer a useful place to focus critical attention?" If it's just restating a Changes bullet at the user-impact layer, drop it.

| ❌ Breaking-change rehash | ✅ Humility check |
|---|---|
| Downstream code importing removed tracing helpers breaks at module load | Class-instance signals under `mutate()` reference mode have a known latent bug — followup at `ai/plans/X.md` |
| Subclasses overriding `equalityFunction` silently fall back to default | Bulk list-replacement perf regresses vs clone-on-read; under investigation |
| Code relying on old clone-on-read semantics now mutates shared references | Subtle reactivity changes in the component renderer due to signal-ergonomics shift — worth a careful read of the renderer's hot path |

Include the failure-modes list when the score ≥ 5 OR when there are real humility checks worth naming. For low-risk PRs with no humility-check items, the list is noise — skip it.

---

## Hotlinking

**Default: don't.** Mentioned files don't need links — reviewers can find them.

**Exceptions:**

- Plan-driven Large PRs: link the plan at the PR-creation SHA
- Large PRs with a specific code site reviewers should look at first: `...#L123`

Package names (`@semantic-ui/astro`) and shell commands (`npm test`) stay backticked-only — they're not paths.

---

## PR-specific tells

These come from one root instinct: **wanting the reader to know you did good work.** They show up in PR descriptions specifically. Recognize the instinct and you'll catch variants. For the broader catalog of prose tells (em-dash addiction, "Here's the kicker", false vulnerability, etc.), load `docs-ai-tropes`.

### 1. Process narration

Words: *verified, ensured, tested, considered, decided, ran, checked*. These narrate what *you* did. Humans describe the state, not the work.

```
❌ "Verified `npm install` succeeds; tested locally that astro picks up the new path; ran the full suite."
✅ (Write nothing. The CI status badge says install succeeded.)
```

### 2. Parenthetical proofs

`(verified — zero diff on pristine main)`, `(per discussion)`, `(per request)`. These read as defense, not description. If a reviewer wonders, they ask — answer in PR comments then.

```
❌ "Move docs to bare specifier (verified resolves correctly via the workspace symlink)"
✅ "Move docs to bare specifier"
```

### 3. Pre-checked test plans

Pre-checked checkboxes are theatre. Either skip the section entirely (default for Small/Medium) or list **only deviations from standard** that the reviewer should attend to. "All tests pass" is the assumed baseline; saying it is performance.

### 4. "Out of scope" sections

Pre-empts a question that may not get asked. Saying it preemptively makes the reader wonder *why* — what are you defending? If a reviewer wonders why X isn't included, they'll ask.

### 5. Comprehensive listing

Listing every file or knob touched performs thoroughness the diff already shows. A bullet at the right concept level covers many file changes.

```
❌ - Update `.gitignore`
   - Remove `tools/bench-matrix/discover.js` self-reference
   - Update `.github/workflows/benchmarks.yml` lines 12, 17, 51
   - Update `.github/workflows/benchmarks-report.yml` lines 48, 52, 96, 108, 199
   - Update `tools/ci/bench/reporter/reporter.js` default historyPath
   - ... (12 more bullets)

✅ - Move `tools/bench-matrix` and `tools/bench-reporter` under `tools/ci/bench/`
   - Move `bench-history.json` next to the reporter
```

### 6. Verb-first mechanism frames

Bullets that lead with `Let X...`, `Stop Y from...`, `Wire A before B`, `Make Z behave...` describe what *the change does to the code*, not what's now true for the reader. They're a softer form of diff narration. Rewrite as state.

| ❌ Verb-first mechanism | ✅ State / fix |
|---|---|
| Let `deep` events bypass the range filter alongside `global` | `deep` events fire on slotted content (was filtered out) |
| Stop `bindKey` from stacking duplicate document keydown listeners | `bindKey`/`unbindKey` cycles no longer stack listeners |
| Wire `setParent` before `attach` in the lit engine | Subtemplate settings init correctly in the lit engine |
| Make `find*` accept kebab tag-names | `find*` helpers accept kebab tag-names |

Words to look out for at the start of a bullet: *Let, Stop, Wire, Make, Force, Allow, Prevent, Cause, Drive*. Most rewrite cleanly to "X now does Y" or "Fixes Y."

### 7. Internal symbols and line numbers

Line numbers (`line-538`), internal field names (`_childTemplates`, `eventSettings.querySettings`), and cross-references like "alongside `global`" or "the spread that leaked closure values" all assume the reader has the diff open in another tab. They don't. The diff is the diff; bullets should describe what's true above it.

| ❌ Internals jargon | ✅ Public-facing |
|---|---|
| Drop the spread that leaked closure values from `find*` returns | `find*` helpers expose parent state and data alongside the instance |
| Bypass the line-538 range filter for `deep` and `global` | `deep` events fire on slotted content |

Public API names (`attachEvent`, `dispatchEvent`, `setParent`, `findParent`, `useSignal`) are fine — they're the contract. Internal field names and call-graph trivia are not.

### 8. Conversational offers

PR descriptions state facts, not offers. Phrases like *happy to add as a follow-up*, *let me know if you want*, *would you like me to*, *feel free to* read as conversational AI. They have no place in a PR body. If a follow-up is worth mentioning, state it as a fact.

```
❌ "A `seed` parameter would restore determinism — happy to add as a follow-up."
✅ "Determinism via a `seed` parameter is a possible follow-up."
```

### 9. Word imprecision

Pick the word that matches the *actual nature* of the change. AI writing reaches for stronger or more generic words; precision builds trust.

| ❌ Imprecise | ✅ Precise | When to use the precise word |
|---|---|---|
| broken | vestigial | Leftovers that don't actively harm anything |
| broken | stale | Outdated config that no longer reflects reality |
| broken | bug | Something that actually fails at runtime |
| update | bump | Version increment of a dep |
| update | refresh | Pulling latest within existing version constraints |
| ensure | (cut entirely) | The verb is almost always implicit; remove it |

---

## Recurring failure modes per PR type

### Dep refresh / dep bump PRs

These tempt the most over-writing. The lockfile is huge; the impulse is to narrate the size.

**Don't include**:

- `## Risk` or `## Failure modes` (irrelevant for refreshes)
- Enumerated list of every package that moved (the lockfile diff shows that)
- Version-pair recitation (`x.y.z → a.b.c`)
- npm audit alert tally
- "All N tests pass" line

**Do include**: title + 1–2 sentence framing.

### Plan-driven Large PRs

Lead the framing sentence with `Implements [plan](permalink)`. Bullets describe plan outcomes in plain language. Don't list every plan step touched.

### Move/relocate PRs

Title at concept level (the *destination concept*, not the literal new path). Bullets describe the move at the role level, not the file level.

### Bug PRs

Lead the framing with how the bug surfaced — what someone was doing when they hit it. The compact pattern is three beats. Discovered while [X], caused by [Y], so [Z]. Humans usually remember *where* they hit a bug. AI prose skips the discovery and starts at the technical formulation.

| ❌ Abstract first | ✅ Discovery first |
|---|---|
| Per-item bindings inside each blocks lost reactivity to external state when items came from static props. | This bug was discovered while debugging hydration issues with `inpage-menu` in docs. Per-item bindings inside each blocks lost reactivity to external state when items came from static props. |

---

## After drafting, do this checklist

In order:

1. **Hemingway pass on the title.** Cut every word that doesn't carry meaning.
2. **Bullet shape sweep.** Are bullets noun phrases or short verb phrases under ~10 words? Rewrite long ones to be tighter.
3. **Selectivity sweep.** For each bullet ask: would a reviewer learn this from the diff alone? If yes, the bullet is trivia — drop it. Especially watch for incidental cleanup (a rename mixed with removals, a link fix mixed with moves) — those usually belong silently in the diff.
4. **Roll-up sweep.** Multiple bullets sharing the same action ("Remove A", "Remove B", "Remove C") should collapse to one ("Remove unused tooling configs (A, B, C)").
5. **Intent rewrite.** For each bullet ask: is there an intent-level rephrasing that captures *why* the change exists? "Move X to Y" describes state; "Create Y for grouping X-class things" describes intent. Prefer intent when the why is crisp.
6. **Cut justifications.** Search bullets for "now that", "since", "to satisfy", "because", "that doesn't" — usually defensive padding.
7. **Cut scaffolding bullets.** If a bullet states the obvious consequence of bullets above it ("update path references to match"), drop it.
8. **Trim framing sentence tails.** "so that…", "plus the X that follows", "in order to…" — usually padding.
9. **Search for AI tells (words).** Look for: *verified, ensured, considered, note that, important to flag, in summary, this PR introduces, all tests pass, fully tested*.
10. **Search for AI tells (punctuation).** Default to periods.
    - **Semicolons.** Any semicolon in a body is an AI tell. Most rewrite cleanly to a period + new sentence.
    - **Paired em-dashes as parentheses** (`text — like this — text`). AI-shaped. Use real parens or split into two sentences. Single em-dashes are fine but most rewrite to a period + new sentence.
    - **Explanatory colons** (`X was the canonical repro: helpers reading...`). Almost always splits cleanly into two sentences. The colon makes prose read like a writeup.
11. **Check tier appropriateness.** Did you reach for Medium/Large machinery on a Small PR? If yes, drop them.
12. **Voice check — read each bullet aloud.** Imagine you're texting it to the reviewer. Does it sound like a developer in a hurry, or like a press release? If the latter, rewrite. Specific tells: bullets that start with `Let X...`/`Stop Y...`/`Wire Z...` (verb-first mechanism), bullets that mention line numbers or internal field names, bullets longer than the corresponding commit message subject.
13. **Public changelog gut-check.** This body lives on GitHub as a public record. Read it imagining a community user encountering it cold via the project's release notes. Does it stand alone? Or does it read as internal back-and-forth assuming the reader has been following along? If the latter, rewrite for the external audience.

---

## Quick reference

| Element | Small | Medium | Large |
|---|---|---|---|
| Title | ✓ | ✓ | ✓ |
| Framing sentence | ✓ | ✓ | ✓ (links plan if plan-driven) |
| `## Changes` bullets | optional | ✓ | ✓ |
| `## Risk` (with score) | — | ✓ | ✓ |
| `## Risk` failure-modes list | — | when score ≥ 5 | mandatory |
| `## How to Test` | — | when deviation from standard | when deviation from standard |

---

## Related Skills

| Skill | Use when... |
|---|---|
| `docs-ai-tropes` | Cross-referencing the broader catalog of AI prose tells beyond the PR-specific list above |
| `docs-writing` | Editing prose more broadly — voice, sentence-level patterns, persuasive vs reference modes |
| `manage-roadmap` | Authoring a plan-driven Large PR — links the plan at PR-creation SHA |
| `ai-author-context` | Authoring the content of a skill (different surface — this skill is about PR bodies) |
