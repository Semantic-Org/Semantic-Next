---
title: V8 String Performance
description: V8 string representations (SeqString, ConsString, SlicedString, ThinString, ExternalString) and what operations force flattening. Covers cons string concatenation, when JSON.stringify and other builtins flatten, template literals vs +, string internalization, modern methods (.at, .includes, .startsWith, .replaceAll, .isWellFormed), the Chrome 138 Dragonbox Number.toString speedup that also accelerates JSON.stringify >2x, and Blink ExternalString for DOM source text. Load for any string-building, JSON, or text-manipulation perf question.
keywords: [string representation, SeqString, ConsString, SlicedString, ThinString, ExternalString, string flatten, string interning, template literal, JSON.stringify, JSON parse, Dragonbox, Number.toString, String.at, String.includes, String.startsWith, String.replaceAll, isWellFormed, tagged template, className]
audience: authoring
skill: performance-v8-strings
type: skill
---

# V8 String Performance

> **Skill:** `performance-v8-strings`
> **Purpose:** Why string building isn't always allocating, why some operations suddenly become expensive, and how to keep JSON.stringify on its fast path.

**Golden rule: Concatenation defers; reading flattens. Don't interleave building and reading the same string in a hot loop.**

Current as of Chrome 138, May 2026.

---

## Internal representations

| Form | Description |
|------|-------------|
| `SeqOneByteString` | Latin-1 (`<= U+00FF`), 1 byte per char, contiguous. |
| `SeqTwoByteString` | UTF-16, 2 bytes per char, contiguous. |
| `ConsString` | Tree node with two child strings. Concatenation is O(1) by *deferring* the actual copy. Used for `a + b`, template literals with substitutions, `Array.prototype.join`. |
| `SlicedString` | Substring as `(parent, offset, length)`. `s.substring(...)` and `s.slice(...)` often produce these. |
| `ExternalString` | String body lives outside the V8 heap. Used by Blink for HTML source text, IDL strings — e.g., `innerHTML.toString()`. |
| `ThinString` | Redirect to an interned string. Created when a string is internalized after the fact. |

`length` is stored on the cons node and is O(1) to read. Almost any operation that needs to look at the *contents* — comparison, indexOf, regex match, JSON.stringify, hashing for use as a property key — forces a **flatten**, allocating a contiguous `SeqString` and copying.

---

## When cons strings flatten

The Chrome 138 JSON.stringify rewrite post (Patrick Thier, v8.dev/blog/json-stringify, Aug 2025) calls this out explicitly:

> "Internal V8 string representations like `ConsString` can require memory allocation to be flattened before they can be serialized. The fast path avoids any operation that might trigger such allocations and works best with simple, sequential strings."

V8 builtin fast paths assume flat strings and bail out otherwise.

✅ Build a string with repeated `+` or `join`. Cons tree flattens once at the consumer.
✅ Defer reads until you're done building.

❌ Interleave builds and reads in a loop:

```js
// ❌ Flattens on every iteration
let s = '';
for (const x of items) {
  s = s + x.label;
  if (s.indexOf('error') >= 0) break;  // forces flatten
}
```

```js
// ✅ Build first, read once
const parts = [];
for (const x of items) parts.push(x.label);
const s = parts.join('');
if (s.indexOf('error') >= 0) { /* … */ }
```

---

## Template literals vs `+`

For untagged templates, V8 lowers `` `a${x}b` `` to the same bytecode as `'a' + x + 'b'`. Equivalent in speed.

✅ Use whichever reads best.

### Tagged templates

Tagged template literals call the tag function with a frozen array of strings. **The array identity is cached per call site** — same array reused on every invocation of the same template expression.

✅ Exploitable for memoization in framework DSLs: `html\`<div>${x}</div>\`` can use the strings-array identity as a cache key without re-hashing.

---

## Internalization

V8 interns (canonicalizes to a `ThinString`) all property-name strings and string literals from source. Two `obj.foo` accesses reference the same internalized string.

❌ V8 does **not** automatically intern runtime-built strings.

⚠ If you need pointer-equality fast comparison of identical strings built from data, you must manage it yourself via a `Map<string, string>`. There is no `String.intern()`.

✅ Almost never the right move. Ordinary string comparison is O(n) but n is short and cache-friendly.

---

## Modern string methods

All shipped, all fast in Maglev/Turbofan:

| Method | Replaces | Notes |
|--------|----------|-------|
| `s.at(i)` | `s[i]` with manual negative-index handling | Bounds-checked, supports negative indices |
| `s.includes(sub)` | `s.indexOf(sub) !== -1` | Comparable speed |
| `s.startsWith(p)` | `s.indexOf(p) === 0` or substring + compare | Faster — no substring allocation |
| `s.endsWith(p)` | substring + compare | Same |
| `s.replaceAll(needle, rep)` | `s.replace(/needle/g, rep)` | Non-regex literal-search variant when given a string needle. Chrome 85+ |
| `s.isWellFormed()` / `.toWellFormed()` | Manual lone-surrogate checks | Chrome 111+ |

✅ No performance reason left to reach for older equivalents.

---

## Number-to-string and JSON.stringify (Chrome 138, Aug 2025)

V8 replaced Grisu3 with **Dragonbox** for `Number.prototype.toString` (Patrick Thier, v8.dev/blog/json-stringify, Aug 2025). The change affects every implicit conversion: `${someNumber}`, `String(n)`, `n.toString()`, JSON.stringify of objects with numeric fields.

**`JSON.stringify` itself is now more than 2× faster** on the fast path.

### Conditions for the JSON.stringify fast path

✅ No `replacer` argument.
✅ No `space`/`gap` argument (not pretty-printing).
✅ Plain data objects without a custom `toJSON()`.
✅ No array-like indexed properties on non-array objects.
✅ Simple sequential (flat) strings as values.

### fast-json-iterable flag

V8 sets a `fast-json-iterable` flag on hidden classes once an object has been successfully serialized via the fast path. Subsequent serializations of objects with the same hidden class can skip per-key Symbol/enumerability/escape checks.

✅ Stable object shapes across instances of the same record type pay off here too — another reason to standardize constructors.

❌ Pretty-printing or a replacer kicks you off the fast path.

✅ For large payloads where you control the schema and need streaming, hand-written serialization can be faster. For typical state-snapshot use, the fast path is fine.

---

## DOM-source strings are ExternalStrings

When you read `innerHTML`, `nodeValue`, `localName`, Blink hands V8 an `ExternalString` pointing to Blink-owned memory.

✅ Reading in JS is cheap.
✅ Passing back into another DOM IDL call is cheap.
⚠ Operating on it (regex, indexOf, building substrings) typically materializes contents into a V8-owned string.

Rarely a hot-path concern but explains some surprising allocation profiles in heap snapshots.

---

## Quick Reference

```js
// ✅ Build then read — single flatten at the end
const parts = [];
for (const cls of classes) parts.push(cls);
element.className = parts.join(' ');

// ✅ Template literal — same speed as +
const id = `row-${index}`;

// ✅ Tagged template — array identity cached at call site
html`<div>${x}</div>`;

// ✅ Modern methods
if (s.startsWith('https://')) { /* … */ }
if (s.includes('error')) { /* … */ }

// ✅ JSON fast path
JSON.stringify(plainData);  // no replacer, no space, plain objects

// ❌ Off the fast path
JSON.stringify(data, replacer, 2);
```

---

## Primary sources

- v8.dev/blog/json-stringify — Patrick Thier, Aug 2025 (Dragonbox + JSON fast path)
- v8.dev/blog/cons-strings — historical, still describes the model accurately
- v8.dev/blog/non-backtracking-regexp — Jan 2021

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Performance Index** | `use_skill('performance-v8-overview')` | Need the broader perf model. |
| **Object Model** | `use_skill('performance-v8-object-model')` | The "stable shapes for JSON.stringify fast path" point ties back to constructor patterns. |
| **DOM** | `use_skill('performance-v8-dom')` | Building className strings; reading ExternalString DOM source text. |
| **Recent Features** | `use_skill('performance-v8-recent-features')` | For `RegExp.escape` and regex changes that affect string-with-regex code. |
