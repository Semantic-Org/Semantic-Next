/**
 * Recheck: does chained this.method() return type resolve?
 * Earlier test used `M extends Record<string, (...args: any[]) => any>`
 * Current solution uses `M extends Record<string, any>`
 * The constraint matters!
 */

// VERSION A: M extends Record<string, (...args: any[]) => any> — strict constraint
declare function test_strict<M extends Record<string, (...args: any[]) => any>>(
  options: { create: () => M & ThisType<M> }
): void;

test_strict({
  create() {
    return {
      a() { return 42; },
      b() { return this.a(); },
      test() {
        const x = this.b();
        const wrong: string = x;  // error if x is number, no error if any
      },
    };
  },
});

// VERSION B: M extends Record<string, any> — loose constraint
declare function test_loose<M extends Record<string, any>>(
  options: { create: () => M & ThisType<M> }
): void;

test_loose({
  create() {
    return {
      a() { return 42; },
      b() { return this.a(); },
      test() {
        const x = this.b();
        const wrong: string = x;  // error if x is number, no error if any
      },
    };
  },
});

// VERSION C: M extends object
declare function test_object<M extends object>(
  options: { create: () => M & ThisType<M> }
): void;

test_object({
  create() {
    return {
      a() { return 42; },
      b() { return this.a(); },
      test() {
        const x = this.b();
        const wrong: string = x;  // error if x is number, no error if any
      },
    };
  },
});

// VERSION D: M unconstrained
declare function test_uncon<M>(
  options: { create: () => M & ThisType<M> }
): void;

test_uncon({
  create() {
    return {
      a() { return 42; },
      b() { return this.a(); },
      test() {
        const x = this.b();
        const wrong: string = x;
      },
    };
  },
});
