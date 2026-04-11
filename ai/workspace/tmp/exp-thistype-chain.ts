/**
 * Isolate the chaining issue: why does this.b() lose type when b() calls this.a()?
 */

declare function defineComponent<
  M extends Record<string, (...args: any[]) => any>,
>(options: {
  createComponent?: () => M & ThisType<M>;
}): any;

// Test 1: b() calls this.a() — what is b's return type to external callers?
defineComponent({
  createComponent() {
    return {
      a() { return 42; },
      b() { return this.a(); },
      test() {
        const x = this.b();
        // Is x typed?
        const wrong: string = x;  // error if x is number, no error if x is any
      },
    };
  },
});

// Test 2: b() calls this.a() but annotates return type explicitly
defineComponent({
  createComponent() {
    return {
      a() { return 42; },
      b(): number { return this.a(); },
      test() {
        const x = this.b();
        // @ts-expect-error — x should be number
        const wrong: string = x;
      },
    };
  },
});

// Test 3: What about a method that references this but doesn't return it?
defineComponent({
  createComponent() {
    return {
      count: 0 as number,
      a() { return 42; },
      b() {
        this.a(); // call but don't return
        return 'hello';
      },
      test() {
        const x = this.b();
        // @ts-expect-error — x should be string if b's own return is tracked
        const wrong: number = x;
      },
    };
  },
});
