import { CSSResult } from 'lit';
import { Template, CallParams } from '@semantic-ui/templating';
import { WebComponentBase } from './web-component';
import { PropertyValues } from 'lit';

/**
 * Extended call parameters for event handlers, including event-specific data.
 * 
 * Extends the standard CallParams with additional event-related properties.
 * 
 * @template TState - Type of the component's reactive state variables
 * @template TSettings - Type of the component's configuration settings
 * @template TComponentInstance - Type of the component instance created by createComponent
 * @template TProperties - Type of the properties for Lit components
 * 
 * @see https://next.semantic-ui.com/components/lifecycle#callback-arguments
 */
export interface EventCallParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
  TComponentInstance extends Record<string, any> = Record<string, any>,
  TProperties extends Record<string, any> = Record<string, any>
> extends CallParams<TState, TSettings, TComponentInstance, TProperties> {
  /**
   * The original DOM event that triggered the handler.
   * This gives you access to all standard event properties like preventDefault(),
   * stopPropagation(), etc.
   * 
   * @see https://next.semantic-ui.com/components/lifecycle#callback-arguments
   * @see https://next.semantic-ui.com/components/events#event-object
   */
  event: Event;

  /**
   * Flag indicating if this was a deep event (across shadow DOM boundaries).
   * When true, the event was triggered through deep event delegation, allowing
   * events to cross shadow DOM boundaries.
   * 
   * @see https://next.semantic-ui.com/components/events#deep-events
   */
  isDeep: boolean;

  /**
   * The DOM element that matches the selector in the event binding.
   * This might be different from event.target when the event was triggered by a child element.
   * 
   * For example, with "click .button", target is the .button element, even if
   * a child span inside the button was the actudal event.target.
   * 
   * @see https://next.semantic-ui.com/components/events#event-delegation
   */
  target: HTMLElement;

  /**
   * The value of the element that triggered the event.
   * For form elements, this is typically the input value.
   * For custom events, this may come from event.detail.value.
   * 
   * @see https://next.semantic-ui.com/components/lifecycle#callback-arguments
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
   * @see https://next.semantic-ui.com/components/lifecycle#callback-arguments
   * @see https://next.semantic-ui.com/components/events#data-attributes
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
 * @see https://next.semantic-ui.com/components/lifecycle#callback-arguments
 * @see https://next.semantic-ui.com/components/keys
 */
export interface KeyCallParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
  TComponentInstance extends Record<string, any> = Record<string, any>,
  TProperties extends Record<string, any> = Record<string, any>
> extends CallParams<TState, TSettings, TComponentInstance, TProperties> {
  /**
   * The original keyboard DOM event that triggered the handler.
   * Contains information about the key press, including key code, modifier keys, etc.
   * 
   * You can call preventDefault() on this event to prevent the default browser action
   * for this key combination.
   * 
   * @see https://next.semantic-ui.com/components/lifecycle#callback-arguments
   * @see https://next.semantic-ui.com/components/keys#key-event
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
   * @see https://next.semantic-ui.com/components/keys#input-focus
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
   * @see https://next.semantic-ui.com/components/keys#repeated-keys
   */
  repeatedKey: boolean;
}

export interface DefineComponentOptions<
  TState extends Record<string, any>,
  TSettings extends Record<string, any>,
  TCreateComponent extends () => any,
  TProperties extends Record<string, any>
> {
  /**
   * The HTML tag name for the custom element (e.g., 'my-component'). 
   * Note: If you do not pass in a tag name the template instance will be returned for use as a subtemplate
   * See {@link https://next.semantic-ui.com/components/create#create-component Creating Components} for more details.
   */
  tagName?: string;
  /**
   * The template string to use for the component's content.
   * See {@link https://next.semantic-ui.com/components/create#template Template} for more details.
   */
  template?: string;
  /**
   * The pre-compiled Abstract Syntax Tree (AST) of the template.  If omitted, the `template` string will be compiled.
   */
  ast?: any; // Ideally, this would be the ASTNode type from your template compiler.
  /**
   * CSS styles for the component (scoped to the component's shadow DOM).
   * See {@link https://next.semantic-ui.com/components/create#css CSS} for more details.
   */
  css?: string;
  /**
   * CSS styles to be added to the *page* (not scoped to the component). This is useful for things like global styles or fonts that the component depends on.
   * These styles are only added once, when the component is defined.
   * See {@link https://next.semantic-ui.com/components/create#css CSS} for more details.
   */
  pageCSS?: string;
  /**
   * Whether the component uses the `delegatesFocus` option in the shadow DOM.
   */
  delegatesFocus?: boolean;
  /**
   * The name of the template (defaults to the camelCase version of `tagName`).
   */
  templateName?: string;

  /**
   * A function that creates the component's instance methods and properties.
   * See {@link https://next.semantic-ui.com/components/create#create-component Creating Components} for more details.
   */
  createComponent?: (params: CallParams<TState, TSettings, ReturnType<TCreateComponent>, TProperties>) => void; // Use generic type
  /**
   * An object mapping event strings (e.g., "click .button") to event handler functions.
   * Event handlers receive extended parameters including the DOM event, target element, and additional data.
   * 
   * @example
   * {
   *   "click .button": ({ event, target, value, data }) => {
   *     console.log('Button clicked:', event);
   *   },
   *   "input .search": ({ value }) => {
   *     console.log('Search input:', value);
   *   }
   * }
   * 
   * @see {@link https://next.semantic-ui.com/components/events Events} for more details.
   * @see {@link https://next.semantic-ui.com/components/lifecycle#callback-arguments Callback Arguments} for information on the parameters.
   */
  events?: Record<string, (params: EventCallParams<TState, TSettings, ReturnType<TCreateComponent>, TProperties>) => void>;
  
  /**
   * An object mapping key sequences (e.g., "Ctrl+A") to handler functions.
   * Key handlers receive extended parameters including the keyboard event, input focus state, and key repeat information.
   * 
   * @example
   * {
   *   "Ctrl+S": ({ event, inputFocused }) => {
   *     if (!inputFocused) {
   *       event.preventDefault();
   *       // Save action
   *     }
   *   },
   *   "Esc": ({ repeatedKey }) => {
   *     if (!repeatedKey) {
   *       // Close dialog
   *     }
   *   }
   * }
   * 
   * @see {@link https://next.semantic-ui.com/components/keys Keys} for more details.
   * @see {@link https://next.semantic-ui.com/components/lifecycle#callback-arguments Callback Arguments} for information on the parameters.
   */
  keys?: Record<string, (params: KeyCallParams<TState, TSettings, ReturnType<TCreateComponent>, TProperties>) => void | boolean>;

  /**
   * Lifecycle callback - invoked after the component is created.
   * See {@link https://next.semantic-ui.com/components/lifecycle#oncreated onCreated Callback} for more details.
   * @param params The callback parameters including component instance, state, settings, and helper functions.
   * You can destructure this parameter to access specific properties (e.g., `{ el, self, settings }`).
   */
  onCreated?: (params: CallParams<TState, TSettings, ReturnType<TCreateComponent>, TProperties>) => void;
  /**
   * Lifecycle callback - invoked after the component is rendered.
   * See {@link https://next.semantic-ui.com/components/lifecycle#onrendered onRendered Callback} for more details.
   * @param params The callback parameters including component instance, state, settings, and helper functions.
   * You can destructure this parameter to access specific properties (e.g., `{ el, self, settings }`).
   */
  onRendered?: (params: CallParams<TState, TSettings, ReturnType<TCreateComponent>, TProperties>) => void;
  /**
   * Lifecycle callback - invoked after the component is destroyed.
   * See {@link https://next.semantic-ui.com/components/lifecycle#ondestroyed onDestroyed Callback} for more details.
   * @param params The callback parameters including component instance, state, settings, and helper functions.
   * You can destructure this parameter to access specific properties (e.g., `{ el, self, settings }`).
   */
  onDestroyed?: (params: CallParams<TState, TSettings, ReturnType<TCreateComponent>, TProperties>) => void;
  /**
   * Lifecycle callback - invoked after the theme changes.
   * See {@link https://next.semantic-ui.com/components/lifecycle#onthemechanged onThemeChanged Callback} for more details.
   * @param params The callback parameters including component instance, state, settings, and helper functions.
   * You can destructure this parameter to access specific properties (e.g., `{ el, self, settings }`).
   */
  onThemeChanged?: (params: CallParams<TState, TSettings, ReturnType<TCreateComponent>, TProperties>) => void;
  /**
   * Lifecycle callback - invoked when an observed attribute changes.
   * @param attributeName The name of the attribute that changed
   * @param oldValue The previous value
   * @param newValue The new value
   * See {@link https://next.semantic-ui.com/components/lifecycle#onattributechanged onAttributeChanged Callback} for more details.
   */
  onAttributeChanged?: (attributeName: string, oldValue: string | null, newValue: string | null) => void;

  /**
   * Settings are reactive values which can be modified from outside the component.
   * See {@link https://next.semantic-ui.com/components/rendering#settings Component Settings} for more details.
   */
  defaultSettings?: TSettings; // Use generic type
  /**
   * State is an internal reactive data store for your component
   * See {@link https://next.semantic-ui.com/components/rendering#state Component State} for more details.
   */
  defaultState?: TState; // Use generic type

  /**
   * Subtemplates are a mapping of template names to template instances that can be used in your template.
   * See {@link https://next.semantic-ui.com/templates/subtemplates Subtemplates} for more details.
   */
  subTemplates?: Record<string, Function>;

  /**
   * The rendering engine to use. Note 'lit' is the only rendering engine currently implemented.
   * See {@link https://next.semantic-ui.com/components/rendering Rendering} for more details.
   */
  renderingEngine?: string;

  /**
   * This allows you to pass in Lit properties directly
   * which may be useful when porting existing components.
   */
  properties?: TProperties; // Use generic type

  /**
   * Component specs allow you to pass in a JSON spec
   * which will define the Semantic UI states like modifiers, variations, etc.
   */
  componentSpec?: boolean;
  /**
   * When using a spec you can define whether this is the plural
   * form of the specified component
   */
  plural?: boolean;
  /**
   * Not Implemented: May be used in the future to pass data
   * from a plural component to the singular component.
   */
  singularTag?: string;

}

/**
 * Defines a custom element (web component) with the given options.
 *
 * @param options - The options for defining the component.
 * @returns The custom element class (if `tagName` is provided) or template.
 * See {@link https://next.semantic-ui.com/components Creating Components} for more information.
 */
export function defineComponent<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
  TCreateComponent extends () => any = () => any,
  TProperties extends Record<string, any> = Record<string, any>,
  TOptions extends DefineComponentOptions<TState, TSettings, TCreateComponent, TProperties> = DefineComponentOptions<TState, TSettings, TCreateComponent, TProperties>
>(options: TOptions): string | typeof HTMLElement | (WebComponentBase & { new(): (WebComponentBase & TOptions['properties']) }); // Improved return type

/**
 * The base class for the generated web components.
 * Extends LitElement and provides common functionality.  You don't use this
 * directly; `defineComponent` generates a subclass of this.
 * See {@link https://next.semantic-ui.com/components Components} for more details.
 */
export declare class UIWebComponent extends WebComponentBase {

  /**
   * Styles.
   * See {@link https://next.semantic-ui.com/components/create#css CSS} for more details.
   */
  static styles: CSSResult;
  /**
   * Template.
   * See {@link https://next.semantic-ui.com/components/create#template Template} for more details.
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
   * See {@link https://next.semantic-ui.com/templates Template} for more details.
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
   * See {@link https://next.semantic-ui.com/components/lifecycle Lifecycle} for more information.
   */
  connectedCallback(): void;
  /**
   * Trigger attribute change
   */
  triggerAttributeChange(): void;
  /**
   * Will update.
   * See {@link https://next.semantic-ui.com/components/lifecycle Lifecycle} for more information.
   * @param _changedProperties
   */
  willUpdate(_changedProperties: PropertyValues): void;

  /**
   * Lit First updated callback
   * See {@link https://next.semantic-ui.com/components/lifecycle#callback-sequence Rendering} for more information.
   */
  firstUpdated(): void;
  /**
   * Lit Updated callback
   * See {@link https://next.semantic-ui.com/components/lifecycle#callback-sequence Rendering} for more information.
   */
  updated(): void;
  /**
   * Lit Disconnected callback.
   * See {@link https://next.semantic-ui.com/components/lifecycle#callback-sequence Rendering} for more information.
   */
  disconnectedCallback(): void;
  /**
   * Lit Adopted callback
   * See {@link https://next.semantic-ui.com/components/lifecycle#callback-sequence Rendering} for more information.
   */
  adoptedCallback(): void;
  /**
   * Lit callback when attribute changes..
   * @param attribute - The name of the attribute that changed.
   * @param oldValue - The previous value of the attribute.
   * @param newValue - The new value of the attribute.
   * See {@link https://next.semantic-ui.com/components/lifecycle Lifecycle} for more information.
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
   * See {@link https://next.semantic-ui.com/components/lifecycle#callback-sequence Rendering} for more information.
   * @returns {any} Returns rendered element
   */
  render(): any;
}