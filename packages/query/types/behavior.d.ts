import { EventHandler, EventOptions, LogLevel, Query, QueryOptions, QuerySelector } from './query.js';

type PlainObject<T = any> = Record<string, T>;

/** Query factory bound to the same Query class the behavior was created from. */
type BehaviorQuery = (selector?: QuerySelector, options?: QueryOptions) => Query;

/**
 * The parameter bag every behavior callback receives. Destructure what you need.
 * @see {@link https://next.semantic-ui.com/docs/guides/query/plugins Behavior Guide}
 */
export interface BehaviorContext {
  /** Creates a Query instance, i.e. `$('.item').addClass('active')`. */
  $: BehaviorQuery;
  /** The element this instance is attached to. */
  el: Element;
  /** A Query instance wrapping `el`. */
  $el: Query;
  /** The behavior instance, including every method returned from `createBehavior`. */
  self: Behavior & PlainObject;
  /** Alias for `self`. */
  behavior: Behavior & PlainObject;
  /** The AbortController torn down on destroy. This is the controller, not its signal. */
  abortSignal: AbortController;
  /** The namespace the instance is stored under on the element. */
  namespace: string;
  /** Attaches an event outside the element that is removed when the behavior is destroyed. */
  attachEvent: Behavior['attachEvent'];
  /** Dispatches a namespaced CustomEvent from the element. */
  dispatchEvent: Behavior['dispatchEvent'];
  /** Dispatches a namespaced CustomEvent from every element in the group. */
  dispatchGroupEvent: Behavior['dispatchGroupEvent'];
  /** Logs a message, ignoring the log level. */
  log: (message: string, ...data: any[]) => void;
  /** Logs a message when the log level is `debug`. */
  debug: (message: string, ...data: any[]) => void;
  /** Logs a message when the log level is `warn` or louder. */
  warn: (message: string, ...data: any[]) => void;
  /** Logs a message when the log level is `error` or louder. */
  error: (message: string, ...data: any[]) => void;
  /** Index of this element within the group the behavior was called on. */
  index: number;
  /** Total elements in the group the behavior was called on. */
  total: number;
  /** Whether this is the first element in the group. */
  isFirst: boolean;
  /** Whether this is the last element in the group. */
  isLast: boolean;
  /** Storage shared by every instance of this behavior. */
  cache: PlainObject;
  /** The element's data attributes, parsed as JSON where possible. */
  data: PlainObject;
  /** CSS selectors declared by the behavior. */
  selectors: Record<string, string>;
  /** HTML templates declared by the behavior. */
  templates: Record<string, string>;
  /** Error messages declared by the behavior. */
  errors: Record<string, string>;
  /** CSS class names declared by the behavior. */
  classNames: Record<string, string>;
  /** Run-time settings, defaults merged with the settings passed at call time. */
  settings: PlainObject;
}

/**
 * The parameter bag an event handler receives, adding the event specifics.
 */
export interface BehaviorEventContext extends BehaviorContext {
  /** The original DOM event. */
  event: Event;
  /** The element matching the handler's selector, which may differ from `event.target`. */
  target: Element;
  /** The target's value, for form elements or events carrying `detail.value`. */
  value: any;
  /** The target's data attributes merged with the event's `detail`. */
  data: PlainObject;
}

/**
 * The parameter bag a mutation handler receives, adding the observed changes.
 */
export interface BehaviorMutationContext extends BehaviorContext {
  /** The records reported by the MutationObserver. */
  mutations: MutationRecord[];
  /** A Query instance wrapping the mutated node. */
  $target: Query;
  /** The mutated node. */
  target: Node;
  /** Added nodes matching the selector. Present for childList mutations. */
  $added?: Query;
  /** Removed nodes matching the selector. Present for childList mutations. */
  $removed?: Query;
  /** The changed attribute. Present for `attributes` mutations. */
  attributeName?: string | null;
  /** The attribute's new value. Present for `attributes` mutations. */
  attributeValue?: string | null;
  /** The previous value. Present for `attributes` and `text` mutations. */
  oldValue?: string | null;
  /** The node's new text. Present for `text` mutations. */
  textContent?: string | null;
}

/**
 * The parameter bag `customInvocation` receives when a called method is not found.
 */
export interface BehaviorInvocationContext extends BehaviorContext {
  /** The method name that was called. */
  methodName: string;
  /** The arguments the method was called with. */
  methodArgs: any[];
}

/**
 * The parameter bag `setup` receives. Setup runs once, before the first instance is created,
 * so it has no element to work from.
 */
export interface BehaviorSetupContext {
  /** Creates a Query instance. */
  $: BehaviorQuery;
  /** Every element the behavior was called on. */
  $elements: Query;
  /** The settings passed at call time. */
  settings: PlainObject;
  /** HTML templates declared by the behavior. */
  templates: Record<string, string>;
}

/**
 * A behavior definition, as passed to `registerBehavior()`.
 * @see {@link https://next.semantic-ui.com/docs/guides/query/plugins Behavior Guide}
 */
export interface BehaviorDefinition {
  /** Behavior name. Becomes the Query method, i.e. `$('.el').tooltip()`. */
  name: string;
  /** Namespace for storing behavior on element. Defaults to the name. */
  namespace?: string;
  /** CSS to be added to page */
  css?: string;
  /** Settings merged under the settings passed at call time */
  defaultSettings?: PlainObject;
  /** One time setup. Its return value is shared across every instance. */
  setup?: (context: BehaviorSetupContext) => PlainObject | void;
  /** Function that returns behavior instance */
  createBehavior?: (context: BehaviorContext) => PlainObject;
  /** Event handlers, keyed by an event string like `'click .item'` */
  events?: Record<string, (context: BehaviorEventContext) => any>;
  /** Mutation observers, keyed by a mutation string like `'observe .list'` */
  mutations?: Record<string, (context: BehaviorMutationContext) => any>;
  /** Allow data attributes to override settings. Defaults to true. */
  allowDataOverride?: boolean;
  /** Callback when created */
  onCreated?: (context: BehaviorContext) => void;
  /** Callback when destroyed */
  onDestroyed?: (context: BehaviorContext) => void;
  /** Custom method invocation handler, called when a method name is not found */
  customInvocation?: (context: BehaviorInvocationContext) => any;
  /** CSS selectors */
  selectors?: Record<string, string>;
  /** CSS class names */
  classNames?: Record<string, string>;
  /** Error messages */
  errors?: Record<string, string>;
  /** HTML templates */
  templates?: Record<string, string>;
  /** Log level for this behavior. Defaults to `Query.logLevel`. */
  logLevel?: LogLevel;
  /** Wrap instance methods in performance marks. Defaults to `Query.logPerformance`. */
  logPerformance?: boolean;
}

/**
 * A behavior definition plus everything the runtime injects per element.
 * This is what the `Behavior` constructor receives.
 */
export interface BehaviorConfig extends BehaviorDefinition {
  /** Query element to initialize */
  $element: Query;
  /** Query elements in group */
  $elements: Query;
  /** Query class reference */
  Query: typeof Query;
  /** Behavior settings */
  settings?: PlainObject;
  /** Shared behavior across instances, returned from `setup` */
  sharedBehavior?: PlainObject;
  /** Index of element in group */
  elementIndex?: number;
  /** Total elements in group */
  totalElements?: number;
}

/**
 * The method a registered behavior adds to `Query.prototype`.
 * Calling it with settings initializes (or reinitializes) the behavior,
 * calling it with a method name invokes that method on the instance.
 */
export interface BehaviorMethod {
  /**
   * Calls a method on the behavior instance, i.e. `$('.el').tooltip('show')`.
   * @param methodName - The method to invoke, looked up on the instance.
   * @param methodArgs - Arguments forwarded to the method.
   * @returns The method's return value, or the collection when it returned nothing.
   */
  (methodName: string, ...methodArgs: any[]): any;
  /**
   * Initializes the behavior on each element, or reinitializes it with new settings.
   * @param settings - Settings merged over the behavior's defaults.
   * @returns The collection for chaining.
   */
  (settings?: PlainObject): any;
  /** Defaults for this behavior. Assign to change them globally. */
  defaultSettings: PlainObject;
  /** CSS class names for this behavior. Assign to change them globally. */
  classNames: Record<string, string>;
  /** CSS selectors for this behavior. Assign to change them globally. */
  selectors: Record<string, string>;
  /** Error messages for this behavior. Assign to change them globally. */
  errors: Record<string, string>;
  /** Values returned from `setup`, shared across instances. */
  sharedBehavior?: PlainObject;
  /** Storage shared across instances, exposed to callbacks as `cache`. */
  cache?: PlainObject;
}

/**
 * A behavior instance, created for each element a behavior is called on.
 * @see {@link https://next.semantic-ui.com/docs/guides/query/plugins Behavior Guide}
 */
export class Behavior {
  /** Captures word characters inside curly braces: `{title}` -> `title`. */
  static TEMPLATING_REGEX: RegExp;

  constructor(config: BehaviorConfig);

  $: BehaviorQuery;
  Query: typeof Query;
  $element: Query;
  $elements: Query;
  element: Element;
  settings: PlainObject;
  namespace: string;
  customInvocation: (context: BehaviorInvocationContext) => any;
  onCreated: (context: BehaviorContext) => void;
  onDestroyed: (context: BehaviorContext) => void;
  elementIndex: number;
  totalElements: number;
  classNames: Record<string, string>;
  selectors: Record<string, string>;
  errors: Record<string, string>;
  templates: Record<string, string>;
  mutations: Record<string, (context: BehaviorMutationContext) => any>;
  sharedBehavior: PlainObject;
  /** Methods returned from `createBehavior`, also merged onto the instance. */
  instance: PlainObject;
  logLevel: LogLevel;
  logPerformance: boolean;
  controller: AbortController;
  mutationObservers?: MutationObserver[];
  events?: Record<string, (context: BehaviorEventContext) => any>;

  adoptStylesheet(css: string): void;
  addDataOverrides(element?: Element): void;
  reinitialize(settings: BehaviorConfig): void;
  parseTemplate(templateString: string, data: PlainObject): string;
  parseEventString(
    eventString: string,
  ): Array<{ eventName: string; eventType: 'delegate' | 'global' | 'bind'; selector: string; }>;
  getElementData(element?: Element): PlainObject;
  attachEvents(events?: Record<string, (context: BehaviorEventContext) => any>): void;

  /**
   * Attaches an event to an element outside the behavior, removed when the behavior is destroyed.
   * @param selector - What to bind to, queried from `document` and piercing shadow roots by default.
   * @param eventName - A space-separated string of event names.
   * @param eventHandler - The event handler function.
   * @param options - Overrides for the `on()` call and for the query used to find the element.
   * @returns The created handler, or an array of handlers when more than one was created.
   */
  attachEvent(
    selector: QuerySelector,
    eventName: string,
    eventHandler: EventListener,
    options?: { onSettings?: EventOptions; querySettings?: QueryOptions; },
  ): EventHandler | EventHandler[];

  attachMutations(mutations?: Record<string, (context: BehaviorMutationContext) => any>): void;
  removeMutations(): void;
  parseMutationString(mutationString: string): {
    observedElement: Element;
    keyword: 'standard' | 'observe' | 'add' | 'remove' | 'attributes' | 'text';
    observerOptions: MutationObserverInit;
    selector: string;
  };
  getMutationCallbackArgs(mutations: MutationRecord[], additionalData?: PlainObject): PlainObject;
  removeEvents(): void;
  dispatchEvent(
    eventName: string,
    detail?: PlainObject,
    eventSettings?: CustomEventInit,
    options?: { element?: Element; namespace?: string; },
  ): void;
  dispatchGroupEvent(
    eventName: string,
    detail?: PlainObject,
    eventSettings?: CustomEventInit,
    options?: { $elements?: Query; namespace?: string; },
  ): void;
  lookup(query: string): any;
  callMethod(query: string, ...methodArgs: any[]): any;

  /** Whether a message at the given level passes the instance's log level. */
  canLog(requiredLevel: string): boolean;
  outputLog(message: string, level: string, additionalSettings?: PlainObject): void;
  /** Logs a message, ignoring the log level. */
  log(message: string, ...data: any[]): void;
  debug(message: string, ...data: any[]): void;
  warn(message: string, ...data: any[]): void;
  error(message: string, ...data: any[]): void;

  /**
   * Sets a single setting.
   * @param name - The setting to write.
   * @param value - The value to store.
   * @returns The behavior instance for chaining.
   */
  setting(name: string, value: any): this;
  /**
   * Reads a single setting.
   * @param name - The setting to read.
   * @returns The current value.
   */
  setting(name: string): any;

  /**
   * Returns the instance, wrapped in a performance-tracking proxy when `logPerformance` is on.
   * @internal
   */
  getSelf(): this;

  /**
   * Calls a callback with the standard parameter bag and `this` bound to the element.
   * @param func - The callback to invoke. Non functions are ignored.
   * @param options - `params` replaces the bag entirely, `additionalParams` merges into it.
   * @returns The callback's return value.
   */
  call(func: Function, options?: { params?: PlainObject; additionalParams?: PlainObject; }): any;
  destroy(): void;

  /** Reads the instance stored on an element under a namespace. */
  static getInstance(element: Element, namespace: string): Behavior | undefined;
  /**
   * Runs a behavior's one time `setup`, whose return value is shared across instances.
   * @returns Whatever setup returned, or `undefined` when it returned nothing.
   */
  static runSetup(
    setup?: (context: BehaviorSetupContext) => PlainObject | void,
    config?: { $elements?: Query; settings?: PlainObject; templates?: Record<string, string>; },
  ): PlainObject | undefined;
}
