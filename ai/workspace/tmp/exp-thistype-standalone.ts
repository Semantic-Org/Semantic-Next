/**
 * DEFINITIVE SOLUTION — standalone (no imports).
 *
 * Tests the ThisType<M> approach with the full SUI API shape.
 * Self-contained to avoid module resolution issues.
 */

// ============================================================
// Minimal type reproductions from SUI
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
  // ... etc
}

type WrapState<T> = { [K in keyof T]: Signal<T[K]> };

interface CallParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
  TComponentInstance extends Record<string, any> = Record<string, any>,
> {
  el: HTMLElement;
  self: TComponentInstance;
  tpl: TComponentInstance;
  component: TComponentInstance;
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

interface EventCallParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
  TComponentInstance extends Record<string, any> = Record<string, any>,
> extends CallParams<TState, TSettings, TComponentInstance> {
  event: Event;
  isDeep: boolean;
  target: HTMLElement;
  value: any;
  data: Record<string, any>;
}

interface KeyCallParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
  TComponentInstance extends Record<string, any> = Record<string, any>,
> extends CallParams<TState, TSettings, TComponentInstance> {
  event: KeyboardEvent;
  inputFocused: boolean;
  repeatedKey: boolean;
}


// ============================================================
// THE SOLUTION: defineComponent with ThisType<M>
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

  // KEY: return type is M & ThisType<M & CallParams<...>>
  // TS infers M from the object literal, then ThisType makes `this` = M + CallParams
  createComponent?: (params: CallParams<St, S, M>) => M & ThisType<M & CallParams<St, S, M>>;

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
// TEST 1: Basic self-reference via `this`
// ============================================================
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


// ============================================================
// TEST 2: Settings inference
// ============================================================
defineComponent({
  defaultSettings: { label: 'hello', size: 'medium', count: 42 },

  createComponent({ settings }) {
    const a: string = settings.label;
    const b: string = settings.size;
    const c: number = settings.count;

    // @ts-expect-error — label is string not number
    const bad: number = settings.label;

    return {
      getLabel() { return settings.label; },
    };
  },
});


// ============================================================
// TEST 3: State inference (with Signal wrapping)
// ============================================================
defineComponent({
  defaultState: { count: 0, active: false, name: 'test' },

  createComponent({ state }) {
    const a: number = state.count.get();
    const b: boolean = state.active.get();
    const c: string = state.name.get();

    // @ts-expect-error — count.get() returns number not string
    const bad: string = state.count.get();

    return {
      getCount() { return state.count.get(); },
    };
  },
});


// ============================================================
// TEST 4: Self-referential calls via `this`
// ============================================================
defineComponent({
  defaultState: { count: 0 },

  createComponent({ state }) {
    return {
      getCount() { return state.count.get(); },
      doubled() { return this.getCount() * 2; },
      tripled() { return this.getCount() * 3; },
    };
  },
});


// ============================================================
// TEST 5: Events and lifecycle hooks get typed `this`
// ============================================================
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
    'click .item'({ settings, state, event }) {
      this.setValue('test');
      const v: string = settings.value;
      const i: number = state.index.get();
      // @ts-expect-error — nonExistent not on this
      this.nonExistent();
    },
  },

  onCreated({ settings }) {
    this.setValue('init');
    const v: string = settings.value;
    // @ts-expect-error — value is string not number
    const bad: number = settings.value;
  },

  onRendered() {
    this.setValue('rendered');
    // @ts-expect-error — nonExistent not on this
    this.nonExistent();
  },
});


// ============================================================
// TEST 6: Full realistic component
// ============================================================
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
      reset() {
        state.count.set(settings.min);
      },
      getDisplayValue() {
        return `${settings.label}: ${state.count.get()}`;
      },
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


// ============================================================
// TEST 7: Parameter type checking
// ============================================================
defineComponent({
  createComponent() {
    return {
      greet(name: string, times: number) { return name.repeat(times); },
      test() {
        // @ts-expect-error — greet expects string not number
        this.greet(123, 1);
      },
    };
  },
});


// ============================================================
// TEST 8: Return type flows
// ============================================================
defineComponent({
  createComponent() {
    return {
      getNumber() { return 42; },
      getString() { return 'hello'; },
      test() {
        const n: number = this.getNumber();
        const s: string = this.getString();
        // @ts-expect-error — getNumber returns number not string
        const bad: string = this.getNumber();
      },
    };
  },
});


// ============================================================
// TEST 9: `self` param is still accessible (loose typed)
// ============================================================
defineComponent({
  createComponent({ self }) {
    return {
      foo() { return 1; },
      bar() {
        // self is loose — returns any but has method names
        self.foo();
        // this is precise:
        const n: number = this.foo();
        // @ts-expect-error — this is typed
        this.nonExistent();
      },
    };
  },
});


// ============================================================
// TEST 10: Async methods
// ============================================================
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


// ============================================================
// TEST 11: Settings/state accessible via `this` (ThisType union)
// ============================================================
defineComponent({
  defaultSettings: { theme: 'dark' },
  defaultState: { visible: true },

  createComponent({ settings, state }) {
    return {
      toggle() { state.visible.set(!state.visible.get()); },
      getTheme() { return settings.theme; },
      render() {
        this.toggle();
        // Also via this (CallParams in ThisType union):
        const t: string = this.settings.theme;
        const v: Signal<boolean> = this.state.visible;
      },
    };
  },
});


// ============================================================
// TEST 12: Keys handler
// ============================================================
defineComponent({
  defaultState: { focused: false },

  createComponent({ state }) {
    return {
      activate() { state.focused.set(true); },
      deactivate() { state.focused.set(false); },
    };
  },

  keys: {
    'Escape'({ event, inputFocused }) {
      if (!inputFocused) {
        this.deactivate();
      }
    },
    'Enter'() {
      this.activate();
      // @ts-expect-error
      this.nonExistent();
    },
  },
});


// ============================================================
// TEST 13: Generic methods
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
// TEST 14: Empty createComponent
// ============================================================
defineComponent({
  defaultSettings: { label: 'empty' },
  createComponent({ settings }) {
    const l: string = settings.label;
    return {};
  },
});


// ============================================================
// TEST 15: No createComponent at all
// ============================================================
defineComponent({
  defaultSettings: { label: 'hello' },
  defaultState: { count: 0 },
});


// ============================================================
// TEST 16: Deep event data access
// ============================================================
defineComponent({
  createComponent() {
    return {
      handleItem(id: string) { },
    };
  },

  events: {
    'click [data-id]'({ data, target, event }) {
      this.handleItem(data.id);
    },
  },
});


// ============================================================
// NEGATIVE CONTROL: Confirm self-as-param circularity
// ============================================================
declare function defineComponent_broken<
  M extends Record<string, any>,
>(options: {
  createComponent: (params: { self: M }) => M;
}): any;

// self should be widened — anything goes
defineComponent_broken({
  createComponent({ self }) {
    return {
      foo() { return 1; },
      test() {
        self.foo();           // works (but returns any)
        self.anythingGoes();  // also works — not typed
      },
    };
  },
});
