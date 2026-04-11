/**
 * Adversarial tests for the ThisType<M> approach.
 * These test edge cases and tricky scenarios.
 */

interface Signal<T> {
  get(): T;
  set(value: T): void;
  value: T;
}

interface CallParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
> {
  settings: TSettings;
  state: { [K in keyof TState]: Signal<TState[K]> };
  el: HTMLElement;
}

declare function defineComponent<
  M extends Record<string, (...args: any[]) => any>,
  S extends Record<string, any> = {},
  St extends Record<string, any> = {},
>(options: {
  defaultSettings?: S;
  defaultState?: St;
  createComponent?: (params: CallParams<St, S>) => M & ThisType<M & CallParams<St, S>>;
  events?: Record<string, (this: M, params: CallParams<St, S> & { event: Event; value: any }) => void>;
  onCreated?: (this: M, params: CallParams<St, S>) => void;
}): any;


// ============================================================
// ADVERSARIAL 1: Deep method chaining via this
// ============================================================
defineComponent({
  createComponent() {
    return {
      a() { return 1; },
      b() { return this.a() + 1; },
      c() { return this.b() + 1; },
      d() { return this.c() + 1; },
      check() {
        const n: number = this.d();
        // @ts-expect-error
        const s: string = this.d();
      },
    };
  },
});


// ============================================================
// ADVERSARIAL 2: Method with complex return types
// ============================================================
defineComponent({
  createComponent() {
    return {
      getUser() { return { name: 'Alice', age: 30 }; },
      getUserName() { return this.getUser().name; },
      test() {
        const name: string = this.getUserName();
        // @ts-expect-error — getUserName returns string not number
        const bad: number = this.getUserName();
      },
    };
  },
});


// ============================================================
// ADVERSARIAL 3: Method that takes callback with this-typed methods
// ============================================================
defineComponent({
  createComponent() {
    return {
      getValue() { return 42; },
      withValue(cb: (v: number) => void) {
        cb(this.getValue());
      },
      test() {
        this.withValue((v) => {
          const n: number = v;
          // @ts-expect-error
          const s: string = v;
        });
      },
    };
  },
});


// ============================================================
// ADVERSARIAL 4: Optional method parameters
// ============================================================
defineComponent({
  createComponent() {
    return {
      format(value: number, prefix?: string) {
        return prefix ? `${prefix}: ${value}` : `${value}`;
      },
      test() {
        this.format(42);
        this.format(42, 'count');
        // @ts-expect-error — first param is number
        this.format('not a number');
      },
    };
  },
});


// ============================================================
// ADVERSARIAL 5: Events with different event signatures
// ============================================================
defineComponent({
  defaultSettings: { items: ['a', 'b', 'c'] },

  createComponent({ settings }) {
    return {
      selectItem(index: number) { return settings.items[index]; },
      clearSelection() { },
    };
  },

  events: {
    'click .item'({ event }) {
      this.selectItem(0);
      // @ts-expect-error — selectItem needs number
      this.selectItem('not a number');
    },
    'click .clear'() {
      this.clearSelection();
      // @ts-expect-error
      this.nonExistent();
    },
  },
});


// ============================================================
// ADVERSARIAL 6: Methods returning promises
// ============================================================
defineComponent({
  createComponent() {
    return {
      async fetchData() { return { data: [1, 2, 3] }; },
      async processData() {
        const result = await this.fetchData();
        const data: number[] = result.data;
        return data.map(x => x * 2);
      },
    };
  },
});


// ============================================================
// ADVERSARIAL 7: No methods (empty return) — should not break
// ============================================================
defineComponent({
  defaultSettings: { label: 'empty' },
  createComponent({ settings }) {
    const l: string = settings.label;
    return {};
  },
});


// ============================================================
// ADVERSARIAL 8: Only onCreated, no createComponent
// ============================================================
defineComponent({
  defaultSettings: { label: 'hello' },
  // No createComponent — M should default to something
  onCreated({ settings }) {
    const l: string = settings.label;
    // @ts-expect-error — no methods defined, this should be empty-ish
    this.nonExistent();
  },
});


// ============================================================
// ADVERSARIAL 9: Generic-ish method (method with its own generic)
// ============================================================
defineComponent({
  createComponent() {
    return {
      identity<T>(x: T) { return x; },
      test() {
        const n: number = this.identity(42);
        const s: string = this.identity('hello');
      },
    };
  },
});


// ============================================================
// ADVERSARIAL 10: Accessing settings via `this` (ThisType union)
// ============================================================
defineComponent({
  defaultSettings: { color: 'red', size: 42 },
  defaultState: { active: true },

  createComponent({ settings, state }) {
    return {
      getInfo() {
        // Access via closure (normal):
        const c1: string = settings.color;
        // Access via this (ThisType union includes CallParams):
        const c2: string = this.settings.color;
        const s: number = this.settings.size;
        const a: Signal<boolean> = this.state.active;
        return { color: c1, size: s };
      },
    };
  },
});


// ============================================================
// NEGATIVE CONTROL: Prove that `self` as param is still broken
// ============================================================
declare function defineComponent_withSelf<
  M extends Record<string, (...args: any[]) => any>,
>(options: {
  createComponent: (params: { self: M }) => M;
}): any;

defineComponent_withSelf({
  createComponent({ self }) {
    return {
      foo() { return 1; },
      test() {
        // If self is properly typed, this.nonExistent would error.
        // But with circular inference, M likely widens to the constraint,
        // making self.anythingGoes() legal.
        self.anythingGoes();  // NO error expected — self is wide
        self.foo();           // works but returns any
      },
    };
  },
});
