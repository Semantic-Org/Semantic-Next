# Component/query — callParams, settings, helpers, integration surface

The framework's developer surface centers on Template (packages/templating/src/template.js), which backs every defineComponent web component (packages/component/src/define-component.js) and injects a single params object — built once in Template.buildCallParams() — into createComponent, all lifecycle callbacks, event handlers, and key handlers. Settings reactivity is implemented as lazily-created "shadow signals" behind a Proxy (component-helpers.js createSettingsProxy, plus a subtemplate variant in template.js), overlaid onto the render data context so bindings track them. Reactivity is Meteor-Tracker-shaped: a standalone Dependency class (depend/changed) underlies Signal, and every template binding runs inside an auto-disposing Reaction (ReactionScope), so any function evaluated in a template that calls dependency.depend() becomes live — this is the natural hook for minimongo-style cursors. There is no provide/inject or DI container; cross-component sharing today is module-scope singletons, DOM CustomEvents, findParent/findChild snapshot traversal, and behaviors' setup() shared state. Behaviors (packages/query) are strictly DOM-element-attached imperative plugins stored at element[namespace] and are the wrong home for a data layer. The two cleanest integration points for a client DB are (a) a new key in buildCallParams and (b) registered template helpers backed by Dependency/Signal, with subscription teardown wired to the template's abortSignal.

## APIs

### defineComponent(config)

packages/component/src/define-component.js:10-119. Accepts template/ast/css, tagName, createComponent fn (line 19), events, keys, lifecycle callbacks (onCreated/onRendered/onDestroyed/onThemeChanged/onAttributeChanged, lines 23-27), defaultSettings, defaultState, subTemplates, renderingEngine, componentSpec. Builds a prototype Template (line 72-89) and, when tagName given, an engine factory web component class (line 100-104) registered via customElements.define (line 115). Without tagName returns the prototype Template (subtemplate form).

### Template.buildCallParams(additionalData)

packages/templating/src/template.js:884-935 — THE param registry. Every injectable param is one key in this object: el, tpl/self/component (the createComponent return, lines 889-891), $, $$, reaction, signal, computed, derive, match, guard, interval, timeout, abortSignal, afterFlush, nonreactive, flush, data, settings (this.settings || element?.settings, line 907), state, isRendered, isServer, isClient, isHydrating, rerender, dispatchEvent, attachEvent, bindKey, unbindKey, abortController, helpers (TemplateHelpers, line 921), template, templateName, templates (global registry), findTemplate, findParent, findChild, findChildren, content, darkMode getter, then ...additionalData. Built once at initialize (line 345, cached as this.callParams) and reused by call() (lines 861-882) for every callback. Adding a db/collection accessor = one new key here, automatically reaching createComponent, lifecycle hooks, events, and keys handlers.

### createComponent invocation

packages/templating/src/template.js:239-241 — inside Template.initialize(): `instance = this.call(this.createComponent, { thisContext: this.instance })`; return value extended onto template.instance, which is merged into the render data context by getDataContext() (line 374-376: extend({}, this.data, this.state, this.instance)) — flat namespace, so instance methods/signals are directly addressable in templates.

### Template.call(func, { params, additionalData, additionalArgs, thisContext })

packages/templating/src/template.js:861-882. Spreads additionalData over cached callParams per call (event handlers add event/target/value/data at lines 625-636; key handlers add event/inputFocused/repeatedKey at lines 708-714). Default this-context is the host element.

### createSettingsProxy(el)

packages/component/src/component-helpers.js:249-278. Proxy over {}; get reads el[property] ?? el.defaultSettings[property], lazily creates a shadow Signal per key in el.settingsVars (Map), syncs it to the current value, calls settingSignal.depend(), returns the RAW value (no signal unwrap needed by caller). set calls el.setSetting(property, value) (base.js:290-292 → DOM property accessor) and updates the shadow signal. Reads inside reactions/templates are therefore tracked.

### property accessors → requestUpdate

packages/component/src/engines/native/factory.js:49-67. Each resolved property gets a prototype accessor; set stores in this.properties Map and calls requestUpdate() when config.hasChanged(value, old) — default deep isEqual (component-helpers.js:128-130). Function/class-instance settings are propertyOnly with hasChanged always true (component-helpers.js:133-138, isClassInstance → propertyOnly at line 78); Object/Array attributes JSON-parse via converters (lines 165-180). External objects passed as DOM properties work; in-place mutation of them does NOT trigger updates (deep-equal compare against the same reference).

### overlaySettingsSignals(context)

packages/templating/src/template.js:378-417. After getDataContext spread, shadow signals from settingsVars are overlaid into the render data context so renderer bindings track settings as Signals (signals always win over plain duplicates). Subtemplate variant uses its own settingsVars (lines 381-392); web components ensure spec attributes also get shadow signals (lines 405-411).

### subtemplate settings proxy

packages/templating/src/template.js:995-1057 (createSubtemplateSettings / updateSubtemplateSettings). Own settings backed by signal(value, { safety: 'reference' }) (lines 1022, 1040), falls back to parent web component settings on miss (lines 1029-1031).

### defaultState → createReactiveState

packages/templating/src/template.js:147-175. Each defaultState key becomes a signal; data context values override defaults (subtemplate pattern); object defaults cloned so instances can't mutate the prototype declaration (line 158-160). Supports { value, options } expert form.

### lifecycle wiring

packages/templating/src/template.js:251-304 (initialize). onCreated fires at end of initialize (line 347) before render/attach — the data-fetch hook. onDestroyed (lines 292-304): aborts this.abortController ('Template destroyed'), clears tracked reactions, removes events/observers/parent, then user callback, then dispatches 'destroyed'. Host element disconnect defers teardown one microtask to distinguish move from removal (engines/native/base.js:211-222). Lifecycle promises: el.created/.rendered/.updated/.destroyed getters (base.js:358-372) → lifecyclePromise (template.js:950-974).

### cleanup primitives

abortSignal/abortController in callParams (template.js:902, 920, created at lines 98-99). attachEvent auto-removes on destroy (template.js:939-945). interval/timeout helpers auto-clear via abortSignal listener (template.js:1063-1073). trackReaction scopes reaction/computed/derive/match to the template so they stop on destroy (template.js:1080-1099, clearReactions 1101-1103). NOTE: the `signal` param is the raw create function (line 895), unscoped — only reactions need scoping.

### findParent / findChild / findChildren / findTemplate

packages/templating/src/template.js:1109-1112 (instance arrows) → statics at 1140-1257. findParentTemplate (1152-1196) walks DOM parentNode/host chain matching node.component.templateName, then falls back to the parentTemplate chain for nested partials; returns a SPREAD SNAPSHOT {...instance, ...data} (lines 1173-1176, 1188-1191) — not the live template, not identity-stable, though copied Signal references remain live. findChildTemplates (1198-1254) traverses shadowRoot children then _childTemplates. Template.renderedTemplates static Map keyed by templateName (1114-1136) is a global registry exposed as the `templates` param. Used in first-party code: src/components/panels/panel.js:107 `findParent('uiPanels')`.

### app-level state sharing today (src/)

No provide/inject anywhere. Patterns found: (1) module-scope singletons — behaviors' setup() returns shared state across all instances (register-behavior.js:106, src/behaviors/tooltip/tooltip.js:110-115 shared lastInteraction); (2) DOM CustomEvents — theme-switcher dispatches 'themechange' on $('html') (src/components/theme-switcher/theme-switcher.js:79) and Template.attachEvents listens globally when onThemeChanged is defined (template.js:556-575); 'global' event keyword binds page-level selectors (template.js:643-645); (3) findParent traversal (panels); (4) localStorage + html class for theme (theme-switcher.js:16-27); (5) behavior global cache at Query.prototype[namespace].cache (behavior.js:696-702). No component fetches remote data today — getJSON/getText fetch helpers exist at packages/utils/src/browser.js:200-207 and are re-exported from @semantic-ui/component.

### registerBehavior(behavior)

packages/query/src/register-behavior.js:6-177. Installs Query.prototype[name]; invocation iterates $elements (line 103), instantiates Behavior per element, stores at element[namespace] (behavior.js:135). String-first-arg = method call via callMethod; re-invoke with settings = reinitialize (lines 138-160). Registry dedupes by name (lines 62-64, silent no-op). Behavior constructor REQUIRES $element — behavior.js:79-84 does `this.element = $element.el()` unconditionally, and events/mutations/stylesheet adoption all assume a DOM node. Behavior callParams (behavior.js:665-728): $, el, $el, self, abortSignal (actually the controller, line 677), settings, cache, data, selectors/classNames/templates/errors, dispatch helpers, logging. No reactivity integration at all — behaviors never import @semantic-ui/reactivity. Verdict: a data layer does not fit as a behavior; behaviors are element-scoped imperative plugins (tooltip, escape, attach, transition).

### TemplateHelpers + registerHelper/registerHelpers

packages/templating/src/template-helpers.js:28-228 (global flat object of ~60 helpers), registerHelper(name, fn) at 231-233, registerHelpers(obj) at 236-238 (Object.assign onto the shared object). Re-exported from @semantic-ui/component (packages/component/src/index.js) and @semantic-ui/templating (index.js:1). Passed to every renderer at template.js:341 and exposed as the `helpers` callParam (line 921). Usage example: docs/src/examples/templates/templates-helpers-custom/register-helpers.js.

### expression resolution order

packages/renderer/src/expression-evaluator.js:272-315 (lookupTokenValue): literal → data context (simple key line 283-291, dotted path 292-298, Signals auto-unwrapped via .value/.get) → helpers (lines 300-303) → JS eval fallback (line 311). Data keys SHADOW helpers. Function tokens are called with already-resolved args (lines 242-260, item-proxies unwrapped at the boundary line 254); dotted-path traversal calls intermediate functions and unwraps Signals (getDeepDataValue, lines 327-349). So `{find 'todos' selector}` as a helper, or instance methods returning live results, both work syntactically.

### Dependency (the Tracker primitive)

packages/reactivity/src/dependency.js:4-47. depend() registers Scheduler.current (the running Reaction) as subscriber (lines 12-17); changed() invalidates all subscribers (lines 28-43); remove(reaction). Signal wraps one (signal.js:41, get registers at :73-74, set fires this.dependency.changed at :99). Every template binding evaluates inside a Reaction created by ReactionScope.reaction (packages/renderer/src/engines/native/reaction-scope.js:19-28, auto-stops when node disconnects), so a helper or instance method that calls someDependency.depend() during evaluation makes that binding live — exactly the minimongo cursor reactivity contract. ReactionScope.onDispose (line 30) and dispose (45+) handle teardown.

### Signal mutation/safety surface

packages/reactivity/src/signal.js. Default safety 'reference' (line 30, clone-on-get only under safety 'clone' line 67). mutate(fn) uses trackWrites for change detection (lines 138-163, warns when mutated reference is returned). Array/object helpers: push (166), toggle (224), increment (228), now (248), toggleItemProperty (308), setProperty etc. Relevant for db: query results exposed as Signals get template auto-unwrap, equality-gated change detection, and a .dependency for manual invalidation.

## Integration points
- buildCallParams (packages/templating/src/template.js:884-935) — add a `db`/`collection`/`subscribe` key once; it flows to createComponent, every lifecycle callback, event handlers, and key handlers with zero other changes. Follow the existing split: scope teardown-bearing handles like reaction/computed do (trackReaction, template.js:1080-1099) or bind to this.abortSignal (line 902), keep pure accessors raw like `signal` (line 895).
- registerHelper/registerHelpers (packages/templating/src/template-helpers.js:231-238) — register `find`/`findOne`-style global template helpers. They execute inside per-binding Reactions (reaction-scope.js:19-28), so a helper that calls dependency.depend() per query yields live-updating bindings. Caveat: data context shadows helpers (expression-evaluator.js:283-303), so pick collision-resistant names or namespace under one object exposed via callParams instead.
- Dependency (packages/reactivity/src/dependency.js) — the canonical invalidation primitive for cursors: depend() in find paths, changed() on write. Alternatively expose result sets as Signals (packages/reactivity/src/signal.js) to inherit template auto-unwrap, equality gating, and mutation helpers.
- Module-scope singleton collections (the existing app-level-state pattern: tooltip setup() shared state register-behavior.js:106 / tooltip.js:110, theme-switcher's $('html') events) — works today with no framework change: import a collection into the component module, return query methods from createComponent, results evaluated reactively in templates.
- abortSignal/abortController callParams (template.js:902, 920; aborted in onDestroyed at line 296) — wire subscription/observer teardown: `db.subscribe(query, { signal: abortSignal })` matches the framework's fetch/event/timer cleanup idiom (attachEvent template.js:939-945, interval/timeout 1063-1073).
- Settings/properties path for passing handles into components — class instances become propertyOnly properties (component-helpers.js:78, 133-138), so `el.collection = myCollection` works through the accessor → requestUpdate pipeline (factory.js:53-66); shadow signals make `settings.collection` reads tracked (component-helpers.js:249-278).
- defaultState + createReactiveState (template.js:147-175) for components that mirror query results into state signals, using signal mutation helpers (signal.js:166+) for incremental updates.
- onCreated (template.js:251-257, fired at initialize end line 347) — the idiomatic subscribe/fetch hook; pair with isServer/isClient callParams (template.js:910-911) since SSR runs the same path (Template.isServer guards exist, e.g. dispatchEvent no-op line 978).
- Both engines share Template — buildCallParams changes are engine-agnostic, but anything added to WebComponentBase (engines/native/base.js) needs a mirror in engines/lit/factory.js.

## Gotchas
- callParams is built ONCE at initialize (template.js:345) and shallow-reused per call — `data`, `settings`, `state` stay live because they're stable references, but any computed value added there is frozen at init. Dynamic values must be getters (see darkMode, template.js:930-932) or live proxies.
- findParent/findChild/findTemplate return spread snapshots ({...instance, ...data}, template.js:1147-1150, 1173-1176) — not the live template instance. Mutations don't propagate back; identity checks fail; Signal references inside the spread DO stay live. A db handle shared via findParent would survive, but don't rely on object identity.
- Data context shadows template helpers (expression-evaluator.js:283-303) — a global `find` helper silently loses to any component state/instance member named `find`. The helper namespace is flat and global (Object.assign onto one shared object).
- Signal default safety is 'reference' (signal.js:30) and web component property change detection is deep isEqual (component-helpers.js:128-130) — mutating an external object/array passed as a setting in place triggers nothing (same reference compares equal). Reassign, or use signal mutation helpers / .mutate() with trackWrites (signal.js:138-163).
- The `signal` callParam is the raw create function (template.js:895), NOT template-scoped; only reaction/computed/derive/match auto-stop on destroy (template.js:1085-1099). A db param that opens subscriptions must handle its own teardown via abortSignal or trackReaction — don't assume the framework scopes it.
- Behaviors cannot host a data layer: Behavior constructor dereferences $element.el() unconditionally (behavior.js:79-84), stores the instance ON the element (line 135), and the behaviors package never imports reactivity. Also registerBehavior silently no-ops on duplicate names (register-behavior.js:62-64).
- In the Behavior callParams, the key named `abortSignal` is actually the AbortController, not its signal (behavior.js:677 `abortSignal: this.controller`) — inconsistent with Template's callParams where abortSignal is a real AbortSignal (template.js:902).
- onCreated fires before first render and runs on the server too (renderToString path) — data fetching there must be isServer-guarded; dispatchEvent is a server no-op (template.js:978) but fetch/localStorage are not guarded for you (see theme-switcher's manual isServer checks, src/components/theme-switcher/theme-switcher.js:21-35).
- Settings proxy get() re-syncs the shadow signal on EVERY read (component-helpers.js:258-262 settingSignal.set(setting)) — the element property is the source of truth; writing the shadow signal directly without setSetting would be overwritten on next read.
- Host disconnect teardown is deferred one microtask (base.js:211-222) to tolerate DOM moves — destroy-time db unsubscription via onDestroyed/abortSignal is similarly deferred; a remove+reinsert in the same task never tears down.
- Source readings above are traces, not test-verified behavior — per repo norms treat exact semantics (especially findParent merge behavior and helper-shadowing order) as hypotheses to verify with a failing test before building on them.
