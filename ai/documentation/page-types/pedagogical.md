# Writing Pedagogical Pages (Learn REPL)

> Last Updated: 2026-01-07

**For:** AI agents writing interactive tutorial lessons
**When:** Creating step-by-step learning experiences in the Learn REPL
**Status:** PLACEHOLDER — Full guide not yet written

---

## When to Use This Page Type

Pedagogical pages are **interactive lessons** in the Learn REPL (`/learn/*`). They combine code with prose, building concepts incrementally with challenges.

**Use pedagogical format for:**
- Interactive tutorials in `/docs/src/content/lessons/`
- Step-by-step concept introduction
- Challenge-based learning with solutions

**Don't use pedagogical format for:**
- Static documentation → use [guide.md](./guide.md)
- Reference material → use [api-reference.md](./api-reference.md)

---

## Structure Overview

Each lesson is a folder in `/docs/src/content/lessons/`:

```
lessons/
├── 211-hello-world/
│   ├── index.mdx          # Prose explanation
│   ├── example/           # Starting code
│   │   └── component.js
│   └── solution/          # Challenge solution
│       └── component.js
```

### Numbering Scheme

- `1xx` — Introduction/overview lessons
- `2xx` — Basic guide lessons
- First digit: category
- Second digit: subcategory
- Third digit: sequence within subcategory

---

## Content Pattern

```markdown
---
title: Lesson Title
category: 'Basic Guide'
subcategory: 'Getting Started'
description: What the reader will learn
sort: '2.1.1'
references:
  - title: Related Doc
    link: /docs/path
---

## Concept Introduction

Brief explanation of what we're learning.

## Key Concepts

1. **Concept A**: Brief explanation
2. **Concept B**: Brief explanation

## Understanding the Code

Looking at [component.js](#component.js), notice how:

- Point about the code
- Another observation
- Connection to concepts above

## Try It Yourself

Challenge prompt for the reader.

Hints:
1. First hint
2. Second hint
```

---

## Key Characteristics

- **Code-first**: Code is primary, prose explains it
- **Incremental**: Each lesson builds on previous ones
- **Interactive**: Reader can edit and run code
- **Challenge-based**: "Try It Yourself" with solutions
- **Reference links**: Connect to full documentation

---

## Reference Model

See [Svelte's interactive tutorial](https://svelte.dev/tutorial) for the interaction pattern this format emulates.

---

## TODO

This guide needs expansion covering:

- [ ] Detailed prose writing style for lessons
- [ ] How to structure example/ and solution/ code
- [ ] Challenge design principles
- [ ] Metadata schema (category, subcategory, tags, references)
- [ ] Integration with LearnExample component
