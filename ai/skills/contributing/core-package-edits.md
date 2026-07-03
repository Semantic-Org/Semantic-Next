---
title: Core Package Edit Protocol
description: How to edit framework source under packages/ — finding the module that owns a semantic, extending existing shapes instead of inventing new ones, and when to delegate the fix to a focused agent. Load before any edit to packages/*/src.
keywords: [core, packages, renderer, reactivity, templating, compiler, editing protocol, architecture, ownership, delegation, blocks, registry]
audience: contributing
skill: core-package-edits
type: skill
---

# Core Package Edit Protocol

> **Skill:** `core-package-edits`
> **Purpose:** The mode-switch for editing framework source under `packages/*/src`

**Golden rule: the module that owns a semantic is rarely the file where the symptom lives.** Diagnosis can lead you into core from anywhere — follow it freely. The *edit* is a separate mode with its own protocol.

---

## Why this exists

Core packages have ownership structures that a single file doesn't show: the renderer's blocks registry owns expression semantics, `define-block` owns block lifecycle, the evaluator owns resolution. A fix written at the symptom site — even a mechanically correct one — puts a decision where no future reader will look for it, and reads as a patch from someone who only saw the grep radius. These files are several years of design; edits are judged on whether they look like they belong.

---

## The Protocol

### 1. Find the owning abstraction

Before touching the target file, read the package's structural layer: the registry or dispatch that routes to your file, the siblings of your target module, and any `define*`/factory that shapes them. Ask: *which module owns the semantic I'm changing?* If your target file consumes a semantic (a binder, a dispatcher, a walker), the fix usually belongs in the module that defines it.

### 2. Extend existing shapes

The package already has a shape for what you're adding — an options bag, a registry entry, a hook, an exported helper with the house signature (`{ node, data, renderer }`-style bags in the renderer). Add a parameter or an option to an existing construct before adding a new construct.

**The altitude test: if your fix introduces a new shape rather than extending an existing one, you're at the wrong altitude.** Go up a level and look again.

### 3. Match the house style

- Signatures: bags matching the surrounding hooks, not positional args
- Comments: max ~2 lines, only the footgun — see `code-comments`
- Formatting per `code-formatting`; no new top-level helpers where a registry exists

### 4. Prefer delegation for scoped fixes

If you arrived here mid-task (a docs bug that traced into the renderer, a tooling issue that traced into the compiler), the momentum of your main task works against architectural placement. Present the diagnosis, then hand the fix to a fresh agent whose only brief is: *explore this package's structure, then fix exactly this.* Full-package context beats session momentum. Larger core refactors stay in conversation with the maintainer — don't delegate those.

### 5. Verify with the package's own suite

Run the full suite, not a filter (`cd packages/renderer && npm test` runs everything in ~6s). Add a test in the existing file for the surface you touched, matching its structure (e.g. the `RENDERING_ENGINES` loop in renderer browser tests — your fix must hold on every engine).

Check `list_workflows` first: path-specific workflows exist for common core changes (`add-signal-feature`, `add-query-method`, `add-template-syntax`) and encode steps this general protocol can't.

---

## Worked example

Real case: lisp-style expressions in property bindings (`.extensions={getExtensions filename}`) silently resolved to `undefined` in the native renderer.

❌ **Symptom-site patch** — a new `resolveLiteralFirst` helper defined inline in `attribute-binding.js` with invented token-first-fallback semantics. Mechanically plausible. Wrong: expression resolution isn't the binder's to define, the helper allocated per call in a hot path, and the semantics existed nowhere else in the system.

✅ **Owning-module fix** — `blocks/expression.js` already dispatched literal vs expression resolution for text positions. The fix exported that dispatch as `computeExpressionValue({ node, data, renderer, literal })` and had the binder delegate to it, with a `literal` option so event position could state its intent through the same function. One semantic, one home, bag signature, two-line comment naming the footgun (literal resolution skips zero-arg auto-invoke to preserve function references).

The difference wasn't correctness — both passed tests. It was that the second one has an address a future reader can find.

---

## Related Skills

| Skill | Use when... |
|-------|-------------|
| `mental-model` | You need the framework's architecture before diagnosing |
| `code-comments` | Deciding what earns a comment in the fix |
| `code-formatting` | Mechanical style: indentation, comment hierarchy |
| `test-writing` / package workflows | `list_workflows` for path-specific change guides |
