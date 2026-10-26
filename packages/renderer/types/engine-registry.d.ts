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
  /** Mounts a template into an element the caller owns. A prototype mounts a clone and returns it. */
  mount?: (template: any, target: Element | ShadowRoot, options?: any) => any;
  /** Tears down what {@link mount} put in place. */
  unmount?: (template: any) => void;
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

/**
 * The engine a template renders through: an engine object as given, or the one
 * registered under a name. Throws `engineNotRegistered` when the name is unknown.
 * A missing `mount` or `unmount` is filled with a function that refuses with
 * `unsupportedEngine`, so engines may leave either out.
 * @param engine - Engine name or engine object
 */
export function resolveEngine(engine: string | Engine): Engine;
