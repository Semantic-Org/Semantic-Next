---
title: Target Audience for Semantic UI Documentation
description: Who reads Semantic UI documentation and how that should change your writing — audience profiles translated into concrete writing directives. Load before writing any documentation page, especially gateway pages.
keywords: [target audience, early adopters, reader expectations, framework fatigue, web components, skeptical developers]
audience: docs
skill: docs-target-audience
type: skill
---

# Target Audience for Semantic UI Documentation

> **Skill:** `docs-target-audience`
> **Purpose:** Who reads these docs and what that means for how you write

**Golden rule: write for someone who is technically stronger than you but has less time than you.** They can evaluate your claims — so make real ones. They'll leave if you waste their attention — so don't.

---

## Reader Profiles

Three overlapping groups, all experienced:

**Framework-fatigued developers** — Have used React, Vue, Angular, or Svelte professionally. Skeptical of "yet another framework." They're looking for reasons to dismiss this, not reasons to adopt it. Your job is to make dismissal harder by showing concrete problems solved.

**Standards-minded developers** — Want native platform features over framework abstractions. Have tried vanilla Web Components and found the ergonomics painful. Predisposed to the thesis but need proof the DX actually works. Show, don't argue.

**Technical evaluators** — Tech leads assessing adoption. Time-constrained, scanning for red flags. They read headings and code examples, skip prose. Structure must work even if they never read a full paragraph.

---

## What They Believe Coming In

These are existing beliefs you're writing against:

- "Web Components are the right standard but painful to use"
- "Modern DX requires build tools and compilation"
- "Framework abstractions are necessary for productivity"

Reference pages (guides, API docs) don't need to challenge these — the reader is already learning. Gateway pages must engage with these beliefs directly. See `docs-page-gateway` for how.

---

## Writing Directives

Each audience trait translates into a concrete writing behavior:

| They are... | So you should... | Not... |
|---|---|---|
| Experienced | Start with what's different about SUI, not what Web Components are | Explaining Shadow DOM basics, reactive programming concepts |
| Skeptical | Make claims verifiable — show code that proves the point | Asserting "powerful", "seamless", "easy" |
| Time-constrained | Put value in the first two sentences of every section | Warming up with background, definitions, or history |
| Evaluating against alternatives | Show the problem first, then the SUI solution | Listing features without establishing why they matter |
| Capable of reading code | Let code examples carry the explanation | Narrating what the code does line by line |
| Pattern-matching for red flags | Use clean structure and consistent formatting | Inconsistent heading depth, broken examples, walls of prose |

---

## Common Mistakes

❌ **Gap framing**: "No one has built a framework that combines X and Y"
✅ **Problem framing**: "Combining X and Y currently forces a trade-off between A and B"

The difference: gap framing assumes filling gaps is inherently valuable. Problem framing establishes cost.

❌ **Newness as value**: "A modern approach to web components"
✅ **Capability as value**: "Web components without the boilerplate — no build step required"

The difference: every framework was new once. What it enables is durable.

❌ **Feature list opening**: "Semantic UI provides reactive state, scoped CSS, template expressions..."
✅ **Problem opening**: "Shadow DOM isolates your components, but standard DOM APIs can't cross those boundaries."

The difference: features without context are marketing. Problems create demand for solutions.

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Writing Docs** | `use_skill: docs-writing` | Prose quality, voice standards, editing strategy |
| **Gateway Pages** | `use_skill: docs-page-gateway` | Landing/index pages where the reader is uncommitted |
| **Guide Pages** | `use_skill: docs-page-guide` | Instructional pages where the reader is committed |
| **Authoring Standards** | `use_skill: docs-authoring-standards` | Page structure — headings, frontmatter, examples |
