/**
 * Investigate: do return types flow through this-method calls?
 */

declare function defineComponent<
  M extends Record<string, (...args: any[]) => any>,
>(options: {
  createComponent?: () => M & ThisType<M>;
}): any;

// Test: direct method call return type
defineComponent({
  createComponent() {
    return {
      getNumber() { return 42; },
      test() {
        const x = this.getNumber();
        // What is x? Let's test:
        // @ts-expect-error — if x is number, assigning to string errors
        const s: string = x;
      },
    };
  },
});

// Test: chained return
defineComponent({
  createComponent() {
    return {
      a() { return 42; },
      b() { return this.a(); },
      test() {
        const x = this.b();
        // @ts-expect-error — if properly typed, x is number
        const s: string = x;
      },
    };
  },
});

// Test: object return
defineComponent({
  createComponent() {
    return {
      getUser() { return { name: 'Alice', age: 30 }; },
      test() {
        const user = this.getUser();
        // @ts-expect-error
        const bad: number = user.name;
      },
    };
  },
});
