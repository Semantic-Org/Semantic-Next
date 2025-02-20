import type { PropertyDeclaration, PropertyValues, LitElement } from 'lit';
import type { Signal } from '@semantic-ui/reactivity';
import type { Query } from '@semantic-ui/query';
import type { Template } from '@semantic-ui/templating';

/**
 * Base class for Semantic UI web components.
 * Extends LitElement with additional functionality for styling, settings, and state management.
 * You typically won't extend this class directly - use `defineComponent` instead.
 */
export declare class WebComponentBase extends LitElement {
  /**
   * Shadow root options with delegatesFocus support
   */
  static shadowRootOptions: {
    delegatesFocus: boolean;
    mode: 'open' | 'closed';
  };

  /**
   * Optional stylesheet for light DOM rendering
   */
  static scopedStyleSheet: CSSStyleSheet | null;

  /**
   * The template instance for this component
   */
  template?: Template;

  /**
   * The component instance containing methods and properties
   */
  component: any;

  /**
   * The data context for template rendering
   */
  dataContext: Record<string, any>;

  /**
   * CSS styles for the component
   */
  css: string;

  /**
   * Settings proxy for reactive settings access
   */
  settings: Record<string, any>;

  /**
   * Default settings storage
   */
  protected defaultSettings: Record<string, any>;

  /**
   * Callbacks to run after rendering
   */
  protected renderCallbacks: Array<() => void>;

  /**
   * Map of settings to reactive signals
   */
  protected settingsVars: Map<string, Signal<any>>;

  constructor();

  /**
   * Gets all property definitions for the component.
   * Combines defaults with custom properties.
   */
  static getProperties(options: {
    properties?: Record<string, PropertyDeclaration>;
    defaultSettings?: Record<string, any>;
    componentSpec?: any;
  }): Record<string, PropertyDeclaration>;

  /**
   * Called when element attributes change
   */
  attributeChangedCallback(name: string, old: string | null, value: string | null): void;

  /**
   * Called when the element is added to the document
   */
  connectedCallback(): void;

  /**
   * Called when the element is removed from the document
   */
  disconnectedCallback(): void;

  /**
   * Called when the element is moved to a new document
   */
  adoptedCallback(): void;

  /**
   * Called before update
   */
  willUpdate(changedProperties: PropertyValues): void;

  /**
   * Called after first update
   */
  firstUpdated(changedProperties: PropertyValues): void;

  /**
   * Called after update
   */
  updated(changedProperties: PropertyValues): void;

  /**
   * Gets current settings
   */
  getSettings(): Record<string, any>;

  /**
   * Sets a setting value
   */
  setSetting(name: string, value: any): void;

  /**
   * Gets data for template rendering
   */
  getData(): Record<string, any>;

  /**
   * Renders the component
   */
  render(): unknown;

  /**
   * Protected helper methods
   */
  protected $(selector: string, options?: { root?: Element | ShadowRoot }): Query;
  protected $$(selector: string): Query;
  protected isDarkMode(): boolean;
}
