# Content API Implementation Summary

> **Created:** 2025-01-08
> **Status:** Complete
> **Author:** Agent working on docs/MCP integration

---

## What Was Built

A unified content API for serving raw documentation to AI agents and enabling "copy as markdown" functionality.

### Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/content/docs/manifest.json` | Index of all user doc pages (126 pages, ~150k tokens) |
| `/content/docs/[...slug].md` | Raw markdown for any user doc page |
| `/content/examples/manifest.json` | Index of all examples (339 examples) |
| `/content/examples/[slug].json` | Source files for any example |
| `/content/ai/manifest.json` | Index of AI context docs (ui + framework) |
| `/content/ai/[...slug].md` | Raw markdown for AI context docs |
| `/llms.txt` | Discovery file pointing to all manifests |

### Manifest Schema

All manifests follow the same schema:

```json
{
  "schemaVersion": 1,
  "generated": "2025-01-08T...",
  "totalPages": 126,
  "totalTokens": 150000,
  "pages": [
    {
      "path": "/content/docs/guides/reactivity/signals.md",
      "title": "Signals",
      "description": "Creating and managing reactive state primitives",
      "keywords": [],
      "tokens": 2500,
      "lastModified": "2025-09-24T15:18:32-04:00"
    }
  ]
}
```

AI context manifest also includes `audience` field ("ui" or "framework") on each page.

### File Locations

```
docs/src/pages/content/
├── docs/
│   ├── [...slug].md.js      # Serves processed user docs as markdown
│   └── manifest.json.js     # User docs manifest
├── examples/
│   ├── [slug].json.js       # Example source files (existing)
│   ├── all.txt.js           # All examples as text (existing)
│   └── manifest.json.js     # Examples manifest (new)
├── ai/
│   ├── [...slug].md.js      # Serves AI context docs
│   └── manifest.json.js     # AI context manifest
└── lessons/
    └── [slug].json.js       # Lesson content (existing)

docs/public/
└── llms.txt                 # Discovery file for AI agents
```

### How AI Context Is Served

The AI context routes glob directly from the source `ai/` folder:

```js
const uiDocs = import.meta.glob('../../../../../ai/ui/**/*.md', { query: '?raw', eager: true });
const frameworkDocs = import.meta.glob('../../../../../ai/framework/**/*.md', { query: '?raw', eager: true });
```

**No symlinks or copy scripts needed.** Vite/Astro reads directly from source.

Only `ai/ui/` and `ai/framework/` are exposed. `ai/contributing/` and `ai/workspace/` are NOT served publicly.

### User Docs Processing

User docs (MDX files) are processed before serving:
- Import statements removed
- `layout:` frontmatter removed
- `<PlaygroundExample>` replaced with links: `> **[Interactive Example: id](/examples/id)** | [source](/content/examples/id.json)`
- `<Image>` components replaced with `*[Image: alt]*`
- Other JSX components stripped
- Multiple blank lines collapsed

### Dependencies

- `gray-matter` - for parsing frontmatter (already installed in docs)
- No other new dependencies

---

## Integration Notes for AI Restructure

1. **Frontmatter matters** - The manifest pulls `title`, `description`, `keywords` from frontmatter. Ensure all files in `ai/ui/` and `ai/framework/` have proper frontmatter.

2. **Audience field** - Derived from folder path (`ai/ui/` → "ui", `ai/framework/` → "framework"). No need to add to frontmatter.

3. **Token counts** - Rough estimate (chars / 4). Used for context window budgeting.

4. **lastModified** - Pulled from git. Works if files are tracked.

5. **Adding new files** - Just add `.md` files to `ai/ui/` or `ai/framework/`. They'll automatically appear in manifest and be served.

---

## Testing URLs

```
https://next.semantic-ui.com/content/ai/manifest.json
https://next.semantic-ui.com/content/ai/framework/reactivity.md
https://next.semantic-ui.com/content/ai/ui/markup.md
https://next.semantic-ui.com/llms.txt
```
