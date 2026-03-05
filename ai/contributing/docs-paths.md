---
title: Resolving Documentation Paths
description: How to derive the correct URL for any page in docs/, including anchor links to specific methods and headings.
keywords: [docs path, URL, anchor, @see, hyperlink, mdx, astro routing, method link]
audience: contributing
skill: docs-paths
type: doc
---

# Resolving Documentation Paths

> **Skill:** `sui:docs-paths`
> **Purpose:** Derive the correct full URL for any docs page or method anchor

**Golden rule: always derive the URL from the file path — never guess a URL from a method or package name.**

---

## Relative vs Full URLs

| Context | Format | Example |
|---|---|---|
| `.d.ts` `@see` links | Full URL | `https://next.semantic-ui.com/docs/api/query/events#on` |
| `ai/` context files | Full URL | `https://next.semantic-ui.com/docs/guides/components/lifecycle` |
| mdx pages linking to other pages | Root-relative | `[Query Guide](/docs/guides/query)` |
| Astro component `href` | Root-relative | `href="/ui/primitives/button"` |

**Rule:** full URL outside the docs site (type declarations, ai context), root-relative inside it.

Static pages under `docs/src/pages/` use standard Astro file-based routing.

---

## Browsing the Docs Locally

The dev server is typically running during sessions at `https://dev.semantic-ui.com` (an `/etc/hosts` alias for localhost on port 443). Use Chrome MCP to navigate and verify pages.

To find a page by intent, browse the source directories rather than guessing URLs:

- **UI primitives/components/behaviors:** glob `docs/src/content/{primitives,components,behaviors}/`
- **API reference:** glob `docs/src/pages/docs/api/PACKAGE/` — each `.mdx` is a category page
- **Guides:** glob `docs/src/pages/docs/guides/TOPIC/`
- **Examples:** glob `docs/src/content/examples/`
- **Lessons:** glob `docs/src/content/lessons/`

---

## Content Collections

Five collections use dynamic `[...slug]` routes instead of file-based routing. The slug comes from the content entry filename (or directory name for lessons).

| Collection | Content path | Route | URL |
|---|---|---|---|
| Primitives | `content/primitives/button.mdx` | `pages/ui/primitives/[...slug].astro` | `/ui/primitives/button` |
| Components | `content/components/theme-switcher.mdx` | `pages/ui/components/[...slug].astro` | `/ui/components/theme-switcher` |
| Behaviors | `content/behaviors/attach.mdx` | `pages/ui/behaviors/[...slug].astro` | `/ui/behaviors/attach` |
| Examples | `content/examples/accordion.mdx` | `pages/examples/[...slug].astro` | `/examples/accordion` |
| Lessons | `content/lessons/111-introduction/index.mdx` | `pages/learn/[...slug].astro` | `/learn/111-introduction` |

All paths above are relative to `docs/src/`.

**Tabs** — Primitives, components, and behaviors support tabs defined in frontmatter. Each tab appends as a path segment: `/ui/primitives/button/usage`. The first tab is the default (no segment needed).

**Lessons** — Use subdirectory-based slugs. Each lesson is a folder (`111-introduction/`) containing `index.mdx` plus problem/solution/example file folders.

**Examples** — Entries with `hidden: true` in frontmatter are excluded from routing.

---

## Finding Which Page Documents a Method

API reference pages group methods by category. Each page declares its methods in frontmatter:

```yaml
# docs/src/pages/docs/api/query/dom-traversal.mdx
methods: ["find", "children", "parent", "closest", "closestAll", ...]
```

The page name (`dom-traversal`) doesn't always match the method name (`closestAll`) — check `methods` frontmatter to confirm.

---

## Non-Obvious Anchors

All anchors verified against the live dev site. Standard rehype slug behavior (lowercase, spaces to hyphens) applies, but these edge cases are easy to get wrong:

### Method names (API reference pages)

| Markdown heading | Anchor | Gotcha |
|---|---|---|
| `` ## `Get` `` | `#get` | Backticks stripped |
| `` ## `Signal.computed` `` | `#signalcomputed` | Dot stripped, no separator |
| `### closestAll` | `#closestall` | camelCase flattened to lowercase |
| `### kebabToCamel` | `#kebabtocamel` | camelCase flattened to lowercase |
| `### escapeHTML` | `#escapehtml` | All-caps abbreviation flattened |

### Prose headings (guide pages)

| Markdown heading | Anchor | Gotcha |
|---|---|---|
| `### @Event Handler` | `#event-handler` | `@` stripped |
| `## HTML Attributes & Properties` | `#html-attributes--properties` | `&` stripped, leaves double hyphen `--` |
| `### Multiple Events + One Selector` | `#multiple-events--one-selector` | `+` stripped, leaves double hyphen `--` |
| `### ES Modules Cannot Import HTML/CSS` | `#es-modules-cannot-import-htmlcss` | `/` stripped with no separator |
| `### CSS Resets Don't Pierce Shadow DOM` | `#css-resets-dont-pierce-shadow-dom` | Apostrophe stripped |
| `### Cant Use :host-context` | `#cant-use-host-context` | `:` stripped |

---

## Quick Reference

```
Content collections (non-standard routing)
  content/primitives/NAME.mdx           → /ui/primitives/NAME[/tab]
  content/components/NAME.mdx           → /ui/components/NAME[/tab]
  content/behaviors/NAME.mdx            → /ui/behaviors/NAME[/tab]
  content/examples/NAME.mdx             → /examples/NAME
  content/lessons/DIR/index.mdx         → /learn/DIR

Heading → Anchor
  ### methodName     → #methodname       (camelCase flattened)
  ## `Obj.method`    → #objmethod        (dot stripped, no separator)
  ## A & B           → #a--b             (& stripped, double hyphen)
  ## A + B           → #a--b             (+ stripped, double hyphen)
  ### @event handler → #event-handler    (@ stripped)
  ### HTML/CSS       → #htmlcss          (/ stripped, no separator)

@see conventions
  Class:  @see {@link https://next.semantic-ui.com/PATH Display Text}
  Method: @see https://next.semantic-ui.com/PATH#anchor
```

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **TypeScript Types** | `/sui:types` | Writing `.d.ts` files that include `@see` links |
| **Author Context** | `/sui:author-context-or-skill` | Creating or editing files in `ai/` |
