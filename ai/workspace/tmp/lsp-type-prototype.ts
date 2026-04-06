/**
 * Microcosm prototype: Can TS infer self/settings/state types
 * through defineComponent's generic parameters?
 *
 * Test: open in VS Code, hover over self/settings/state references
 * to see if TS resolves them to specific types rather than Record<string, any>
 */

// Simulated Signal type
interface Signal<T> {
  get(): T;
  set(value: T): void;
  value: T;
  peek(): T;
  increment(): void;
  decrement(): void;
  toggle(): void;
  push(...items: any[]): void;
}

// Cycle-breaker: self knows method NAMES but returns are loosened to any
type LooseMethods<M> = { [K in keyof M]: M[K] extends (...args: infer A) => any ? (...args: A) => any : M[K] };

// Simplified CallParams
interface CallParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
  TInstance extends Record<string, any> = Record<string, any>,
> {
  self: TInstance;
  tpl: TInstance;
  component: TInstance;
  settings: TSettings;
  state: { [K in keyof TState]: Signal<TState[K]> };
  el: HTMLElement;
  $: (selector: string) => any;
  $$: (selector: string) => any;
  dispatchEvent: (name: string, data?: any) => void;
  isServer: boolean;
  isClient: boolean;
  darkMode: boolean;
  reaction: (fn: () => void) => void;
  signal: <T>(value: T) => Signal<T>;
  afterFlush: (fn: () => void) => void;
  nonreactive: <T>(fn: () => T) => T;
}

// Event params extend CallParams with event-specific fields
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

// The core type definition under test
declare function defineComponent<
  M extends Record<string, any>,
  S extends Record<string, any> = {},
  St extends Record<string, any> = {},
>(options: {
  tagName?: string;
  template?: string;
  css?: string;
  createComponent?: (params: CallParams<St, S, LooseMethods<M>>) => M;
  defaultSettings?: S;
  defaultState?: St;
  events?: Record<string, (params: EventCallParams<St, S, LooseMethods<M>>) => void>;
  onCreated?: (params: CallParams<St, S, LooseMethods<M>>) => void;
  onRendered?: (params: CallParams<St, S, LooseMethods<M>>) => void;
  onDestroyed?: (params: CallParams<St, S, LooseMethods<M>>) => void;
}): any;


// ============================================================
// TEST 1: Basic component — does self/settings/state resolve?
// ============================================================
defineComponent({
  defaultState: { count: 0, active: false },
  defaultSettings: { label: '', size: 'medium' },

  createComponent: ({ self, settings, state }) => ({
    increment() {
      state.count.set(state.count.get() + 1);
      //   ^^^^^ HOVER: should be Signal<number>
    },
    getLabel() {
      return settings.label;
      //              ^^^^^ HOVER: should be string
    },
    reset() {
      self.increment();
      //   ^^^^^^^^^ HOVER: should be known method
    },
    isActive() {
      return state.active.get();
      //           ^^^^^^ HOVER: should be Signal<boolean>
    },
  }),
});


// ============================================================
// TEST 2: Events + lifecycle — do they share the same types?
// ============================================================
defineComponent({
  defaultState: { activeIndex: -1 },
  defaultSettings: { value: '', iconOnly: false },

  createComponent: ({ self, settings, state, $, dispatchEvent }) => ({
    setValue(value: string) {
      settings.value;
      //       ^^^^^ HOVER: should be string
      dispatchEvent('change', { value });
      self.selectValue(value);
      //   ^^^^^^^^^^^ HOVER: should be known method
    },
    selectValue(value: string) {
      state.activeIndex.set(0);
      //    ^^^^^^^^^^^ HOVER: should be Signal<number>
    },
    getActiveIndex() {
      return state.activeIndex.get();
    },
  }),

  events: {
    'deep click menu-item'({ self, value }) {
      self.setValue(value);
      //   ^^^^^^^^ HOVER: should be known method
      self.getActiveIndex();
      //   ^^^^^^^^^^^^^^^ HOVER: should be known method
    },
  },

  onCreated({ self, settings, state }) {
    self.setValue(settings.value);
    //   ^^^^^^^^ HOVER: should be known method
    //                     ^^^^^ HOVER: should be string
    state.activeIndex.get();
    //    ^^^^^^^^^^^ HOVER: should be Signal<number>
  },

  onRendered({ self, settings }) {
    if (settings.iconOnly) {
      //         ^^^^^^^^ HOVER: should be boolean
      self.selectValue('test');
      //   ^^^^^^^^^^^ HOVER: should be known method
    }
  },
});


// ============================================================
// TEST 3: self-referential return type (the hard case)
// ============================================================
defineComponent({
  defaultState: { count: 0 },

  createComponent: ({ self, state }) => ({
    getCount() {
      return state.count.get();
    },
    getDouble() {
      return self.getCount() * 2;
      //          ^^^^^^^^ With LooseMethods: self.getCount() returns `any`
      //          so getDouble() infers as `number` (any * 2 = number)
      //          Without LooseMethods: circular → self is Record<string, any>
    },
  }),
});


// ============================================================
// TEST 4: No createComponent — settings/state only
// ============================================================
defineComponent({
  defaultSettings: { placeholder: 'Search...', debounce: true },
  defaultState: { focused: false },

  onCreated({ settings, state }) {
    settings.placeholder;
    //       ^^^^^^^^^^^ HOVER: should be string
    settings.debounce;
    //       ^^^^^^^^ HOVER: should be boolean
    state.focused.get();
    //    ^^^^^^^ HOVER: should be Signal<boolean>
  },
});
