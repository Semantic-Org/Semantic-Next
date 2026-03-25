---
title: Writing Guide Pages
description: Instructions for writing instructional guide pages that teach how to use concepts, features, and patterns with progressive complexity and practical examples.
keywords: [guide pages, instructional writing, progressive complexity, code examples, technical accuracy]
audience: contributing
type: doc
---

# Writing Guide Pages

> Last Updated: 2026-01-07

**For:** AI agents writing instructional guide pages
**When:** Teaching how to use a concept, feature, or pattern
**Prerequisites:** Read [authoring-standards.md](../authoring-standards.md) first
**Related:** [Target Audience](../reference/target-audience.md)

---

## When to Use This Page Type

Guide pages teach readers **how to use something**. The reader has already decided to learn—they're committed, not browsing.

**Use guide format for:**
- Component concepts (state, lifecycle, events)
- Template features (loops, conditionals, async)
- Reactivity patterns (signals, reactions)
- Query library usage

**Don't use guide format for:**
- Landing/index pages → use [gateway.md](./gateway.md)
- Method documentation → use [api-reference.md](./api-reference.md)
- Interactive tutorials → use [pedagogical.md](./pedagogical.md)

---

## Writing Style

### Core Principles

1. **Concise but instructional** — Like Svelte/Vite docs, not verbose but helpful
2. **Show with code** — Demonstrate concepts with practical examples
3. **Progressive complexity** — Start simple, build to advanced
4. **Avoid marketing language** — No "powerful", "easy", "seamless"

### What to Include

- Brief concept introduction (what it is, why useful)
- Syntax examples (clean, minimal code)
- Working examples (PlaygroundExample with real code)
- Practical patterns (real-world usage)

### What to Avoid

- Obvious explanations (don't explain what code clearly shows)
- Non-functional examples (all code should work)
- Marketing prose (focus on what it does)
- API documentation (belongs in API reference)

---

## Example Comparison

### ❌ Bad (verbose, obvious)

```markdown
### Error Handling

You can use an error block to handle if a promise triggers an error.
This is useful when you want to show users that something went wrong
instead of leaving them with a blank screen. The error block will only
render if the promise rejects.

```sui
{#async fetchData as data}
  <p>Success: {data.message}</p>
{error as e}
  <p>Failed: {e.message}</p>
{/async}
```

This example shows how to handle errors by catching them in the error
block and displaying a user-friendly message.
```

### ✅ Good (concise, instructional)

```markdown
### Error Handling

Handle rejected promises with an `error` block:

```sui
{#async fetchData as data}
  <p>Success: {data.message}</p>
{error as e}
  <p>Failed: {e.message}</p>
{/async}
```

Alias the error for custom naming: `{error as customName}`.
```

---

## Structure Pattern

```markdown
## Overview

Brief introduction to the concept. One or two sentences.

> Link to related guides or API reference.

## Basic Usage

### Core Syntax

Minimal example showing the feature.

### Simple Example

<PlaygroundExample id="feature-basic"></PlaygroundExample>

## Advanced Features

### Feature A

More complex patterns.

### Feature B

Edge cases and options.

## Practical Patterns

### Common Use Case

Real-world application.

<PlaygroundExample id="feature-advanced"></PlaygroundExample>
```

---

## Technical Accuracy

### Reactivity

- **Reactive values**: `state` and `settings` properties (backed by Signals)
- **Non-reactive values**: Regular JavaScript variables, props, static data
- **Template access**: Use direct property names (`userId`, not `state.userId`)

**Correct:**
```sui
<!-- Re-executes when userId state changes -->
{#async fetchUser userId as user}
  <h3>{user.name}</h3>
{/async}
```

**Incorrect:**
```sui
<!-- Would NOT be reactive if userId is just a variable -->
{#async fetchUser(normalVariable) as user}
  <h3>{user.name}</h3>
{/async}
```

### Template Syntax

- **Data context**: Direct property names (`{counter}` not `{state.counter}`)
- **Function calls**: Semantic style (`{fetchUser userId}`) or JS style (`{fetchUser(userId)}`)
- **Settings**: Direct names (`{apiEndpoint}` not `{settings.apiEndpoint}`)

### Common Mistakes

1. Incorrect reactivity claims — not everything is reactive
2. Wrong data context access — using prefixes when not needed
3. Unnecessary parentheses — template supports semantic style
4. Confusing signals — templates handle `.get()` automatically

---

## Progressive Complexity Pattern

```markdown
### Basic Syntax
Simple usage example.

### With Options
Adding configuration.

### Advanced Usage
Complex scenarios and edge cases.
```

---

## Quality Checklist

### Content
- [ ] Concise, instructional tone
- [ ] Progressive complexity (simple → advanced)
- [ ] Working, accurate code examples
- [ ] Clear practical value for each section

### Technical Accuracy
- [ ] Correct reactivity understanding
- [ ] Accurate template syntax
- [ ] Verified against existing docs
- [ ] Code examples tested conceptually

### Structure
- [ ] Proper heading hierarchy
- [ ] PlaygroundExample in logical places
- [ ] Links to related concepts

---

## Workflow

1. **Research** — Read similar guides, check syntax docs
2. **Outline** — Plan heading structure (## and ###)
3. **Write** — Follow progressive complexity
4. **Examples** — Add PlaygroundExample components
5. **Review** — Check technical accuracy
6. **Enhance** — Run link enhancement agent
