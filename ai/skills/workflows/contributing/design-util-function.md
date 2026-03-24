---
title: Design Utility Function
description: Collaborative workflow for designing utility functions — API shape, naming, and V8-optimized implementation. Run this before add-util-function.
keywords: [utils, design, naming, v8, performance, workflow]
audience: contributing
type: workflow
workflow: design-util-function
---

# AI Workflow: Designing a Utility Function

**A collaborative design process for `@semantic-ui/utils`**

This workflow produces a function signature, name, and implementation. Run it *before* the `add-util-function` workflow which handles testing, types, docs, and shipping.

## Design Principles

This is not lodash. This is a first-principles utility library for 2026.

- **V8 is the target runtime.** Optimize for V8 internals. Don't optimize for SpiderMonkey, JSC, or Hermes unless there's a specific reason.
- **Frontend scale.** Arrays under 10k items, objects under 1k keys. Don't add complexity for scales that don't appear in client-side UI code.
- **Concrete values.** No generators, no iterators, no lazy evaluation. These push complexity onto the consumer. Return arrays and objects.
- **Common case is the fast case.** The most common call pattern should be the most optimized path.
- **First principles, not tradition.** Every API decision should be defensible on its own merits. Don't inherit conventions from other languages or libraries without examining whether they still make sense.
- **Algorithmic wins, not micro-optimizations.** Take the big wins: caching expensive constructors, avoiding O(n²) patterns, eliminating redundant allocations. Skip micro-optimizations that save nanoseconds but cost readability — a switch statement over an object lookup, a manual while loop over `.replace()`, a `for` loop over `.reduce()`. The code should read like what it *does*, not like what V8 does with it. Code-golf your way through the performance wins; if an optimization requires more lines than it saves in microseconds, it's not worth it.

## Step 1: Establish Intent

Before writing anything, understand what the function *means*.

1. **Read existing docs and examples** via MCP (`get_context`, `get_example`). These represent documented intent, even if the implementation diverges.
2. **Read existing usage** across the codebase. `Grep` for the function name in `src/`, `packages/`, and `docs/`. The call sites reveal how people actually think about it.
3. **Talk to the user.** They have context that isn't in the code — why this function exists, what it replaced, what it's meant to feel like.

## Step 2: Elicit Usage (Subagent)

Launch a **fresh subagent** with no knowledge of the current implementation. The goal is descriptive linguistics — discover what shape the function should take by observing how people describe needing it.

### Prompt template

```
You are a senior front-end developer. You have access to a utility function
that [abstract description of what it does — no signature, no parameter names].

When would you want this in front-end development? Give concrete, realistic
examples — show the values you'd want to produce and what problem they solve.
Think across UI layout, animation, data visualization, pagination, theming,
responsive design, component APIs, etc.

Do NOT suggest an API or function signature. Just describe the values you'd
need and why.
```

**Key constraint:** Do not lead the witness. Don't show the current signature. Don't show parameter names. Let the agent's natural description of the problem reveal what the natural API should be.

### What to look for

- Which arguments appear in most use cases (those become required or early positional params)
- Which arguments rarely appear (those become optional with defaults)
- Whether there are two distinct concepts hiding behind one function name (split them)

## Step 3: Name the Function (Subagent)

Launch a **fresh subagent** to name the function. Provide only:
- The decided signature with placeholder name `f`
- 6-8 example inputs/outputs
- The use cases from Step 2
- Instruction to optimize for comprehension by both human developers and agentic AI (LLMs reading and writing code)

### Prompt template

```
Do NOT read any files or search any code. This is a pure naming exercise.

A utility function has this behavior:

[examples with f(args) → output]

Signature: f(param1, param2 = default, param3 = default)

Common use cases: [list from Step 2]

What should this function be called? Give your top 5 name choices, ranked.
For each, briefly say why. Optimize naming for comprehension by both human
developers AND agentic AI (LLMs reading and writing code). The name should
make the function's behavior inferable without looking up docs.
```

## Step 4: Implementation (Subagent + Workshop)

Launch a subagent to propose an implementation. The agent gets:
- The final name and signature
- The V8 optimization constraints
- The frontend scale bounds

### Prompt template

```
Do NOT read any files. Write a standalone implementation.

Implement `[name]([signature])` for a utility library targeting V8 (Chrome/Node).

Constraints:
- Target runtime: V8 (Chrome, Node, Edge). Optimize for V8 internals.
- Frontend scale: arrays under 10k items, objects under 1k keys.
  Don't add complexity for scales that don't appear in client-side UI.
- The most common call pattern should be the fastest.
- Guard against degenerate inputs without throwing.
- Use `export const` with arrow functions.
- Return concrete values. No generators, iterators, or lazy evaluation.
- Destructure options with defaults in the function signature:
  `export const fn = (required, { option1 = default1, option2 = default2 } = {}) => { ... }`
  This is the library's standard pattern — it makes defaults visible at the
  call site, enables IDE autocompletion, and avoids manual default assignment.
- Prefer using `each(collection, callback)` for iteration. `each` is the
  library's universal iterator — it handles arrays, plain objects, Maps, Sets,
  and iterables with early-break via `return false`. Signature:
  `each(collection, (value, keyOrIndex, collection) => { ... })`.
  Using it consistently means one pattern everywhere. If you believe a specific
  hot path (e.g., inside a sort comparator called O(n log n) times) justifies
  a raw `for` loop instead, explain why.
- Prefer the library's own type helpers over raw `typeof`, `instanceof`, or
  `Object.prototype.toString` checks. Available helpers:
  `isArray(x)`, `isObject(x)`, `isPlainObject(x)`, `isString(x)`,
  `isNumber(x)`, `isBoolean(x)`, `isFunction(x)`, `isDate(x)`, `isRegExp(x)`,
  `isMap(x)`, `isSet(x)`, `isBinary(x)`, `isDOM(x)`, `isNode(x)`,
  `isPromise(x)`, `isEmpty(x)`, `isClassInstance(x)`.
  These use `Object.prototype.toString` tag dispatch where applicable, making
  them cross-realm safe (objects from iframes, workers, or VM contexts). Using
  them also improves tree-shaking (shared helpers are deduplicated by the
  bundler) and means a fix to a type check propagates to every consumer.

Before writing code, brainstorm the five most common usage patterns for this
function in frontend applications. Consider: what types of input data are
most frequent? What call patterns dominate? What sizes are typical? Use these
patterns as a reference when making implementation decisions — type check
ordering, fast paths, allocation strategy, and branching should all optimize
for the most common real-world case first, with rarer cases handled after.

Then propose an implementation that takes the algorithmic wins (caching expensive
constructors, avoiding O(n²) patterns, eliminating per-call allocations) while
keeping the code readable and compact. If a micro-optimization (switch vs object
lookup, manual loop vs .replace(), for vs .reduce()) saves nanoseconds but costs
readability, skip it. The code should read like what it does, not like what V8
does with it.

Explain your key optimization decisions briefly. Keep the implementation under
150 lines.
```

### Workshop

The subagent proposes; the human and primary agent challenge it together.

- Human brings intuition: "wouldn't a frontend dev expect..."
- Primary agent brings technical knowledge: "V8 will deopt here because..."
- Neither defers to the other. The goal is convergence through honest disagreement.

After converging, write the implementation and run related tests.

## Step 5: Validate

1. Run related tests: `npx vitest run --project node test/[module].test.js`
2. Grep for any call sites that need migration if the function signature changed
3. Update the workspace review doc if this is part of a larger audit

## Relationship to Other Workflows

This workflow produces: **a named, tested function in source.**

Hand off to `add-util-function` for: types, examples, API docs, AI context, and release notes.
