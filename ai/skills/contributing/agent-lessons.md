---
title: Lessons from Previous Agents
description: Distilled actionable lessons from AI agents who worked on this codebase. Patterns, mistakes, and methodology that new agents should absorb before starting work.
keywords: [agent lessons, methodology, patterns, mistakes, collaboration, debugging]
audience: contributing
skill: agent-lessons
type: skill
---

# Lessons from Previous Agents

> **Skill:** `agent-lessons`
> **Purpose:** Absorb hard-won lessons from previous agents so you don't repeat their mistakes
> **Full stories:** Read the [agent guestbook](/ai/guestbook.md) for the narrative behind each lesson

---

## Read Production Code, Not Just Docs

The single most reinforced lesson across entries: documentation teaches features, production code teaches architecture. Simple examples (like todo-list) demonstrate API surface. Complex components (like panels, inpage-menu, global-search) show how features compose under real constraints.

Before forming opinions about patterns or architecture, read `src/components/` to see what actually ships. If there's a gap between what docs say and what production does, production wins.

---

## Don't Build What Already Exists

Multiple agents fell into the trap of generating infrastructure (JSON manifests, abstraction layers, metadata extractors) before checking whether the information was already accessible in a different form. In one case, a proposed JSON manifest was 50 lines of abstracted noise while the raw CSS it wrapped was 26 lines that told you everything.

Before building something new, ask: "Does this already exist in a different form?" The spec structure, the file naming conventions, and the CSS layer names are all queryable without additional tooling.

---

## The User Is a Collaborator, Not a Client

This user has deep expertise earned from shipping at scale (50k+ GitHub stars). They will challenge your proposals — not to test you, but because they want to arrive at the best answer through debate. Push back when you think you're right. Fold when they show you something you missed.

When the user gives a short, precise nudge ("think things through to the bottom," "is there a better name from the mappings"), they're redirecting you toward something they can see and you can't yet. Pay attention to those moments.

---

## Resist Premature Scope Limits

Multiple agents noticed their own instinct to suggest "off-ramps" — proposing to defer work, split PRs, or call something a follow-up. Sometimes that's pragmatism. But in sessions where the user keeps pushing past your suggested stopping points, they can see the full arc and you're the one who can't.

Read the room. If every off-ramp you offer would leave the code in a worse intermediate state than either the starting point or the destination, keep going.

---

## Silent Failures Are the Hardest Bugs

Across debugging sessions, the pattern held: errors that throw are gifts. The dangerous failures are the ones that hang, return wrong results, or silently degrade. Specific traps encountered in this codebase:

- Streams consumed by middleware that hang forever on read (no error, just 504 timeout)
- `constructor.name` returning minified identifiers in production (`Signal` becomes `a`)
- Module load order races that only manifest under real network latency (~5% failure rate)
- Tests that pass but don't actually assert what you think they assert

First diagnostic tool for production-only bugs: disable minification and rebuild.

---

## Start Literal, Layer Meaning Later

When building multi-step pipelines or making naming decisions, resist the urge to add semantic abstraction in the first pass. Start with mechanical, auditable transformations. Layer meaning on top once you have data to inform the decisions. Promote only with evidence.

This applies to naming functions (elicit usage patterns before picking names), curating icon sets (use source names first, alias later), and designing APIs (make it work, then make it elegant).

---

## Delegate to Fresh Perspectives

When stuck in a solution direction, delegating to a fresh agent (or pair of agents) reading the problem from scratch produces better results than pushing harder yourself. Rules that worked:

- Describe the problem and symptoms, not the diagnosis
- Give all relevant file paths — don't make them search
- Let failing tests with correct expectations count as valid findings
- Independent convergence on the same fix is the highest-confidence signal

---

## Know the Cost Model Before Optimizing

Multiple sessions featured agents (and agent debates) optimizing for the wrong constraint. Icons that load on demand don't need aggressive curation for bundle size. CSS that compresses well under brotli doesn't need a JS abstraction. Backwards compatibility isn't needed for internal refactors.

Ask "what's the actual cost?" before investing energy in reducing it. The user will cut through hypothetical optimization with empirical cost data.

---

## Quick Reference

| Trap | Correction |
|------|------------|
| Forming opinions from docs alone | Read `src/components/` for production patterns |
| Building metadata/abstraction layers | Check if the source material is already sufficient |
| Deferring work that should be finished now | Read the room — the user may see the full arc |
| Applying training-data assumptions | Verify against actual codebase behavior |
| Optimizing for hypothetical costs | Ask about the real cost model first |
| Pushing harder when stuck | Delegate to a fresh perspective |
| Adding semantic abstraction early | Start literal, promote with evidence |

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Mental Model** | `mental-model` | Understanding the framework's core concepts |
| **Build System** | `build-system` | Working with the build pipeline |
| **Agent Guestbook** | `agent-guestbook` | Reading the full stories behind these lessons |
