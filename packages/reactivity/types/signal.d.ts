/**
 * Configuration options for creating a new Signal instance.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/signal#options Signal Options}
 */
export interface SignalOptions<T> {
  /**
   * Value-protection preset controlling how the stored value is guarded against
   * outside mutation. `'reference'` (default) stores the value by reference.
   * `'clone'` stores and returns defensive copies via `clone`. `'none'` stores
   * by reference and treats every `set()` as a change (event-stream semantics).
   * @default 'reference'
   */
  safety?: 'clone' | 'reference' | 'none';

  /**
   * Determines whether a candidate value differs from the current one. The
   * signal notifies dependents only when this returns `false`. Snapshotted at
   * construction, so reassigning `Signal.equality` later does not affect signals
   * that already exist.
   * @param oldValue - The current value
   * @param newValue - The candidate value
   */
  equality?: (oldValue: T, newValue: T) => boolean;

  /**
   * Produces a copy of a value. Used to insulate stored values when `safety` is
   * `'clone'`, and by `mutate()` to detect in-place changes.
   * @param value - The value to copy
   */
  clone?: <V>(value: V) => V;

  /**
   * Resolves the identity of an array item for the id-based collection helpers
   * (`getItem`, `setItemProperty`, `toggleItemProperty`, `replaceItem`, `removeItem`). Defaults to the
   * first present of `id`, `_id`, `hash`, `key`.
   * @param item - The item to identify
   */
  id?: (item: any) => any;

  /**
   * Seeds the signal's change counter, for aligning `version` with an external
   * store's revision on hydration. Defaults to `0`.
   */
  version?: number;

  /**
   * Debugging context attached to the signal, surfaced in tracing output.
   */
  context?: Record<string, any>;
}

/**
 * A Signal represents a reactive value that automatically triggers updates
 * when modified. It can store any type of value and provides methods for
 * safely mutating that value while maintaining reactivity.
 *
 * Create one with the `signal()` factory or `new Signal()` — both are supported.
 * @see {@link https://next.semantic-ui.com/docs/api/reactivity/signal Signal Documentation}
 */
export class Signal<T> {
  /**
   * Default equality (deep) used by signals that don't supply their own. Set
   * this to change the default for signals created afterward.
   */
  static equality: (oldValue: any, newValue: any) => boolean;

  /**
   * Default clone used by signals that don't supply their own.
   */
  static clone: <V>(value: V) => V;

  /**
   * Default id resolver for the collection helpers. Returns the first present of
   * `id`, `_id`, `hash`, `key`.
   */
  static id: (item: any) => any;

  /**
   * Default safety preset for new signals.
   * @default 'reference'
   */
  static safety: 'clone' | 'reference' | 'none';

  /**
   * Creates a new Signal with an initial value.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/signal#constructor constructor}
   * @param initialValue - The initial value to store in the signal
   * @param options - Configuration options for the signal's behavior
   */
  constructor(initialValue?: T, options?: SignalOptions<T>);

  /**
   * Sets debugging context on the signal, replacing any existing context.
   * Context appears in reactive debugging output and helps trace signal behavior.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/debugging Debugging Reactivity}
   * @param additionalContext - Key-value pairs to store as debugging context
   */
  setContext(additionalContext?: Record<string, any>): void;

  /**
   * Adds debugging context without replacing existing context.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/debugging Debugging Reactivity}
   * @param additionalContext - Key-value pairs to merge into existing context
   */
  addContext(additionalContext?: Record<string, any>): void;

  /**
   * Captures a stack trace into the signal's context. Only does work when stack
   * capture is enabled via `setStackCapture(true)`.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/debugging Debugging Reactivity}
   */
  setTrace(): void;

  /**
   * Gets the current value, establishing a reactive dependency.
   * When accessed within a reactive context (like a Reaction),
   * any changes to this Signal will cause the reactive context to re-run.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/signal#value value}
   */
  get value(): T;

  /**
   * Sets a new value, triggering updates if the value has changed.
   * Notifies all reactive contexts that depend on this Signal to re-run.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/signal#value value}
   */
  set value(
    newValue: T extends null | undefined ? any
      : T extends Array<any> ? Array<Partial<T[number]> & Record<string, any>>
      : T extends object ? Partial<T> & Record<string, any>
      : T,
  );

  /**
   * Gets the current value and establishes a reactive dependency.
   * This is an alias for the `value` getter.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/signal#get get}
   */
  get(): T;

  /**
   * Sets a new value and triggers updates if the value has changed.
   * This is an alias for the `value` setter.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/signal#set set}
   * @param newValue - The new value to set
   */
  set(
    newValue: T extends null | undefined ? any
      : T extends Array<any> ? Array<Partial<T[number]> & Record<string, any>>
      : T extends object ? Partial<T> & Record<string, any>
      : T,
  ): void;

  /**
   * Registers this signal as a dependency in the current reactive context
   * without reading or returning the value. Useful when you need to subscribe
   * to changes without accessing the value.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/signal#depend depend}
   */
  depend(): void;

  /**
   * Force-triggers all subscribers without changing the value. Bypasses the
   * equality check, useful when external code has mutated the stored value
   * in place (under `safety: 'reference'`) and you need to notify dependents.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/signal#notify notify}
   */
  notify(): void;

  /**
   * Returns whether any reactive contexts are currently subscribed to this signal.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/signal#hasdependents hasDependents}
   * @returns `true` if at least one reaction depends on this signal
   */
  hasDependents(): boolean;

  /**
   * Returns the current value without establishing a reactive dependency.
   * Under `safety: 'clone'` the returned value is still a defensive copy.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/signal#peek peek}
   */
  peek(): T;

  /**
   * Returns the underlying stored value with no dependency tracking and no
   * clone protection, even under `safety: 'clone'`. This is the live reference,
   * mutating it bypasses change detection. Prefer `peek()` unless you need the
   * exact stored object.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/signal#raw raw}
   */
  raw(): T;

  /**
   * Returns a detached deep copy of the current value, established as a reactive
   * dependency. Always copies, even under `safety: 'reference'` where `get()`
   * returns the live value. Reach for it when you need to sort or mutate the
   * value in place without corrupting the stored object.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/signal#clone clone}
   */
  clone(): T;

  /**
   * Monotonic change counter, bumped on every announced change. Reading it does not
   * subscribe the running reaction. Seedable via the `version` option and freely assignable.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/signal#version version}
   */
  version: number;

  /**
   * Sets the signal's value to undefined.
   * Triggers updates if the value was not already undefined.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/signal#clear clear}
   */
  clear(): void;

  /**
   * Mutates the current value in-place via a callback function.
   * If the callback returns a value, that value is set. Otherwise the original
   * value is kept and reactivity is triggered only if it changed.
   *
   * Small values are passed to the callback directly and compared against a
   * snapshot. Large values are passed as a write-tracking wrapper (shows as
   * Proxy(Object) in the console) so cost scales with writes — the wrapper is
   * only valid inside the callback.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/signal#mutate mutate}
   * @param mutationFn - Function that receives the current value and optionally returns a new value
   */
  mutate(mutationFn: (value: T) => T | void): void;

  // Array-specific methods (only available when T is or extends any[])
  // These methods are available when the Signal's value is an array, providing
  // convenient ways to manipulate array values reactively.
  /**
   * Adds elements to the end of the array.
   * This method is only available when `T` is or extends `any[]`.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/array-helpers#push push}
   * @param items - Elements to add
   */
  push<U extends any[]>(this: Signal<U>, ...items: U[number][]): void;

  /**
   * Adds elements to the beginning of the array.
   * This method is only available when `T` is or extends `any[]`.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/array-helpers#unshift unshift}
   * @param items - Elements to add
   */
  unshift<U extends any[]>(this: Signal<U>, ...items: U[number][]): void;

  /**
   * Changes the contents of the array by removing or replacing existing elements.
   * This method is only available when `T` is or extends `any[]`.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/array-helpers#splice splice}
   * @param start - Index at which to start modifying the array
   * @param deleteCount - Number of elements to remove
   * @param items - Elements to insert
   */
  splice<U extends any[]>(this: Signal<U>, start: number, deleteCount?: number, ...items: U[number][]): void;

  /**
   * Gets the element at the specified index.
   * This method is only available when `T` is or extends `any[]`.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/array-helpers#getindex getIndex}
   * @param index - Index of the element to retrieve
   */
  getIndex<U extends any[]>(this: Signal<U>, index: number): U[number];

  /**
   * Sets the element at the specified index.
   * This method is only available when `T` is or extends `any[]`.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/array-helpers#setindex setIndex}
   * @param index - Index to set
   * @param value - Value to set at the index
   */
  setIndex<U extends any[]>(this: Signal<U>, index: number, value: U[number]): void;

  /**
   * Removes the element at the specified index.
   * This method is only available when `T` is or extends `any[]`.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/array-helpers#removeindex removeIndex}
   * @param index - Index of the element to remove
   */
  removeIndex<U extends any[]>(this: Signal<U>, index: number): void;

  /**
   * Transforms each element in the array in place using the mapping function.
   * This method is only available when `T` is or extends `any[]`.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/array-helpers#map map}
   * @param callback - Function to transform each element
   */
  map<U extends any[]>(this: Signal<U>, callback: (value: U[number], index: number, array: U) => U[number]): void;

  /**
   * Filters the array in place to the elements that pass the test.
   * This method is only available when `T` is or extends `any[]`.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/array-helpers#filter filter}
   * @param predicate - Function to test each element
   */
  filter<U extends any[]>(this: Signal<U>, predicate: (value: U[number], index: number, array: U) => boolean): void;

  // Object-array methods (only available when T is or extends Record<string, any>[])
  // These methods are for Signals holding arrays of objects, allowing reactive
  // updates to properties within those objects.
  /**
   * Sets a property on the object at a specific index in the array.
   * This method is only available when `T` is or extends `Record<string, any>[]`.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/collection-helpers#setindexproperty setIndexProperty}
   * @param index - Index of the object to modify
   * @param property - Property name to set
   * @param value - Value to set for the property
   */
  setIndexProperty<U extends Record<string, any>[]>(
    this: Signal<U>,
    index: number,
    property: keyof U[number],
    value: U[number][keyof U[number]],
  ): void;

  /**
   * Sets a property on the object with the specified id within the array.
   * This method is only available when `T` is or extends `Record<string, any>[]`.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/collection-helpers#setitemproperty setItemProperty}
   * @param id - Id of the object to modify
   * @param property - Property name to set
   * @param value - Value to set for the property
   */
  setItemProperty<U extends Record<string, any>[]>(
    this: Signal<U>,
    id: string,
    property: keyof U[number],
    value: U[number][keyof U[number]],
  ): void;

  /**
   * Sets a property on every object in the array.
   * This method is only available when `T` is or extends `Record<string, any>[]`.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/collection-helpers#setproperty setProperty}
   * @param property - Property name to set on all objects
   * @param value - Value to set for the property
   */
  setProperty<U extends Record<string, any>[]>(
    this: Signal<U>,
    property: keyof U[number],
    value: U[number][keyof U[number]],
  ): void;

  /**
   * Sets a property directly on the Signal's value when it is a plain object.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/collection-helpers#setproperty setProperty}
   * @param property - Property name
   * @param value - Value to set
   */
  setProperty<K extends keyof T>(property: K, value: T[K]): void;

  /**
   * Toggles a boolean property on the object with the specified id within the array.
   * This method is only available when `T` is or extends `Record<string, any>[]`.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/collection-helpers#toggleitemproperty toggleItemProperty}
   * @param id - Id of the object to modify
   * @param property - Property name to toggle
   */
  toggleItemProperty<U extends Record<string, any>[]>(
    this: Signal<U>,
    id: string,
    property: keyof U[number],
  ): void;

  /**
   * Toggles a boolean property on every object in the array.
   * This method is only available when `T` is or extends `Record<string, any>[]`.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/collection-helpers#toggleproperty toggleProperty}
   * @param property - Property name to toggle on all objects
   */
  toggleProperty<U extends Record<string, any>[]>(
    this: Signal<U>,
    property: keyof U[number],
  ): void;

  /**
   * Toggles a boolean property directly on the Signal's value when it is a plain object.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/collection-helpers#toggleproperty toggleProperty}
   * @param property - Property name to toggle
   */
  toggleProperty<K extends keyof T>(property: K): void;

  /**
   * Replaces the object with the specified id in the array.
   * Assumes the Signal's value is an array of objects.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/collection-helpers#replaceitem replaceItem}
   * @param id - Id of the object to replace
   * @param item - New object to insert
   */
  replaceItem<U extends any[]>(this: Signal<U>, id: string, item: U[number]): void;

  /**
   * Removes the object with the specified id from the array.
   * Assumes the Signal's value is an array of objects.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/collection-helpers#removeitem removeItem}
   * @param id - Id of the object to remove
   */
  removeItem(id: string): void;

  // Boolean method (only available when T is or extends boolean)
  /**
   * Toggles a boolean value between true and false.
   * This method is only available when `T` is or extends `boolean`, or is null/undefined.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/boolean-helpers#toggle toggle}
   */
  toggle(this: Signal<boolean | null | undefined>): void;

  // Numeric methods (only available when T is or extends number)
  /**
   * Increments the numeric value, optionally clamping to a maximum.
   * This method is only available when `T` is or extends `number`, or is null/undefined.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/number-helpers#increment increment}
   * @param amount - Amount to increment by
   * @param max - Optional ceiling the result will not exceed
   * @default 1
   */
  increment(this: Signal<number | null | undefined>, amount?: number, max?: number): void;

  /**
   * Decrements the numeric value, optionally clamping to a minimum.
   * This method is only available when `T` is or extends `number`, or is null/undefined.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/number-helpers#decrement decrement}
   * @param amount - Amount to decrement by
   * @param min - Optional floor the result will not fall below
   * @default 1
   */
  decrement(this: Signal<number | null | undefined>, amount?: number, min?: number): void;

  // Date method (only available when T is or extends Date)
  /**
   * Sets the value to the current date/time.
   * This method is only available when `T` is or extends `Date`, or is null/undefined.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/date-helpers#now now}
   */
  now(this: Signal<Date | null | undefined>): void;

  // Id-based collection methods (for arrays of objects with identifier fields)
  // These operate on objects carrying an `id`, `_id`, `hash`, or `key`.
  /**
   * Gets every id value present on an object (`id`, `_id`, `hash`, `key`).
   * A non-object item is returned wrapped in a single-element array.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/collection-helpers#getids getIds}
   * @param item - Object (or primitive) to read ids from
   * @returns Array of the id values found
   */
  getIds(item: { _id?: string; id?: string; hash?: string; key?: string; }): string[];
  getIds(item: string): [string];

  /**
   * Gets the first available id from an object, using the signal's `id` resolver.
   * A primitive item is its own id.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/collection-helpers#getid getId}
   * @param item - Object (or primitive) to read an id from
   * @returns The resolved id, or undefined if none is present
   */
  getId(item: { _id?: string; id?: string; hash?: string; key?: string; }): string | undefined;
  getId(item: string): string;

  /**
   * Checks whether an object or primitive has the given id.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/collection-helpers#hasid hasId}
   * @param item - Object or primitive to check
   * @param id - Id to look for
   * @returns `true` if the item's id matches
   */
  hasId(item: { _id?: string; id?: string; hash?: string; key?: string; } | string, id: string): boolean;

  /**
   * Gets the object with the specified id within the Signal's array value.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/collection-helpers#getitem getItem}
   * @param id - Id to look for
   * @returns The matching object, or undefined if not found
   */
  getItem<U extends Record<string, any>[]>(this: Signal<U>, id: string): U[number] | undefined;

  /**
   * Gets the index of the object with the specified id within the array value.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/collection-helpers#getitemindex getItemIndex}
   * @param id - Id to look for
   * @returns Index of the matching object, or -1 if not found
   */
  getItemIndex<U extends Record<string, any>[]>(this: Signal<U>, id: string): number;

  /**
   * Creates a new signal derived from this signal's value. The compute function
   * receives the current value and returns the derived value, recomputing when
   * this signal changes. Sugar for the free `derive`.
   * @see {@link https://next.semantic-ui.com/docs/api/reactivity/derived-signals#derive derive}
   * @param computeFn - Function that transforms this signal's value
   * @param options - Optional configuration for the derived signal
   * @returns A new Signal containing the derived value
   */
  derive<U>(computeFn: (value: T) => U, options?: SignalOptions<U>): Signal<U> & { stop(): void; };
}
