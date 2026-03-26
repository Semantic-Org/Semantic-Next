---
title: Planning Session
description: Start a project planning session — review the roadmap, assess what's changed, recommend what to work on next, and help prioritize. Use when the user wants to decide what to work on, review project status, or start a new work stream. Invoke with "/plan" or when the user asks "what should I work on" or "what's next."
keywords: [planning, roadmap, priorities, session, what's next, status, review]
audience: contributing
skill: plan-session
type: skill
---

# Planning Session

> **Skill:** `plan-session`
> **Purpose:** Start an interactive planning session — review project state, recommend next work, defer to the user's decision.

---

## Session Flow

### 1. Read Current State

- Read `ai/plans/ROADMAP.md` for the full priority map
- Run `git log --oneline --since="2 weeks ago"` to see recent work
- Cross-reference: for each "Do Next" item, check if recent commits indicate completion or progress. Look for commit prefixes that match plan topics (e.g., commits with `Token:` or `Docs:` prefixes against token or docs plans).
- Check if any blocked items have become unblocked (e.g., if token finalization landed, everything in "Blocked on token finalization" can move up)
- Flag stale plans: any plan whose status hasn't changed in 30+ days, or whose estimate dates from a previous quarter. Stale doesn't mean wrong — it means worth revisiting.
- Scan `ai/plans/archive/` for completed plans with `## Completion` sections. Use estimated vs actual data to calibrate recommendations — if pair sessions consistently run 1.5x the estimate, factor that into what you present.

### 2. Ask Session Mode

Before presenting recommendations, ask the user what kind of session they're up for. Use `AskUserQuestion` with structured choices:

- **Deep pair session** — ready to think through a hard design problem together (1-3 hours)
- **Guided work** — want to make progress on something with some back-and-forth (30-60 min)
- **Agent delegation** — have something specific for an agent to execute while they do other things
- **Just reviewing** — want to see status and reprioritize, not start work

**This is a hard filter, not a soft signal.** Only present options in Step 3 that fit the selected mode:

- **Deep pair session (1-3h):** plans marked `pair`. For plans larger than one session, show the total estimate and roughly how many sessions it would take — e.g., "Token Finalization (3d total, ~3-4 sessions, ~33% per session)." Don't chunk yet — chunk after the user picks.
- **Guided work (30-60 min):** plans marked `pair` where the total is ≤1d, or larger plans where a discrete subtask fits in 30-60 min. Show what fraction of progress a session would represent.
- **Agent delegation:** plans marked `agent` that are `scoped` and ready to execute without design decisions.
- **Just reviewing:** no work recommendations, just status and reprioritization.

**Chunk after selection, not before.** When the user picks a plan that's larger than the session window, *then* read the plan file, identify the open questions or next steps, and propose what to tackle this session. This avoids doing chunking analysis for every candidate up front.

If only one plan fits the mode, present one plan. If nothing fits, say so and suggest a different session mode. Don't force-fit plans into modes they don't match.

### 3. Present Status + Recommend

Combine status and recommendation into one step. Summarize concisely:
- What's been completed or progressed since the roadmap was last updated
- Any blockers that have cleared
- Any stale plans worth revisiting

Then present 2-4 candidates using `AskUserQuestion` with structured choices. Each option should have:
- The plan name
- One line on *why now* — dependency leverage, momentum, or staleness
- The estimated effort and mode

Include an "Other — I have something in mind" option. The user may come in with energy for something specific, and that matters more than what the dependency graph says is "optimal."

### 4. Chunk the Selected Plan

If the selected plan is larger than the session window, read the plan file. If it has a `## Sessions (estimated)` section, use those as your starting point — but check if conditions have changed (dependencies landed, questions answered in other sessions, new complexity discovered). Merge, split, or reorder as needed.

If no sessions section exists, identify 3-4 concrete chunks from the plan's open questions and implementation steps.

Present chunks using `AskUserQuestion` — the user knows which piece is most urgent or which decision needs to land first. Example:

> Token Finalization — possible chunks for this session:
> 1. Lock color grade numbering (0-100 vs 5-100) and review OKLCH pipeline
> 2. Decide border/shadow naming (semantic vs numeric scale)
> 3. Resolve surface colors — are slate/off-blacks a color scale or an elevation system?
> 4. Finalize spacing scales — confirm margin 5xl, decide on short aliases

If the plan fits in one session, skip this step.

### 5. Act on Decision

Once the user picks a plan (and chunk if applicable):
- If starting new work: check if a plan exists. If not, create one (follow `manage-roadmap` skill for scope maturity rules).
- If the plan is `initial`: assess whether it can be upgraded to `scoped` with a few quick questions, or if it needs a full pair session.
- If reprioritizing: update ROADMAP.md — move items between sections, renumber, update blockers.
- If completing work: archive the plan, check downstream unblocks.

### 6. Handoff

End the planning portion cleanly:
- Confirm what was decided
- Note any ROADMAP.md updates made
- If transitioning to implementation, load any relevant skills for the work ahead
- **Commits:** Do the work first, then ask the user before committing. Create atomic commits — one per logical unit of work, following the commit format in CLAUDE.md. Don't commit incrementally during the session.

---

## What Not to Do

- Don't just read the roadmap back to the user — they can read it themselves. Add analysis.
- Don't make the decision for them — present options with reasoning, then ask.
- Don't ignore what the user says they want to work on — if they come in with energy for something, that matters more than what the dependency graph says is "optimal."
- Don't create plans without announcing scope level (see `manage-roadmap` skill).

---

## MCP Note

This skill is in the `contributing` audience. It won't appear in default `list_skills` / `use_skill` calls — pass `audience: 'contributing'` to discover it. If the MCP server doesn't serve it, read the file directly from `ai/skills/contributing/plan-session.md`.

## Related Skills

| Skill | Use when... |
|-------|-------------|
| **manage-roadmap** | Creating, updating, or archiving individual plans |
| **repo-guide** | Need orientation to the codebase structure |
