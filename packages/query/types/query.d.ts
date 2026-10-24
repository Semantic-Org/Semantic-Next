type PlainObject<T = any> = Record<string, T>;

/**
 * Anything a Query collection can be built from.
 */
export type QuerySelector =
  | string
  | Node
  | NodeList
  | HTMLCollection
  | Element[]
  | Query
  | typeof globalThis;

/**
 * Verbosity of Query and Behavior logging, from quietest to loudest.
 */
export type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'debug';

/**
 * Options for initializing a Query instance.
 */
export interface QueryOptions {
  /**
   * The root to search within. Defaults to `document`.
   * A shadow root or document fragment is a valid root.
   */
  root?: Document | DocumentFragment | Element;
  /**
   * Whether to pierce through shadow DOM boundaries. Defaults to `false`.
   */
  pierceShadow?: boolean;
  /**
   * The collection `end()` returns to. Set automatically when a traversal chains.
   */
  prevObject?: Query | null;
}

/**
 * Options for event handling.
 */
export interface EventOptions {
  /**
   * If true, returns the event handler(s) instead of the Query instance.
   */
  returnHandler?: boolean;
  /**
   * An AbortController to manage event listener removal.
   */
  abortController?: AbortController;
  /**
   * Listen in capture phase (event fires top-down before bubbling).
   */
  capture?: boolean;
  /**
   * Mark listener as passive (will not call preventDefault).
   * Automatically set to `true` for `scroll` and `resize` events.
   */
  passive?: boolean;
  /**
   * Additional event listener options passed through to addEventListener.
   */
  eventSettings?: AddEventListenerOptions;
}

/**
 * Represents an event handler attached to an element.
 */
export interface EventHandler {
  /** The element the event listener is attached to. */
  el: Element | Document | typeof globalThis;
  /** The name of the event. */
  eventName: string;
  /** The namespaces of the event, if any. */
  namespaces: string[] | null;
  /** The event listener function. */
  eventListener: EventListener;
  /** The AbortController associated with the event listener. */
  abortController: AbortController;
  /** Indicates if the event listener is delegated. */
  delegated: boolean;
  /** The original handler function provided by the user. */
  handler: Function;
  /** A function to abort the event listener. */
  abort: (reason?: any) => void;
}

/**
 * Options for CSS style retrieval.
 */
export interface CSSOptions {
  /**
   * If true, retrieves computed styles instead of inline styles.
   */
  includeComputed?: boolean;
}

/**
 * Options for dimensional calculations (width/height).
 */
export interface DimensionOptions {
  /**
   * Include margin in the calculation. Defaults to false.
   */
  includeMargin?: boolean;
  /**
   * Include border in the calculation. Defaults to true.
   */
  includeBorder?: boolean;
  /**
   * Include padding in the calculation. Defaults to true.
   */
  includePadding?: boolean;
}

/**
 * Options for naturalWidth calculations.
 */
export interface NaturalWidthOptions {
  /**
   * Preserve the element's max-width constraint during calculation. Defaults to false.
   */
  preserveMaxWidth?: boolean;
  /**
   * Include margin in the calculation. Defaults to false.
   */
  includeMargin?: boolean;
  /**
   * Include padding in the calculation. Defaults to false.
   */
  includePadding?: boolean;
  /**
   * Include border in the calculation. Defaults to false.
   */
  includeBorder?: boolean;
}

/**
 * Options for naturalHeight calculations.
 */
export interface NaturalHeightOptions {
  /**
   * Preserve the element's max-height constraint during calculation. Defaults to false.
   */
  preserveMaxHeight?: boolean;
  /**
   * Include margin in the calculation. Defaults to false.
   */
  includeMargin?: boolean;
  /**
   * Include padding in the calculation. Defaults to false.
   */
  includePadding?: boolean;
  /**
   * Include border in the calculation. Defaults to false.
   */
  includeBorder?: boolean;
}

/**
 * Ways to narrow a collection: a CSS selector, a predicate run over the
 * elements, element(s) to keep, or another Query instance.
 */
export type QueryFilter =
  | string
  | Element
  | Element[]
  | Query
  | ((element: Element, index: number, elements: Element[]) => boolean);

/**
 * Options shared by intersection checks.
 */
export interface IntersectionOptions {
  /** Which sides must intersect ('all' or specific sides). Defaults to 'all'. */
  sides?: 'all' | 'top' | 'bottom' | 'left' | 'right' | Array<'top' | 'bottom' | 'left' | 'right'>;
  /** Minimum intersection ratio (0-1). Defaults to 0. */
  threshold?: number;
  /** Whether source must be fully contained in target. Defaults to false. */
  fully?: boolean;
  /** Whether all elements must intersect (true) or any element (false). Defaults to false. */
  all?: boolean;
}

/**
 * Intersection data returned when `returnDetails` is true.
 */
export interface IntersectionDetails {
  /** Whether the element intersects after threshold, sides, and containment checks. */
  intersects: boolean;
  /** Whether the top edge falls inside the target. */
  top: boolean;
  /** Whether the bottom edge falls inside the target. */
  bottom: boolean;
  /** Whether the left edge falls inside the target. */
  left: boolean;
  /** Whether the right edge falls inside the target. */
  right: boolean;
  /** Portion of the element covered by the intersection (0-1). */
  ratio: number;
  /** The intersection rectangle, relative to the target, or `null` when there is none. */
  rect: {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
  } | null;
  /** The element's own edges, relative to the target. */
  elementPosition: {
    top: number;
    left: number;
    bottom: number;
    right: number;
  };
}

/**
 * A minimal toolkit for querying and performing modifications
 * across DOM nodes based off a selector.
 * @see {@link https://next.semantic-ui.com/docs/api/query Query API Reference}
 * @see {@link https://next.semantic-ui.com/docs/guides/query Query Guide}
 */
export class Query {
  /**
   * A proxy object that provides access to the globalThis object.
   * This avoids storing a direct reference to globalThis, reducing memory footprint.
   */
  static globalThisProxy: typeof globalThis;
  /**
   * Map of registered behaviors, keyed by behavior name.
   */
  static behaviors: Map<string, any>;
  /**
   * Whether the framework is running a development build.
   */
  static isDevelopment: boolean;
  /**
   * Log level shared by every Query instance and behavior.
   * Defaults to `debug` in development and `silent` otherwise.
   */
  static logLevel: LogLevel;
  /**
   * Whether behavior methods are wrapped in performance marks and measures.
   */
  static logPerformance: boolean;
  /**
   * Handlers attached to an element, used by `off()` to remove every handler on it.
   * @internal
   */
  static eventRegistry: WeakMap<object, Set<EventHandler>>;
  /**
   * The element a handler is attached to, used by `off(handler)` to remove a single handler.
   * @internal
   */
  static handlerRegistry: WeakMap<EventHandler, Element | Document | typeof globalThis>;
  /**
   * Cached `naturalDisplay()` results, keyed by element.
   * @internal
   */
  static elementDisplayCache: WeakMap<Element, { rulesHash: number; displayValue: string; }>;
  /**
   * Events attached as passive listeners unless `passive: false` is passed.
   */
  static autoPassiveEvents: string[];
  /**
   * Tag name to natural display value, used by `naturalDisplay()` when no stylesheet rule matches.
   */
  static naturalDisplayMap: Readonly<Record<string, string>>;

  /**
   * Checks whether an element is the window, or the proxy standing in for it.
   * @param el - The element to test.
   */
  static isWindow(el: unknown): el is typeof globalThis;

  /**
   * Wraps a single element, skipping selector resolution.
   * @internal Fast path used by `each()` to build the `this` of a callback.
   * @param el - The element to wrap.
   * @param options - Options inherited from the collection being iterated.
   * @returns A single element Query instance.
   */
  static wrap(el: Element, options?: QueryOptions): Query;

  /** The original selector used to create the Query instance. */
  selector: QuerySelector;
  /** The number of elements in the Query instance. */
  length: number;
  /** Options for the Query instance (root, pierceShadow). */
  options: QueryOptions;
  /** Indicates if the environment is a browser client. */
  isBrowser?: boolean;
  /** Indicates if the Query instance represents the global object. */
  isGlobal?: boolean;
  /** The collection this one was chained from, returned by `end()`. */
  prevObject?: Query | null;

  /** Array-like access to elements. A collection of the global object holds `Query.globalThisProxy` here. */
  [index: number]: Element;

  /**
   * Creates a new Query instance.
   * @param selector - The selector used to query for elements. Can be a CSS selector string,
   *                   a single DOM element, a NodeList, an HTMLCollection, an array of elements,
   *                   an existing Query instance, or the window/globalThis object.
   * @param options - Optional settings for the Query instance.
   */
  constructor(selector?: QuerySelector, options?: QueryOptions);

  /**
   * Iterates the elements in the collection, enabling `for...of`, spread, and `Array.from`.
   */
  [Symbol.iterator](): Iterator<Element>;

  /**
   * Creates a new Query instance with the provided elements, preserving the original options.
   * @see https://next.semantic-ui.com/docs/api/query/internal#chain
   * @param elements - The elements for the new Query instance.
   * @returns A new Query instance.
   */
  chain(elements: NodeList | Element[] | Node | typeof globalThis | undefined): Query;

  /**
   * Queries for elements deeply, traversing shadow DOM boundaries.
   * @see https://next.semantic-ui.com/docs/api/query/internal#queryselectoralldeep
   * @param root - The root element to search within.
   * @param selector - The CSS selector or DOM Element to search for.
   * @param includeRoot - Whether to include the root element in the search. Defaults to `true`.
   * @returns An array of matching elements.
   */
  querySelectorAllDeep(
    root: Element | Document | DocumentFragment,
    selector: string | Element,
    includeRoot?: boolean,
  ): Element[];

  /**
   * Iterates over each element in the Query instance.
   * @see https://next.semantic-ui.com/docs/api/query/iterators#each
   * @param callback - The callback function to execute for each element.
   *  The callback receives the element and its index as arguments. `this` is bound to a new
   * `Query` instance containing only the current element.
   * @returns The Query instance for chaining.
   */
  each(callback: (this: Query, el: Element, index: number) => void): this;

  /**
   * Finds elements within the current set of elements.
   * @see https://next.semantic-ui.com/docs/api/query/dom-traversal#find
   * @param selector - The CSS selector to search for.
   * @returns A new Query instance containing the found elements.
   */
  find(selector: string): Query;

  /**
   * Gets the parent of each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/dom-traversal#parent
   * @param selector - Optional CSS selector to filter the parents.
   * @returns A new Query instance containing the parent elements.
   */
  parent(selector?: string): Query;

  /**
   * Gets the children of each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/dom-traversal#children
   * @param selector - Optional CSS selector to filter the children.
   * @returns A new Query instance containing the child elements.
   */
  children(selector?: string): Query;

  /**
   * Gets the siblings of each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/dom-traversal#siblings
   * @param selector - Optional CSS selector to filter the siblings.
   * @returns A new Query instance containing the sibling elements.
   */
  siblings(selector?: string): Query;

  /**
   * Returns the index of the first element in the current set,
   * relative to its siblings (optionally filtered by a selector).
   * @see https://next.semantic-ui.com/docs/api/query/collections#index
   * @param siblingFilter - Optional CSS selector, predicate, element(s) or Query to filter the siblings.
   * @returns The index of the element, or -1 if not found.
   */
  index(siblingFilter?: QueryFilter): number;

  /**
   * Find the index of the first element matching the filter within current Query set.
   * @see https://next.semantic-ui.com/docs/api/query/collections#index
   * @param filter - Optional CSS selector, predicate, element(s) or Query to identify element within selection.
   * @returns The index of the element, or -1 if not found.
   */
  indexOf(filter?: QueryFilter): number;

  /**
   * Filters the current set of elements based on a selector, predicate, element(s) or another Query instance.
   * @see https://next.semantic-ui.com/docs/api/query/iterators#filter
   * @param filter - A CSS selector, a predicate, element(s), or a Query instance. Without one the collection is returned unchanged.
   * @returns A new Query instance containing the filtered elements.
   */
  filter(filter?: QueryFilter): Query;

  /**
   * Checks if *all* elements in the current set match a selector.
   * @see https://next.semantic-ui.com/docs/api/query/logical-operators#is
   * @param selector - A CSS selector, an element, a Query instance, or 'window'/'globalThis'.
   * @returns `true` if all elements match, `false` otherwise.
   */
  is(selector: string | Element | Query | typeof globalThis): boolean;

  /**
   * Filters the current set of elements, excluding those that match the selector.
   * @see https://next.semantic-ui.com/docs/api/query/logical-operators#not
   * @param selector - A CSS selector, an element, a Query instance, or 'window'/'globalThis'.
   * @returns A new Query instance containing the filtered elements.
   */
  not(selector: string | Element | Query | typeof globalThis): Query;

  /**
   * Gets the closest ancestor of each element in the current set (including the element itself) that matches the selector.
   * @see https://next.semantic-ui.com/docs/api/query/dom-traversal#closest
   * @param selector - A CSS selector or a DOM element.
   * @param options - Options to control the search behavior.
   * @param options.returnAll - If true, returns all matching ancestors instead of just the closest one.
   * @returns A new Query instance containing the closest ancestor elements.
   */
  closest(selector: string | Element, options?: { returnAll?: boolean; }): Query;

  /**
   * Gets all ancestor elements that match the selector, traversing up the entire DOM tree.
   * @see https://next.semantic-ui.com/docs/api/query/dom-traversal#closestall
   * @param selector - A CSS selector or a DOM element.
   * @returns A new Query instance containing all matching ancestor elements.
   */
  closestAll(selector: string | Element): Query;

  /**
   * Gets the closest ancestor of the provided element (including the element itself) that matches the selector, traversing shadow DOM boundaries.
   * @see https://next.semantic-ui.com/docs/api/query/internal#closestdeep
   * @param element - The element to start searching from.
   * @param selector - A CSS selector or a DOM element.
   * @param options - Options to control the search behavior.
   * @param options.returnAll - If true, returns all matching ancestors instead of just the closest one.
   * @returns The closest ancestor element, all matching ancestors, or `undefined` if not found.
   */
  closestDeep(
    element: Element,
    selector: string | Element,
    options?: { returnAll?: boolean; },
  ): Element | Element[] | undefined;

  /**
   * Attaches a handler to be executed when the DOM is fully loaded.
   * @see https://next.semantic-ui.com/docs/api/query/events#ready
   * @param handler - The function to be executed.
   * @returns The Query instance for chaining.
   */
  ready(handler: (this: Document, event: Event) => void): this;

  /**
   * Gets the event alias for a given event name (e.g., 'ready' -> 'DOMContentLoaded').
   * @see https://next.semantic-ui.com/docs/api/query/events#on
   * @param eventName - The event name.
   * @returns The aliased event name.
   */
  getEventAlias(eventName: string): string;

  /**
   * Splits a space-separated string of event names into their name and namespaces,
   * applying event aliases. A bare namespace like `.foo` parses to a null event name.
   * @see https://next.semantic-ui.com/docs/api/query/events#on
   * @param eventNames - A space-separated string of event names.
   * @returns An array of parsed events.
   */
  getEventArray(eventNames: string): Array<{ eventName: string | null; namespaces: string[] | null; }>;

  /**
   * Attaches an event listener to each element in the current set, returning the created handler(s).
   * @see https://next.semantic-ui.com/docs/api/query/events#on
   * @param eventNames - A space-separated string of event names.
   * @param handler - The event handler function.
   * @param options - Event listener options with `returnHandler` set to true.
   * @returns The event handler, or an array of handlers when more than one was created.
   */
  on(
    eventNames: string,
    handler: EventListener,
    options: EventOptions & { returnHandler: true; },
  ): EventHandler | EventHandler[];
  /**
   * Attaches a delegated event listener to each element in the current set, returning the created handler(s).
   * @see https://next.semantic-ui.com/docs/api/query/events#on
   * @param eventNames - A space-separated string of event names.
   * @param targetSelector - A CSS selector for event delegation.
   * @param handler - The event handler function.
   * @param options - Event listener options with `returnHandler` set to true.
   * @returns The event handler, or an array of handlers when more than one was created.
   */
  on(
    eventNames: string,
    targetSelector: string,
    handler: EventListener,
    options: EventOptions & { returnHandler: true; },
  ): EventHandler | EventHandler[];
  /**
   * Attaches an event listener to each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/events#on
   * @param eventNames - A space-separated string of event names.
   * @param handler - The event handler function.
   * @param options - Optional event listener options or EventOptions.
   * @returns The Query instance for chaining.
   */
  on(eventNames: string, handler: EventListener, options?: EventOptions): this;
  /**
   * Attaches an event listener to each element in the current set, delegating to a specific target.
   * @param eventNames - A space-separated string of event names.
   * @param targetSelector - A CSS selector for event delegation.
   * @param handler - The event handler function.
   * @param options - Optional event listener options or EventOptions.
   * @returns The Query instance for chaining.
   */
  on(eventNames: string, targetSelector: string, handler: EventListener, options?: EventOptions): this;

  /**
   * Attaches a one-shot event listener to each element in the current set, returning the created handler(s).
   * @see https://next.semantic-ui.com/docs/api/query/events#one
   * @param eventNames - A space-separated string of event names.
   * @param handler - The event handler function.
   * @param options - Event listener options with `returnHandler` set to true.
   * @returns The event handler, or an array of handlers when more than one was created.
   */
  one(
    eventNames: string,
    handler: EventListener,
    options: EventOptions & { returnHandler: true; },
  ): EventHandler | EventHandler[];
  /**
   * Attaches a delegated one-shot event listener to each element in the current set, returning the created handler(s).
   * @see https://next.semantic-ui.com/docs/api/query/events#one
   * @param eventNames - A space-separated string of event names.
   * @param targetSelector - A CSS selector for event delegation.
   * @param handler - The event handler function.
   * @param options - Event listener options with `returnHandler` set to true.
   * @returns The event handler, or an array of handlers when more than one was created.
   */
  one(
    eventNames: string,
    targetSelector: string,
    handler: EventListener,
    options: EventOptions & { returnHandler: true; },
  ): EventHandler | EventHandler[];
  /**
   * Attaches an event listener that is executed at most once to each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/events#one
   * @param eventNames - A space-separated string of event names.
   * @param handler - The event handler function.
   * @param options - Optional event listener options or EventOptions.
   * @returns The Query instance for chaining.
   */
  one(eventNames: string, handler: EventListener, options?: EventOptions): this;
  /**
   * Attaches an event listener that is executed at most once to each element in the current set, delegating to a specific target.
   * @param eventNames - A space-separated string of event names.
   * @param targetSelector - A CSS selector for event delegation.
   * @param handler - The event handler function.
   * @param options - Optional event listener options or EventOptions.
   * @returns The Query instance for chaining.
   */
  one(eventNames: string, targetSelector: string, handler: EventListener, options?: EventOptions): this;

  /**
   * Returns a Promise that resolves when the next occurrence of the specified event fires on the first element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/events#onnext
   * @param eventNames - A space-separated string of event names.
   * @param options - Optional configuration including timeout.
   * @returns A Promise that resolves with the event object.
   */
  onNext(eventNames: string, options?: { timeout?: number; }): Promise<Event>;
  /**
   * Returns a Promise that resolves when the next occurrence of the specified event fires on a delegated target within the first element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/events#onnext
   * @param eventNames - A space-separated string of event names.
   * @param targetSelector - A CSS selector for event delegation.
   * @param options - Optional configuration including timeout.
   * @returns A Promise that resolves with the event object.
   */
  onNext(eventNames: string, targetSelector: string, options?: { timeout?: number; }): Promise<Event>;

  /**
   * Attaches a capture-phase event listener that fires top-down before bubbling,
   * returning the created handler(s).
   * @see https://next.semantic-ui.com/docs/api/query/events#intercept
   * @param eventNames - A space-separated string of event names.
   * @param handler - The event handler function.
   * @param options - Event listener options with `returnHandler` set to true.
   * @returns The event handler, or an array of handlers when more than one was created.
   */
  intercept(
    eventNames: string,
    handler: EventListener,
    options: EventOptions & { returnHandler: true; },
  ): EventHandler | EventHandler[];
  /**
   * Attaches a delegated capture-phase event listener, returning the created handler(s).
   * @see https://next.semantic-ui.com/docs/api/query/events#intercept
   * @param eventNames - A space-separated string of event names.
   * @param targetSelector - A CSS selector for event delegation.
   * @param handler - The event handler function.
   * @param options - Event listener options with `returnHandler` set to true.
   * @returns The event handler, or an array of handlers when more than one was created.
   */
  intercept(
    eventNames: string,
    targetSelector: string,
    handler: EventListener,
    options: EventOptions & { returnHandler: true; },
  ): EventHandler | EventHandler[];
  /**
   * Attaches a capture-phase event listener that fires top-down before bubbling.
   * Useful for intercepting events before children handle them.
   * @see https://next.semantic-ui.com/docs/api/query/events#intercept
   * @param eventNames - A space-separated string of event names.
   * @param handler - The event handler function.
   * @param options - Optional event listener options.
   * @returns The Query instance for chaining.
   */
  intercept(eventNames: string, handler: EventListener, options?: EventOptions): this;
  /**
   * Attaches a capture-phase event listener with delegation.
   * @param eventNames - A space-separated string of event names.
   * @param targetSelector - A CSS selector for event delegation.
   * @param handler - The event handler function.
   * @param options - Optional event listener options.
   * @returns The Query instance for chaining.
   */
  intercept(eventNames: string, targetSelector: string, handler: EventListener, options?: EventOptions): this;

  /**
   * Removes event listeners from each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/events#off
   * @param eventNames - A space-separated string of event names, or undefined to remove all events
   * @param handler - The specific handler to remove, or undefined to remove events by type.
   * @returns The Query instance for chaining.
   */
  off(eventNames?: string, handler?: EventListener | EventHandler): this;
  /**
   * Removes a specific event handler from each element in the current set, whatever event it was bound to.
   * @see https://next.semantic-ui.com/docs/api/query/events#off
   * @param handler - The handler function to remove.
   * @returns The Query instance for chaining.
   */
  off(handler: EventListener): this;

  /**
   * Triggers an event on each element in the current set. Native methods like
   * `focus` are called directly, anything else dispatches a CustomEvent.
   * @see https://next.semantic-ui.com/docs/api/query/events#trigger
   * @param eventName - The name of the event to trigger.
   * @param eventSettings - Optional CustomEvent settings (bubbles, cancelable, composed, detail).
   * @returns The Query instance for chaining.
   */
  trigger(eventName: string, eventSettings?: CustomEventInit): this;

  /**
   * Triggers a 'click' event on each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/events#trigger
   * @param eventSettings - Optional CustomEvent settings (bubbles, cancelable, composed, detail).
   * @returns The Query instance for chaining.
   */
  click(eventSettings?: CustomEventInit): this;

  /**
   * Dispatches a custom event on each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/events#dispatchEvent
   * @param eventName - The name of the custom event.
   * @param eventData - Optional data to be passed as `detail` in the event.
   * @param eventSettings - Optional settings for the custom event (bubbles, cancelable, composed).
   * @returns The Query instance for chaining.
   */
  dispatchEvent(eventName: string, eventData?: PlainObject, eventSettings?: CustomEventInit): this;

  /**
   * Removes each element in the current set from the DOM.
   * @see https://next.semantic-ui.com/docs/api/query/dom-manipulation#remove
   * @returns The Query instance for chaining.
   */
  remove(): this;

  /**
   * Adds one or more classes to each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/css#addClass
   * @param classNames - A space-separated string of class names.
   * @returns The Query instance for chaining.
   */
  addClass(classNames: string): this;

  /**
   * Checks if *any* element in the current set has the specified class.
   * @see https://next.semantic-ui.com/docs/api/query/css#hasClass
   * @param className - The class name to check.
   * @returns `true` if any element has the class, `false` otherwise.
   */
  hasClass(className: string): boolean;

  /**
   * Removes one or more classes from each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/css#removeClass
   * @param classNames - A space-separated string of class names.
   * @returns The Query instance for chaining.
   */
  removeClass(classNames: string): this;

  /**
   * Toggles one or more classes on each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/css#toggleClass
   * @param classNames - A space-separated string of class names.
   * @returns The Query instance for chaining.
   */
  toggleClass(classNames: string): this;

  /**
   * Sets the inner HTML of each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/content#html
   * @param newHTML - The new HTML content to set.
   * @returns The Query instance for chaining.
   */
  html(newHTML: string): this;
  /**
   * Gets the inner HTML of the elements in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/content#html
   * @returns The joined inner HTML of every element, or `undefined` for an empty selection.
   */
  html(): string | undefined;

  /**
   * Sets the outer HTML of each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/content#outerHTML
   * @param newHTML - The new outer HTML content to set.
   * @returns The Query instance for chaining.
   */
  outerHTML(newHTML: string): this;
  /**
   * Gets the outer HTML of the elements in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/content#outerHTML
   * @returns The joined outer HTML of every element, or `undefined` for an empty selection.
   */
  outerHTML(): string | undefined;

  /**
   * Sets the text content of each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/content#text
   * @param newText - The new text content to set.
   * @returns The Query instance for chaining.
   */
  text(newText: string): this;
  /**
   * Gets the text content of each element in the current set.  Includes text from descendants.
   * @see https://next.semantic-ui.com/docs/api/query/content#text
   * @returns The text of the *first* element, or an array of values when the set holds more than one element.
   */
  text(): string | string[] | undefined;

  /**
   * Recursively retrieves the text content of a node and its descendants, including slotted content.
   * @see https://next.semantic-ui.com/docs/api/query/internal#gettextcontentrecursive
   * @param nodes The list of nodes
   */
  getTextContentRecursive(nodes: NodeListOf<ChildNode> | ChildNode[]): string;

  /**
   * Gets the combined text content of *only* the immediate text node children of each element.
   * @see https://next.semantic-ui.com/docs/api/query/content#textNode
   * @returns The combined text content.
   */
  textNode(): string;

  /**
   * Maps over the elements in the current set, similar to `Array.prototype.map`.
   * @see https://next.semantic-ui.com/docs/api/query/iterators#map
   * @param callback - The mapping function.
   * @returns An array containing the results of the mapping function.
   */
  map<U>(callback: (element: Element, index: number, elements: Element[]) => U, thisArg?: any): U[];

  /**
   * Sets the value of each element in the current set (for form elements).
   * @see https://next.semantic-ui.com/docs/api/query/content#value
   * @param newValue - The new value to set.
   * @returns The Query instance for chaining.
   */
  value(newValue: string): this;
  /**
   * Gets the value of each element in the current set (for form elements).
   * @see https://next.semantic-ui.com/docs/api/query/content#value
   * @returns The value of the *first* element, or an array of values when the set holds more than one element.
   */
  value(): string | string[] | undefined;
  /**
   * Sets the value of each element in the current set (for form elements).  Alias for `value()`.
   * @see https://next.semantic-ui.com/docs/api/query/content#value
   * @param newValue - The new value to set.
   * @returns The Query instance for chaining.
   */
  val(newValue: string): this;
  /**
   * Gets the value of each element in the current set (for form elements).  Alias for `value()`.
   * @see https://next.semantic-ui.com/docs/api/query/content#value
   * @returns The value of the *first* element, or an array of values when the set holds more than one element.
   */
  val(): string | string[] | undefined;

  /**
   * Sets focus on the first element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/events#focus
   * @returns The Query instance for chaining.
   */
  focus(): this;

  /**
   * Removes focus from the first element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/events#blur
   * @returns The Query instance for chaining.
   */
  blur(): this;

  /**
   * Sets multiple CSS properties for each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/css#css
   * @param property - An object of property-value pairs.
   * @returns The Query instance for chaining.
   */
  css(property: PlainObject<string>): this;
  /**
   * Sets a CSS property for each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/css#css
   * @param property - The CSS property name.
   * @param value - The value to set for the property.
   * @returns The Query instance for chaining.
   */
  css(property: string, value: string): this;
  /**
   * Gets a CSS property for each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/css#css
   * @param property - The CSS property name.
   * @param value - Pass `null` to read rather than write.
   * @param options - Optional settings for getting styles.
   * @returns The value of the property for the *first* element, or an array of values when the set holds more than one element.
   */
  css(property: string, value?: null, options?: CSSOptions): string | string[] | undefined;

  /**
   * Gets the computed style of the *first* element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/css#computedStyle
   * @param property - The CSS property name.
   * @returns The computed style value, or an array of values.
   */
  computedStyle(property: string): string | string[] | undefined;

  /**
   * Sets a CSS custom property (variable) on each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/css#cssVar
   * @param variable - The name of the CSS variable (without the `--` prefix).
   * @param value - The value to set.
   * @returns The Query instance for chaining.
   */
  cssVar(variable: string, value: string): this;
  /**
   * Gets a CSS custom property (variable) for each element in the current set, including computed values.
   * @see https://next.semantic-ui.com/docs/api/query/css#cssVar
   * @param variable - The name of the CSS variable (without the `--` prefix).
   * @returns The value of the variable for the *first* element, or an array of values when the set holds more than one element.
   */
  cssVar(variable: string, value?: null): string | string[] | undefined;

  /**
   * Sets multiple attributes for each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/attributes#attr
   * @param attribute An object containing attribute/value pairs.
   * @returns The Query instance for chaining.
   */
  attr(attribute: PlainObject<string>): this;
  /**
   * Sets an attribute on each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/attributes#attr
   * @param attribute - The attribute name.
   * @param value - The value to set for the attribute.
   * @returns The Query instance for chaining.
   */
  attr(attribute: string, value: string): this;
  /**
   * Gets an attribute from each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/attributes#attr
   * @param attribute - The attribute name.
   * @returns The value of the attribute for the *first* element, or an array of values when the set holds more than one element.
   */
  attr(attribute: string): string | string[] | undefined;

  /**
   * Removes an attribute from each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/attributes#removeAttr
   * @param attributeName - The name of the attribute to remove.
   * @returns The Query instance for chaining.
   */
  removeAttr(attributeName: string): this;

  /**
   * Adds one or more attributes with empty string values to each element.
   * Useful for boolean attributes like disabled, readonly, required, etc.
   * @see https://next.semantic-ui.com/docs/api/query/attributes#addAttr
   * @param attributes - A single attribute name or array of attribute names to add.
   * @returns The Query instance for chaining.
   */
  addAttr(attributes: string | string[]): this;

  /**
   * Returns the first element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/dom-access#el
   * @returns The first element, or `undefined` if the set is empty.
   */
  el(): Element | undefined;

  /**
   * Gets the element at the specified index.
   * @see https://next.semantic-ui.com/docs/api/query/dom-access#get
   * @param index - The index of the element to retrieve.
   * @returns The element at the specified index, or `undefined` when the index is out of range.
   */
  get(index: number): Element | undefined;
  /**
   * Gets every element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/dom-access#get
   * @returns An array of all elements.
   */
  get(): Element[];

  /**
   * Gets a new Query instance containing the element at the specified index.
   * @see https://next.semantic-ui.com/docs/api/query/collections#eq
   * @param index - The index of the element.
   * @returns A new Query instance containing the element at the specified index.
   */
  eq(index: number): Query;

  /**
   * Gets a new Query instance containing the first element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/collections#first
   * @returns A new Query instance containing the first element.
   */
  first(): Query;

  /**
   * Gets a new Query instance containing the last element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/collections#last
   * @returns A new Query instance containing the last element.
   */
  last(): Query;

  /**
   * Sets a property on each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/dom-access#prop
   * @param name - The name of the property.
   * @param value - The value to set.
   * @returns The Query instance for chaining.
   */
  prop(name: string, value: any): this;
  /**
   * Get a property of the first element in the set.
   * @see https://next.semantic-ui.com/docs/api/query/dom-access#prop
   * @param name Name of the property to get.
   * @returns The property of the *first* element, or an array of values when the set holds more than one element.
   */
  prop(name: string): any;

  /**
   * Gets a new Query instance containing the next sibling of each element that matches selector, or the *first* matching sibling.
   * @see https://next.semantic-ui.com/docs/api/query/dom-traversal#next
   * @param selector - Optional CSS selector to filter the next siblings.
   * @returns A new Query instance containing the next sibling elements.
   */
  next(selector?: string): Query;

  /**
   *  Gets a new Query instance containing the previous sibling of each element that matches selector, or the *first* matching sibling.
   * @see https://next.semantic-ui.com/docs/api/query/dom-traversal#prev
   * @param selector - Optional CSS selector to filter the previous siblings.
   * @returns A new Query instance containing the previous sibling elements.
   */
  prev(selector?: string): Query;

  /**
   * Sets the height of each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#height
   * @param value - The height to set, in pixels or as a CSS length.
   * @returns The Query instance for chaining.
   */
  height(value: number | string): this;
  /**
   * Gets the height of the elements in the current set with optional dimension calculations.
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#height
   * @param options - Options to control which parts of the box model to include.
   * @returns The height of the *first* element, or an array of heights when the set holds more than one element.
   */
  height(options?: DimensionOptions): number | number[] | undefined;

  /**
   * Sets the width of each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#width
   * @param value - The width to set, in pixels or as a CSS length.
   * @returns The Query instance for chaining.
   */
  width(value: number | string): this;
  /**
   * Gets the width of the elements in the current set with optional dimension calculations.
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#width
   * @param options - Options to control which parts of the box model to include.
   * @returns The width of the *first* element, or an array of widths when the set holds more than one element.
   */
  width(options?: DimensionOptions): number | number[] | undefined;

  /**
   * Sets the scrollHeight of each element in the current set.  Uses `document.documentElement` if applied to `window`.
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#scrollHeight
   * @param value - The scrollHeight in pixels.
   * @returns The Query instance for chaining.
   */
  scrollHeight(value: number): this;
  /**
   * Gets the scrollHeight of each element in the current set.  Uses `document.documentElement` if applied to `window`.
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#scrollHeight
   * @returns The scrollHeight of the *first* element, or an array of values when the set holds more than one element.
   */
  scrollHeight(): number | number[] | undefined;

  /**
   * Sets the scrollWidth of each element in the current set. Uses `document.documentElement` if applied to `window`.
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#scrollWidth
   * @param value - The scrollWidth in pixels.
   * @returns The Query instance for chaining.
   */
  scrollWidth(value: number): this;
  /**
   * Gets the scrollWidth of each element in the current set. Uses `document.documentElement` if applied to `window`.
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#scrollWidth
   * @returns The scrollWidth of the *first* element, or an array of values when the set holds more than one element.
   */
  scrollWidth(): number | number[] | undefined;

  /**
   * Sets the scrollLeft position of each element in the current set. Uses `document.documentElement` if applied to `window`.
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#scrollLeft
   * @param value - The scrollLeft value in pixels.
   * @returns The Query instance for chaining.
   */
  scrollLeft(value: number): this;
  /**
   * Gets the scrollLeft position of each element in the current set. Uses `document.documentElement` if applied to `window`.
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#scrollLeft
   * @returns The scrollLeft of the *first* element, or an array of values when the set holds more than one element.
   */
  scrollLeft(): number | number[] | undefined;

  /**
   * Sets the scrollTop position of each element in the current set. Uses `document.documentElement` if applied to `window`.
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#scrollTop
   * @param value - The scrollTop value in pixels.
   * @returns The Query instance for chaining.
   */
  scrollTop(value: number): this;
  /**
   * Gets the scrollTop position of each element in the current set. Uses `document.documentElement` if applied to `window`.
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#scrollTop
   * @returns The scrollTop of the *first* element, or an array of values when the set holds more than one element.
   */
  scrollTop(): number | number[] | undefined;

  /**
   * Creates a deep clone of each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/dom-manipulation#clone
   * @returns A new Query instance containing the cloned elements.
   */
  clone(): Query;

  /**
   * Reverses the order of the elements in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/dom-manipulation#reverse
   * @returns A new Query instance containing the reversed elements.
   */
  reverse(): Query;

  /**
   * Returns a shallow copy of a portion of the elements into a new Query object.
   * @see https://next.semantic-ui.com/docs/api/query/dom-manipulation#slice
   * @param start - The beginning index of the specified portion of the collection.
   * @param end - The end index of the specified portion of the collection (exclusive).
   * @returns A new Query instance containing the sliced elements.
   */
  slice(start?: number, end?: number): Query;

  /**
   * Creates a new Query collection combining the current elements with elements from the provided selector.
   * @see https://next.semantic-ui.com/docs/api/query/collections#add
   * @param selector - The selector, elements, or Query instance to add to the current collection.
   * @returns A new Query instance containing the combined elements with duplicates removed.
   */
  add(selector: string | Element | Element[] | NodeList | HTMLCollection | Query): Query;

  /**
   * Inserts content at a specified position relative to a target element.
   * @see https://next.semantic-ui.com/docs/api/query/internal#insertcontent
   * @param target - The target element.
   * @param content - The content to insert.
   * @param position - The position relative to the target element ('beforebegin', 'afterbegin', 'beforeend', 'afterend').
   * @returns A new Query instance of the inserted elements, or `undefined` when the content was a string.
   */
  insertContent(
    target: Element,
    content: string | Node | NodeList | HTMLCollection | Query,
    position: InsertPosition,
  ): Query | undefined;

  /**
   * Prepends content to each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/dom-manipulation#prepend
   * @param content - The content to prepend.
   * @returns The Query instance for chaining.
   */
  prepend(...content: Array<string | Node | NodeList | HTMLCollection | Query>): this;

  /**
   * Appends content to each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/dom-manipulation#append
   * @param content - The content to append.
   * @returns The Query instance for chaining.
   */
  append(...content: Array<string | Node | NodeList | HTMLCollection | Query>): this;

  /**
   * Inserts each element in the current set before the specified target(s).
   * @see https://next.semantic-ui.com/docs/api/query/dom-manipulation#insertBefore
   * @param selector - The target element(s) or selector.
   * @returns The Query instance for chaining.
   */
  insertBefore(selector: string | Node | NodeList | HTMLCollection | Query): this;

  /**
   * Inserts each element in the current set after the specified target(s).
   * @see https://next.semantic-ui.com/docs/api/query/dom-manipulation#insertAfter
   * @param selector - The target element(s) or selector.
   * @returns The Query instance for chaining.
   */
  insertAfter(selector: string | Node | NodeList | HTMLCollection | Query): this;

  /**
   * Appends each element in the current set as the last child of the specified target(s).
   * @see https://next.semantic-ui.com/docs/api/query/dom-manipulation#appendTo
   * @param selector - The target element(s) or selector.
   * @returns The Query instance for chaining.
   */
  appendTo(selector: string | Node | NodeList | HTMLCollection | Query): this;

  /**
   * Prepends each element in the current set as the first child of the specified target(s).
   * @see https://next.semantic-ui.com/docs/api/query/dom-manipulation#prependTo
   * @param selector - The target element(s) or selector.
   * @returns The Query instance for chaining.
   */
  prependTo(selector: string | Node | NodeList | HTMLCollection | Query): this;

  /**
   * Inserts content before each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/dom-manipulation#before
   * @param content - The content to insert before each element.
   * @returns The Query instance for chaining.
   */
  before(...content: Array<string | Node | NodeList | HTMLCollection | Query>): this;

  /**
   * Inserts content after each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/dom-manipulation#after
   * @param content - The content to insert after each element.
   * @returns The Query instance for chaining.
   */
  after(...content: Array<string | Node | NodeList | HTMLCollection | Query>): this;

  /**
   * Removes each element in the current set from the DOM, but keeps event handlers.
   * @see https://next.semantic-ui.com/docs/api/query/dom-manipulation#detach
   * @returns The Query instance for chaining.
   */
  detach(): this;

  /**
   * Gets the natural width (width without applied styles) of the *first* element in the set,
   * with optional box model adjustments (includeMargin, includePadding, includeBorder)
   * and max-width preservation (preserveMaxWidth).
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#naturalWidth
   * @param options - Options to control max-width preservation and box model inclusions.
   * @returns The natural width of the *first* element, or an array of widths when the set holds more than one element.
   */
  naturalWidth(options?: NaturalWidthOptions): number | number[] | undefined;

  /**
   * Gets the natural height (height without applied styles) of the *first* element in the current set,
   * with optional box model adjustments (includeMargin, includePadding, includeBorder)
   * and max-height preservation (preserveMaxHeight).
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#naturalHeight
   * @param options - Options to control max-height preservation and box model inclusions.
   * @returns The natural height of the *first* element, or an array of heights when the set holds more than one element.
   */
  naturalHeight(options?: NaturalHeightOptions): number | number[] | undefined;

  /**
   * Gets the natural display value (the display value that would be used if display: none was not applied) for elements in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#naturalDisplay
   * @param options - Configuration options for natural display calculation.
   * @param options.calculate - Whether to analyze stylesheets for accurate calculation. When false, uses tag-based lookup only. Defaults to true.
   * @returns For single element: the natural display value. For multiple elements: array of natural display values. Returns undefined for empty selection.
   */
  naturalDisplay(options?: { calculate?: boolean; }): string | string[] | undefined;

  /**
   * Gets the clipping parent (overflow container) of each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#clippingparent
   * @param options.pierceShadow - Whether to cross shadow DOM boundaries while walking up. Defaults to false.
   * @returns A new Query instance containing the clipping parent elements.
   */
  clippingParent(options?: { pierceShadow?: boolean; }): Query;

  /**
   * Gets the simple containing parent (offsetParent) of each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/visibility#offsetparent
   * @returns A new Query instance containing the offset parent elements.
   */
  offsetParent(): Query;

  /**
   * Gets the positioning parent (positioning context) of each element in the current set, accurately calculating
   * it by considering transform, filter, and other modern CSS properties that create new positioning contexts.
   * @see https://next.semantic-ui.com/docs/api/query/visibility#positioningparent
   * @param options.calculate - Whether to calculate positioning parent taking modern CSS properties into account. Defaults to true.
   * @param options.pierceShadow - Whether to cross shadow DOM boundaries while walking up. Defaults to false.
   * @returns A new Query instance containing the positioning parent elements.
   */
  positioningParent(options?: { calculate?: boolean; pierceShadow?: boolean; }): Query;

  /**
   * Gets the scroll parent (nearest scrollable container) of each element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/visibility#scrollparent
   * @param options.all - Whether to return all scroll parents in the hierarchy. When false, returns only the nearest scroll parent. Defaults to false.
   * @param options.pierceShadow - Whether to cross shadow DOM boundaries while walking up. Defaults to false.
   * @returns A new Query instance containing the scroll parent element(s).
   */
  scrollParent(options?: { all?: boolean; pierceShadow?: boolean; }): Query;

  /**
   * Gets the number of elements in the current set.  Alias for `length`.
   * @see https://next.semantic-ui.com/docs/api/query/collections#count
   * @returns The number of elements.
   */
  count(): number;

  /**
   * Checks if the current set contains any elements.
   * @see https://next.semantic-ui.com/docs/api/query/logical-operators#exists
   * @returns `true` if the set contains elements, `false` otherwise.
   */
  exists(): boolean;

  /**
   * Checks if ALL elements in the current set are visible (have layout dimensions).
   * @see https://next.semantic-ui.com/docs/api/query/logical-operators#isvisible
   * @param options - Configuration options for visibility checking.
   * @param options.includeOpacity - Whether to also check that opacity > 0. Defaults to false.
   * @param options.includeVisibility - Whether to check for visibility: hidden and content-visibility: hidden. Defaults to true.
   * @returns `boolean` - true if ALL elements are visible, false if ANY element is not visible, `undefined` for empty selection.
   */
  isVisible(options?: { includeOpacity?: boolean; includeVisibility?: boolean; }): boolean | undefined;

  /**
   * Adds properties to element on DOMContentLoaded
   * @see https://next.semantic-ui.com/docs/api/query/components#initialize
   * @param settings The properties to add.
   * @returns The Query instance for chaining.
   */
  initialize(settings: PlainObject): this;

  /**
   * Adds multiple properties to each element in selection.
   * @see https://next.semantic-ui.com/docs/api/query/components#settings
   * @param settings The properties to add.
   * @returns The Query instance for chaining.
   */
  settings(settings: PlainObject): this;

  /**
   * Add a single property to all elements in selection.
   * @see https://next.semantic-ui.com/docs/api/query/components#setting
   * @param setting The setting to add.
   * @param value The value of the setting.
   * @returns The Query instance for chaining.
   */
  setting(setting: string, value: any): this;
  /**
   * Reads a single property from all elements in selection.
   * @see https://next.semantic-ui.com/docs/api/query/components#setting
   * @param setting The setting to read.
   * @returns The setting of the *first* element, or an array of values when the set holds more than one element.
   */
  setting(setting: string): any;

  /**
   * Gets the associated component (if any) of the *first* element in the current set.
   * This is specific to Semantic UI components.
   * @see https://next.semantic-ui.com/docs/api/query/components#getComponent
   * @returns The component instance, or `undefined` if not found.
   */
  component(): any;

  /**
   * Gets or sets data attributes on elements in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/attributes#data
   * @param key - The data attribute key.
   * @param value - The value to set.
   * @returns If setting, the Query instance for chaining. If getting, the value(s).
   */
  data(key: string, value: string): this;
  /**
   * Gets a data attribute from elements in the current set.
   * @param key - The data attribute key to retrieve.
   * @returns The value from the first element, or an array of values from all elements.
   */
  data(key: string): string | string[] | undefined;
  /**
   * Gets all data attributes from elements in the current set.
   * @returns An object of data attributes from the first element, or an array of objects from all elements.
   */
  data(): PlainObject<string> | PlainObject<string>[] | undefined;

  /**
   * Removes data attributes from elements in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/attributes#removedata
   * @param keys - A space-separated string or array of data attribute keys to remove.
   * @returns The Query instance for chaining.
   */
  removeData(keys: string | string[]): this;

  /**
   * Gets the data context (if any) associated with the *first* element in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/components#datacontext
   * @returns The data context, or undefined.
   */
  dataContext(): any;

  /**
   * Gets the inner width (content + padding) of the elements in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#innerWidth
   * @returns The inner width of the *first* element, or an array of widths when the set holds more than one element.
   */
  innerWidth(): number | number[] | undefined;

  /**
   * Gets the inner height (content + padding) of the elements in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#innerHeight
   * @returns The inner height of the *first* element, or an array of heights when the set holds more than one element.
   */
  innerHeight(): number | number[] | undefined;

  /**
   * Gets the outer width (content + padding + border, optionally + margin) of the elements in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#outerWidth
   * @param options.includeMargin - Whether to include margin in the calculation. Defaults to false.
   * @returns The outer width of the *first* element, or an array of widths when the set holds more than one element.
   */
  outerWidth(options?: { includeMargin?: boolean; }): number | number[] | undefined;

  /**
   * Gets the outer height (content + padding + border, optionally + margin) of the elements in the current set.
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#outerHeight
   * @param options.includeMargin - Whether to include margin in the calculation. Defaults to false.
   * @returns The outer height of the *first* element, or an array of heights when the set holds more than one element.
   */
  outerHeight(options?: { includeMargin?: boolean; }): number | number[] | undefined;

  /**
   * Gets or sets the position of elements. A numeric `top` or `left` makes it a setter.
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#position
   */
  // Setter overloads, one for each coordinate that can drive the move
  position(options: {
    top: number;
    left?: number;
    relativeTo?: string | Element | Query;
    type?: 'global' | 'local' | 'relative';
    precision?: 'pixel' | 'subpixel';
  }): this;
  position(options: {
    left: number;
    top?: number;
    relativeTo?: string | Element | Query;
    type?: 'global' | 'local' | 'relative';
    precision?: 'pixel' | 'subpixel';
  }): this;
  // Getter with all coordinates
  position(options?: {
    relativeTo?: string | Element | Query;
    precision?: 'pixel' | 'subpixel';
    type?: never;
  }):
    | {
      global: { top: number; left: number; };
      local: { top: number; left: number; };
      relative?: { top: number; left: number; };
    }
    | Array<{
      global: { top: number; left: number; };
      local: { top: number; left: number; };
      relative?: { top: number; left: number; };
    }>
    | undefined;
  // Getter with specific type
  position(options: {
    type: 'global' | 'local';
    precision?: 'pixel' | 'subpixel';
  }): { top: number; left: number; } | Array<{ top: number; left: number; }> | undefined;
  // Getter with relative type
  position(options: {
    type: 'relative';
    relativeTo: string | Element | Query;
    precision?: 'pixel' | 'subpixel';
  }): { top: number; left: number; } | Array<{ top: number; left: number; }> | undefined;

  /**
   * Gets the position relative to the document (viewport position + scroll offset).
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#pageposition
   * @param options - Configuration options.
   * @param options.precision - Whether to round to pixel values. Defaults to 'pixel'.
   * @returns Position object with top and left, array for multiple elements, or undefined for empty selection.
   */
  pagePosition(options?: { precision?: 'pixel' | 'subpixel'; }):
    | { top: number; left: number; }
    | Array<{ top: number; left: number; }>
    | undefined;

  /**
   * Gets comprehensive dimension information for elements.
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#dimensions
   * @returns Dimension object for single element, array for multiple, or undefined for empty selection.
   */
  dimensions():
    | {
      top: number;
      left: number;
      right: number;
      bottom: number;
      pageTop: number;
      pageLeft: number;
      width: number;
      innerWidth: number;
      outerWidth: number;
      marginWidth: number;
      height: number;
      innerHeight: number;
      outerHeight: number;
      marginHeight: number;
      scrollTop: number;
      scrollLeft: number;
      scrollHeight: number;
      scrollWidth: number;
      box: {
        padding: { top: number; right: number; bottom: number; left: number; };
        border: { top: number; right: number; bottom: number; left: number; };
        margin: { top: number; right: number; bottom: number; left: number; };
      };
      bounds: DOMRect;
    }
    | Array<{
      top: number;
      left: number;
      right: number;
      bottom: number;
      pageTop: number;
      pageLeft: number;
      width: number;
      innerWidth: number;
      outerWidth: number;
      marginWidth: number;
      height: number;
      innerHeight: number;
      outerHeight: number;
      marginHeight: number;
      scrollTop: number;
      scrollLeft: number;
      scrollHeight: number;
      scrollWidth: number;
      box: {
        padding: { top: number; right: number; bottom: number; left: number; };
        border: { top: number; right: number; bottom: number; left: number; };
        margin: { top: number; right: number; bottom: number; left: number; };
      };
      bounds: DOMRect;
    }>
    | undefined;

  /**
   * Checks if elements in the collection intersect with a target element or elements.
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#intersects
   * @param target - The target element(s) to check intersection with. Can be a selector string, DOM element, or Query object.
   * @param options - Configuration options for intersection detection.
   * @returns Boolean indicating intersection, or detailed intersection data if returnDetails is true.
   */
  intersects(
    target: string | Element | Query,
    options?: IntersectionOptions & {
      /** Whether to return detailed intersection data. Defaults to false. */
      returnDetails?: false;
    },
  ): boolean;

  /**
   * Checks if elements in the collection intersect with a target element or elements, returning detailed information.
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#intersects
   * @param target - The target element(s) to check intersection with.
   * @param options - Configuration options with returnDetails set to true.
   * @returns Detailed intersection data for a single element, an array for multiple elements,
   * or `null` when the selection or target is empty.
   */
  intersects(
    target: string | Element | Query,
    options: IntersectionOptions & {
      /** Must be true to get detailed intersection data. */
      returnDetails: true;
    },
  ): IntersectionDetails | IntersectionDetails[] | null;

  /**
   * Checks if elements in the selection are within the viewport.
   * @see https://next.semantic-ui.com/docs/api/query/visibility#isinview
   * @param options - Configuration options.
   * @param options.viewport - The viewport element to check against. Defaults to clipping parent if not specified.
   * @returns `true` when the elements are in view, `false` otherwise.
   */
  isInView(
    options?: IntersectionOptions & {
      viewport?: string | Element | Query;
      /** Whether to return detailed intersection data. Defaults to false. */
      returnDetails?: false;
    },
  ): boolean;
  /**
   * Checks how elements in the selection overlap the viewport, returning detailed information.
   * @see https://next.semantic-ui.com/docs/api/query/visibility#isinview
   * @param options - Configuration options with returnDetails set to true.
   * @param options.viewport - The viewport element to check against. Defaults to clipping parent if not specified.
   * @returns Detailed intersection data for a single element, an array for multiple elements,
   * or `null` when the selection is empty.
   */
  isInView(
    options: IntersectionOptions & {
      viewport?: string | Element | Query;
      /** Must be true to get detailed intersection data. */
      returnDetails: true;
    },
  ): IntersectionDetails | IntersectionDetails[] | null;

  /**
   * Shows hidden elements by setting their display to the natural display value.
   * @see https://next.semantic-ui.com/docs/api/query/visibility#show
   * @param options - Configuration options for showing elements.
   * @param options.calculate - Whether to analyze stylesheets for accurate display calculation. When false, uses tag-based lookup only. Defaults to true.
   * @returns The Query instance for chaining.
   */
  show(options?: { calculate?: boolean; }): this;

  /**
   * Hides elements by setting their display to 'none'.
   * @see https://next.semantic-ui.com/docs/api/query/visibility#hide
   * @returns The Query instance for chaining.
   */
  hide(): this;

  /**
   * Toggles the visibility of elements by checking their current display state and either showing or hiding them.
   * @see https://next.semantic-ui.com/docs/api/query/visibility#toggle
   * @param options - Configuration options for toggling elements.
   * @param options.calculate - Whether to analyze stylesheets for accurate display calculation when showing elements. When false, uses tag-based lookup only. Defaults to true.
   * @returns The Query instance for chaining.
   */
  toggle(options?: { calculate?: boolean; }): this;

  /**
   * Checks if any element in the current set contains the specified target.
   * @see https://next.semantic-ui.com/docs/api/query/logical-operators#contains
   * @param selector - A CSS selector string to search for within the elements.
   * @returns `true` if any element contains an element matching the selector, `false` otherwise.
   */
  contains(selector: string): boolean;
  /**
   * Checks if any element in the current set contains the specified element.
   * @see https://next.semantic-ui.com/docs/api/query/logical-operators#contains
   * @param element - A DOM element to check for containment.
   * @returns `true` if any element contains the specified element, `false` otherwise.
   */
  contains(element: Element): boolean;
  /**
   * Checks if any element in the current set contains any element from the Query instance.
   * @see https://next.semantic-ui.com/docs/api/query/logical-operators#contains
   * @param query - A Query instance containing elements to check for containment.
   * @returns `true` if any element contains any element from the Query instance, `false` otherwise.
   */
  contains(query: Query): boolean;

  /**
   * Returns the bounding client rect(s) of the element(s).
   * @see https://next.semantic-ui.com/docs/api/query/dimensions#bounds
   * @returns A DOMRect for a single element, an array of DOMRects for multiple elements, or `undefined` for an empty selection.
   */
  bounds(): DOMRect | DOMRect[] | undefined;

  /**
   * Restores the previous Query set before the last traversal operation.
   * @see https://next.semantic-ui.com/docs/api/query/dom-traversal#end
   * @returns The previous Query instance, or this if no previous set exists.
   */
  end(): Query;

  /**
   * Triggers a submit event on form elements.
   * @see https://next.semantic-ui.com/docs/api/query/events#submit
   * @param eventSettings - Optional CustomEvent settings used when the element has no `requestSubmit`.
   * @returns The Query instance for chaining.
   */
  submit(eventSettings?: CustomEventInit): this;

  /**
   * Gets elements assigned to a named slot in a shadow DOM component.
   * @see https://next.semantic-ui.com/docs/api/query/content#getslot
   * @param name - The slot name. If omitted, gets the default slot.
   * @returns The combined HTML content of the elements assigned to the slot.
   */
  getSlot(name?: string): string;

  /**
   * Sets content into a named slot.
   * @see https://next.semantic-ui.com/docs/api/query/content#setslot
   * @param nameOrHTML - Slot name (when newHTML provided) or HTML string (for default slot).
   * @param newHTML - HTML content to set into the named slot.
   * @returns The Query instance for chaining.
   */
  setSlot(nameOrHTML: string, newHTML?: string): this;

  /**
   * Checks if a container element contains a target element, piercing shadow DOM boundaries.
   * @see https://next.semantic-ui.com/docs/api/query/dom-traversal#contains
   * @param container - The potential container element.
   * @param target - The element to check for containment.
   * @returns `true` if container contains target (crossing shadow boundaries), `false` otherwise.
   */
  containsDeep(container: Element, target: Element): boolean;
}
