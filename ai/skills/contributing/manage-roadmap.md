---
title: Managing the Project Roadmap
description: How the project roadmap and plan system works at ai/plans/ — creating, updating, completing, deferring, and organizing plans. Load when scoping new work, closing out completed work, or reorganizing priorities.
keywords: [roadmap, plans, scoping, project management, priorities, dependencies, planning]
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
  archive/                # Completed or rejected plans
  deferred/               # Explicitly deferred plans
```

`ROADMAP.md` is always loaded by agents working on this project. It answers "what's next" and "what's blocked on what."

## Key Concepts

### Autonomy Levels

Every plan declares who does the work:

| Level | Meaning |
|---|---|
| `agent` | Agent executes autonomously with a clear brief |
| `pair` | Socratic — Jack and Claude think through it together. The conversation *is* the work. |
| `jack` | Jack's hands and instincts. Claude may research or review. |

Most plans in this project are `pair` — the framework authors have deep expertise and most important work emerges from dialogue, not delegation.

### Effort Estimates

Use hours as the primary unit. Days require a conversion step (1d = 8h) that introduces errors. For estimates over 8 hours, show both: `16-24h (2-3d)`. Under 8 hours, just hours: `4h`. Reference point: subtree caching took ~40h (5d) pair. Be honest about estimates — a plan that's "open-ended design" should say so rather than pretending it's 16 hours.

### ROADMAP.md Sections

Plans live in one of these sections based on their current state:

| Section | What goes here |
|---|---|
| **Do Next** | Unblocked and highest priority. Max ~5 items. This is the active work queue. |
| **Up Next** | Unblocked but lower priority than "Do Next." |
| **Blocked on [X]** | Waiting on a specific dependency. Group by blocker. |
| **Last** | Homepage final pass — always the last thing. |
| **Hidden Content Inventory** | Maps commented-out docs content to their parent plan numbers. |
| **Deferred** | Explicitly set aside with rationale. Links to `ai/plans/deferred/`. |
| **Archive** | Completed or rejected. Links to `ai/plans/archive/`. |

Each entry in a section follows this table format:

```markdown
| # | Plan | Days | Mode | Status | Blocker | Notes |
```

---

## Step 1: Creating a New Plan

### Write the plan file

Create `ai/plans/{plan-name}.md`. Use kebab-case for filenames.

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

**Session planning for scoped plans.** When upgrading a plan to `scoped`, add a `## Sessions (estimated)` section that breaks the work into session-sized chunks. Each chunk should be completable in one sitting (1-3 hours for pair, variable for agent/jack). These are rough — they'll be finalized at runtime by the `plan-session` skill, which checks what's still relevant before presenting them.

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

1. **Is it blocked?** If yes, which section matches the blocker? Add it there.
2. **Is it unblocked and urgent?** Add to "Do Next" — but only if there's room (max ~5). If "Do Next" is full, either bump something down or add to "Up Next."
3. **Is it unblocked but not urgent?** Add to "Up Next."

### Add the entry

Insert a new row in the appropriate table. Assign the next available `#` in that section. Include:

- **Plan**: Name linked to the file, e.g. `[Token Finalization](token-finalization.md)`
- **Days**: Concrete estimate. Use ranges for uncertainty (e.g., `2-3d`). If design is open-ended, say so: `2d impl, open design`
- **Mode**: `agent`, `pair`, or `jack`
- **Status**: `Not started`, `Active`, `3/10`, etc.
- **Blocker**: What it's waiting on, or `—` if unblocked
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

## Step 3: Updating a Plan's Status

When progress is made on a plan:

1. **Update the plan file** — revise the Status section and any design/implementation details that have changed.
2. **Update ROADMAP.md** — change the Status column (e.g., `0/10` → `4/10` or `Not started` → `Active`).
3. **Check if blockers have cleared** — if a plan was blocked and the blocker is now resolved, move it to the appropriate unblocked section (Do Next or Up Next).

---

## Step 4: Completing a Plan

When a plan is done:

1. **Record actuals in the plan file.** Before archiving, add a `## Completion` section to the plan:

```markdown
## Completion

- **Estimated:** 2-3d pair
- **Actual:** 4d pair (~32 hours across 5 sessions)
- **Completed:** 2026-04-15
- **Delta notes:** Took longer than estimated because [reason]. / Came in under estimate because [reason].
```

**Tracking time:** Check the clock (`date`) when starting work on a plan and when completing it. At completion, report the wall-clock span and ask the user if it was roughly continuous or if there were breaks. One question gives you actual effort without overhead mid-session.

2. **Move the file**: `mv ai/plans/{plan}.md ai/plans/archive/`
3. **Remove from active sections** in ROADMAP.md.
4. **Add a line to the Archive section** at the bottom of ROADMAP.md.
5. **Check downstream** — did completing this plan unblock other plans? If so, move those from their blocked section to Do Next or Up Next.
6. **Promote from Up Next** — if Do Next has room, pull the highest priority item from Up Next.

---

## Step 5: Deferring a Plan

When a plan is deliberately set aside:

1. **Move the file**: `mv ai/plans/{plan}.md ai/plans/deferred/`
2. **Remove from active sections** in ROADMAP.md.
3. **Add to the Deferred section** with a rationale — why it's deferred and under what conditions it would be revisited.

Example:
```markdown
- **Vanilla Renderer** — 30-50d pair. Ship 1.0 on Lit. Revisit for 2.0 if dependency becomes a real problem.
```

---

## Step 6: Maintaining the Hidden Content Inventory

The Hidden Content Inventory tracks docs pages that were commented out (not deleted) and maps each to the plan that will produce the content. When adding or completing plans that involve documentation:

1. **Check if any inventory items reference the plan** by number.
2. **When content is written**, note that the corresponding menu entry / footer link / page stub can be uncommented.
3. **Cross-reference** uses the `#` numbers from the active plan tables: e.g., "~~CSS/Styling tab~~ → blocked on CSS token docs (#14)"

When plan numbers shift (due to completions or reordering), update the inventory references.

---

## Common Patterns

### "This is too big for one plan"

If a plan would take more than ~2 weeks, it's probably a track, not a plan. Tracks are described in the Tracks section at the top of ROADMAP.md. Individual plans within the track are created as work begins — not all upfront.

### "This plan is done but I'm not sure"

Read the plan file's scope and check each item against the current codebase. If the implementation matches what was planned, archive it. If there's remaining work, update the status to reflect what's left.

### "Priorities changed"

Reorder entries within sections as needed. The `#` column is for reference, not a permanent ID — renumber after major reorganizations. The ordering within each section *is* the priority within that section.

### "A new blocker emerged"

Create a new blocked section in ROADMAP.md if needed. Move affected plans there. The section name should clearly state the blocker: "Blocked on [specific thing]."
