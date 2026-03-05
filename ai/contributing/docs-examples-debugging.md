---
title: Debugging Examples with Chrome DevTools MCP
description: Guide for AI agents to debug documentation examples running on the Astro dev server using Chrome DevTools MCP.
keywords: [debugging, chrome, devtools, mcp, examples, console, testing]
audience: contributing
skill: docs-examples-debugging
---

# Debugging Examples with Chrome DevTools MCP

> **Skill:** `sui:docs-examples-debugging`
> **Purpose:** Guide for debugging documentation examples running on the Astro dev server using Chrome DevTools MCP

---

## When to Use This

Use Chrome DevTools MCP when:
- Testing example code changes in the live playground
- Debugging console output from reactivity or component examples
- Verifying visual rendering of components
- Interacting with page elements to test behavior

---

## Quick Reference

### Navigate to an Example

```
mcp__chrome-devtools__navigate_page
  type: "url"
  url: "https://dev.semantic-ui.com/examples/{example-id}"
```

The example ID comes from the YAML frontmatter in `/docs/src/content/examples/*.mdx`:
- If `id` field exists → use that value
- Otherwise → auto-generated from `title` (tokenized to kebab-case)

The ID must match the example's folder name in `/docs/src/examples/` for routing to work.

Example: `id: 'reactions'` in frontmatter → folder at `/docs/src/examples/reactivity/introduction/reactions/` → URL is `/examples/reactions`

### Read Console Logs

```
mcp__chrome-devtools__list_console_messages
```

Returns all console messages with message IDs. Filter by type if needed:
- `log` - Standard console.log output
- `warn` - Warnings
- `error` - Errors
- `debug` - Debug messages

### Take a Page Snapshot

```
mcp__chrome-devtools__take_snapshot
```

Returns the accessibility tree with element UIDs. Use UIDs to interact with elements.

### Reload After Code Changes

```
mcp__chrome-devtools__navigate_page
  type: "reload"
```

---

## Debugging Workflow

### 1. Navigate to the Example

```
mcp__chrome-devtools__navigate_page
  type: "url"
  url: "https://dev.semantic-ui.com/examples/reactions"
```

### 2. Check Console Output

```
mcp__chrome-devtools__list_console_messages
```

Look for:
- **App logs** - Output from the example code (console.log statements)
- **Errors** - Runtime errors in the example

Ignore these expected dev warnings:
- "Lit is in dev mode" - Normal in development
- "Multiple versions of Lit loaded" - Expected with playground
- Vite/Astro connection messages - Dev server noise

### 3. Make Code Changes

Edit the example source file in `/docs/src/examples/`.

### 4. Reload and Verify

```
mcp__chrome-devtools__navigate_page
  type: "reload"
```

Then check console again to verify the change.

---

## Interacting with Examples

### Click Elements

Take a snapshot first to get element UIDs:
```
mcp__chrome-devtools__take_snapshot
```

Then click using the UID:
```
mcp__chrome-devtools__click
  uid: "1_42"
```

### Fill Form Fields

```
mcp__chrome-devtools__fill
  uid: "1_13"
  value: "test input"
```

### Wait for Content

```
mcp__chrome-devtools__wait_for
  text: "Expected output"
  timeout: 3000
```

---

## Example: Testing a Reactivity Example

**Goal:** Verify that a Signal change triggers a Reaction.

1. **Navigate:**
   ```
   navigate_page → https://dev.semantic-ui.com/examples/reactions
   ```

2. **Read initial console:**
   ```
   list_console_messages
   ```

   Expected output:
   ```
   [log] Full name: John Doe
   [log] Full name: Jane Doe
   [log] Full name: Jane Smith
   ```

3. **Modify the example** in `/docs/src/examples/reactivity/introduction/reactions/index.js`

4. **Reload and verify:**
   ```
   navigate_page → type: "reload"
   list_console_messages
   ```

5. **Check for changes** in the console output.

---

## Troubleshooting

### SSL Certificate Errors

If you see `ERR_CERT_AUTHORITY_INVALID`, the CA certificate needs to be installed. See `/docs/cert/README.md` for platform-specific instructions.

### No Console Messages

The example may not have loaded yet. Use `wait_for` with expected text, or check for errors:
```
mcp__chrome-devtools__list_console_messages
  types: ["error"]
```

### Element Not Found

Take a fresh snapshot - UIDs change after page navigation or reload:
```
mcp__chrome-devtools__take_snapshot
```

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Example Authoring** | `sui:docs-examples-authoring` | Creating documentation examples |
| **Example Self-Critique** | workflow `docs-examples-self-critique` | Quality checklist for examples |
