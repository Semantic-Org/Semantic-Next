import type { Query } from '@semantic-ui/query';
import type { Signal } from '@semantic-ui/reactivity';
import type { Template } from '@semantic-ui/templating';

/**
 * Configuration for a single component property.
 * Produced by {@link WebComponentBase.getPropertySettings} and stored on the
 * generated class under `config.resolvedProperties`.
 */
export interface PropertyConfig {
  /** Constructor used to coerce the attribute value (`String`, `Number`, `Boolean`, `Object`, `Array`, `Function`). */
  type?: unknown;
  /** Whether the property is observed as an attribute. `false` makes it property-only. */
  attribute?: boolean | string;
  /** Decides whether a new value should trigger a re-render. */
  hasChanged?: (value: any, oldValue: any) => boolean;
  /** Attribute to property conversion for non-string types. */
  converter?: {
    fromAttribute?: (value: string | null, type?: unknown) => any;
    toAttribute?: (value: any) => string | null;
  };
  /** Skip generating a get/set accessor pair on the prototype. */
  noAccessor?: boolean;
  /** Marks a kebab-case or lowercase spelling that forwards to a canonical property. */
  alias?: boolean;
  /** Canonical property name this alias forwards to. */
  aliasFor?: string;
}

/**
 * Static configuration the engine factory stores on the generated component class.
 * `WebComponentBase` reads it through `this.constructor.config`.
 */
export interface ComponentConfig {
  /** Property definitions resolved from `defaultSettings`, `properties`, and the component spec. */
  resolvedProperties?: Record<string, PropertyConfig>;
  /** Component spec driving `{uiClasses}` and attribute alias resolution. */
  componentSpec?: any;
  /** Default settings declared in `defineComponent`. */
  defaultSettings?: Record<string, any>;
  /** Shadow DOM styles for the component. */
  css?: string;
  /** Whether this is the plural form of a spec-driven component. */
  plural?: boolean;
  /** Callback invoked when an observed attribute changes. */
  onAttributeChanged?: (attributeName: string, oldValue: string | null, newValue: string | null) => void;
}

/** Options accepted by {@link WebComponentBase.getProperties}. */
export interface GetPropertiesOptions {
  /** Explicit property definitions. When non-empty these are used verbatim. */
  properties?: Record<string, PropertyConfig>;
  /** Default settings to derive property definitions from. */
  defaultSettings?: Record<string, any>;
  /** Component spec to derive attribute-backed property definitions from. */
  componentSpec?: any;
}

/**
 * Base class for Semantic UI web components on the native engine.
 * Extends `HTMLElement` directly, with no framework dependency.
 * You typically won't extend this class directly - use `defineComponent` instead.
 * @see {@link https://next.semantic-ui.com/docs/api/component/web-component-base WebComponentBase API Reference}
 */
export declare class WebComponentBase extends HTMLElement {
  /**
   * Initializes the element's property store, default settings, reactive settings proxy,
   * and spec-driven `uiClasses`. Called by the constructor for custom elements and by
   * `upgradeElement` when mounting onto a plain element.
   */
  construct(options?: {
    isLightDOM?: boolean;
    renderRoot?: ShadowRoot | Element;
  }): void;

  /**
   * Replays initial observed attributes through `attributeChangedCallback` and starts a
   * `MutationObserver` for subsequent attribute changes on light DOM elements.
   */
  setupAttributeObserver(attributes?: string[], options?: { callImmediately?: boolean; }): void;

  /**
   * Prototype template every instance clones from.
   * Set by the engine factory on the generated subclass.
   */
  static template: Template;

  /** Whether the shadow root is created with `delegatesFocus`. */
  static delegatesFocus: boolean;

  /**
   * Resolved configuration for the generated subclass.
   * @see {@link ComponentConfig}
   */
  static config: ComponentConfig;

  /** Property definitions keyed by camelCase property name. */
  static properties: Record<string, PropertyConfig>;

  /** Attributes reported to the browser so they reach `attributeChangedCallback`. */
  static readonly observedAttributes: string[];

  /** Tag name the class was registered under. Only set when `defineComponent` received a `tagName`. */
  static componentTagName?: string;

  /** Serializable form of the component's template definition. */
  static toDefinition?: () => Record<string, any>;

  /** Builds property definitions from explicit properties, default settings, and the component spec. */
  static getProperties(options: GetPropertiesOptions): Record<string, PropertyConfig>;

  /** Builds the definition for a single property, including the attribute converter for its type. */
  static getPropertySettings(options?: {
    /** Attribute name for the property. */
    name?: string;
    /** Constructor or spec type name. Defaults to `String`. */
    type?: unknown;
    /** Skip the attribute, exposing the value as a property only. */
    propertyOnly?: boolean;
  }): PropertyConfig;

  constructor();

  /** The template instance for this element, created on first render or hydration. */
  template?: Template;

  /** The component instance returned by `createComponent`. */
  component: Record<string, any>;

  /** The merged data context used for template rendering. */
  dataContext: Record<string, any>;

  /** Shadow DOM styles adopted by this element. */
  css: string;

  /** Component spec driving `{uiClasses}` and attribute alias resolution. */
  componentSpec: any;

  /**
   * Settings proxy. Reading a key registers a Signal dependency, so settings
   * stay reactive even when destructured into a callback's arguments.
   */
  settings: Record<string, any>;

  /** The root the template renders into: `shadowRoot` for a custom element, the mount target for a light DOM mount. */
  renderRoot?: ShadowRoot | Element;

  /** Current property values, backing the accessors the factory installs. */
  properties: Map<string, any>;

  /** True when mounted onto a light DOM element via `Template.mount()`. */
  isLightDOM?: boolean;

  /** True when instantiated as a registered custom element, `false` when mounted onto a plain element. */
  isCustomElement?: boolean;

  /** True between declarative shadow DOM parsing and the end of `hydrate`. */
  isHydrating?: boolean;

  /** Mounts a template into this element's renderRoot. */
  mount(template: Template, options?: { data?: Record<string, any>; signal?: AbortSignal; }): Template;

  /** Tears down the mounted template and restores the element if it borrowed its prototype from `upgradeElement`. */
  unmount(): void;

  /** Computes the `{uiClasses}` string. Only present for spec-driven components. */
  uiClasses?: () => string | undefined;

  /** Default settings storage, merged from `defaultSettings` and spec default values. */
  protected defaultSettings: Record<string, any>;

  /** Signals backing the settings proxy, keyed by setting name. */
  protected settingsVars: Map<string, Signal<any>>;

  /** Called when the element is added to the document. Renders or hydrates. */
  connectedCallback(): void;

  /**
   * Whether server-rendered shadow content carries markers this build understands.
   * Content with a mismatched marker version is discarded and re-rendered.
   */
  canHydrate(): boolean;

  /** Wires reactive bindings to server-rendered shadow DOM without re-creating it. */
  hydrate(prototypeTemplate: Template): void;

  /** Removes hydration markers and `data-sui-bind` hints from the shadow root. */
  removeMarkers(): void;

  /** Called when the element is removed from the document. Teardown is deferred so moves are not treated as removals. */
  disconnectedCallback(): void;

  /** Called when an observed attribute changes. */
  attributeChangedCallback(attribute: string, oldValue: string | null, newValue: string | null): void;

  /** Resolves once any scheduled update has flushed. */
  readonly updateComplete: Promise<void>;

  /** `true` while an update requested through {@link requestUpdate} waits for its microtask. */
  isUpdatePending?: boolean;

  /**
   * Brings the template to `data`, which defaults to the element's current settings. A declared
   * setting moves through its signal, every other key reaches the DOM through the coarse channel.
   */
  update(data?: Record<string, any>): void;

  /** Schedules an update from the element's current settings on the next microtask. Repeated calls in the same task coalesce. */
  requestUpdate(): void;

  /** Gets the current settings, merging element properties, default settings, and spec defaults. */
  getSettings(): Record<string, any>;

  /** Sets a setting by assigning the matching element property. */
  setSetting(name: string, value: any): void;

  /** Builds the data context for template rendering. */
  getData(): Record<string, any>;

  /** Seeds `defaultSettings` from the component definition and spec default values. */
  setDefaultSettings(options: { defaultSettings?: Record<string, any>; componentSpec?: any; }): void;

  /** Reads current settings for the given property definitions. */
  getSettingsFromConfig(options: {
    componentSpec?: any;
    properties: Record<string, PropertyConfig>;
  }): Record<string, any>;

  /** Creates the reactive settings proxy assigned to `settings`. */
  createSettingsProxy(): Record<string, any>;

  /**
   * Builds the space-separated `{uiClasses}` string from active spec attributes.
   * Returns `undefined` when the component has no spec.
   */
  getUIClasses(options: {
    componentSpec?: any;
    properties?: Record<string, PropertyConfig>;
  }): string | undefined;

  /** Whether dark mode is active. Returns `undefined` on the server. */
  isDarkMode(): boolean | undefined;

  /** True while the element has a mounted template. */
  readonly isMounted: boolean;

  /** True once the element's template has completed its initial render. */
  readonly isRendered: boolean;

  /** Resolves after `onCreated` runs. `undefined` before the template exists. */
  readonly created: Promise<void> | undefined;

  /** Resolves after `onRendered` runs. `undefined` before the template exists. */
  readonly rendered: Promise<void> | undefined;

  /** Resolves after the next `onUpdated`, or immediately when no render is scheduled. */
  readonly updated: Promise<void> | undefined;

  /** Resolves after `onDestroyed` runs. `undefined` before the template exists. */
  readonly destroyed: Promise<void> | undefined;

  /** Queries the element's render root. */
  $(selector: string, options?: { root?: Document | Element | ShadowRoot; }): Query;

  /** Queries the element's original light DOM content. */
  $$(selector: string): Query;

  /** Calls a function with the component instance and `$` as its arguments. */
  call<T>(
    func: ((...args: any[]) => T) | undefined,
    options?: {
      /** Value unshifted onto the front of the argument list. */
      firstArg?: any;
      /** Values appended after the standard arguments. */
      additionalArgs?: any[];
      /** Replaces the standard `[component, $]` argument list. */
      args?: any[];
    },
  ): T | undefined;
}
