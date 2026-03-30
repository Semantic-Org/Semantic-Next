# Tree-Shakeable Lit Engine

## Goal

Make the Lit rendering engine a named export that consumers opt into, not a static import that ships to everyone. A component that never imports `LitRenderer` should have zero `lit` code in its bundle.

## Design

Follow the TailwindPlugin pattern — `LitRenderer` is a re-export from `@semantic-ui/component`, imported only by consumers who need it:

```js
// Standard path — no Lit in bundle
import { defineComponent } from '@semantic-ui/component';
defineComponent({ tagName: 'my-thing', template });

// Lit path — consumer opts in
import { defineComponent, LitRenderer } from '@semantic-ui/component';
defineComponent({ tagName: 'my-thing', template, renderer: LitRenderer });
```

### Changes

1. **`define-component.js`** — Remove `import { createLitComponent }`. Accept optional `renderer` param. Default to `createComponent` (standard). The `renderingEngine` string still passes through to Template for renderer class selection.

2. **`index.js`** — Add `export { createLitComponent as LitRenderer } from './create-lit-component.js'`. Tree-shaking eliminates unused named exports.

3. **`define-component.js`** — Simplify factory selection:
   ```js
   const factory = options.renderer || createComponent;
   ```
   Remove `isLit` branching. The factory IS the engine selection.

4. **Examples** — Update todo-list and card-search to drop `renderingEngine: 'native'` since standard is now the default when no renderer is passed.

5. **Test infrastructure** — Update `RENDERING_ENGINES` in test-utils to pass factories:
   ```js
   import { LitRenderer } from '@semantic-ui/component';
   export const ENGINES = [
     { name: 'lit', renderer: LitRenderer },
     { name: 'native' },
   ];
   ```

6. **Verification** — Build a component without importing `LitRenderer`. Confirm `lit` is absent from the bundle.

### Circular Dependency Risk

None. `create-lit-component.js` imports from `lit` and `lit-web-component.js`. Component package depends on renderer package (not reverse). The re-export in `index.js` is a passthrough.

## Files Touched

- `packages/component/src/define-component.js`
- `packages/component/src/index.js`
- `packages/renderer/test/browser/test-utils.js`
- `docs/src/examples/component/todo-list/component.js`
- `docs/src/examples/component/todo-list/todo-item.js`
- `docs/src/examples/component/card-search/component.js`
- `docs/src/examples/component/card-search/card.js`

## Dependencies

- Lit Removal (complete, archived)

## Status

Scoped. Ready to execute. ~4h agent.
