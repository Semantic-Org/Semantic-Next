/**
 * Verify: does ThisType<M> properly type `this` when M is inferred?
 */

// TEST A: explicit types — baseline
declare function test_a(factory: () => { foo(): number } & ThisType<{ foo(): number }>): void;
test_a(() => ({
  foo() { return 1; },
  bar() {
    const n: number = this.foo();  // should work — this is typed
    // @ts-expect-error — nonExistent should not exist
    this.nonExistent();
    return n;
  },
}));

// TEST B: generic M — the critical test
declare function test_b<M extends Record<string, (...args: any[]) => any>>(
  factory: () => M & ThisType<M>
): void;

test_b(() => ({
  foo() { return 1; },
  bar() {
    // If this errors, then `this` is typed and this.foo() doesn't exist or is wrong
    // If this doesn't error, this could be `any` (not typed) or correctly typed
    this.foo();
    return 1;
  },
}));

// TEST B2: Try calling definitely-wrong method — if no error, this is `any`
test_b(() => ({
  foo() { return 1; },
  bar() {
    this.definitelyDoesNotExist();  // If no error: this is `any`
    return 1;
  },
}));

// TEST B3: Try assigning to wrong type
test_b(() => ({
  foo() { return 1; },
  bar() {
    const s: string = this.foo();  // foo returns number, should error if typed
    return 1;
  },
}));
