/**
 * A rendering engine: the classes a template instantiates to draw itself, plus
 * the factory that builds its custom element. Engines are hot-swappable, which
 * is how the optional Lit engine replaces the native one.
 */
export interface Engine {
  /** Renderer class, instantiated once per template instance. */
  renderer: new(settings?: any) => any;
  /** Renderer class used when rendering to a string. Templates fall back to {@link renderer} without it. */
  serverRenderer?: new(settings?: any) => any;
  /** Builds the custom element class for a component definition. */
  factory?: (settings: any) => CustomElementConstructor;
}

/**
 * Registers an engine under a name templates and components can select by
 * string. `@semantic-ui/component` registers `native` on import, and `lit` when
 * the Lit engine is imported.
 * @param name - Engine name, as passed to `renderingEngine`
 * @param engine - Renderer classes and component factory
 */
export function registerEngine(name: string, engine: Engine): void;

/**
 * Looks up a registered engine, returning `undefined` when nothing claims the
 * name. Callers report the miss themselves, since the fix is an import.
 * @param name - Engine name
 */
export function getEngine(name: string): Engine | undefined;
