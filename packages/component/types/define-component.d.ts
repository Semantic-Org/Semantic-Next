import { CSSResult } from 'lit';
import { Template } from '@semantic-ui/templating';
import { WebComponentBase } from './web-component'; // Assuming web-component.d.ts exists and exports WebComponentBase
import { PropertyValues } from 'lit';

export interface DefineComponentOptions {
  /**
   * The HTML tag name for the custom element (e.g., 'my-component').  Should be kebab-case.
   * See {@link https://next.semantic-ui.com/components/create#create-component Creating Components} for more details.
   */
  tagName: string;
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
  createComponent?: () => any;
  /**
   * An object mapping event strings (e.g., "click .button") to event handler functions.
   * See {@link https://next.semantic-ui.com/components/eventss Events} for more details.
   */
  events?: Record<string, Function>;
  /**
   * An object mapping key sequences (e.g., "Ctrl+A") to handler functions.
   * See {@link https://next.semantic-ui.com/components/keys Keys} for more details.
   */
  keys?: Record<string, Function>;

  /**
   * Lifecycle callback - invoked after the component is created.
   * See {@link https://next.semantic-ui.com/components/lifecycle#oncreated onCreated Callback} for more details.
   */
  onCreated?: () => void;
  /**
   * Lifecycle callback - invoked after the component is rendered.
   * See {@link https://next.semantic-ui.com/components/lifecycle#onrendered onRendered Callback} for more details.
   */
  onRendered?: () => void;
  /**
   * Lifecycle callback - invoked after the component is destroyed.
   * See {@link https://next.semantic-ui.com/components/lifecycle#ondestroyed onDestroyed Callback} for more details.
   */
  onDestroyed?: () => void;
  /**
   * Lifecycle callback - invoked after the theme is changed.
   * See {@link https://next.semantic-ui.com/components/lifecycle#onthemechanged onThemeChanged Callback} for more details.
   */
  onThemeChanged?: () => void;
  /**
   * Lifecycle callback - invoked when an observed attribute changes.
   * See {@link https://next.semantic-ui.com/components/lifecycle#onattributechanged onattributechanged Callback} for more details.
   */
  onAttributeChanged?: (attributeName: string, oldValue: string | null, newValue: string | null) => void;

  /**
   * Settings are reactive values which can be modified from outside the component.
   * See {@link https://next.semantic-ui.com/components/rendering#settings Component Settings} for more details.
   */
  defaultSettings?: Record<string, any>;
  /**
   * State is an internal reactive data store for your component
   * See {@link https://next.semantic-ui.com/components/rendering#state Component State} for more details.
   */
  defaultState?: Record<string, any>;

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
  properties?: Record<string, any>; // You might want a more specific type for property definitions.

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
export function defineComponent<T extends WebComponentBase>(options: DefineComponentOptions): string | typeof HTMLElement | T; // Return the custom element class


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
