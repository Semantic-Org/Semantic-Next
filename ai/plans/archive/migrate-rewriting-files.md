# Migration Plan: ai/rewriting/ → ai/contributing/ and ai/workflows/

## Context

Migrating old AI context files from `ai/rewriting/` to the new MCP-compatible structure. Files need frontmatter fixes, cross-references updated to use skill/workflow IDs (not file paths), and workflow ID support added to the MCP.

## What's Done

### MCP Changes (COMPLETE)
- `docs/src/helpers/ai-manifest.js` — captures `workflow` frontmatter field in manifest
- `tools/mcp/src/utils/cache.ts` — `WorkflowItem` has `workflow?: string`, `findWorkflow` matches by ID first
- `tools/mcp/src/index.ts` — `list_workflows` shows workflow IDs, `get_workflow` description updated

### File Copies (COMPLETE)
All 13 files copied to new locations:
- 12 skills → `ai/contributing/`
- 1 workflow → `ai/workflows/contributing/`

### Frontmatter Fixes (PARTIAL — 7 of 13 done)
Files with frontmatter already fixed:
1. `ai/contributing/docs-authoring-standards.md` — skill ID fixed, blockquote header added, date removed, links updated
2. `ai/contributing/docs-target-audience.md` — skill ID fixed, blockquote header added, date removed, Related table links updated
3. `ai/contributing/docs-writing-effectively.md` — skill ID fixed, H1 + blockquote header added
4. `ai/contributing/docs-page-gateway.md` — skill ID fixed, blockquote header added, date removed, prerequisites changed to skill refs
5. `ai/contributing/docs-page-guide.md` — skill ID fixed, blockquote header added, date removed, prerequisites/related changed to skill refs

### Workflow ID Audit (PARTIAL — 3 of 13 done)
Workflows with `workflow:` field added:
1. `ai/workflows/contributing/docs-add-links.md` — changed `type: doc` → `type: workflow`, `skill:` → `workflow: docs-add-links`
2. `ai/workflows/contributing/docs-evaluate-text.md` — changed `type: doc` → `type: workflow`, `skill:` → `workflow: docs-evaluate-text`
3. `ai/workflows/contributing/primitive-refine.md` — changed `skill:` → `workflow: primitive-refine`

---

## What Remains

### 1. Fix Remaining 6 Migrated Skills (frontmatter + cross-refs)

For each file, apply these changes:
- Remove `type: doc` from frontmatter
- Change `skill: doc-*` → `skill: docs-*` (add the 's') to be consistent
- Add blockquote header if missing: `> **Skill:** \`sui:skill-id\`` / `> **Purpose:** ...`
- Replace file-path cross-references with skill/workflow IDs
- Remove stale dates

**a) `ai/contributing/docs-page-api-reference.md`**
- Change `skill: doc-page-api-reference` → `skill: docs-page-api-reference`
- Remove `type: doc`
- Fix blockquote Related line: `[Slop Identification](../shared/slop-identification.md)` → reference `sui:docs-slop-identification` skill
- Fix `[Good Examples](../shared/good-examples.md)` → reference `sui:docs-good-examples` skill
- Remove `[Link Grammar](../shared/link-grammar.md)` (file doesn't exist in new structure)
- Fix bottom reference to `[Slop Identification](../shared/slop-identification.md)` and `[Link Grammar](../shared/link-grammar.md)` and `[Good Examples](../shared/good-examples.md)`

**b) `ai/contributing/docs-page-pedagogical.md`**
- Change `skill: doc-page-pedagogical` → `skill: docs-page-pedagogical`
- Remove `type: doc`
- Add blockquote header
- Fix `[Examples System Canonical Guide](../examples/authoring.md)` → reference `sui:docs-examples-authoring`
- Fix `[Example Self-Critique Protocol](../examples/self-critique.md)` → reference workflow `docs-examples-self-critique`
- Fix `[Chrome DevTools MCP](../examples/debugging-with-chrome-mcp.md)` → reference `sui:docs-examples-debugging`
- Fix `[CSS Token Guide](/ai/framework/design-tokens.md)` → reference `sui:design-tokens` skill (or remove if doesn't exist)

**c) `ai/contributing/docs-examples-authoring.md`**
- Change `skill: doc-examples-authoring` → `skill: docs-examples-authoring`
- Remove `type: doc`
- Fix blockquote Related line — remove all old absolute path links (`/ai/framework/creating-components.md`, etc.)
- Replace with skill references or remove
- Remove emoji from `## 🎯 **Example Philosophy**` header (per CLAUDE.md: no emojis unless requested)

**d) `ai/contributing/docs-examples-debugging.md`**
- Change `skill: doc-examples-debugging` → `skill: docs-examples-debugging`
- Remove `type: doc`
- Update blockquote to proper format with Skill/Purpose
- Fix bottom Related links: `[Example Authoring Guide](./authoring.md)` → `sui:docs-examples-authoring`, `[Example Self-Critique](./self-critique.md)` → workflow `docs-examples-self-critique`

**e) `ai/contributing/docs-slop-identification.md`**
- Change `skill: doc-slop-identification` → `skill: docs-slop-identification`
- Remove `type: doc`
- Add blockquote header
- Fix `doc-good-writing-examples.md` reference → `sui:docs-good-examples`

**f) `ai/contributing/docs-good-examples.md`**
- Change `skill: doc-good-examples` → `skill: docs-good-examples`
- Remove `type: doc`
- Add blockquote header

**g) `ai/contributing/agent-guestbook.md`**
- Remove `type: doc`
- Update blockquote to proper Skill/Purpose format
- Internal links to old paths (`/ai/framework/...`, `/ai/contributing/...`, `/ai/00-START-HERE.md`) — leave as-is, they're historical entries not actionable references

### 2. Fix Self-Critique Workflow

**`ai/workflows/contributing/docs-examples-self-critique.md`**
- Change `type: doc` → `type: workflow`
- Change `skill: doc-examples-self-critique` → `workflow: docs-examples-self-critique`

### 3. Add `workflow:` Field to Remaining Workflow Files

Each needs `workflow: <filename>` added to frontmatter. Remove `skill:` if present.

| File | Add | Remove |
|------|-----|--------|
| `ai/workflows/contributing/primitive-scaffold.md` | `workflow: primitive-scaffold` | `skill: primitive-scaffold` |
| `ai/workflows/contributing/primitive-write-css.md` | `workflow: primitive-write-css` | `skill: primitive-write-css` |
| `ai/workflows/documentation/refine-example-documentation-copy.md` | `workflow: refine-example-documentation-copy` | — |
| `ai/workflows/framework/add-query-method.md` | `workflow: add-query-method` | — |
| `ai/workflows/framework/add-template-syntax.md` | `workflow: add-template-syntax` | — |
| `ai/workflows/framework/add-util-function.md` | `workflow: add-util-function` | — |
| `ai/workflows/research/research-component-patterns.md` | `workflow: research-component-patterns` | — |
| `ai/workflows/research/verify-pattern-research.md` | `workflow: verify-pattern-research` | — |

### 4. Cross-Reference Convention

All cross-references in migrated files should use this format:
- **Skills:** `` Load `sui:skill-id` via `use_skill` `` or in Related tables: `| **Title** | /sui:skill-id | Use when... |`
- **Workflows:** `` Use workflow `workflow-id` via `get_workflow` `` or in Related tables: `| **Title** | /sui:workflow-id | Use when... |`
- **No file paths** — downstream users don't have the `ai/` folder

### 5. Do NOT Delete `ai/rewriting/`
User will clean up manually.

## Verification

After all edits:
1. Run `head -10 ai/contributing/docs-*.md ai/contributing/agent-guestbook.md` to verify all frontmatter is correct
2. Run `head -10 ai/workflows/**/*.md` to verify all workflows have `workflow:` field
3. `grep -r 'type: doc' ai/contributing/ ai/workflows/` should return nothing (no `type: doc` in skills or workflows)
4. `grep -r 'skill:' ai/workflows/` should return nothing (workflows use `workflow:`, not `skill:`)
5. Rebuild MCP and test `list_workflows` shows IDs, `get_workflow("add-util-function")` works
