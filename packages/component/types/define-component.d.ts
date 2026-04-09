import { CallParams, FactoryParams, Template } from '@semantic-ui/templating';
import { CSSResult } from 'lit';
import { PropertyValues } from 'lit';
import { WebComponentBase } from './engines/native/base';

/**
 * Extended call parameters for event handlers, including event-specific data.
 *
 * Extends the standard CallParams with additional event-related properties.
 *
 * @template TState - Raw state types (before Signal wrapping)
 * @template TSettings - Type of the component's configuration settings
 * @template TComponentInstance - Type of the component instance created by createComponent
 * @template TProperties - Type of the properties for Lit components
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
 * @template TProperties - Type of the properties for Lit components
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
 * Defines a custom element (web component) with the given options.
 *
 * TypeScript infers generic parameters automatically:
 * - `M` from the return type of `createComponent` (component instance methods)
 * - `S` from `defaultSettings` (component settings)
 * - `St` from `defaultState` (raw state types, auto-wrapped in Signal<T>)
 *
 * Inside `createComponent`'s returned object, `this` is typed as the full instance
 * via ThisType<M>. In events and lifecycle hooks, both `this` and `self` are typed.
 *
 * @see {@link https://next.semantic-ui.com/docs/components Creating Components}
 */
export function defineComponent<
  M extends Record<string, any> = Record<string, any>,
  S extends Record<string, any> = {},
  St extends Record<string, any> = {},
  P extends Record<string, any> = {},
>(options: {
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
  ast?: any;
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
   * Inside the returned object, `this` is typed as the full instance (all methods)
   * plus the factory params (settings, state, $, etc.) via ThisType.
   * `self` is available but untyped in this callback — use `this` for typed self-reference.
   * In events and lifecycle hooks, `self` IS fully typed.
   *
   * @see {@link https://next.semantic-ui.com/docs/guides/components/create#create-component Creating Components}
   */
  createComponent?: (params: FactoryParams<St, S, P>) => M & ThisType<M & FactoryParams<St, S, P>>;

  /**
   * Event handlers keyed by event DSL strings (e.g., "click .button", "deep click menu-item").
   * Both `this` and `self` (via params) are typed as the component instance.
   *
   * @see {@link https://next.semantic-ui.com/docs/guides/components/events Events}
   */
  events?: Record<
    string,
    (this: M, params: EventCallParams<St, S, M, P>) => void
  >;

  /**
   * Key binding handlers keyed by key sequences (e.g., "Ctrl+S", "Escape").
   * Both `this` and `self` (via params) are typed as the component instance.
   *
   * @see {@link https://next.semantic-ui.com/docs/guides/components/keys Keys}
   */
  keys?: Record<
    string,
    (this: M, params: KeyCallParams<St, S, M, P>) => void | boolean
  >;

  /**
   * Lifecycle callback invoked after the component is created.
   * @see {@link https://next.semantic-ui.com/docs/guides/components/lifecycle#oncreated onCreated}
   */
  onCreated?: (this: M, params: CallParams<St, S, M, P>) => void;
  /**
   * Lifecycle callback invoked after the component is rendered.
   * @see {@link https://next.semantic-ui.com/docs/guides/components/lifecycle#onrendered onRendered}
   */
  onRendered?: (this: M, params: CallParams<St, S, M, P>) => void;
  /**
   * Lifecycle callback invoked after the component is updated.
   * @see {@link https://next.semantic-ui.com/docs/guides/components/lifecycle#onupdated onUpdated}
   */
  onUpdated?: (this: M, params: CallParams<St, S, M, P>) => void;
  /**
   * Lifecycle callback invoked after the component is destroyed.
   * @see {@link https://next.semantic-ui.com/docs/guides/components/lifecycle#ondestroyed onDestroyed}
   */
  onDestroyed?: (this: M, params: CallParams<St, S, M, P>) => void;
  /**
   * Lifecycle callback invoked after the theme changes.
   * @see {@link https://next.semantic-ui.com/docs/guides/components/lifecycle#onthemechanged onThemeChanged}
   */
  onThemeChanged?: (this: M, params: CallParams<St, S, M, P>) => void;
  /**
   * Lifecycle callback invoked when an observed attribute changes.
   * @see {@link https://next.semantic-ui.com/docs/guides/components/lifecycle#onattributechanged onAttributeChanged}
   */
  onAttributeChanged?: (attributeName: string, oldValue: string | null, newValue: string | null) => void;

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
   * @see {@link https://next.semantic-ui.com/docs/guides/templates/subtemplates Subtemplates}
   */
  subTemplates?: Record<string, Function>;
  /** Rendering engine. Only 'lit' is currently implemented. */
  renderingEngine?: string;
  /** Lit properties for porting existing components. */
  properties?: P;
  /** Component spec for Semantic UI states (modifiers, variations, etc.). */
  componentSpec?: any;
  /** Whether this is the plural form of a spec-driven component. */
  plural?: boolean;
  /** Tag name of the singular form (for plural components). */
  singularTag?: string;
}): any;

/**
 * The base class for the generated web components.
 * Extends LitElement and provides common functionality.  You don't use this
 * directly; `defineComponent` generates a subclass of this.
 * See {@link https://next.semantic-ui.com/docs/components Components} for more details.
 */
export declare class UIWebComponent extends WebComponentBase {
  /**
   * Styles.
   * See {@link https://next.semantic-ui.com/docs/guides/components/create#css CSS} for more details.
   */
  static styles: CSSResult;
  /**
   * Template.
   * See {@link https://next.semantic-ui.com/docs/guides/components/create#template Template} for more details.
   */
  static template: Template;
  /**
   * properties
   */
  static properties: Record<string, any>;
  /**
   * Default settings
   */
  defaultSettings: Record<string, any>;

  /**
   * CSS
   */
  css: string;
  /**
   * component spec
   */
  componentSpec: any; // Define the type

  /**
   * Settings Proxy
   */
  settings: Record<string, any>;
  /**
   * The template.
   * See {@link https://next.semantic-ui.com/docs/templates Template} for more details.
   */
  template?: Template;
  /**
   * Component
   */
  component: any; // Define
  /**
   * Data Context
   */
  dataContext: Record<string, any>;
  /**
   * constructor
   */
  constructor();
  /**
   * Connected callback.
   * See {@link https://next.semantic-ui.com/docs/guides/components/lifecycle Lifecycle} for more information.
   */
  connectedCallback(): void;
  /**
   * Trigger attribute change
   */
  triggerAttributeChange(): void;
  /**
   * Will update.
   * See {@link https://next.semantic-ui.com/docs/guides/components/lifecycle Lifecycle} for more information.
   * @param _changedProperties
   */
  willUpdate(_changedProperties: PropertyValues): void;

  /**
   * Lit First updated callback
   * See {@link https://next.semantic-ui.com/docs/guides/components/lifecycle#callback-sequence Rendering} for more information.
   */
  firstUpdated(): void;
  /**
   * Lit Updated callback
   * See {@link https://next.semantic-ui.com/docs/guides/components/lifecycle#callback-sequence Rendering} for more information.
   */
  updated(): void;
  /**
   * Lit Disconnected callback.
   * See {@link https://next.semantic-ui.com/docs/guides/components/lifecycle#callback-sequence Rendering} for more information.
   */
  disconnectedCallback(): void;
  /**
   * Lit Adopted callback
   * See {@link https://next.semantic-ui.com/docs/guides/components/lifecycle#callback-sequence Rendering} for more information.
   */
  adoptedCallback(): void;
  /**
   * Lit callback when attribute changes..
   * @param attribute - The name of the attribute that changed.
   * @param oldValue - The previous value of the attribute.
   * @param newValue - The new value of the attribute.
   * See {@link https://next.semantic-ui.com/docs/guides/components/lifecycle Lifecycle} for more information.
   */
  attributeChangedCallback(attribute: string, oldValue: string | null, newValue: string | null): void;
  /**
   * Gets settings
   * @returns {Record<string, any>} Returns settings
   */
  getSettings(): Record<string, any>;

  /**
   * Sets settings
   * @param name
   * @param value
   */
  setSetting(name: string, value: any): void;
  /**
   * Creates the data context for the template instance
   * @returns Returns data context
   */
  getData(): Record<string, any>;

  /**
   * Renders the component.
   * See {@link https://next.semantic-ui.com/docs/guides/components/lifecycle#callback-sequence Rendering} for more information.
   * @returns {any} Returns rendered element
   */
  render(): any;
}
