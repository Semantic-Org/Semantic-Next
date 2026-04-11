/**
 * Can we relax the M constraint to allow non-function properties?
 * And does ThisType still work?
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

// V1: M extends Record<string, any> (allows non-function props)
declare function defineComponent_v1<
  M extends Record<string, any>,
  S extends Record<string, any> = {},
  St extends Record<string, any> = {},
>(options: {
  defaultSettings?: S;
  defaultState?: St;
  createComponent?: (params: CallParams<St, S>) => M & ThisType<M & CallParams<St, S>>;
  events?: Record<string, (this: M, params: CallParams<St, S> & { event: Event }) => void>;
  onCreated?: (this: M, params: CallParams<St, S>) => void;
}): any;

// Test: methods + non-function properties
defineComponent_v1({
  createComponent() {
    return {
      count: 0,
      name: 'test',
      getCount() { return this.count; },
      getName() { return this.name; },
      increment() {
        // Note: this won't actually mutate in SUI (signals), but tests type
        return this.count + 1;
      },
    };
  },
});

// Test: pure methods with relaxed constraint
defineComponent_v1({
  createComponent() {
    return {
      foo() { return 1; },
      bar(x: string) { return x.length; },
      test() {
        this.foo();
        this.bar('hello');
        // @ts-expect-error
        this.nonExistent();
      },
    };
  },
});

// Test: events still work
defineComponent_v1({
  defaultSettings: { label: 'hi' },
  createComponent({ settings }) {
    return {
      getLabel() { return settings.label; },
    };
  },
  events: {
    'click .item'() {
      this.getLabel();
      // @ts-expect-error
      this.nonExistent();
    },
  },
  onCreated() {
    this.getLabel();
    // @ts-expect-error
    this.nonExistent();
  },
});

// V2: M with no constraint at all
declare function defineComponent_v2<
  M,
  S extends Record<string, any> = {},
  St extends Record<string, any> = {},
>(options: {
  defaultSettings?: S;
  defaultState?: St;
  createComponent?: (params: CallParams<St, S>) => M & ThisType<M & CallParams<St, S>>;
  events?: Record<string, (this: M, params: CallParams<St, S> & { event: Event }) => void>;
  onCreated?: (this: M, params: CallParams<St, S>) => void;
}): any;

// Test: does unconstrained M still infer correctly?
defineComponent_v2({
  createComponent() {
    return {
      foo() { return 1; },
      bar(x: string) { return x.length; },
      test() {
        this.foo();
        this.bar('hello');
        // @ts-expect-error
        this.nonExistent();
      },
    };
  },
});

// V3: M extends object
declare function defineComponent_v3<
  M extends object,
  S extends Record<string, any> = {},
  St extends Record<string, any> = {},
>(options: {
  defaultSettings?: S;
  defaultState?: St;
  createComponent?: (params: CallParams<St, S>) => M & ThisType<M & CallParams<St, S>>;
  events?: Record<string, (this: M, params: CallParams<St, S> & { event: Event }) => void>;
  onCreated?: (this: M, params: CallParams<St, S>) => void;
}): any;

defineComponent_v3({
  createComponent() {
    return {
      foo() { return 1; },
      bar(x: string) { return x.length; },
      test() {
        this.foo();
        this.bar('hello');
        // @ts-expect-error
        this.nonExistent();
      },
    };
  },
});
