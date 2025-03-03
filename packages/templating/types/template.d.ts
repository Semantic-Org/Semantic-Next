import { LitRenderer } from '@semantic-ui/renderer';
import { TemplateHelpers } from './template-helpers';
import { Query, QueryOptions } from '@semantic-ui/query';
import { Signal, SignalOptions, Reaction } from '@semantic-ui/reactivity';
import { ASTNode } from './compiler/template-compiler';

export interface TemplateSettings {
  /** The name of the template. */
  templateName?: string;
  /** The compiled Abstract Syntax Tree (AST) of the template. */
  ast?: ASTNode[];
  /** The raw template string. */
  template?: string;
  /** The data context for the template. */
  data?: DataContext;
  /** The DOM element associated with the template. */
  element?: HTMLElement;
  /** The root element where the template will be rendered (ShadowRoot or HTMLElement). */
  renderRoot?: ShadowRoot | HTMLElement;
  /** CSS styles for the template (as a string). */
  css?: string;
  /** Event handlers for the template. */
  events?: Record<string, (params: CallParams) => void>;
  /** Key bindings for the template. */
  keys?: KeyBindings;
  /** Default state for the template. */
  defaultState?: Record<string, any>;
  /** Sub-templates used within the template. */
  subTemplates?: Record<string, Function>;
  /** A function to create a component instance associated with the template. */
  createComponent?: (this: Template) => any;
  /** The parent template (if this is a nested template). */
  parentTemplate?: Template;
  /** The rendering engine to use ('lit' or a custom engine name). */
  renderingEngine?: 'lit' | string;
  /** Indicates if this is a prototype template. */
  isPrototype?: boolean;
  /** Whether to automatically attach styles to the renderRoot. */
  attachStyles?: boolean;
  /** Callback function invoked after the template is created. */
  onCreated?: (params: CallParams) => void;
  /** Callback function invoked after the template is rendered. */
  onRendered?: (params: CallParams) => void;
  /** Callback function invoked after the template is updated. */
  onUpdated?: (params: CallParams) => void;
  /** Callback function invoked after the template is destroyed. */
  onDestroyed?: (params: CallParams) => void;
  /** Callback function invoked after the theme has changed */
  onThemeChanged?: (params: CallParams) => void;
}
export type DataContext = Record<string, any>;

/**
 * Represents a rendered template instance, merging the instance properties and data context.
 */
export interface RenderedTemplate {
    [key: string]: any; // Allows any other properties since it merges instance and data.
}

// We don't need this helper anymore as we want to preserve Signal methods for autocomplete

/**
 * Standard parameters provided to lifecycle callbacks and event handlers in Semantic UI components.
 * 
 * These parameters provide access to the component's DOM, state, data context, and utility functions
 * like event handling and reactivity. They are automatically provided as arguments to lifecycle
 * callbacks (onCreated, onRendered, onUpdated, onDestroyed) and event handlers.
 * 
 * @see https://next.semantic-ui.com/guide#standard-arguments
 * @see https://next.semantic-ui.com/components/lifecycle
 * 
 * @template TState - Type of the component's reactive state variables
 * @template TSettings - Type of the component's configuration settings
 * @template TComponentInstance - Type of the component instance created by createComponent
 * @template TProperties - Type of the properties for Lit components
 */
export interface CallParams<
    TState extends Record<string, Signal<any>> = Record<string, Signal<any>>,
    TSettings extends Record<string, any> = Record<string, any>,
    TComponentInstance extends Record<string, any> = Record<string, any>,
    TProperties extends Record<string, any> = Record<string, any>
> {
  /**
   * The DOM element associated with the component.
   * 
   * This is the actual HTMLElement for the custom element in the DOM.
   * 
   * @example
   * // Change element style directly
   * el.style.backgroundColor = 'blue';
   */
  el: HTMLElement;
  
  /**
   * The component instance created by createComponent.
   * 
   * Provides access to instance methods and properties defined in the component.
   * 
   * @see https://next.semantic-ui.com/components/rendering#component-instance
   */
  tpl: TComponentInstance;
  
  /**
   * Alias for tpl - the component instance.
   * 
   * @see tpl
   */
  self: TComponentInstance;
  
  /**
   * Alias for tpl - the component instance.
   * 
   * @see tpl
   */
  component: TComponentInstance;
  
  /**
   * A function for querying DOM elements within the component's shadow DOM.
   * 
   * Similar to jQuery, but scoped to the component and doesn't cross shadow DOM boundaries.
   * Uses querySelector/querySelectorAll for better performance.
   * 
   * @param selector - CSS selector string or Node/NodeList to query
   * @param args - Optional query options
   * @returns A Query object with jQuery-like API
   * 
   * @example
   * $('.button').addClass('active');
   * 
   * @see https://next.semantic-ui.com/components/dom#querying-elements
   */
  $: (selector: string | Node | NodeList | HTMLCollection | Element[] | typeof Query.globalThisProxy, args?: QueryOptions) => Query;
  
  /**
   * A function for querying DOM elements, piercing through shadow DOM boundaries.
   * 
   * Similar to $, but can access elements across shadow DOM boundaries. Slower than $.
   * 
   * @param selector - CSS selector string or Node/NodeList to query
   * @param args - Optional query options
   * @returns A Query object with jQuery-like API
   * 
   * @example
   * $$('ui-icon .icon').attr('class');
   * 
   * @see https://next.semantic-ui.com/components/dom#piercing-shadow-dom
   */
  $$: (selector: string | Node | NodeList | HTMLCollection | Element[] | typeof Query.globalThisProxy, args?: QueryOptions) => Query;
  
  /**
   * Creates a reactive effect that automatically re-runs when its dependencies change.
   * 
   * Reactions are automatically cleaned up when the component is destroyed.
   * 
   * @param fn - Function to execute reactively
   * 
   * @example
   * reaction(() => {
   *   console.log('State changed:', state.count.get());
   * });
   * 
   * @see https://next.semantic-ui.com/reactivity#reactions
   * @see {@link Template.reaction}
   */
  reaction: Template['reaction'];
  
  /**
   * Creates a reactive signal (observable value).
   * 
   * Signals are the building blocks of reactivity in Semantic UI components.
   * 
   * @param value - Initial value of the signal
   * @param options - Signal configuration options
   * @returns A reactive signal
   * 
   * @example
   * const count = signal(0);
   * count.get(); // Get value (0)
   * count.set(5); // Set value to 5
   * count.value = 5; // set value to 5
   * 
   * @see https://next.semantic-ui.com/reactivity#signals
   * @see {@link Template.signal}
   */
  signal: Template['signal'];
  
  /**
   * Executes a callback after all pending reactive updates have been processed.
   * 
   * Useful for operations that need to happen after the DOM has been updated.
   * 
   * @param callback - Function to execute after updates
   * 
   * @example
   * state.set(newValue);
   * afterFlush(() => {
   *   // DOM is now updated
   * });
   * 
   * @see https://next.semantic-ui.com/reactivity#batching-and-flushing
   */
  afterFlush: (callback: () => void) => void;
  
  /**
   * Runs a function without tracking reactive dependencies.
   * 
   * Prevents the function from creating dependencies on signals it reads.
   * 
   * @param fn - Function to run without tracking
   * @returns The return value of the function
   * 
   * @example
   * const value = nonreactive(() => state.get.count());
   * 
   * @see https://next.semantic-ui.com/reactivity#nonreactive
   */
  nonreactive: <T>(fn: () => T) => T;
  
  /**
   * Forces immediate execution of pending reactive updates.
   * 
   * Normally updates are batched for performance, but this triggers them immediately.
   * 
   * @example
   * state.count(state.count() + 1);
   * flush();
   * someFunc(); // dom is updated before someFunc
   * 
   * @see https://next.semantic-ui.com/reactivity#batching-and-flushing
   */
  flush: () => void;
  
  /**
   * The data context for the component.
   * 
   * Contains all data available to the template for rendering, including
   * properties passed to the component.
   * 
   * @see https://next.semantic-ui.com/components/rendering
   */
  data: DataContext;
  
  /**
   * Component configuration settings.
   * 
   * These are either passed as props to the component or set as default
   * values in the component definition.
   * 
   * @example
   * // Access a setting
   * const color = settings.color || 'default';
   * 
   * @see https://next.semantic-ui.com/components/settings
   */
  settings: TSettings & TProperties;
  
  /**
   * Reactive state variables for the component.
   * 
   * Each property is a Signal that can be accessed and modified.
   * Changes to state automatically trigger UI updates.
   * 
   * @example
   * // Get state value
   * const count = state.count();
   * // Update state value
   * state.count(count + 1);
   * 
   * @see https://next.semantic-ui.com/components/state
   */
  state: TState;
  
  /**
   * Checks if the component is rendered in the DOM.
   * 
   * @returns True if the component's DOM has been rendered
   * 
   * @example
   * if (isRendered()) {
   *   // Safe to access DOM
   * }
   * @see https://next.semantic-ui.com/components/lifecycle#callback-arguments
   */
  isRendered: () => boolean;
  
  /**
   * Indicates if the component is rendering on the server.
   * 
   * Useful for conditional SSR logic.
   * 
   * @example
   * if (isServer) {
   *   // Skip client-only operations
   * }
   * @see https://next.semantic-ui.com/components/lifecycle#callback-arguments
   */
  isServer: boolean;
  
  /**
   * Indicates if the component is rendering in the browser.
   * 
   * Useful for conditional client-side logic.
   * 
   * @example
   * if (isClient) {
   *   // Perform browser-only operations
   * }
   * @see https://next.semantic-ui.com/components/lifecycle#callback-arguments
   */
  isClient: boolean;
  
  /**
   * Dispatches a custom event from the component's element.
   * 
   * @param eventName - Name of the custom event
   * @param eventData - Data to include in the event detail
   * @param eventSettings - Event configuration options
   * @param options - Additional options for event dispatch
   * @returns A Query object for the element
   * 
   * @example
   * dispatchEvent('change', { value: state.value() });
   * 
   * @see https://next.semantic-ui.com/components/events#dispatching-events
   * @see {@link Template.dispatchEvent}
   */
  dispatchEvent: Template['dispatchEvent'];
  
  /**
   * Attaches an event listener using event delegation.
   * 
   * Handles attaching and cleaning up event listeners automatically.
   * 
   * @param selector - CSS selector for target elements
   * @param eventName - Name of the event to listen for
   * @param eventHandler - Handler function for the event
   * @param options - Configuration options for the event
   * @returns A Query object for managing the event
   * 
   * @example
   * attachEvent('.button', 'click', (e) => console.log('Button clicked'));
   * 
   * @see https://next.semantic-ui.com/components/events#attaching-events
   * @see {@link Template.attachEvent}
   */
  attachEvent: Template['attachEvent'];
  
  /**
   * Binds a key sequence to a handler function.
   * 
   * Useful for creating keyboard shortcuts within components.
   * 
   * @param key - Key sequence (e.g., "Ctrl+S", "Shift+Enter")
   * @param callback - Handler function for the key sequence
   * 
   * @example
   * bindKey('Ctrl+Enter', (e) => submitForm());
   * 
   * @see https://next.semantic-ui.com/components/keys
   * @see {@link Template.bindKey}
   */
  bindKey: Template['bindKey'];
  
  /**
   * Unbinds a previously bound key sequence.
   * 
   * @param key - Key sequence to unbind
   * 
   * @example
   * unbindKey('Ctrl+Enter');
   * 
   * @see https://next.semantic-ui.com/components/keys
   * @see {@link Template.unbindKey}
   */
  unbindKey: Template['unbindKey'];
  
  /**
   * AbortController for managing asynchronous operations.
   * 
   * Automatically aborts any pending operations when the component is destroyed.
   * 
   * @example
   * fetch('/api/data', { signal: abortController.signal })
   *   .then(response => response.json())
   *   .then(data => state.data(data));
   */
  abortController: AbortController;
  
  /**
   * Template helper functions for common operations.
   * 
   * @see {@link TemplateHelpers}
   */
  helpers: typeof TemplateHelpers;
  
  /**
   * The underlying template instance.
   * 
   * Provides access to lower-level template APIs.
   * 
   * @see {@link Template}
   */
  template: Template;
  
  /**
   * The name of the current template.
   * 
   * Useful for debugging and finding templates.
   * @see https://next.semantic-ui.com/components/lifecycle#callback-arguments
   */
  templateName: string;
  
  /**
   * A Map containing all rendered templates on the page.
   * 
   * Useful for accessing other components on the page.
   * @see https://next.semantic-ui.com/components/lifecycle#callback-arguments
   */
  templates: Map<string, Template[]>;
  
  /**
   * Finds a template by its name.
   * 
   * @param templateName - Name of the template to find
   * @returns The template instance or undefined if not found
   * 
   * @example
   * const navTemplate = findTemplate('navigation');
   * @see https://next.semantic-ui.com/components/lifecycle#callback-arguments
   */
  findTemplate: (templateName: string) => Template | undefined;
  
  /**
   * Finds a parent template by name.
   * 
   * @param templateName - Name of the parent template to find
   * @returns The rendered template instance or undefined if not found
   * 
   * @example
   * const parentForm = findParent('form');
   * @see https://next.semantic-ui.com/components/lifecycle#callback-arguments
   */
  findParent: (templateName: string) => RenderedTemplate | undefined;
  
  /**
   * Finds a child template by name.
   * 
   * @param templateName - Name of the child template to find
   * @returns The rendered template instance or undefined if not found
   * 
   * @example
   * const childInput = findChild('input');
   * @see https://next.semantic-ui.com/components/lifecycle#callback-arguments
   */
  findChild: (templateName: string) => RenderedTemplate | undefined;
  
  /**
   * Finds all child templates by name.
   * 
   * @param templateName - Name of the child templates to find
   * @returns Array of rendered template instances
   * 
   * @example
   * const allItems = findChildren('list-item');
   * @see https://next.semantic-ui.com/components/lifecycle#callback-arguments
   */
  findChildren: (templateName: string) => RenderedTemplate[];
  
  /**
   * Indicates if dark mode is active.
   * 
   * Useful for conditional styling based on theme.
   * 
   * @example
   * const bgColor = darkMode ? '#333' : '#fff';
   * 
   * @see https://next.semantic-ui.com/theming
   */
  darkMode: boolean;
}

export interface EventData {
  [key: string]: any;
}

export interface EventSettings {
  /** An AbortController for managing the event listener. */
  abortController?: AbortController;
  /** If true return value of event handler, else do not */
  returnHandler?: boolean;
  [key: string]: any;
}

export type KeyBindingHandler = (params: CallParams) => void;

export interface KeyBindings {
  /** Maps key sequences (e.g., "Ctrl+Shift+A") to handler functions. */
  [keySequence: string]: KeyBindingHandler;
}
export interface ParsedEvent {
  /** The name of the event (e.g., "click", "mouseover"). */
  eventName: string;
  /**
   * The type of event binding:
   * - 'deep': Listens deeply within the DOM, even if originating from a descendant not matching the selector.
   * - 'global': Listens on the global scope (document).
   * - 'delegated': Uses event delegation within the template's root.
   */
  eventType: 'deep' | 'global' | 'delegated';
  /** The CSS selector for event delegation. */
  selector: string;
}

export interface QuerySettings { // extends QueryOptions
  /** The root element for the query (defaults to the template's renderRoot). */
  root?: HTMLElement | ShadowRoot | Document;
  /** Whether to pierce through shadow DOM boundaries. */
  pierceShadow?: boolean;
  /** Whether to filter results to elements within the template. */
  filterTemplate?: boolean;
  [key: string]: any;
}

export interface AttachSettings {
  /** The parent node to which the template's content should be attached. Defaults to renderRoot. */
  parentNode?: HTMLElement | ShadowRoot;
  /**  Optional start marker node for insertion. */
  startNode?: Node;
  /** Optional end marker node for insertion. */
  endNode?: Node;
}


export class Template {
  /** Static counter for the total number of templates created. */
  static templateCount: number;
  /** Static property indicating if the environment is server-side. */
  static isServer: boolean;
  /** Static Map holding all rendered templates. */
  static renderedTemplates: Map<string, Template[]>;

  /** The compiled Abstract Syntax Tree (AST) of the template. */
  ast: ASTNode[];
  /** CSS styles for the template (as a string). */
  css?: string;
  /** The data context for the template. */
  data: DataContext;
  /** Default state for the template. */
  defaultState?: Record<string, any>;
  /** The DOM element associated with the template. */
  element?: HTMLElement;
  /** Event handlers for the template. */
  events?: Record<string, Function>;
  /** Unique identifier for the template instance. */
  id: string;
  /** Instance methods and properties created by the `createComponent` function. */
  instance: Record<string, any>;
  /** Indicates if this is a prototype template. */
  isPrototype: boolean;
  /** Key bindings for the template. */
  keys: KeyBindings;
  /** Callback function invoked after the template is created. */
  onCreatedCallback: (params: CallParams) => void;
  /** Callback function invoked after the template is destroyed. */
  onDestroyedCallback: (params: CallParams) => void;
  /** Callback function invoked after the template is rendered. */
  onRenderedCallback: (params: CallParams) => void;
  /** Callback function invoked when the theme changes. */
  onThemeChangedCallback: (params: CallParams) => void;
  /** The parent template (if this is a nested template). */
  parentTemplate?: Template;
  /** Array of reactive reactions associated with the template. */
  reactions: Reaction[];
  /** The root element where the template is rendered (ShadowRoot or HTMLElement). */
  renderRoot?: ShadowRoot | HTMLElement;
  /** The rendering engine used ('lit' or a custom engine name). */
  renderingEngine: 'lit' | string; // Currently only 'lit' is supported.
  /** The LitRenderer instance used for rendering. */
  renderer: LitRenderer;
  /** Optional start marker node for insertion. */
  startNode?: Node;
  /** Optional end marker node for insertion.. */
  endNode?: Node;
  /** The reactive state of the template. */
  state: Record<string, Signal<any>>;
  /** The constructed stylesheet for the template (if `attachStyles` is true). */
  stylesheet?: CSSStyleSheet;
  /** Sub-templates used within the template. */
  subTemplates?: Record<string, Function>; // Assuming subTemplates are functions that return templates.
  /** The name of the template. */
  templateName: string;
  /** A function to create a component instance associated with the template. */
  createComponent?: (this: Template) => any;
  /** Whether to automatically attach styles to the renderRoot. */
  attachStyles: boolean;

  /** Initialization flag */
  initialized: boolean;
  /** Whether or not the component is rendered. */
  rendered: boolean;

  /** The parent node */
  parentNode: HTMLElement | ShadowRoot | undefined;

  /** The parent template (if this is a nested template). */
  _parentTemplate?: Template;
  /** Child templates */
  _childTemplates?: Template[];
  /** Abort controller for events. */
  eventController?: AbortController;
  /** The key sequence */
  currentSequence?: string;
  /** the current key */
  currentKey?: string;
  /** The key timeout */
  resetSequence?: ReturnType<typeof setTimeout>;

  /**
   * Creates a new Template instance.
   * @param settings - Configuration options for the template.
   */
  constructor(settings?: TemplateSettings);

  /**
   * Creates a reactive state object from the default state and initial data.
   * @param defaultState - The default state object.
   * @param data - Initial data to merge with the default state.
   * @returns The reactive state object.
   */
  createReactiveState(defaultState: Record<string, any>, data: DataContext): Record<string, Signal<any>>;

  /**
   * Sets the data context for the template.
   * @param data - The new data context.
   * @param options - Options.
   * @param options.rerender - whether to force a rerender. default true
   */
  setDataContext(data: DataContext, options?: { rerender?: boolean }): void;

  /**
   * Sets the parent template for this template instance.
   * @param parentTemplate - The parent template instance.
   */
  setParent(parentTemplate: Template): void;

  /**
   * Sets the element associated with this template.
   * @param element - The DOM element.
   */
  setElement(element: HTMLElement): void;
  /**
   * Generates a generic template name (e.g., "Anonymous #1").
   * @returns The generic template name.
   */
  getGenericTemplateName(): string;

  /**
   * Initializes the template instance, creating the component, setting up callbacks, and initializing the renderer.
   */
  initialize(): void;

  /**
   * Attaches the template to the DOM.
   * @param renderRoot - The root element (ShadowRoot or HTMLElement) to attach to.
   * @param options - Attach settings
   */
  attach(renderRoot: ShadowRoot | HTMLElement, options?: AttachSettings): Promise<void>;

  /**
   * Gets the combined data context, including data, state, and instance properties.
   * @returns The data context object.
   */
  getDataContext(): DataContext;

  /**
   * Adopts the template's stylesheet to the renderRoot (if using a ShadowRoot).
   */
  adoptStylesheet(): Promise<void>;

  /**
   * Creates a clone of the template with optional overrides.
   * @param settings - Partial settings to override in the cloned template.
   * @returns The cloned Template instance.
   */
  clone(settings?: Partial<TemplateSettings>): Template;

  /**
   * Parses an event string into its constituent parts (eventName, eventType, selector).
   * @param eventString - The event string to parse (e.g., "click .my-button", "global keydown .input").
   * @returns Parsed event array.
   */
  parseEventString(eventString: string): ParsedEvent[];

  /**
   * Attaches event listeners to the template's renderRoot based on the provided event configuration.
   * @param events - An object mapping event strings to handler functions.
   */
  attachEvents(events?: Record<string, Function>): void;

  /**
   * Removes all event listeners attached by the template.
   */
  removeEvents(): void;

  /**
   * Binds keybindings to the template
   * @param keys
   */
  bindKeys(keys?: KeyBindings): void;

  /**
   * Binds a key sequence to a handler function.
   * @param key - The key sequence (e.g., "Ctrl+A", "Shift+Enter").
   * @param callback - The handler function to execute when the key sequence is pressed.
   */
  bindKey(key: string, callback: KeyBindingHandler): void;

  /**
   * Unbinds a previously bound key sequence.
   * @param key - The key sequence to unbind.
   */
  unbindKey(key: string): void;

  /**
   * Checks if a given DOM node is within the template's rendered content.
   * @param node - The DOM node to check.
   * @returns True if the node is within the template, false otherwise.
   */
  isNodeInTemplate(node: Node): boolean;

  /**
   * Renders the template, producing a lit-html TemplateResult.
   * @param additionalData - Additional data to be merged into the template's data context.
   * @returns The rendered lit-html TemplateResult.
   */
  render(additionalData?: DataContext): any;

  /**
   * Queries for DOM elements within the template's renderRoot (similar to jQuery's $).
   * @param selector - The CSS selector.
    * @param options - query settings
    * @returns A Query object representing the matched elements.
    */
  $(selector: string, options?: QuerySettings): Query;
/**
   * Queries for DOM elements within the template's renderRoot, piercing shadow DOM boundaries (similar to jQuery's $$).
   * @param selector - The CSS selector.
   * @param options - query settings
   * @returns A Query object representing the matched elements.
   */
  $$(selector: string, options?: QuerySettings): Query;

  /**
   * Calls a function within the template's context, providing convenient access to template helpers and data.
   * @param func - The function to call.
   * @param options - options
   * @returns The return value of the called function, or undefined if the function is not defined.
   */
  call<T>(
      func: ((params: CallParams) => T) | undefined,
      options?: {
          params?: CallParams;
          additionalData?: Record<string, any>;
          firstArg?: any;
          additionalArgs?: any[];
      }
  ): T | undefined;

  /**
   * Attaches an event listener using event delegation.
   * @param selector - The CSS selector to delegate the event to.
   * @param eventName - The name of the event (e.g., "click", "input").
   * @param eventHandler - The event handler function.
   * @param options
   * @param options.eventSettings - event settings
   * @param options.querySettings - query settings
   * @returns A Query object for managing the event listener.
   */
  attachEvent(selector: string, eventName: string, eventHandler: (event: Event) => void, options?: { eventSettings?: EventSettings, querySettings?: { pierceShadow?: boolean } }): Query;

  /**
   * Dispatches a custom event from the template's element.
   * @param eventName - The name of the custom event.
   * @param eventData - Data to be included in the event's detail property.
    * @param eventSettings - event settings
    * @param options
    * @param options.triggerCallback - whether to trigger the callback. default `true`
    * @returns A Query object for managing the event.
    */
  dispatchEvent(eventName: string, eventData?: EventData, eventSettings?: EventSettings, options?: { triggerCallback?: boolean }): Query;

  /**
   * Creates a reactive effect that will re-run whenever its dependencies change.  Reactions are automatically cleaned up when the component is destroyed.
   * @param reaction - The function to execute as a reactive effect.
   */
  reaction(reaction: () => void): void;

  /**
   * Creates a reactive signal.
   * @param value - The initial value of the signal.
   * @param options - Options for the signal.
   * @returns The signal.
   */
  signal<T>(value: T, options?: SignalOptions<T>): Signal<T>;

  /**
   * Clears all reactions associated with this template.
   */
  clearReactions(): void;

  /**
   * Finds a template instance by its name.
   * @param templateName - The name of the template to find.
   * @returns The Template instance, or undefined if not found.
   */
  findTemplate: (templateName: string) => Template | undefined;

  /**
   * Finds a parent template instance by its name.
   * @param templateName - The name of the parent template to find.
   * @returns The rendered template instance, or undefined if not found.
   */
  findParent: (templateName: string) => RenderedTemplate | undefined;

  /**
   * Finds a child template by name.
   * @param {string} templateName name of template
   * @returns {RenderedTemplate | undefined} Rendered template instance or undefined
   */
  findChild(templateName: string): RenderedTemplate | undefined;

  /**
    * @param {string} templateName - template to find
    * @returns The rendered template instances, or an empty array if not found.
    */
  findChildren(templateName: string): RenderedTemplate[];

  /**
   * Adds a template instance to the static registry of rendered templates.
   * @param template - The Template instance to add.
   */
  static addTemplate(template: Template): void;

  /**
   * Removes a template instance from the static registry.
   * @param template - The Template instance to remove.
   */
  static removeTemplate(template: Template): void;

  /**
   * Retrieves all rendered template instances with a given name.
   * @param templateName - The name of the template to retrieve.
   * @returns An array of Template instances.
   */
  static getTemplates(templateName: string): Template[];

  /**
   * Finds a single rendered template instance by its name.
   * @param templateName - The name of the template to find.
   * @returns The Template instance, or undefined if not found.
   */
  static findTemplate(templateName: string): Template | undefined;
  /**
   * Finds a parent of the provided template
   * @param {Template} template - template instance
   * @param {string} templateName - name of template
   * @returns {RenderedTemplate | undefined} Returns rendered template
   */
  static findParentTemplate(template: Template, templateName: string): RenderedTemplate | undefined;

  /**
   * Finds all child templates with a given name within a parent template.
   * @param template - The parent Template instance.
   * @param templateName - The name of the child templates to find.
   * @returns An array of rendered template instances.
   */
  static findChildTemplates(template: Template, templateName: string): RenderedTemplate[];

  /**
   * Finds a single, direct child, template
   * @param {Template} template - template to search
   * @param {string} templateName - name of template to find
   * @returns {RenderedTemplate | undefined} Returns rendered template instance.
   */
  static findChildTemplate(template: Template, templateName: string): RenderedTemplate | undefined;
  /**
    * Lifecycle callback invoked after the template is created.
    */
  onCreated: () => void;
  /**
    * Lifecycle callback invoked after the template is destroyed.
    */
  onDestroyed: () => void;
  /**
    * Lifecycle callback invoked after the template is rendered.
    */
  onRendered: () => void;
  /**
    * Lifecycle callback invoked after the template is updated.
    */
  onUpdated: () => void;
  /**
    * Lifecycle callback invoked after the theme changes.
    */
  onThemeChanged: (...args: any[]) => void;
}
