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
}
