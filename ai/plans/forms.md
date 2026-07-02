# Forms — `<ui-form>` and two-way data binding

> Status: scoped. The binding host for the schema-powered, two-way-bound component suite (the headline UI
> deliverable). Pairs with [schema-package.md](schema-package.md) (the fuel) and
> [value-schema.md](value-schema.md) (the per-component value contract). Built on `@semantic-ui/query`
> (`$`/`$$`) + `@semantic-ui/utils` `objects.js` (`get`/`set`/`unset`/`detectChanges`) + signals.

## The idea

A form two-way-binds named inputs to one document. `<ui-form doc=… schema=…>` is a thin **DOM
coordinator**, modeled on native `<form>`: it does not own or pre-register its inputs, it reads and writes
them through the DOM by `name` at the moment a value changes. The DOM is the live registry.

- **forward (input -> doc):** delegated `$(form).on('input change', '[name]', …)`. Query's delegation
  resolves the real inner control via `composedPath()`, so a named control fires, the handler reads
  `$(target).val()` + `target.name`, and writes `setValue(name, value)`. Conditional/dynamic inputs are
  free, events bubble (composed) from whatever is in the DOM.
- **reverse (doc -> input):** one reaction on the doc, on a change get the changed path(s) and
  `$$('[name="path"]').val(v)` — `$$` pierces shadow DOM, `.val()` writes web components and native
  inputs alike. One field changes, one element updates, that is the fine-grained update.
- **discovery:** children find their form with `closest('ui-form')` when they need it (initial value on
  mount); nested forms use the nearest-form rule, same as native `<form>` control ownership.

No template block, no cell factory, no AST transform, no MutationObserver. Query makes the shadow
crossing zero work in both directions (`$$` for query/set, composedPath delegation for events).

## No database first (the gradient)

A person building a web form wants a reactive document that updates as fields change, not a database.
That is the simple case and must be the most ergonomic.

1. **Ad-hoc, no db, no schema** — `<ui-form doc=state.profile>` over a plain reactive object. Fields
   two-way bind, the doc updates reactively, `hasChanged()` works, you read `get()` and do anything.
2. **+ schema** — `<ui-form doc=state.profile schema=profileSchema>` adds types, coercion (a number field
   stores a number), validation/field errors, inferred labels and widgets, computed fields.
3. **+ collection / live** — pointing the form at a live collection document makes edits sync to the db.

The db is the formalization gradient on top of a reactive doc, not a precondition.

## The element

```hbs
<ui-form doc={invoice} schema={invoiceSchema} onChange={handlers}>
  <ui-input name="client" label="Client" />
  <ui-input name="total"  label="Total" />
  {#if isDeed}
    <ui-input name="grantor" />
  {/if}
</ui-form>
```

Settings: `doc` (the bound document — a plain object, a signal, or a live collection doc; its nature is
the live/local switch), `schema` (optional — ad-hoc, a whole collection schema, or a slice),
`onChange` (a path-keyed handler map, `{ 'path': fn, 'nested.path': fn2 }`, fired after a field writes).

Non-serializable settings (`doc`, `schema`, function handlers) forward fine as properties
(`doc={invoice}`); only raw functions in attribute position hit the serialization gap, not relevant here.

## The surface

Imperative, plain language, no jargon (`getValue`/`setValue` for fields, `get`/`set` for the whole doc):

- `getValue('nested.dot.path')` / `setValue('nested.dot.path', value)`
- `get()` / `set(doc)`
- `hasChanged()` — "this form has changed, save it"
- `reset()` / `clear()` / `resetField('path')`

Deliberately absent: `draft`, `dirty`, `commit`, `discard`, `stale`. A form is just a doc.

## Live vs local, and the dominant consumption

`setValue` is the switch: a **live** collection doc writes straight to the db (two-way sync, field-granular
deltas); a **local** plain doc writes the form only. But the dominant real pattern is neither — most forms
**gather a payload and hit a server endpoint**:

```js
'click .save'() { methodCall('createClosing', self.form.get()); } // { invoice, email, user }
```

So the form is a **payload gatherer**: bind, read with `get()`, send wherever. Multi-collection payloads
fall out of a nested ad-hoc schema (`{ invoice:{…}, email:{…}, user:{…} }`, bound by `name="invoice.total"`),
the method handler splits it. `save()` (flush local changes to one collection) is a minor convenience.

## How components bind

The component contract is one line: **`value` is a signal or a value.** A signal updates with FGR (read
reactively, `.set()` on change); a plain value is set statically and emits `change`. `value` is a reserved
SETTING name, and a **base-class accessor** owns the signal-or-value + coerce + change-emit logic once, so
the ~30 inputs in the suite stay trivial. `formField` is a demoted modifier (for `ElementInternals` form
association and display-vs-input opt-out, e.g. `<ui-progress value>` is not a field). Standalone, you pass
`value=` a signal or plain value; in a form, the form imperatively sets `el.val()` and listens — the input
needs only `value` + `change`, exactly the native form-control contract, so vanilla `<input>` and web
components bind identically.

## Meta-components (rich values: address, date-range)

A subfield-cluster component (`<address-input>`, `<date-range-input>`) is a nested form scoped to a
sub-path. It renders its subfields as named controls re-rooted under its `name` (`name="address.city"`,
…); the outer form binds them at any shadow depth via `$$` + composedPath delegation, field-granular
(concurrency-safe — the dividend, and why the heritage bound `address.*` rather than one blob). Internal
transient UI (a "last 7 days" preset, an autocomplete) stays unnamed and drives the named (possibly
hidden) output controls; their composed changes reach the form. **The schema field shape makes the one
real call:** a sub-schema field -> bind the named parts (granular); an opaque value -> one named control
carrying the composite via `.val()` (atomic). The only meta-component that owns coordination is one with
genuine cross-subfield logic that must intercept before the doc write — the rare exception.

## Building it

`<ui-form>` ships through the **component-authoring workflow** (`defineComponent`), no compiler/renderer
work — this is why the component beats a template block: conditional fields, shadow crossing, and dynamic
inputs are all handled by Query at runtime, not by owning a content AST. The Tier-1 `form`/`form-field`
components (roadmap 4c) are presentation that compose with this binding (`<ui-form>` is the coordinator;
`<ui-form-field>` is chrome the form wires like any other named child).

## onChanged, the path-keyed escape hatch

A heritage-proven form-level hook: `onChanged: { 'field.path'() { ... } }`, arbitrary logic keyed by
the path that moved. The mechanics fall out of the schema engine rather than needing their own:
the recompute pass already computes the changed-path set on every write, so onChanged is a fourth
consumer of that fan (after deps, resetOn, and the wire diff) and inherits the shared path grammar
for free — relative paths, wildcards into arrays (`items.*.qty`), keyed rows. Two semantics are
load-bearing: handlers dispatch AFTER the cascade settles (side effects never interleave with
derivation), and a prior-value ctx rides the same `old()` stash the transition computeds use. It
binds at the instance level (the form / SchemaDoc), never on the shared Schema definition — a
side effect on a reused definition runs everywhere the schema is embedded, which is spooky action
the form author didn't sign up for.

## Open questions

- the `live` keyword vs doc-nature for the live/local switch (mind the collision with the freshness `live`)
- where the reverse-cycle reactivity sits (one form reaction pushing by path vs each input owning its path)
- initial-value-on-mount ergonomics (the one bit of form-awareness an input needs, via `closest`)
- `onChanged` residuals: per-path vs a `'*'` catch-all, and whether coercion runs before the handler sees the value
