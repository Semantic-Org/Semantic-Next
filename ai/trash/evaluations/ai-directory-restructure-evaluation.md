## Task: Evaluate a proposed reorganization of the `ai/` directory in a monorepo

Read all source files listed below before answering. Evaluate the current state and the proposed change independently.

### Background

This is a monorepo for Semantic UI, an open source UI framework. The `ai/` directory contains AI-optimized content served to AI agents via an MCP server and a docs site content API. The content is authored as markdown files with YAML frontmatter.

### How Content Gets Served

There are three layers between disk and consumer:

1. **Disk** — markdown files live in `ai/{audience}/*.md` (e.g., `ai/authoring/component-css.md`)
2. **Astro docs site** — static routes glob the markdown files, extract metadata from frontmatter, and serve them as URL endpoints (e.g., `/content/ai/authoring/component-css.md`)
3. **MCP server** — fetches the URL endpoints from the docs site and caches them. Agents interact with the MCP server, never with disk directly.

The key helper is `docs/src/helpers/ai-manifest.js` which globs all `.md` files from `ai/`, parses frontmatter, and builds manifests. The `[...slug].md.js` route serves individual files. Both use `import.meta.glob` with relative paths from the docs directory.

### Current `ai/` Directory Structure

```
ai/
├── authoring/        ← 19 skill files (audience: authoring)
├── contributing/     ← 12 files (audience: contributing) — includes agent-guestbook.md
├── docs/             ← 11 skill files (audience: docs)
├── essentials/       ← 2 skill files (audience: essentials)
├── research/         ← research corpus with subdirs (components/, css-tokens/, icons/, skills/, usage-guides/)
├── usage/            ← 7 skill files (audience: usage)
├── workflows/        ← step-by-step procedure files (type: workflow), has subdirs
├── trash/            ← archive of completed work
└── workspace/        ← agent scratch space (plans/, drafts/, reference/, tmp/)
```

Almost every `.md` file in the audience directories has `skill: skill-name` in frontmatter. The manifest helper currently excludes `workspace/` and `old/` via glob negations.

### The Proposed Change

Move skill/content directories under `ai/skills/`, keep `research/` and organizational dirs at top level, promote the agent guestbook to `ai/guestbook.md`:

```
ai/
├── guestbook.md
├── skills/
│   ├── authoring/
│   ├── contributing/
│   ├── docs/
│   ├── essentials/
│   ├── usage/
│   └── workflows/
├── research/
├── trash/
└── workspace/
```

The intent is to keep URL endpoints unchanged (`/content/ai/{audience}/{slug}.md`) by adjusting glob patterns and path-extraction regex in the Astro routes.

### Concrete Considerations

1. The `ai-manifest.js` helper currently uses a single glob `../../../ai/**/*.md` with exclusions. After the move, it would need to glob from two locations (`ai/skills/` and `ai/research/`) and strip the `skills/` prefix from captured paths so URLs don't change.
2. The `getAudience()` function falls back to the first directory segment of the relative path to determine audience. After the move, this would need adjustment since the first segment would be the audience directory name (correct) but only if `skills/` is already stripped.
3. The `[...slug].md.js` catch-all route uses its own independent glob and regex. It must stay in sync.
4. The MCP server's `cache.ts` has an `EXCLUDED_FOLDERS` regex that filters URL paths containing `workspace` or `old`. Since URLs don't change, this should be unaffected.
5. `research/` staying at top level means it's a separate glob source, adding complexity to the manifest helper.
6. The guestbook is currently served as a skill via MCP (has `skill: agent-guestbook` frontmatter). Moving it to `ai/guestbook.md` means it would no longer be under a skills directory — would it still be discovered by the glob?

### Questions — Evaluate Independently

**Question 1:** Is this reorganization worth the complexity it introduces to the build system? The current flat structure works — what concrete problem does nesting under `skills/` solve, and does that problem justify the glob/regex changes?

**Question 2:** Is keeping URLs unchanged the right call? Would it be simpler or more maintainable to let the URLs reflect the new disk structure (e.g., `/content/ai/skills/authoring/...`) and update the MCP server and llms.txt accordingly?

**Question 3:** Is the `research/` carve-out (staying top-level while everything else moves) well-motivated, or does it create an awkward asymmetry in both the directory layout and the build system?

**Question 4:** Are there risks or edge cases in the path-stripping approach (regex `ai\/(?:skills\/)?(.+)\.md$`) that could cause subtle bugs — e.g., files at unexpected nesting depths, the guestbook at `ai/guestbook.md`, or future content added outside `skills/`?

**Question 5:** Is there a simpler alternative that achieves the same goal of cleaning up the `ai/` top level without requiring build system changes?

### Source Files to Read

- `docs/src/helpers/ai-manifest.js` — manifest builder, glob patterns, path extraction
- `docs/src/pages/content/ai/[...slug].md.js` — catch-all route for serving individual files
- `docs/src/pages/content/ai/[audience]/index.md.js` — per-audience index route
- `tools/mcp/src/utils/cache.ts` — MCP server cache, EXCLUDED_FOLDERS, content type separation
- `CLAUDE.md` — agent instructions referencing ai/ paths
