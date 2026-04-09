/**
 * BOTH WORLDS: self (untyped) + this (typed) in createComponent.
 * self fully typed in events/lifecycle.
 * No breaking changes.
 */

interface Signal<T> {
  get(): T;
  set(value: T): void;
  value: T;
  peek(): T;
}

interface Query {
  addClass(cls: string): Query;
  val(v?: any): any;
  find(selector: string): Query;
}

type WrapState<T> = { [K in keyof T]: Signal<T[K]>; };

interface CallParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
  TInstance extends Record<string, any> = Record<string, any>,
> {
  el: HTMLElement;
  self: TInstance;
  tpl: TInstance;
  component: TInstance;
  $: (selector: string) => Query;
  $$: (selector: string) => Query;
  settings: TSettings;
  state: WrapState<TState>;
  isServer: boolean;
  isClient: boolean;
  dispatchEvent: (name: string, data?: any) => void;
  reaction: (fn: () => void) => void;
  signal: <T>(value: T) => Signal<T>;
  afterFlush: (fn: () => void) => void;
  nonreactive: <T>(fn: () => T) => T;
  darkMode: boolean;
  rerender: () => void;
}

/**
 * createComponent params: self/tpl/component are present but untyped.
 * M does NOT appear in params — only in return + ThisType.
 */
type FactoryParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
> = Omit<CallParams<TState, TSettings>, 'self' | 'tpl' | 'component'> & {
  self: Record<string, any>;
  tpl: Record<string, any>;
  component: Record<string, any>;
};

interface EventCallParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
  TInstance extends Record<string, any> = Record<string, any>,
> extends CallParams<TState, TSettings, TInstance> {
  event: Event;
  target: HTMLElement;
  value: any;
  data: Record<string, any>;
}

declare function defineComponent<
  M extends Record<string, any> = Record<string, any>,
  S extends Record<string, any> = {},
  St extends Record<string, any> = {},
>(options: {
  tagName?: string;
  template?: string;
  css?: string;
  pageCSS?: string;
  componentSpec?: any;

  createComponent?: (params: FactoryParams<St, S>) => M & ThisType<M & FactoryParams<St, S>>;

  events?: Record<string, (this: M, params: EventCallParams<St, S, M>) => void>;
  onCreated?: (this: M, params: CallParams<St, S, M>) => void;
  onRendered?: (this: M, params: CallParams<St, S, M>) => void;
  onDestroyed?: (this: M, params: CallParams<St, S, M>) => void;

  defaultSettings?: S;
  defaultState?: St;
  subTemplates?: Record<string, Function>;
}): any;

// ============================================================
// TEST 1: self still works in createComponent (untyped, no break)
// ============================================================
defineComponent({
  defaultSettings: { label: 'hello' },
  defaultState: { count: 0 },

  createComponent: ({ self, settings, state }) => ({
    increment() {
      state.count.set(state.count.get() + 1);
    },
    getLabel() {
      return settings.label;
    },
    doSomething() {
      // self works — just untyped (Record<string, any>)
      self.increment();
      self.getLabel();
      self.anythingGoes(); // no error — self is Record<string, any>
    },
  }),
});

// ============================================================
// TEST 2: this is typed inside createComponent (escape hatch)
// ============================================================
defineComponent({
  createComponent: () => ({
    foo() {
      return 1;
    },
    bar(x: string) {
      return x.length;
    },
    useSelf() {
      // this is fully typed via ThisType<M>
      const n: number = this.foo();
      const m: number = this.bar('test');

      // @ts-expect-error — nonExistent doesn't exist on M
      this.nonExistent();
    },
  }),
});

// ============================================================
// TEST 3: self IS typed in events (the important case)
// ============================================================
defineComponent({
  defaultSettings: { value: '' },
  defaultState: { activeIndex: -1 },

  createComponent: ({ settings, state, dispatchEvent }) => ({
    setValue(value: string) {
      dispatchEvent('change', { value });
    },
    getActiveIndex() {
      return state.activeIndex.get();
    },
  }),

  events: {
    'deep click menu-item'({ self, value }) {
      // self is FULLY TYPED here — M is already inferred
      self.setValue(value);
      const idx: number = self.getActiveIndex();

      // @ts-expect-error — nonExistent not on M
      self.nonExistent();
    },
  },

  onCreated({ self, settings, state }) {
    // self is FULLY TYPED here too
    self.setValue('init');
    const v: string = settings.value;
    const i: number = state.activeIndex.get();

    // @ts-expect-error — not on M
    self.nonExistent();
  },

  onRendered({ self }) {
    self.setValue('rendered');

    // @ts-expect-error
    self.nonExistent();
  },
});

// ============================================================
// TEST 4: this ALSO works in events/lifecycle
// ============================================================
defineComponent({
  createComponent: () => ({
    activate() {},
    deactivate() {},
  }),

  events: {
    'click .item'() {
      this.activate();
      // @ts-expect-error
      this.nonExistent();
    },
  },

  onCreated() {
    this.deactivate();
    // @ts-expect-error
    this.nonExistent();
  },
});

// ============================================================
// TEST 5: The debounce pattern (arrow fn with self — still works)
// ============================================================
defineComponent({
  defaultSettings: { debounceInterval: 300 },

  createComponent: ({ self, settings }) => ({
    setValue(value: string) {},

    // Arrow function capturing self — self is untyped but works
    setValueDebounced: (value: string) => {
      self.setValue(value); // no error — self is Record<string, any>
    },
  }),
});

// ============================================================
// TEST 6: Settings type inference
// ============================================================
defineComponent({
  defaultSettings: { label: 'hello', count: 42, active: true },

  createComponent: ({ settings }) => {
    const a: string = settings.label;
    const b: number = settings.count;
    const c: boolean = settings.active;

    // @ts-expect-error — label is string not number
    const bad: number = settings.label;

    return {};
  },
});

// ============================================================
// TEST 7: State type inference with Signal wrapping
// ============================================================
defineComponent({
  defaultState: { count: 0, name: 'test', active: false },

  createComponent: ({ state }) => {
    const a: number = state.count.get();
    const b: string = state.name.get();
    const c: boolean = state.active.get();

    // @ts-expect-error — count is Signal<number>, get() returns number not string
    const bad: string = state.count.get();

    return {};
  },
});

// ============================================================
// TEST 8: Chained self-referential returns via this
// ============================================================
defineComponent({
  defaultState: { count: 0 },

  createComponent: ({ state }) => ({
    getCount() {
      return state.count.get();
    },
    doubled() {
      return this.getCount() * 2;
    },
    display() {
      return `Count: ${this.doubled()}`;
    },
  }),
});

// ============================================================
// TEST 9: Realistic component (menu-like)
// ============================================================
defineComponent({
  tagName: 'ui-menu',
  defaultState: { activeIndex: -1 },
  defaultSettings: { value: '', iconOnly: false },

  createComponent: ({ self, $, $$, el, state, dispatchEvent, isServer, settings }) => ({
    setValue(value: string) {
      // Can use self (untyped) or this (typed)
      self.selectValue(value); // works, untyped
      dispatchEvent('change', { value });
    },
    selectValue(value: string) {
      const $item = this.getItemByValue(value); // typed via this
    },
    getMenuItems() {
      return $$('menu-item');
    },
    getItemByValue(value: string) {
      return this.getMenuItems();
    },
    getActiveIndex() {
      return state.activeIndex.get();
    },
  }),

  events: {
    'deep click menu-item'({ self, value }) {
      // self IS typed in events
      if (value !== undefined) {
        self.setValue(value);

        // @ts-expect-error
        self.nonExistent();
      }
    },
  },

  onRendered({ self, settings, isClient, $$ }) {
    if (settings.value) {
      self.setValue(settings.value);
    }
  },
});

// ============================================================
// TEST 10: No createComponent — settings/state still work
// ============================================================
defineComponent({
  defaultSettings: { placeholder: 'Search...' },
  defaultState: { focused: false },

  onCreated({ settings, state }) {
    const p: string = settings.placeholder;
    const f: boolean = state.focused.get();

    // @ts-expect-error
    const bad: number = settings.placeholder;
  },
});
