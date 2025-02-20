type PlainObject<T = any> = Record<string, T>;

/**
 * Options for initializing a Query instance.
 */
export interface QueryOptions {
  /**
   * The root element to search within. Defaults to `document`.
   */
  root?: Document | Element;
  /**
   * Whether to pierce through shadow DOM boundaries. Defaults to `false`.
   */
  pierceShadow?: boolean;
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
   * Event listener options (e.g., `capture`, `passive`).
   */
  eventSettings?: AddEventListenerOptions;
}

/**
 * Represents an event handler attached to an element.
 */
export interface EventHandler {
  /** The element the event listener is attached to. */
  el: HTMLElement | typeof globalThis;
  /** The name of the event. */
  eventName: string;
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
 * A minimal toolkit for querying and performing modifications
 * across DOM nodes based off a selector.
 */
export class Query {
  /**
   * A proxy object that provides access to the globalThis object.
   * This avoids storing a direct reference to globalThis, reducing memory footprint.
   */
  static globalThisProxy: object;
  /**
   * An array of event handlers for teardown purposes.
   */
  static eventHandlers: EventHandler[];

  /** The original selector used to create the Query instance. */
  selector: string | Node | NodeList | HTMLCollection | Element[] | typeof Query.globalThisProxy;
  /** The number of elements in the Query instance. */
  length: number;
  /** Options for the Query instance (root, pierceShadow). */
  options: QueryOptions;
  /** Indicates if the environment is a browser client. */
  isBrowser?: boolean;
  /** Indicates if the Query instance represents the global object. */
  isGlobal?: boolean;

  /** Array-like access to elements. */
  [index: number]: Element | typeof Query.globalThisProxy;

  /**
   * Creates a new Query instance.
   * @param selector - The selector used to query for elements. Can be a CSS selector string,
   *                   a single DOM element, a NodeList, an HTMLCollection, an array of elements,
   *                   or the window/globalThis object.
   * @param options - Optional settings for the Query instance.
   */
  constructor(selector?: string | Node | NodeList | HTMLCollection | Element[] | typeof globalThis, options?: QueryOptions);

  /**
   * Creates a new Query instance with the provided elements, preserving the original options.
   * @param elements - The elements for the new Query instance.
   * @returns A new Query instance.
   */
  chain(elements: NodeList | Element[] | Node | typeof globalThis | undefined): Query;

  /**
   * Queries for elements deeply, traversing shadow DOM boundaries.
   * @param root - The root element to search within.
   * @param selector - The CSS selector or DOM Element to search for.
   * @param includeRoot - Whether to include the root element in the search. Defaults to `true`.
   * @returns An array of matching elements.
   */
  querySelectorAllDeep(root: Element | Document, selector: string | Element, includeRoot?: boolean): Element[];

  /**
   * Iterates over each element in the Query instance.
   * @see https://next.semantic-ui.com/api/query/iterators#each
   * @param callback - The callback function to execute for each element.
   *  The callback receives the element and its index as arguments. `this` is bound to a new
   * `Query` instance containing only the current element.
   * @returns The Query instance for chaining.
   */
  each(callback: (this: Query, el: Element, index: number) => void): this;

  /**
   * Removes all event handlers attached by this Query class. Resets the static `eventHandlers` array.
   * @see https://next.semantic-ui.com/api/query/events#off
   */
  removeAllEvents(): void;

  /**
   * Finds elements within the current set of elements.
   * @see https://next.semantic-ui.com/api/query/dom-traversal#find
   * @param selector - The CSS selector to search for.
   * @returns A new Query instance containing the found elements.
   */
  find(selector: string): Query;

  /**
   * Gets the parent of each element in the current set.
   * @see https://next.semantic-ui.com/api/query/dom-traversal#parent
   * @param selector - Optional CSS selector to filter the parents.
   * @returns A new Query instance containing the parent elements.
   */
  parent(selector?: string): Query;

  /**
   * Gets the children of each element in the current set.
   * @see https://next.semantic-ui.com/api/query/dom-traversal#children
   * @param selector - Optional CSS selector to filter the children.
   * @returns A new Query instance containing the child elements.
   */
  children(selector?: string): Query;

  /**
   * Gets the siblings of each element in the current set.
   * @see https://next.semantic-ui.com/api/query/dom-traversal#siblings
   * @param selector - Optional CSS selector to filter the siblings.
   * @returns A new Query instance containing the sibling elements.
   */
  siblings(selector?: string): Query;

  /**
   * Returns the index of the first element in the current set,
   * relative to its siblings (optionally filtered by a selector).
   * @see https://next.semantic-ui.com/api/query/size-and-position#index
   * @param siblingFilter - Optional CSS selector, function or Query to filter the siblings.
   * @returns The index of the element, or -1 if not found.
   */
  index(siblingFilter?: string | Function | Query): number;

  /**
   * Find the index of the first element matching the filter within current Query set.
   * @see https://next.semantic-ui.com/api/query/size-and-position#index
   * @param filter - Optional CSS selector, function or Query to identify element within selection.
   * @returns The index of the element, or -1 if not found.
   */
  indexOf(filter?: string | Function | Query): number;

  /**
   * Filters the current set of elements based on a selector, function, or another Query instance.
   * @see https://next.semantic-ui.com/api/query/iterators#filter
   * @param filter - A CSS selector, a filter function, or a Query instance.
   * @returns A new Query instance containing the filtered elements.
   */
  filter(filter: string | Function | Query): Query;

  /**
   * Checks if *all* elements in the current set match a selector.
   * @see https://next.semantic-ui.com/api/query/logical-operators#is
   * @param selector - A CSS selector, an element, a Query instance, or 'window'/'globalThis'.
   * @returns `true` if all elements match, `false` otherwise.
   */
  is(selector: string | Element | Query | typeof globalThis): boolean;

  /**
   * Filters the current set of elements, excluding those that match the selector.
   * @see https://next.semantic-ui.com/api/query/logical-operators#not
   * @param selector - A CSS selector, an element, a Query instance, or 'window'/'globalThis'.
   * @returns A new Query instance containing the filtered elements.
   */
  not(selector: string | Element | Query | typeof globalThis): Query;

  /**
   * Gets the closest ancestor of each element in the current set (including the element itself) that matches the selector.
   * @see https://next.semantic-ui.com/api/query/dom-traversal#closest
   * @param selector - A CSS selector or a DOM element.
   * @returns A new Query instance containing the closest ancestor elements.
   */
  closest(selector: string | Element): Query;

  /**
   * Gets the closest ancestor of the provided element (including the element itself) that matches the selector, traversing shadow DOM boundaries.
   * @param element - The element to start searching from.
   * @param selector - A CSS selector or a DOM element.
   * @returns The closest ancestor element, or `undefined` if not found.
   */
  closestDeep(element: Element, selector: string | Element): Element | undefined;

  /**
   * Attaches a handler to be executed when the DOM is fully loaded.
   * @see https://next.semantic-ui.com/api/query/events#ready
   * @param handler - The function to be executed.
   * @returns The Query instance for chaining.
   */
  ready(handler: (this: Document, event: Event) => void): this;

  /**
   * Gets the event alias for a given event name (e.g., 'ready' -> 'DOMContentLoaded').
   * @see https://next.semantic-ui.com/api/query/events#on
   * @param eventName - The event name.
   * @returns The aliased event name.
   */
  getEventAlias(eventName: string): string;

  /**
   * Splits a space-separated string of event names into an array, applying event aliases.
   * @see https://next.semantic-ui.com/api/query/events#on
   * @param eventNames - A space-separated string of event names.
   * @returns An array of event names.
   */
  getEventArray(eventNames: string): string[];

  /**
   * Attaches an event listener to each element in the current set.
   * @see https://next.semantic-ui.com/api/query/events#on
   * @param eventNames - A space-separated string of event names.
   * @param handler - The event handler function.
   * @param options - Optional event listener options or EventOptions.
   * @returns The Query instance for chaining, or the event handler if `returnHandler` is true.
   */
  on(eventNames: string, handler: EventListener, options?: EventOptions): this;
  /**
   * Attaches an event listener to each element in the current set, delegating to a specific target.
   * @param eventNames - A space-separated string of event names.
   * @param targetSelector - A CSS selector for event delegation.
   * @param handler - The event handler function.
   * @param options - Optional event listener options or EventOptions.
   * @returns The Query instance for chaining, or the event handler if `returnHandler` is true.
   */
  on(eventNames: string, targetSelector: string, handler: EventListener, options?: EventOptions): this;
    /**
   * Attaches an event listener to each element in the current set, using standard options.
   * @param eventNames - A space-separated string of event names.
   * @param handler - The event handler function.
   * @param options - Optional event listener options.
   * @returns The Query instance for chaining, or the event handler if `returnHandler` is true.
   */
  on(eventNames: string, handler: EventListener, options?: AddEventListenerOptions): this;

  /**
   * Attaches an event listener that is executed at most once to each element in the current set.
   * @see https://next.semantic-ui.com/api/query/events#one
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
   * Attaches an event listener that is executed at most once to each element in the current set.
   * @param eventNames - A space-separated string of event names.
   * @param handler - The event handler function.
   * @param options - Optional event listener options.
   * @returns The Query instance for chaining.
   */
  one(eventNames: string, handler: EventListener, options?: AddEventListenerOptions): this;

  /**
   * Removes event listeners from each element in the current set.
   * @see https://next.semantic-ui.com/api/query/events#off
   * @param eventNames - A space-separated string of event names, or undefined to remove all events
   * @param handler - The specific event handler to remove, or undefined to remove events by type.
   * @returns The Query instance for chaining.
   */
  off(eventNames: string, handler?: EventListener): this;

  /**
   * Triggers an event on each element in the current set.
   * @see https://next.semantic-ui.com/api/query/events#trigger
   * @param eventName - The name of the event to trigger.
   * @param eventParams - Optional parameters to be passed to the event.
   * @returns The Query instance for chaining.
   */
  trigger(eventName: string, eventParams?: PlainObject): this;

  /**
   * Triggers a 'click' event on each element in the current set.
   * @see https://next.semantic-ui.com/api/query/events#trigger
   * @param eventParams - Optional parameters to be passed to the event.
   * @returns The Query instance for chaining.
   */
  click(eventParams?: PlainObject): this;

  /**
   * Dispatches a custom event on each element in the current set.
   * @see https://next.semantic-ui.com/api/query/events#dispatchEvent
   * @param eventName - The name of the custom event.
   * @param eventData - Optional data to be passed as `detail` in the event.
   * @param eventSettings - Optional settings for the custom event (bubbles, cancelable, composed).
   * @returns The Query instance for chaining.
   */
  dispatchEvent(eventName: string, eventData?: PlainObject, eventSettings?: PlainObject): this;

  /**
   * Removes each element in the current set from the DOM.
   * @see https://next.semantic-ui.com/api/query/dom-manipulation#remove
   * @returns The Query instance for chaining.
   */
  remove(): this;

  /**
   * Adds one or more classes to each element in the current set.
   * @see https://next.semantic-ui.com/api/query/css#addClass
   * @param classNames - A space-separated string of class names.
   * @returns The Query instance for chaining.
   */
  addClass(classNames: string): this;

  /**
   * Checks if *any* element in the current set has the specified class.
   * @see https://next.semantic-ui.com/api/query/css#hasClass
   * @param className - The class name to check.
   * @returns `true` if any element has the class, `false` otherwise.
   */
  hasClass(className: string): boolean;

  /**
   * Removes one or more classes from each element in the current set.
   * @see https://next.semantic-ui.com/api/query/css#removeClass
   * @param classNames - A space-separated string of class names.
   * @returns The Query instance for chaining.
   */
  removeClass(classNames: string): this;

  /**
   * Toggles one or more classes on each element in the current set.
   * @see https://next.semantic-ui.com/api/query/css#toggleClass
   * @param classNames - A space-separated string of class names.
   * @returns The Query instance for chaining.
   */
  toggleClass(classNames: string): this;

  /**
   * Gets or sets the inner HTML of the elements in the current set.
   * @see https://next.semantic-ui.com/api/query/content#html
   * @param newHTML - The new HTML content to set. If undefined, returns the inner HTML.
   * @returns If getting, the inner HTML of the *first* element, or an empty string.  If setting, the Query instance for chaining.
   */
  html(newHTML?: string): string | this | undefined;

  /**
   * Gets or sets the outer HTML of each element in the current set.
   * @see https://next.semantic-ui.com/api/query/content#outerHTML
   * @param newHTML - The new outer HTML content to set.  If undefined, returns the outerHTML.
   * @returns If getting, the outer HTML of the *first* element or joined outerHTML, if setting, the Query instance for chaining.
   */
  outerHTML(newHTML?: string): string | this | undefined;

  /**
   * Gets or sets the text content of each element in the current set.  Includes text from descendants.
   * @see https://next.semantic-ui.com/api/query/content#text
   * @param newText - The new text content to set. If undefined, returns the text content.
   * @returns If getting, the text content of all elements (concatenated), if setting the Query instance.
   */
  text(newText?: string): string | this | undefined;

  /**
   * Recursively retrieves the text content of a node and its descendants, including slotted content.
   * @param nodes The list of nodes
   */
  getTextContentRecursive(nodes: NodeListOf<ChildNode> | ChildNode[]): string;

  /**
   * Gets the combined text content of *only* the immediate text node children of each element.
   * @see https://next.semantic-ui.com/api/query/content#textNode
   * @returns The combined text content.
   */
  textNode(): string;

  /**
   * Maps over the elements in the current set, similar to `Array.prototype.map`.
   * @see https://next.semantic-ui.com/api/query/iterators#map
   * @param callback - The mapping function.
   * @returns An array containing the results of the mapping function.
   */
  map<U>(callback: (this: Element, index: number, element: Element) => U): U[];

  /**
   * Gets or sets the value of each element in the current set (for form elements).
   * @see https://next.semantic-ui.com/api/query/content#value
   * @param newValue - The new value to set. If undefined, returns the value.
   * @returns If getting, the value of the *first* element, or an array of values, if setting, the Query instance.
   */
  value(newValue?: string): string | string[] | undefined | this;
  /**
   * Gets or sets the value of each element in the current set (for form elements).  Alias for `value()`.
   * @param newValue - The new value to set. If undefined, returns the value.
   * @returns If getting, the value of the *first* element, or an array of values, if setting, the Query instance.
   */
  val(newValue?: string): string | string[] | undefined | this;

  /**
   * Sets focus on the first element in the current set.
   * @see https://next.semantic-ui.com/api/query/events#focus
   * @returns The Query instance for chaining.
   */
  focus(): this;

  /**
   * Removes focus from the first element in the current set.
   * @see https://next.semantic-ui.com/api/query/events#blur
   * @returns The Query instance for chaining.
   */
  blur(): this;

  /**
   * Gets or sets CSS properties for each element in the current set.
   * @see https://next.semantic-ui.com/api/query/css#css
   * @param property - The CSS property name (or an object of property-value pairs) or array of properties.
   * @param value - The value to set for the property (if `property` is a string).  If null, the style setting is removed.
   * @param options - Optional settings for getting styles.
   * @returns If setting, the Query instance for chaining.  If getting, the value of the property for the *first* element, or an array of values.
   */
  css(property: string, value?: string | null, options?: CSSOptions): string | string[] | undefined | this;
  /**
   * Sets multiple CSS properties for each element in the current set.
   * @param property - An object of property-value pairs.
   * @returns The Query instance for chaining.
   */
  css(property: PlainObject<string>): this;

  /**
   * Gets the computed style of the *first* element in the current set.
   * @see https://next.semantic-ui.com/api/query/css#computedStyle
   * @param property - The CSS property name.
   * @returns The computed style value, or an array of values.
   */
  computedStyle(property: string): string | string[] | undefined;

  /**
   * Gets or sets a CSS custom property (variable) for each element in the current set.
   * @see https://next.semantic-ui.com/api/query/css#cssVar
   * @param variable - The name of the CSS variable (without the `--` prefix).
   * @param value - The value to set.  If undefined, gets the value (including computed values).
   * @returns If setting, the Query instance for chaining. If getting, the value of the variable for the *first* element.
   */
  cssVar(variable: string, value?: string | null): string | string[] | undefined | this;

  /**
   * Gets or sets an attribute on each element in the current set.
   * @see https://next.semantic-ui.com/api/query/attributes#attr
   * @param attribute - The attribute name (or an object of attribute-value pairs).
   * @param value - The value to set for the attribute (if `attribute` is a string).
   * @returns If setting, the Query instance for chaining.  If getting, the value of the attribute for the *first* element or an array of values.
   */
  attr(attribute: string, value?: string): string | string[] | undefined | this;
  /**
   * Sets multiple attributes for each element in the current set.
   * @param attribute An object containing attribute/value pairs.
   * @returns The Query instance.
   */
  attr(attribute: PlainObject<string>): this;

  /**
   * Removes an attribute from each element in the current set.
   * @see https://next.semantic-ui.com/api/query/attributes#removeAttr
   * @param attributeName - The name of the attribute to remove.
   * @returns The Query instance for chaining.
   */
  removeAttr(attributeName: string): this;

  /**
   * Returns the first element in the current set.
   * @returns The first element, or `undefined` if the set is empty.
   */
  el(): Element | undefined;

  /**
   * Gets the element at the specified index, or all elements if no index is provided.
   * @param index - The index of the element to retrieve.
   * @returns The element at the specified index, or an array of all elements.
   */
  get(index?: number): Element | Element[] | (Element | typeof Query.globalThisProxy)[] | undefined;

  /**
   * Gets a new Query instance containing the element at the specified index.
   * @param index - The index of the element.
   * @returns A new Query instance containing the element at the specified index.
   */
  eq(index: number): Query;

  /**
   * Gets a new Query instance containing the first element in the current set.
   * @returns A new Query instance containing the first element.
   */
  first(): Query;

  /**
   * Gets a new Query instance containing the last element in the current set.
   * @returns A new Query instance containing the last element.
   */
  last(): Query;

  /**
    * Get a property of the first element in the set.
    * @param name Name of the property to get.
    */
  prop(name: string): any;
  /**
   * Sets a property on each element in the current set.
   * @param name - The name of the property.
   * @param value - The value to set.
   * @returns The Query object
   */
  prop(name: string, value?: any): any;

  /**
   * Gets a new Query instance containing the next sibling of each element that matches selector, or the *first* matching sibling.
   * @see https://next.semantic-ui.com/api/query/dom-traversal#next
   * @param selector - Optional CSS selector to filter the next siblings.
   * @returns A new Query instance containing the next sibling elements.
   */
  next(selector?: string): Query;

  /**
   *  Gets a new Query instance containing the previous sibling of each element that matches selector, or the *first* matching sibling.
   * @see https://next.semantic-ui.com/api/query/dom-traversal#prev
   * @param selector - Optional CSS selector to filter the previous siblings.
   * @returns A new Query instance containing the previous sibling elements.
   */
  prev(selector?: string): Query;

  /**
   * Gets or sets the height of each element in the current set. Uses `clientHeight` or `innerHeight` depending on presence of value.
   * @see https://next.semantic-ui.com/api/query/dimensions#height
   * @param value - height in pixels.
   * @returns If setting, the Query instance for chaining.  If getting, the height of the *first* element or an array of heights.
   */
  height(value?: number): number | this;

  /**
   * Gets or sets the width of each element in the current set.
   * @see https://next.semantic-ui.com/api/query/dimensions#width
   * @param value - The width in pixels.
   * @returns If setting, the Query instance for chaining.  If getting, the width of the *first* element.
   */
  width(value?: number): number | this;

  /**
   * Gets or sets the scrollHeight of each element in the current set.  Uses `document.documentElement` if applied to `window`.
   * @see https://next.semantic-ui.com/api/query/dimensions#scrollHeight
   * @param value - The scrollHeight in pixels.
   * @returns If setting, the Query instance for chaining.  If getting, the scrollHeight of the *first* element.
   */
  scrollHeight(value?: number): number | this;

  /**
   * Gets or sets the scrollWidth of each element in the current set. Uses `document.documentElement` if applied to `window`.
   * @see https://next.semantic-ui.com/api/query/dimensions#scrollWidth
   * @param value - The scrollWidth in pixels.
   * @returns If setting, the Query instance for chaining.  If getting, the scrollWidth of the *first* element.
   */
  scrollWidth(value?: number): number | this;

  /**
   * Gets or sets the scrollLeft position of each element in the current set. Uses `document.documentElement` if applied to `window`.
   * @see https://next.semantic-ui.com/api/query/dimensions#scrollLeft
   * @param value - The scrollLeft value in pixels.
   * @returns If setting, the Query instance for chaining.  If getting, the scrollLeft value of the *first* element.
   */
  scrollLeft(value?: number): number | this;

  /**
   * Gets or sets the scrollTop position of each element in the current set. Uses `document.documentElement` if applied to `window`.
   * @see https://next.semantic-ui.com/api/query/dimensions#scrollTop
   * @param value - The scrollTop value in pixels.
   * @returns If setting, the Query instance for chaining.  If getting, the scrollTop value of the *first* element.
   */
  scrollTop(value?: number): number | this;

  /**
   * Creates a deep clone of each element in the current set.
   * @see https://next.semantic-ui.com/api/query/dom-manipulation#clone
   * @returns A new Query instance containing the cloned elements.
   */
  clone(): Query;

  /**
   * Reverses the order of the elements in the current set.
   * @see https://next.semantic-ui.com/api/query/dom-manipulation#reverse
   * @returns A new Query instance containing the reversed elements.
   */
  reverse(): Query;

  /**
   * Inserts content at a specified position relative to a target element.
   * @param target - The target element.
   * @param content - The content to insert.
   * @param position - The position relative to the target element ('beforebegin', 'afterbegin', 'beforeend', 'afterend').
   */
  insertContent(target: Element, content: string | Node | NodeList | HTMLCollection | Query, position: InsertPosition): void;

  /**
   * Prepends content to each element in the current set.
   * @see https://next.semantic-ui.com/api/query/dom-manipulation#prepend
   * @param content - The content to prepend.
   * @returns The Query instance for chaining.
   */
  prepend(content: string | Node | NodeList | HTMLCollection | Query): this;

  /**
   * Appends content to each element in the current set.
   * @see https://next.semantic-ui.com/api/query/dom-manipulation#append
   * @param content - The content to append.
   * @returns The Query instance for chaining.
   */
  append(content: string | Node | NodeList | HTMLCollection | Query): this;

  /**
   * Inserts each element in the current set before the specified target(s).
   * @see https://next.semantic-ui.com/api/query/dom-manipulation#insertBefore
   * @param selector - The target element(s) or selector.
   * @returns A new query object of elements inserted.
   */
  insertBefore(selector: string | Node | NodeList | HTMLCollection | Query): Query;

  /**
   * Inserts each element in the current set after the specified target(s).
   * @see https://next.semantic-ui.com/api/query/dom-manipulation#insertAfter
   * @param selector - The target element(s) or selector.
   *  @returns A new query object of elements inserted.
   */
  insertAfter(selector: string | Node | NodeList | HTMLCollection | Query): Query;

  /**
   * Removes each element in the current set from the DOM, but keeps event handlers.
   * @see https://next.semantic-ui.com/api/query/dom-manipulation#detach
   * @returns The Query instance for chaining.
   */
  detach(): this;

  /**
   * Gets the natural width (width without applied styles) of the *first* element in the set.
   * @see https://next.semantic-ui.com/api/query/dimensions#naturalWidth
   * @returns The natural width of the element.
   */
  naturalWidth(): number | number[];

  /**
   * Gets the natural height (height without applied styles) of the *first* in the current set.
   * @see https://next.semantic-ui.com/api/query/dimensions#naturalHeight
   * @returns The natural height of the element.
   */
  naturalHeight(): number | number[];

  /**
   * Gets the offset parent of each element in the current set, optionally calculating it accurately
   * by considering transformed parent.
   * @see https://next.semantic-ui.com/api/query/size-and-position#offsetParent
   * @param options.calculate - Whether to calculate offset parent taking transform into account.
   * @returns An array of the offset parent elements.
   */
  offsetParent(options?: { calculate?: boolean }): (HTMLElement | null)[];

  /**
   * Gets the number of elements in the current set.  Alias for `length`.
   * @see https://next.semantic-ui.com/api/query/size-and-position#count
   * @returns The number of elements.
   */
  count(): number;

  /**
   * Checks if the current set contains any elements.
   * @see https://next.semantic-ui.com/api/query/logical-operators#exists
   * @returns `true` if the set contains elements, `false` otherwise.
   */
  exists(): boolean;

  /**
   * Adds properties to element on DOMContentLoaded
   * @param settings The properties to add.
   */
  initialize(settings: PlainObject): void;

    /**
   * Adds multiple properties to each element in selection.
   * @param settings The properties to add.
   */
  settings(settings: PlainObject): void;

    /**
   * Add a single property to all elements in selection.
   * @param setting The setting to add.
   * @param value The value of the setting.
   */
  setting(setting: string, value: any): void;

  /**
   * Gets the associated component (if any) of the *first* element in the current set.
   * This is specific to Semantic UI components.
   * @see https://next.semantic-ui.com/api/query/components#getComponent
   * @returns The component instance, or `undefined` if not found.
   */
  component(): any;

  /**
   * Gets the data context (if any) associated with the *first* element in the current set.
   * @returns The data context, or undefined.
   */
  dataContext(): any;
}

export default Query;
