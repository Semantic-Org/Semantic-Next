/**
 * Deep dive: exactly what return type info do we get from this.method()?
 */

declare function defineComponent<
  M extends Record<string, (...args: any[]) => any>,
>(options: {
  createComponent?: () => M & ThisType<M>;
}): any;

// Scenario A: Direct call — does return type resolve?
defineComponent({
  createComponent() {
    return {
      getNumber() { return 42; },
      getString() { return 'hello'; },
      test() {
        // These should be `any` because TS sees M's methods as (...args: any[]) => any
        const a = this.getNumber();   // what type is a?
        const b = this.getString();   // what type is b?

        // Test: can we use a as number? (if any, this works with no error)
        const n: number = a;
        const s: string = b;

        // Test: can we also assign them to wrong types? (if any, also no error)
        const wrongN: string = a;  // If no error, a is any
        const wrongS: number = b;  // If no error, b is any
      },
    };
  },
});

// Scenario B: Does `this` at least know method NAMES?
defineComponent({
  createComponent() {
    return {
      foo() { return 1; },
      bar(x: string) { return x; },
      test() {
        this.foo();        // method exists — should work
        this.bar('hello'); // method exists — should work
        // @ts-expect-error — method doesn't exist
        this.baz();
      },
    };
  },
});

// Scenario C: Are parameter types preserved?
defineComponent({
  createComponent() {
    return {
      greet(name: string, times: number) { return name.repeat(times); },
      test() {
        this.greet('hello', 3);  // correct params — should work
        // @ts-expect-error — wrong param type
        this.greet(123, 3);
      },
    };
  },
});
