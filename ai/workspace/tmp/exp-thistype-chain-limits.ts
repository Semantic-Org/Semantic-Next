/**
 * Document the exact limitation: chained this.method() return types.
 */

interface Signal<T> { get(): T; set(value: T): void; value: T; }
interface Query { addClass(cls: string): Query; }
type WrapState<T> = { [K in keyof T]: Signal<T[K]> };
type FactoryParams<St extends Record<string, any> = Record<string, any>, S extends Record<string, any> = Record<string, any>> =
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

// LIMITATION 1: When method A returns this.methodB(), the return type is `any`
defineComponent({
  createComponent() {
    return {
      getNumber() { return 42; },
      // getWrapped() returns this.getNumber() — TS can't resolve the return type
      getWrapped() { return this.getNumber(); },
      test() {
        // Direct: return type is known
        const a: number = this.getNumber();

        // Chained: return type is any (not number)
        const b = this.getWrapped();
        // These would both compile because b is `any`:
        const asNum: number = b;   // no error (b is any)
        const asStr: string = b;   // no error (b is any)
      },
    };
  },
});

// WORKAROUND: Explicit return type annotation
defineComponent({
  createComponent() {
    return {
      getNumber() { return 42; },
      // With explicit return type, chaining works:
      getWrapped(): number { return this.getNumber(); },
      test() {
        const b: number = this.getWrapped();  // typed!
        // @ts-expect-error — now properly checked
        const bad: string = this.getWrapped();
      },
    };
  },
});

// GOOD NEWS: Methods that DON'T chain through this have correct types
defineComponent({
  createComponent() {
    return {
      getUser() { return { name: 'Alice', age: 30 }; },
      test() {
        const user = this.getUser();
        const name: string = user.name;
        const age: number = user.age;
        // @ts-expect-error
        const bad: number = user.name;
      },
    };
  },
});

// GOOD NEWS: Calling this.method() for side effects is always typed
defineComponent({
  createComponent() {
    return {
      increment(by: number) { /* ... */ },
      decrement(by: number) { /* ... */ },
      reset() {
        this.increment(0);   // params are checked
        this.decrement(0);   // params are checked
        // @ts-expect-error — wrong param type
        this.increment('bad');
      },
    };
  },
});
