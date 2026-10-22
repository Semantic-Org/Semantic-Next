---
title: Writing Guide Pages
description: How to write instructional guide pages for Semantic UI. Covers progressive complexity, code-to-prose ratio, and the structural template. Load when creating or editing any page in docs/src/pages/docs/guides/.
keywords: [guide pages, instructional writing, progressive complexity, code examples, technical writing]
audience: docs
skill: docs-page-guide
type: skill
---

# Writing Guide Pages

> **Skill:** `docs-page-guide`
> **Purpose:** How to write instructional guide pages — pages that teach concepts with progressive complexity

**Golden rule: one sentence of prose per code block, not one paragraph.** The code is the lesson. Prose provides the minimum context to understand what the code demonstrates and why it matters. If the reader needs more than a sentence to understand the example, the example is too complex for that point in the page.

**Prerequisites:** Load `docs-authoring-standards` for heading hierarchy and frontmatter, and see `docs-page-guide-examples` ([real before/after rewrites](./docs-page-guide-examples.md)) before writing a new guide page from scratch.

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

## Audience Modeling & Section Ordering

Before writing a single heading, model **who is arriving on this page and what they want to read first**. Agents default to organizing pages by how the code is architected internally (`registerPlugin` → `addPlugin` → `extendParams`). Readers arrive with a task, not an architecture diagram.

### 1. Identify If There Are Multiple Audiences (Bifurcate or `2 + Addendum`)

Many features serve more than one distinct reader:
- **Audience 1 (The Consumer)**: Wants to use an existing feature/plugin/component right now (90% of readers).
- **Audience 2 (The Author)**: Wants to build their own plugin/behavior/custom primitive (10% of readers).
- **Addendum (The Escape Hatch)**: Wants a lightweight alternative without the full ceremony (e.g. `extendParams` when they don't need a full plugin).

When a topic has both consumers and authors, **bifurcate the page**:
1. **`## Using X`** (Consumer first — installing a 3rd-party package, local import, configuring on a component)
2. **`## Authoring X`** (Author second — registering, creating the instance, scoping, settings)
3. **`## Lightweight Alternative`** (Addendum at the end — placed last so it doesn't derail either primary flow)

### 2. Order Sections Within Each Audience

Choose the rhetorical ordering that fits the material:
- **By what you write first vs. least often**: Start with the first line a user has to write (installing/enabling), then configuring a component, and save power-user hooks (`resolveSettings`, custom `appliesTo` predicates) for later subsections.
- **By simplest to most complex**: Show the default declarative case (`defaultSettings: { lang: 'en' }`) before the custom runtime resolver (`resolveSettings`).
- **By the anatomy of the definition**: When teaching an options-bag API (`defineComponent`, `registerPlugin`, `registerBehavior`), show a commented skeleton of the whole object first, then dedicate one `###` subsection to each key.

---

## Hard Rules for Code Samples & Perspective

These three rules hold on **every** guide page without exception:

### 1. Gloss Anything Unrelated to What the Snippet Teaches

Every line in a code block that isn't part of the current lesson is visual noise. Use shorthand identifiers or comments (`tagName, createComponent, // rest`) or omit unrelated keys entirely.

❌ **Full boilerplate (reader has to hunt for `i18n`):**
```javascript
defineComponent({
  tagName: 'checkout-summary',
  template: '<h3>{t "title"}</h3>',
  css: '.summary { padding: 1rem; }',
  defaultSettings: { currency: 'USD' },
  i18n: {
    lang: 'es',
  },
  createComponent({ self }) {
    return {};
  },
});
```

✅ **Glossed (only the lesson is expanded):**
```javascript title='User' {2-4}
defineComponent({
  i18n: {
    lang: 'es', // component uses a diff lang
  },
  tagName,
  createComponent,
  // rest
});
```

### 2. Maximum ~10 Lines per Code Sample

Code samples in guides should be **at most ~10 lines**, and only that many when the lines are short. If a snippet grows past ~10 lines, one of three things is wrong:
1. Unrelated setup wasn't glossed (`tagName, createComponent, // rest`).
2. Multiple concepts (`createPlugin`, `lifecycleParams`, `templateHelpers`) are crammed into one block instead of split into separate `###` subsections.
3. It is a full working demo that belongs in a `<PlaygroundExample>`, not an inline snippet.

### 3. Write From the User's Callsite, Never From the Source Code

An agent that just read the implementation will naturally narrate internal mechanisms (*"defaultSettings merged in addPlugin are wrapped in a reactive proxy, while non-overridden keys read through the prototype chain"*). A reader with no familiarity with the internals does not know what "reactive proxy" means and does not care.

- **Explain the user-visible contract**: *"Plugin settings let you specify settings that a downstream user can set on their component."*
- **Never confuse an idiom with a built-in feature**: If an example `i18n` plugin happens to expose `i18n` via `lifecycleParams` and `{t}` via `templateHelpers`, do not write *"Once added, a plugin's helpers and callback parameters are available inside the component"* as if `addPlugin` does that automatically. Say *"Some plugins might also expose new lifecycle arguments..."*

---

## Bag of Structural Techniques

Use these techniques when they fit the material — they are tools in a kit, **not** a cookie-cutter template to stamp onto every page.

### Paired Actor Code Blocks (`title="..."` + `{line-highlights}`)

When a concept involves two sides (author vs. consumer, component vs. template, Query vs. Native DOM, match vs. non-match), pair two 5–8 line code blocks with `title="Plugin"` and `title="User"` (or `title="User (Plugin Used)"` / `title="User (Plugin Not Used)"`) and `{line-highlights}`. The juxtaposition explains the relationship better than a paragraph of prose.

```javascript title='Plugin' {3-5}
registerPlugin({
  name: 'i18n',
  defaultSettings: {
    lang: 'en',
  },
});
```

```javascript title='User' {2-4}
defineComponent({
  i18n: {
    lang: 'es', // component uses a diff lang
  },
  tagName,
  createComponent,
  // rest
});
```

### Commented Config Skeleton

When introducing an API that takes an options bag (`defineComponent`, `registerPlugin`, `registerBehavior`), show the whole object shape once with 4–7 word inline comments on each key before breaking each key out into its own `###` subsection:

```javascript
registerPlugin({
  namespace, // how its stored on el
  defaultSettings, // setting a user can write with defaults
  resolveSettings, // custom resolver for user settings
  createPlugin, // instance creation factory
  lifecycleParams, // args to add to lifecycle events
  templateHelpers, // obj of template helpers to add
  onCreated, // runs on component created
  onRendered, // runs on component rendered
  onDestroyed, // runs on component destroyed
  appliesTo, // determines which components plugin applies to
});
```

### Ways to Open a Guide Page

Vary the opening to match the page's scope (never stamp the same opening structure onto every page):
- **Broad multi-feature topic** (e.g. `plugins.mdx`, `instances.mdx`): One sentence stating what the feature enables, followed by a 3–5 bullet capability list with `#anchor` links to the sections below.
- **Focused single-concept topic** (e.g. `settings.mdx`, `state.mdx`): One sentence defining the concept and how it differs from its sibling concept (`Settings` vs `State`), then straight into the first code block.

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
- Who is the audience, and does the page need to bifurcate (`Using` → `Authoring` → `Addendum`)?
- Read `docs-page-guide-examples` to calibrate tone, snippet length, and `Plugin`/`User` pairing.

**While writing:**
- 1 sentence of prose per code block, not 1 paragraph
- Max ~10 lines per code block; gloss everything unrelated (`tagName, createComponent, // rest`)
- Write from the user's callsite, never narrate source-code internals (`Proxy`, prototype chains)
- Separate automatic API behavior from optional plugin/component conventions
- Progressive complexity: one new concept per heading

**Structural:**
- `##` for main sections, `###` for subsections (both appear in nav)
- Use `title="..."` and `{line-highlights}` on paired code blocks when showing two sides of an interaction
- PlaygroundExample for interactive demos, inline code for syntax
- Link to API reference for method details, don't duplicate signatures

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Guide Rewrite Examples** | `use_skill: docs-page-guide-examples` | Before/after rewrites showing audience modeling, glossing, and paired blocks |
| **Authoring Standards** | `use_skill: docs-authoring-standards` | Heading hierarchy, frontmatter, code blocks |
| **Writing Docs** | `use_skill: docs-writing` | Prose quality, anti-patterns, editing strategy |
| **Target Audience** | `use_skill: docs-target-audience` | Understanding who reads these guides |
| **Gateway Pages** | `use_skill: docs-page-gateway` | Index pages where reader is uncommitted |
| **API Reference** | `use_skill: docs-page-api-reference` | Method documentation — different format |
| **Example Authoring** | `use_skill: docs-examples-authoring` | Creating PlaygroundExample content |
