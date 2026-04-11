/**
 * Comprehensive chain test with M extends Record<string, any>
 */

type WrapState<T> = { [K in keyof T]: { get(): T[K]; set(v: T[K]): void; } };
type FactoryParams<St extends Record<string, any>, S extends Record<string, any>> =
  { settings: S; state: WrapState<St>; el: HTMLElement; };

declare function defineComponent<
  M extends Record<string, any> = Record<string, any>,
  S extends Record<string, any> = Record<string, any>,
  St extends Record<string, any> = Record<string, any>,
>(options: {
  defaultSettings?: S;
  defaultState?: St;
  createComponent?: (params: FactoryParams<St, S>) => M & ThisType<M & FactoryParams<St, S>>;
}): any;

// Test 1: Single chain — b() returns this.a()
defineComponent({
  createComponent() {
    return {
      a() { return 42; },
      b() { return this.a(); },
      test() {
        const x: number = this.b();  // should be number
        // @ts-expect-error
        const bad: string = this.b();
      },
    };
  },
});

// Test 2: Double chain — c() returns this.b() which returns this.a()
defineComponent({
  createComponent() {
    return {
      a() { return 42; },
      b() { return this.a(); },
      c() { return this.b(); },
      test() {
        const x: number = this.c();
        // @ts-expect-error
        const bad: string = this.c();
      },
    };
  },
});

// Test 3: Chain with computation
defineComponent({
  createComponent() {
    return {
      getCount() { return 42; },
      doubled() { return this.getCount() * 2; },
      test() {
        const x: number = this.doubled();
        // @ts-expect-error
        const bad: string = this.doubled();
      },
    };
  },
});

// Test 4: Chain returns object
defineComponent({
  createComponent() {
    return {
      getUser() { return { name: 'Alice', age: 30 }; },
      getUserName() { return this.getUser().name; },
      test() {
        const name: string = this.getUserName();
        // @ts-expect-error
        const bad: number = this.getUserName();
      },
    };
  },
});

// Test 5: Chain with string concat
defineComponent({
  createComponent() {
    return {
      getLabel() { return 'hello'; },
      getDisplay() { return `${this.getLabel()} world`; },
      test() {
        const s: string = this.getDisplay();
        // @ts-expect-error
        const bad: number = this.getDisplay();
      },
    };
  },
});
