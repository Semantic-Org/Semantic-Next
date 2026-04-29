---
title: Icon Vocabulary Research
description: How Semantic UI's canonical icon vocabulary is decided, why the descriptivist principle drives promotion, and how the research corpus under ai/research/icons feeds packages/specs/src/icons/mappings.js.
keywords: [icons, mappings, lucide, phosphor, tabler, material symbols, heroicons, descriptivist, vocabulary, agent hit rate, promotion, aliases]
audience: research
skill: icon-vocabulary
type: skill
---

# Icon Vocabulary Research

> **Skill:** `icon-vocabulary`
> **Purpose:** How the canonical icon vocabulary in `mappings.js` was decided and how to read or extend the research corpus that justifies it.

**Golden rule: the canonical name is the one a developer or AI agent would reach for first — not the upstream library's artifact name.** When those diverge (`trash-2` → `trash`, `circle-user` → `avatar`, `square-arrow-out-up-right` → `external-link`), promotion brings the canonical to the reached-for name and demotes the artifact to an alias.

---

## Two systems, one source of truth

`packages/specs/src/icons/mappings.js` is the dictionary. It carries one entry per canonical name with `category`, `aliases`, `description`, `visual`, `usage`, and per-library lookups (`lucide`, `phosphor`, `tabler`, `materialSymbols`, `heroicons`).

| System | Direction | Lives in |
|---|---|---|
| **Build** | `mappings.js` → runtime artifacts (`icons.meta.js`, `sets/{lib}/{lib}.css`, copied SVGs) | `packages/specs/scripts/build-icon-{meta,css,svg}.js` |
| **Generation** | research data → `mappings.js` | `ai/research/icons/icon-mappings/` |

The build pipeline runs every time mappings changes. The generation pipeline runs when the dictionary itself needs to be added to or refreshed.

## The descriptivist principle

The optimization target is **agent hit rate**: the names a developer or AI agent reaches for on first pass. Misses cost — broken icon, fallback, or a manual import that breaks flow. Three jobs flow from this:

1. **Cover what agents reach for on first pass** — drives the canonical roster (~482 names converged from ~1,668 Lucide primaries).
2. **Bridge naming gaps** — drives aliases. Library-native names from training data (`zap` → `bolt`, `house` → `home`), intent names (`delete` → `trash`, `edit` → `pencil`), shorthand (`down` → `arrow-down`).
3. **Let agents pick correctly without seeing the glyph** — drives `visual` and `usage` fields, surfaced through the MCP `get_icon` tool.

Where the descriptivist principle bites hardest is **promotion**: when the alias is what 90%+ of developers reach for and the upstream artifact name is just glyph description, the alias becomes canonical and the artifact becomes the alias. `pass5-promotions.json` is the worked example — 18 promotions including `house → home`, `circle-user → avatar`, `triangle-alert → warning`, `square-arrow-out-up-right → external-link`.

## The vocabulary research corpus

Under `ai/research/icons/`:

| File | Role |
|---|---|
| `selection-process.md` | Methodology — three-pass adversarial curation (exhaustive → editorial → audit) |
| `expansion-review.md` | Pass 2 per-icon judgments (additions and rejections with rationale) |
| `reconciliation-audit.md` | Pass 4 third-party audit findings, including 21 mapping-integrity fixes |
| `description-pipeline.md` | Methodology for the blind-vision pipeline producing `visual:` + `usage:` fields |
| `final-list.txt` | Canonical roster |
| `renames.csv` | Artifact-name → canonical rename rules (e.g. `trash-2 → trash`) |
| `pass-1-{exhaustive,editorial}.txt` | Inputs to the reconciliation audit |
| `icon-mappings/rebuild-plan.md` | Methodology for the 5-pass `mappings.js` build |
| `icon-mappings/lucide-primary-icons.csv` | Lucide upstream tags used as Pass 1 input |
| `icon-mappings/_{lib}-{A..E}.json` | Per-library cross-mapping batches with rationale (25 files) |
| `icon-mappings/pass1-{A..E}.json` | Pass 1 worked example (category + description per entry) |
| `icon-mappings/pass3-aliases-{1..5}.json` | Pass 3 worked example (alias generation per entry) |
| `icon-mappings/pass5{,b}-promotions.json` | Promotion table — applied to `mappings.js` |
| `icon-mappings/merge-mappings.mjs` | Merge cross-library fragments into `mappings.js` |
| `icon-mappings/apply-promotions.mjs` | Apply a promotion table to `mappings.js` |

Every research output lands in `mappings.js` losslessly. The corpus is preserved as the audit trail (why this 482? why is `home` canonical and `house` the alias?) and as priors for future re-runs.

## The five passes

```
Pass 1: Roster → category + description           manual subagent fan-out
Pass 2: Cross-library lookup                       manual subagent fan-out → merge-mappings.mjs
Pass 3: Aliases per entry                          manual subagent fan-out
Pass 4: Dedupe (deterministic)                     scripted; mappings.js is the truth
Pass 5: Promotion (descriptivist core)             apply-promotions.mjs
```

After any mutation to `mappings.js`, run `cd packages/specs && npm run build:icons` to regenerate `icons.meta.js`, the five `{lib}.css` files, and the SVG mirrors.

## Quick reference

- **Adding new entries** — see workflow `maintain-icon-vocabulary` (Lucide update scenario).
- **Library rename refresh** — see workflow `maintain-icon-vocabulary` (Phosphor rename scenario).
- **Adding a new library** — see workflow `maintain-icon-vocabulary` (new library scenario).
- **Inspecting an entry** — `mcp__semantic-ui__get_icon` with `query: 'home'` returns canonical, aliases, visual, usage, and all library-native names.
- **Browsing by category** — `mcp__semantic-ui__get_icon` with `category: 'navigation'`. 32 categories listed in `packages/specs/src/icons/categories.js`.

## Related Skills

| Skill | Use when |
|---|---|
| **Maintain Icon Vocabulary** (`maintain-icon-vocabulary` workflow) | Doing a maintenance run — Lucide update, library rename, or adding a library |
| **Component Research Process** (`component-research-process`) | Doing UI component pattern research (different domain — components, not icons) |
| **Authoring AI Context** (`ai-author-context`) | Writing or maintaining content under `ai/skills/` |
