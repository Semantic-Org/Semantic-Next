import { ASTNode } from '@semantic-ui/compiler';
import { CallParams, FactoryParams, Template } from '@semantic-ui/templating';
import { ComponentConfig, PropertyConfig, WebComponentBase } from './engines/native/base.js';

/**
 * Extended call parameters for event handlers, including event-specific data.
 *
 * Extends the standard CallParams with additional event-related properties.
 *
 * @template TState - Raw state types (before Signal wrapping)
 * @template TSettings - Type of the component's configuration settings
 * @template TComponentInstance - Type of the component instance created by createComponent
 * @template TProperties - Type of the properties declared on the component
 *
 * @see https://next.semantic-ui.com/docs/guides/components/lifecycle#callback-arguments
 */
export interface EventCallParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
  TComponentInstance extends Record<string, any> = Record<string, any>,
  TProperties extends Record<string, any> = Record<string, any>,
> extends CallParams<TState, TSettings, TComponentInstance, TProperties> {
  /**
   * The original DOM event that triggered the handler.
   * This gives you access to all standard event properties like preventDefault(),
   * stopPropagation(), etc.
   *
   * @see https://next.semantic-ui.com/docs/guides/components/events#event-arguments
   * @see https://next.semantic-ui.com/docs/guides/components/lifecycle#callback-arguments
   */
  event: Event;

  /**
   * Flag indicating if this was a deep event (across shadow DOM boundaries).
   * When true, the event was triggered through deep event delegation, allowing
   * events to cross shadow DOM boundaries.
   *
   * @see https://next.semantic-ui.com/docs/guides/components/events#deep-events
   */
  isDeep: boolean;

  /**
   * The DOM element that matches the selector in the event binding.
   * This might be different from event.target when the event was triggered by a child element.
   *
   * For example, with "click .button", target is the .button element, even if
   * a child span inside the button was the actudal event.target.
   *
   * @see https://next.semantic-ui.com/docs/guides/components/events#event-delegation
   */
  target: HTMLElement;

  /**
   * The value of the element that triggered the event.
   * For form elements, this is typically the input value.
   * For custom events, this may come from event.detail.value.
   *
   * @see https://next.semantic-ui.com/docs/guides/components/lifecycle#callback-arguments
   */
  value: any;

  /**
   * Combined data from element data attributes and event detail.
   * Includes both dataset properties from the DOM element and
   * any data passed in the custom event's detail property.
   *
   * This is useful for accessing data attributes set on elements:
   * `<button data-id="123">Click</button>`
   *
   * @example
   * {
   *   "click [data-id]": ({ data }) => {
   *     console.log('Clicked item ID:', data.id);
   *   }
   * }
   *
   * @see https://next.semantic-ui.com/docs/guides/components/lifecycle#callback-arguments
   * @see https://next.semantic-ui.com/docs/guides/components/events#data-attributes
   */
  data: Record<string, any>;
}

/**
 * Extended call parameters for key binding handlers, including keyboard-specific data.
 *
 * Extends the standard CallParams with additional keyboard-related properties.
 * Key bindings allow components to respond to keyboard shortcuts and key combinations.
 *
 * @template TState - Type of the component's reactive state variables
 * @template TSettings - Type of the component's configuration settings
 * @template TComponentInstance - Type of the component instance created by createComponent
 * @template TProperties - Type of the properties declared on the component
 *
 * @see https://next.semantic-ui.com/docs/guides/components/lifecycle#callback-arguments
 * @see https://next.semantic-ui.com/docs/guides/components/keys
 */
export interface KeyCallParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
  TComponentInstance extends Record<string, any> = Record<string, any>,
  TProperties extends Record<string, any> = Record<string, any>,
> extends CallParams<TState, TSettings, TComponentInstance, TProperties> {
  /**
   * The original keyboard DOM event that triggered the handler.
   * Contains information about the key press, including key code, modifier keys, etc.
   *
   * You can call preventDefault() on this event to prevent the default browser action
   * for this key combination.
   *
   * @see https://next.semantic-ui.com/docs/guides/components/lifecycle#callback-arguments
   * @see https://next.semantic-ui.com/docs/guides/components/keys#key-event
   */
  event: KeyboardEvent;

  /**
   * Indicates whether an input, select, textarea element or contenteditable element is currently focused.
   * This can be used to determine whether to execute certain key actions that should be suppressed
   * when typing in form controls.
   *
   * @example
   * {
   *   "Ctrl+S": ({ inputFocused, event }) => {
   *     if (!inputFocused) {
   *       event.preventDefault();
   *       // Save action
   *     }
   *   }
   * }
   *
   * @see https://next.semantic-ui.com/docs/guides/components/keys#input-focus
   */
  inputFocused: boolean;

  /**
   * Indicates whether this is a repeated key event (key is being held down).
   * This can be used to implement different behaviors for key press vs. key hold.
   *
   * When true, the user is holding down the key and this is a repeat event.
   * When false, this is the initial key press.
   *
   * @example
   * {
   *   'down': ({ repeatedKey }) => {
   *     if (repeatedKey) {
   *       // Fast scrolling when key is held
   *       scrollFaster();
   *     } else {
   *       // Single scroll on initial press
   *       scrollOnce();
   *     }
   *   }
   * }
   *
   * @see https://next.semantic-ui.com/docs/guides/components/keys#repeated-keys
   */
  repeatedKey: boolean;
}

/**
 * Options the engine factory receives when building a component class.
 */
export interface ComponentFactoryOptions {
  /** Prototype template every instance clones from. */
  prototypeTemplate: Template;
  /** Property definitions resolved from settings, spec, and explicit properties. */
  resolvedProperties: Record<string, PropertyConfig>;
  /** Shadow DOM styles, including styles collected from subtemplates. */
  css: string;
  /** Whether the shadow root is created with `delegatesFocus`. */
  delegatesFocus: boolean;
  /** Component spec for Semantic UI states (modifiers, variations, etc.). */
  componentSpec?: any;
  /** Default settings declared in `defineComponent`. */
  defaultSettings?: Record<string, any>;
  /** Whether this is the plural form of a spec-driven component. */
  plural?: boolean;
  /** Callback invoked when an observed attribute changes. */
  onAttributeChanged?: (attributeName: string, oldValue: string | null, newValue: string | null) => void;
  /** Engine name or engine object the component was defined with. */
  renderingEngine?: string | EngineDefinition;
}

/**
 * A rendering engine registered with the renderer's engine registry.
 * The native engine is registered by importing `@semantic-ui/component`;
 * the Lit engine is opt-in via `@semantic-ui/component/lit`.
 */
export interface EngineDefinition {
  /** Client renderer class the template uses to produce DOM. */
  renderer: new(...args: any[]) => any;
  /** Server renderer class used to produce HTML strings. Native engine only. */
  serverRenderer?: new(...args: any[]) => any;
  /** Builds the custom element class for a component definition. */
  factory: (options: ComponentFactoryOptions) => ComponentConstructor;
}

/**
 * The custom element class `defineComponent` returns when given a `tagName`.
 *
 * @template M - Type of the component instance created by createComponent
 */
export interface ComponentConstructor<M extends Record<string, any> = Record<string, any>> {
  new(): WebComponentBase & { component: M; };

  /** Prototype template every instance clones from. */
  template: Template;

  /** Tag name the class was registered under. */
  componentTagName: string;

  /** Serializable form of the component's template definition. */
  toDefinition(): Record<string, any>;

  /** Whether the shadow root is created with `delegatesFocus`. */
  delegatesFocus: boolean;

  /** Resolved configuration the base class reads at runtime. */
  config: ComponentConfig;

  /** Property definitions keyed by camelCase property name. */
  properties: Record<string, PropertyConfig>;

  /** Attributes reported to the browser so they reach `attributeChangedCallback`. */
  readonly observedAttributes: string[];
}

/**
 * Configuration accepted by {@link defineComponent}.
 *
 * @template M - Instance methods and properties returned by `createComponent`
 * @template S - Component settings, inferred from `defaultSettings`
 * @template St - Raw state types, inferred from `defaultState`
 * @template P - Component properties
 */
export interface DefineComponentOptions<
  M extends Record<string, any> = Record<string, any>,
  S extends Record<string, any> = {},
  St extends Record<string, any> = {},
  P extends Record<string, any> = {},
> {
  /**
   * The HTML tag name for the custom element (e.g., 'my-component').
   * If omitted, returns a template instance for use as a subtemplate.
   * @see {@link https://next.semantic-ui.com/docs/guides/components/create#create-component Creating Components}
   */
  tagName?: string;
  /**
   * The template string for the component's content.
   * @see {@link https://next.semantic-ui.com/docs/guides/components/create#template Template}
   */
  template?: string;
  /** Pre-compiled AST of the template. If provided, the template string is not compiled. */
  ast?: ASTNode[];
  /**
   * Keep template whitespace instead of condensing it. `'auto'` (the default)
   * preserves whitespace only when `css` makes it significant.
   */
  preserveWhitespace?: boolean | 'auto';
  /**
   * CSS styles scoped to the component's shadow DOM.
   * @see {@link https://next.semantic-ui.com/docs/guides/components/create#css CSS}
   */
  css?: string;
  /**
   * CSS styles added to the page (not scoped). Added once when the component is defined.
   * @see {@link https://next.semantic-ui.com/docs/guides/components/create#css CSS}
   */
  pageCSS?: string;
  /** Whether the component uses `delegatesFocus` in its shadow DOM. */
  delegatesFocus?: boolean;
  /** Template name (defaults to camelCase of `tagName`). */
  templateName?: string;

  /**
   * Factory function that creates the component's instance methods and properties.
   *
   * Inside the returned object, `this` is the instance itself (all methods) via ThisType.
   * The factory params (settings, state, $, etc.) are closure variables, not properties
   * of the instance, so reach for them directly rather than through `this`.
   * In events and lifecycle hooks, `self` is fully typed.
   *
   * @see {@link https://next.semantic-ui.com/docs/guides/components/create#create-component Creating Components}
   */
  createComponent?: (params: FactoryParams<St, S, P>) => M & ThisType<M>;

  /**
   * Event handlers keyed by event DSL strings (e.g., "click .button", "deep click menu-item").
   * `this` is the element that matched the selector; `self` (via params) is the component instance.
   *
   * @see {@link https://next.semantic-ui.com/docs/guides/components/events Events}
   */
  events?: Record<
    string,
    (this: HTMLElement, params: EventCallParams<St, S, M, P>) => void
  >;

  /**
   * Key binding handlers keyed by key sequences (e.g., "Ctrl+S", "Escape").
   * Returning `true` leaves the browser default in place; anything else calls preventDefault.
   * `this` is the component's element; `self` (via params) is the component instance.
   *
   * @see {@link https://next.semantic-ui.com/docs/guides/components/keys Keys}
   */
  keys?: Record<
    string,
    (this: WebComponentBase, params: KeyCallParams<St, S, M, P>) => void | boolean
  >;

  /**
   * Lifecycle callback invoked after the component is created.
   * @see {@link https://next.semantic-ui.com/docs/guides/components/lifecycle#oncreated onCreated}
   */
  onCreated?: (this: WebComponentBase, params: CallParams<St, S, M, P>) => void;
  /**
   * Lifecycle callback invoked after the component is rendered.
   * @see {@link https://next.semantic-ui.com/docs/guides/components/lifecycle#onrendered onRendered}
   */
  onRendered?: (this: WebComponentBase, params: CallParams<St, S, M, P>) => void;
  /**
   * Lifecycle callback invoked after the component is destroyed.
   * @see {@link https://next.semantic-ui.com/docs/guides/components/lifecycle#ondestroyed onDestroyed}
   */
  onDestroyed?: (this: WebComponentBase, params: CallParams<St, S, M, P>) => void;
  /**
   * Lifecycle callback invoked after the theme changes.
   * @see {@link https://next.semantic-ui.com/docs/guides/components/lifecycle#onthemechanged onThemeChanged}
   */
  onThemeChanged?: (this: WebComponentBase, params: CallParams<St, S, M, P>) => void;
  /**
   * Lifecycle callback invoked when an observed attribute changes.
   * @see {@link https://next.semantic-ui.com/docs/guides/components/lifecycle#onattributechanged onAttributeChanged}
   */
  onAttributeChanged?: (
    this: WebComponentBase,
    attributeName: string,
    oldValue: string | null,
    newValue: string | null,
  ) => void;

  /**
   * Reactive settings that can be modified from outside the component.
   * Types are inferred from default values.
   * @see {@link https://next.semantic-ui.com/docs/guides/components/rendering#settings Component Settings}
   */
  defaultSettings?: S;
  /**
   * Internal reactive state. Each key becomes a Signal<T> where T is inferred from the default value.
   * @see {@link https://next.semantic-ui.com/docs/guides/components/rendering#state Component State}
   */
  defaultState?: St;

  /**
   * Subtemplates available in the template via `{>name}`.
   * Values are either a `Template` (the return of `defineComponent` without a `tagName`)
   * or a component definition to be created inline.
   * @see {@link https://next.semantic-ui.com/docs/guides/templates/subtemplates Subtemplates}
   */
  subTemplates?: Record<string, Template | DefineComponentOptions>;
  /**
   * Rendering engine name or engine object. Defaults to `'native'`.
   * `'lit'` becomes available once `@semantic-ui/component/lit` is imported.
   */
  renderingEngine?: string | EngineDefinition;
  /** Property definitions, for components that declare properties directly instead of through settings. */
  properties?: P;
  /** Component spec for Semantic UI states (modifiers, variations, etc.). */
  componentSpec?: any;
  /** Whether this is the plural form of a spec-driven component. */
  plural?: boolean;
  /** Tag name of the singular form (for plural components). */
  singularTag?: string;
}

/**
 * Defines a custom element (web component) with the given options.
 *
 * TypeScript infers generic parameters automatically:
 * - `M` from the return type of `createComponent` (component instance methods)
 * - `S` from `defaultSettings` (component settings)
 * - `St` from `defaultState` (raw state types, auto-wrapped in Signal<T>)
 *
 * Inside `createComponent`'s returned object, `this` is typed as the full instance
 * via ThisType<M>. In events and lifecycle hooks, `self` is typed as the instance.
 *
 * @see {@link https://next.semantic-ui.com/docs/components Creating Components}
 */
export function defineComponent<
  M extends Record<string, any> = Record<string, any>,
  S extends Record<string, any> = {},
  St extends Record<string, any> = {},
  P extends Record<string, any> = {},
>(options: DefineComponentOptions<M, S, St, P> & { tagName: string; }): ComponentConstructor<M>;

/**
 * Defines a subtemplate with the given options.
 *
 * Without a `tagName` no custom element is registered. The returned `Template`
 * is passed through the `subTemplates` option of another component and rendered
 * with `{>name}`.
 *
 * @see {@link https://next.semantic-ui.com/docs/guides/templates/subtemplates Subtemplates}
 */
export function defineComponent<
  M extends Record<string, any> = Record<string, any>,
  S extends Record<string, any> = {},
  St extends Record<string, any> = {},
  P extends Record<string, any> = {},
>(options?: DefineComponentOptions<M, S, St, P>): Template;
