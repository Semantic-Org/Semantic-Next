# Writing Gateway Pages

> Last Updated: 2026-01-07

**For:** AI agents writing landing/index pages
**When:** First contact with a system, package, or major feature
**Prerequisites:** Read [writing-effectively.md](../reference/writing-effectively.md) (required), [authoring-standards.md](../authoring-standards.md), and [target-audience.md](../reference/target-audience.md)

---

## When to Use This Page Type

Gateway pages are **first contact**. The reader is uncommitted—they're deciding whether to invest time learning more.

**Use gateway format for:**
- Package index pages (`/docs/guides/query/index.mdx`)
- System overviews (`/docs/guides/components/index.mdx`)
- Feature landing pages (`/docs/guides/reactivity/index.mdx`)

**Don't use gateway format for:**
- Teaching how to use something → use [guide.md](./guide.md)
- Method documentation → use [api-reference.md](./api-reference.md)

---

## The Core Principle

**Gateway pages must earn attention.**

Readers arrive with existing beliefs and limited time. They're pattern-matching against frameworks they know, looking for reasons to care or move on.

Don't explain what the thing *is*. Establish what problem it *solves*.

---

## Problem-First Structure

### ❌ Wrong (stability model)

```markdown
## Overview

Semantic UI Query is a lightweight DOM manipulation library. It provides
a chainable API for selecting and manipulating elements...
```

This explains what it is. Readers ask: "So what? I have jQuery/vanilla JS."

### ✅ Right (instability model)

```markdown
## The Shadow DOM Challenge

Web components encapsulate their internal structure using Shadow DOM.
This is powerful for isolation, **but** standard DOM APIs cannot cross
these boundaries—`querySelector` stops at shadow roots.

Query solves this by providing intuitive traversal across all DOM
boundaries, with a familiar chainable API.
```

This names a problem readers experience, then positions the solution.

---

## Instability Language

The word **"but"** (or "however", "although", "yet") transforms background into problem-building.

### Tension Markers
- but, however, although, nonetheless, yet
- despite, while, even though
- inconsistent, contradicts, challenges
- tension, conflict, gap, limitation

### Cost Language
- painful trade-offs, verbose boilerplate
- forces developers to, requires manual
- breaks, leaks, scatters, couples
- awkward, dated, tedious

### Solution Language
- resolves this tension, bridges this gap
- replaces X with Y, eliminates the need for
- without requiring, while maintaining

---

## Two-Part Structure

Gateway pages have two distinct halves: **convince** then **excite**.

### Part 1: Convince (Earn Attention)

The reader is uncommitted and scanning. This section must be **short**—capture attention and provide value immediately. Don't explain; establish why they should care.

- Problem statement with instability language (1-2 paragraphs max)
- Solution positioning (problem/solution table works well)
- Minimal working example
- Key differentiator (framework compatibility, no build step, etc.)

**Keep it brief.** If Part 1 is too long, readers leave before reaching the tour. The problem/solution table does heavy lifting—use it instead of prose.

**Goal:** Reader thinks "this solves a real problem I have."

### Part 2: Technical Tour (Excite)

The reader is now curious. This section previews what's possible and acts as a **gateway to subsections**.

- Brief feature sections with code snippets
- Each links to detailed guide for depth
- Show, don't explain—code speaks louder than prose
- **Simple capability headers** ("Templating", "Styling", "Events")—not problem-solution phrases

The problem-solution framing belongs in Part 1. Part 2 headers are scannable keywords for readers who want to jump to a specific feature.

**Goal:** Reader thinks "I want to learn how to do that" and clicks through to guides.

---

## Structure Template

```markdown
## The [Problem Name]

[Status quo] **But** [tension/limitation]. [Cost of the problem]

[How this solution resolves the tension]

| Problem | Solution |
|---------|----------|
| Pain point 1 | How this addresses it |
| Pain point 2 | How this addresses it |

<PlaygroundExample id="minimal-demo"></PlaygroundExample>

### [Subsection if needed]

[Framework compatibility, key differentiator, etc.]

## [Feature A, Problem-Framed]

[1-2 sentences positioning the feature as solving a pain point]
[Link to detailed guide]

```code
[Brief, exciting code example]
```

## [Feature B, Problem-Framed]

[Same pattern—brief, code-forward, links out]

## Getting Started

[Clear next step—link to first guide or tutorial]
```

---

## Example: Query Package

### ❌ Before (stability)

```markdown
## Introduction

Query is a lightweight (21kb) DOM manipulation library designed to work
with both standard DOM and Shadow DOM. It provides a familiar, chainable
API inspired by jQuery.
```

### ✅ After (instability)

```markdown
## The Shadow DOM Challenge

Web components encapsulate their internal structure using Shadow DOM,
creating clear boundaries that standard DOM APIs cannot cross. This
encapsulation is powerful for building isolated components, **but**
presents challenges when you need to:

- Select elements across multiple component boundaries
- Traverse from one component into another's shadow DOM
- Access slotted content from parent components

With native DOM APIs, these operations stop at shadow boundaries.

```javascript
// Native APIs stop at shadow boundaries
document.querySelector('ui-dropdown .option'); // Returns null

// Query seamlessly crosses boundaries
$$('ui-dropdown .option'); // Returns all matching elements
```
```

---

## Checklist

### Part 1: Convince
- [ ] First paragraph contains instability language (but, however, although)
- [ ] Problem named before solution introduced
- [ ] Cost of problem is clear (why should reader care?)
- [ ] Solution framed as resolving the stated problem
- [ ] Working example demonstrates the value proposition

### Part 2: Technical Tour
- [ ] Feature sections are brief (1-2 sentences + code)
- [ ] Code examples show what's possible, not how it works
- [ ] Each section links to detailed guide for depth
- [ ] Headers use problem-solution framing

### Overall
- [ ] Clear transition from convince to tour
- [ ] Written for uncommitted reader (earns attention)
- [ ] Clear path to next step (getting started)
- [ ] Follows [authoring-standards.md](../authoring-standards.md)

---

## Common Mistakes

### Leading with definition
"X is a library that..." → Readers don't care what it is until they know why they need it.

### Feature lists without context
Bullet points of capabilities don't establish value. Frame each feature as a solution to a problem.

### Assuming reader commitment
Guide pages can assume commitment. Gateway pages cannot—they must earn it.

### Marketing language
"Powerful", "seamless", "easy" are empty. Show the problem/solution concretely.
