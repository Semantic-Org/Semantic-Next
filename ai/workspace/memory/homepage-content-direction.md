# Homepage Content Direction

> Date: 2026-02-06
> Status: Initial ideas, pre-comparison with existing draft
> Context: Written after deep study of SUI framework, specs, reactivity, primitives, examples, and target audience doc — deliberately without reading the current homepage to avoid bias.

---

## Target Audience Recap

From `ai/contributing/documentation/reference/target-audience.md`:
- **Experienced developers with framework fatigue** — used React/Vue/Angular/Svelte professionally, skeptical of "yet another framework"
- **Standards-minded developers** — want native platform features, burned by vanilla WC ergonomics
- **Technical evaluators** — time-constrained, scanning for differentiation, looking for red flags

**Writing approach**: Problem-first, instability language ("but", "however"), name the pain before the solution, no feature lists before establishing problems.

---

## Key Differentiators (What's Actually Novel)

These are the things that distinguish SUI from both traditional frameworks and other WC libraries. Ordered by how surprising/compelling they are to the target audience:

1. **Runtime AST compilation — no build step** — templates compile to an AST in the browser. No Babel, no Vite plugin, no `.svelte` files. Works from CDN. The compiler is the mechanism that makes the entire authoring model possible without toolchains.
2. **Full expression language in templates** — ternaries, arithmetic, inline objects/arrays, nested function calls, mixed Lisp/JS calling conventions. All reactive, all parsed at runtime. Same expressiveness as JSX without needing JSX compilation.
3. **Attribute-based API with boolean shorthand** — `<ui-button primary large>` not `<Button variant="primary" size="large" />`
4. **Spec-driven architecture** — one spec file generates runtime config, docs, types, and validation
5. **Signals reactivity that auto-unwraps in templates** — `{counter}` just works, no `.value`, no `.get()`, no `$:`
6. **Templates as first-class values** — pass a `Template` as a setting, swap it at runtime. Generic components (tables, lists) accept layout templates as data, not render props or framework-specific slots.
7. **Three dialects** — same component works with `<ui-button primary>`, `<ui-button emphasis="primary">`, or `<ui-button class="primary">`
8. **Real Web Components** — actual Shadow DOM, actual custom elements, works in any framework or none
9. **jQuery-like query API** — `$('ui-modal').component().show()`, familiar and practical
10. **Behaviors** — attach logic to any element, not just custom components

---

## Proposed Section Structure

### 1. Hero — Name the Tension

> **Web Components are the right answer. But they've never had the right framework.**
>
> Native browser components that work everywhere, without the build complexity and lock-in of framework-specific abstractions. Semantic UI gives Web Components the developer experience they've been missing — signals-based reactivity, declarative templates, and a complete widget library, all without a compile step.

The "but" validates what standards-minded developers already believe (WC are correct) while naming the pain (DX has been lacking).

### 2. Code-Forward Proof — Immediately After Hero

Show the `minimal` example (8 lines, full working component):

```js
defineComponent({
  tagName: 'current-time',
  template: `Time is <b>{formatDate time "h:mm:ss a"}</b>`,
  css: 'b { color: var(--primary-text-color); }',
  defaultState: { time: new Date() },
  onCreated({ state }) {
    setInterval(() => state.time.now(), 1000);
  },
});
```

Earns credibility with technical evaluators. Says: "the API is this clean and this is a real, working component."

### 3. UI Library Showcase — Visual Grid

First-party primitives (buttons, cards, inputs, menus, modals, icons) with the markup that creates them. Boolean shorthand is the headline:

```html
<ui-button primary>Confirm</ui-button>
<ui-button outline large>Details</ui-button>
<ui-card image="/photo.jpg" header="Title">Description</ui-card>
```

Markup that reads like English, not prop soup. This is where SUI's "semantic" identity pays off.

### 4. Differentiator Sections — Problem/Solution Pairs

**"Standards Without the Pain"**
- Problem: Vanilla WC force verbose boilerplate for basic state management
- Solution: Signals reactivity, declarative templates, Shadow DOM querying — all on actual custom elements

**"No Build Step Required" (deeper story: runtime AST compilation)**
- Problem: Modern frameworks require toolchains, compilation, and config before writing a single component
- Solution: A real template compiler runs in the browser, parsing template strings into an AST that drives efficient reactive updates. Import from CDN, define a component, use it in HTML. No webpack, no Vite plugin, no file format lock-in.
- Killer comparison: `{isActive ? 'Yes' : 'No'}` — same expression works in both React JSX and SUI templates. One requires a compiler toolchain. The other runs as-is.
- The AST is also pluggable (Lit renderer today, any engine tomorrow) and can be pre-compiled for SSR.

**"One Spec, Everything Generated"**
- Problem: Component APIs scattered — props in code, docs in markdown, types in .d.ts, validation duplicated
- Solution: Single spec declaration generates runtime config, documentation, TypeScript definitions, and attribute validation

**"Works Everywhere"**
- Problem: React components only work in React. Vue only in Vue. UI investment locked to one framework
- Solution: Standard Web Components that work in React, Vue, Angular, Astro, plain HTML — or any future framework

### 5. Template Expression Power

Show that "no build step" doesn't mean "limited templating." The expression system supports:

```html
{(value + 2) * 5}                                    <!-- Arithmetic with order of operations -->
{isActive ? 'Yes' : 'No'}                            <!-- Ternary -->
{formatDate date 'h:mm a' { timezone: timezone }}     <!-- Lisp-style with inline objects -->
{formatDate(date, 'h:mm a', { timezone: timezone })}  <!-- JS-style -->
{concat 'hello ' (isDog ? 'simon' : 'pookie')}       <!-- Mixed: Lisp + inline JS -->
{join ['a', 'b', 'c'] ', '}                          <!-- Inline arrays -->
{classMap { active: isOpen, large: size === 'large' }} <!-- Inline object expressions -->
{#each n in [1, 2, 3]}{n}{/each}                     <!-- Inline arrays in loops -->
```

Point: this kills the objection "no build step = limited mustache templates." You get JSX-level expressiveness without JSX compilation. (See `expressions-kitchen-sink` example for the full showcase.)

### 6. Reactivity Section

Show signals system as genuinely novel:

```js
state.counter.increment();
state.isOpen.toggle();
state.items.push(newItem);
state.user.setProperty('name', 'Alice');
```

```html
{counter}              <!-- No .value, no .get() -->
{#if isOpen}...{/if}   <!-- Reactive conditionals -->
{#each items}...{/each} <!-- Reactive loops -->
```

Point: signal helpers (`increment`, `toggle`, `push`, `setProperty`) eliminate the `setState(prev => ...)` pattern entirely.

### 7. Templates as First-Class Values

Show the `subtemplates-as-settings` pattern — a generic table component that accepts row templates as settings:

```js
// A table that doesn't know what rows look like
defaultSettings: {
  rowTemplate: new Template(),
  headers: [],
  rows: [],
};
```

```js
// Swap the entire row layout at runtime
$('dynamic-table').settings({ rowTemplate: SummaryRow });
// later...
$('dynamic-table').settings({ rowTemplate: StatsRow });
```

This is like render props or scoped slots, but the template is a standalone value — not a callback, not a framework abstraction. Makes generic/configurable components (tables, lists, grids) trivially composable.

### 8. Theming / Dark Mode

Visual showing same components in light/dark with:

```html
<html light>  <!-- or -->  <html dark>
```

No theme provider, no context, no wrapper components. Tokens auto-adapt.

### 9. Closing / CTA

Respect the evaluator's skepticism:

> Semantic UI is open source, standards-based, and designed to be understood in an afternoon. Read the docs, run an example, decide for yourself.

---

## What to Avoid

- No feature bullet lists before establishing problems
- No "modern", "next-gen", "revolutionary" language
- No explaining what Web Components are (audience knows)
- No gap framing ("no one has combined X and Y")
- No hand-holding tone
- No front-loaded feature lists (signals marketing material)

---

## Examples Read

10 examples studied from `docs/src/examples/` via MCP:
1. **todo-list** — subtemplates, global events, array state helpers
2. **counter** — state, `increment()`, conditionals
3. **star-rating** — settings, `classMap`, `dispatchEvent`
4. **accordion** — reactive arrays, conditional rendering
5. **dropdown** — global click-outside, dynamic classes
6. **form-builder** — validation via reactions, snippets, async submit
7. **tabs** — settings-driven state switching
8. **minimal** — 8-line component, full model demo
9. **card-search** — subtemplates, `weightedObjectSearch`, filtering
10. **product-card** — settings-only component, zero JS logic
11. **subtemplates-as-settings** — templates as first-class values, runtime swapping
12. **expressions-kitchen-sink** — full expression language showcase (ternaries, arithmetic, inline objects/arrays, mixed syntax)

Component specs read: button, input, card, modal, icon

## Next Steps

- [ ] Compare these ideas against the existing homepage draft
- [ ] Identify what's already working vs. what needs adjustment
- [ ] Refine copy based on discussion
