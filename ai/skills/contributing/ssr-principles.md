---
title: SSR & Hydration Principles
description: Core design principles for server-side rendering and client hydration in Semantic UI. The governing constraints that prevent mismatch bugs and guide implementation decisions.
keywords: [SSR, hydration, mismatch, trust-then-wire, shared helpers, server renderer, DSD, declarative shadow DOM]
audience: contributing
skill: ssr-principles
type: skill
---

# SSR & Hydration Principles

> **Skill:** `ssr-principles`
> **Purpose:** The governing constraints for SSR and hydration work. Load before modifying any server rendering, hydration, or attribute resolution code.

---

## Why SSR Exists Here

SSR in Semantic UI exists for **first paint performance** — the user sees styled, structured content before JavaScript loads. The server produces Declarative Shadow DOM (DSD) that the browser renders immediately. JavaScript then hydrates the existing DOM with reactive bindings.

This is not server rendering for SEO or static generation. The goal is a fast visual that the client seamlessly takes over. Every design decision flows from this.

---

## The Golden Rule: Shared Implementation Prevents Mismatch

The largest class of SSR bugs is **server/client mismatch** — the server renders one thing, the client expects another. The most effective prevention is not validation or error handling. It is **using the same code path for both environments**.

Every time the server and client have separate implementations of the same logic, a mismatch bug is latent. Every time they share a helper, a mismatch bug is structurally impossible.

```
❌ Server has its own boolean attribute normalization
   Client has fromAttribute converters in the property system
   → They disagree on how tiny="" becomes a value

✅ Both use fromAttribute converters from resolvedProperties
   → They cannot disagree
```

### The diagnostic question

When investigating or fixing an SSR bug, always ask:

> **"Is this different on the client and server because they were written differently? How can I unify the logic? Is there a shared helper that already handles this?"**

If the answer is "the server reimplements what the client does via a different code path," the fix is unification, not patching the server's version.

### Concrete shared paths

| Concern | Shared implementation | Used by |
|---------|----------------------|---------|
| Attribute → property conversion | `fromAttribute` converters in `resolvedProperties` | `deserializeAttrs`, `attributeChangedCallback` |
| Option attribute resolution | `resolveOptionAttributes` in `component-helpers.js` | `renderToString`, `deserializeAttrs` |
| `{ui}` class computation | `getUIClasses` in `component-helpers.js` | `renderToString`, `WebComponentBase.getData()` |
| Expression evaluation | `ExpressionEvaluator` | `ServerRenderer`, `Renderer` (client) |
| AST compilation | `TemplateCompiler` | Shared — compiled once, used everywhere |
| Settings signal overlay | `overlaySettingsSignals` in `template.js` | `Template.initialize()` (both environments) |

When adding new attribute processing, type coercion, or data transformation, check whether the client already has a helper. If it does, import and use it. If it doesn't, create a shared one in `component-helpers.js` and use it from both paths.

---

## Trust-Then-Wire

During hydration, the system should **trust the server DOM and wire reactive bindings to it**. It should not re-evaluate conditions to validate whether the server was "correct."

### What this means

The server rendered HTML. The browser parsed it. The user is looking at it. Hydration's job is to attach reactivity so future changes work — not to audit the server's output.

```
❌ Hydration re-evaluates {#if icon}, gets a different answer than the
   server, concludes "mismatch," and clears the server content.
   → The user sees content disappear.

✅ Hydration trusts the server DOM, wires a Reaction to {#if icon},
   and if the condition changes later, the Reaction handles it naturally.
   → The user sees no disruption.
```

### Why re-evaluation during hydration is dangerous

1. **The data context may not match the server's.** `initialize()` can mutate settings. Settings Signals propagate on microtask flush. The data snapshot used during hydration wiring may be stale.

2. **Clearing server content is destructive and visible.** The user already sees the server render. Removing and re-rendering content causes layout shift and flash.

3. **The reactive system handles divergence naturally.** If state truly changed, the wired Reactions will fire on the next tick and update the DOM. There is no need to eagerly detect and fix divergence during the wiring pass.

### What other frameworks do

**Lit:** Does not skip DOM writes during hydration. Diffs template parts against server DOM. If values match (common case), no work. If they differ, writes the new value. No eager clearing of content.

**Svelte:** Walks server DOM and assigns ownership to client blocks. Reactive statements write unconditionally. Browser short-circuits no-op writes.

**Solid:** Uses signals and fine-grained reactivity (closest analogue). During hydration, evaluates expressions to register dependencies. Compares against DOM. Writes only on divergence. Never clears server content based on a condition re-evaluation.

None of these frameworks re-evaluate block conditions during hydration and clear content on mismatch. They all wire bindings and let the reactive system converge.

### The exception: `isClient`/`isServer` guards

Conditional blocks with `{#if isClient}` or `{#if isServer}` are the one case where server/client divergence is **expected and intentional**. The hydration system already detects these via branch-index metadata in the closing comment marker and handles re-rendering without dev warnings. This is correct — it's a known, bounded divergence, not a data-timing bug.

---

## Hydration Should Not Write When Values Match

For text expressions and attribute bindings, the browser is already an efficient no-op detector:

- `textNode.data = sameValue` — no layout invalidation
- `element.setAttribute(name, sameValue)` — no style recalc

There is no need for a `firstRun` skip that prevents DOM writes during hydration. The expression must be evaluated anyway (to register Signal dependencies). The value is already computed. Let the browser handle the no-op case.

**Exception: unsafeHTML.** Re-parsing and re-inserting HTML nodes is genuinely expensive even when the content matches. Keep the `firstRun` skip for unsafeHTML. Still evaluate the expression for dependency registration.

**Exception: each loops.** The `firstRun` skip in `hydrateEach` prevents a full teardown-and-rebuild of the list. This is structural, not a value optimization. Keep it.

---

## `initialize()` Is a Client Mutation

The framework provides `isClient` and `isServer` as first-class callback parameters. Components use `initialize()` to set up client-specific state, configure derived settings, and read browser APIs. This is a supported, documented pattern.

The hydration system must treat `initialize()` output as potentially different from the server. It cannot assume the server DOM reflects post-`initialize()` state, because:

1. `initialize()` runs inside `Template.clone()`, before hydration wiring
2. Settings mutations go through the Proxy → create Signals
3. Those Signals must be in the data context so Reactions can depend on them
4. `overlaySettingsSignals` must overlay ALL settings Signals, not just those with default values

---

## Quick Reference

```
GOLDEN RULE
  Server/client mismatch → look for divergent implementations → unify

TRUST-THEN-WIRE
  Don't re-evaluate conditions during hydration to validate server DOM
  Wire bindings, let reactive system handle divergence

SHARED HELPERS
  fromAttribute converters    → attribute string → typed value
  resolveOptionAttributes     → tiny → size="tiny"
  getUIClasses                → spec attrs → class string
  overlaySettingsSignals      → settings → reactive data context

HYDRATION WRITES
  Text/attributes: always write (browser no-ops when unchanged)
  unsafeHTML: skip firstRun write (expensive reparse)
  each loops: skip firstRun render (structural teardown)

DIAGNOSTIC
  "Is this different because server and client were written differently?"
  "Is there a shared helper that handles this?"
  "Can I unify the logic instead of patching one side?"
```

---

## Related Skills

| Skill | Use when... |
|-------|-------------|
| **Native Renderer** (`native-renderer`) | Working on client-side rendering or hydration |
| **Component SSR** (`component-ssr`) | Writing SSR-safe component code |
| **Render Pipeline** (`render-pipeline`) | Understanding the full template → DOM pipeline |
| **Mental Model** (`mental-model`) | Framework architecture and design decisions |
