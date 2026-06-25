---
title: Managing the Project Roadmap
description: How the project roadmap and plan system works at ai/plans/ — creating, updating, completing, iceboxing, and organizing plans. Load when scoping new work, closing out completed work, or reorganizing priorities.
keywords: [roadmap, plans, scoping, project management, priorities, dependencies, planning, icebox]
audience: contributing
skill: manage-roadmap
type: skill
---

# Managing the Project Roadmap

> **Skill:** `manage-roadmap`
> **Purpose:** Reference guide for the project planning system at `ai/plans/`.

## System Overview

The roadmap lives in `ai/plans/`:

```
ai/plans/
  ROADMAP.md              # Master roadmap — the single source of truth
  token-finalization.md   # Individual plan files
  value-schema.md
  wrapper-architecture.md
  ...
  archive/                # Completed plans
  icebox/                 # Drafted but not on the active roadmap
```

`ROADMAP.md` is always loaded by agents working on this project. It answers "what's next" and "what's blocked on what."

## Key Concepts

### Autonomy Levels

Every plan declares who does the work:

| Level | Meaning |
|---|---|
| `agent` | Agent executes autonomously with a clear brief. |
| `pair` | Collaborative — user and agent work through it together. The conversation *is* the work. |
| `user` | User-driven. Agent may research or review. |

Most plans in this project are `pair` — the framework authors have deep expertise and most important work emerges from dialogue, not delegation.

### Effort Estimates

Use hours as the primary unit. For estimates over 8 hours, show both: `16-24h (2-3d)`. Under 8 hours, just hours: `4h`. Be honest about estimates — a plan that's "open-ended design" should declare itself rather than assigning false precision.

### ROADMAP.md Sections

Plans live in one of these sections based on their current state:

| Section | What goes here |
|---|---|
| **Currently Open** | Plans with an open PR or live pair work. Mirrored by `ai/plans/active/`. Updated as ceremony when a PR opens; the entry is cleared by the completion commit (Step 4) once the PR is merge-ready, or reversed if the PR closes without merging. Typically 1-2 entries. |
| **Phase tables** | The phase the plan belongs to, in priority order within the phase. |
| **Blocked on [X]** | Waiting on a specific dependency. Group by blocker. |
| **Parallel** | Slot in wherever there's a gap; not phase-gated. |
| **Icebox** | Drafted but not on the active roadmap. Listed by name only — full plan files in `ai/plans/icebox/`. |

Each entry in a phase or parallel section follows this table format:

```markdown
| # | Plan | Hours | Mode | Scope | Notes |
```

Icebox entries are simpler — bullet list with a one-line description:

```markdown
- [Plan Name](icebox/plan-name.md) — one-line description
```

---

## Step 1: Creating a New Plan

### Write the plan file

Create `ai/plans/{plan-name}.md`. Use kebab-case for filenames. Avoid version suffixes (`v2`, `v3`) — name plans by functionality.

Every plan file needs:

```markdown
# Plan Title

## Goal

One paragraph on what this achieves and why it matters.

## Design / Implementation

The substance of the plan — what needs to happen, key decisions, technical details.

## Open Questions

Unresolved decisions that affect the plan. Remove questions as they're answered.

## Dependencies

- [Other Plan](other-plan.md) — what it's waiting on and why

## Status

Current state. Update this as work progresses.
```

Keep plans focused. A plan should be something completable in a focused stretch — days to a couple weeks, not months. If the scope is larger, break it into multiple plans.

### Scope Maturity

Plans have two maturity levels:

| Level | Meaning |
|---|---|
| `initial` | Problem and decision space captured. Open questions remain. Needs a pair session to become actionable. |
| `scoped` | Design decisions made, implementation steps concrete. Ready to execute. |

**Default to `initial` — but try to upgrade immediately if possible.** Before creating a plan, assess the open questions. If there are only 2-3 quick decisions needed to finalize scope, ask the user right now rather than creating an initial scope that requires a separate session to upgrade. Don't create process overhead for questions that can be answered in a minute.

**Use `AskUserQuestion` for scoping decisions.** When you have 2-4 quick, independent decisions to resolve, use the `AskUserQuestion` tool to present them as structured choices. This lets the user answer all open questions in a single interaction instead of a back-and-forth conversation. Each question should have a short header, concrete options with descriptions, and only offer choices where the user's preference genuinely matters. If you can infer the right answer from context, just do it — don't ask.

If the plan requires a longer design session — a brain dump, exploring tradeoffs, working through interconnected decisions — say so explicitly and create an initial scope. Example: "This needs a pair session to work through the light DOM options — creating as initial scope."

The reasoning: agents can identify the problem space, enumerate options, and capture constraints — but design calls belong to the user. A plan that looks `scoped` but is full of agent assumptions is worse than an honest `initial` scope, because it looks ready to execute when it isn't.

The exception is purely mechanical work with no design surface (e.g., "migrate these 65 files from old token names to new ones") — that can be `scoped` directly.

An initial scope captures *what needs to be decided* and *why it matters*, but doesn't prescribe the solution. It must be upgraded to `scoped` through a pair session before the work can be completed.

**Session planning for scoped plans.** When upgrading a plan to `scoped`, add a `## Sessions (estimated)` section that breaks the work into session-sized chunks. Each chunk should be completable in one sitting (1-3 hours for pair, variable for agent/user). These are rough — they'll be finalized at runtime by the `plan-session` skill, which checks what's still relevant before presenting them.

```markdown
## Sessions (estimated)
1. Lock color grade numbering + review OKLCH pipeline
2. Border/shadow naming scheme
3. Surface colors and dark mode inversion
4. Final review + lock
```

**Always announce the scope level.** When creating a plan, explicitly state whether it's `initial` or `scoped` and why. For example: "Created as initial scope — the light DOM styling approach needs a design decision before this is actionable." This prevents ambiguity about whether a plan is ready to execute.

The ROADMAP.md table includes a `Scope` column. When a plan is upgraded from `initial` to `scoped`, update both the plan file (flesh out design/implementation) and the roadmap entry.

### Determine placement in ROADMAP.md

Ask these questions:

1. **Is it on a phase's critical path?** Add to the phase table, in the position that reflects priority within the phase.
2. **Is it parallel to phase work?** Add to `Parallel` — slots in wherever there's a gap.
3. **Is it blocked on something specific?** Add to a `Blocked on [X]` section, or note the blocker in the Notes column.
4. **Is it captured but not yet ready for the active roadmap?** File it in the icebox — see Step 5.

When a plan starts execution (a PR opens, or pair work goes live), additionally surface it in `## Currently Open` and move the file into `ai/plans/active/`. See "When a PR opens" under Step 2.5.

### Add the entry

Insert a new row in the appropriate table. Assign the next available `#` in that section. Include:

- **Plan**: Name linked to the file, e.g. `[Token Finalization](token-finalization.md)`.
- **Hours**: Concrete estimate. Use ranges for uncertainty (e.g., `2-3d`). If design is open-ended, say so: `2d impl, open design`.
- **Mode**: `agent`, `pair`, or `user`.
- **Scope**: `initial` or `scoped`.
- **Notes**: One line of context. What makes this plan notable.

---

## Step 2: Adding Multiple Related Plans

When scoping a new track of work (e.g., "we need wrapper packages"), you'll often create several plans at once with dependencies between them. The process:

1. **List all the plans** you're going to create with their dependency relationships.
2. **Create each plan file** in `ai/plans/`.
3. **Insert them into ROADMAP.md** in the correct sections — blocked plans go in the matching blocked section, unblocked ones go in Do Next or Up Next.
4. **Cross-reference dependencies** in both the plan files and ROADMAP.md blocker columns.

If the new work creates a new blocker category (e.g., "Blocked on Wrapper Architecture"), create a new section in ROADMAP.md for it.

---

## Step 2.5: Executing a Plan

Work happens on a feature branch, committed incrementally, merged via PR.

### Starting work

1. **Check current branch.** If not on `main`, discuss merging strategy with the user before creating a new branch — there may be in-progress work to resolve first.
2. **Create a feature branch** from `main`: `feat/{plan-name}` (e.g., `feat/cdn-asset-sets`).

### During implementation

3. **Commit as you go** — small, logical commits using the repo's `Category: Description` format. One-line messages only, no body content, no co-author trailers.
4. **Red-team test the implementation.** Spawn a testing subagent with the `contributing/red-team-testing` skill. Give it the current branch and a description of what was built. The subagent runs autonomously — it inventories existing test coverage, writes tests for missing common paths and boundary cases, runs them, and returns a structured report with frequency scores and recommendations. It also loads `contributing/testing` and `contributing/testing-internals` for test mechanics. **Present the full report to the user** — don't silently triage findings. The user decides what to fix, what to defer, and what to accept as a known constraint.

### Completing work

5. **Run the full test suite** before opening the PR: `npm test` from the repo root. All tests must pass. If any fail, fix before proceeding.
6. **Ask the user to push** — `git push` requires user permissions. Prompt: "Ready for PR — please push with `! git push -u origin feat/{branch}`". Wait for confirmation before proceeding.
7. **Open a PR** using `gh pr create`, following the [`author-pull-requests`](author-pull-requests.md) skill for title format, description conventions, and tier triage. The skill is the canonical procedure for PR shape; this step lands the PR for the plan you're executing. (Short, plain summary; no AI-style preamble; match human-authored tone.)

   **Once the PR is open, do the active ceremony:**

   - `git mv ai/plans/{plan}.md ai/plans/active/{plan}.md` — moves the plan into the in-flight folder so GitHub directory browsing shows it as active.
   - Update internal links in the moved file: sibling-plan refs (`other.md`) → `../other.md`; skill refs (`../skills/...`) → `../../skills/...`.
   - Update other plans linking *to* the moved file: `{plan}.md` → `active/{plan}.md`.
   - Add a one-line entry to ROADMAP's `## Currently Open`:

     ```
     - [Plan Name](active/plan-name.md) — [PR #N](https://github.com/Semantic-Org/Semantic-Next/pull/N) brief context.
     ```

   If the PR closes without merging, reverse all of the above. When the user confirms the PR is ready to merge, run the completion flow (Step 4) as the final commit on the branch — the merge then carries the archived state to `main`.
8. **Self-review the PR** using the `contributing/code-review` skill — it owns the full process (lens agents, scoring, iterative loop, false-positive rules). Fix findings, rerun until clean.
9. **Post-merge verification** (when applicable). Only relevant for work that affects live infrastructure — CI pipelines, CDN endpoints, MCP deploys, etc. After the user merges and CI runs, verify the live endpoints behave correctly. Not needed for pure source changes.

### When to branch vs. commit to main

- **Branch** (`feat/`): multi-commit work, new features, anything that touches routing/build/deploy.
- **Direct to main**: single-commit fixes, doc typos, plan file updates.

---

## Step 3: Updating a Plan's Status

When progress is made on a plan:

1. **Update the plan file** — revise the Status section and any design/implementation details that have changed.
2. **Check if blockers have cleared** — if a plan was blocked and the blocker is now resolved, move it to the appropriate unblocked section (Do Next or Up Next).

---

## Step 4: Completing a Plan

Run this when the user confirms the PR is ready to merge — **as the final commit on the PR branch, not after the merge lands.** Committing the completion on the branch means the merge carries the archived state to `main` in one stroke, with no post-merge cleanup. (Wait until after merge and the agent who did the work is gone, so the cleanup strands on the user and the active/ + Currently Open entries rot.)

1. **Record actuals in the plan file.** Before archiving, add a `## Completion` section to the plan:

```markdown
## Completion

- **Estimated:** 2-3d pair
- **Actual:** 4d pair (~32 hours across 5 sessions)
- **Completed:** 2026-04-15
- **Delta notes:** Took longer than estimated because [reason]. / Came in under estimate because [reason].
```

**Tracking time:** Use git commit timestamps to calculate actual duration. At completion, run:

```bash
git log --oneline --format="%ai %s" {first-commit-sha}^..HEAD --reverse
```

Then:

1. Note the first and last commit timestamps for total wall-clock span.
2. Look for gaps > 30 minutes between consecutive commits — these indicate breaks, CI waits, or context switches.
3. Calculate active time by summing the "burst" ranges (consecutive commits < 30min apart).
4. Report both wall-clock span and estimated active time.

Example output: "~6.5h wall clock (14:09–20:32 ET), ~4h active across 3 bursts. Gaps: 45min CI wait, 30min design discussion."

Present the analysis to the user and ask if it sounds right before recording. They may know about breaks or context that commits don't capture.

2. **Move the file**: `git mv ai/plans/active/{plan}.md ai/plans/archive/{plan}.md`. `active/` and `archive/` sit at the same depth under `ai/plans/`, so internal links and links to the file need no path changes (unlike the `plans/` → `active/` move in Step 2.5).
3. **Remove from ROADMAP.md active sections** — the `## Currently Open` entry, plus the plan's row in its phase table and any phase-tree listing. Completed plans live only in `archive/`, not in ROADMAP.
4. **Check downstream** — did completing this plan unblock other plans? If so, move those from their blocked section to Do Next or Up Next.
5. **Promote from Up Next** — if Do Next has room, pull the highest priority item from Up Next.
6. **Commit on the branch.** Stage the move, the ROADMAP edits, and the `## Completion` record in one commit (`Chore:` prefix) so the PR's merge archives everything atomically.

The archive directory is the catalog of completed work; each plan's `## Completion` section is its self-record. ROADMAP.md does not maintain a separate Archive section — the directory listing and individual plan files are sufficient.

---

## Step 5: Iceboxing a Plan

When a plan is captured but not on the active roadmap — either deliberately deferred or just not yet prioritized:

1. **Move or create the file**: `mv ai/plans/{plan}.md ai/plans/icebox/`, or create directly in `ai/plans/icebox/`.
2. **Remove from active sections** in ROADMAP.md (if it was there).
3. **Add a line to the Icebox section** in ROADMAP.md:

```markdown
- [Plan Name](icebox/plan-name.md) — one-line description
```

If there's a "not now because X" rationale, capture it inside the plan file under `## Status` rather than in the ROADMAP entry. The ROADMAP entry is just a pointer.

---

## Common Patterns

### "This is too big for one plan"

If a plan would take more than ~2 weeks, it's probably a track, not a plan. Tracks are described in the phase narratives at the top of ROADMAP.md. Individual plans within the track are created as work begins — not all upfront.

### "This plan is done but I'm not sure"

Read the plan file's scope and check each item against the current codebase. If the implementation matches what was planned, archive it. If there's remaining work, update the status to reflect what's left.

### "Priorities changed"

Reorder entries within sections as needed. The `#` column is for reference, not a permanent ID — renumber after major reorganizations. The ordering within each section *is* the priority within that section.

### "A new blocker emerged"

Create a new blocked section in ROADMAP.md if needed. Move affected plans there. The section name should clearly state the blocker: "Blocked on [specific thing]."
