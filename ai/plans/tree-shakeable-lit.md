# Tree-Shakeable Lit Engine

## Goal

Make the Lit rendering engine tree-shakeable. A component that never imports `LitRenderer` should have zero `lit` code in its bundle. No new consumer-facing concepts — just a named export and the same `renderingEngine` option.

## Design

### Consumer API

```js
// Standard path — no Lit in bundle
import { defineComponent } from '@semantic-ui/component';
defineComponent({ tagName: 'my-thing', template });

// Lit path — import registers the engine
import { defineComponent, LitRenderer } from '@semantic-ui/component';
defineComponent({ tagName: 'my-thing', template, renderingEngine: LitRenderer });

// String still works if LitRenderer was imported anywhere in the app
defineComponent({ tagName: 'my-thing', template, renderingEngine: 'lit' });
```

`renderingEngine` accepts either the engine object or the string `'lit'`. Both resolve to the same thing because importing `LitRenderer` registers it under `'lit'` as a side effect.

This follows the framework's own philosophy: the system accepts both the thing and the name of the thing, like `primary` working as a boolean attribute or as `emphasis="primary"`.

### Engine Registry

A lightweight registry in `@semantic-ui/renderer` maps engine names to renderer classes. The native renderer is always available. Other engines register themselves on import.

```js
// packages/renderer/src/engine-registry.js
const engines = new Map();
export const registerEngine = (name, engine) => engines.set(name, engine);
export const getEngine = (name) => engines.get(name);
```

### How Registration Works

`LitRenderer` is a named export from `@semantic-ui/component`. It re-exports from an internal module that runs registration as a side-effect of module evaluation:

```js
// packages/component/src/engines/lit/register.js
import { registerEngine } from '@semantic-ui/renderer';
import { LitRenderer } from '@semantic-ui/renderer/engines/lit';
import { createLitComponent } from './factory.js';

const LitEngine = { renderer: LitRenderer, factory: createLitComponent };
registerEngine('lit', LitEngine);
export { LitEngine as LitRenderer };
```

```js
// packages/component/src/index.js
export { defineComponent } from './define-component.js';
export { LitRenderer } from './engines/lit/register.js';  // tree-shaken if never imported
```

If nobody imports `LitRenderer`, the bundler never evaluates `register.js`. Lit disappears from the bundle entirely.

### File Structure

Engines are a first-class concept. Each engine is a renderer class + a WC base class + a factory, but from the outside it's one directory — that's the engine.

The structure is designed with the SSR and Rust/WASM plans in mind. The native engine's `server.js` (SSR JS reference implementation) and the `rust/` engine (WASM SSR) will slot into this layout without reorganization.

```
packages/renderer/src/
  engines/
    lit/
      renderer.js            # LitRenderer
      directives/            # 6 AsyncDirectives
    native/
      renderer.js            # client renderer (TreeWalker + Reactions)
      server.js              # future: SSR JS reference impl (string eval, no DOM)
      dynamic-region.js
      reaction-scope.js
    rust/                    # future: SSR Phase 2
      src/                   # Rust source
      Cargo.toml
      build.js               # wasm-pack integration
      renderer.wasm          # compiled output
      index.js               # thin JS wrapper, same renderToString interface
  engine-registry.js         # registerEngine / getEngine
  expression-evaluator.js    # shared across all engines
  build-html-string.js       # future: extracted from renderer.js, shared by client + server

packages/component/src/
  engines/
    lit/
      base.js                # LitWebComponentBase extends LitElement
      factory.js             # createLitComponent
      register.js            # side-effect registration, re-exported as LitRenderer
    native/
      base.js                # WebComponentBase extends HTMLElement
      factory.js             # createComponent
  component-helpers.js       # shared across engines
  define-component.js
  index.js
```

The native client and server paths diverge after `buildHTMLString`:

```
buildHTMLString(ast) → entries[] + htmlString
                            ↓
            ┌───────────────┴───────────────┐
         Client                          Server
    parseHTML(htmlString)         evaluateInline(htmlString, entries)
    bindMarkers(fragment)         wrap in DSD
    TreeWalker + Reactions        → pure string out
    → live DOM
```

The Rust engine replaces the server path with WASM — same interface (`renderToString`), same `buildHTMLString` contract, different execution environment.

The Lit engine may sit there unused by most consumers and that's fine — it's a peer engine for the person who needs it, not a deprecation path. The architecture supports it at near-zero cost.

### Changes

1. **`packages/renderer/src/engine-registry.js`** — New file. `registerEngine` / `getEngine`. ~5 lines.

2. **`packages/renderer/src/`** — Move `lit/` and `native/` into `engines/`. Update internal imports.

3. **`packages/renderer/src/index.js`** — Export registry + native renderer only from main entry. Lit exports available via `engines/lit/`.

4. **`packages/component/src/`** — Move base classes and factories into `engines/`. Create `engines/lit/register.js` for side-effect registration.

5. **`packages/component/src/index.js`** — Add `export { LitRenderer } from './engines/lit/register.js'`.

6. **`packages/component/src/define-component.js`** — Remove static `import { createLitComponent }`. Resolve factory from engine object or registry:
   ```js
   const engine = typeof renderingEngine === 'object'
     ? renderingEngine
     : getEngine(renderingEngine);
   const factory = engine?.factory || createComponent;
   ```

7. **`packages/templating/src/template.js`** — Remove static `import { LitRenderer } from '@semantic-ui/renderer'`. Resolve renderer class from engine object or registry:
   ```js
   import { Renderer, getEngine } from '@semantic-ui/renderer';

   // in initialize():
   let RendererClass = Renderer;
   if (this.renderingEngine && this.renderingEngine !== 'native') {
     const engine = typeof this.renderingEngine === 'object'
       ? this.renderingEngine
       : getEngine(this.renderingEngine);
     if (!engine) {
       fatal(`Renderer "${this.renderingEngine}" not registered.`
         + ` Import LitRenderer from '@semantic-ui/component'.`);
     }
     RendererClass = engine.renderer;
   }
   this.renderer = new RendererClass({ ... });
   ```

8. **Examples** — Update todo-list and card-search to drop `renderingEngine: 'native'` since native is now the default.

9. **Test infrastructure** — Update `RENDERING_ENGINES` in test-utils to import `LitRenderer` (triggering registration) and test both the object and string forms.

10. **Verification** — Build a component without importing `LitRenderer`. Confirm `lit` is absent from the bundle.

### Docs Site / SSR

The docs site imports `LitRenderer` once in its entry point. All 14 primitives continue using `renderingEngine: 'lit'` (string) with zero changes. When native SSR lands, the docs site drops that one import and everything flips to native.

### Propagation

`renderingEngine` (whether string or object) propagates through `Template.clone()` to subtemplates, same as today. No change needed — the value just flows through.

## Dependencies

- Lit Removal (complete, archived)

## Status

Scoped. Ready to execute. ~6-8h agent.
