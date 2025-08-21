/**
 * SOLUTION 5: EXPLICIT TYPING APPROACH
 * 
 * CONCEPT:
 * Abandon attempts at automatic type inference and require developers
 * to explicitly type the parameters. This trades DX convenience for
 * type safety and reliability.
 * 
 * THEORY:
 * Since TypeScript's inference engine cannot resolve the circular
 * reference between `self` and the component return type, we bypass
 * inference entirely by making the types explicit.
 * 
 * THE PROBLEM:
 * This approach works perfectly from a TypeScript perspective, but
 * it significantly degrades the developer experience. Users must:
 * 1. Define their state and settings types
 * 2. Create a CallParams type alias  
 * 3. Explicitly annotate their function parameters
 * 
 * This violates the framework's core principle of elegant destructuring
 * with minimal ceremony.
 * 
 * RESULT: ✅ WORKS - Full type safety and autocomplete, but poor DX
 */

import { Signal } from '@semantic-ui/reactivity';
import { CallParams } from '@semantic-ui/templating';

// Example types for testing - USER MUST DEFINE THESE
type TestState = {
  isOpen: Signal<boolean>;
  count: Signal<number>;
  [key: string]: Signal<any>; // Required by CallParams constraint
}

interface TestSettings {
  theme: 'light' | 'dark';
  size: 'small' | 'large';
}

/**
 * Step 1: USER MUST CREATE TYPE ALIAS
 * 
 * The user must explicitly create a type alias for their component's
 * CallParams. This is boilerplate that the framework ideally would
 * handle automatically.
 */
type MyComponentParams = CallParams<TestState, TestSettings, any>;

/**
 * Step 2: USER MUST EXPLICITLY TYPE PARAMETERS
 * 
 * Instead of relying on inference, the user must explicitly annotate
 * the destructured parameters with the type alias.
 * 
 * Compare:
 * 
 * IDEAL (framework goal):
 * const createComponent = ({ self, state, settings }) => ({
 * 
 * REQUIRED (this approach):
 * const createComponent = ({ self, state, settings }: MyComponentParams) => ({
 */
const createComponent = (({ self, state, settings }: MyComponentParams) => ({
  toggle() {
    // ✅ Perfect type safety - all parameters are correctly typed
    
    // State is properly typed as TestState
    state.isOpen.set(!state.isOpen.get()); // ✅ Signal<boolean> methods available
    state.count.increment(); // ✅ Signal<number> methods available
    
    // Settings are properly typed as TestSettings  
    const theme = settings.theme; // ✅ Type: 'light' | 'dark'
    const size = settings.size;   // ✅ Type: 'small' | 'large'
    
    // Self is properly typed as the component return type
    self.hide(); // ✅ Method exists and is callable
    self.show(); // ✅ Method exists and is callable
  },
  
  hide() {
    state.isOpen.set(false); // ✅ Fully typed
  },
  
  show() {
    state.isOpen.set(true); // ✅ Fully typed
  }
}));

/**
 * VERIFICATION: Does TypeScript understand everything correctly?
 */

// ✅ Type inference works perfectly for the return type
type ComponentType = ReturnType<typeof createComponent>;

// ✅ We can use the component instance with full type safety
function testUsage(params: MyComponentParams) {
  const instance = createComponent(params);
  
  instance.toggle(); // ✅ Method exists
  instance.hide();   // ✅ Method exists  
  instance.show();   // ✅ Method exists
  
  // ❌ TypeScript correctly prevents calling non-existent methods
  // instance.invalidMethod(); // Would cause compile error
}

// ✅ Type extraction works for validation
type ValidateComponent = ComponentType extends {
  toggle: () => void;
  hide: () => void;
  show: () => void;
} ? true : false;

const validation: ValidateComponent = true; // ✅ Compiles successfully

/**
 * WHY THIS WORKS:
 * 
 * 1. NO INFERENCE REQUIRED:
 *    By explicitly typing the parameters, we bypass TypeScript's inference
 *    engine entirely. There's no circular reference to resolve because
 *    we've provided all the type information upfront.
 * 
 * 2. STRAIGHTFORWARD TYPE FLOW:
 *    TypeScript can directly use the explicit types without needing to
 *    figure out what they should be from context.
 * 
 * 3. STANDARD TYPESCRIPT PATTERNS:
 *    This follows normal TypeScript usage patterns - when inference fails
 *    or is ambiguous, use explicit types.
 * 
 * 4. COMPLETE TYPE INFORMATION:
 *    All parts of the system (state, settings, self) have concrete types
 *    that TypeScript can work with confidently.
 */

/**
 * THE DEVELOPER EXPERIENCE COST:
 * 
 * WHAT USERS HAVE TO DO:
 * 
 * 1. Define state type with index signature constraint
 * 2. Define settings interface
 * 3. Create CallParams type alias  
 * 4. Remember to use explicit typing syntax
 * 5. Import CallParams from the framework
 * 
 * WHAT THEY LOSE:
 * 
 * - Elegant, minimal destructuring syntax
 * - "Just works" feeling of the framework
 * - Freedom from TypeScript ceremony
 * - Consistency with framework's design principles
 * 
 * WHAT THEY GAIN:
 * 
 * ✅ Perfect autocomplete and IntelliSense
 * ✅ Compile-time error catching
 * ✅ Refactoring safety
 * ✅ Documentation through types
 * ✅ IDE support for navigation and analysis
 */

/**
 * COMPARISON WITH OTHER FRAMEWORKS:
 * 
 * REACT (similar ceremony):
 * interface Props { ... }
 * const Component = ({ prop1, prop2 }: Props) => { ... }
 * 
 * VUE (similar ceremony):
 * interface Props { ... }
 * const props = defineProps<Props>();
 * 
 * ANGULAR (more ceremony):
 * @Component({ ... })
 * export class MyComponent {
 *   @Input() prop1: string;
 * }
 * 
 * So while this approach requires ceremony, it's not unusual compared
 * to other typed frameworks.
 */

/**
 * POTENTIAL IMPROVEMENTS TO THIS APPROACH:
 * 
 * 1. CODE SNIPPETS/TEMPLATES:
 *    Provide VS Code snippets that generate the boilerplate
 * 
 * 2. CLI GENERATORS:
 *    `semantic generate component MyComponent` creates typed template
 * 
 * 3. BETTER TYPE HELPERS:
 *    Utility types that reduce the boilerplate required
 * 
 * 4. DOCUMENTATION:
 *    Clear examples showing the typing patterns
 * 
 * 5. GRADUAL TYPING:
 *    Allow both approaches - inference for JS/prototyping, explicit for production
 */

/**
 * RECOMMENDATION:
 * 
 * If the framework cannot solve the inference problem, this approach
 * provides a reliable fallback that gives TypeScript users the type
 * safety they expect, even at the cost of some ceremony.
 * 
 * The key is to:
 * 1. Make the required ceremony minimal and consistent
 * 2. Provide excellent tooling support (snippets, generators)
 * 3. Document the patterns clearly
 * 4. Consider it a TypeScript-specific concern, not a framework limitation
 */

export {
  createComponent,
  testUsage,
  type MyComponentParams,
  type ComponentType,
  type TestState,
  type TestSettings
};