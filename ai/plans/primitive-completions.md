# Primitive Completions — Finish Existing Stubs

## Goal

Several existing primitives are only partially complete or don't fully implement their specs. These need to be finished before building new components, since they're the foundation other components compose from.

## Known Incomplete Primitives

- **table** — styles need to leak into light DOM (see light-dom-styling.md). Complex theming surface.
- **dropdown** — example exists but not as a first-party primitive with spec. Fundamental form component.
- **header** — may need light DOM styling like table. Unclear if this is a component or just CSS.
- **segment** — needs finishing (per Jack)
- **divider** — needs finishing (per Jack)

## Dependencies

- Token finalization (all primitives consume tokens)
- Light DOM styling pattern (for table, header)
- Naming conventions (for new primitives being promoted from examples)

## Status

Initial scope. Individual items vary in completeness. Needs pair session to assess each primitive's gaps concretely.
