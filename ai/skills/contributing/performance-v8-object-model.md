---
title: V8 Object Model — Shapes, Inline Caches, and Arrays
description: How V8 represents JS objects and arrays at the engine level. Covers hidden classes (Maps), shape transitions, monomorphic/polymorphic/megamorphic inline caches, in-object vs out-of-object property storage, slack tracking, private fields (#field) vs WeakMap vs Symbol keys, class extends and fast super, mutable heap number slots, elements kinds for arrays (PACKED_SMI/DOUBLE/elements, HOLEY variants, DICTIONARY), TypedArrays, Object.groupBy, object spread. Load for questions about object access patterns, allocation shape, or array operations.
keywords: [hidden class, V8 Map, shape transition, inline cache, IC, monomorphic, polymorphic, megamorphic, slack tracking, in-object properties, dictionary mode, private fields, Symbol keys, WeakMap, fast super, mutable heap number, elements kinds, PACKED_SMI, HOLEY, TypedArray, Float64Array, Object.groupBy, object spread]
audience: authoring
skill: performance-v8-object-model
type: skill
---

# V8 Object Model — Shapes, Inline Caches, and Arrays

> **Skill:** `performance-v8-object-model`
> **Purpose:** What V8 actually does with your objects and arrays, and what code patterns work with that representation.

**Golden rule: Shape stability matters more than any other single optimization concern. Same constructor, same properties, same order, every time.**

Current as of Chrome 138, May 2026.

---

## Hidden classes (V8 calls them Maps)

Every object carries a hidden-class pointer to a *Map* describing its layout: which properties exist, in what order, at which slot, with which attributes (writable/enumerable/configurable). Two objects share a Map iff they took the same transition path through the Map tree.

Maps are created by transitions. Starting from a root Map for the constructor, each property addition transitions to a new Map. Adding the same property in the same order from the same root reuses the same descendant Map — this is how `{ a, b }` literals at different call sites share a shape.

### What forks the transition tree

✅ Initialize every property unconditionally, in the same order, every time:

```js
function Node(value) {
  this.value = value;
  this.subscribers = null;
  this.dirty = false;
  this.lastComputed = 0;
}
```

❌ Conditional or out-of-order initialization forks the shape tree:

```js
function Node(value, eager) {
  this.value = value;
  if (eager) this.eager = true;  // forks: with-eager vs without-eager
  this.dirty = false;
}
```

Other forking causes:

- **Adding a property to an already-built object**, especially after it's been observed at many call sites. Two `{a:1, b:2}` literals at different lines share a shape; assigning `obj.c = 3` later transitions that one to a new branch.
- **`delete obj.foo` on a data property.** Forces a transition into *dictionary mode* (slow properties, hash-table storage). V8 will not undo this even if you assign `foo` again. The object stays slow for its lifetime. To "clear" a slot without breaking shape, assign `undefined`.
- **Non-default attributes via `Object.defineProperty(obj, 'x', { writable: false, … })`** after construction. May force dictionary mode or a singleton shape.

### In-object vs out-of-object storage

V8 reserves some in-object property slots inside the object's allocation; properties beyond that land in an out-of-object backing store (a `PropertyArray`). In-object = one memory load; out-of-object = two. *Slack tracking* (v8.dev/blog/slack-tracking, Sept 2020) observes the first several instances of a constructor to decide how much in-object space to reserve permanently.

✅ Do all property initialization inside the constructor.
❌ Adding properties later than the first several instances established lands them in the out-of-object store, paying indirection on every access from then on.

---

## Inline Caches: monomorphic / polymorphic / megamorphic

Per-call-site Inline Caches track up to **4 shapes**.

| State | Shapes seen | Maglev codegen |
|-------|-------------|----------------|
| Monomorphic | 1 | One shape check, direct field load. Fastest. |
| Polymorphic | 2–4 | Small dispatch table of shape checks. Fast. |
| Megamorphic | 5+ | Generic stub with hash-table lookup. Materially slower. |

Thresholds have not changed in current V8. What changed is how well modern compilers handle polymorphism — the answer is "better than 2017-era folklore assumes."

✅ Use distinct classes per role (`class State extends Node`, `class Computed extends Node`) — each gets a stable shape.
❌ A single `class Node { kind: 'a'|'b'|'c'; ... }` with a discriminator gives all instances the same shape but makes *consumers* of role-specific properties polymorphic.

---

## Private fields vs WeakMap vs Symbol keys

Since V8 9.7 (Joyee Cheung, v8.dev/blog/faster-class-features, Apr 2022), private class fields use the same shape-transition + IC machinery as ordinary properties. Subsequent initializations take a fast path equivalent to plain property store. The only slow case left is calling `super()` from a nested arrow function — rare enough to ignore.

| Choice | When |
|--------|------|
| **`#field`** | Default for genuinely private state. Fast, true encapsulation, invisible to `for…in`, `JSON.stringify`, `Object.keys`. |
| **WeakMap-per-instance** | Only when you need to attach data to objects you don't own. Slower per access — two hash operations. |
| **Symbol-keyed property** | When you want cross-module access without polluting the public surface. Same shape/IC cost as string-keyed. |

---

## Class extends class

`super.method()` and `super.field` lookups have been inline-cached since V8 9.0 (v8.dev/blog/fast-super, Feb 2021). Class hierarchies are fine on hot paths.

✅ Use `class Computed extends Signal` freely.
❌ The "extends slows things down" rule is dead.

---

## Mutable heap number slots (Chrome 133, Feb 2025)

V8 tracks per-slot type information for module-context (top-level) numeric variables and uses **mutable heap-number slots** that transition through: Constant → SMI → Int32 → Float64 → Other (Victor Gomes, v8.dev/blog/mutable-heap-number, Feb 2025). Once a slot hits *Other*, it never returns. Eliminates a `HeapNumber` allocation per write *and* generates integer machine instructions when in Int32 range.

The same idea applies (and predates this post) to numeric *properties* on `JSObject`s.

✅ Top-level `let frame = 0; export function tick(){ return ++frame; }` is allocation-free as long as `frame` stays integer.
❌ One stray `frame = frame + 0.5` (even in test code) permanently demotes the slot to Float64 / Other.
✅ Keep counters, version numbers, frame timestamps strictly integer.

---

## Arrays and elements kinds

Array element storage is described by an *elements kind* — a property of the array's Map distinct from per-property shape information. Six matter for application code:

```
PACKED_SMI_ELEMENTS   →  HOLEY_SMI_ELEMENTS
       ↓                          ↓
PACKED_DOUBLE_ELEMENTS → HOLEY_DOUBLE_ELEMENTS
       ↓                          ↓
PACKED_ELEMENTS       →  HOLEY_ELEMENTS
```

Transitions move only **down** (number → double → tagged) and **right** (packed → holey). One-way, with **one** known exception called out in a 2025-02-28 edit to v8.dev/blog/elements-kinds: `Array.prototype.fill` can promote a holey array back to packed.

| Kind | Contents |
|------|----------|
| `PACKED_SMI` | All elements are tagged small integers. Fastest. |
| `PACKED_DOUBLE` | All elements are doubles. `NaN`, `Infinity`, `-0` live here. |
| `PACKED` | Tagged values (objects, strings, mixed). Single indirection per read. |
| `HOLEY_*` | Same as packed but with at least one hole (never-assigned slot, distinct from `undefined`). Reads must check for the hole and walk the prototype chain on miss. |
| `DICTIONARY_ELEMENTS` | Sparse storage as a hash table. Dramatically slower. |

### What kicks an array off the fast path

❌ `new Array(n)` — immediately `HOLEY_SMI_ELEMENTS`.
❌ Out-of-bounds reads (`arr[42]` when `length === 5`) — burns the IC permanently.
❌ Inserting `NaN`/`Infinity`/`-0` into a `PACKED_SMI` — transitions to `PACKED_DOUBLE`.
❌ `delete arr[i]` — holey permanently.
❌ Sparse assignment (`arr[10000] = 'x'` on length-10) — `DICTIONARY_ELEMENTS`.
❌ Shrinking then growing `arr.length` — creates holes.

✅ Start with `[]`, push elements in order, of consistent type.

### Array methods: fast vs slow in 2026

| Method | Status |
|--------|--------|
| `push`, `pop` | ✅ Fast on packed; `pop` doesn't create holes. |
| `shift`, `unshift` | ❌ O(n) — moves every element. Avoid in hot path. |
| `splice` | ⚠ O(n) for the removed region. OK for occasional batch ops, bad in a hot loop. |
| `indexOf`, `includes` | ✅ Fast on packed; linear. |
| `slice` | ✅ Cheap; copy-on-write for the no-arg case on small packed arrays. |
| `concat`, spread `[...arr]` | ✅ Fast for packed arrays of consistent kind. |
| `Array.from` | ✅ Allocates the right elements kind given a consistent iterable. |
| `forEach`, `map`, `filter`, `reduce` | ✅ Specialized builtins per elements kind; competitive with manual `for` in Maglev/Turbofan. |
| `for…of` over an Array | ✅ On par with index-based `for` since ~Chrome 90. |

### TypedArrays for fixed-shape numeric data

For numeric data of known fixed length, a `Float64Array` is strictly faster than `PACKED_DOUBLE` Array:

✅ Kind is the constructor — no transition risk.
✅ Cannot become holey.
✅ Raw `ArrayBuffer` backing, so Turboshaft can vectorize loops where appropriate.

⚠ Fixed length unless backed by **resizable `ArrayBuffer`** (`new ArrayBuffer(initial, { maxByteLength })`, Chrome 111+, stable). For small bounded sizes, a packed-SMI Array is still ergonomic.

---

## Object.groupBy, Map.groupBy (Chrome 117, Sept 2023)

Shipped. Keys deduplicated via `SameValueZero`.

✅ Use for clarity. Performance roughly equivalent to hand-rolled `Map.set` loops; the win is that it's an engine-internal builtin and avoids polymorphism from a user function being called from arbitrary sites.

---

## Object spread `{ ...a, ...b }`

v8.dev/blog/faster-spread (Sept 2021, Victor Gomes) replaced the runtime-call implementation with a CSA fast path.

✅ Fast for objects with stable hidden classes (the common case).
❌ Slow for objects whose shapes change frequently, or that are in dictionary mode.

`Object.assign({}, a, b)` is comparably fast for the same cases.

---

## Object.freeze does NOT make access faster

Freezing changes property attributes. It does not put the object on a faster lookup path. In some scenarios it inhibits IC patterns.

✅ Use `freeze` for semantic immutability or to catch bugs.
❌ Never for performance.

---

## Quick Reference

```js
// ✅ Stable shape — initialize all properties unconditionally, in order
class SignalNode {
  constructor(value) {
    this.value = value;
    this.subscribers = null;
    this.dirty = false;
    this.lastComputed = 0;
  }
}

// ❌ Forked shape tree — conditional property
class BadNode {
  constructor(value, eager) {
    this.value = value;
    if (eager) this.eager = true;  // forks
  }
}

// ✅ Packed array, type-consistent
const ids = [];
for (let i = 0; i < n; i++) ids.push(i);

// ❌ Pre-allocated → HOLEY_SMI permanently
const ids = new Array(n);
for (let i = 0; i < n; i++) ids[i] = i;

// ✅ Clear a slot without breaking shape
obj.foo = undefined;

// ❌ Forces dictionary mode forever
delete obj.foo;

// ✅ TypedArray for fixed numeric data
const weights = new Float64Array(64);

// ✅ Private state via #field
class Computed {
  #cache = null;
  get value() { return this.#cache ??= this.#compute(); }
}
```

---

## Primary sources

- v8.dev/blog/elements-kinds — Mathias Bynens, originally Nov 2017, updated Feb 2025
- v8.dev/blog/fast-properties — hidden-class explainer, still accurate on transition mechanics
- v8.dev/blog/slack-tracking — Sept 2020
- v8.dev/blog/faster-class-features — Joyee Cheung, Apr 2022
- v8.dev/blog/fast-super — Feb 2021
- v8.dev/blog/mutable-heap-number — Victor Gomes, Feb 2025
- v8.dev/blog/maglev — Dec 2023
- v8.dev/blog/leaving-the-sea-of-nodes — Mar 2025
- v8.dev/blog/faster-spread — Sept 2021

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Performance Index** | `use_skill('performance-v8-overview')` | Need the tier model context for these patterns. |
| **Compilation** | `use_skill('performance-v8-compilation')` | Want to know when these shape-stable patterns matter — i.e., when Maglev/Turbofan actually pick them up. |
| **Stale Advice** | `use_skill('performance-v8-stale-advice')` | About to volunteer a remembered shape/class/array rule. |
| **Memory** | `use_skill('performance-v8-memory')` | Allocation patterns, when fresh allocation beats pooling. |
