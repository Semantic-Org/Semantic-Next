# AI Content Compliance Audit

Audit of all files in `ai/` against the authoring guidelines defined in:
- `ai/contributing/ai-author-context.md` (content standards)
- `ai/workflows/contributing/ai-create-context.md` (process)

---

## 1. MCP Server: dist is out of sync with source

**File:** `tools/mcp/src/utils/cache.ts` vs `tools/mcp/dist/utils/cache.js`

The built `dist/` is outdated relative to `src/`. Key differences:

- **`findWorkflow` missing ID lookup.** Source has workflow-ID-first lookup (`w.workflow === query`), dist only has path matching. This means `get_workflow("add-util-function")` fails — agents must use the full path like `workflows/contributing/add-util-function`.
- **`list_workflows` JSON key name.** Source outputs `id` key, dist outputs `path`.

**Fix:** Rebuild the MCP package (`npm run build` in `tools/mcp/`).

---

## 2. Frontmatter: `type` field on non-workflow files

Per the authoring guide: *"Only meaningful value is `workflow`"*. Five contributing files have `type: doc` or `type: skill`, which is invalid:

| File | Current `type` | Fix |
|------|---------------|-----|
| `ai/contributing/code-formatting.md` | `type: doc` | Remove |
| `ai/contributing/docs-paths.md` | `type: doc` | Remove |
| `ai/contributing/docs-rewrite-text.md` | `type: skill` | Remove |
| `ai/contributing/testing-internals.md` | `type: doc` | Remove |
| `ai/contributing/testing.md` | `type: doc` | Remove |

The `ai-create-context.md` workflow also instructs agents to use `type: doc` in its Phase 2 template — this contradicts the authoring guide and should be removed from the template.

---

## 3. Research skills: missing/incomplete frontmatter

| File | Issues |
|------|--------|
| `ai/research/skills/add-sophisticated-patterns.md` | **No frontmatter at all** — missing title, description, keywords, audience, skill |
| `ai/research/skills/component-research-process.md` | Missing `skill` field, has `type: doc` (invalid) |
| `ai/research/skills/pattern-research-integration.md` | Missing `skill` field, has `type: doc` (invalid) |

These appear in `list_context` with raw filenames as titles (e.g., "add-sophisticated-patterns") because they lack `title` fields.

---

## 4. Broken skill references (`sui:*`)

These `sui:*` references in Related Skills tables or body text point to skill IDs that don't exist:

| File | Broken Reference | Likely Intent |
|------|-----------------|---------------|
| `component-authoring.md` | `sui:use` | `sui:use-components` |
| `component-specs.md` | `sui:architecture-overview` | No equivalent exists |
| `reactive-state.md` | `sui:architecture-overview` | No equivalent exists |
| `utility-functions.md` | `sui:architecture-overview` | No equivalent exists |
| `ai-author-context.md` | `sui:identifier`, `sui:style`, `sui:tokens` | These are example placeholders in code blocks — not bugs |
| `build-system.md` | `sui:spec-system` | `sui:component-specs` |
| `docs-examples-authoring.md` | `sui:html`, `sui:tokens` | `sui:component-html`, `sui:design-tokens` |
| `docs-page-pedagogical.md` | `sui:tokens` | `sui:design-tokens` |
| `repo-guide.md` | `sui:testing-architecture`, `sui:writing-tests` | `sui:testing-internals`, `sui:testing` |
| `ai-create-context.md` (workflow) | `sui:component` | `sui:component-authoring` |

### Workflow files referencing themselves as skills

These workflows use `sui:*` notation but workflows have `workflow:` not `skill:` fields, so `use_skill` won't find them:

| File | References |
|------|-----------|
| `primitive-refine.md` | `sui:primitive-refine`, `sui:primitive-scaffold`, `sui:primitive-write-css` |
| `primitive-scaffold.md` | `sui:primitive-scaffold` |
| `primitive-write-css.md` | `sui:primitive-write-css` |

These should either reference via `get_workflow` notation, or the workflows should also have `skill:` fields.

---

## 5. Missing structural elements

### Missing blockquote header (`> **Skill:** ...`)

The authoring guide requires every file to have:
```markdown
> **Skill:** `sui:[name]`
> **Purpose:** [One line]
```

Files checked: All context files have blockquote headers. No violations found among the main skill files.

### Missing Quick Reference (files > ~100 lines)

Not systematically checked for every file, but the grep-based check found no major gaps — most larger files do include Quick Reference sections.

### Missing Related Skills table

Not systematically checked across all files, but most files appear to have them based on the reference extraction.

---

## 6. Inconsistency: `ai-create-context.md` workflow contradicts authoring guide

The `ai-create-context.md` workflow's Phase 2 template tells agents to write:
```yaml
type: doc
```
But `ai-author-context.md` says `type` should only be `workflow`. This creates a contradiction — agents following the create-context workflow will add invalid `type: doc` fields.

Also, the Phase 4 instruction says:
> "move it from `ai/{audience}/` to `ai/skills/`"

But `ai/skills/` doesn't exist. Skills live at `ai/{audience}/` permanently. The File Locations table at the bottom also references old audience names (`ui`, `framework`) instead of current ones (`usage`, `authoring`).

---

## 7. Length budget observations

Files over 500 lines (potential attention degradation for procedural skills):

| File | Lines | Subtype | Concern |
|------|-------|---------|---------|
| `docs-examples-authoring.md` | 1475 | Mixed/Reference | Very long but reference-heavy |
| `component-specs.md` | 811 | Reference | Acceptable for reference |
| `design-tokens.md` | 800 | Reference | Acceptable for reference |
| `utility-functions.md` | 750 | Reference | Acceptable for reference |
| `query-behaviors.md` | 652 | Mixed | Concepts should be in first 300 lines |
| `agent-guestbook.md` | 640 | N/A | Grows by design |
| `docs-page-pedagogical.md` | 564 | Procedural | Over budget |
| `component-patterns.md` | 564 | Mixed | Borderline |
| `css-token-system.md` | 556 | Reference | Acceptable |
| `component-templating.md` | 556 | Reference | Acceptable |
| `reactive-state.md` | 555 | Mixed | Concepts should be in first 300 |
| `component-composition.md` | 510 | Procedural | Slightly over budget |

---

## Summary: Priority fixes

### High priority (broken functionality)
1. **Rebuild MCP dist** — workflow ID lookup is broken
2. **Fix broken `sui:*` references** — agents following Related Skills links hit dead ends
3. **Fix `ai-create-context.md`** — remove `type: doc` from template, fix `ai/skills/` path, update audience names

### Medium priority (metadata compliance)
4. **Remove `type: doc`/`type: skill`** from 5 contributing files
5. **Add frontmatter to research skills** — especially `add-sophisticated-patterns.md` which has none

### Low priority (refinement)
6. **Workflow-as-skill references** — decide whether workflows should also be `use_skill`-loadable
7. **Length review** for procedural skills over 500 lines
