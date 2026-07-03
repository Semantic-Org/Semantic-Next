---
title: Code Comments — Intent, Not Mechanism
description: How to write and prune source comments in this repo — what earns a comment, the intent-over-mechanism reframe, placement, voice, and the calibration distilled from maintainer revision passes.
keywords: [comments, comment style, intent, voice, calibration, pruning, legibility]
audience: contributing
skill: code-comments
type: skill
---

# Code Comments — Intent, Not Mechanism

> **Skill:** `code-comments`
> **Purpose:** The calibration for source comments — what survives, what dies, and how to phrase what's left

---

**Golden rule: a comment states intent, never mechanism and never process.** The reader can see what the code does. The comment answers the one thing the code can't say — what it's for, or why it's shaped this way when a simpler shape looks possible.

The bar is what ships in Vite, Svelte, and Solid: sparse, informal, knowledgeable. If a file's comments would look chatty there, they're not done. Density is dramatic in practice — a maintainer pass over an over-commented file routinely cuts two-thirds of the comment lines with nothing lost.

---

## What Survives

- **Intent kernels** — the compressed why on the exact line it explains: `// cloned for safety`, `// partial docs cant honor validator so skip`
- **Genuinely subtle invariants** a reader cannot reconstruct from the code: a cross-boundary contract, a real trap, first-write-wins semantics
- **Design tradeoffs stated as decisions**: `// refuse a computed cycle at definition, not at the runtime cascade cap`
- **Early-return whys** — the classic "why are you returning early here, it's not obvious"
- **Orientation one-liners on dense names**: a usage example (`// Used to merge multiple schemas i.e. new Schema([AddressSchema, CustomSchema])`), a role label on idiom blocks (`// brand field`), a return shape on a resolver
- **Bag/param enumerations as starred lists** when the members aren't visible in the signature:
  ```js
  // context bag for computed and validator
  // * old() - a getter to grab the previous value of a path, supports relative paths
  // * get() - a getter to grab other values on doc, supports relative paths
  ```

## What Dies

- **Restating the code** — anything a reader gets from the names and the lines around it
- **Method-level "what this does" docs** — the name, the code, and the hand-authored `.d.ts` carry those
- **Mechanism narration** — how the plumbing works, which layer calls which. If the mechanism matters, it belongs in the file-lead comment or the architecture docs, once
- **Process and iteration state** — `TODO: for now`, `this commit`, `unused yet`. These mark the work as unfinished in public
- **Justifications addressed to a reviewer** — why the change is correct is the PR's job, not the code's

---

## The Reframe

The crux move when a comment is worth keeping but written wrong: flip "uses X because" into the goal followed by the action.

```js
// ❌ mechanism-first, narrates plumbing
// the whole doc rides in options so a field's custom validator can read its siblings

// ✅ goal so action
// validates against siblings so needs doc
```

```js
// ❌ explained contract
// always a fresh top-level object so the result is the caller's to mutate

// ✅ intent kernel
// cloned for safety
```

When the point is performance, lead with the win: `// save performance by determining if old is used in computed() blocks`.

## Comments as a Smell

Two patterns where the fix is not a better comment:

- **A comment explaining a clunky expression** — replace the expression with the utils vocabulary that says it directly (`!isObject(doc)` over a null-and-typeof chain) and delete the comment.
- **A comment arguing for a guard** ("which is the source of truth?") — the constraint may be wrong. Re-derive it from intent before keeping either the guard or its justification. Maintainer passes have deleted real guards this way.

---

## Placement

- On the **exact line** it explains, not stacked at the method head
- Trailing one-liners are welcome: `this.set(value); // re-pins harmlessly`
- Never butt a `/* block */` against a `//` line — merge adjacent stacks into one comment
- **File-lead comments** stay short: what this is plus the one or two invariants that govern it. The maintainer revoices these personally, so accurate-and-brief beats polished
- Section headers are structure, not commentary — see `code-formatting` for the boxed hierarchy

## Voice

- lowercase first word, conversational fragments, apostrophes optional ("cant", "doesnt")
- no em-dashes, no semicolons in prose, no unicode arrows (ASCII `->` is fine)
- drop trailing periods on one-liners
- multi-line only when each line carries a distinct fact
- `i.e.` with an inline example beats an abstract description
- avoid jargon that encodes mechanism as shorthand — currently flagged: *pin*, *ride*, *gated* as filler adjectives. Use plain intent verbs (hold, travels, checked). Keep the house vocabulary consistent (see `coding-standards`)

## Where the Rules Relax

- **Tests** run looser — but still no `[source X]` / `[skill X]` citation tags, no `Witness:` / `FINDING:` prefixed prose, no narration that restates an assertion (see `testing` and `grounded-testing`)
- **`.d.ts` files** are API reference — full JSDoc is the genre there, not here
- **Teaching artifacts** (a `sample.js` authoring reference) may carry long deliberate documentation

---

## Quick Reference

| Found in code | Do |
|---------------|-----|
| Comment restates adjacent code | delete |
| "what this method does" doc | delete, the name and .d.ts carry it |
| "uses X because" mechanism story | reframe as goal-so-action, one line |
| Multi-line why where one fact matters | compress to the kernel |
| Comment explaining a clunky guard | simplify the code, delete the comment |
| Comment arguing for a guard | re-derive the constraint from intent |
| Dense name with no orientation | add a one-line usage example or role label |
| `TODO: for now` / iteration state | delete, or make it real work |

## Related Skills

| Skill | Type | Use when... |
|-------|------|-------------|
| **coding-standards** | skill | The abstractions and code shape these comments live in |
| **apply-code-standards** | workflow | Running the full prune/rename/reorder pass over existing code |
| **code-formatting** | skill | The mechanical comment hierarchy (boxed headers, levels) and dprint rules |
