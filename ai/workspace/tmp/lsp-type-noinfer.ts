/**
 * Test: Can NoInfer<M> break the self-reference cycle?
 *
 * Idea: Tell TS to infer M ONLY from the return type,
 * then flow it into self without using self for inference.
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
> {
  settings: TSettings;
  state: { [K in keyof TState]: Signal<TState[K]> };
  el: HTMLElement;
  $: (selector: string) => any;
  $$: (selector: string) => any;
  dispatchEvent: (name: string, data?: any) => void;
  isServer: boolean;
  isClient: boolean;
}

// Self is separated from CallParams and uses NoInfer to break the cycle
type ComponentCallback<St, S, M> = CallParams<St, S> & {
  self: NoInfer<LooseMethods<M>>;
  tpl: NoInfer<LooseMethods<M>>;
  component: NoInfer<LooseMethods<M>>;
};

declare function defineComponent<
  M extends Record<string, any>,
  S extends Record<string, any> = {},
  St extends Record<string, any> = {},
>(options: {
  createComponent?: (params: ComponentCallback<St, S, M>) => M;
  defaultSettings?: S;
  defaultState?: St;
  events?: Record<string, (params: ComponentCallback<St, S, M> & { event: Event; value: any }) => void>;
  onCreated?: (params: ComponentCallback<St, S, M>) => void;
  onRendered?: (params: ComponentCallback<St, S, M>) => void;
}): any;


// ============================================================
// TEST 1: Does self now resolve method names?
// ============================================================
defineComponent({
  createComponent: ({ self }) => ({
    foo() { return 1; },
    bar(x: string) { return x.length; },
    callSelf() {
      self.foo();
      self.bar('test');

      // @ts-expect-error — nonExistent should NOT be on self
      self.nonExistent();
    },
  }),
});

// ============================================================
// TEST 2: Does self preserve param types?
// ============================================================
defineComponent({
  createComponent: ({ self }) => ({
    greet(name: string, times: number) { return name.repeat(times); },
    test() {
      // @ts-expect-error — first param should be string not number
      self.greet(123, 1);
    },
  }),
});

// ============================================================
// TEST 3: Combined - self + settings + state
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
      self.setValue('test');

      // @ts-expect-error — nonExistent not on self
      self.nonExistent();

      const v: string = settings.value;
      const i: number = state.index.get();
    },
  },

  onCreated({ self, settings }) {
    self.setValue('init');
    const v: string = settings.value;

    // @ts-expect-error — value is string not number
    const bad: number = settings.value;
  },
});

// ============================================================
// TEST 4: Self-referential return (the hard case)
// ============================================================
defineComponent({
  defaultState: { count: 0 },
  createComponent: ({ self, state }) => ({
    getCount() {
      return state.count.get();
    },
    getDouble() {
      // With LooseMethods, self.getCount() returns `any`
      // so this should still work (any * 2 = number)
      return self.getCount() * 2;
    },
  }),
});
