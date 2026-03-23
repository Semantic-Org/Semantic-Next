# AI Folder Consolidation Plan

> **Goal**: Reorganize `ai/` from an ad-hoc structure into audience-first folders with proper YAML frontmatter, flat `sui:` namespace skill names, and no dead duplicates.

---

## Principles

1. **Audience-first folders** — `ui/`, `authoring/`, `contributing/`, `essentials/`, `workflows/`, `research/`, `workspace/`
2. **Skill/context distinction lives in frontmatter**, not folder structure
3. **Flat namespace** — `sui:use`, `sui:component-authoring`, not `sui:ui:use`
4. **Every file gets YAML frontmatter** — `title`, `description`, `keywords`, `audience`, `skill`
5. **Procedural skills ≤ 500 lines** — reference skills can be longer
6. **Prefer recent content** — when source files conflict, `git log` modification date signals freshness
7. **Subfolders where they aid `ls` navigation** — `workflows/{components,framework,documentation,meta,research}`, `contributing/{testing,documentation,meta}`
8. **Audiences** — `ui`, `authoring`, `contributing`, `research`
9. **Component-* prefix** — all authoring skills scoped to component development use `sui:component-*` for clustering in list_skills output
10. **User guides are canonical** — AI skills are agent-optimized compressions of user guides, not replacements. User guides are served via MCP `get_user_doc`.
11. **Old files persist in `ai/old/`** — kept as reference until new versions are fully vetted. Do NOT delete.

## Subagent Requirements

Every subagent doing editorial work MUST:

1. **Read the authoring guide first** — `ai/contributing/meta/author-context-or-skill.md`
2. **Read relevant user guides via MCP** — `get_user_doc` for canonical content
3. **Fetch examples via MCP** — `get_example` for code patterns referenced in guides
4. **Verify against source code** — check actual packages in `packages/` for ground truth
5. **No MCP tool call assumptions** — reference other skills by `sui:id` for linking
6. **No hardcoded component catalogs** — teach patterns, not lists
7. **Skills are self-contained** — loadable and useful in isolation
8. **Add content only from source code evidence** — verifiable from `packages/`

---

## Completed Work

### essentials/ — HUMAN-AUTHORED

| File | Skill | Status |
|------|-------|--------|
| `essentials/mental-model.md` | `sui:mental-model` | ✅ Written by maintainer |
| `essentials/architecture-overview.md` | `sui:architecture-overview` | ✅ Written by maintainer |
| `essentials/architecture.md` | `sui:architecture` | ✅ Written by maintainer (contributing audience) |

### ui/ — ALL DONE

| File | Skill | Status |
|------|-------|--------|
| `ui/use.md` | `sui:use` | ✅ Merged from skills/use.md + ui/markup.md |
| `ui/style.md` | `sui:style` | ✅ From skills/style.md |
| `ui/tokens.md` | `sui:tokens` | ✅ From skills/tokens.md |
| `ui/icons.md` | `sui:icons` | ✅ New (consumer usage skill) |
| `ui/create-icon-set.md` | `sui:create-icon-set` | ✅ From skills/create-icon-set.md |
| `ui/theming.md` | `sui:theming` | ✅ Split from framework/theming.md (consumer half) |

### authoring/ — PASS 1 + PASS 2 DONE

**Pass 1 (clean moves/splits):**

| File | Skill | Status |
|------|-------|--------|
| `authoring/component-css.md` | `sui:component-css` | ✅ Renamed from css-style-guide.md |
| `authoring/component-html.md` | `sui:component-html` | ✅ Renamed from html.md |
| `authoring/component-theming.md` | `sui:component-theming` | ✅ Split from framework/theming.md |
| `authoring/component-specs.md` | `sui:component-specs` | ✅ From framework/specs.md |
| `authoring/query-behaviors.md` | `sui:query-behaviors` | ✅ Trimmed from framework/plugins-and-behaviors.md |
| `authoring/reactive-state.md` | `sui:reactive-state` | ✅ From framework/reactivity.md |
| `authoring/utility-functions.md` | `sui:utility-functions` | ✅ From framework/utils.md |

**Pass 2 (new skills from user guides + source verification):**

| File | Skill | Status |
|------|-------|--------|
| `authoring/component-authoring.md` | `sui:component-authoring` | ✅ 496 lines. defineComponent, file structure, createComponent, self pattern |
| `authoring/component-events.md` | `sui:component-events` | ✅ 443 lines. Event DSL, delegation, deep/global/bind, dispatching |
| `authoring/component-keybindings.md` | `sui:component-keybindings` | ✅ 263 lines. Keys object, combinations, sequences, dynamic binding |
| `authoring/component-lifecycle.md` | `sui:component-lifecycle` | ✅ 348 lines. Hooks, callback args, SSR, cleanup patterns |
| `authoring/component-state.md` | `sui:component-state` | ✅ 498 lines. Settings vs state vs props, signal helpers, reactivity |
| `authoring/component-patterns.md` | `sui:component-patterns` | ✅ 564 lines. Communication patterns, race conditions, recipes |
| `authoring/component-templating.md` | `sui:component-templating` | ✅ 532 lines. Expression language, conditionals, loops, async, snippets, subtemplates, slots, 50+ helpers, attribute binding |

### workflows/ — ALL DONE

| Subfolder | Files | Status |
|-----------|-------|--------|
| `workflows/components/` | 6 files | ✅ Moved from contributing/workflows/ |
| `workflows/framework/` | 3 files | ✅ Moved |
| `workflows/documentation/` | 1 file | ✅ Moved |
| `workflows/meta/` | 3 files | ✅ Moved |
| `workflows/research/` | 2 files | ✅ Moved |

### contributing/ — FRONTMATTER DONE, CONTENT NOT REVIEWED

All 30 contributing files have proper YAML frontmatter with `audience: contributing` and `skill:` fields. Content has NOT been reviewed for staleness or accuracy.

### CLAUDE.md — REWRITTEN

✅ Fully rewritten by maintainer. Uses MCP-first discovery pattern instead of hardcoded file reads.

---

## What's Left To Do

### Decided: NOT doing

- **`sui:template-class`** — contributor internals, covered by `essentials/architecture.md`
- **`sui:query` / `sui:query-layout` re-cuts** — unique bits already in `component-patterns` + `query-behaviors`, full API in user guides via MCP
- **Deleting `ai/old/`** — kept as reference until all new versions fully vetted
- **MCP server updates** — handled separately by maintainer
- **`start-here.md` updates** — vestigial with MCP, maintainer will handle

### Still TODO

1. **Contributing content review** — 30 files have frontmatter but content not reviewed for staleness
2. **Workflow content review** — 15 files copied but content not reviewed
3. **Parked files** — ✅ `using-primitives.md` superseded (one-liner added to component-authoring). ✅ `parent-child.md` rewritten as `authoring/component-composition.md` (514 lines)
4. **Final verification** — once MCP changes land, test `list_skills`, `list_context`, `use_skill`, `search`

---

## Source Material Disposition

### old/framework/ — superseded by pass 2 skills

| Old File | Lines | Superseded By |
|----------|-------|---------------|
| `creating-components.md` | 1342 | `component-authoring` + `component-events` + `component-lifecycle` + `component-state` + `component-patterns` |
| `best-practices.md` | 1487 | `component-patterns` + `component-events` + `component-state` |
| `templates.md` | 851 | `component-templating` |
| `query.md` | 1064 | `component-patterns` + `query-behaviors` + user guides via MCP |
| `authoring-components.md` | 587 | `component-authoring` (was 95% superseded, unique lines absorbed) |
| `component-api-reference.md` | 102 | `component-authoring` + `component-lifecycle` (was 93% superseded) |
| `using-primitives.md` | — | Parked in consolidation-queue |
| `parent-child.md` | — | Parked in consolidation-queue |

### old/contributing/ — originals of renamed files

| Old File | New Location |
|----------|-------------|
| `00-START-HERE.md` | `contributing/start-here.md` |
| `testing/testing-architecture.md` | `contributing/testing/architecture.md` |
| `workflows/*` (15 files) | `workflows/` subfolders |
