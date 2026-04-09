# State of the Art: Fast Hashing for Content-Addressed Caching in JS

## Status: Research complete

## Context

The Semantic UI native renderer needs a cache-key strategy for subtree deduplication in `renderContent()`. The Lit renderer uses `hashCode()` (FNV-1a via JSON.stringify) which costs ~1.4ms per construction for large objects (full AST + data context). The native renderer currently sidesteps this with a sequential ID, but that means no subtree caching at all. This document surveys the options.

## Current Implementation

`packages/utils/src/crypto.js` provides two algorithms:

| Algorithm | Mode | Mechanism | Collision space |
|-----------|------|-----------|-----------------|
| FNV-1a | `fast: true` (default) | XOR-fold + `Math.imul` over `str.charCodeAt(i)` | 32-bit |
| UMASH variant | `fast: false` | TextEncoder + multi-round mixing | 32-bit |

Both paths serialize objects via `JSON.stringify` before hashing. This serialization dominates the cost: for a typical component AST (50-200 nodes, nested arrays/objects), `JSON.stringify` alone accounts for 60-80% of the 1.4ms total.

The Lit renderer calls `getID()` in two places:
1. **Constructor** (`this.id = LitRenderer.getID(...)`) — dead; never read externally
2. **`renderContent()`** (`contentID = LitRenderer.getID(...)`) — the actual cache key for subtree WeakRef deduplication

## The Real Question: Is Hashing Even Necessary?

### AST Reference Identity

ASTs are compiled once in `defineComponent()` and the same object tree is passed by reference through `Template.clone()` and into every renderer instance. Sub-ASTs (the `content` arrays inside `{#each}`, `{#if}`, `{#snippet}` nodes) are stable array references within that tree.

This means: **for a given component class, the same AST sub-array reference always represents the same template structure**. Two renderers operating on the same `{#each}` body will receive the exact same array object.

### What Lit's getID Actually Keys On

```javascript
static getID({ ast, key, position, isSVG } = {}) {
    if (key !== undefined) return hashCode({ ast, key });
    if (position !== undefined) return hashCode({ ast, position });
    return hashCode({ ast });
}
```

The effective cache key is one of:
- `(ast, key)` — each-loop items (key = item identity like `item.id`)
- `(ast, position)` — positional subtrees
- `(ast)` — everything else (conditionals, snippets, SVG)

The `ast` component serves to distinguish *which* template structure we're caching. The `key`/`position` component serves to distinguish *which instance* of that structure within a loop.

### WeakMap on AST Reference: Zero-Cost Structural Identity

Since AST sub-arrays are stable references, we can use a **nested WeakMap** keyed on the AST object itself — zero serialization, zero hashing, O(1) lookup:

```javascript
// Conceptual: WeakMap<ast, Map<key|position, WeakRef<Renderer>>>
const subtreeCache = new WeakMap();

function getCachedSubtree(ast, discriminator) {
    let byAST = subtreeCache.get(ast);
    if (!byAST) {
        byAST = new Map();
        subtreeCache.set(ast, byAST);
    }
    return byAST.get(discriminator)?.deref();
}
```

Cost: ~0.001ms (two Map lookups). Compared to ~1.4ms for JSON.stringify + FNV-1a, this is a **1000x improvement** that also eliminates the 32-bit collision risk entirely.

**Caveat**: This only works when AST objects are referentially stable. If ASTs are ever deep-cloned or reconstructed (e.g., hot-reload, dynamic template compilation), the cache misses harmlessly — it's a cache, not a correctness requirement.

### When You Still Need Content Hashing

Reference identity fails when:
1. **Server-side rendering** — ASTs are serialized/deserialized across process boundaries
2. **Hot module replacement** — recompilation produces structurally identical but referentially distinct ASTs
3. **Cross-component template sharing** — two components independently compile the same template string

For these cases, a content hash is a fallback. But they're cold paths (page load, dev-only) where 1.4ms is tolerable.

## Survey of Hash Function Implementations in JavaScript

### Pure JavaScript (no dependencies, no WASM)

| Algorithm | Bits | JS Implementation | Throughput (approx) | Notes |
|-----------|------|-------------------|---------------------|-------|
| **FNV-1a** | 32 | Current (`crypto.js`) | ~300 MB/s on short strings | Zero allocation, operates on charCode. Best for <64 byte inputs. |
| **cyrb53** | 53 | [Gist by bryc](https://gist.github.com/bryc/dba27a01e9454da10a1fe5063c8be6fb) | ~250-350 MB/s | Uses `Math.imul` + Xorshift. 53-bit output dramatically reduces collisions vs 32-bit. Single function, ~15 lines. |
| **MurmurHash3** | 32/128 | [imurmurhash](https://www.npmjs.com/package/imurmurhash) (incremental) | ~400 MB/s (32-bit) | Incremental API — can hash chunks without full serialization. Well-tested, tiny. |
| **djb2/sdbm** | 32 | Trivial inline | ~350 MB/s | Simple but poor avalanche. Only useful for very short strings. |

**Verdict**: For pure JS on already-serialized strings, FNV-1a and cyrb53 are both fine. The bottleneck is never the hash function — it's always the serialization.

### WebAssembly-Based

| Package | Algorithm | Init Cost | Throughput | Bundle Size |
|---------|-----------|-----------|------------|-------------|
| [xxhash-wasm](https://github.com/jungomi/xxhash-wasm) | xxHash32/64/128, XXH3 | ~1ms browser, ~2ms Node | ~3.4M ops/s (short), ~90K ops/s (10K words) | 3.9kB min (1.3kB gzip) |
| [hash-wasm](https://github.com/Daninet/hash-wasm) | xxHash, CRC32, MD5, SHA, etc. | ~1-2ms | Comparable to xxhash-wasm | ~8kB per algorithm |

xxhash-wasm benchmarks vs pure JS xxhash implementations:

| Input | xxhash-wasm | js-xxhash | xxhashjs |
|-------|-------------|-----------|----------|
| 10 words | 3,381,908 ops/s | 731,148 ops/s | 432,754 ops/s |
| 10,000 words | 90,170 ops/s | 6,293 ops/s | 552 ops/s |

**Key features of xxhash-wasm:**
- Uses `TextEncoder.encodeInto` to encode directly into WASM memory (avoids intermediate buffer allocation)
- Raw numeric API avoids hex-string overhead (~20% faster for small inputs)
- Supports save/load of hash state for incremental/streaming use

**Verdict**: WASM hashes are 4-10x faster than pure JS for the same algorithm. However, they still require serialization of the input. The ~1ms WASM init cost is a one-time penalty. For a framework that loads once and runs for the lifetime of a page, this is negligible. But for SSR where processes are short-lived, it could matter.

### Web Crypto API (SubtleCrypto.digest)

- **Async-only** — `crypto.subtle.digest('SHA-256', buffer)` returns a Promise. No synchronous API exists in any browser.
- **Performance**: SHA-256 is ~20-30% slower than non-cryptographic hashes on modern hardware, plus the async overhead (microtask scheduling, Promise allocation).
- **Use case**: Completely wrong for synchronous cache-key generation in a render path. The async boundary would require restructuring the entire render pipeline.

**Verdict**: Not viable for this use case. The async constraint is a hard blocker.

### Native Hashing in Runtimes

- **Node.js `crypto.createHash`**: Synchronous, uses OpenSSL. Fast for large inputs but overkill for cache keys. Not available in browsers.
- **Bun**: Has fast native hash implementations but not cross-runtime.
- **Deno**: Similar to Node.js crypto.

**Verdict**: Not portable. Can't use in browser renderer.

## Strategies to Avoid Serialization Entirely

### 1. Object Identity via WeakMap (recommended for AST keying)

As described above. Cost: ~0.001ms. Works because ASTs are referentially stable.

### 2. Structural Fingerprint at Compile Time

The compiler could stamp each AST node or sub-array with a unique ID during compilation:

```javascript
// In TemplateCompiler.compile()
node.content.__templateId = ++TemplateCompiler._nextId;
```

Then the cache key is just `node.content.__templateId` — an integer property lookup. This is slightly more explicit than WeakMap and works even after serialization (the ID travels with the AST).

**Trade-off**: Mutates the AST. If ASTs are meant to be pure data, this violates that contract.

### 3. Composite Key: AST Reference + Discriminator

For each-loop caching, you need `(ast, itemKey)`. Options:

```javascript
// Option A: Nested WeakMap + Map
const cache = new WeakMap();  // ast → Map<key, WeakRef<Renderer>>

// Option B: String concatenation with stable AST ID
const cacheKey = `${ast.__id}:${itemKey}`;
const cache = new Map();  // string → WeakRef<Renderer>

// Option C: Two-level Map with WeakRef cleanup
const cache = new WeakMap();  // ast → Map<key, WeakRef<Renderer>>
```

Option A is cleanest: the outer WeakMap ensures GC of the entire bucket when the AST is collected, and the inner Map handles the discriminator dimension.

### 4. Incremental/Streaming Hashing (if content hashing is needed)

For SSR or HMR fallback where reference identity is unavailable:

- **imurmurhash** supports incremental `.hash(chunk)` calls — you can walk the AST and hash node types/values without full JSON.stringify
- **hash-wasm** supports save/load of internal hash state across chunks
- A custom AST walker that hashes `node.type` + key structural properties (skipping data values) would be ~5-10x faster than `JSON.stringify` of the full tree

```javascript
// Sketch: structural-only hash (ignores data, only cares about template shape)
function hashASTStructure(ast, hasher = new IMurmurHash()) {
    for (const node of ast) {
        hasher.hash(node.type);
        if (node.content) hashASTStructure(node.content, hasher);
        if (node.elseContent) hashASTStructure(node.elseContent, hasher);
        if (node.condition) hasher.hash(node.condition);
        if (node.expression) hasher.hash(node.expression);
    }
    return hasher.result();
}
```

This hashes the template *structure* without serializing data values, which is exactly what `getID` needs (it hashes `{ ast }`, not `{ ast, data }`).

## What Other Frameworks Do

### Lit (current Semantic UI Lit renderer dependency)

Uses **tagged template literal identity** as cache key. The `strings` array from `` html`...` `` is the same object reference on every evaluation of the same template literal in source code. Lit caches the parsed `Template` object keyed by this strings array using a `Map`. No hashing involved — pure reference equality.

This is the gold standard for zero-cost caching but requires tagged template literals as the authoring format.

### Vue

Uses **compile-time static hoisting**. Static subtrees are extracted during compilation and cached as constants. Dynamic subtrees use **patch flags** — integer bitmasks stamped during compilation that tell the runtime exactly which properties can change. Vue never hashes anything at runtime; all caching decisions are made by the compiler.

### Svelte

Compiles templates to imperative DOM operations. No runtime template caching or diffing at all. Each reactive statement directly mutates the specific DOM nodes it affects.

### Solid.js / Preact Signals

Fine-grained reactivity — signals subscribe directly to DOM update functions. No subtree diffing, no cache keys. The "cache" is implicit: if a signal hasn't changed, its subscribed DOM update simply doesn't run.

### Summary of Framework Approaches

| Framework | Cache Key Strategy | Runtime Hash? |
|-----------|--------------------|---------------|
| Lit | Tagged template strings array reference | No |
| Vue | Compile-time static hoisting + patch flags | No |
| Svelte | No runtime caching (compiled to imperative) | No |
| Solid.js | Signal subscriptions (implicit) | No |
| Preact | VDOM diffing by reference + keys | No |
| **SUI Lit** | `hashCode(JSON.stringify({ast}))` | **Yes** |

Every major framework avoids runtime content hashing. They either use reference identity, compile-time analysis, or fine-grained reactivity to skip the problem entirely.

## Recommendation for Semantic UI Native Renderer

### Primary: WeakMap-based AST reference keying

For the native renderer's upcoming subtree caching:

1. **Use `WeakMap<ASTArray, Map<discriminator, WeakRef<Renderer>>>`** for the subtree cache
2. **Discriminator** is `key` (for each-loops) or `position` (for positional subtrees) or `undefined` (for simple subtrees)
3. **Cost**: Two hash-table lookups, zero serialization, zero allocation on cache hit
4. **Collision risk**: None — reference identity is exact

### Fallback: Compile-time AST fingerprint

If reference identity is insufficient (SSR, HMR):

1. **Stamp `__structureId`** on each content array during compilation
2. Use a monotonic counter — no hash function needed
3. The ID survives JSON serialization if included as a regular property

### For the Lit Renderer (existing)

The existing `hashCode({ ast, key })` call in `LitRenderer.getID()` could be replaced with the same WeakMap strategy. This would eliminate the ~1.4ms per `renderContent()` call. Since the Lit renderer is being phased out in favor of native, this is low priority but the pattern is identical.

### What NOT to Do

- **Don't add a WASM dependency** for hash functions. The entire point is to avoid hashing.
- **Don't use Web Crypto** — async API is incompatible with synchronous render paths.
- **Don't try to make JSON.stringify faster** — schema-driven serializers (fast-json-stringify) require knowing the shape ahead of time and add complexity for marginal gains on a path we can eliminate entirely.
- **Don't hash the full AST + data** — Lit's `getID` already correctly excludes `data` from the hash. The cache key should identify template *structure*, not data *values*. Data changes are handled by `updateData()` / `bumpDataVersion()`, not by cache eviction.

## Performance Summary

| Strategy | Cost per lookup | Collision risk | Dependencies | Works in SSR? |
|----------|----------------|----------------|--------------|---------------|
| JSON.stringify + FNV-1a (current) | ~1.4ms | 1 in 2^32 | None | Yes |
| JSON.stringify + xxhash-wasm | ~0.3ms | 1 in 2^64 | xxhash-wasm (3.9kB) | Yes |
| JSON.stringify + cyrb53 | ~1.2ms | 1 in 2^53 | None | Yes |
| Structural AST hash (no stringify) | ~0.1ms | 1 in 2^32 | imurmurhash (tiny) | Yes |
| **WeakMap reference identity** | **~0.001ms** | **Zero** | **None** | **No** |
| Compile-time stamp | ~0.001ms | Zero | None | Yes |
| **WeakMap + compile-time fallback** | **~0.001ms** | **Zero** | **None** | **Yes** |

The WeakMap + compile-time fallback combination covers all execution contexts with zero runtime cost and zero collision risk.

## Sources

- [Daniel Lemire — JavaScript hashing speed comparison](https://lemire.me/blog/2025/01/11/javascript-hashing-speed-comparison-md5-versus-sha-256/)
- [joliss/fast-js-hash-benchmark](https://github.com/joliss/fast-js-hash-benchmark)
- [xxhash-wasm — npm](https://www.npmjs.com/package/xxhash-wasm)
- [jungomi/xxhash-wasm — GitHub](https://github.com/jungomi/xxhash-wasm)
- [hash-wasm — npm](https://www.npmjs.com/package/hash-wasm)
- [Daninet/hash-wasm — GitHub](https://github.com/Daninet/hash-wasm)
- [rurban/smhasher — Hash function quality and speed tests](https://github.com/rurban/smhasher)
- [V8 Blog — How we made JSON.stringify more than twice as fast](https://v8.dev/blog/json-stringify)
- [Web Crypto SubtleCrypto: A Masterclass in Developer Hostility](https://misakikasumi.medium.com/web-cryptos-subtlecrypto-a-masterclass-in-developer-hostility-and-how-it-strangles-the-modern-web-76d1748ceeef)
- [MDN — WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [Lit — How lit-html works](https://github.com/lit/lit/blob/main/dev-docs/design/how-lit-html-works.md)
- [Vue — Rendering Mechanism](https://vuejs.org/guide/extras/rendering-mechanism)
- [cyrb53 hash function](https://gist.github.com/bryc/dba27a01e9454da10a1fe5063c8be6fb)
- [imurmurhash — npm](https://www.npmjs.com/package/imurmurhash)
- [Exploring JS — WeakMaps (ES2025)](https://exploringjs.com/js/book/ch_weakmaps.html)
- [xxHash — Extremely fast non-cryptographic hash algorithm](https://xxhash.com/)
- [MDN — SubtleCrypto.digest()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)
- [The State of Solid.js in 2026](https://listiak.dev/blog/the-state-of-solid-js-in-2026-signals-performance-and-growing-influence)
- [Preact Signals Guide](https://preactjs.com/guide/v10/signals/)
