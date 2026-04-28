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

AI-written prose has a tell: it's trying to convince the reader the work was thorough and correct. Humans spot it instantly — and stop trusting the writer.

Good PR descriptions read like a colleague leaving a quick note. Matter-of-fact. State what's now true; don't argue for it. The diff is the evidence — your text gives orientation.

If you catch yourself writing to demonstrate thoroughness or pre-empt skepticism, stop. Cut the offending text and go back to plain description.

---

## What the reader actually wants

The reviewer opens GitHub, glances at the title, skims the body, then reads the diff. Your text gives them just enough to:

1. Know what kind of change this is — **the title**
2. Know why it exists as a unit — **one framing sentence**
3. Know what's now true after merge — **3–5 outcome bullets**

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
[One sentence — why this PR exists.]

## Changes
- [Outcome bullet]
- [Outcome bullet]
- [Outcome bullet]

## Risk
N/10 — [one-line reason].
Failure modes: [bulleted list — only when score ≥ 5 or blast radius is non-obvious]

## How to Test
- [Deviations from standard only. Skip "rerun tests" / "CI passes" — those are assumed.]
```

### Large tier

Same as Medium, plus:

- If plan-driven, lead the framing sentence with `Implements [plan name](permalink-at-PR-creation-SHA)`. Get the SHA via `git log -1 --format=%H ai/plans/foo.md` and form `https://github.com/Semantic-Org/Semantic-Next/blob/<sha>/ai/plans/foo.md`.
- `## Risk` failure-modes list is mandatory.
- Body may be longer, but bullets still describe outcomes, not mechanisms.

---

## Bullets describe outcomes, not mechanisms

The most common drift is listing the knobs you turned instead of the state that's now true. Reviewers can see the knobs in the diff — they read the body to learn what *exists* now.

| ❌ Mechanism (the diff) | ✅ Outcome (what's now true) |
|---|---|
| Drop `private`, add publish metadata + `peerDependencies: { astro: ">=5" }` | Set up astro integration to be published as `@semantic-ui/astro` |
| Update `.gitignore`, `git rm -r --cached ai/workspace/`, add `ai/workspace/README.md` | Workspace becomes per-user scratch — only the README is tracked |
| Rename `light-dom-prerender.html` → `.md`; remove duplicate `-tdd.html`; update ROADMAP link | (don't list — bundle into a higher-level "stale dotfiles" bullet, or omit) |

A useful test: read each bullet aloud. If it describes work you performed (verbs of editing — *update, add, drop, edit, rename*), rewrite it to describe state (verbs of being — *use, support, become, expose*) or to describe a completed action at a higher level (*set up, replace, group*).

---

## Risk score is routing metadata, not a confidence performance

When you write a Risk score, you're telling the reviewer (or `/ultrareview`) **how much attention to spend**. Be honest:

- 2/10 Medium: "review this fast — I'm sure"
- 7/10 Large: "slow down — look at the failure modes I named"

Don't pad the number to look responsible; don't deflate it to look confident. A correct low score is more useful than a high one. The score is a signal, not a posture.

The failure-modes list: include when score ≥ 5, OR when blast radius is non-obvious. For low-risk PRs, the list is noise.

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

### 6. Word imprecision

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

---

## After drafting, do this checklist

In order:

1. **Hemingway pass on the title.** Cut every word that doesn't carry meaning.
2. **Re-read each bullet.** Is it describing the *outcome* (state now true) or the *mechanism* (work performed)? Rewrite mechanism bullets.
3. **Search for AI tells.** Look for: *verified, ensured, considered, note that, important to flag, in summary, this PR introduces, all tests pass, fully tested*.
4. **Check tier appropriateness.** Did you reach for Medium/Large machinery (Risk score, How to Test) on a Small PR? If yes, drop them.
5. **Honest question:** if a colleague wrote this PR and pinged you, would the body sound like them, or like a corporate document? If the latter, you're still in AI-prose mode.

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
