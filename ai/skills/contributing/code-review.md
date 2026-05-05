---
title: Code Review Process
description: How to self-review PRs in this project — 6 parallel Opus agents with different lenses, iterative fix-and-rerun until clean.
keywords: [code review, PR review, self-review, quality]
audience: contributing
skill: code-review
type: skill
---

# Code Review Process

> **Skill:** `code-review`
> **When to use:** After opening a PR, before requesting user review.

## Overview

Self-review uses 6 parallel Opus agents, each examining the PR diff through a different lens. Fix issues found, then rerun until both the agent and the user agree no relevant fixes remain.

## What to Skip (Self-Review Only)

When you authored the PR, skip:
- **Eligibility checks** — you know it's open and not a draft
- **PR summary** — you know what it does

## Compliance Source of Truth

The source of truth for project standards is `ai/` (skills, context docs), not CLAUDE.md (which is a symlink to AGENTS.md and serves as a landing page for external agents).

## The 6 Review Agents

Launch all 6 in parallel. Always use **Opus** — never Sonnet or Haiku for review agents.

Each agent runs `gh pr diff {number}` and examines the changes through its lens.

**Don't leak round number or iteration history to lens agents.** Each round's prompt should read as a first review against the current PR diff. Hints like "round 3", "round-2 fixes", "after iteration", or "previous reviewers already covered X" subtly bias the agent toward assuming earlier rounds caught the obvious issues — they read with less rigor and less skepticism. Frame every round as a cold first read of the current state. The agent has no way to verify what previous rounds covered, so the bias is unfalsifiable from its end.

Same applies to scorers: don't tell a scoring agent "this finding came up in round 3" — strip iteration context before passing the finding.

**Lens agent output format:** Each lens agent returns a structured list of findings. For each issue:
- **File path and line number(s)**
- **What's wrong** — one sentence
- **Why it matters** — impact, what breaks, or which standard it violates

**Group instances of the same pattern.** When you find N>1 occurrences of the same root issue (same root cause, same citation, same fix shape), return them as a *single grouped finding* listing every file/line, not N separate findings. Example: 22 comments across the diff that all narrate a migration → one grouped "migration-narration" finding listing all 22 sites. The scoring stage applies the rubric per-finding; grouping caps scorer count at unique-pattern-count rather than instance-count, while preserving fresh-cold-read tamper-safety on each pattern. Don't group across distinct citations or distinct fix shapes — those are different judgments.

Lens agents **do not score their own findings.** Scoring is a separate stage with separate agents — see Handling Results.

If an agent finds no issues, it returns "No issues found" with a brief summary of what it verified was clean.

### Agent 1 — Standards Compliance
Audit changes against project standards in CLAUDE.md and `ai/skills/`. Check code formatting, non-obvious patterns, and documented conventions. Note: PRs are squashed on merge.

### Agent 2 — Shallow Bug Scan
Read the implementation file changes and scan for obvious bugs. Focus on logic errors, regex edge cases, incorrect key construction, missing error handling, content-type or cache header bugs. Ignore documentation, skill files, and plan files. Focus on large bugs, avoid nitpicks and likely false positives.

### Agent 3 — Git History Context
Read git blame and history of modified files. Check if new changes conflict with patterns established in previous commits or break assumptions from existing code.

### Agent 4 — Comment Review

**Existing comments — does the new code comply with their guidance?** Read comments already present in the modified files. Check whether the new code respects guidance like "Source of truth:" markers, "Update this when adding new packages", or invariants documented at the top of a function.

**New or modified comments — do they meet the bar?** Apply the standard from `ai/skills/contributing/code-formatting.md` and CLAUDE.md: keep only comments that explain non-obvious *why* — hidden constraints, subtle invariants, workarounds for specific bugs, behavior that would surprise a reader. For each flagged comment, suggest a concrete reword **or** a deletion. Flag:

- Comments that explain *what* the code does (well-named identifiers already do that)
- Comments that reference the current task, PR, fix, or callers ("added for X flow", "used by Y", "removed in #123") — those belong in the PR description, not the source
- Comments that restate the obvious or could be removed without confusing a future reader
- Hierarchy/casing violations from the formatting guide (mixed comment styles, all-caps headers, skipped levels, headers on tiny sections)

The bar: would these comments ship in Vite, Svelte, or Solid?

### Agent 5 — Simplification Pass
Three lenses on the diff under a high-confidence bar. Comments are out of scope — Agent 4 owns that.

**Reuse** — Confirm whether changed code can use `@semantic-ui/utils` to read more simply. The function inventory lives in the `utility-functions` skill (`ai/skills/authoring/utility-functions.md`) — load it for the full list. Also flag duplicated functionality across the codebase and inline logic that should use an existing utility — common candidates: hand-rolled string manipulation, manual path handling, custom env checks, ad-hoc type guards.

**Hot-path caution.** When suggesting a util substitution in a hot path, read the util's source first and only flag if the perf cost is negligible. Note the perf check in the finding's summary so the reviewer sees the reasoning.

**Quality** — Flag:

- Redundant state (duplicates existing state, derivable values cached as state, reactions that should be direct calls)
- Parameter sprawl (adding new params instead of generalizing or restructuring existing ones)
- Copy-paste with slight variation that should unify under one shared abstraction
- Leaky abstractions exposing internals or breaking existing encapsulation boundaries
- Stringly-typed code where constants, string unions, or branded types already exist
- Nested conditionals 3+ levels deep (ternary chains, nested if/else, nested switch) — flatten with early returns, guard clauses, lookup tables, or if/else-if cascades

**Efficiency** — Flag:

- Redundant computations, repeated work, duplicate API calls, N+1 patterns
- Independent operations run sequentially that could parallelize
- Hot-path bloat — blocking work added to startup, the signal/reactivity dirty-check path, or the per-expression render path (see `improve-performance.md`)
- TOCTOU existence pre-checks (checking a file/resource exists before operating on it) — just operate and handle the error
- Memory: unbounded data structures, missing cleanup, listener/timer leaks
- Overly broad operations — reading entire files when only a portion is needed, loading all items when filtering for one

**Confidence bar:** return only findings where the simpler/cheaper form is unambiguously better. Skip taste-based preferences and judgment calls — those are nitpicks here.

### Agent 6 — Performance Review
Anchor: `ai/skills/workflows/contributing/improve-performance.md`. Tachometer is the committed source of truth for performance in this repo; CI posts a bench reporter comment on the PR with per-metric verdicts (faster / slower / no change / unsure) and an `Expected Noise` column.

**Step 0 — Applicability check.** The benchmarks workflow runs only when a PR touches paths in its `paths:` filter (currently `packages/**` or `.github/workflows/benchmarks.yml`). Run `gh pr diff {number} --name-only` first. If none of the changed files match those paths, abort immediately with: *"PR scope doesn't trigger benchmarks (no `packages/**` or `benchmarks.yml` changes). Performance review N/A."* Don't fetch comments, don't speculate — the workflow won't have run.

**Step 1 — Find the tachometer comment.** Use `gh pr view {number} --comments` or `gh api repos/{owner}/{repo}/issues/{number}/comments`. The bench reporter's comment is recognizable by the per-metric verdict table.

**If absent (despite applicable scope) — abort.** Return: *"Tachometer hasn't run yet on this PR. Rerun Agent 6 in a separate pass once CI catches up."* Don't speculate about performance without data.

**If present — investigate each regression honestly.** For every metric flagged "slower," judge:

- **Tax on correctness?** A regression may be acceptable if the change fixes a bug, removes a footgun, or restores an invariant the old fast path was skipping. Read the PR description and the changed lines to judge intent.
- **Or does it need iteration?** A regression is unacceptable when nothing about the change demands the slowdown.

**Ignore "unsure" verdicts** where the reported CI width is at or near the metric's `Expected Noise` floor — those are physics of short benches, not regressions.

**If a concrete recovery is visible in the diff itself** — extra allocation, unnecessary work, redundant computation, missed early return, repeated regex compile, etc. — call it out with file/line and the proposed simpler/faster form. Don't speculate beyond the changeset.

## Handling Results

### Lens agents do not self-score

The 6 lens agents return findings *without* confidence scores. Scoring is a separate stage with fresh agents — self-scoring biases the score upward because the same reasoning that produced the finding produces the confidence. A scorer reading the finding cold is more skeptical, and that skepticism is what filters false positives.

### Ceremony — announce before launching scorers

Before spawning scoring agents, state in the conversation:

> "Launching N parallel Opus scoring agents — one per finding (grouped findings count as one)."

**This is not optional, and not a checkbox to game.** Orchestrators on round 3+ of an iteration loop tend toward fatigue and skip the scoring stage — scoring findings themselves to save effort, hoping the user won't notice. The announcement is the artifact that makes skipping observable. If you're tempted to skip on round 3 (or 4, or 5), that's exactly the moment when the rigor matters most. Stop, announce, then launch.

### Scoring agents (Opus, one per finding, parallel)

Lens agents already consolidate same-pattern instances into grouped findings (see Lens agent output format). Each grouped finding is one scorer. A lens that returns 22 same-pattern instances as one grouped finding gets one scorer; a lens that returns 5 distinct findings gets five.

For each finding from any lens agent, launch a fresh **Opus** agent (always Opus — Haiku is too fast to verify standards citations) that receives:

- The full PR diff
- The single finding (file/line, what's wrong, why)
- The relevant standards docs the finding cites — `CLAUDE.md`, the cited `ai/skills/` doc, the formatting guide, the perf workflow, etc.
- The rubric below, passed verbatim

The scoring agent reads the finding cold, applies the rubric, and returns a single number with a one-sentence justification. For findings that cite a standard, the agent must **verify the cited doc actually calls out the issue specifically** — misattributed citations score 0.

### Scoring rubric (pass to each scoring agent verbatim)

For each issue, assess confidence on a 0-100 scale:

| Score | Meaning |
|---|---|
| 0 | False positive — doesn't stand up to light scrutiny, or is pre-existing |
| 25 | Might be real, but may also be false positive. Stylistic issues not explicitly called out in standards. |
| 50 | Verified real, but may be a nitpick or rarely hit in practice. Not very important relative to the rest of the PR. |
| 75 | Verified, very likely to be hit in practice. The existing approach is insufficient. Directly impacts functionality or explicitly mentioned in project standards. |
| 100 | Confirmed real, will happen frequently. Evidence directly confirms this. |

### Present all scored findings to the user

Do not silently triage. Present every finding with:
- The file and line reference
- Why it was flagged (and by which lens agent)
- The independent confidence score with its one-sentence justification

The user decides what to fix, what to defer, and what to accept.

### What counts as a false positive

- Pre-existing issues
- Something that looks like a bug but is not actually a bug
- Pedantic nitpicks that a senior engineer wouldn't call out
- Issues that a linter, typechecker, or compiler would catch (eg. missing or incorrect imports, type errors, broken tests, formatting issues, pedantic style issues like newlines). No need to run these build steps yourself -- it is safe to assume that they will be run separately as part of CI.
- General code quality issues (eg. lack of test coverage, general security issues, poor documentation), unless explicitly required in CLAUDE.md
- Issues that are called out in CLAUDE.md, but explicitly silenced in the code (eg. due to a lint ignore comment)
- Changes in functionality that are likely intentional or are directly related to the broader change
- Real issues, but on lines that the user did not modify in their pull request

## Iterative Loop

After fixing issues from a round:

1. Commit and push fixes
2. Rerun all 6 lens agents against the updated PR diff
3. **Run the scoring stage on the new findings** — announce it, launch one Opus scorer per finding in parallel. Do not skip; round 3+ is exactly when this matters.
4. Present new findings + scores to the user
5. Repeat until a round comes back clean

A round is "clean" when both the agents and the user agree there are no remaining issues worth fixing.

## Completion

After the final clean round, report the result to the user in conversation. No need to post a comment on the PR.
