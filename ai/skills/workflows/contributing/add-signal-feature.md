---
title: Add Signal Feature Workflow
description: Step-by-step workflow for adding or modifying Signal methods and options in the @semantic-ui/reactivity package, including tests, types, examples, and documentation.
keywords: [reactivity, signal, reactive, workflow, implementation, testing, mutation helpers]
audience: contributing
type: workflow
workflow: add-signal-feature
---

# AI Workflow: Adding a Signal Feature

**For AI agents working on the @semantic-ui/reactivity package**

Covers new Signal methods (read accessors, mutation helpers), new constructor options, and changes to existing ones. The same surface applies to `Reaction`, `computed`, and `derive` — swap the source/test/doc files for the relevant primitive.

## Context Loading Requirements

### Implementation (steps 1–3)
- `reactive-state` — the reactivity guide; you also update it in step 6
- `performance-v8-object-model` — Signal sits on hot paths; confirm shape stability before touching the constructor or read/write methods

### Documentation (steps 4–7) — mandatory, not optional
The bar is high-quality open-source documentation, the kind Vite and Svelte ship. You cannot hit it without understanding who reads these docs, so the audience skills come first, not last:

- **Audience and voice (read first, every time)** — `docs-target-audience` (who reads and how that changes the writing), `docs-writing` (prose baseline and editing strategy), `docs-ai-tropes` (the anti-patterns that mark writing as AI-shaped)
- **Structure and paths** — `docs-authoring-standards` (page structure), `docs-paths` (URL and anchor derivation, needed for `@see` links and `PlaygroundExample` ids)
- **Example** — `docs-examples-authoring`, plus `docs-examples-debugging` if you verify it live
- **API page** — `docs-page-api-reference`
- **Guide** (only if the feature warrants one) — `docs-page-guide`

Load each via MCP (`use_skill`); skim the full set with `list_skills` (or `ai/skills/docs/`) and pull anything else touching your surface. An agent that writes docs without reading the audience skills produces prose that gets rewritten — that wasted pass is the tell.

## Workflow Overview

Complete these steps in order:

1. **Implementation** — write the method/option in source
2. **Testing** — cover observable reactive behavior
3. **Types** — update the hand-authored `.d.ts`
4. **Example** — create a runnable playground example
5. **API Documentation** — add the method to the API page
6. **AI Guide** — update the `reactive-state` skill
7. **Release Notes** — record the change

Steps 1–3 are the API contract and stay with the implementing author. Steps 4–7 are the doc surface and can be handed to a documentation subagent.

The two doc surfaces draw different human editing passes, so aim accordingly. **API reference** gets a light pass — ship it near-final: precise signatures, correct anchors, complete parameter and return entries. **Guides** get a strong human pass on voice and pedagogy, so nail the structure, substance, and examples and don't over-polish prose a human will rewrite. Neither pass is fact-checking — the structural and factual bar is yours.

## Step 1: Implementation

### Source Location
`packages/reactivity/src/signal.js` (Signal), or `reaction.js` / `helpers/derived.js` for the other primitives.

### Key Patterns
- **Shape stability is non-negotiable.** Initialize any new instance field in the constructor, unconditionally, in the existing order. A field added later or behind a condition forks the hidden class and demotes every Signal. See `performance-v8-object-model`.
- **Public name vs internal field.** Constructor options are the terse public API (`clone`, `equality`, `id`). When an option's name is also needed for a method, the constructor is the translation seam — store it under a descriptive field (`this.cloneFunction = clone`) so the bare verb is free for the method. Only rename the field that actually collides.
- **Read accessors compose with `depend()`.** The tracking axis is one primitive. `get()` is `depend()` + protected read. A new accessor that should be reactive calls `this.depend()` itself, then returns; one that shouldn't, doesn't. There is no separate tracked/untracked variant to author.
- **Mutation helpers notify directly.** Array helpers that always change the value skip the clone-and-compare and call `this.notify()`. Helpers that may be a no-op compare first.
- Reuse the configured strategy functions (`this.cloneFunction`, `this.equality`, `this.id`) rather than inlining clone/compare logic.

### Comment Discipline
Comment only the non-obvious. A read accessor's reactivity and copy semantics are worth one line each when they differ from the neighbors; a plain getter is not.

## Step 2: Testing

> **See Also:** `testing` for organization and conventions.

### Test Location
`packages/reactivity/test/unit/signal.test.js` — accessors and options live here, grouped by `describe('methodName')` in source order. Mutation helpers go in `signal-helpers.test.js`; scheduler/dependency internals in `internals.test.js`.

### Run
`cd packages/reactivity && npm test` runs the whole suite in well under a second. Don't `-t`-filter as proof — non-matching tests report as "skipped" and read as failures.

### What to Cover
Lead each test with the user-visible behavior, not the implementation. For a Signal feature the load-bearing axes are:

- **Reactivity** — read inside a `reaction`, mutate the source, assert the reaction re-ran (or did not, for a non-reactive read). Use `flush()` between mutation and assertion.
- **Safety modes** — the same operation under `safety: 'reference'` (default, live value) and `safety: 'clone'` (defensive copy). Many bugs only appear in one mode.
- **Per-instance overrides** — pass a spy as the `clone`/`equality`/`id` option and assert it's used.
- **Equality / no-op paths** — setting an equal value must not re-fire; a helper that changes nothing must not notify.

Avoid tautological tests that assert the method returned what you just set. Ask: what would I notice regressing if this broke?

### Pattern
```javascript
describe('clone()', () => {
  it('returns a detached copy under reference safety, so mutating it leaves the source intact', () => {
    const signal = new Signal([3, 1, 2]);
    const copy = signal.clone();
    copy.sort();
    expect(copy).toEqual([1, 2, 3]);
    expect(signal.get()).toEqual([3, 1, 2]);
  });

  it('reading inside a Reaction creates a dependency so changes re-run the reaction', () => {
    const items = new Signal([1, 2]);
    const cb = vi.fn(() => items.clone());
    reaction(cb);
    items.push(3);
    flush();
    expect(cb).toHaveBeenCalledTimes(2);
  });
});
```

## Step 3: Types

### Location
`packages/reactivity/types/signal.d.ts` — hand-authored, mirrors the runtime. Place the new member next to its conceptual neighbors (a read accessor after `raw()`, a mutation helper among the array methods).

### Required Elements
- JSDoc describing behavior, including reactivity and (if relevant) how it behaves across safety modes
- `@see {@link https://next.semantic-ui.com/docs/api/reactivity/signal#methodname methodName}` — anchor is the lowercased method name
- `@param` descriptions without type annotations; `@returns` when non-void

Internal fields (`this.cloneFunction`) are not part of the public type surface — don't add them.

### Pattern
```typescript
/**
 * Returns a detached deep copy of the current value, established as a reactive
 * dependency. Always copies, even under `safety: 'reference'` where `get()`
 * returns the live value.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/signal#clone clone}
 */
clone(): T;
```

## Step 4: Example

### Structure
```
docs/src/examples/reactivity/[subcategory]/reactive-[name]/index.js
docs/src/content/examples/reactive-[name].mdx        # metadata
```

Subcategories in use: `introduction`, `variables`, `helpers`, `controls`, `advanced`. Pick by feature kind (a read accessor → `variables`; a number/array helper → `helpers`; scheduling → `controls`).

### Naming collisions
The example `id` and the metadata filename must be unique. `reactive-clone` already documents the `safety: 'clone'` preset — a `clone()` method example needs a distinct id (e.g. `reactive-clone-method`). Check `docs/src/content/examples/` before naming.

### Metadata Pattern
```yaml
---
title: 'Safe Mutable Copy'
shortTitle: 'Clone'
id: 'reactive-clone-method'
exampleType: 'log'
category: 'Reactivity'
subcategory: 'Variables'
tags: ['reactivity', 'signals', 'clone', 'mutation']
description: 'Get a reactive copy you can sort or mutate in place'
tip: 'A non-obvious insight or a pointer to the related method (raw, peek)'
---
```

### Example Code
- `console.log` for output, no inline result comments beyond a short label
- one focused lesson; show the contrast that motivates the feature (e.g. live `get()` leaking a mutation vs `clone()` staying clean)
- runnable top to bottom, imports from `@semantic-ui/reactivity`

## Step 5: API Documentation

### Location
`docs/src/pages/docs/api/reactivity/signal.mdx`

### Placement
The page is sectioned `## Creating` / `## Reading` / `## Writing` / `## Dependencies` / `## Deriving`. Add the method under the matching section, next to its neighbors (a read accessor after `### raw`). Two things are easy to miss:

- add the method name to the `methods:` array in the page frontmatter
- add `<PlaygroundExample id="reactive-[name]" direction="horizontal"></PlaygroundExample>` under an `#### Example` heading, matching the example `id` from step 4

### Pattern
```markdown
### clone

```javascript
signal.clone();
```

Returns a detached deep copy of the current value, subscribing the reader.
Always copies, even under `safety: 'reference'`.

#### Returns

A deep copy of the value.

#### Example

<PlaygroundExample id="reactive-clone-method" direction="horizontal"></PlaygroundExample>
```

## Step 6: AI Guide

### Location
The `reactive-state` skill at `ai/skills/authoring/reactive-state.md`.

Add the method to the matching subsection (`Reading Values`, `Array Operations`, etc.) with a one-line usage comment. If the feature changes a documented behavior (a renamed option, a new safety interaction), fix the prose that describes it, written as the current state, not as a changelog of what moved.

## Step 7: Release Notes

### Location
`CHANGELOG.md`, under a `### Reactivity` heading.

```markdown
### Reactivity
* **Feature** - `signal.clone()` returns a reactive, detached copy for safe in-place mutation
* **Feature** - `signal(value, { option })` now accepts `option` for [purpose]
* **Breaking** - `oldName` renamed to `newName` to [reason]
```

## Verification Checklist

- [ ] Source initializes any new field in the constructor, in order (shape stable)
- [ ] `cd packages/reactivity && npm test` — full suite green
- [ ] Tests cover reactivity, both safety modes, and per-instance overrides where relevant
- [ ] `.d.ts` member added with `@see` anchor
- [ ] Example created with a unique `id`; metadata file matches
- [ ] API page: method documented, added to `methods:` frontmatter, `PlaygroundExample` wired
- [ ] `reactive-state` skill updated
- [ ] `CHANGELOG.md` entry under Reactivity
