/**
 * THE SOLUTION: Remove M from createComponent's parameter type,
 * use ThisType<M> for self-reference inside the returned object.
 *
 * CallParams for createComponent OMITS self/tpl/component.
 * CallParams for events/lifecycle KEEPS them (M flows via `this: M`).
 */

// ============================================================
// Type infrastructure
// ============================================================

interface Signal<T> {
  get(): T;
  set(value: T): void;
  value: T;
  peek(): T;
}

interface Query {
  addClass(cls: string): Query;
  removeClass(cls: string): Query;
  on(event: string, handler: (e: Event) => void): Query;
}

type WrapState<T> = { [K in keyof T]: Signal<T[K]> };

/**
 * Full CallParams — used in events, lifecycle hooks.
 * Contains self/tpl/component with the inferred type.
 */
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
  isRendered: () => boolean;
  dispatchEvent: (name: string, data?: any) => void;
  reaction: (fn: () => void) => void;
  signal: <T>(value: T) => Signal<T>;
  afterFlush: (fn: () => void) => void;
  flush: () => void;
  nonreactive: <T>(fn: () => T) => T;
  darkMode: boolean;
  rerender: () => void;
}

/**
 * Factory CallParams — used in createComponent's parameter.
 * OMITS self/tpl/component to prevent circular inference of M.
 * Users access self via `this` inside the returned object instead.
 */
type FactoryParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
> = Omit<CallParams<TState, TSettings>, 'self' | 'tpl' | 'component'>;

/**
 * Event-specific params
 */
interface EventCallParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
  TInstance extends Record<string, any> = Record<string, any>,
> extends CallParams<TState, TSettings, TInstance> {
  event: Event;
  isDeep: boolean;
  target: HTMLElement;
  value: any;
  data: Record<string, any>;
}

interface KeyCallParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
  TInstance extends Record<string, any> = Record<string, any>,
> extends CallParams<TState, TSettings, TInstance> {
  event: KeyboardEvent;
  inputFocused: boolean;
  repeatedKey: boolean;
}


// ============================================================
// defineComponent
// ============================================================

declare function defineComponent<
  M extends Record<string, any> = Record<string, any>,
  S extends Record<string, any> = Record<string, any>,
  St extends Record<string, any> = Record<string, any>,
>(options: {
  tagName?: string;
  template?: string;
  ast?: any;
  css?: string;
  pageCSS?: string;
  delegatesFocus?: boolean;
  templateName?: string;

  /**
   * Factory function that creates the component instance.
   * Returns an object of methods/properties.
   *
   * Inside the returned object, `this` is typed as the full instance
   * (all returned methods) plus CallParams (settings, state, etc.).
   * This matches the runtime behavior where Template.call() binds
   * `this` to the component instance.
   */
  createComponent?: (params: FactoryParams<St, S>) => M & ThisType<M & FactoryParams<St, S>>;

  events?: Record<string, (
    this: M,
    params: EventCallParams<St, S, M>
  ) => void>;

  keys?: Record<string, (
    this: M,
    params: KeyCallParams<St, S, M>
  ) => void | boolean>;

  onCreated?: (this: M, params: CallParams<St, S, M>) => void;
  onRendered?: (this: M, params: CallParams<St, S, M>) => void;
  onUpdated?: (this: M, params: CallParams<St, S, M>) => void;
  onDestroyed?: (this: M, params: CallParams<St, S, M>) => void;
  onThemeChanged?: (this: M, params: CallParams<St, S, M>) => void;
  onAttributeChanged?: (attr: string, oldVal: string | null, newVal: string | null) => void;

  defaultSettings?: S;
  defaultState?: St;
  subTemplates?: Record<string, Function>;
  renderingEngine?: string;
  properties?: Record<string, any>;
  componentSpec?: boolean;
  plural?: boolean;
  singularTag?: string;
}): any;


// ============================================================
// TESTS
// ============================================================

// TEST 1: Basic self-reference via `this`
defineComponent({
  createComponent({ el }) {
    return {
      foo() { return 1; },
      bar(x: string) { return x.length; },
      callSelf() {
        const n: number = this.foo();
        const m: number = this.bar('test');
        // @ts-expect-error — nonExistent doesn't exist
        this.nonExistent();
      },
    };
  },
});


// TEST 2: Settings inference
defineComponent({
  defaultSettings: { label: 'hello', size: 'medium', count: 42 },
  createComponent({ settings }) {
    const a: string = settings.label;
    const b: string = settings.size;
    const c: number = settings.count;
    // @ts-expect-error — label is string not number
    const bad: number = settings.label;
    return { getLabel() { return settings.label; } };
  },
});


// TEST 3: State inference (with Signal wrapping)
defineComponent({
  defaultState: { count: 0, active: false, name: 'test' },
  createComponent({ state }) {
    const a: number = state.count.get();
    const b: boolean = state.active.get();
    const c: string = state.name.get();
    // @ts-expect-error
    const bad: string = state.count.get();
    return { getCount() { return state.count.get(); } };
  },
});


// TEST 4: Self-referential via `this`
defineComponent({
  defaultState: { count: 0 },
  createComponent({ state }) {
    return {
      getCount() { return state.count.get(); },
      doubled() { return this.getCount() * 2; },
    };
  },
});


// TEST 5: Events and lifecycle hooks
defineComponent({
  defaultSettings: { value: 'hello' },
  defaultState: { index: 0 },

  createComponent({ settings, state }) {
    return {
      setValue(v: string) { },
      getIndex() { return state.index.get(); },
    };
  },

  events: {
    'click .item'({ settings, state, self }) {
      // `this` is typed as M
      this.setValue('test');
      // `self` in event params is also typed as M
      self.setValue('test');
      const v: string = settings.value;
      const i: number = state.index.get();
      // @ts-expect-error
      this.nonExistent();
    },
  },

  onCreated({ settings, self }) {
    this.setValue('init');
    self.setValue('init');  // self also works in lifecycle
    const v: string = settings.value;
    // @ts-expect-error
    const bad: number = settings.value;
  },

  onRendered() {
    this.setValue('rendered');
    // @ts-expect-error
    this.nonExistent();
  },
});


// TEST 6: Full realistic component
defineComponent({
  tagName: 'ui-counter',
  defaultSettings: { min: 0, max: 100, step: 1, label: 'Counter' },
  defaultState: { count: 0, isDisabled: false },

  createComponent({ settings, state, dispatchEvent }) {
    return {
      increment() {
        const current = state.count.get();
        const next = current + settings.step;
        if (next <= settings.max) {
          state.count.set(next);
          dispatchEvent('change', { count: next });
        }
      },
      decrement() {
        const current = state.count.get();
        const next = current - settings.step;
        if (next >= settings.min) {
          state.count.set(next);
        }
      },
      reset() { state.count.set(settings.min); },
      getDisplayValue() { return `${settings.label}: ${state.count.get()}`; },
      incrementAndDisplay() {
        this.increment();
        return this.getDisplayValue();
      },
    };
  },

  events: {
    'click .increment'() { this.increment(); },
    'click .decrement'() { this.decrement(); },
    'click .reset'() { this.reset(); },
  },

  onCreated() {
    const display = this.getDisplayValue();
    // @ts-expect-error
    this.nonExistent();
  },
});


// TEST 7: Parameter type checking
defineComponent({
  createComponent() {
    return {
      greet(name: string, times: number) { return name.repeat(times); },
      test() {
        // @ts-expect-error — wrong param type
        this.greet(123, 1);
      },
    };
  },
});


// TEST 8: Return type checking
defineComponent({
  createComponent() {
    return {
      getNumber() { return 42; },
      getString() { return 'hello'; },
      test() {
        const n: number = this.getNumber();
        const s: string = this.getString();
        // @ts-expect-error
        const bad: string = this.getNumber();
      },
    };
  },
});


// TEST 9: `self` no longer in createComponent params
// (this is the tradeoff — self is only available via `this` inside createComponent)
defineComponent({
  createComponent() {
    return {
      foo() { return 1; },
      bar() {
        // Use `this` for typed self-reference:
        const n: number = this.foo();
        // @ts-expect-error
        this.nonExistent();
      },
    };
  },
});


// TEST 10: Async methods
defineComponent({
  createComponent() {
    return {
      async fetchData() { return { data: [1, 2, 3] }; },
      async processData() {
        const result = await this.fetchData();
        return result.data.map(x => x * 2);
      },
    };
  },
});


// TEST 11: Settings via `this` (ThisType union)
defineComponent({
  defaultSettings: { theme: 'dark' },
  defaultState: { visible: true },
  createComponent({ settings, state }) {
    return {
      toggle() { state.visible.set(!state.visible.get()); },
      getTheme() { return settings.theme; },
      render() {
        this.toggle();
        // Also via this:
        const t: string = this.settings.theme;
        const v: Signal<boolean> = this.state.visible;
      },
    };
  },
});


// TEST 12: Keys handler
defineComponent({
  defaultState: { focused: false },
  createComponent({ state }) {
    return {
      activate() { state.focused.set(true); },
      deactivate() { state.focused.set(false); },
    };
  },
  keys: {
    'Escape'({ inputFocused }) {
      if (!inputFocused) { this.deactivate(); }
    },
    'Enter'() {
      this.activate();
      // @ts-expect-error
      this.nonExistent();
    },
  },
});


// TEST 13: Generic methods
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


// TEST 14: Empty createComponent
defineComponent({
  defaultSettings: { label: 'empty' },
  createComponent({ settings }) {
    const l: string = settings.label;
    return {};
  },
});


// TEST 15: No createComponent
defineComponent({
  defaultSettings: { label: 'hello' },
  defaultState: { count: 0 },
});


// TEST 16: self still works in events/lifecycle (typed!)
defineComponent({
  createComponent() {
    return {
      handleItem(id: string) { },
    };
  },
  events: {
    'click [data-id]'({ self, data }) {
      // self IS typed in event params:
      self.handleItem(data.id);
      // @ts-expect-error
      self.nonExistent();
    },
  },
  onCreated({ self }) {
    self.handleItem('init');
    // @ts-expect-error
    self.nonExistent();
  },
});


// TEST 17: Accessing all params in createComponent
defineComponent({
  defaultSettings: { label: 'test' },
  defaultState: { count: 0 },
  createComponent({ settings, state, el, $, $$, dispatchEvent, isServer, isClient, reaction, signal, afterFlush, flush, nonreactive, darkMode, rerender, isRendered }) {
    // All standard params still work:
    const l: string = settings.label;
    const c: number = state.count.get();
    const elem: HTMLElement = el;
    const q: Query = $('div');
    const isDark: boolean = darkMode;

    return {
      getLabel() { return settings.label; },
    };
  },
});


// NEGATIVE CONTROL: self-as-param still fails
declare function defineComponent_broken<
  M extends Record<string, any>,
>(options: {
  createComponent: (params: { self: M }) => M & ThisType<M>;
}): any;

defineComponent_broken({
  createComponent({ self }) {
    return {
      foo() { return 1; },
      test() {
        self.anythingGoes();   // no error — M widened
        this.anythingGoes();   // no error — this also widened
      },
    };
  },
});
