---
title: Repository Guide
description: Top-level directory structure, documentation site layout, test locations, configuration files, and key entry points for navigating the Semantic UI monorepo.
keywords: [repo, directory, navigation, docs, tests, config, menus, astro, dprint, examples]
audience: contributing
skill: repo-guide
type: skill
---

# Repository Guide

> **Skill:** `repo-guide`
> **Purpose:** Quick orientation to the monorepo layout — where things live and how to find them.

---

## Root Structure

```
├── ai/                     # AI context, skills, and workflows
├── docs/                   # Documentation website (Astro)
├── examples/               # Standalone demos
├── packages/               # Core framework packages (see internals for details)
├── src/                    # First-party UI library
│   ├── primitives/         # Spec-driven canonical components (button, input, menu, ...)
│   ├── components/         # Application-level components (nav-menu, panels, ...)
│   ├── behaviors/          # Reusable logic attachments (transition, tooltip, ...)
│   ├── css/                # Global tokens and reset
│   │   ├── tokens/         # Design token definitions (see css-token-system)
│   │   └── global/         # Reset, base styles
│   └── specs/              # Spec entry points and exports
├── tests/                  # Monorepo test harnesses
├── tools/                  # MCP server and other tooling
└── scripts/                # Build and utility scripts
```

---

## Documentation Site: `docs/`

```
docs/
├── src/
│   ├── pages/              # All documentation content
│   │   ├── docs/
│   │   │   ├── guides/     # Conceptual guides (components, templates, reactivity, query)
│   │   │   └── api/        # API reference (organized by package)
│   │   └── content/        # Content API endpoints (docs, examples, specs, lessons, AI context)
│   ├── examples/           # Interactive examples (hand-written, canonical patterns)
│   ├── helpers/
│   │   └── menus.js        # Documentation menu structure — MUST modify when adding pages
│   └── components/         # Astro components used in docs
├── astro.config.mjs        # Site config
└── package.json            # Docs site dependencies
```

**`menus.js` is critical** — it defines the sidebar navigation order. New documentation pages are invisible until added here. The menu order represents the intended learning progression.

---

## Tests: `tests/`

```
tests/
├── configs/                # Test runner configurations
├── scripts/                # Test utilities
└── setup/                  # Test environment setup
```

Individual package tests live in `packages/{name}/test/`. See `writing-tests` for patterns and `testing-architecture` for infrastructure.

---

## Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Monorepo root, workspace config, scripts |
| `dprint.json` | Code formatting rules (see `code-formatting`) |
| `docs/astro.config.mjs` | Documentation site config |
| `docs/src/helpers/menus.js` | Sidebar menu structure — modify for new pages |

---

## Related Skills

| Skill | Use when... |
|-------|-------------|
| **Framework Internals** (`internals`) | Understanding package internals, AST pipeline, reactivity chain |
| **Mental Model** (`mental-model`) | User-facing framework concepts |
| **Build System** (`build-system`) | Build scripts, esbuild plugins, export conditions |
| **Writing Tests** (`writing-tests`) | Writing unit/DOM/browser tests |
