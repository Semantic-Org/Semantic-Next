# Schema Package — @semantic-ui/schema

> Status: **scoped** (was initial). Roadmap 2g. Mode: pair. Interlocks with [Value Schema](value-schema.md)
> (2b) and gates the data layer ([icebox](icebox/sync.md)). The field-shape language descends from
> SimpleSchema, the binding model from Meteor-era two-way forms, and the field semantics from
> `ai/research/sync/design/plan.md` §Schemas. Worked example throughout: the invoices collection in
> `ai/research/sync/examples/invoices-table/collections/invoices/`.

## What it is

One schema language with three consumers that must not depend on each other: **component values** (the
value-schema contract), **collection documents**, and **operation args**. A UI-only user gets value
schemas with zero data-layer presence. One doctrine across the framework: `componentSpec` drives every
representation of a component, the schema drives every representation of its data.

The schema is the **fuel for a two-way-bound form component suite** (see [forms.md](forms.md)) before it
is anything else. Validation and types are downstream of that. So the design bias is **metadata-light,
infer-everything, formalization gradients everywhere** (the SUI thesis applied to data): you point a
component at a schema and get a working, validated, formatted, bound form with near-zero declaration.

Schemas are optional. A schemaless collection or form works and simply loses revival, coercion,
validation, and inferred labels/widgets.

## Authoring: the field-shape language

**Constructors are the authoring idiom everywhere.** `type: String`, `Date`, `Boolean`, `Number`,
`Array`. Constructors fail loud at load (`type: Strng` is a ReferenceError, not a runtime hunt). String
names (`'string'`) exist only as the serialized projection at the wire/replay boundary. Extended types
are exported tokens from their packages, same rule, never magic strings.

```js
export const Invoices = collection('invoices', {
  schema: {
    client:    String,
    total:     Number,
    status:    { type: String, allowed: ['draft', 'open', 'closed'], default: 'draft' },
    dueDate:   Date,
    createdAt: Date,
  },
});
```

Field props, the lean set that carries essentially all real usage: `type`, `optional`, `label`,
`default`, `allowed` (the enum/options domain), plus the data-layer keys `computed`, `private`,
`serverOnly`, `unsafe`. SimpleSchema's long tail stays out: `regEx`, `minCount`/`maxCount`, `custom`,
`autoValue`, `denyInsert`/`denyUpdate`, `Integer`, `oneOf`. Each is either a validation rule that reads
better in the operation's `check` slot, where the cross-field context lives, or a job this design
already hands to `computed` and per-field `permission`.

**Inferred, not declared** (the "many things inferred" half of the thesis):
- **label** humanizes from the field key, `label` is the override
- **widget** is picked from `type` + `allowed` (calendar for a Date, select for an `allowed` set), the
  component tag or `type=` is the override
- **options** for choice inputs derive from `allowed`
- **coercion/revival** and the wire `'string'` projection come from `type`
- the **doc TS type** is inferred from the schema

**Nesting** via `schema:`, **arrays** via `type: Array` + `schema`. SimpleSchema's bracket form
(`[Schema]`, `[String]`) is familiar and reads naturally, so accept it as sugar for `type: Array,
schema:` (open: confirm during build).

**Composition is first-class.** A back-office document schema of any maturity spreads across hundreds of
subschemas, many files, and several packages, so composition is load-bearing rather than a nicety. The
idioms that ship: subschema as a `type:`, cross-file and cross-package imports, and **array-merge**
(`new Schema([Base, { extraFields }])`) for extend, following SimpleSchema's own merge form.
Object-spread of field maps does not compose field options correctly, so ship an explicit merge/extend
primitive rather than assuming `{ ...spread }` covers it. Parameterized factory subschemas and
discriminated/pivot variants are real patterns to design for (variants deferred, seam named).

## Optional-by-default, and the escape-valve cascade

**Fields are optional by default. `required: true` is the rare opt-in.** This is the deliberate
inversion of Zod/Valibot/ArkType (required-by-default). A large back-office document is *inherently
partial*: born with a handful of fields, grown over time, patched a field at a time, and mostly filled
by defaults and computeds rather than by an author. Required-by-default fights the grain of that data,
not just the wire. `Invoices.insert({ client: 'Acme' })` must succeed, not throw a thousand
missing-field errors.

The default is set by an **escape-valve cascade modeled on `Signal`** (`reactivity/src/signal.js`: a
static global default, overridable per instance). Field-option defaults are class statics, overridable
per-schema via options and per-field, resolving:

```
field.optional ?? schemaOptions.optional ?? Schema.optional   // Schema.optional defaults true
```

So an args/validation schema that wants Zod-style required-by-default flips it once
(`schema({ ... }, { optional: false })`), no per-field annotation, no separate language mode. The same
cascade carries any field-option default, with the static tier on top. The inferred TS type threads the
resolved cascade: an unmarked field infers `T | undefined`, a `required` field infers non-optional `T`,
so the type and the runtime agree and the doc-gate makes `required` trustworthy. The failure mode this
closes is a type that claims required while the runtime forces optional, which makes the types
untrustworthy everywhere they are read.

## What the schema does (the field semantics)

The mechanics (paths, change capture, reactivity) belong to `objects.js` + signals (see forms.md). The
schema supplies the **meaning** a bound field carries, and only that:

- **validate(doc | args)** to path-addressable field errors (`{ path, message }`), client-side for
  instant feedback, server-side as authority, the same schema object both halves
- **normalize / coerce** the type-driven storage round-trip (a `total: Number` field stores a number,
  not a `"$1,200.00"` string, which kills the footgun where the input *format* silently chooses the
  stored type)
- **revive** wire JSON to typed values per the schema (ISO string to `Date`), the pool boundary hydrates
- **defaults** on insert and insert-mode forms
- **doc-type inference** for consumers
- **path resolution + slice extraction** (`getFieldProps(schema, 'billing.city')`,
  `slice(schema, ['client', 'total'])`) the form layer needs both, and they are pure schema operations
- emits the **Standard Schema v1** `~standard` interface (drop-in for TanStack Form / tRPC / RHF). It is
  additive and orthogonal to authoring, so it costs the design nothing.

## Computed fields

`computed` fields are **stored, derived, and writable**, there is no virtual tier (an unstored
derivation is a helper). The body runs at write time on changed-path intersection with the field's
inputs (`deps` as the governor/skip-hint), persists in the same transaction, and the field is ordinary
thereafter (projected, synced, indexed, queryable, zero read-time cost, a stored generated column with
the expression in the schema). Overridable by default (derived values exist to be corrected). Override
state lives in a single reserved `_overrides` subdoc mirroring the field path (`a.b.c` ->
`_overrides.a.b.c: true`), queryable, one reserved key instead of a minted sibling per overridable
field. A direct write flips the flag and the derivation
stops writing until the flag clears. `overridable: false` for strictly derivation-owned fields (the
`searchText` analyzer-blob class). `serverOnly: true` elides the body from the client bundle and is
required when the compute reads any `private` field. Cross-collection deps are deferred with the seam
named (relation helpers cover the live UI case).

This is the autofill-trust affordance: complex forms where fields autofill from heuristics, the user
confidently corrects the wrong ones, derivation state is legible per field, and no correction is ever
silently clobbered by the next recompute.

## The three contexts, one language, contextual enforcement

The same schema language serves three places. Enforcement is a property of the *consumer*, not the
schema.

**Collection schema** the doc contract, **never skipped**. Every operation's write set passes through it
before commit (types, `allowed` membership, computed-write rules, `private`, per-field write
`permission`). **Writes to undeclared paths are ignored** (filtered at the gate, dev-mode logs the
dropped paths), so the collection schema is the complete write surface a reviewer can read, however
large the mutator bodies. `unsafe: true` opts a region out for deliberately loose structure.

**Operation args schema** (mutators/actions) the **optional** wire contract for an operation's
arguments: revival, unknown-key stripping, early shape errors. Distinct from the collection schema, and
ops may skip it. The pipeline is `permission -> schema -> check -> mutate|run`:

```js
Invoices.mutator('save', {
  schema: { id: String, client: String, total: Number, notes: String }, // args wire contract
  mutate(invoice, fields) { Object.assign(invoice, fields); },           // body
});

Invoices.mutator('setStatus', {
  mutate(invoice, { status }) { invoice.status = status; },              // no args schema, skipped
});
```

`schema` validates the *shape* of the args. `check` is the side-effect-free slot for the rules a shape
cannot express (cross-field invariants, balance math, presence rules for *this* operation). The split is
deliberate: presence is an operation concern, which is *why* the field default is optional, real
presence rules live in `check` or are enforced at the gate on insert, not as a per-field default.

**Form schema** ad-hoc, a whole collection schema, or a slice. Drives the binding (label, options,
validation, coercion, computed/override UI). At the component layer the schema is metadata, at the
mutation gate it is an enforced boundary, same language, contextual enforcement. The escape-valve
cascade is how a form/args context flips optional to required without touching the language.

## What is core vs registered

`@semantic-ui/schema` **core** (zero-dep, ~5KB, the three independent consumers): the field-shape
language, `validate` / `coerce` / `revive`, defaults, doc-type inference, the Standard Schema interface,
path resolution + slice extraction, the optionality cascade, the path-addressable error shape.

`@semantic-ui/data` **registers on top**: the doc-gate (enforcement), the computed recompute engine
(changed-path trigger, `_overrides`, isomorphic client/server, `serverOnly` elision), `private` wire
privacy, per-field write `permission`, the cross-collection-deps seam.

The **value layer** (forms.md) registers: input-type inference (`type` -> widget) and options-from-
`allowed`.

This is the "not special-cased for collections" mechanism: core knows nothing of the doc-gate, the
recompute engine, or binding. Each consumer registers its own keys and enforcement.

## Open questions for the build

- accept `[Schema]` / `[String]` bracket-array as sugar for `type: Array, schema:` (lean yes)
- the explicit merge/extend primitive shape (array-merge, not object-spread)
- exact `coerce`/`revive` surface and the `InferInput`/`InferOutput` (revive = decode) types story
- which field-option defaults beyond `optional` ride the cascade
