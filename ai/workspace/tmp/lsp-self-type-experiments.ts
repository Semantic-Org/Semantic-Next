/**
 * defineComponent self-typing experiments.
 *
 * SOLUTION FOUND: Use ThisType<M> on the return type of createComponent.
 * Remove self/tpl/component from createComponent's parameter type.
 * Use `this` for typed self-reference in the returned object literal.
 * In events/lifecycle hooks, use `this: M` for typed this + self in params.
 *
 * Run: npx tsc --noEmit --strict --target es2020 --moduleResolution node <file>
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
 * Contains self/tpl/component with the inferred type M.
 * M doesn't cause circular inference here because it's NOT
 * in a position where TS needs to infer M from this callback.
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
 * FactoryParams — used ONLY in createComponent's parameter.
 * OMITS self/tpl/component to prevent circular inference of M.
 * Users access self via `this` inside the returned object instead.
 *
 * This is the key insight: M must NOT appear in the parameter type
 * of the function whose return type is used to INFER M.
 */
type FactoryParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
> = Omit<CallParams<TState, TSettings>, 'self' | 'tpl' | 'component'>;

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
// THE SOLUTION: defineComponent
// ============================================================

declare function defineComponent<
  // Record<string, any> (not Record<string, (...args: any[]) => any>!)
  // The loose constraint is critical: it allows chained this.method()
  // return types to resolve correctly instead of falling back to `any`.
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

  // KEY: FactoryParams omits self/tpl/component.
  // Return type M & ThisType<M & FactoryParams<...>> makes `this` inside
  // the returned object literal resolve to M (all methods) + FactoryParams
  // (settings, state, el, etc.)
  createComponent?: (params: FactoryParams<St, S>) => M & ThisType<M & FactoryParams<St, S>>;

  // Events/lifecycle: `this: M` types `this` for the callback.
  // CallParams includes self/tpl/component — safe here because M
  // doesn't need to be inferred from these callbacks.
  events?: Record<string, (this: M, params: EventCallParams<St, S, M>) => void>;
  keys?: Record<string, (this: M, params: KeyCallParams<St, S, M>) => void | boolean>;
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
// TEST SUITE
// ============================================================

// 1. Basic self-reference via `this`
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

// 2. Settings inference
defineComponent({
  defaultSettings: { label: 'hello', size: 'medium', count: 42 },
  createComponent({ settings }) {
    const a: string = settings.label;
    const c: number = settings.count;
    // @ts-expect-error — label is string not number
    const bad: number = settings.label;
    return { getLabel() { return settings.label; } };
  },
});

// 3. State inference (with Signal wrapping)
defineComponent({
  defaultState: { count: 0, active: false, name: 'test' },
  createComponent({ state }) {
    const a: number = state.count.get();
    const b: boolean = state.active.get();
    // @ts-expect-error
    const bad: string = state.count.get();
    return { getCount() { return state.count.get(); } };
  },
});

// 4. Chained self-reference (return type flows through this.method())
defineComponent({
  defaultState: { count: 0 },
  createComponent({ state }) {
    return {
      getCount() { return state.count.get(); },
      doubled() { return this.getCount() * 2; },
      tripled() { return this.doubled() + this.getCount(); },
      test() {
        const d: number = this.doubled();
        const t: number = this.tripled();
        // @ts-expect-error — doubled returns number not string
        const bad: string = this.doubled();
      },
    };
  },
});

// 5. Events and lifecycle hooks (both `this` and `self` typed)
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
      this.setValue('test');
      self.setValue('test');  // self also typed in events!
      const v: string = settings.value;
      const i: number = state.index.get();
      // @ts-expect-error
      this.nonExistent();
    },
  },
  onCreated({ settings, self }) {
    this.setValue('init');
    self.setValue('init');
    // @ts-expect-error
    const bad: number = settings.value;
  },
  onRendered() {
    this.setValue('rendered');
    // @ts-expect-error
    this.nonExistent();
  },
});

// 6. Full realistic component
defineComponent({
  tagName: 'ui-counter',
  defaultSettings: { min: 0, max: 100, step: 1, label: 'Counter' },
  defaultState: { count: 0, isDisabled: false },
  createComponent({ settings, state, dispatchEvent }) {
    return {
      increment() {
        const next = state.count.get() + settings.step;
        if (next <= settings.max) {
          state.count.set(next);
          dispatchEvent('change', { count: next });
        }
      },
      decrement() {
        const next = state.count.get() - settings.step;
        if (next >= settings.min) state.count.set(next);
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
    this.getDisplayValue();
    // @ts-expect-error
    this.nonExistent();
  },
});

// 7. Parameter type checking
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

// 8. Return type checking
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

// 9. Async methods with chaining
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

// 10. Settings/state also on `this` via ThisType union
defineComponent({
  defaultSettings: { theme: 'dark' },
  defaultState: { visible: true },
  createComponent({ settings, state }) {
    return {
      toggle() { state.visible.set(!state.visible.get()); },
      getTheme() { return settings.theme; },
      render() {
        this.toggle();
        const t: string = this.settings.theme;
        const v: Signal<boolean> = this.state.visible;
      },
    };
  },
});

// 11. Keys handler
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
      if (!inputFocused) this.deactivate();
    },
    'Enter'() {
      this.activate();
      // @ts-expect-error
      this.nonExistent();
    },
  },
});

// 12. Generic methods
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

// 13. self typed in events/lifecycle params
defineComponent({
  createComponent() {
    return { handleItem(id: string) { } };
  },
  events: {
    'click [data-id]'({ self, data }) {
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

// 14. All standard params still accessible in createComponent
defineComponent({
  defaultSettings: { label: 'test' },
  defaultState: { count: 0 },
  createComponent({ settings, state, el, $, $$, dispatchEvent, isServer, isClient, darkMode, rerender }) {
    const l: string = settings.label;
    const c: number = state.count.get();
    const elem: HTMLElement = el;
    const q: Query = $('div');
    const isDark: boolean = darkMode;
    return { getLabel() { return settings.label; } };
  },
});

// 15. No createComponent — still compiles
defineComponent({ defaultSettings: { label: 'hello' } });

// 16. Empty createComponent
defineComponent({
  createComponent() { return {}; },
});
