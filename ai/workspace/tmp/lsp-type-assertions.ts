/**
 * Type assertion tests: if tsc passes, the generic inference works.
 * If it errors, the specific assertion that fails tells us what broke.
 */

interface Signal<T> {
  get(): T;
  set(value: T): void;
  value: T;
}

type LooseMethods<M> = { [K in keyof M]: M[K] extends (...args: infer A) => any ? (...args: A) => any : M[K] };

interface CallParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
  TInstance extends Record<string, any> = Record<string, any>,
> {
  self: TInstance;
  settings: TSettings;
  state: { [K in keyof TState]: Signal<TState[K]> };
  el: HTMLElement;
}

declare function defineComponent<
  M extends Record<string, any>,
  S extends Record<string, any> = {},
  St extends Record<string, any> = {},
>(options: {
  createComponent?: (params: CallParams<St, S, LooseMethods<M>>) => M;
  defaultSettings?: S;
  defaultState?: St;
  events?: Record<string, (params: CallParams<St, S, LooseMethods<M>>) => void>;
  onCreated?: (params: CallParams<St, S, LooseMethods<M>>) => void;
}): any;

// ============================================================
// TEST: settings inference
// ============================================================
defineComponent({
  defaultSettings: { label: 'hello', size: 'medium', count: 42 },

  createComponent: ({ settings }) => {
    // These should be specifically typed, not any
    const a: string = settings.label;
    const b: string = settings.size;
    const c: number = settings.count;

    // @ts-expect-error — label is string, not number
    const bad: number = settings.label;

    return {};
  },
});

// ============================================================
// TEST: state inference
// ============================================================
defineComponent({
  defaultState: { count: 0, active: false, name: 'test' },

  createComponent: ({ state }) => {
    // state.count should be Signal<number>
    const a: number = state.count.get();

    // state.active should be Signal<boolean>
    const b: boolean = state.active.get();

    // state.name should be Signal<string>
    const c: string = state.name.get();

    // @ts-expect-error — count.get() returns number, not string
    const bad: string = state.count.get();

    return {};
  },
});

// ============================================================
// TEST: self inference (method names known)
// ============================================================
defineComponent({
  createComponent: ({ self }) => ({
    foo() { return 1; },
    bar(x: string) { return x.length; },
    callSelf() {
      // self should know foo and bar exist
      self.foo();
      self.bar('test');

      // @ts-expect-error — nonExistent is not a method
      self.nonExistent();
    },
  }),
});

// ============================================================
// TEST: self preserves parameter types
// ============================================================
defineComponent({
  createComponent: ({ self }) => ({
    greet(name: string, times: number) { return name.repeat(times); },
    test() {
      // @ts-expect-error — greet expects string, not number
      self.greet(123, 1);
    },
  }),
});

// ============================================================
// TEST: events/onCreated share types with createComponent
// ============================================================
defineComponent({
  defaultSettings: { value: 'hello' },
  defaultState: { index: 0 },

  createComponent: ({ self, settings, state }) => ({
    setValue(v: string) { },
    getIndex() { return state.index.get(); },
  }),

  events: {
    'click .item'({ self, settings, state }) {
      // self should know setValue
      self.setValue('test');

      // @ts-expect-error — nonExistent not on self
      self.nonExistent();

      // settings should know value
      const v: string = settings.value;

      // state should know index
      const i: number = state.index.get();
    },
  },

  onCreated({ self, settings, state }) {
    self.setValue('init');
    const v: string = settings.value;
    const i: number = state.index.get();

    // @ts-expect-error — value is string not number
    const bad: number = settings.value;
  },
});
