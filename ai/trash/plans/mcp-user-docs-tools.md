# MCP User Docs Tools Plan

> **Created:** 2025-01-08
> **Status:** Planning
> **Goal:** Add MCP tools for AI agents to search and retrieve user documentation

---

## Background

The docs site now exposes user documentation as raw markdown via the content-api:
- `/content/docs/manifest.json` - manifest with all pages, tokens, keywords
- `/content/docs/[...slug].md` - raw markdown for any doc page

This plan adds MCP tools so AI agents can programmatically discover and fetch this content.

---

## New MCP Tools

### `list_user_docs`

List available user documentation pages with filtering.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| search | string | Optional search term to filter by title/description/keywords |
| limit | number | Max results to return (default: 20) |

**Returns:**
```json
{
  "pages": [
    {
      "path": "/docs/guides/reactivity/signals",
      "raw": "/content/docs/guides/reactivity/signals.md",
      "title": "Signals",
      "description": "Creating and managing reactive state primitives",
      "keywords": ["signals", "reactivity", "state"],
      "tokens": 2500
    }
  ],
  "totalPages": 95,
  "totalTokens": 180000
}
```

### `get_user_doc`

Fetch the raw markdown content of a specific documentation page.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| path | string | The doc path, e.g., `/docs/guides/reactivity/signals` or just `guides/reactivity/signals` |

**Returns:**
Raw markdown string of the processed documentation page.

### `search_user_docs`

Full-text search across all user documentation.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| query | string | Search query |
| limit | number | Max results (default: 10) |

**Returns:**
```json
{
  "results": [
    {
      "path": "/docs/guides/reactivity/signals",
      "title": "Signals",
      "snippet": "...Signals are the core primitive for reactive state...",
      "score": 0.95
    }
  ]
}
```

---

## Implementation Steps

### Phase 1: Basic Tools
- [ ] Add `list_user_docs` tool to MCP server
- [ ] Add `get_user_doc` tool to MCP server
- [ ] Fetch manifest from `https://next.semantic-ui.com/content/docs/manifest.json`
- [ ] Fetch doc content from `https://next.semantic-ui.com/content/docs/[path].md`
- [ ] Add caching layer for manifest (refresh every 5 min or on demand)

### Phase 2: Search
- [ ] Add `search_user_docs` tool
- [ ] Implement client-side search using manifest keywords + title + description
- [ ] Consider server-side search index if needed for full-text

### Phase 3: Integration
- [ ] Update MCP tool descriptions to reference user docs
- [ ] Add examples to MCP README
- [ ] Test with Claude Code and other AI agents

---

## URL Configuration

Base URL should be configurable:
- Production: `https://next.semantic-ui.com`
- Development: `https://dev.semantic-ui.com`

---

## Files to Modify

| File | Changes |
|------|---------|
| `tools/mcp/src/tools/user-docs.ts` | New file with tool implementations |
| `tools/mcp/src/index.ts` | Register new tools |
| `tools/mcp/src/utils/docs-fetcher.ts` | Utility for fetching/caching docs |
| `tools/mcp/README.md` | Document new tools |

---

## Notes

- User docs are separate from AI context docs (`ai/framework/`, `ai/ui/`)
- User docs are comprehensive with examples; AI context is curated/concise
- AI agents can use both: AI context for quick answers, user docs for deep dives
- Manifest includes token counts so agents can budget context window usage
