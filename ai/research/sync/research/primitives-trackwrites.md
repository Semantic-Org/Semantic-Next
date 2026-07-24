# trackWrites / mutate — mutation capture, clone/equality/id utils

The mutation-capture primitive is `trackWrites` in /home/jack/semantic/next/packages/utils/src/objects.js:94-284 (note: the `returnPaths` option and `pruneChildPaths` are UNCOMMITTED working-tree changes on branch observe-writes, alongside new tests in packages/utils/test/objects.test.js:376-448). It runs a synchronous callback against a value and reports whether the callback changed it, via two strategies: snapshot (deep clone before, deep isEqual after, callback sees the real object) and proxy (lazy deep Proxy wrapping, cost scales with writes). It records a boolean `changed`, optionally pruned dot-joined path strings (`returnPaths`), and an optional per-write `onWrite` callback — it never records old values, new values, or patch objects. `Signal.mutate` (packages/reactivity/src/signal.js:138-158) consumes it purely as a dirty-detector: changed triggers a whole-signal `notify()` that invalidates every subscriber via one Dependency — there is no per-key signal notification. The utils package has strong clone/equal/get/hash primitives but no path-set, no positional array diff, and no patch/serialization utilities.

## APIs

### trackWrites(value, callback, options?)

Signature: trackWrites(value, callback, { strategy = 'auto', onWrite, returnPaths = false, clone: cloneFunction = clone, equality = isEqual } = {}) — objects.js:94-100. RETURNS { changed: boolean, result: <callback return, deep-unwrapped of proxies> } (objects.js:283), or { changed, result, paths: string[] } when returnPaths took the proxy path (objects.js:280-282). `paths` are dot-joined strings in insertion order, deduped (Set), with child paths pruned when a parent was also written (pruneChildPaths, objects.js:69-87; comment at :67-68 says explicitly this targets mongo-style path-conflict stores). NO old values, NO new values, NO patch ops — new values are recoverable via get(target, path) after the call (test objects.test.js:410-417), old values are never captured anywhere.

### trackWrites — strategy selection ('auto' heuristic)

objects.js:101-104: useProxy = (strategy === 'proxy' || (strategy === 'auto' && (onWrite !== undefined || returnPaths || overBudget(value)))) && isTrackable(value) && !Object.isFrozen(value). isTrackable = isArray || isPlainObject (objects.js:40). overBudget walks the value counting own keys recursively for arrays/plain objects and adding .size (without walking entries) for Map/Set, against autoBudget = 512 (objects.js:44-65); cycles burn the budget and land on proxy. Anything not proxy-eligible (small, primitive, Map/Set root, frozen root, explicit strategy: 'snapshot') takes the snapshot path: before = cloneFunction(value); result = callback(value); changed = !equality(before, value) (objects.js:106-110) — callback receives the REAL object.

### trackWrites — what the proxy observes

Traps: set (objects.js:188-202), deleteProperty (:203-215), defineProperty (:216-232); get only wraps/expires (:177-187). Nested plain objects and arrays are wrapped lazily on read with WeakMap identity (cycles resolve to the same wrapper, test :206-212). No-op suppression: writing an existing value via Object.is is not a write (:196), brand-new own key is a write even when value is undefined (:195-196), delete of absent or inherited key is not a write (:207-211), defineProperty mirrors set/delete (:223-226). Array methods route through traps: push records just the new index path (verified: ['3']); splice is noisy (verified: ['items.0','items.1','items.length']). Exotics — Map, Set, Date, RegExp, class instances — pass through RAW and are change-detected by snapshot-on-first-read + deep-compare at the end (reportExotic :128-136, final loop :272-279); frozen objects also pass raw + snapshot (:243-247). Fresh containers written back or returned are deep-scanned to unwrap smuggled wrappers so the raw graph never stores a proxy (unwrapDeep :154-174). Proxies EXPIRE when the callback returns — any later read/write throws (:120-123, :263, tests :321-342). Symbol-keyed writes count as changed but are skipped in pathLog (:144-147, test :440-447).

### trackWrites — onWrite

onWrite(pathArray, rawObject, key) fires synchronously per non-no-op write (markWrite, objects.js:138-149). pathArray is segments from root (may contain symbols — only pathLog filters them). Fires AFTER the write is applied (set trap assigns at :197 before markWrite at :199), so the old value is not observable even here. Passing onWrite forces the proxy strategy under 'auto' regardless of size (test :54-61).

### Signal.mutate(mutationFn)

packages/reactivity/src/signal.js:138-158. Calls trackWrites(this.currentValue, mutationFn, { clone: this.cloneFunction }) — default 'auto' strategy, no onWrite, no returnPaths, so paths are NOT collected on the signal path today. If the callback returns a value !== undefined && !== currentValue, it's stored via this.value = result (equality-gated set, signal.js:79-84 → notify). If it returns the same mutated reference, dev-mode warns that this bypasses change detection (:150-154) and falls through. Otherwise, changed === true → this.notify(). Detection equality is deliberately the default isEqual, not this.equality (comment :135-137 — precision question, not safety question). mutate returns undefined to callers. Clone is Signal.clone = (value) => clone(value, { preserveNonCloneable: true }) (signal.js:28), which is what makes class instances safe (see gotchas). toggle/increment/decrement/now are built on mutate (:224-249).

### Signal reactivity granularity

notify() (signal.js:95-100) bumps this.version (monotonic counter, :56-57) and calls this.dependency.changed() — ONE Dependency per signal (packages/reactivity/src/dependency.js:28-43) that invalidates every subscriber Reaction wholesale. There is NO per-key notification at the signal layer. Per-key isolation (FGR) exists separately at the templating layer (per-key descriptors/Proxy on template data contexts, shipped PR #183) — it re-reads signals, it does not receive key-level events from them. Other relevant Signal surface: peek()/raw() (:102-108, untracked reads), clone() (:112-115, tracked detached deep copy), version, static id resolver = item.id ?? item._id ?? item.hash ?? item.key (:29), and id-based item helpers getItem/getItemIndex/setItemProperty/replaceItem/removeItem (:266-347) which notify whole-signal.

### clone(src, { preserveDOM, preserveNonCloneable })

packages/utils/src/cloning.js:125 (cloneValue :61-123). Deep clone handling Date, RegExp, Array, Map, Set, binary (via structuredClone), DOM nodes (cloneNode or pass-through), cycles (WeakMap seen). preserveNonCloneable: true returns class instances BY REFERENCE; default false flattens them to plain objects (loses prototype). Functions pass by reference. deepFreeze at cloning.js:53 (recursive freeze of arrays/plain objects only).

### isEqual(a, b, options)

packages/utils/src/equality.js:15-121. Deep structural equality with options { loose, ignoreKeys, deepIgnore, partial }. Prototype-sensitive (getProto(a) !== getProto(b) → false, :41). Maps compared by key+deep value, Set MEMBERS by reference only (:65-71), Dates by getTime, TypedArrays elementwise, objects with custom valueOf/toString compared by that scalar (:89-94). `partial: true` gives subset matching — useful for rebase checks.

### get(obj, path)

packages/utils/src/objects.js:491-554. Dot-path access with bracket-index support ('items[1].name') and dotted-key fallback (obj['a.b.c'], combined-key probing). trackWrites paths are designed to resolve through it (test objects.test.js:410-417). There is NO corresponding set-by-path utility anywhere in packages/utils/src (grep-verified: no setPath/deepSet/exported set).

### id generation / hashing

packages/utils/src/crypto.js: generateID(seed = getRandomSeed()) :143-145 — crypto-random 32-bit seed rendered via prettifyHash (base-36-ish, ~6-7 chars). NOT a UUID; collision domain is 32 bits, fine for client temp-ids, not for global ids. hashCode(input, { prettify, seed, fast }) :43-48 — FNV-1a default, UMASH with { fast: false }; plain objects are JSON.stringify'd internally (the only serialization-shaped code in utils). getRandomSeed :130, tokenize :9.

### merge / structural helpers

objects.js: extend :291 (shallow, accessor-preserving), deepExtend :319 (deep merge, __proto__-guarded, options preserveNonCloneable/preserveDOM), assignInPlace :399 (sync target to source in place, { preserveExistingKeys, preserveGetters, returnChanged } — returnChanged gives a cheap shallow dirty bit), pick :457, onlyKeys :568, filterObject :26, mapObject :33, reverseKeys :588, proxyObject :559, hasProperty = Object.hasOwn :581. arrays.js: difference :388 and intersection :369 (set-style, not positional), unique :13, where :200, findIndex :85, remove :110, sortBy :258, groupBy :299, moveItem :315. There is NO diff/patch generator (no JSON-patch, no positional array diff) in the package.

### bench coverage

packages/reactivity/bench/tachometer/bench-signal.js:316-343 — mutate-grid-row-edit-600 (1000-row list, proxy side, O(writes) guard) and mutate-doc-nested-200k (small doc, snapshot side ~1.1µs/op incl. budget walk). No trackWrites bench in packages/utils/bench/objects.bench.js (covers deepExtend/get/weightedObjectSearch only). Rationale history: commits bdb93da4cc → 3ae59132a4 → 32ec4907c9 (observeWrites → generalized → scoped trackWrites), PR #242.

## Integration points
- trackWrites(value, fn, { returnPaths: true, clone: v => clone(v, { preserveNonCloneable: true }) }) is the direct write-set capture call: changed + pruned dot-paths, then map paths to new values via get(target, path) (objects.js:94, :280-282; get :491). Old values for rollback must come from your own pre-clone — nothing in the API captures them.
- onWrite(pathArray, rawObject, key) (objects.js:148) is the streaming hook — a DB layer can build a richer write log (e.g. capture per-write timestamps or intercept object identity) without waiting for the return value. Note it fires post-write, so pair with a pre-clone if old values are needed.
- Signal.mutate (signal.js:139-141) currently passes only { clone } to trackWrites. The natural plug-in point for a client DB is extending this call (or a subclass override) to thread onWrite/returnPaths through, turning every signal mutation into a captured write set before notify() fires. mutate's existing result-vs-changed branching (:145-157) already separates replace-writes from in-place writes.
- Signal.version (signal.js:56-57, :96) is a monotonic per-signal change counter explicitly commented 'for debugging / external-store' — usable as a local lamport-ish stamp for optimistic-write bookkeeping.
- Signal.id static (signal.js:29: id ?? _id ?? hash ?? key) plus the id-based helpers (getItemIndex/setItemProperty/replaceItem/removeItem, :266-347) define the framework's record-identity convention a DB layer should adopt.
- pruneChildPaths (objects.js:69-87) is already shaped for building store update documents — the in-code comment (:67-68) names mongo path-conflict semantics as the design driver, so paths from returnPaths can feed $set documents directly.
- clone (cloning.js:125) + isEqual with { partial } (equality.js:15) are the rebase/rollback primitives: snapshot before optimistic apply, partial-compare against the authoritative response on rebase.
- generateID (crypto.js:143) for client temp-ids pending server assignment, with the 32-bit collision caveat.
- Gap to fill: no set-by-path utility exists (only get, objects.js:491), so applying a server rebase per-path needs a new helper. Also no positional array diff — index-based paths ('items.1.name') are the only array addressing.

## Gotchas
- UNCOMMITTED: returnPaths, pathLog, and pruneChildPaths exist only in the working tree of packages/utils/src/objects.js (and tests) on branch observe-writes — git diff confirms; last commit 8ca1e3bcc5 lacks them.
- trackWrites records paths but no values: no old value, no new value, no add/remove/replace distinction (a delete and a set both yield the bare path). Rollback data must be captured separately.
- Map/Set/Date/class-instance mutations are a write-set blind spot: they flip changed=true via snapshot compare but produce NO paths and NO onWrite (verified: Map.set under returnPaths → changed:true, paths:[]). Exotic detection also depends on the exotic being READ before any plain write occurred (reportExotic short-circuits once written, objects.js:128-136) — changed stays correct, but ordering subtleties exist.
- Default clone causes a false-positive changed for class instances under the proxy strategy (verified: read-only access to a class instance → changed:true with default clone, false with preserveNonCloneable clone). Signal.mutate is safe because Signal.clone passes preserveNonCloneable: true — a DB layer calling trackWrites directly must do the same.
- Sync-only contract: tracked proxies expire when the callback returns and throw on any later access (objects.js:120-123). An async callback returns a Promise as result (verified) — Signal.mutate would then store the Promise as the value. No await inside mutation callbacks.
- Strategy divergence on out-of-band writes: snapshot detects closure writes to shared references that never touch the callback value (test objects.test.js:122-128); proxy only sees trap'd writes. 'auto' switching on size means the same code can behave differently across dataset sizes.
- returnPaths/onWrite force proxy under 'auto', but only when the root is trackable (array/plain object) and not frozen — otherwise it silently falls back to snapshot and the result has NO paths key (paths === undefined, test :425-431). Map roots, primitives, frozen roots all hit this.
- Array paths are positional and method-noisy: push yields just the new index (verified ['3']), but splice yields shifted indices + trailing delete + length (verified ['items.0','items.1','items.length']); sort yields every moved index. Index paths are fragile against server-side reordering — id-based addressing needs to be layered on top.
- Symbol-keyed writes count toward changed but are silently absent from paths (objects.js:144-147) — they DO reach onWrite with the symbol in the path array.
- Signal.mutate footgun: returning the same reference that was mutated in place bypasses change detection entirely (dev-only console.warn, signal.js:150-154). Mutation callbacks should return undefined or a brand-new value.
- Signal.mutate notification is whole-signal, not per-key: one Dependency, all subscribers invalidated (dependency.js:28-43). Do not assume key-level reactivity from the signal layer.
- A lone non-writable + non-configurable property on an unfrozen parent is unsupported under the proxy strategy and throws on read (proxy invariant, comment objects.js:238-242); fully frozen objects are handled (pass raw + snapshot).
- autoBudget is 512 keys (objects.js:64) and is deliberately conservative because mutate runs in loops — large-ish documents flip to proxy earlier than you might expect, and the budget walk itself is paid on every 'auto' call.
- isEqual compares Set members by reference only and is prototype-sensitive (equality.js:41, :65-71) — relevant if it's reused for rebase comparison of deserialized (prototype-less or re-hydrated) server data.
