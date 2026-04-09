# SSR Implementation Plan

> Reference implementation for native SSR. Will eventually be rewritten in Rust/WASM.
> Priority: correct abstractions over performance. Code no one ever has to open again.

## Architecture (5 pieces)

### 1. Component Registry
Module-level `Map<tagName, ComponentClass>` in `packages/component/src/component-registry.js`.
Populated by `defineComponent` unconditionally (mirrors engine registry pattern).
Read only by `renderToString` during recursive expansion.
Client never queries it — `customElements` is the client-side truth.

Files:
- Create: `packages/component/src/component-registry.js`
- Modify: `packages/component/src/define-component.js` (one line: `registerComponent`)
- Modify: `packages/component/src/index.js` (export for SSR consumers)

### 2. Type-Driven Property Converters
Extend `getPropertySettings` in `component-helpers.js` with standard converters per type.
Framework provides sensible defaults. Users override via config objects in `defaultSettings`.

| Type | toAttribute | fromAttribute |
|------|------------|---------------|
| String | identity | identity |
| Number | `String(v)` | `Number(v)` |
| Boolean | loose check (existing) | loose check (existing) |
| Object | `JSON.stringify` | `JSON.parse` |
| Array | `JSON.stringify` | `JSON.parse` |
| Function | skip (`attribute: false`) | skip |
| Class instance | skip (`attribute: false`) | skip |

Also fix bug in `getProperties` (line 72): passes `defaultSettings` instead of `defaultValue`
for expert config objects.

Files:
- Modify: `packages/component/src/component-helpers.js` (`getPropertySettings`)

### 3. Attribute Escaping Fix
ServerRenderer `renderExpression` does `JSON.stringify` in attribute positions without
HTML-escaping. Fix: escape `"` → `&quot;` and `&` → `&amp;` in the `insideTag` path.

Files:
- Modify: `packages/renderer/src/engines/native/server.js` (`renderExpression`)

### 4. Converge SSR Pipelines
Enhance `renderToString` with complex prop serialization and slot handling.
Rewrite Astro `server.js` as thin adapter (~20-30 lines) that calls `renderToString`.
Delete the hand-rolled lifecycle simulation, fake params, and simplified computeUIClasses.

Files:
- Modify: `packages/component/src/render-to-string.js`
- Rewrite: `internal-packages/astro/server.js`

### 5. Recursive Nested Component Rendering
Two-phase approach inside `renderToString`:
1. ServerRenderer produces complete HTML string (expressions resolved, markers placed)
2. `expandCustomElements` scans the string for hyphenated tags, looks up registry,
   parses attributes, recursively calls `renderToString` for each nested component

Each nested component produces independent DSD with independent hydration markers.
Depth-capped to prevent infinite recursion from circular compositions.

Files:
- Modify: `packages/component/src/render-to-string.js` (add expansion phase)
- Create: `packages/component/src/expand-custom-elements.js` (HTML scanner + recursive expansion)

## Implementation Order

1. Component Registry (foundation)
2. Property converters + defaultSettings bug fix
3. Attribute escaping fix
4. Converge SSR pipelines
5. Recursive nested rendering

## Testing

- Existing: `packages/renderer/test/browser/ssr-hydration.test.js` (68 tests)
- Existing: full renderer suite (721 tests across 14 files)
- Test routes: `/test-ssr/vanilla`, `/test-ssr/component`, `/test-ssr/hydrated`, `/test-ssr/ladder`
- Progression: vanilla → component → hydrated (each narrows scope of what could be wrong)

## Chrome MCP Tab Map

| Tab | Route | JS | Purpose |
|-----|-------|----|---------|
| 1 | vanilla | on | SSR via renderToString |
| 2 | component | on | SSR via Astro renderToStaticMarkup |
| 3 | hydrated | **off** | Pure SSR output |
| 5 | hydrated | on | SSR + hydration |
