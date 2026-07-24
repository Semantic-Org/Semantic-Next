# Reactivity package — Signal, Reaction, Dependency, flush semantics

The reactivity package (packages/reactivity/src, ~690 lines) is a Tracker-inspired pull-then-push system: Signal wraps a Dependency (subscriber Set), Reaction is the tracking computation, and a static Scheduler batches invalidated reactions into a microtask flush with Set-dedup. Signal invalidation is ALWAYS whole-signal — every mutation helper (push, splice, setItemProperty, etc.) calls notify() which invalidates every subscriber of that signal; there is no per-key granularity at the Signal layer. Fine-grained per-key/per-field invalidation exists one layer up in the renderer: ReactiveDataContext (packages/renderer/src/engines/native/reactive-context.js) composes raw Dependency instances per key (and per item FIELD in as-mode each blocks), and the each-block reconcile diffs a per-record shallow snapshot to fire only changed-field deps — so doc[5].title mutation re-runs the each block's one reconcile reaction (O(n) shallow diff), then re-fires only the bindings reading title on record 5. There is no batch(), transaction, serialization, or persistence API anywhere in reactivity; batching is implicit microtask coalescing, and the only sync/untracked controls are flush(), nonreactive(), and peek()/raw(). The closest thing to a write-log hook is utils' trackWrites (packages/utils/src/objects.js:94, backing Signal.mutate), which supports onWrite callbacks and mongo-style dot-path collection (returnPaths with parent-path pruning explicitly designed around mongo path-conflict rules).

## APIs

### Signal (class)

packages/reactivity/src/signal.js:18. new Signal(initialValue, { safety='reference'|'clone'|'none', clone=Signal.clone, equality=isEqual (deep, from utils/equality.js:15; safety:'none' forces returnsFalse = always notify), id=Signal.id, version=0, context }). Statics overridable: Signal.equality=isEqual (signal.js:27), Signal.clone (deep clone w/ preserveNonCloneable, :28), Signal.id = item.id ?? item._id ?? item.hash ?? item.key (:29, already minimongo-friendly), Signal.safety='reference' (:30). Factory: signal(initialValue, options) at helpers/create.js:4. Cross-realm instanceof via Symbol.for('semantic-ui/Signal') (helpers/identity.js:3).

### Signal.get/set/value

get value (signal.js:73) registers dep on current Reaction then returns protect(currentValue) — under default safety:'reference' that is the LIVE reference, under 'clone' a deep clone. set value (signal.js:79): notifies only if !equality(old,new) — deep isEqual by default, so setting a structurally-equal fresh array is a NO-OP. peek() (:102) = no-track protected read; raw() (:106) = no-track raw reference; clone() (:112) = tracked detached deep copy. version (:57) monotonic change counter incremented in notify() (:96), explicitly for debugging/external-store. hasDependents() (:123). stop() (:117) tears down a derived signal's backing reaction.

### Signal.mutate(mutationFn)

signal.js:138. Runs callback against currentValue via trackWrites (auto strategy). Change detection is precision-based (write tracking or snapshot deep-compare), deliberately NOT this.equality. If callback returns a NEW value it goes through set() (equality-checked); returning the same mutated reference warns in dev and falls through to change detection. Invalidation: whole signal.

### Signal array helpers (unconditional notify)

push(...args) signal.js:166, unshift :170, splice :174, map(fn) :178 (in-place rewrite), filter(fn) :185 (in-place compaction), removeIndex(i) :207 — all mutate currentValue in place then notify() unconditionally, skipping clone+compare. Granularity: whole signal, all subscribers.

### Signal keyed/indexed helpers (===-guarded notify)

setIndex(i,v) signal.js:200, setIndexProperty(i,prop,v) :212, setProperty(prop,v) :281 (on array signal sets prop on EVERY item, one notify), toggleProperty(prop) :318 (array: flips on every item), toggle() :224, increment(n,max) :228, decrement(n,min) :237, now() :247, clear() :161 (set undefined). Guarded by === on the touched slot only, then notify(). Granularity: whole signal.

### Signal id-based document helpers

getId(item) signal.js:257 (uses configured this.id), getIds :251 (unique of id/_id/hash/key), hasId(item,id) :263, getItem(id) :266, getItemIndex(id) :272 (linear scan), setItemProperty(id,prop,v) :304, toggleItemProperty(id,prop) :308, replaceItem(id,item) :334, removeItem(id) :341. A proto-collection API already living on Signal; all whole-signal invalidation.

### Reaction (class)

packages/reactivity/src/reaction.js:4. new Reaction(callback, { context, firstRun=true }) — runs SYNCHRONOUSLY in constructor when firstRun. Factory: reaction(callback, options) at helpers/create.js:6. run() (:69): fires cleanups, clears+re-collects dependencies from scratch each run (no diffing), save/restores Scheduler.current for nesting, callback receives the reaction (callback(this)), firstRun advances even on throw. invalidate() (:96) just queues via Scheduler.scheduleReaction — never runs inline. stop() (:106): deactivates, removes from pending queue and all dep subscriber sets, fires cleanups. onCleanup(cb) (:25): fires before each rerun AND on stop — the scope/ownership primitive. Reaction.current static (:6) mirrors Scheduler.current.

### Scheduler / flush semantics

packages/reactivity/src/scheduler.js:5. pendingReactions is a Set (same reaction invalidated N times in one tick runs ONCE). scheduleFlush (:17) queues one queueMicrotask (utils/browser.js:62). flush() (:26): loop { drain reactions in set-swap passes (new invalidations land in next pass), then run one snapshot of afterFlush callbacks } until both empty; max 100 iterations then console.error 'Reactive cycle detected' and queue clear; first error captured, queue still drained, rethrown after. Ordering: Set insertion order within a pass — NO topological sorting, so diamond dependencies can run a downstream reaction before its upstream derived recomputes (glitch-visible within a flush). Exports: flush, scheduleFlush, afterFlush, getSource (helpers/schedule.js:4-7). afterFlush(cb) (:83) runs after reactions drain, alternating with any reactions those callbacks queue. flush() callable synchronously to force-drain.

### Dependency (class, exported)

packages/reactivity/src/dependency.js:4. The raw primitive under everything. depend() (:12): if Scheduler.current, bidirectional link (subscribers.add(reaction), reaction.dependencies.add(this)). changed() (:28): invalidates every subscriber (no-op when zero subscribers). remove(reaction) (:45). This is what match() and ReactiveDataContext build per-key channels from — a DB layer can do the same.

### computed(computeFn, options) / derive(source, computeFn, options) / signal.derive

helpers/derived.js:32 / :29 / :93. Both wrap createDerivedSignal (:9): an EAGER backing Reaction runs computeFn immediately and on every source invalidation (microtask), writing into a result Signal via set() (so deep-equality dedup applies downstream). NOT lazy/pull-based: computes even with zero subscribers. Reads of a computed immediately after a source write return the STALE value until flush. Lifetime: WeakRef on the derived signal self-stops the backing reaction after GC; if created inside a Reaction, parent.onCleanup stops it on parent rerun/stop; derivedSignal.stop() manual. options forward to the Signal (equality etc.).

### match(source, matchFn = (key, value) => key === value)

helpers/derived.js:50. Solid createSelector adapted. Returns matcher(key) — reactive membership read backed by a per-key Dependency in a Map. One backing reaction reads source.get(); on value change fires dep.changed() ONLY for keys where matchFn flipped — N readers cost O(flipped). Prunes zero-subscriber keys opportunistically. matcher.stop() exposed; WeakRef self-stop; parent onCleanup when created inside a Reaction. The proven in-repo pattern for per-key live invalidation against one source — directly relevant to per-document live query channels.

### guard(compute, equalCheck = isEqual)

helpers/control.js:17. Inline memo: outside a reaction just computes. Inside, allocates a Dependency + nested Reaction; outer reaction subscribes to the dep, nested reaction re-runs compute on its own deps and fires dep.changed() only when result changed per equalCheck (deep by default). Narrows invalidation: outer re-runs only on result change. Nested reaction stops on outer cleanup (re-created each outer run).

### nonreactive(func)

helpers/control.js:6. Nulls Scheduler.current for the duration — suppresses dependency REGISTRATION only. Writes inside still notify normally. This is the only 'untracked' primitive; there is no notification-suppressing batch. currentReaction() at :35 returns Scheduler.current.

### trackWrites(value, callback, { strategy='auto'|'proxy'|'snapshot-implicit', onWrite, returnPaths, clone, equality })

packages/utils/src/objects.js:94 (NOTE: modified in working tree on branch observe-writes, PR #242). Returns { changed, result, paths? }. auto: small values (key-count budget 512, objects.js:62) get clone + deep isEqual compare with callback seeing the REAL object; large values, or when onWrite/returnPaths requested, get a write-tracking Proxy graph (WeakMap-cached wrappers, cycle-safe, unwrapDeep scrubs proxies out of stored values, expired-after-return guard throws). onWrite(pathArray, object, key) fires per actual write (set/delete/defineProperty, all no-op-deduped via Object.is/hasOwn). returnPaths yields dot-joined paths with child paths pruned under recorded parents — comment explicitly cites mongo path-conflict update rules. Frozen objects pass through raw and are change-detected by snapshot ('exotic'). This is the ready-made oplog/dirty-path producer for a client DB.

### ReactiveDataContext (renderer FGR)

packages/renderer/src/engines/native/reactive-context.js:240. Per-key reactive bag fronting a parent data object via Proxy (module-scoped HANDLER :233, traps read instance state off target for monomorphic ICs). values + deps are null-prototype objects; one raw Dependency per key allocated at setKey time (:284), NOT a Signal per key (wrapper allocation dominates at scale — stated design decision :30-38). trapGet (:109): read registers per-key dep, falls through to parent on miss while subscribing to a lazy keySetVersion Dependency (:148) so late-declared keys wake fallthrough readers; sealKeysAfterReplace (:243) skips that for fixed-shape as-mode records. setKey (:284): equality-deduped (snapshot of Signal.equality at construction :271) then dep.changed(). notifyKey(key) :305 manual fire. Per-FIELD layer for as-mode object items: ITEM_HANDLER proxy (:157) registers a Dependency per FIELD name in fieldDeps; notifyField(fieldName) :310 fires that field's dep plus a BARE_ITEM_DEP (:107) for consumers that unwrapped the raw item via UNWRAP symbol. replace(nextValues) :318 bulk setKey. dispose() :325.

### each-block reconcile (where field granularity actually happens)

packages/renderer/src/engines/native/blocks/each.js. Each record owns an RDC + a SHALLOW own-key snapshot of its item (createSnapshot :45). On reconcile (whole each block re-ran because the array signal notified — coarse at signal level), refreshSnapshotAndDetect (:61) diffs item vs snapshot per own key (=== per field, one pass, in-place refresh; removed keys NOT detected — stated tradeoff :58-60) and fires record.dataContext.notifyField(key) per changed field (Phase 3, :366-487). So mutating doc[5].title via signal helper: whole-array notify → one reconcile reaction run (O(n) shallow diff, Lit-style keyed head/tail walk for order) → notifyField('title') on record 5 only → only bindings reading {todo.title} on that row re-run. Keys resolve via getItemID; spread-mode uses setKey per changed field + notifyKey('this').

### subtemplate/snippet reactiveData (lazy-getter FGR)

packages/renderer/src/engines/native/blocks/template.js:117 buildArgsRecord. Each reactiveData entry becomes a native ES getter descriptor (NOT Proxy — stated V8 IC rationale :92-100) on a flat record; getter calls evaluator.lookupExpressionValue at access time so source-signal deps register on whichever Reaction is current AT THE READ — per-key isolation is structural. Absorb-set on declared keys (:115). createComponent/initialize/render wrapped in nonreactive (:247, :318) so setup reads don't leak deps onto the parent reaction. Settings mirror (:272) bridges reactiveData keys into per-key settings Signals.

### ReactionScope

packages/renderer/src/engines/native/reaction-scope.js:3. Ownership tree for reactions: track(reaction), reaction(node, callback, context) auto-stops when node.isConnected goes false (:19), child() (:34), onDispose(fn), dispose() O(n) subtree teardown (Vue EffectScope-style swap-pop :46). The lifetime container a live-query handle would want to register against in rendered contexts.

### tracing/debug

helpers/tracing.js: setTracing(bool) / setStackCapture(bool) — 'off'|'context'|'stack' modes; stack mode captures Error stacks per notify (10-100x cost, signal.js:384). Scheduler.getSource() (scheduler.js:90) prints what triggered the current reaction. Signal context option threads metadata through invalidations.

## Integration points
- Raw Dependency per document/field/query-key (packages/reactivity/src/dependency.js:4): exactly how ReactiveDataContext and match() build per-key channels. A collection can hold Map<docId, Dependency> (or per-field) and call dep.changed() from its write path — depend() inside a query read gives precise invalidation without Signal allocation overhead (the RDC comment at reactive-context.js:30-38 documents why raw Dependency beats Signal-per-key at scale).
- match(source, matchFn) (helpers/derived.js:50) as the membership template: a live query 'is doc X in result set' / selected-doc pattern with O(flipped) invalidation. Its keyDeps Map + single backing reaction + WeakRef/onCleanup lifetime handling is the in-repo precedent to copy for cursor observers.
- trackWrites with onWrite/returnPaths (packages/utils/src/objects.js:94): mongo-dot-path write log already exists, with child-path pruning matching mongo update path-conflict semantics. A collection.update(id, fn) can run the mutator through trackWrites({ returnPaths: true }) to get the exact changed field paths and fire per-field Dependencies — bridging mutation to FGR with no diffing.
- Signal as the cursor result container: cursor.fetch() backed by a Signal whose default deep isEqual means re-running a query and set()-ing results only notifies on real change — free result-set dedup. Signal.id already resolves item._id (signal.js:29), and the id-based helpers (getItem/setItemProperty/removeItem etc.) are a proto-document API.
- guard() (helpers/control.js:17) for derived query reads inside reactions (e.g. count(), findOne projections) so callers only re-run when the projected value changes, not on every underlying invalidation.
- afterFlush (scheduler.js:83) for observer/callback delivery aligned with the render flush (e.g. observeChanges-style added/changed/removed callbacks delivered after the DOM settles), and flush() for synchronous test determinism.
- Reaction.onCleanup + currentReaction() (helpers/control.js:35) for auto-stopping live query handles when created inside a reactive computation (the derive/computed/match pattern: parent.onCleanup(() => handle.stop())), plus matcher-style WeakRef self-stop for owner-less handles, plus ReactionScope for DOM-tied lifetimes.
- ReactiveDataContext.notifyField/notifyKey/setKey (reactive-context.js:284-316) are public methods on the render-side per-row context: a DB delivering per-field change events composes directly with the each-block contract — reconcile already consumes exactly 'which fields of doc changed' (each.js Phase 3) and a DB that knows changed paths could skip the snapshot diff entirely.
- Signal.version (signal.js:57) — monotonic counter explicitly noted for external-store integration, usable for cursor result versioning / cheap staleness checks.
- Custom equality/clone/id injection per Signal or globally via statics (signal.js:27-30) — a DB layer can install EJSON-like clone/equality or _id-only identity without forking Signal.

## Gotchas
- Signal-level invalidation is always whole-signal: every helper including setItemProperty/setIndexProperty calls notify() which wakes ALL subscribers. Per-field granularity only exists in renderer-layer constructs (RDC + reconcile snapshot diff). An array-of-docs Signal as the collection store means every write re-runs every reaction reading the array — acceptable for each-blocks (reconcile is the single subscriber and diffs cheaply) but coarse for arbitrary readers.
- Default safety is 'reference': get() returns the live object, so query consumers can mutate stored docs without any notification (the in-place footgun mutate() exists to solve). safety:'clone' pays deep clone on every get AND set. A DB layer must pick its own protection story.
- Default equality is DEEP isEqual on set(): set() with a structurally-equal rebuilt result array will NOT notify (good for dedup) but also means set() cost scales with value size (deep compare even on no-op). Array helpers (push/splice/...) skip equality entirely and always notify.
- No batch/transaction API exists. Batching is implicit: all invalidations in one task coalesce into one microtask flush, and a reaction queued N times runs once (Set). But N notify() calls each walk subscriber sets, and intermediate states are observable to any synchronous peek/flush. nonreactive() suppresses dep REGISTRATION, not notification.
- Reads are not flush-consistent: computed/derive are eager-push via microtask, so reading a derived signal synchronously after a source write returns the stale value until flush. No topological ordering in flush (Set insertion order, set-swap passes) — diamond graphs can observe glitches within a flush. Cycle guard kills the queue after 100 iterations with console.error (no throw).
- Reaction dependency tracking is dynamic and rebuilt from scratch every run (reaction.js:83-86): conditional reads change the subscription set, and anything read synchronously inside a reaction subscribes — DB internals reading signals during a query must nonreactive() their bookkeeping reads or they leak deps onto the caller's reaction.
- Reaction errors during flush are captured, the queue still drains, and only the FIRST error is rethrown (from the microtask — effectively unhandled). Reaction constructor runs callback synchronously by default (firstRun: true).
- refreshSnapshotAndDetect is shallow and own-keys-of-new-item only: nested object mutation (doc.author.name) and removed keys do NOT produce changed-field detection in each-block reconcile (each.js:56-73). Field-level granularity is one level deep.
- trackWrites tracked values expire after the callback returns (throws on later access), frozen objects fall back to snapshot detection, and Map/Set contents are 'exotic' (clone + deep-compare, no path info). The auto budget is 512 keys — large docs silently switch to proxy strategy. The file is mid-flight on branch observe-writes (PR #242, working tree modified) — re-verify before depending on exact signatures.
- README examples are stale (Reaction.create no longer exists — renamed to reaction() factory). Trust src over README.
- No serialization, persistence, or transaction hooks exist anywhere in packages/reactivity — the only adjacent machinery is trackWrites' dot-path log in utils.
- Memory leak shape to respect: Dependency subscriber sets hold strong refs to Reactions; cleanup relies on Reaction.stop()/rerun removal. Long-lived DB-side Dependencies referencing stopped-but-unstopped reactions is the failure mode; the repo's patterns (WeakRef self-stop in derive/match, onCleanup scoping, zero-subscriber pruning inside match's backing reaction) are the established mitigations.
