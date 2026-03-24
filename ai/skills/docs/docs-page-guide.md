---
title: Writing Guide Pages
description: How to write instructional guide pages for Semantic UI — the most common page type (~106 of ~120 pages). Covers progressive complexity, code-to-prose ratio, and the structural template. Load when creating or editing any page in docs/src/pages/docs/guides/.
keywords: [guide pages, instructional writing, progressive complexity, code examples, technical writing]
audience: docs
skill: docs-page-guide
type: skill
---

# Writing Guide Pages

> **Skill:** `docs-page-guide`
> **Purpose:** How to write the most common documentation page type — instructional guides that teach concepts with progressive complexity

**Golden rule: one sentence of prose per code block, not one paragraph.** The code is the lesson. Prose provides the minimum context to understand what the code demonstrates and why it matters. If the reader needs more than a sentence to understand the example, the example is too complex for that point in the page.

**Prerequisites:** Load `docs-authoring-standards` for heading hierarchy and frontmatter.

---

## When to Use This Page Type

Guide pages teach readers **how to use something**. The reader has already decided to learn — they're committed, not browsing.

**Use guide format for:**
- Component concepts (state, lifecycle, events)
- Template features (loops, conditionals, async)
- Reactivity patterns (signals, reactions)
- Query library usage

**Don't use guide format for:**
- Landing/index pages → see `docs-page-gateway`
- Method documentation → see `docs-page-api-reference`
- Interactive tutorials → see `docs-page-pedagogical`

---

## The Ratio Problem

The most common failure in guide pages is too much prose relative to code. The reader arrived to learn how to *use* something, not to read about it.

### ❌ Prose-heavy (reader skips to find the code)

```markdown
### Error Handling

You can use an error block to handle if a promise triggers an error.
This is useful when you want to show users that something went wrong
instead of leaving them with a blank screen. The error block will only
render if the promise rejects.

​```sui
{#async fetchData as data}
  <p>Success: {data.message}</p>
{error as e}
  <p>Failed: {e.message}</p>
{/async}
​```

This example shows how to handle errors by catching them in the error
block and displaying a user-friendly message.
```

Three problems: the intro explains what the code already shows, the outro restates what the reader just read, and neither adds information the code doesn't contain.

### ✅ Code-forward (prose adds what code can't)

```markdown
### Error Handling

Handle rejected promises with an `error` block:

​```sui
{#async fetchData as data}
  <p>Success: {data.message}</p>
{error as e}
  <p>Failed: {e.message}</p>
{/async}
​```

Alias the error for custom naming: `{error as customName}`.
```

The intro says what to do. The code shows how. The follow-up adds a capability the reader wouldn't see from the example alone.

### ❌ Explaining obvious code

```markdown
### Toggling State

The `toggle()` method switches a boolean state value between
`true` and `false`. When the current value is `true`, calling
`toggle()` will set it to `false`, and vice versa.

​```javascript
state.isOpen.toggle();
​```
```

### ✅ Explaining the non-obvious

```markdown
### Toggling State

​```javascript
state.isOpen.toggle();
​```

Boolean signals have `toggle()`, `isTrue()`, and `isFalse()` helpers. These are signal methods — they trigger reactive updates, unlike reading the value and setting it manually.
```

The first version explains what `toggle` means (the reader knows). The second explains that these are signal-level operations with reactive implications (the reader might not know).

### ❌ Over-introducing a section

```markdown
## Events

In this section, we'll explore how Semantic UI handles events.
The event system is designed to work seamlessly with Shadow DOM
and provides a familiar API for developers coming from jQuery
or vanilla JavaScript. Let's look at the various ways you can
attach event listeners to your components.
```

### ✅ Starting with the first useful thing

```markdown
## Events

Attach event listeners using the `events` object in your component definition:

​```javascript
events: {
  'click .submit'() { ... },
  'input .search'({ target }) { ... }
}
​```

Selectors are scoped to the component's Shadow DOM. Events on elements outside the shadow root won't match.
```

---

## Structure Template

```markdown
## Overview

One or two sentences: what this feature is and when you'd reach for it.

> See the [API Reference](/docs/api/package/topic) for method signatures.

## Basic Usage

### Core Syntax

Minimal example. One sentence of context, then code.

​```javascript
// smallest working example
​```

### Simple Example

<PlaygroundExample id="feature-basic" direction="horizontal"></PlaygroundExample>

## Common Patterns

### Pattern A

Code example showing a real use case. Follow-up sentence
only if there's a non-obvious detail.

### Pattern B

Same structure. Each pattern should build on the previous
or show an orthogonal use case.

## Advanced Usage

### Edge Case or Power Feature

Only include if genuinely needed. Don't create an "Advanced"
section just because the template has one.

<PlaygroundExample id="feature-advanced" direction="horizontal"></PlaygroundExample>
```

Adapt this skeleton — not every guide needs all sections. A short feature might have just "Overview" and "Usage." A complex feature might need more subsections under "Common Patterns." The structure serves the content, not the other way around.

---

## Progressive Complexity

Guides should be readable top-to-bottom with increasing sophistication. Each section should assume the reader has absorbed the previous one.

**Sequencing principle:** introduce one concept per heading. If a section requires understanding two new ideas, split it.

```markdown
### Basic (one concept: the syntax)
​```sui
{#each item in items}
  <div>{item.name}</div>
{/each}
​```

### With Index (adds: index variable)
​```sui
{#each item, index in items}
  <div>{index}: {item.name}</div>
{/each}
​```

### Keyed Iteration (adds: key for stable DOM identity)
​```sui
{#each item in items key="id"}
  <div>{item.name}</div>
{/each}
​```

Use `key` when items can be reordered or removed — it preserves
DOM state across re-renders instead of recreating elements.
```

The prose after the keyed example explains *why* you'd use keys. The basic and indexed examples don't need prose because the syntax speaks for itself.

---

## Heading Design

Headings become the in-page navigation menu. Readers scan them to decide what to read. Design headings as a table of contents that works standalone.

❌ Vague headings that require reading the section:
```
## Overview
## Getting Started
## More Features
## Advanced
```

✅ Specific headings that communicate content:
```
## Conditional Rendering
## Iterating Collections
## Async Data Loading
## Keyed Iteration
```

---

## Quick Reference

**Before writing:**
- Is this a guide page? (Teaching how to use something, reader committed)
- What page type are adjacent pages? Match the depth and style.

**While writing:**
- 1 sentence of prose per code block, not 1 paragraph
- No intros, no outros, no transitions between sections
- Explain only what the code can't show (the *why*, the non-obvious)
- Progressive complexity: one new concept per heading

**Structural:**
- `##` for main sections, `###` for subsections (both appear in nav)
- PlaygroundExample for interactive demos, inline code for syntax
- Link to API reference for method details, don't duplicate signatures

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Authoring Standards** | `use_skill: docs-authoring-standards` | Heading hierarchy, frontmatter, code blocks |
| **Writing Docs** | `use_skill: docs-writing` | Prose quality, anti-patterns, editing strategy |
| **Target Audience** | `use_skill: docs-target-audience` | Understanding who reads these guides |
| **Gateway Pages** | `use_skill: docs-page-gateway` | Index pages where reader is uncommitted |
| **API Reference** | `use_skill: docs-page-api-reference` | Method documentation — different format |
| **Example Authoring** | `use_skill: docs-examples-authoring` | Creating PlaygroundExample content |
