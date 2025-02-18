// define-component.d.ts

import { unsafeCSS, CSSResult } from 'lit';
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
   * See {@link https://next.semantic-ui.com/components/create#events Events} for more details.
   */
  events?: Record<string, Function>;
  /**
   * An object mapping key sequences (e.g., "Ctrl+A") to handler functions.
   * See {@link https://next.semantic-ui.com/components/create#keys Keys} for more details.
   */
  keys?: Record<string, Function>;

  /**
   * Lifecycle callback - invoked after the component is created.
   * See {@link https://next.semantic-ui.com/components/create#lifecycle-events Lifecycle Events} for more details.
   */
  onCreated?: () => void;
  /**
   * Lifecycle callback - invoked after the component is rendered.
   * See {@link https://next.semantic-ui.com/components/create#lifecycle-events Lifecycle Events} for more details.
   */
  onRendered?: () => void;
  /**
   * Lifecycle callback - invoked after the component is destroyed.
   * See {@link https://next.semantic-ui.com/components/create#lifecycle-events Lifecycle Events} for more details.
   */
  onDestroyed?: () => void;
  /**
   * Lifecycle callback - invoked after the theme is changed.
   * See {@link https://next.semantic-ui.com/components/create#lifecycle-events Lifecycle Events} for more details.
   */
  onThemeChanged?: () => void;
  /**
   * Lifecycle callback - invoked when an observed attribute changes.
   * See {@link https://next.semantic-ui.com/components/create#lifecycle-events Lifecycle Events} for more details.
   */
  onAttributeChanged?: (attributeName: string, oldValue: string | null, newValue: string | null) => void;

  /** Default settings for the component. */
  defaultSettings?: Record<string, any>;
  /** Default reactive state for the component. */
  defaultState?: Record<string, any>;

  /** An object mapping template names to sub-template functions. */
  subTemplates?: Record<string, Function>;

  /**
   * The rendering engine to use (e.g., 'lit').  If omitted, defaults to the rendering engine used by the `Template` class.
   * See {@link https://next.semantic-ui.com/components/rendering Rendering} for more details.
   */
  renderingEngine?: string;
  /**  An object defining the component's observed properties (similar to LitElement's `properties`). This allows for more control over attribute reflection and type conversion. */
  properties?: Record<string, any>; // You might want a more specific type for property definitions.

  /** Only used by components that provide a spec */
  componentSpec?: boolean;
  /** Whether it should use the plural name */
  plural?: boolean;
  /** If plural use this tag for singular */
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
export declare class UIWebComponent extends WebComponentBase { // Or whatever your base class is.

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
     * See {@link https://next.semantic-ui.com/components/create#template Template} for more details.
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
     * First updated.
     * See {@link https://next.semantic-ui.com/components/lifecycle Lifecycle} for more information.
     */
    firstUpdated(): void;
    /**
     * Updated.
     * See {@link https://next.semantic-ui.com/components/lifecycle Lifecycle} for more information.
     */
    updated(): void;
    /**
     * Disconnected callback.
     * See {@link https://next.semantic-ui.com/components/lifecycle Lifecycle} for more information.
     */
    disconnectedCallback(): void;
    /**
     * Adopted callback
     * See {@link https://next.semantic-ui.com/components/lifecycle Lifecycle} for more information.
     */
    adoptedCallback(): void;
      /**
   * Standard LitElement method. Called when an observed attribute changes.
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
     * Gets data
     * @returns Returns data
     */
    getData(): Record<string, any>;
    /**
     * Renders the component.
     * See {@link https://next.semantic-ui.com/components/rendering Rendering} for more information.
     * @returns {any} Returns rendered element
     */
    render(): any;
}
