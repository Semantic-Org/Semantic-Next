import { LitRenderer } from '@semantic-ui/renderer';
import { TemplateHelpers } from './template-helpers';
import { Query, QueryOptions } from '@semantic-ui/query';
import { Signal, SignalOptions, Reaction } from '@semantic-ui/reactivity';;
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
  events?: Record<string, Function>;
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

// Helper type to recursively extract Signal values from a record
type ExtractSignalValues<T> = {
  [K in keyof T]: T[K] extends Signal<infer U> ? U : T[K];
};

// Updated CallParams with generics
export interface CallParams<
    TState extends Record<string, any> = Record<string, any>,
    TSettings extends Record<string, any> = Record<string, any>,
    TComponentInstance extends Record<string, any> = Record<string, any>,
    TProperties extends Record<string, any> = Record<string, any>  // For Lit properties
> {
  /** The DOM element associated with the call. */
  el: HTMLElement;
  /** The template instance. */
  tpl?: TComponentInstance;  // Use generic type
  /** The 'this' context of the calling function. */
  self?: TComponentInstance; // Use generic type
  /** The component instance. */
  component?: TComponentInstance; // Use generic type
  /** A function for querying DOM elements (similar to jQuery). */
  $?: (selector: string | Node | NodeList | HTMLCollection | Element[] | typeof Query.globalThisProxy, args?: QueryOptions) => Query;
  /** A function for querying DOM elements, piercing shadow DOM (similar to jQuery). */
  $$?: (selector: string | Node | NodeList | HTMLCollection | Element[] | typeof Query.globalThisProxy, args?: QueryOptions) => Query;
    /** Creates a reactive effect. See {@link Template.reaction}. */
  reaction?: Template['reaction'];
  /** Creates a reactive signal. See {@link Template.signal}. */
  signal?: Template['signal'];
  /** Executes a callback after all pending reactive updates have been flushed. */
  afterFlush?: (callback: () => void) => void;
  /** Runs a function without tracking reactive dependencies. */
  nonreactive?: <T>(fn: () => T) => T;
  /** Forces immediate execution of pending reactive updates. */
  flush?: () => void;
  /** The data context for the call. */
  data?: DataContext;
    /**
 * Settings for the call (type might need refinement).
 * See {@link https://next.semantic-ui.com/components/rendering#settings Component Settings} for more details.
 */
  settings?: TSettings & TProperties; // Use generic type. Lit properties are NOT exposed.
  /**
    * Reactive state variables.  The unwrapped values from the Signals.
    * See {@link https://next.semantic-ui.com/components/rendering#state Component State} for more details.
    */
  state?: ExtractSignalValues<TState>; // Use ExtractSignalValues
  /** Checks if the template is rendered. */
  isRendered?: () => boolean;
  /** Indicates if the rendering is happening on the server. */
  isServer?: boolean;
  /** Indicates if the rendering is happening on the client. */
  isClient?: boolean;
  /** Dispatches a custom event from the template's element. */
  dispatchEvent?: Template['dispatchEvent'];
  /** Attaches an event listener using event delegation. */
  attachEvent?: Template['attachEvent']
  /** Binds a key sequence to a handler. */
  bindKey?: Template['bindKey'];
  /** Unbinds a key sequence. */
  unbindKey?: Template['unbindKey'];
  /** An AbortController for managing asynchronous operations. */
  abortController?: AbortController;
  /** Template helper functions. */
  helpers?: typeof TemplateHelpers;
  /** The template instance. */
  template?: Template;
  /** The name of the template. */
  templateName?: string;
  /** A Map containing all rendered templates. */
  templates?: Map<string, Template[]>;
  /** Finds a template by its name. */
  findTemplate?: (templateName: string) => Template | undefined;
  /** Finds a parent template by name. */
  findParent?: (templateName: string) => RenderedTemplate | undefined;
  /** Finds a child template by name */
  findChild?: (templateName: string) => RenderedTemplate | undefined;
  /** Finds all child templates by name. */
  findChildren?: (templateName: string) => RenderedTemplate[];
  darkMode?: boolean;
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

export type KeyBindingHandler = (event: KeyboardEvent) => void;

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
