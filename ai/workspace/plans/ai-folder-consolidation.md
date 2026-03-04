# AI Folder Consolidation Plan

> **Goal**: Reorganize `ai/` from an ad-hoc structure into audience-first folders with proper YAML frontmatter, flat `sui:` namespace skill names, and no dead duplicates.

---

## Principles

1. **Audience-first folders** — `ui/`, `authoring/`, `contributing/`, `workflows/`, `research/`, `workspace/`
2. **Skill/context distinction lives in frontmatter**, not folder structure
3. **Flat namespace** — `sui:use`, `sui:component-authoring`, not `sui:ui:use`
4. **Every file gets YAML frontmatter** — `title`, `description`, `keywords`, `audience`, `skill`
5. **Procedural skills ≤ 500 lines** — reference skills can be longer
6. **Prefer recent content** — when source files conflict, `git log` modification date signals freshness
7. **Subfolders where they aid `ls` navigation** — `workflows/{components,framework,documentation,meta,research}`, `contributing/{testing,documentation,meta}`
8. **Audiences** — `ui`, `authoring`, `contributing`, `research`
9. **Component-* prefix** — all authoring skills scoped to component development use `sui:component-*` for clustering in list_skills output

## Subagent Requirements

Every subagent doing editorial work MUST:

1. **Read the authoring guide first** — `ai/contributing/meta/author-context-or-skill.md`
2. **Verify against source code** — check actual packages in `packages/` for ground truth
3. **No MCP tool call assumptions** — reference other skills by `sui:id` for linking
4. **No hardcoded component catalogs** — teach patterns, not lists
5. **Skills are self-contained** — loadable and useful in isolation
6. **Add content only from source code evidence** — verifiable from `packages/`
7. **Use modification dates as quality signals** — `git log -1 --format="%ai" <file>`
8. **Preserve code examples** unless stale or demonstrably wrong per source code

---

## Completed Work

### ui/ — ALL DONE

| File | Skill | Status |
|------|-------|--------|
| `ui/use.md` | `sui:use` | ✅ Merged from skills/use.md + ui/markup.md |
| `ui/style.md` | `sui:style` | ✅ From skills/style.md |
| `ui/tokens.md` | `sui:tokens` | ✅ From skills/tokens.md |
| `ui/icons.md` | `sui:icons` | ✅ New (consumer usage skill, reframed from framework/icons.md) |
| `ui/create-icon-set.md` | `sui:create-icon-set` | ✅ From skills/create-icon-set.md |
| `ui/theming.md` | `sui:theming` | ✅ Split from framework/theming.md (consumer half) |

### authoring/ — ALL PASS 1 DONE

| File | Skill | Status |
|------|-------|--------|
| `authoring/mental-model.md` | `sui:mental-model` | ✅ Clean move from framework/ |
| `authoring/spec.md` | `sui:spec` | ✅ Clean move, fixed audience |
| `authoring/reactivity.md` | `sui:reactivity` | ✅ Clean move |
| `authoring/utils.md` | `sui:utils` | ✅ Clean move |
| `authoring/component-css.md` | `sui:component-css` | ✅ Renamed from css-style-guide.md |
| `authoring/component-html.md` | `sui:component-html` | ✅ Renamed from html.md |
| `authoring/component-theming.md` | `sui:component-theming` | ✅ Split from framework/theming.md (author half) |
| `authoring/behaviors.md` | `sui:behaviors` | ✅ Trimmed 979→640 lines, 11 undocumented APIs added from source |

### workflows/ — ALL DONE

| Subfolder | Files | Status |
|-----------|-------|--------|
| `workflows/components/` | 6 files | ✅ Moved from contributing/workflows/ |
| `workflows/framework/` | 3 files | ✅ Moved |
| `workflows/documentation/` | 1 file | ✅ Moved |
| `workflows/meta/` | 3 files | ✅ Moved |
| `workflows/research/` | 2 files | ✅ Moved |

### contributing/ — PARTIAL (renames only)

| File | Status |
|------|--------|
| `contributing/start-here.md` | ✅ Renamed from 00-START-HERE.md |
| `contributing/testing/architecture.md` | ✅ Renamed from testing-architecture.md |
| `contributing/meta/author-context-or-skill.md` | ✅ Moved from skills/internal/ |

### workspace/consolidation-queue/ — PARKED

| File | Reason |
|------|--------|
| `using-primitives.md` | Stale Haiku-era content, rewrite from scratch in pass 2 |
| `parent-child.md` | Misleading name, bad code examples, full rework needed |

---

## What's Left To Do

### Step 1: Consolidate contributing/ ← NEXT

The contributing/ folder has NOT had the same treatment as ui/ and authoring/. Files need:
- YAML frontmatter added (audience: contributing)
- Content review for staleness
- Consistent formatting per authoring guide

**Files that need frontmatter + review:**

| File | Current State | Work |
|------|--------------|------|
| `contributing/start-here.md` | Has content but needs frontmatter | Add frontmatter, update internal cross-references to new paths |
| `contributing/codebase-navigation.md` | Needs frontmatter | Add frontmatter |
| `contributing/build-system.md` | Needs frontmatter | Add frontmatter |
| `contributing/code-formatting.md` | Needs frontmatter | Add frontmatter |
| `contributing/typescript-types.md` | Needs frontmatter | Add frontmatter |
| `contributing/testing/architecture.md` | Needs frontmatter | Add frontmatter |
| `contributing/testing/writing-tests.md` | Needs frontmatter | Add frontmatter |
| `contributing/meta/agent-guestbook.md` | Needs frontmatter | Add frontmatter |
| `contributing/meta/author-context-or-skill.md` | Already has content, verify frontmatter | Verify |
| `contributing/css-framework/base-size-scaling.md` | Needs frontmatter | Add frontmatter |
| `contributing/css-framework/shadow-dom-theming.md` | Needs frontmatter | Add frontmatter |
| `contributing/css-framework/theme-aware-tokens.md` | Needs frontmatter | Add frontmatter |
| `contributing/css-framework/token-architecture.md` | Needs frontmatter | Add frontmatter |
| `contributing/documentation/*` (entire subtree) | Needs frontmatter on all files | Add frontmatter to each |

### Step 2: Delete old files and empty folders

After contributing/ is consolidated, clean up originals that have been moved/superseded:

**Safe to delete (new versions exist):**
- `skills/use.md`, `skills/style.md`, `skills/tokens.md`, `skills/create-icon-set.md`
- `skills/internal/author-context-or-skill.md`
- `ui/markup.md` (absorbed into ui/use.md)
- `framework/mental-model.md`, `framework/reactivity.md`, `framework/utils.md`, `framework/specs.md`
- `framework/css-style-guide.md`, `framework/html.md`, `framework/theming.md`
- `framework/plugins-and-behaviors.md`, `framework/icons.md`
- `contributing/00-START-HERE.md`, `contributing/testing/testing-architecture.md`
- `contributing/workflows/*` (all 15 — now in workflows/)

**Dead files (fully superseded):**
- `framework/authoring-components.md` (95% superseded, 38 unique lines absorb in pass 2)
- `framework/component-api-reference.md` (93% superseded, 8 unique lines absorb in pass 2)

**Keep in framework/ for pass 2:**
- `framework/creating-components.md` — source for `sui:component-authoring`
- `framework/templates.md` — source for `sui:component-templating` + `sui:template-class`
- `framework/query.md` — source for `sui:query` + `sui:query-layout`
- `framework/best-practices.md` — source for `sui:component-*` decomposition
- `framework/using-primitives.md` — keep until pass 2 (also in consolidation-queue)
- `framework/parent-child.md` — keep until pass 2 (also in consolidation-queue)

**Empty folders to remove:**
- `skills/internal/`, `skills/` (if empty after deletions)
- `contributing/workflows/` (if empty)

### Step 3: Update CLAUDE.md cross-references

Update all hardcoded paths in CLAUDE.md:
- `ai/framework/mental-model.md` → `ai/authoring/mental-model.md`
- `ai/contributing/00-START-HERE.md` → `ai/contributing/start-here.md`
- `ai/contributing/codebase-navigation.md` → verify unchanged
- Any `ai/contributing/workflows/*` → `ai/workflows/*`
- Any other `ai/framework/*` references to moved files

### Step 4: Update contributing/start-here.md cross-references

This file is the routing hub. All internal links to moved files need updating:
- `framework/*` references → `authoring/*` where applicable
- `contributing/workflows/*` → `workflows/*`
- Any skill references should use `sui:id` format

### Step 5: Update MCP server

- Add `ui/` and `authoring/` as scanned directories
- Add `workflows/` subfolders
- Audiences are now: `ui`, `authoring`, `contributing`, `research`
- Remove hardcoded `framework/` or `skills/` folder references
- Test `list_skills`, `list_context`, `use_skill`, `search`

### Step 6: Final verification

- `list_skills` shows all new skill ids
- `list_context` shows new audiences
- Spot-check `use_skill` on several skills
- No broken cross-references
- Old folders cleaned up

---

## Pass 2: Future Work (separate session)

Files remaining in `framework/` as source material:

| Source | Target Skill(s) | Work Required |
|---|---|---|
| `framework/creating-components.md` (1342 lines) | `sui:component-authoring` + potentially `sui:component-communication`, `sui:component-events`, etc. | Re-cut into ~500 line skills. Absorb 38+8 unique lines from dead files. |
| `framework/templates.md` (851 lines) | `sui:component-templating` (syntax: expressions, conditionals, each, snippets, slots) + `sui:template-class` (Template class, standalone usage, lifecycle) | Split along syntax vs class boundary |
| `framework/query.md` (1064 lines) | `sui:query` (DOM querying, selectors, shadow DOM, events) + `sui:query-layout` (visibility, positioning, dimensions, scroll) | Split along natural seam |
| `framework/best-practices.md` (1487 lines) | Multiple `sui:component-*` skills | Decompose by topic — agent determines skill boundaries |
| `workspace/consolidation-queue/using-primitives.md` | Unknown — possibly a section in `sui:component-authoring` | Rewrite from scratch |
| `workspace/consolidation-queue/parent-child.md` | Unknown — needs name and content rework | Full rework needed |

Dead files to absorb during pass 2:
- `framework/authoring-components.md` → 38 unique lines into `sui:component-authoring`
- `framework/component-api-reference.md` → 8 unique lines into `sui:component-authoring`
