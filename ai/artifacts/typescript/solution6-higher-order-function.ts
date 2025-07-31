/**
 * SOLUTION 10: EXPLICIT GENERIC WITH 'THIS' CONTEXT
 *
 * This file combines the working 'this' context pattern with an explicit
 * generic type argument. This bypasses the final inference hurdle that
 * caused previous attempts to fail silently.
 *
 * This should be the definitive, working solution.
 */

// A single generic function that takes a factory.
// The key change: The caller will provide `TMethods` explicitly.
function createFactory<TMethods extends Record<string, () => void>>(
    factory: (this: TMethods) => TMethods
): () => TMethods {
    return () => {
        const instance = {} as TMethods;
        const impl = factory.call(instance);
        return Object.assign(instance, impl);
    };
}

// Define the component's interface upfront.
// This is the explicit type information we are providing.
interface MyComponentMethods {
    foo(): void;
    bar(): void;
}

// Use the factory, but pass the interface as an explicit generic argument.
const createInstance = createFactory<MyComponentMethods>(function() {
    // `this` is now correctly and strictly typed as MyComponentMethods.
    return {
        foo() {
            console.log('foo');
        },
        bar() {
            this.foo();
        },
    };
});

// Create an instance and test its type.
const myInstance = createInstance();

// This call should be valid.
myInstance.bar();

// THIS LINE MUST NOW PRODUCE THE EXPECTED COMPILE-TIME ERROR
myInstance.invalidMethod();
