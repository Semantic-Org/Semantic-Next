/**
 * A rendering engine: the classes a template instantiates to draw itself, plus
 * the factory that builds its custom element. Engines are hot-swappable, which
 * is how the optional Lit engine replaces the native one.
 *
 * An element managed by an engine provides: `settings` (a reactive settings proxy),
 * `defaultSettings`, `componentSpec` (when spec-driven), `getData()`, `requestUpdate()`,
 * `isDarkMode()`, `renderRoot`, `isHydrating` (while hydrating server markup), and
 * `template`, `component`, and `dataContext` once mounted.
 */
export interface Engine {
  /** Renderer class, instantiated once per template instance. */
  renderer: new(settings?: any) => any;
  /** Renderer class used when rendering to a string. Templates fall back to {@link renderer} without it. */
  serverRenderer?: new(settings?: any) => any;
  /** Builds the custom element class for a component definition. */
  factory?: (settings: any) => CustomElementConstructor;
  /** Mounts a template into a target element or shadow root, or as a range before an anchor inside it. Calling on a prototype mounts and returns a clone. */
  mount?: (template: any, target: Element | ShadowRoot, options?: any) => any;
}

/**
 * Registers an engine under a name that templates and components can select by
 * string. `@semantic-ui/component` registers `native` on import, and `lit` when
 * the Lit engine is imported.
 * @param name - Engine name, as passed to `renderingEngine`
 * @param engine - Renderer classes and component factory
 */
export function registerEngine(name: string, engine: Engine): void;

/**
 * Looks up a registered engine by name, returning `undefined` if not found.
 * @param name - Engine name
 */
export function getEngine(name: string): Engine | undefined;

/**
 * Resolves a rendering engine from a registered name or an engine object and
 * returns it as is. Throws `engineNotRegistered` if a named engine is not
 * registered. `Template.mount` refuses an engine without that verb.
 * @param engine - Engine name or engine object
 */
export function resolveEngine(engine: string | Engine): Engine;
