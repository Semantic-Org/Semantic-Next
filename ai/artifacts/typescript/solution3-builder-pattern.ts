/**
 * SOLUTION 3: BUILDER PATTERN APPROACH
 *
 * CONCEPT:
 * Use a fluent builder API to incrementally construct the type information.
 * This separates type declaration from usage, potentially allowing TypeScript
 * to resolve types in stages rather than all at once.
 *
 * THEORY:
 * Builder patterns work well in TypeScript for complex type construction
 * because each step in the chain can add type information progressively.
 * The idea is to build up TState and TSettings types first, then apply
 * them to the component factory.
 *
 * THE PROBLEM:
 * Even with progressive type building, the fundamental circular reference
 * issue remains when we reach the `.create()` step. The builder successfully
 * constructs the state/settings types, but still cannot resolve the
 * self-referential component return type.
 *
 * Additionally, TypeScript's generic constraint system becomes confused
 * with the chained generic types in the builder pattern.
 *
 * RESULT: FAILED - Generic constraint errors + `self` still unknown
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
 * Builder Pattern Implementation
 *
 * The idea: Chain method calls to progressively build up type information:
 * component().withState<MyState>().withSettings<MySettings>().create(factory)
 *
 * Each step adds more type information while maintaining the chain.
 */
class ComponentBuilder<TState = {}, TSettings = {}> {
  /**
   * Add state type information to the builder
   * Returns a new builder with the state type constraint
   */
  withState<T extends Record<string, Signal<any>>>() {
    return new ComponentBuilder<T, TSettings>();
  }

  /**
   * Add settings type information to the builder
   * Returns a new builder with the settings type constraint
   */
  withSettings<T>() {
    return new ComponentBuilder<TState, T>();
  }

  /**
   * Create the final component factory with all type information
   *
   * At this point, we have:
   * - TState: from withState() call
   * - TSettings: from withSettings() call
   * - TReturn: should be inferred from factory function
   *
   * The circular reference problem occurs here, same as other approaches.
   */
  create<TReturn>(
    factory: (params: CallParams<TState, TSettings, TReturn>) => TReturn,
  ): (params: CallParams<TState, TSettings, TReturn>) => TReturn {
    return factory;
  }
}

/**
 * Entry point for the builder pattern
 */
function component() {
  return new ComponentBuilder();
}

/**
 * Usage with fluent API
 *
 * This looks clean and should theoretically provide good type safety
 * at each step of the chain.
 */
const createComponent = component()
  .withState<TestState>() // ✅ State type is captured
  .withSettings<TestSettings>() // ✅ Settings type is captured
  .create(({ self, state, settings }) => ({ // ❌ self inference still fails
    toggle() {
      // ✅ These work - state and settings are properly typed
      state.isOpen.set(!state.isOpen.get());
      state.count.increment();
      const theme = settings.theme; // Type: 'light' | 'dark'
      const size = settings.size; // Type: 'small' | 'large'

      // ❌ These fail - self is still unknown
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
 * 1. BUILDER SUCCESS BUT INFERENCE FAILURE:
 *    The builder pattern successfully captures and chains the TState and
 *    TSettings types. The failure occurs at the final `.create()` step,
 *    which faces the same circular reference problem as other approaches.
 *
 * 2. GENERIC CONSTRAINT PROPAGATION:
 *    TypeScript struggles to propagate the generic constraints through
 *    the builder chain. The constraint `T extends Record<string, Signal<any>>`
 *    gets lost or confused as it passes through multiple generic contexts.
 *
 * 3. TIMING STILL MATTERS:
 *    Even though we build types progressively, TypeScript still needs to
 *    resolve the final TReturn type when analyzing the factory function body.
 *    The circular reference happens at this resolution step, regardless of
 *    how the types were constructed leading up to it.
 *
 * 4. CHAIN COMPLEXITY:
 *    The multiple generic transformations in the builder chain can confuse
 *    TypeScript's inference engine, leading to broader type fallbacks.
 */

/**
 * BUILDER PATTERN BENEFITS (that we do get):
 *
 * ✅ Clean, discoverable API
 * ✅ Progressive type building
 * ✅ Good IDE autocomplete for the chain itself
 * ✅ Separation of concerns (state vs settings vs component)
 *
 * But the fundamental problem remains unresolved.
 */

/**
 * ALTERNATIVE BUILDER APPROACHES TRIED:
 *
 * 1. Separate builders for each type component
 * 2. Functional composition instead of class methods
 * 3. Immutable builder pattern with frozen steps
 * 4. Builder with explicit type witnesses
 *
 * All face the same core issue at the final component creation step.
 */

/**
 * POTENTIAL FUTURE SOLUTIONS:
 *
 * The builder pattern provides a good foundation for potential solutions:
 *
 * 1. CODE GENERATION:
 *    Generate the final typed component from the builder configuration
 *
 * 2. TEMPLATE METAPROGRAMMING:
 *    Use template literal types to build the component signature
 *
 * 3. COMPILER PLUGINS:
 *    Transform the builder chain at compile time to explicit types
 *
 * The builder pattern itself is sound - the issue is in TypeScript's
 * ability to resolve circular references in function inference.
 */

export { component, ComponentBuilder, createComponent, type TestSettings, type TestState };
