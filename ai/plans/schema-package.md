# Schema Package — @semantic-ui/schema

## Goal

Extract the schema language into a standalone package serving three consumers that must not depend on each other: component values (the Value Schema contract), collections, and operation args in the future data layer. UI-only users get value schemas with zero data-layer presence. One doctrine across the framework: `componentSpec` drives every representation of a component, the schema drives every representation of its data.

## Design

The language is largely decided — full decision record in [`ai/research/data-sync/plan.md`](../research/data-sync/plan.md) §Schemas:

- Constructor types are the authoring idiom (`type: String`, `Date`, `Boolean`, `Array`), string names exist only as the serialized projection. Extended types are exported package tokens, never magic strings.
- Fields are optional by default (`required: true` is the rare opt-in). Nesting via `schema:`, arrays via `type: Array` + `schema`, composition (fragments, spreads, cross-package imports) is first-class.
- `computed` fields are stored, derived, writable-with-override (`_overrides` subdoc, mirrored nesting), with `deps` as the reactivity governor and `serverOnly` for server-confined derivations.
- `private: true` is wire privacy. Field-level write `permission` tokens are confirmed (2026-06-12) — the write-side twin of `private`, checked at the doc gate so shared mutators inherit per-field authorization from the schema.
- The doc gate filters: writes to undeclared paths are ignored (dev-logged), `unsafe: true` marks loose regions.
- Standard Schema v1 interface for ecosystem interop. Path-addressable field errors.

## Open Questions

- Reconciliation with the Value Schema plan's "metadata, not a validation boundary" framing — same language, contextual enforcement.
- Standard Schema emission details and the types story.
- Which data-layer-specific keys (`computed`, `private`, `unsafe`) live in core vs are registered by `@semantic-ui/data`.

## Dependencies

- Interlocks with [Value Schema](value-schema.md) (2b) — same language, the form-component contract is the first consumer.
- Gates the data layer ([icebox](icebox/data-sync.md)) — collections and operation args consume it post-1.0.

## Status

Initial scope. Language decisions made during the data-sync design sessions (June 2026); packaging and the value-schema reconciliation need a pair session.
