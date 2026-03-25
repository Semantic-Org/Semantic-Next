---
title: Previewing Documentation with Chrome DevTools MCP
description: Guide for AI agents to access and preview the Astro documentation server using Chrome DevTools MCP.
keywords: [preview, chrome, devtools, mcp, astro, documentation, routing]
audience: contributing
type: doc
---

# Previewing Documentation with Chrome DevTools MCP

> **For:** AI agents working on any documentation task
> **Prerequisites:** Chrome running with remote debugging, dev server at `https://dev.semantic-ui.com`

---

## Overview

The documentation site is an Astro server running locally. Chrome DevTools MCP provides browser access to preview pages, check layouts, verify navigation, and inspect rendered content.

---

## Astro Routing

Astro uses file-based routing. Pages in `/docs/src/pages/` map directly to URLs:

| File Path | URL |
|-----------|-----|
| `/docs/src/pages/index.astro` | `/` |
| `/docs/src/pages/introduction.mdx` | `/introduction` |
| `/docs/src/pages/guides/reactivity.mdx` | `/guides/reactivity` |
| `/docs/src/pages/api/utils/index.mdx` | `/api/utils` |
| `/docs/src/pages/docs/guides/signals.mdx` | `/docs/guides/signals` |

**Pattern:** Remove `/docs/src/pages/` prefix and file extension to get the URL path.

---

## Accessing Pages

### Navigate to a Page

```
mcp__chrome-devtools__navigate_page
  type: "url"
  url: "https://dev.semantic-ui.com/{path}"
```

### Take a Snapshot

Returns the page content as an accessibility tree:

```
mcp__chrome-devtools__take_snapshot
```

Use this to:
- Verify page structure and headings
- Check navigation elements
- Read rendered text content

### Take a Screenshot

For visual verification:

```
mcp__chrome-devtools__take_screenshot
```

### Scrolling

The docs site uses a custom `<page>` element as the scroll container, not the window. To scroll:

```javascript
// Scroll to position
document.querySelector('page').scrollTo(0, 1500);

// Scroll by amount
document.querySelector('page').scrollBy(0, 500);
```

---

## Common Use Cases

### Preview a Guide Page

After editing `/docs/src/pages/docs/guides/signals.mdx`:

```
navigate_page → https://dev.semantic-ui.com/docs/guides/signals
take_snapshot
```

Verify headings, content flow, and structure.

### Check Page Layout

```
take_screenshot
```

Verify spacing, visual hierarchy, and component rendering.

### Test Navigation

```
take_snapshot
```

Find link UIDs in the snapshot, then:

```
click → uid: "{link-uid}"
```

### Verify After Edits

```
navigate_page → type: "reload"
take_snapshot
```

---

## Finding the Right URL

1. **Identify the file** you're working on in `/docs/src/pages/`
2. **Remove the prefix** `/docs/src/pages/`
3. **Remove the extension** `.mdx` or `.astro`
4. **Prepend the dev server** `https://dev.semantic-ui.com/`

**Example:**
- File: `/docs/src/pages/docs/api/reactivity/signal.mdx`
- URL: `https://dev.semantic-ui.com/docs/api/reactivity/signal`

---

## Related

- [Debugging Examples with Chrome MCP](./examples/debugging-with-chrome-mcp.md) - Specific workflow for testing code examples
