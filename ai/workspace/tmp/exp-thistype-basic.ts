/**
 * Isolated test: Does ThisType<M> work when M is inferred from
 * the return type of a function that returns M & ThisType<M>?
 */

// TEST A: Simplest case — no generics, explicit ThisType
declare function test_a(factory: () => { foo(): number } & ThisType<{ foo(): number }>): void;
test_a(() => ({
  foo() { return 1; },
  bar() {
    const n: number = this.foo();  // should work
    // @ts-expect-error
    this.nonExistent();             // should error
    return n;
  },
}));

// TEST B: Generic M, ThisType<M> on return
declare function test_b<M extends Record<string, (...args: any[]) => any>>(
  factory: () => M & ThisType<M>
): void;

test_b(() => ({
  foo() { return 1; },
  bar() {
    this.foo();  // works?
    // @ts-expect-error — does this error?
    this.nonExistent();
    return 1;
  },
}));

// TEST C: Same but with `noImplicitThis` being key
// Let's check what `this` actually is in test B
test_b(() => ({
  check() {
    // Let's see what this is:
    const x = this;
    // Hover on x to see type
    return x;
  },
}));

// TEST D: What if we use a simple object shape, not function constraint?
declare function test_d<M>(factory: () => M & ThisType<M>): void;

test_d(() => ({
  foo() { return 1; },
  bar() {
    const n: number = this.foo();
    // @ts-expect-error
    this.nonExistent();
    return n;
  },
}));

// TEST E: What if M is constrained differently?
declare function test_e<M extends object>(factory: () => M & ThisType<M>): void;

test_e(() => ({
  foo() { return 1; },
  bar() {
    const n: number = this.foo();
    // @ts-expect-error
    this.nonExistent();
    return n;
  },
}));

// TEST F: Non-generic, just ThisType on a specific return
function test_f(): { foo(): number; bar(): number } & ThisType<{ foo(): number; bar(): number }> {
  return {
    foo() { return 1; },
    bar() {
      const n: number = this.foo();
      return n;
    },
  };
}
