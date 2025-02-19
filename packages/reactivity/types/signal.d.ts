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
