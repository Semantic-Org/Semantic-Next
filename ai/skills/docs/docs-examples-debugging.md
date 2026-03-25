---
title: Debugging Examples with Chrome DevTools MCP
description: Non-obvious gotchas when debugging Semantic UI documentation examples in the live playground — URL derivation, dev server noise, and Shadow DOM interaction quirks. Load when examples aren't behaving as expected.
keywords: [debugging, chrome, devtools, mcp, examples, console, testing, shadow dom, playground]
audience: docs
skill: docs-examples-debugging
type: skill
---

# Debugging Examples with Chrome DevTools MCP

> **Skill:** `docs-examples-debugging`
> **Purpose:** Non-obvious gotchas when debugging documentation examples — things Chrome DevTools MCP alone won't tell you

**Golden rule: the playground is not a bare HTML page.** Examples run inside the Astro docs site with injected libraries, error interceptors, and auto-generated wrappers. Most debugging confusion comes from forgetting this.

---

## Example URL Derivation

The URL for an example is not always obvious from the file path:

```
/docs/src/examples/reactivity/introduction/reactions/  →  /examples/reactions
```

The ID comes from YAML frontmatter in `/docs/src/content/examples/*.mdx`:
- If `id` field exists → use that value
- Otherwise → auto-generated from `title` (tokenized to kebab-case)

The full URL is `https://dev.semantic-ui.com/examples/{id}`.

If you navigate and get a 404, confirm the dev server is running before assuming the path is wrong.

---

## Console Noise to Ignore

The playground injects several libraries that produce expected warnings. Filter these out when reading console output:

| Message | Source | Why it's there |
|---------|--------|----------------|
| "Lit is in dev mode" | Lit renderer | Always present in development builds |
| "Multiple versions of Lit loaded" | Playground isolation | The playground and host page each bundle Lit |
| Vite HMR / WebSocket messages | Astro dev server | Hot module replacement chatter |

If you see only these messages and no app-level logs, the example either hasn't loaded yet or produces no console output. Check for errors specifically before concluding the example is broken.

---

## Shadow DOM Interaction

When taking snapshots and interacting with elements, be aware that:

- **UIDs change after every navigation and reload.** Always take a fresh snapshot before clicking or filling. Stale UIDs silently fail or hit wrong elements.
- **Component internals are inside Shadow DOM.** A snapshot shows the accessibility tree which flattens shadow boundaries, but the UIDs address the real DOM. If an element appears in the tree but clicking does nothing, it may be a shadow host rather than the interactive child inside it.
- **Slotted content lives in the light DOM.** Elements passed into slots appear in the accessibility tree under the component, but they're owned by the parent. Interactions work, but the element's position in the tree can be misleading.

---

## Troubleshooting

**SSL certificate errors** (`ERR_CERT_AUTHORITY_INVALID`): The local dev server uses HTTPS. CA certificate installation instructions are in `/docs/cert/README.md`.

**Example loads but preview is blank**: Check if the example requires a `page.html`. The playground auto-generates one if missing, but it only contains the component's tag with no attributes or content. If the component needs attributes or slot content to render, you need a custom `page.html`.

**Code changes don't appear after reload**: Astro's HMR sometimes doesn't pick up changes to files inside `/docs/src/examples/`. A full page reload (not just HMR) usually resolves this.

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Example Authoring** | `docs-examples-authoring` | Creating or modifying documentation examples |
| **Doc Paths** | `docs-paths` | Deriving URLs for any docs page, not just examples |
