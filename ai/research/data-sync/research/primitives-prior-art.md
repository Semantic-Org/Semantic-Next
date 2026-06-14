# Prior art in repo — existing data/persistence patterns, roadmap

No data/sync/persistence layer exists in this monorepo, and none is planned: ai/plans/ROADMAP.md (Phases 0-6, Parallel P1-P14, Icebox) contains zero items for stores, collections, offline, IndexedDB, WebSocket, or sync. What exists instead is a deliberate userland pattern: the Tracker-lineage reactivity package (packages/reactivity, README.md:3 cites Meteor Tracker) plus a documented "external sync" idiom where a reaction mirrors a signal to localStorage or a server (docs/src/examples/reactivity/advanced/external-sync/, ai/skills/authoring/reactive-state.md:471-493, framed in example-curriculum.md:59 as the anti-useEffect). First-party components do ad-hoc per-component localStorage persistence via settings-named keys (theme-switcher, sidebar-toggle, panels) with no shared helper. The only async-data primitives are the {#async} template block (loading/success/error with stale-promise generation guards) and getText/getJSON fetch wrappers in utils. Meteor heritage is exclusively Tracker/Blaze (reactivity, lifecycle, event maps) — there are zero minimongo/collections/pubsub mentions, so a new data-layer design has a green field but must not collide with the existing packages/query name (a Shadow-DOM-aware DOM library, not a data query layer).

## APIs

### signal(value) / reaction(fn)

Creation helpers exported from packages/reactivity/src/index.js (impl in src/helpers/create.js). reaction callbacks receive a computation object with .firstRun — the canonical skip-write-on-initial-load guard for persistence reactions (docs/src/examples/reactivity/advanced/external-sync/page.js:31-38, docs/src/examples/component/todo-list/component.js:21-26). This reaction-mirror idiom IS the framework's current sync story per ai/skills/authoring/reactive-state.md:471-493 ('External System Integration': localStorage sync + server PUT sync, with a 'debounce or batch in real applications' caveat).

### Signal mutation helpers

packages/reactivity/src/signal.js — push (:166), toggle (:224), increment (:228), setProperty (:281), etc. Mutate-in-place-and-notify API on every signal. A collection/store layer would be expected to expose this same helper-method shape (never get-mutate-set, per project conventions).

### Reaction / Dependency / Scheduler / Signal classes

packages/reactivity/src/{reaction,dependency,scheduler,signal}.js — Tracker semantics: Dependency.depend() registers the active reaction, dep.changed() invalidates, microtask-batched flush. README at packages/reactivity/README.md:3 explicitly states lineage from Meteor Tracker. Also exported: computed/derive/match (helpers/derived.js), nonreactive/guard (helpers/control.js), flush/afterFlush (helpers/schedule.js).

### {#async} template block

packages/renderer/src/engines/native/blocks/async.js:109-150. Three-state loading/success/error rendering, generation counter on self discards stale promise resolutions (:50, :76), re-shows last resolved value while a refetch is in flight (:68-72), hydrate preserves server-rendered loadingContent (:126-132). This is the template-level async-data primitive a fetch/store layer would feed.

### getText / getJSON

packages/utils/src/browser.js:200-211 — thin async fetch wrappers (response.text()/response.json()), re-exported through @semantic-ui/component (todo-list imports getText from '@semantic-ui/component'). The only HTTP-data API in the framework.

### trackWrites

packages/utils/src/objects.js:94 — scoped write tracking backing mutate() with auto snapshot/proxy strategy (PR #242, current observe-writes branch). Enforces callback-scoped use (:122 throws on use-after-return). Natural substrate for change-set/patch generation in a sync layer.

### Per-component localStorage persistence (emergent convention, no shared helper)

src/components/sidebar-toggle/sidebar-toggle.js:11 (storeAs default), :53-65 (canSaveState gated on isClient + settings.saveState); src/components/panels/panels.js:10 (saveStateID), :37, :53, :125 (JSON.stringify layout); src/components/theme-switcher/theme-switcher.js:25, :49. Pattern: a settings key names the storage key, an opt-in saveState flag, isClient guards. Each component reimplements it.

### createComponent state + lifecycle

defaultState auto-wraps values in Signals; onCreated is documented as the home for 'setup, timers, data fetching' (ai/skills/essentials/mental-model.md:259, overview.md:207). todo-list example (docs/src/examples/component/todo-list/component.js:19-36) shows the full load-then-persist-via-reaction shape.

## Integration points
- reaction()/signal() mirror idiom — a client DB layer that exposes reactive cursors/documents as signals plugs directly into the documented external-sync seam (ai/skills/authoring/reactive-state.md:471, docs/src/examples/reactivity/advanced/external-sync/) without new framework hooks; templates auto-unwrap signals so query results render with zero adapter code
- Signal mutation-helper API (packages/reactivity/src/signal.js:166-281) — a collection type mimicking push/setProperty/toggle would feel native; fine-grained reactivity (FGR, per-key isolation at each-items per PR #183) already optimizes keyed collection updates
- trackWrites/mutate (packages/utils/src/objects.js:94) — write tracking for optimistic updates / patch generation; PR #242 design notes live in memory as project_pr242_trackwrites
- {#async} block (packages/renderer/src/engines/native/blocks/async.js) — template surface for promise-returning store APIs; note it has no evaluateText so it cannot appear in raw-text contexts (async.js:144-147)
- Behavior system (packages/query/src/register-behavior.js, base class packages/query/src/behavior.js) — persistence/sync could ship as a behavior; behaviors already support shared per-type caches on Query.prototype[namespace] (ai/skills/authoring/query-behaviors.md:192, :443)
- Standardizing the storeAs/saveStateID convention — sidebar-toggle, panels, and theme-switcher each hand-roll localStorage persistence; a shared persist helper or setting contract is an obvious consolidation target (src/components/sidebar-toggle/sidebar-toggle.js:11, src/components/panels/panels.js:10)
- Value Schema plan (ai/plans/value-schema.md, ROADMAP 2b) — the value-setting + schema + change-event contract for ~20-30 form components; the settings proxy is already bidirectional (value-schema.md:40); a form-data layer must align with this contract
- getJSON/getText (packages/utils/src/browser.js:200-211) — the blessed fetch primitives to build resource loading on
- SSR pipeline — components render twice and SSR state does not transfer to client (ai/skills/authoring/component-ssr.md:275); a DB layer needs an isClient story and possibly a hydration handoff, which nothing currently provides

## Gotchas
- Name collision: packages/query is the Shadow-DOM-aware DOM library ($), not a data-query layer. A new package named 'query', 'store', or similar must dodge this. Also note @semantic-ui/component re-exports utils helpers (todo-list imports getText from component).
- ABSENT is the headline: zero hits for IndexedDB/WebSocket/minimongo/offline/local-first/'sync layer' in framework code or plans. The only IndexedDB mention is serialization advice (structuredClone shares the IndexedDB/postMessage format, ai/skills/contributing/performance-v8-memory.md:121). The only WebSocket mentions are Vite HMR debugging (ai/skills/docs/docs-examples-debugging.md:45) and a bench template string (packages/component/bench/tachometer/bench-template.js:252).
- Meteor lineage is Tracker/Blaze only (reactivity model, lifecycle names, event maps — packages/reactivity/README.md:3, ai/guestbook.md:2224). No stated intention anywhere to port Meteor's data layer (collections/pubsub/minimongo). Don't infer one from the heritage.
- The framework's stated position is systems-not-opinions, and external sync is currently documented as a userland reaction pattern, not a built-in. A new design either stays consistent with that (a layer that composes signals + reactions) or explicitly upgrades the doctrine — it should engage with reactive-state.md and the external-sync example rather than ignore them.
- ROADMAP sequencing pressure: Phases 2-4 (API contracts, naming, then agent-driven generation of ~66 components) lock conventions before component generation. A data layer adding component-facing API surface would belong in the Phase 2 'contracts' window. Closest existing contract work is Value Schema (2b, blocking form components and wrapper architecture).
- SSR dual-render trap: createComponent/onCreated run on server too; localStorage and browser APIs must be isClient-guarded and SSR-set state does not transfer to the client (ai/skills/authoring/component-ssr.md:18, :275; component-lifecycle.md:215). Persistence reads in onCreated are exactly the code shape this bites.
- reaction firstRun guard is the established idiom to avoid writing freshly-loaded data straight back to storage (todo-list component.js:21-26, external-sync page.js:31-38). A sync layer should encapsulate this, since every example currently hand-rolls it.
- Perf consideration for large collections in signals: icebox/renderer-evaluator-perf.md lists 'Signal.peek non-cloning' and 'item-proxy clone elimination' as known hot-path costs — signal reads involve cloning/proxy machinery that matters at collection scale. Verify current Signal.get clone semantics in packages/reactivity/src/signal.js before designing storage of large docs in signals.
- mcp-playground-rendering.md:52-69 mentions a 'storage layer' (Vercel KV for shareable playground URLs) — docs-site infrastructure only, not framework prior art. The old .eslintrc with meteor/mongo env globals (noted during repo cleanup) was classic-SUI residue, since cleaned.
- Plan-staleness rule from project memory applies: any plan file older than ~a week should be treated as hypotheses — re-verify concrete claims against source before building on them.
