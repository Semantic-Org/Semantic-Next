# Framework Evaluation: Semantic UI Next

Evaluated by an AI agent seeing this framework for the first time, based on reading all 373 source files across the `component/`, `framework/`, and `templates/` example directories.

---

## 1. Framework Mental Model

### Core Architecture

This is a web component framework built on Custom Elements. A component is defined by calling `defineComponent()` with a configuration object, which registers a custom element (when `tagName` is provided) or returns a template for use as a subtemplate (when no `tagName` is given).

### Component Anatomy

A component consists of up to six concerns:

1. **Template** (`.html`) -- A custom templating language with `{expression}` syntax, supporting conditionals (`{#if}`), loops (`{#each}`), async blocks (`{#async}`), snippets (`{#snippet}`), subtemplates (`{>name}`), raw HTML (`{#html}`), and rerender/guard blocks.

2. **CSS** (`.css`) -- Scoped styles using shadow DOM. Uses `:host` for the component root. CSS custom properties (`--var-name`) provide the theming system. Container queries are used for responsive layouts.

3. **JavaScript** (`.js`) -- The component definition including:
   - `defaultSettings` -- External configuration passed via HTML attributes or `$().settings()`. Attributes are lowercased in HTML (e.g., `startingNumber` becomes `startingnumber`).
   - `defaultState` -- Reactive internal state. Each state property becomes a signal with methods like `.get()`, `.set()`, `.increment()`, `.toggle()`, `.push()`, etc.
   - `createComponent` -- A factory function receiving a destructured context object (`{ self, $, state, settings, reaction, signal, dispatchEvent, ... }`) and returning an object of methods and properties that merge into the template's data context.
   - Lifecycle hooks: `onCreated`, `onRendered`, `onDestroyed`, `onThemeChanged`, `onAttributeChanged`.
   - `events` -- A declarative event map using string selectors like `'click .button'`, `'global click body'`, `'deep contextmenu .trigger'`.
   - `keys` -- A declarative keybinding map.
   - `subTemplates` -- Named child templates imported from other files.
   - `componentSpec` -- An optional spec-driven system for declarative attribute/class mapping.

4. **Page HTML** (`page.html`) -- The host page that uses the component as a custom element.

5. **Page JS** (`page.js`) -- External code that interacts with the component using `$()` (a jQuery-like Query API).

6. **Page CSS** (`pageCSS`) -- Styles applied at the document level alongside the component.

### Data Model

The data context for templates is a **flat merged namespace**. Settings, state, and values returned from `createComponent` are all accessible by name without prefix. For example, if `defaultSettings` has `name` and `defaultState` has `counter` and `createComponent` returns `{ getLabel() }`, the template can use `{name}`, `{counter}`, and `{getLabel}` directly.

State properties are reactive signals that auto-unwrap in templates. In JavaScript code, you use `.get()` to read and `.set()` to write. Signals have convenience methods: `.increment()`, `.decrement()`, `.toggle()`, `.push()`, `.clear()`, `.now()` (for dates), `.peek()` (non-reactive read), `.getIndex()`, `.setIndex()`, `.getItem()`, `.replaceItem()`, `.removeItem()`, `.setProperty()`, `.setArrayProperty()`, `.filter()`.

Settings are reactive by direct property assignment (`settings.name = value`) or by calling `$('component').settings({...})` from outside.

### Template Language

The template language supports two expression syntaxes:
- **Lisp-style**: `{functionName arg1 arg2}`, `{concat 'hello' ' ' 'world'}`, `{formatDate date 'YYYY-MM-DD'}`
- **JavaScript-style**: `{value + 2 * 5}`, `{items.filter(i => i.active).length}`, `{status === 'active' ? 'yes' : 'no'}`

These can be mixed: `{concat 'Result: ' (value > 10 ? 'high' : 'low')}`.

Built-in helpers include string manipulation (`concat`, `capitalize`, `titleCase`, `truncate`), comparisons (`is`, `greaterThan`, `lessThan`), logical (`exists`, `hasAny`, `both`, `either`, `not`, `maybe`), CSS class helpers (`classMap`, `classIf`, `activeIf`, `selectedIf`, `disabledIf`), date formatting (`formatDate`, `formatTime`), array helpers (`count`, `first`, `last`, `join`, `range`), and reactivity helpers (`guard`, `nonreactive`).

### Composition

Components compose through:
- **Custom element nesting** -- `<my-child>` inside a parent template.
- **Subtemplates** -- Defined via `defineComponent()` without a `tagName`, imported and registered in `subTemplates: { name }`, invoked via `{>name prop=value}`.
- **Snippets** -- In-file template fragments defined with `{#snippet name}...{/snippet}`, invoked with `{>name prop=value}`.
- **Slots** -- Standard `<slot>` / `{>slot}` for content projection.
- **Dynamic templates** -- `{> template name=settingName data=rowData}` for runtime template selection.

### External Interaction

The `$()` Query API provides jQuery-like DOM manipulation that is shadow DOM-aware. Components can be accessed externally via `$('my-component').settings({...})`, `$('my-component').component()` (returns the `createComponent` instance), and standard DOM events dispatched with `dispatchEvent('eventName', detail)`.

---

## 2. Ergonomics Assessment

### What Works Well

**Flat data context is genuinely nice.** Not having to write `{state.counter}` or `{this.settings.name}` removes a lot of noise. For an AI agent generating templates, fewer prefixes means fewer opportunities for errors.

**Signal mutation methods are excellent.** `state.counter.increment()`, `state.checked.toggle()`, `state.items.push(item)` are more expressive and less error-prone than the get-mutate-set pattern. These read naturally and are hard to misuse.

**The event system is well-designed.** The `'click .button'` string syntax is compact and familiar. The destructured handler arguments (`{ self, state, data, event, value, target }`) provide everything needed without ceremony. The `data` property auto-collecting `data-*` attributes is clever and practical.

**CSS scoping via shadow DOM just works.** No special conventions needed, no CSS-in-JS, no module system. Just write CSS. Container queries for responsive behavior instead of media queries is forward-looking and correct.

**The `classMap` pattern is clean.** Returning an object `{ active: true, disabled: false }` and having it produce `"active"` as a class string is exactly what you want.

**`getText()` for loading template/CSS files is straightforward.** The file co-location pattern (component.js, component.html, component.css) is predictable and scannable.

**Lifecycle hooks are simple.** `onCreated`, `onRendered`, `onDestroyed` with the same destructured context as `createComponent` is easy to learn and use.

### What Is Error-Prone

**The dual expression syntax (Lisp + JS) is a trap.** When should I write `{formatDate date 'YYYY-MM-DD'}` vs `{formatDate(date, 'YYYY-MM-DD')}`? The kitchen-sink example shows both work, but the interaction between them is unclear. Can I use Lisp-style helpers inside JS expressions? The answer appears to be yes (via parenthesized subexpressions), but the rules are not self-evident from the examples.

**Settings vs state distinction is confusing in practice.** Some examples use `defaultSettings` for values that change (`settings.number--` in lifecycle.js), while others use `defaultState`. The ball-simulation uses `settings.speed = value / 100` as a reactive assignment, but the color-picker uses `state.selectedColor.value = color`. The boundary between "external configuration" and "internal reactive state" is blurry, and both appear reactive in different ways.

**`state.property.value = x` vs `state.property.set(x)`** -- Both appear in the examples (color-picker uses `.value =`, most others use `.set()`). This inconsistency will cause agent confusion about the canonical way to update state.

**The `this` vs `self` confusion.** Most `createComponent` methods use `self` (from the destructured context), but `getPointerPosition` in the ball simulation uses `this.getCanvas()`. The relationship between `this` and `self` inside `createComponent` methods is unclear.

**Attribute name casing.** HTML attributes are case-insensitive, so `startingNumber` becomes `startingnumber` in HTML. The examples show this (`<ui-counter startingnumber="50">`) but it means the attribute name in HTML does not match the setting name in JavaScript. Some examples use kebab-case (`initial-value`, `emit-rate`), which presumably maps to camelCase in JS. This mapping is implicit and the examples are inconsistent about it.

**Snippet data scoping.** When a snippet is invoked with `{>snippetName prop=value}`, the snippet receives those props. But snippets also appear to access the parent data context (e.g., the `row` snippet in the table component accesses `{company}` which comes from the parent's settings). The scoping rules are not obvious.

### What Is Confusing or Ambiguous

**`initialize()` in createComponent vs `onCreated`.** Both exist. `initialize()` appears to be a special method name called automatically from `createComponent`, while `onCreated` is a lifecycle hook. The timing and purpose difference is unclear from the examples alone.

**Multiple event syntaxes.** Events can be declared as `'click .button'({ self }) { ... }` (method shorthand) or `'click .button': ({ self }) => ...` (arrow function). Both appear in examples, sometimes mixed in the same file.

**The `{>slot}` vs `<slot>` distinction.** Some examples use `{>slot}` (dynamic-breakpoints component.html, checkbox component.html) while the spec-driven components use `<slot></slot>`. Whether these are equivalent or different is unclear.

**`reaction()` purpose and lifecycle.** Reactions are used in `createComponent` to set up reactive side effects, but the cleanup/disposal behavior is not demonstrated. The ball-simulation creates reactions in `startAnimation()` -- are these disposed when the component is destroyed?

**Async templates.** The `{#async methodName arg as result}` syntax is powerful but the interaction with reactivity is unclear. When `arg` changes, does the async block re-execute? The search example suggests yes (passing `searchTerm`), but the lifecycle isn't explicitly shown.

---

## 3. What's Missing

**Error handling patterns.** Only one example shows try/catch (form-builder's `submitForm`). No examples show how errors propagate through the component tree, how to display error boundaries, or how to handle failed async operations beyond the `{error}` block in async templates.

**Component communication patterns beyond events.** There is `findParent()` used in two examples (maximal buttons, subtemplate row), and `dispatchEvent` for child-to-parent communication. But there are no examples of sibling communication, shared state management, or context/provider patterns.

**Testing patterns.** Zero test files in the example set. For an agent writing components, knowing how to test them is critical.

**TypeScript support.** All examples are plain JavaScript. No type annotations, no `.ts` files, no indication of how TypeScript would work.

**Form binding.** The temperature converter does manual two-way binding (`'input .celsius'` event sets state, state value in template). There is no shorthand for two-way binding (no `bind:value` or `v-model` equivalent demonstrated).

**Animation/transition primitives.** The ball simulations and fireworks use raw canvas. The only CSS transition examples use standard CSS transitions. No framework-provided transition/animation system is shown.

**Routing.** The todo-list uses `window.location.hash` manually. No routing abstraction is demonstrated.

**Server-side rendering details.** The color-palette component checks `isServer` to skip `getComputedStyle`, suggesting SSR exists, but no SSR-specific examples are provided.

**Cleanup patterns for intervals/timeouts.** Several examples create `setInterval` or `setTimeout` but only a few show cleanup in `onDestroyed`. The counter lifecycle example has `clearInterval` but the settings counter does not. This is a common source of memory leaks.

**Accessibility patterns.** Very few examples include ARIA attributes. The dropdown uses `role="menu"` and `role="menuitem"`, but most other interactive components lack accessibility markup.

---

## 4. Improvement Suggestions

### For Agent-Generated Code

**1. Standardize the settings mutation API.** Settle on one way to update settings reactively. Currently examples show `settings.number--`, `settings.color = color`, `settings.speed = value / 100`, and `$().settings({...})`. For agent code generation, a single canonical pattern reduces errors.

**2. Eliminate the `this`/`self` ambiguity.** Either always use `self` (and document that `this` is undefined/unreliable in `createComponent` methods) or always use `this`. The current mixing will cause agents to generate code that works inconsistently.

**3. Document the `initialize()` convention explicitly.** If `initialize()` is a reserved method name that gets called automatically, it should be part of the `defineComponent` API (like lifecycle hooks) rather than a magic method name buried in `createComponent`. This would make it discoverable and less error-prone.

**4. Add a linter or validator for template expressions.** The dual Lisp/JS syntax means many expressions are syntactically valid but semantically wrong. A template validator (I see `mcp__semantic-ui__validate_template` exists) that catches common mistakes would prevent silent failures.

**5. Standardize on one loop syntax.** The examples show `{#each items}`, `{#each item in items}`, `{#each items as item}`, and `{#each item, index in items}`. While flexibility is nice for humans, an agent should use exactly one form. I would recommend `{#each item in items}` as the canonical form since it reads naturally and supports the index variable.

**6. Make attribute-to-setting name mapping explicit.** If `initial-value` maps to `initialValue`, document this transformation rule prominently. Currently an agent has to guess whether to use kebab-case or lowercase in HTML attributes.

**7. Provide canonical "empty" patterns.** Several examples have empty `createComponent` functions (`const createComponent = ({ state }) => ({})`) and empty `defaultState` (`const defaultState = {}`) that add noise. If these are optional, the examples should omit them rather than showing empty versions.

### For Human Readability

**8. Reduce boilerplate in file loading.** Every component starts with `const css = await getText('./component.css'); const template = await getText('./component.html');`. This is 100% predictable and could be inferred from convention (if the files exist, load them). A convention-over-configuration approach would reduce visual noise.

**9. The `{#html '{expression}'}` pattern for showing template source is ugly.** The expressions-basic example uses `{#html '{name}'}` to display the literal text `{name}` in a code block. This works but is confusing to read. An escape syntax like `\{name\}` or a dedicated `{#raw}` block would be cleaner.

### For Safety Against Silent Failures

**10. Warn on undefined template variables.** If a template references `{nonExistentVar}`, it should produce a visible warning rather than silently rendering nothing. This is the single most common source of bugs in template-based frameworks.

**11. Warn on unused settings.** If `defaultSettings` defines properties that are never referenced in the template or `createComponent`, that likely indicates a naming mismatch.

---

## 5. Bug Audit

### Confirmed Bugs

1. **Typo: `clearTimouet` in ball-simulation.js (line 142)**
   - File: `/tmp/fw-examples/component/ball-simulation/ball-simulation.js`
   - `clearTimouet(self.timer)` should be `clearTimeout(self.timer)`. This will throw a ReferenceError when the component is destroyed.

2. **CSS syntax error in page.css (dynamic-breakpoints)**
   - File: `/tmp/fw-examples/framework/styling/dynamic-breakpoints/page.css`, line 17
   - `background-color: var(--standard-5););` has a trailing `);` that is invalid CSS.

3. **Duplicate CSS property `color` in progress-bar component.css**
   - File: `/tmp/fw-examples/component/progress-bar/component.css`, line 33
   - `.label` has `color: color: var(--text-color);` -- doubled `color:` keyword.

4. **Duplicate `.small` CSS rule in progress-bar component.css**
   - File: `/tmp/fw-examples/component/progress-bar/component.css`, lines 106-117
   - `.small` is defined twice. The second definition (setting `--progress-height: 14px`) overwrites the first (`--progress-height: 8px`), making the "small" size actually 14px.

5. **Mismatched HTML tag in form-builder component.html**
   - File: `/tmp/fw-examples/component/form-builder/component.html`, line 91
   - `<ui-button class="reset">Reset</button>` -- opens as `<ui-button>` but closes as `</button>`.

6. **Unused import in ball-simulation.js**
   - File: `/tmp/fw-examples/component/ball-simulation/ball-simulation.js`, line 2
   - `clone` is imported from `@semantic-ui/utils` but never used.

7. **Missing `getText` import in test-element component.js**
   - File: `/tmp/fw-examples/framework/complex/test-element/component.js`, line 2
   - Uses `await getText('./component.css')` but only imports `defineComponent` from `@semantic-ui/component`. `getText` is not imported.

8. **page.js listens on wrong selector in color-picker**
   - File: `/tmp/fw-examples/component/color-picker/page.js`, line 3
   - Listens for `'color-selected'` on `$('advanced-color-picker')` but the component defined is `'color-picker'`, not `'advanced-color-picker'`. This event listener will never fire.

9. **`state.tabIndex.value` used instead of `.get()` in tabs component**
   - File: `/tmp/fw-examples/component/tabs/component.js`, line 21
   - `getTabContent()` uses `settings.tabs[state.tabIndex.value]?.content` -- accessing `.value` directly instead of using `.get()`. This may not be reactive. Two lines above, `maybeActive` correctly uses `state.tabIndex.get()`.

### Code Smells

10. **Inconsistent `state.property.value =` vs `state.property.set()`**
    - File: `/tmp/fw-examples/component/color-picker/color-picker.js`, line 16
    - Uses `state.selectedColor.value = color` while every other example uses `.set()`. This may work but is inconsistent and could indicate a different (possibly deprecated) API.

11. **CSS variable syntax error in card-search component.css**
    - File: `/tmp/fw-examples/component/card-search/component.css`, line 3
    - `--card-min: var(250px);` -- `var()` wrapping a literal value is incorrect. Should be `--card-min: 250px;`.

12. **`data.index` is a string in some event handlers**
    - File: `/tmp/fw-examples/component/context-menu/component.js`, line 204
    - `parseInt(data.index, 10)` is used because `data.index` comes from a `data-index` attribute (which is always a string). Other examples use `data.index` directly without parsing. The inconsistency suggests some handlers may be comparing strings to numbers incorrectly.

13. **Missing interval cleanup in multiple components**
    - `/tmp/fw-examples/framework/lifecycle/counter/component.js` -- `setInterval` in `initialize()` with no corresponding `clearInterval` in `onDestroyed`.
    - `/tmp/fw-examples/framework/settings/component.js` -- same issue.
    - `/tmp/fw-examples/templates/template-reactivity/component.js` -- `setInterval` in `onCreated` with no cleanup.
    - `/tmp/fw-examples/templates/global-helpers/component.js` -- `setInterval` in `initialize()` with no cleanup.
    - `/tmp/fw-examples/framework/minimal/component.js` -- `setInterval` in `onCreated` with no cleanup.
    - These will leak intervals if the component is removed from the DOM and re-added.

14. **`getPointerPosition` uses `this` instead of `self`**
    - Files: `/tmp/fw-examples/component/ball-simulation/ball-simulation.js` line 113, `/tmp/fw-examples/component/advanced-ball-simulation/component.js` line 264, `/tmp/fw-examples/component/fireworks-display/component.js` line 195
    - These methods use `this.getCanvas()` while all other methods in the same component use `self.getCanvas()`. This suggests `this` might work in event handler contexts but is not the intended pattern.

15. **Empty `initialize()` method in context-menu**
    - File: `/tmp/fw-examples/component/context-menu/component.js`, line 21
    - `initialize() {}` -- empty method body serves no purpose. Should be removed.

16. **Redundant `pointer-events: auto` in context-menu CSS**
    - File: `/tmp/fw-examples/component/context-menu/component.css`, line 27
    - `pointer-events: auto` is declared twice in the `.menu.visible` rule.

17. **Unused `items` variable in context-menu**
    - File: `/tmp/fw-examples/component/context-menu/component.js`, lines 87 and 93
    - `const items = settings.items;` is declared but only `settings.items` is used for the modulo calculation.

18. **Empty files for several template examples**
    - Multiple files across `slots-default`, `slots-named`, `subtemplates-dynamic`, `subtemplates-reactivity`, and `lifecycle/lifecycle-arguments` contain only empty lines. These are incomplete examples that demonstrate nothing.

19. **No export in some components that might need it**
    - Some components export (`export const BallSimulation = defineComponent(...)`) while most do not. There is no clear pattern for when to export vs not. This inconsistency makes it unclear whether the export is meaningful for the framework's operation.

20. **`formatScore` defined with `createComponent()` method syntax instead of factory**
    - File: `/tmp/fw-examples/templates/expressions-javascript/component.js`, line 29
    - Uses `createComponent() { return { ... } }` (method shorthand on the definition object) instead of the `createComponent: ({ ... }) => ({...})` pattern used everywhere else. Both may work, but this is the only example using the method form, which receives no destructured context.

### Anti-Patterns

21. **Hardcoded colors in todo-list CSS.** The todo-list CSS hardcodes colors like `#4d4d4d`, `#e6e6e6`, `#777` instead of using the framework's CSS custom properties. The dark mode section then uses `@container style(--dark-mode: true)` to override them. This defeats the purpose of the theming system.

22. **Direct DOM manipulation alongside reactive templates.** Several examples mix `$('.element').text()` / `$('.element').html()` (imperative DOM updates) with reactive template rendering. The `page.js` files often do this to interact with components from outside, but the rating-slider page.js builds HTML strings manually rather than using template reactivity.

23. **Kitchen-sink expression example as a maintenance burden.** The `expressions-kitchen-sink` example tests many expression edge cases but includes IIFE expressions (`{(() => { ... })()}`) that no one should write in a template. Including these in examples implicitly endorses the pattern.

24. **State used for static data in helpers-array.** `defaultState` includes `formatKeyValue` (a function) alongside actual state values. Functions are not state. This suggests the data model conflates static data with reactive state.

25. **Loose `==` comparisons scattered across examples.** Multiple files use `==` instead of `===` (e.g., `filter != 'all'`, `event.type == 'mouseover'`, `data.divider === 'true'` next to `data.index` used as a number). This is a classic JavaScript footgun.
