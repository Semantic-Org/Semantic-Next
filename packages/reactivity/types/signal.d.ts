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
 */
export class Signal<T> {
  /**
   * Creates a new Signal with an initial value
   * @param initialValue - The initial value to store in the signal
   * @param options - Configuration options for the signal's behavior
   */
  constructor(initialValue: T, options?: SignalOptions<T>);
  /**
   * Creates a new Signal without an initial value
   */
  constructor();

  /**
   * Gets the current value, establishing a reactive dependency
   */
  get value(): T;

  /**
   * Sets a new value, triggering updates if the value has changed
   */
  set value(newValue: T);

  /**
   * Gets the current value and establishes a reactive dependency
   */
  get(): T;

  /**
   * Sets a new value and triggers updates if the value has changed
   * @param newValue - The new value to set
   */
  set(newValue: T): void;

  /**
   * Returns the current value without establishing a reactive dependency
   */
  peek(): T;

  /**
   * Sets the signal's value to undefined
   */
  clear(): void;

  /**
   * Subscribes to changes in the signal's value
   * @param callback - Function called whenever the value changes
   * @returns A reaction object that can be used to stop the subscription
   */
  subscribe(callback: (value: T, computation: { stop: () => void }) => void): { stop: () => void };

  // Array-specific methods (only available when T extends any[])
  /**
   * Adds elements to the end of the array
   * @param items - Elements to add
   */
  push<U extends any[]>(this: Signal<U>, ...items: U[number][]): void;

  /**
   * Adds elements to the beginning of the array
   * @param items - Elements to add
   */
  unshift<U extends any[]>(this: Signal<U>, ...items: U[number][]): void;

  /**
   * Changes the contents of the array by removing or replacing existing elements
   * @param start - Index at which to start modifying the array
   * @param deleteCount - Number of elements to remove
   * @param items - Elements to insert
   */
  splice<U extends any[]>(this: Signal<U>, start: number, deleteCount?: number, ...items: U[number][]): void;

  /**
   * Gets the element at the specified index
   * @param index - Index of the element to retrieve
   */
  getIndex<U extends any[]>(this: Signal<U>, index: number): U[number];

  /**
   * Sets the element at the specified index
   * @param index - Index to set
   * @param value - Value to set at the index
   */
  setIndex<U extends any[]>(this: Signal<U>, index: number, value: U[number]): void;

  /**
   * Removes the element at the specified index
   * @param index - Index of the element to remove
   */
  removeIndex<U extends any[]>(this: Signal<U>, index: number): void;

  // Object array methods
  /**
   * Sets a property on an object in the array
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
   * Sets a property on all objects in the array
   * @param property - Property name to set on all objects
   * @param value - Value to set for the property
   */
  setArrayProperty<U extends Record<string, any>[]>(
    this: Signal<U>,
    property: keyof U[number],
    value: U[number][keyof U[number]]
  ): void;

  // Boolean methods (only available when T extends boolean)
  /**
   * Toggles a boolean value between true and false
   */
  toggle(this: Signal<boolean>): void;

  // Numeric methods (only available when T extends number)
  /**
   * Increments the numeric value
   * @param amount - Amount to increment by
   * @default 1
   */
  increment(this: Signal<number>, amount?: number): void;

  /**
   * Decrements the numeric value
   * @param amount - Amount to decrement by
   * @default 1
   */
  decrement(this: Signal<number>, amount?: number): void;

  // Date methods (only available when T extends Date)
  /**
   * Sets the value to the current date/time
   */
  now(this: Signal<Date>): void;

  // Object ID methods
  /**
   * Gets all possible ID values from an object
   * @param item - Object to get IDs from
   * @returns Array of ID values
   */
  getIDs(item: { _id?: string; id?: string; hash?: string; key?: string }): string[];
  getIDs(item: string): [string];

  /**
   * Gets the first available ID from an object
   * @param item - Object to get ID from
   * @returns The first available ID
   */
  getID(item: { _id?: string; id?: string; hash?: string; key?: string }): string | undefined;
  getID(item: string): string;

  /**
   * Checks if an object has a specific ID
   * @param item - Object to check
   * @param id - ID to look for
   */
  hasID(item: { _id?: string; id?: string; hash?: string; key?: string } | string, id: string): boolean;

  /**
   * Gets the index of an object with the specified ID
   * @param id - ID to look for
   * @returns Index of the matching object
   */
  getItem(id: string): number;

  /**
   * Sets a property on an object with the specified ID
   * @param id - ID of object to modify
   * @param property - Property name
   * @param value - Value to set
   */
  setProperty<K extends keyof T>(id: string, property: K, value: T[K]): void;
  /**
   * Sets a property on the signal's value
   * @param property - Property name
   * @param value - Value to set
   */
  setProperty<K extends keyof T>(property: K, value: T[K]): void;

  /**
   * Replaces an object with the specified ID
   * @param id - ID of object to replace
   * @param item - New object to insert
   */
  replaceItem<U extends any[]>(this: Signal<U>, id: string, item: U[number]): void;

  /**
   * Removes an object with the specified ID
   * @param id - ID of object to remove
   */
  removeItem(id: string): void;

  // Array transformation methods
  /**
   * Transforms each element in the array using the provided mapping function
   * @param callback - Function to transform each element
   */
  map<U extends any[], V>(this: Signal<U>, callback: (value: U[number], index: number, array: U) => V): void;

  /**
   * Filters the array to only include elements that pass the test
   * @param predicate - Function to test each element
   */
  filter<U extends any[]>(this: Signal<U>, predicate: (value: U[number], index: number, array: U) => boolean): void;
}
