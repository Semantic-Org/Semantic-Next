---
title: Target Audience for Semantic UI Documentation
description: Definition of documentation readers as early adopters, explaining their characteristics, expectations, and how to write problem-first content that changes their beliefs.
keywords: [target audience, early adopters, problem-first, instability language, reader expectations]
audience: contributing
skill: docs-target-audience
---

# Target Audience for Semantic UI Documentation

> **Skill:** `sui:docs-target-audience`
> **Purpose:** Define who reads Semantic UI documentation and how to write content that changes their understanding

---

## Overview

This guide defines who reads Semantic UI documentation and how to write content that changes their understanding. It applies McEnerney's framework: documentation succeeds not by explaining features, but by solving problems readers already feel.

---

## The Early Adopter Profile

Semantic UI is a novel web component framework. Before mainstream adoption, documentation readers are **early adopters**—a specific audience with distinct characteristics.

### Who They Are

**Experienced developers with framework fatigue**
- Have used React, Vue, Angular, or Svelte professionally
- Understand the trade-offs of existing solutions (build complexity, lock-in, interoperability costs)
- Skeptical of "yet another framework"—they've seen many rise and fade
- Don't need Web Components explained; they need to know why *this* approach is worth their time

**Standards-minded developers**
- Want to use native platform features rather than framework abstractions
- Have been burned by vanilla Web Component ergonomics (verbose boilerplate, Shadow DOM awkwardness)
- Predisposed to the thesis but need proof the developer experience actually works

**Technical evaluators**
- Tech leads or architects assessing adoption for teams or projects
- Time-constrained, pattern-matching against familiar concepts
- Looking for differentiation, not feature lists
- Scanning for red flags that indicate immaturity or poor design

### What They Share

| Trait | Implication for Documentation |
|-------|-------------------------------|
| Don't need hand-holding | Skip basics they already know |
| Skeptical | Make claims concrete and verifiable |
| Time-constrained | Get to value fast—first paragraph matters |
| Can evaluate technical claims | Provide substance, not marketing |
| Looking for differentiation | Lead with what's different, not what's similar |

---

## The Core Insight: Problems Before Features

**Documentation doesn't communicate information. It changes beliefs.**

Early adopters arrive with existing beliefs:
- "Web Components are the right standard but painful to use"
- "Modern DX requires build tools and compilation"
- "Framework abstractions are necessary for productivity"

Effective documentation challenges these beliefs by:
1. Naming the problem readers already feel
2. Establishing tension between the status quo and what's possible
3. Positioning features as solutions to that tension

### The Stability vs. Instability Pattern

**Stability language** (signals "nothing to see here"):
- "Semantic UI is a web component framework..."
- "The component system provides..."
- "Features include..."

**Instability language** (signals value):
- "Web Components are the right foundation... **but** vanilla implementations force painful trade-offs"
- "Modern frameworks provide great DX... **however** they require build complexity and create lock-in"
- "Existing solutions **fail to address** the tension between standards and developer experience"

**Rule:** The word "but" (or "however", "although", "yet") in the first paragraph transforms background into problem-building.

---

## Writing for Early Adopters

### Opening Paragraphs

**Wrong (stability model):**
> Semantic UI components are standard Web Components built with an integrated authoring framework. The framework simplifies common UI development tasks like managing state, rendering templates, handling events, and styling.

This explains what Semantic UI *is*. It assumes readers already care.

**Right (instability model):**
> Web Components are the right foundation for UI development—they're native to the browser, work across frameworks, and don't require compilation. **But** vanilla Web Components force developers into painful trade-offs: verbose boilerplate for basic state management, awkward Shadow DOM querying, manual dependency tracking, and imperative patterns that feel dated compared to modern frameworks.

This names the problem readers already experience. It creates tension that the rest of the document resolves.

### Feature Sections

**Wrong:**
> ### Declarative Templating
> Components use a built-in templating system that supports expressions, slots, conditionals, snippets, and loops for rendering views from component data.

This describes capability. Readers ask: "So what?"

**Right:**
> ### Templating Without String Manipulation
> Vanilla Web Components typically require string concatenation or verbose `document.createElement` calls to render dynamic content. The templating system replaces this with declarative syntax—expressions, conditionals, loops, slots—that compiles to an AST for efficient updates.

This names what's painful, then positions the feature as a solution.

### Headings

For gateway page technical tours, use **simple capability keywords**:
- "Templating", "Styling", "Events", "Keys"

These are scannable and act as navigation to subsections. Problem-solution framing belongs in the prose beneath them, not in the headers.

**In section prose (good):**
> Vanilla Web Components typically require string concatenation... The templating system replaces this with declarative syntax.

**In headers (keep simple):**
> ### Templating

---

## Instability Language Reference

Use these patterns in opening paragraphs and section intros:

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
- handles automatically, manages transparently

---

## What Not To Do

### Don't explain basics they already know
Early adopters understand Web Components, Shadow DOM, reactive programming. Don't waste their time with introductions to concepts they've used professionally.

### Don't use gap framing
"No one has built a framework that combines X and Y" assumes filling gaps is inherently valuable. Early adopters ask: "So what? Why should I care about this gap?"

### Don't rely on "new" or "modern"
Newness isn't value. Every framework was new once. Focus on what problems it solves that existing solutions don't.

### Don't front-load feature lists
Bullet points of capabilities before establishing problems signal "marketing material." Readers pattern-match and disengage.

### Don't assume readers will discover value
If value isn't clear in the first two paragraphs, readers won't scroll to find it.

---

## Checklist for Documentation Review

For any guide or landing page, verify:

- [ ] Does the opening paragraph contain instability language (but, however, although)?
- [ ] Is a problem named before features are introduced?
- [ ] Are feature sections framed as solutions to specific pains?
- [ ] Do headings name problems or outcomes, not just capabilities?
- [ ] Is the content written for readers who already know alternatives?
- [ ] Would a skeptical senior developer find substance in the first paragraph?

---

## Relationship to Other Guides

| Guide | Focus | Relationship |
|-------|-------|--------------|
| **This document** | Who the audience is, what they believe | Defines the reader |
| [Evaluate Text](../workflows/contributing/docs-evaluate-text.md) | How to evaluate docs as a technical reviewer | Simulates the reader |
| [Guide Writing](./docs-page-guide.md) | Structural conventions for guide pages | How to format for the reader |
| [Slop Identification](./docs-slop-identification.md) | Detecting low-quality AI-generated content | What to avoid |

---

## Source

This framework synthesizes Larry McEnerney's "The Craft of Writing Effectively" (University of Chicago) with observations about early adopter behavior for novel open source frameworks.
