/*
  Pedagogy metadata for the examples server.

  Edit this file directly. The curriculum order, headlines, intro prose,
  new-patterns lists, and what-to-notice bullets are seeded verbatim from
  ai/skills/authoring/example-curriculum.md — kept local so the examples
  site never depends on parsing that doc and the two can evolve
  independently when their audiences (MCP agents vs. examples readers)
  diverge.

  Each entry's `intro`, `newPatterns`, and `whatToNotice` items support
  inline markdown: backticks → <code>, **double-asterisks** → <strong>.
*/

export const CURRICULUM = [
  {
    id: 'minimal',
    headline: 'Hello world',
    intro:
      'A complete component in a single `defineComponent` call. Inline template, inline CSS, one piece of state, and the `interval` lifecycle helper to advance the clock once per second.',
    newPatterns:
      'Inline `template` and `css` strings, `defaultState`, the `onCreated` lifecycle hook, the `interval` helper, the `formatDate` template helper.',
    whatToNotice: [
      'The `template` and `css` options take plain strings — no file loading or build step is required for the smallest cases.',
      '`onCreated` is a top-level option on `defineComponent`. It receives the same context (`state`, `interval`, …) that `createComponent` does and runs before the first render.',
      '`interval(() => state.time.now(), 1000)` schedules a tick and cleans up automatically when the component is destroyed. `state.time.now()` is shorthand for `state.time.set(new Date())`.',
    ],
  },
  {
    id: 'emoji-reactions',
    headline: 'State and events',
    intro:
      'A row of emoji reactions you can toggle. Initial reactions come from an HTML attribute that the component parses on `initialize()`; clicking a reaction flips its `active` flag and adjusts the count.',
    newPatterns:
      '`defaultSettings`, `defaultState`, `createComponent`, `events`, `{#each}`, `getIndex` / `setIndex`, `initialize()`, `data-*` parsing, `{activeIf}`.',
    whatToNotice: [
      '`state.reactionState.getIndex(index)` and `setIndex(index, value)` read and replace a single array item by index — no manual `map` or spread.',
      'Event handlers receive a `data` object containing parsed `data-*` attributes from the event target. `data-index="{i}"` in the template becomes `data.index` in the handler.',
      'The component works from a single HTML tag: `<emoji-reactions reactions="👍 12, ❤️ 5">`. Settings are parsed from the attribute string in `initialize()`.',
    ],
  },
  {
    id: 'todo-list',
    headline: 'TodoMVC',
    intro:
      "TodoMVC implemented with the framework's canonical patterns: signal mutation helpers for the list, a `reaction()` that mirrors state to localStorage, subtemplates for items, and `hashchange` for routing between filters.",
    newPatterns:
      "`push`, `removeItem`, `replaceItem`, `setProperty`, `setArrayProperty`, `filter`, `getItem`, `reaction()`, `{#snippet}`, `subTemplates`, `keys`, `afterFlush`, `{classMap}`, `{selectedIf}`, `{maybePlural}`, `'global hashchange window'`.",
    whatToNotice: [
      "Each mutation has a named helper: `state.todos.push(todo)`, `removeItem(id)`, `replaceItem(id, next)`, `setProperty(id, key, value)`, `setArrayProperty('completed', true)`. Helpers describe intent instead of reproducing immutable-update boilerplate.",
      '`reaction(() => { state.todos.get(); localStorage.setItem(...) })` syncs the list to storage. Re-runs when the read signal changes; no dependency array.',
      'Subtemplates compose with named parameters: `{>todoItem id=todo.id title=todo.title ...}`. The `todoItem` template lives in its own file and is registered via `subTemplates`.',
      "`afterFlush(() => $('.editing .edit').focus())` runs after the next render commits, which is how you reach into the DOM that the new state just produced.",
    ],
  },
  {
    id: 'async-search',
    headline: 'Async blocks',
    intro:
      'A typeahead built with `{#async}`. The template calls an async function inline and renders the resolved value, with `{loading}` and `{error}` branches alongside it. When the input changes, the block re-runs automatically.',
    newPatterns:
      '`{#async fn args as result}` with `{loading}` and `{error as e}`, `timeout`, snippets with parameters, `{activeIf is x y}` lisp-style, `{hasAny}`, `.decrement()` / `.increment()`.',
    whatToNotice: [
      '`{#async getResults searchTerm as searchResults}` invokes an async function, names its resolved value, and re-runs when `searchTerm` changes. `{loading}` and `{error as e}` declare the other states next to the success branch.',
      "A `{#snippet message}` defined once at the bottom of the template is reused three times for the loading, empty, and error states — `{>message type='loading'}` passes a parameter to the snippet.",
      '`{activeIf is index selectedIndex}` reads as a sentence: `is` compares the two values, `activeIf` adds the `active` class when the result is true.',
      "Event selectors can list multiple events: `'focus, input ui-input'` binds both `focus` and `input` on the same `ui-input` element.",
    ],
  },
  {
    id: 'context-menu',
    headline: 'Slots, deep events, and cross-instance coordination',
    intro:
      'A right-click context menu. The trigger wraps a `<slot>`, so the actual right-click happens on light-DOM content that the host element exposes through the shadow root. The component listens on the document with `global`, positions itself within the viewport, and uses a custom event so opening one menu closes any others.',
    newPatterns:
      "`{>slot}`, `'deep contextmenu .trigger'`, `'global click body'`, `'global show context-menu'`, `part`, key handler return values, `role` / `tabindex`, `dispatchEvent`.",
    whatToNotice: [
      "`'deep contextmenu .trigger'` — the trigger contains `{>slot}` and the actual right-click target is light-DOM content the consumer passed in. Without `deep`, the framework's handler bails out because `event.target` lives in a different tree than `.trigger`. The `deep` keyword opts in to handling events whose target sits outside the component's own subtree.",
      "`'global click body'` and `'global contextmenu body'` listen on the document from within the shadow DOM, and unbind automatically when the component is destroyed.",
      "`'global show context-menu'` listens for a custom event dispatched by *other* `context-menu` instances. Each menu dismisses itself when a sibling opens.",
      'Key handlers can return `true` or `false` to indicate whether they handled the event — useful when the same key should fall through to the page when the menu is closed.',
      '`part="menu"`, `part="menu-item"`, etc. let the consumer style internals from outside the shadow root with `::part()`.',
    ],
  },
  {
    id: 'card-search',
    headline: 'Composition with subtemplates',
    intro:
      'A friend directory filtered by gender and search term. The card markup lives in its own file and is registered as a subtemplate; the page is assembled from first-party `ui-menu` and `ui-input` components.',
    newPatterns:
      'Subtemplate imports, `weightedObjectSearch`, `@container` queries, first-party UI components (`ui-menu`, `ui-input`), `{#each ... else}` with JS expressions.',
    whatToNotice: [
      "A subtemplate is just an imported value: `import { card } from './card.js'`, then `subTemplates: { card }`, then `{>card name=friend.name ...}` in the template.",
      'First-party components like `<ui-menu inset selection value="{filter}" items="{filters}">` participate in templates as plain HTML tags. Their settings flow through standard attributes.',
      '`getVisibleFriends()` returns a derived list. It is referenced as `{getVisibleFriends}` in the template; the framework auto-tracks the signals it reads (`state.friends`, `state.filter`, `state.searchTerm`) and re-runs it when any change.',
      'Because each component renders inside its own shadow root, container queries (`@container`) work without further setup.',
    ],
  },
  {
    id: 'tailwind',
    headline: 'Tailwind inside shadow DOM',
    intro:
      "Tailwind 4 compiled at runtime by the `TailwindPlugin` and injected into the component's shadow root. Existing Tailwind classes, `@theme`, and `@custom-variant` work without modification.",
    newPatterns:
      '`TailwindPlugin`, the plugin pattern for `defineComponent`, `@theme`, `@custom-variant`, `{#html content}` for raw HTML.',
    whatToNotice: [
      '`definition = await TailwindPlugin(definition)` is the plugin pattern: a function that takes a component definition, transforms it, and returns a new one. Here it compiles the Tailwind classes used in the template and injects the resulting CSS into the shadow root.',
      'Standard utility classes (`flex`, `space-y-6`, `rounded-xl`, `bg-white`, `dark:bg-gray-950`) work directly. Shadow DOM normally blocks page stylesheets, so this only works because the plugin scopes the generated CSS inside the component.',
      "`@theme` and `@custom-variant` — the Tailwind 4 directives — work inside the component's own CSS file.",
    ],
  },
  {
    id: 'dynamic-table',
    headline: 'Templates as settings',
    intro:
      'A generic table where the consumer supplies the row template via `settings`. The table owns the structural markup (`thead`, `tbody`, the iteration); the caller decides what each row looks like.',
    newPatterns: '`Template` objects passed as settings, `{>template name=var data=var}` to render them, `formatDate`.',
    whatToNotice: [
      "`rowTemplate: new Template()` is an empty default. The page replaces it via `$('dynamic-table').settings({ rowTemplate: RowTemplate })`.",
      'A `Template` is a first-class value — the same kind of thing that gets compiled from `?raw` HTML imports. It can travel through `settings` just like a string or a number.',
      'Different pages can mount the same `<dynamic-table>` with completely different row layouts without changing the table component.',
    ],
  },
  {
    id: 'external-calls',
    headline: 'Calling component methods from the page',
    intro:
      "A counter ticks once per second; the page focuses an input to pause it and blurs to resume. `$('ui-counter').component()` returns the same `self` the component uses internally, so external code can call its methods directly.",
    newPatterns:
      '`$(selector).component()`, calling `createComponent` methods from outside the component, `clearInterval(self.interval)` for manual timer cleanup.',
    whatToNotice: [
      "`$('ui-counter').component()` returns the instance built by `createComponent`. The page can call `counter.setCounter(n)`, `counter.startCounter()`, `counter.stopCounter()` — the same methods the component's own event handlers call.",
      'This is how two components communicate without a shared store: one queries for the other and calls its methods.',
      'The `interval` handle is stored on `self` (not `state`) because it is plumbing, not template data. Storing it on `state` would cause unnecessary reactive churn.',
    ],
  },
  {
    id: 'maximal',
    headline: 'The full defineComponent surface',
    intro:
      'A number adjuster that uses most of `defineComponent`. The implementation is split across multiple files to show that lifecycle hooks, settings, subtemplates, and CSS can all be authored separately and composed at the call site.',
    newPatterns:
      '`pageCSS`, `findParent()`, `onAttributeChanged`, `onThemeChanged`, `::part()` from outside the shadow DOM, splitting a component definition across files.',
    whatToNotice: [
      '`pageCSS` is CSS that escapes the shadow root and applies to the host page. Useful for styling adjacencies between component instances: `number-adjust ~ number-adjust::part(counter) { ... }`.',
      "`findParent('numberAdjust')` lets a child subtemplate reach up to its parent component and call its methods directly — child-to-parent communication without dispatching events.",
      '`onAttributeChanged(name, value)` runs when an observed attribute mutates; `onThemeChanged(darkMode)` runs when the host page toggles dark mode. Both are top-level options on `defineComponent`.',
      'The component definition is a plain JS object. `lifecycle.js`, `config.js`, and `buttons.js` each export a piece of it; `component.js` assembles them.',
    ],
  },
  {
    id: 'component-specs',
    headline: 'Spec-driven primitives',
    intro:
      "How the first-party design-system primitives are defined. A spec object lists a component's variations and states; `SpecReader` turns it into a `componentSpec` that enables three equivalent attribute syntaxes.",
    newPatterns:
      '`SpecReader`, `componentSpec`, the `{uiClasses}` class expansion, the three attribute dialects, `variations`, `states`.',
    whatToNotice: [
      'All three forms produce the same component: `<ui-widget large primary>`, `<ui-widget size="large" emphasis="primary">`, and `<ui-widget class="large primary">`. The spec system translates between them automatically.',
      '`{uiClasses}` is a computed class string that expands to the active spec attributes. In the template, `<span class="{uiClasses} widget">` becomes `<span class="large primary widget">` depending on what is set.',
      'The spec itself is a plain JS object — `variations`, `states`, `types`, `settings`, `events`. It is the source of truth that drives both the runtime behavior and (in the wider codebase) generated documentation.',
    ],
  },
  {
    id: 'advanced-keybinding',
    headline: 'Static and runtime keybindings',
    intro:
      'A search component with a fixed `ctrl + f` shortcut, `up`/`down`/`esc` navigation, and an `enter` binding that is added or removed at runtime depending on whether a result is selected.',
    newPatterns: "`bindKey`, `unbindKey`, the `'ctrl + f'` modifier syntax, dynamic keybinding inside a `reaction()`.",
    whatToNotice: [
      "`bindKey('enter', handler)` and `unbindKey('enter')` add and remove keybindings at runtime. Wrapping them in a `reaction()` makes the binding follow whatever state the reaction reads — here, `selectedIndex > -1`.",
      "Modifier keys use a plain string: `'ctrl + f'`. `shift`, `alt`, and `meta` work the same way.",
      'Static keys declared in the `keys` option coexist with dynamic ones. The `enter` binding lives on top of the static `up` / `down` / `esc` bindings.',
    ],
  },
  {
    id: 'rating-slider',
    headline: 'Drag tracking with global events',
    intro:
      'A slider you can drag past the bounds of the component. `pointerdown` on the track starts the drag; `global pointermove body` and `global pointerup body` follow the pointer anywhere on the page until it is released.',
    newPatterns: "`'global pointermove body'`, `dispatchEvent` for both `change` and `finalized`, `range()`.",
    whatToNotice: [
      "`'global pointermove body'` and `'global pointerup body'` listen on `document.body` from inside the component. The listeners are bound when the component mounts and removed when it is destroyed.",
      'Two custom events are emitted: `change` fires continuously while dragging, `finalized` fires once on release. Consumers pick whichever cadence they want.',
      '`{#each value in range(min, max + 1)}` uses the `range` helper to generate the label numbers directly in the template — no need to precompute the array.',
    ],
  },
  {
    id: 'advanced-ball-simulation',
    headline: 'Reactivity as an animation loop',
    intro:
      'A bouncing-ball simulation where the reactive system drives the render loop: a `reaction()` reads the balls array and schedules the next animation frame whenever it changes. Demonstrates that the same primitives that drive a template can drive 60 fps animation.',
    newPatterns:
      '`reaction()` as the animation driver, `peek()` for non-tracking reads, `onRendered`, runtime settings mutation, `<canvas>` integration.',
    whatToNotice: [
      '`reaction(() => { state.balls.get(); requestAnimationFrame(self.animate); })` reads the balls signal to register a dependency, then schedules a frame. `animate` mutates the balls, which re-fires the reaction, which schedules the next frame.',
      "`state.balls.peek()` reads the current value without registering a reactive dependency — used inside `animate` so writing back to `state.balls` doesn't create an infinite loop.",
      '`self.emitter` and `self.render` are stored on `self`, not `state`, because they are bookkeeping (pointer position, last frame time, FPS counter) that should not trigger renders. Rule of thumb: `state` for things the template reads, `self` for everything else.',
    ],
  },
  {
    id: 'event-data',
    headline: 'Data-driven event dispatch',
    intro:
      'One event handler, many actions. Each button carries `data-dimension` and `data-helper` attributes; the handler reads them and indexes into the signal with bracket notation to pick which mutation to perform.',
    newPatterns:
      '`state[dimension][helper](settings.delta)` bracket-notation access, single-handler dispatch via data attributes.',
    whatToNotice: [
      '`state[dimension][helper](settings.delta)` resolves to e.g. `state.width.increment(50)` when the button is `<ui-button data-dimension="width" data-helper="increment">`. The handler stays generic; the buttons encode their intent in HTML.',
      'This pattern keeps the JS short when several controls do the same thing to different signals. The alternative is one handler per button.',
    ],
  },
  {
    id: 'dropdown',
    headline: 'A form-friendly dropdown',
    intro:
      'A select-style dropdown with click-outside dismissal and a hidden `<input>` so the component participates in form submission. Demonstrates JSON in HTML attributes, dual `onChange` / `change` event notification, and `{classIf}`.',
    newPatterns:
      'Hidden `<input>` for form submission, `onChange` callback alongside `dispatchEvent`, `el.contains(event.target)`, JSON in HTML attributes, `{classIf}`.',
    whatToNotice: [
      'The dropdown emits both a `change` DOM event and an `onChange` callback. Consumers can listen with whichever style fits — `addEventListener` from HTML or a function passed through `.settings()`.',
      '`options=\'[{"value": "apple", "text": "Apple"}]\'` — when a setting\'s default is an array or object, the framework parses JSON out of the corresponding HTML attribute automatically.',
      "`{classIf isOpen 'visible'}` is the shorthand for a single conditional class. `{classMap}` is for combining several.",
      'The click-outside handler uses `el.contains(event.target)` against the host element — the same check works for shadow-root contents because the host is the root of `el`.',
    ],
  },
  {
    id: 'setting-types',
    headline: 'Setting types and coercion',
    intro:
      'A reference for what each setting type looks like at each boundary: HTML attribute, JS property, and `.settings()` call. Strings, numbers, booleans, arrays, objects, and functions are all valid setting types.',
    newPatterns:
      'Function settings, `married="false"` string-to-boolean coercion, vanilla DOM property access (`el.name = \'Simon\'`), `{greaterThan}` and `{maybe}` template helpers.',
    whatToNotice: [
      "A function is a valid setting type: `getName: () => 'Sam'`. Functions must be passed via `.settings()` or property assignment — they cannot be serialized through an HTML attribute.",
      '`married="false"` coerces to boolean `false` because the default value for that setting is a boolean. The same rule applies to numbers: `"24"` becomes `24` when the default is numeric.',
      "Settings are exposed as properties on the DOM element. `el.getName = () => 'Sam'` works without going through Query.",
    ],
  },
  {
    id: 'progress-bar',
    headline: 'Parameterized snippets',
    intro:
      'A progress bar whose label changes once it reaches 100%. The same `{#snippet label}` is rendered with and without a `canComplete` parameter to produce two variants of the same fragment.',
    newPatterns:
      'Snippet parameters (`{>label canComplete=true}`), `{#if both x y}`, the `part` attribute, dynamic class names.',
    whatToNotice: [
      'A snippet is called like a template: `{>label}` renders without arguments, `{>label canComplete=true}` passes `canComplete` into the snippet body where `{#if canComplete}` can check it.',
      '`{#if both canComplete isComplete}` is the built-in AND helper. Reads as a sentence; pairs with `either`, `neither`, `nor`.',
    ],
  },
  {
    id: 'clock',
    headline: 'SVG, intervals, and helpers',
    intro:
      'An analog clock rendered as SVG, ticking once per second. Demonstrates the `interval` helper, `state.time.now()`, and lisp-style helper calls with multiple arguments.',
    newPatterns: 'SVG inside templates, `interval()`, `state.time.now()`, nested `{#each}`.',
    whatToNotice: [
      '`interval(() => state.time.now(), 1000)` updates the time signal once per second. The interval clears automatically when the component is destroyed.',
      "`{getMarkerRotation 'major' minute}` passes a string literal and a loop variable to a helper. Multiple positional arguments work the same way `{formatDate time 'h:mm a'}` does.",
      'SVG elements work identically to HTML in templates — the same `{#each}`, expressions, and helpers apply.',
    ],
  },
];

/* Soft section break between the ordered walkthrough and the standalone pattern examples. */
export const CORE_COUNT = 7;
