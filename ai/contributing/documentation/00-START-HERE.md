---
title: Documentation Writing Hub
description: Central navigation hub for AI agents working on Semantic UI documentation, providing task routing to page types, examples, enhancement operations, and quality guidelines.
keywords: [documentation, writing, navigation, page types, examples, quality, guides]
audience: contributing
type: doc
---

# Documentation Writing Hub

> Last Updated: 2026-01-07

**For:** AI agents creating or editing Semantic UI documentation
**Purpose:** Route to the correct context based on your task

---

## Decision Tree

```
What are you doing?

├── WRITING A NEW PAGE
│   │
│   ├── What type of page?
│   │   │
│   │   ├── Landing/index page for a system or package?
│   │   │   └── page-types/gateway.md
│   │   │       Requires: reference/writing-effectively.md
│   │   │       "Convince readers to explore further"
│   │   │
│   │   ├── Teaching how to use a concept or feature?
│   │   │   └── page-types/guide.md
│   │   │       "Instructional, progressive complexity"
│   │   │
│   │   ├── Documenting methods, parameters, returns?
│   │   │   └── page-types/api-reference.md
│   │   │       "Lookup format, exhaustive"
│   │   │
│   │   └── Interactive learn REPL lesson?
│   │       └── page-types/pedagogical.md
│   │           "Code-first with challenges"
│   │
│   └── Before writing ANY page, also read:
│       └── authoring-standards.md
│           "Headers, frontmatter, embedding examples"
│
├── CREATING CODE EXAMPLES
│   └── examples/authoring.md
│       "Metadata, file structure, code quality"
│       Also: examples/self-critique.md for review
│
├── ENHANCING EXISTING TEXT
│   │
│   ├── Adding internal links?
│   │   └── enhance/add-links-to-text.md
│   │
│   ├── Evaluating text quality?
│   │   └── enhance/evaluate-text.md
│   │
│   └── Rewriting to improve?
│       └── enhance/rewrite-text.md
│
├── CHECKING QUALITY
│   │
│   ├── Detecting AI-generated slop?
│   │   └── quality/slop-identification.md
│   │
│   └── Seeing examples of good writing?
│       └── quality/good-examples.md
│
└── UNDERSTANDING PRINCIPLES
    │
    ├── Who is the audience?
    │   └── reference/target-audience.md
    │
    └── Why problem-first writing?
        └── reference/writing-effectively.md
```

---

## Page Types at a Glance

| Type | When to Use | Key Trait | Reader State |
|------|-------------|-----------|--------------|
| **Gateway** | Index/landing pages | Problem-first, earn attention | Uncommitted |
| **Guide** | Teaching concepts | Instructional, progressive | Committed, learning |
| **API Reference** | Method documentation | Lookup format, exhaustive | Knows what, needs details |
| **Pedagogical** | Learn REPL lessons | Code-first, challenges | Learning interactively |

---

## Folder Structure

```
ai/documentation/
├── 00-START-HERE.md          ← You are here
│
├── authoring-standards.md    # Universal: headers, frontmatter, examples
├── page-types/               # How to write each page type
│   ├── gateway.md               # Landing pages (problem-first)
│   ├── guide.md                 # Instructional guides
│   ├── api-reference.md         # API documentation
│   └── pedagogical.md           # Learn REPL lessons
│
├── examples/                 # Creating code examples
│   ├── authoring.md             # How to create examples
│   └── self-critique.md         # Quality checklist
│
├── quality/                  # Operational checklists
│   ├── slop-identification.md   # Detect AI content
│   └── good-examples.md         # What good looks like
│
├── enhance/                  # Operations on existing text
│   ├── evaluate-text.md         # Critique quality
│   ├── add-links-to-text.md     # Add internal links
│   └── rewrite-text.md          # Improve text
│
└── reference/                # Theory and foundations
    ├── target-audience.md       # Who reads docs
    └── writing-effectively.md   # McEnerney principles
```

---

## Quick Reference

### Writing a new guide page
1. Read `authoring-standards.md` (structural requirements)
2. Read `page-types/guide.md` (writing style)
3. Read `reference/target-audience.md` (who you're writing for)
4. Write the page
5. Run `enhance/add-links-to-text.md` to add internal links

### Writing a gateway/landing page
1. Read `reference/writing-effectively.md` (required — problem-first principles)
2. Read `authoring-standards.md`
3. Read `page-types/gateway.md`
4. Read `reference/target-audience.md` (critical for gateway pages)
5. Write problem-first opening
6. Review against `quality/slop-identification.md`

### Creating a code example
1. Read `examples/authoring.md`
2. Create example files
3. Review against `examples/self-critique.md`

### Improving existing documentation
1. Run `enhance/evaluate-text.md` to identify issues
2. Use `enhance/rewrite-text.md` for substantive changes
3. Use `enhance/add-links-to-text.md` for link enhancement
