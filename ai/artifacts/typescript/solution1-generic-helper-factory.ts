/**
 * SOLUTION 1: GENERIC HELPER FACTORY APPROACH
 *
 * CONCEPT:
 * Create a factory function that captures state/settings types upfront,
 * then returns a wrapper function that should infer the component return type.
 *
 * THEORY:
 * By separating the state/settings generics from the component return type,
 * we hoped TypeScript could infer TReturn from the factory function usage
 * and properly type the `self` parameter.
 *
 * THE PROBLEM:
 * The circular reference issue still exists. When TypeScript encounters
 * `self.hide()` inside the factory function, it doesn't know what `self`
 * contains because `self` should contain the return value of this same function.
 *
 * TypeScript inference flow:
 * 1. Sees factory function signature: (params: CallParams<TState, TSettings, TReturn>) => TReturn
 * 2. Tries to infer TReturn from function body
 * 3. Encounters `self.hide()` - needs to know what methods exist on `self`
 * 4. But `self` type depends on TReturn, which it's currently trying to infer
 * 5. Gives up and infers TReturn as `unknown`
 *
 * RESULT: FAILED - `self` becomes `unknown`, no autocomplete or type safety
 */

import { Signal } from '@semantic-ui/reactivity';
import { CallParams } from '@semantic-ui/templating';

// Example types for testing
type TestState = {
  isOpen: Signal<boolean>;
  count: Signal<number>;
  [key: string]: Signal<any>; // Required by CallParams constraint
};

interface TestSettings {
  theme: 'light' | 'dark';
  size: 'small' | 'large';
}

/**
 * Generic Helper Factory Function
 *
 * The idea: Capture TState and TSettings generics first, then return
 * a function that can infer TReturn from usage.
 */
function createTypedComponent<
  TState extends Record<string, Signal<any>>,
  TSettings extends Record<string, any>,
>() {
  return function<TReturn>(
    factory: (params: CallParams<TState, TSettings, TReturn>) => TReturn,
  ): (params: CallParams<TState, TSettings, TReturn>) => TReturn {
    // Return the factory function with proper typing
    // This should theoretically allow TypeScript to infer TReturn
    return factory;
  };
}

// Usage example
const createMyComponent = createTypedComponent<TestState, TestSettings>();

/**
 * The critical test: Can TypeScript infer the return type and properly type `self`?
 *
 * Expected behavior:
 * - state.isOpen.set() should be typed (Signal<boolean>)
 * - settings.theme should be typed ('light' | 'dark')
 * - self.hide() should be typed (method exists on return object)
 *
 * Actual behavior:
 * - state and settings work fine
 * - self is inferred as `unknown` - TypeScript gives up on circular inference
 */
const createComponent = createMyComponent(({ self, state, settings }) => ({
  toggle() {
    // ✅ These work - TypeScript knows state and settings types
    state.isOpen.set(!state.isOpen.get());
    state.count.increment();
    const theme = settings.theme;
    const size = settings.size;

    // ❌ These fail - self is `unknown`
    // TypeScript error: Property 'hide' does not exist on type 'unknown'
    self.hide();
    self.show();
  },

  hide() {
    state.isOpen.set(false);
  },

  show() {
    state.isOpen.set(true);
  },
}));

/**
 * WHY THIS FAILS:
 *
 * TypeScript's type inference works in passes:
 * 1. First pass: Collect type constraints and explicit annotations
 * 2. Second pass: Infer types from usage patterns
 * 3. Third pass: Verify all types are consistent
 *
 * The problem occurs in pass 2. When TypeScript tries to infer TReturn,
 * it analyzes the function body. It sees `self.hide()` and thinks:
 * "I need to know what methods exist on `self` to type-check this call"
 *
 * But `self` has type TReturn, which is exactly what it's trying to infer!
 * This creates a circular dependency that TypeScript cannot resolve.
 *
 * The inference engine falls back to `unknown` as a safe default,
 * losing all type information for `self`.
 */

/**
 * POTENTIAL VARIATIONS THAT ALSO FAIL:
 *
 * 1. Different constraint orderings
 * 2. Intermediate type aliases
 * 3. Conditional types
 * 4. Mapped types over the return value
 *
 * All suffer from the same fundamental circular reference problem.
 */

export { createComponent, createTypedComponent, type TestSettings, type TestState };
