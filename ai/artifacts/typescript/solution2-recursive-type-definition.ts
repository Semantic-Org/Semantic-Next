/**
 * SOLUTION 2: RECURSIVE TYPE DEFINITION APPROACH
 *
 * CONCEPT:
 * Define explicit recursive types that reference themselves, attempting
 * to break the circular dependency by making it explicit in the type system.
 *
 * THEORY:
 * If we explicitly model the circular relationship in types, TypeScript
 * might be able to resolve the self-reference. Similar to how recursive
 * data structures (linked lists, trees) are typed.
 *
 * THE PROBLEM:
 * While TypeScript supports recursive types for data structures, it struggles
 * with recursive function types where the parameter type depends on the
 * return type within the same function definition.
 *
 * Additionally, the generic constraint system doesn't play well with
 * recursive references - we get constraint satisfaction errors.
 *
 * RESULT: FAILED - Constraint errors + `self` still unknown
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
 * Recursive Type Definition Approach
 *
 * The idea: Explicitly model the circular relationship where:
 * - ComponentFactory takes a TSelf parameter
 * - TSelf represents the return type of the factory
 * - The factory function returns TSelf
 *
 * This should theoretically allow TypeScript to understand the self-reference.
 */
type ComponentFactory<TState, TSettings, TSelf> = (params: CallParams<TState, TSettings, TSelf>) => TSelf;

/**
 * Helper type to create the factory function
 * Uses a mapped approach to avoid direct constraint issues
 */
type CreateComponent<TState, TSettings> = <TSelf>(
  factory: ComponentFactory<TState, TSettings, TSelf>,
) => ComponentFactory<TState, TSettings, TSelf>;

/**
 * Factory creator with explicit constraints
 *
 * The constraint on TState causes issues - TypeScript can't verify
 * that the generic TState satisfies Record<string, Signal<any>> when
 * used in recursive contexts.
 */
const createComponentFactory = <
  TState extends Record<string, Signal<any>>,
  TSettings,
>(): CreateComponent<TState, TSettings> => {
  return <TSelf>(factory: ComponentFactory<TState, TSettings, TSelf>) => {
    // Return the factory unchanged - just typed properly
    return factory;
  };
};

// Usage attempt
const createMyComponent = createComponentFactory<TestState, TestSettings>();

/**
 * The test: Does explicit recursive typing help TypeScript infer `self`?
 *
 * Expected: TypeScript should understand that TSelf is the return type
 * and properly type the `self` parameter.
 *
 * Actual: Still fails with the same circular inference issue.
 */
const createComponent = createMyComponent(({ self, state, settings }) => ({
  toggle() {
    // ✅ These work - state and settings are properly typed
    state.isOpen.set(!state.isOpen.get());
    state.count.increment();
    const theme = settings.theme;
    const size = settings.size;

    // ❌ These still fail - self remains unknown
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
 * 1. CONSTRAINT PROPAGATION ISSUES:
 *    The generic constraint `TState extends Record<string, Signal<any>>`
 *    doesn't propagate properly through the recursive type definitions.
 *    TypeScript loses track of the constraint in complex generic scenarios.
 *
 * 2. INFERENCE VS DECLARATION:
 *    While we can *declare* recursive types, TypeScript's inference engine
 *    still struggles with *inferring* recursive relationships during
 *    function analysis.
 *
 * 3. TIMING OF TYPE RESOLUTION:
 *    TypeScript resolves types in phases:
 *    - Phase 1: Parse type annotations and constraints
 *    - Phase 2: Infer types from expressions
 *    - Phase 3: Check type compatibility
 *
 *    The problem occurs in Phase 2. Even with explicit recursive types,
 *    the inference engine encounters the same circular dependency when
 *    analyzing `self.hide()` calls within the function body.
 *
 * 4. GENERIC CONTEXT LOSS:
 *    In recursive scenarios, TypeScript sometimes loses the generic context
 *    and falls back to broader types (`unknown`) rather than maintaining
 *    the specific generic relationships.
 */

/**
 * ALTERNATIVE RECURSIVE APPROACHES THAT ALSO FAIL:
 *
 * 1. Mutual recursion between types
 * 2. Conditional recursive types
 * 3. Template literal types with recursion
 * 4. Intersection types with recursive components
 *
 * All encounter similar issues where the recursive reference cannot be
 * resolved during type inference within function bodies.
 */

/**
 * LESSONS LEARNED:
 *
 * Recursive types work well for data structures where the recursion is
 * in the *structure* (e.g., Node<T> = { value: T, next: Node<T> | null }).
 *
 * They fail for *behavioral* recursion where a function parameter type
 * depends on what the function returns, especially when that dependency
 * occurs within the function's implementation.
 */

export {
  type ComponentFactory,
  type CreateComponent,
  createComponent,
  createComponentFactory,
  type TestSettings,
  type TestState,
};
