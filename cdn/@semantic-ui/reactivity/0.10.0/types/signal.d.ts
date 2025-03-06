/**
* Configuration options for creating a new Signal instance
*/
export interface SignalOptions<T> {
   /**
   * Custom equality function to determine if a value has changed
   * @param oldValue - The previous value
   * @param newValue - The new value to compare against
   */
   equalityFunction?: (oldValue: T, newValue: T) => boolean;

   /**
   * Whether to allow cloning of values. If false, values are stored by reference
   * @default true
   */
   allowClone?: boolean;

   /**
   * Custom function to clone values when storing or retrieving from the signal
   * @param value - The value to clone
   */
   cloneFunction?: <V>(value: V) => V;
}


/**
* A Signal represents a reactive value that automatically triggers updates
* when modified. It can store any type of value and provides methods for
* safely mutating that value while maintaining reactivity.
* @see {@link https://next.semantic-ui.com/api/reactivity/signal Signal Documentation}
*/
export class Signal<T> {
   /**
   * Creates a new Signal with an initial value
   * @see {@link https://next.semantic-ui.com/api/reactivity/signal#constructor constructor}
   * @param initialValue - The initial value to store in the signal
   * @param options - Configuration options for the signal's behavior
   */
   constructor(initialValue: T, options?: SignalOptions<T>);
   /**
   * Creates a new Signal without an initial value
   * @see {@link https://next.semantic-ui.com/api/reactivity/signal#constructor constructor}
   */
   constructor();

   /**
   * Gets the current value, establishing a reactive dependency.
   * When accessed within a reactive context (like a Reaction),
   * any changes to this Signal will cause the reactive context to re-run.
   * @see {@link https://next.semantic-ui.com/api/reactivity/signal#value value}
   */
   get value(): T;

   /**
   * Sets a new value, triggering updates if the value has changed.
   * Notifies all reactive contexts that depend on this Signal to re-run.
   * @see {@link https://next.semantic-ui.com/api/reactivity/signal#value value}
   */
   set value(newValue: T extends null | undefined ? any : 
      T extends Array<any> ? Array<Partial<T[number]> & Record<string, any>> :
      T extends object ? Partial<T> & Record<string, any> :
      T);

   /**
   * Gets the current value and establishes a reactive dependency.
   * This is an alias for `value` getter.
   * @see {@link https://next.semantic-ui.com/api/reactivity/signal#get get}
   */
   get(): T;

   /**
   * Sets a new value and triggers updates if the value has changed.
   * This is an alias for `value` setter.
   * @see {@link https://next.semantic-ui.com/api/reactivity/signal#set set}
   * @param newValue - The new value to set
   */
   set(newValue: T extends null | undefined ? any :
      T extends Array<any> ? Array<Partial<T[number]> & Record<string, any>> :
      T extends object ? Partial<T> & Record<string, any> :
      T): void;

   /**
   * Returns the current value without establishing a reactive dependency.
   * Accessing the value with `peek()` will not cause any reactive context to depend on this Signal.
   * @see {@link https://next.semantic-ui.com/api/reactivity/signal#peek peek}
   */
   peek(): T;

   /**
   * Sets the signal's value to undefined.
   * Triggers updates if the value was not already undefined.
   * @see {@link https://next.semantic-ui.com/api/reactivity/signal#clear clear}
   */
   clear(): void;

   /**
   * Subscribes to changes in the signal's value.
   * @see {@link https://next.semantic-ui.com/api/reactivity/signal#subscribe subscribe}
   * @param callback - Function called whenever the value changes.
   *                   Receives the new value and a computation object with a `stop` method.
   * @returns An object with a `stop` method that can be called to unsubscribe,
   *          preventing further calls to the callback.
   */
   subscribe(callback: (value: T, computation: { stop: () => void }) => void): { stop: () => void };

   // Array-specific methods (only available when T is or extends any[])
   // These methods are available when the Signal's value is an array, providing
   // convenient ways to manipulate array values reactively.
   /**
   * Adds elements to the end of the array.
   * This method is only available when `T` is or extends `any[]`.
   * @see {@link https://next.semantic-ui.com/api/reactivity/array-helpers#push push}
   * @param items - Elements to add
   */
   push<U extends any[]>(this: Signal<U>, ...items: U[number][]): void;

   /**
   * Adds elements to the beginning of the array.
   * This method is only available when `T` is or extends `any[]`.
   * @see {@link https://next.semantic-ui.com/api/reactivity/array-helpers#unshift unshift}
   * @param items - Elements to add
   */
   unshift<U extends any[]>(this: Signal<U>, ...items: U[number][]): void;

   /**
   * Changes the contents of the array by removing or replacing existing elements.
   * This method is only available when `T` is or extends `any[]`.
   * @see {@link https://next.semantic-ui.com/api/reactivity/array-helpers#splice splice}
   * @param start - Index at which to start modifying the array
   * @param deleteCount - Number of elements to remove
   * @param items - Elements to insert
   */
   splice<U extends any[]>(this: Signal<U>, start: number, deleteCount?: number, ...items: U[number][]): void;

   /**
   * Gets the element at the specified index.
   * This method is only available when `T` is or extends `any[]`.
   * @see {@link https://next.semantic-ui.com/api/reactivity/array-helpers#getindex getIndex}
   * @param index - Index of the element to retrieve
   */
   getIndex<U extends any[]>(this: Signal<U>, index: number): U[number];

   /**
   * Sets the element at the specified index.
   * This method is only available when `T` is or extends `any[]`.
   * @see {@link https://next.semantic-ui.com/api/reactivity/array-helpers#setindex setIndex}
   * @param index - Index to set
   * @param value - Value to set at the index
   */
   setIndex<U extends any[]>(this: Signal<U>, index: number, value: U[number]): void;

   /**
   * Removes the element at the specified index.
   * This method is only available when `T` is or extends `any[]`.
   * @see {@link https://next.semantic-ui.com/api/reactivity/array-helpers#removeindex removeIndex}
   * @param index - Index of the element to remove
   */
   removeIndex<U extends any[]>(this: Signal<U>, index: number): void;

   // Object array methods (only available when T is or extends Record<string, any>[])
   // These methods are for Signals holding arrays of objects, allowing for reactive updates
   // to properties within those objects.
   /**
   * Sets a property on an object in the array at a specific index.
   * This method is only available when `T` is or extends `Record<string, any>[]`.
   * @see {@link https://next.semantic-ui.com/api/reactivity/collection-helpers#setarrayproperty setArrayProperty}
   * @param index - Index of object to modify
   * @param property - Property name to set
   * @param value - Value to set for the property
   */
   setArrayProperty<U extends Record<string, any>[]>(
    this: Signal<U>,
    index: number,
    property: keyof U[number],
    value: U[number][keyof U[number]]
   ): void;

   /**
   * Sets a property on all objects in the array.
   * This method is only available when `T` is or extends `Record<string, any>[]`.
   * @see {@link https://next.semantic-ui.com/api/reactivity/collection-helpers#setarrayproperty setArrayProperty}
   * @param property - Property name to set on all objects
   * @param value - Value to set for the property
   */
   setArrayProperty<U extends Record<string, any>[]>(
    this: Signal<U>,
    property: keyof U[number],
    value: U[number][keyof U[number]]
   ): void;

   // Boolean methods (only available when T is or extends boolean)
   // These methods are available when the Signal's value is a boolean.
   /**
   * Toggles a boolean value between true and false.
   * This method is only available when `T` is or extends `boolean`, or is null/undefined.
   * @see {@link https://next.semantic-ui.com/api/reactivity/boolean-helpers#toggle toggle}
   */
   toggle(this: Signal<boolean | null | undefined>): void;

   // Numeric methods (only available when T is or extends number)
   // These methods are available when the Signal's value is a number.
   /**
   * Increments the numeric value.
   * This method is only available when `T` is or extends `number`, or is null/undefined.
   * @see {@link https://next.semantic-ui.com/api/reactivity/number-helpers#increment increment}
   * @param amount - Amount to increment by
   * @default 1
   */
   increment(this: Signal<number | null | undefined>, amount?: number): void;

   /**
   * Decrements the numeric value.
   * This method is only available when `T` is or extends `number`, or is null/undefined.
   * @see {@link https://next.semantic-ui.com/api/reactivity/number-helpers#decrement decrement}
   * @param amount - Amount to decrement by
   * @default 1
   */
   decrement(this: Signal<number | null | undefined>, amount?: number): void;

   // Date methods (only available when T is or extends Date)
   // These methods are available when the Signal's value is a Date object.
   /**
   * Sets the value to the current date/time.
   * This method is only available when `T` is or extends `Date`, or is null/undefined.
   * @see {@link https://next.semantic-ui.com/api/reactivity/date-helpers#now now}
   */
   now(this: Signal<Date | null | undefined>): void;

   // Object ID related methods (for arrays or Signal values that are objects with IDs)
   // These methods facilitate working with objects that have identifier properties
   // such as `_id`, `id`, `hash`, or `key`.
   /**
   * Gets all possible ID values from an object.
   * Checks for properties: `_id`, `id`, `hash`, `key`.
   * @see {@link https://next.semantic-ui.com/api/reactivity/collection-helpers#getids getIDs}
   * @param item - Object to get IDs from
   * @returns Array of ID values found in the object.
   */
   getIDs(item: { _id?: string; id?: string; hash?: string; key?: string }): string[];
   /**
   * Gets the ID from a string directly (returns the string in an array).
   * @see {@link https://next.semantic-ui.com/api/reactivity/collection-helpers#getids getIDs}
   * @param item - string to get ID from
   * @returns Array containing the input string.
   */
   getIDs(item: string): [string];

   /**
   * Gets the first available ID from an object.
   * Checks for properties in order: `_id`, `id`, `hash`, `key`.
   * @see {@link https://next.semantic-ui.com/api/reactivity/collection-helpers#getid getID}
   * @param item - Object to get ID from
   * @returns The first available ID found, or undefined if no ID property is present.
   */
   getID(item: { _id?: string; id?: string; hash?: string; key?: string }): string | undefined;
   /**
   * Gets the ID from a string directly (returns the string).
   * @see {@link https://next.semantic-ui.com/api/reactivity/collection-helpers#getid getID}
   * @param item - string to get ID from
   * @returns The input string as the ID.
   */
   getID(item: string): string;

   /**
   * Checks if an object or string has a specific ID.
   * @see {@link https://next.semantic-ui.com/api/reactivity/collection-helpers#hasid hasID}
   * @param item - Object or string to check
   * @param id - ID to look for
   * @returns `true` if the object or string's ID matches the provided `id`, `false` otherwise.
   */
   hasID(item: { _id?: string; id?: string; hash?: string; key?: string } | string, id: string): boolean;

   /**
   * Gets the index of an object with the specified ID within the Signal's array value.
   * Assumes the Signal's value is an array of objects.
   * @see {@link https://next.semantic-ui.com/api/reactivity/collection-helpers#getitem getItem}
   * @param id - ID to look for
   * @returns Index of the matching object in the array, or -1 if not found.
   */
   getItem(id: string): number;

   /**
   * Sets a property on an object with the specified ID within the Signal's array value.
   * Assumes the Signal's value is an array of objects.
   * @see {@link https://next.semantic-ui.com/api/reactivity/collection-helpers#setproperty setProperty}
   * @param id - ID of object to modify
   * @param property - Property name
   * @param value - Value to set
   */
   setProperty<U extends Record<string, any>[]>(
    this: Signal<U>,
    id: string,
    property: keyof U[number],
    value: U[number][keyof U[number]]
   ): void;

   /**
   * Sets a property directly on the Signal's value (if it's an object).
   * Assumes the Signal's value is an object.
   * @see {@link https://next.semantic-ui.com/api/reactivity/collection-helpers#setproperty setProperty}
   * @param property - Property name
   * @param value - Value to set
   */
   setProperty<K extends keyof T>(property: K, value: T[K]): void;

   /**
   * Replaces an object with the specified ID in the Signal's array value.
   * Assumes the Signal's value is an array of objects.
   * @see {@link https://next.semantic-ui.com/api/reactivity/collection-helpers#replaceitem replaceItem}
   * @param id - ID of object to replace
   * @param item - New object to insert
   */
   replaceItem<U extends any[]>(this: Signal<U>, id: string, item: U[number]): void;

   /**
   * Removes an object with the specified ID from the Signal's array value.
   * Assumes the Signal's value is an array of objects.
   * @see {@link https://next.semantic-ui.com/api/reactivity/collection-helpers#removeitem removeItem}
   * @param id - ID of object to remove
   */
   removeItem(id: string): void;

   // Array transformation methods (only available when T is or extends any[])
   // These methods transform the array value of the Signal and update the Signal with the new array.
   // Note: These methods modify the Signal's value in place.
   /**
   * Transforms each element in the array using the provided mapping function.
   * This method is only available when `T` is or extends `any[]`.
   * Note: This method modifies the Signal's value in place.
   * @see {@link https://next.semantic-ui.com/api/reactivity/array-helpers#map map}
   * @param callback - Function to transform each element
   */
   map<U extends any[], V>(this: Signal<U>, callback: (value: U[number], index: number, array: U) => V): void;

   /**
   * Filters the array to only include elements that pass the test.
   * This method is only available when `T` is or extends `any[]`.
   * Note: This method modifies the Signal's value in place.
   * @see {@link https://next.semantic-ui.com/api/reactivity/array-helpers#filter filter}
   * @param predicate - Function to test each element
   */
   filter<U extends any[]>(this: Signal<U>, predicate: (value: U[number], index: number, array: U) => boolean): void;
}
