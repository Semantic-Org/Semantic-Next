# Writing Gateway Pages

> Last Updated: 2026-01-07

**For:** AI agents writing landing/index pages
**When:** First contact with a system, package, or major feature
**Prerequisites:** Read [authoring-standards.md](./authoring-standards.md) and [target-audience.md](../reference/target-audience.md)
**Related:** [Writing Effectively](../reference/writing-effectively.md)

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

## Structure Pattern

```markdown
## The [Problem Name]

[Describe the status quo—what readers currently do or believe]

**But** [introduce the tension, limitation, or pain point]

[Show the cost of this problem]

## How [Package/Feature] Solves This

[Position your solution against the problem you just established]

| Problem | Solution |
|---------|----------|
| Pain point 1 | How this addresses it |
| Pain point 2 | How this addresses it |

<PlaygroundExample id="minimal-demo"></PlaygroundExample>

## Key Concepts

Brief overview of what readers will learn:

- **[Concept A](/link)** — One sentence description
- **[Concept B](/link)** — One sentence description

## Getting Started

[Clear next step—usually link to first guide page]
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

### Problem Statement
- [ ] First paragraph contains instability language (but, however, although)
- [ ] Problem named before solution introduced
- [ ] Cost of problem is clear (why should reader care?)

### Solution Positioning
- [ ] Solution framed as resolving the stated problem
- [ ] Features presented as answers to pain points
- [ ] Not just a capability list

### Reader State
- [ ] Written for uncommitted reader
- [ ] Earns attention rather than assuming it
- [ ] Clear path to next step (getting started)

### Technical
- [ ] Follows [authoring-standards.md](./authoring-standards.md)
- [ ] Working example demonstrates the value proposition
- [ ] Links to detailed guides for each concept

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
