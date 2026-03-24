# Consolidate Writing Skills — COMPLETE

## What Was Done

### New Files
1. `ai/docs/docs-writing.md` (236 lines, procedural) — consolidated writing guide with two modes (reference/persuasive), AI anti-pattern summary, editing strategy
2. `ai/docs/docs-ai-tropes.md` (352 lines, reference) — full AI anti-pattern catalog from tropes.fyi

### Deleted
- `ai/contributing/docs-writing-effectively.md`
- `ai/contributing/docs-good-writing.md`
- `ai/contributing/docs-slop-identification.md`

### Cleaned Up
- `docs-target-audience` — removed leaked McEnerney writing mechanics, kept audience definition
- `docs-page-gateway` — removed duplicated instability language table, updated prerequisite
- `docs-page-api-reference` — updated cross-references
- `docs-authoring-standards` — updated cross-references

### New `docs` Audience
- Created `ai/docs/` directory
- Moved all 11 docs skills from `ai/contributing/` to `ai/docs/`
- Updated `audience: docs` in all moved files
- Added `docs` to MCP server audience enum (`cache.ts` type + `server.ts` z.enum)
- Updated `ai-author-context` audience table and example

## Architecture
- Foundation layer: `docs-target-audience`, `docs-authoring-standards`, `docs-writing`, `docs-ai-tropes`
- Page type layer: `docs-page-gateway`, `docs-page-guide`, `docs-page-api-reference`, `docs-page-pedagogical`
- Reference voice (90% of pages) is the baseline in `docs-writing`
- Persuasive voice (10% — gateway pages) covered by `docs-writing` principles + `docs-page-gateway` structure
