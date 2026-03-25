---
title: Move AI Content Directories to ai/skills/
status: implemented
---

# Move AI Content to `ai/skills/`

## Result

```
ai/
├── guestbook.md        ← top-level, prominent
├── skills/             ← all MCP-served content
│   ├── authoring/
│   ├── contributing/
│   ├── docs/
│   ├── essentials/
│   ├── research/       ← 2 skill files (moved from ai/research/skills/)
│   ├── usage/
│   └── workflows/
├── research/           ← 715-file corpus, NOT served via MCP
├── trash/              ← archive
└── workspace/          ← agent scratch (plans/, drafts/, reference/, tmp/)
```

## Changes made

1. **Filesystem** — moved `ai/{authoring,contributing,docs,essentials,usage,workflows}` → `ai/skills/`, moved `ai/research/skills/` → `ai/skills/research/`, moved guestbook to `ai/guestbook.md`
2. **`docs/src/helpers/ai-manifest.js`** — single glob `ai/skills/**/*.md`, regex `ai\/skills\/(.+)\.md$`, resolve path `ai/skills/`. Removed `EXCLUDED_AI_FOLDERS` and exclusion filter (no longer needed).
3. **`docs/src/pages/content/ai/[...slug].md.js`** — same glob and regex update
4. **`CLAUDE.md` / `AGENTS.md`** — updated workspace section and guestbook path
5. **URL endpoints unchanged** — `/content/ai/{audience}/{slug}.md` still works, MCP server and llms.txt need no changes
