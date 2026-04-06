/**
 * Validates the .d.ts type changes against real SUI patterns.
 * Run: npx tsc --noEmit --strict --target es2020 --moduleResolution node --paths ... <this file>
 *
 * Since we can't import from @semantic-ui/* in a standalone file,
 * we duplicate the minimal type surface and test the inference patterns.
 */

// Minimal type stubs matching the updated .d.ts
interface Signal<T> {
  get(): T;
  set(value: T): void;
  value: T;
  peek(): T;
  increment(): void;
  decrement(): void;
  toggle(): void;
  push(...items: any[]): void;
  filter(fn: (item: any) => boolean): void;
  getItem(id: any): any;
  getIndex(i: number): any;
  setIndex(i: number, val: any): void;
  setProperty(id: any, key: string, val: any): void;
  setArrayProperty(key: string, val: any): void;
  removeItem(id: any): void;
  replaceItem(id: any, val: any): void;
}

type ReactiveState<T extends Record<string, any>> = { [K in keyof T]: Signal<T[K]> };

interface CallParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
  TInstance extends Record<string, any> = Record<string, any>,
  TProperties extends Record<string, any> = Record<string, any>,
> {
  el: HTMLElement;
  self: TInstance;
  tpl: TInstance;
  component: TInstance;
  $: (selector: string) => any;
  $$: (selector: string) => any;
  settings: TSettings & TProperties;
  state: ReactiveState<TState>;
  isServer: boolean;
  isClient: boolean;
  dispatchEvent: (name: string, data?: any) => void;
  reaction: (fn: () => void) => void;
  signal: <T>(value: T) => Signal<T>;
  afterFlush: (fn: () => void) => void;
  flush: () => void;
  nonreactive: <T>(fn: () => T) => T;
  darkMode: boolean;
  rerender: () => void;
  isRendered: () => boolean;
  abortController: AbortController;
}

type FactoryParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
  TProperties extends Record<string, any> = Record<string, any>,
> = Omit<CallParams<TState, TSettings, Record<string, any>, TProperties>, 'self' | 'tpl' | 'component'> & {
  self: Record<string, any>;
  tpl: Record<string, any>;
  component: Record<string, any>;
};

interface EventCallParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
  TInstance extends Record<string, any> = Record<string, any>,
  TProperties extends Record<string, any> = Record<string, any>,
> extends CallParams<TState, TSettings, TInstance, TProperties> {
  event: Event;
  target: HTMLElement;
  value: any;
  data: Record<string, any>;
}

interface KeyCallParams<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
  TInstance extends Record<string, any> = Record<string, any>,
  TProperties extends Record<string, any> = Record<string, any>,
> extends CallParams<TState, TSettings, TInstance, TProperties> {
  event: KeyboardEvent;
  inputFocused: boolean;
  repeatedKey: boolean;
}

declare function defineComponent<
  M extends Record<string, any> = Record<string, any>,
  S extends Record<string, any> = {},
  St extends Record<string, any> = {},
  P extends Record<string, any> = {},
>(options: {
  tagName?: string;
  template?: string;
  css?: string;
  createComponent?: (params: FactoryParams<St, S, P>) => M & ThisType<M & FactoryParams<St, S, P>>;
  events?: Record<string, (this: M, params: EventCallParams<St, S, M, P>) => void>;
  keys?: Record<string, (this: M, params: KeyCallParams<St, S, M, P>) => void | boolean>;
  onCreated?: (this: M, params: CallParams<St, S, M, P>) => void;
  onRendered?: (this: M, params: CallParams<St, S, M, P>) => void;
  onDestroyed?: (this: M, params: CallParams<St, S, M, P>) => void;
  defaultSettings?: S;
  defaultState?: St;
  subTemplates?: Record<string, Function>;
  componentSpec?: any;
}): any;


/*******************************
    Settings Inference
*******************************/

// Settings types are inferred from defaultSettings
defineComponent({
  defaultSettings: { label: 'hello', count: 42, active: true, items: ['a', 'b'] },
  createComponent: ({ settings }) => {
    const a: string = settings.label;
    const b: number = settings.count;
    const c: boolean = settings.active;
    const d: string[] = settings.items;
    // @ts-expect-error — label is string not number
    const bad: number = settings.label;
    return {};
  },
});


/*******************************
    State Inference
*******************************/

// State types are inferred from defaultState, wrapped in Signal<T>
defineComponent({
  defaultState: { count: 0, name: 'test', active: false, items: [] as string[] },
  createComponent: ({ state }) => {
    const a: number = state.count.get();
    const b: string = state.name.get();
    const c: boolean = state.active.get();
    state.count.set(5);
    state.count.increment();
    state.active.toggle();
    state.items.push('new');
    // @ts-expect-error — count.get() returns number not string
    const bad: string = state.count.get();
    return {};
  },
});


/*******************************
  Self via this in createComponent
*******************************/

// this is typed via ThisType<M> — validated in exp-thistype-both.ts
// Note: standalone test passes, multi-call file has TS inference quirk
// The critical assertions (self typed in events, settings/state typed) are below


/*******************************
  Self (untyped) in createComponent
*******************************/

// self is available but untyped — no error on unknown methods
defineComponent({
  createComponent: ({ self }) => ({
    foo() { return 1; },
    useSelf() {
      self.foo();
      self.anythingGoes(); // no error — self is Record<string, any>
    },
  }),
});


/*******************************
  Self typed in events
*******************************/

defineComponent({
  defaultSettings: { value: '' },
  defaultState: { index: 0 },
  createComponent: ({ state, dispatchEvent }) => ({
    setValue(v: string) { dispatchEvent('change', { value: v }); },
    getIndex() { return state.index.get(); },
  }),
  events: {
    'click .item'({ self, settings, state }) {
      self.setValue('test');
      const i: number = self.getIndex();
      const v: string = settings.value;
      const idx: number = state.index.get();
      // @ts-expect-error
      self.nonExistent();
    },
    'deep click menu-item'({ self, value }) {
      self.setValue(value);
    },
  },
  onCreated({ self, settings, state }) {
    self.setValue('init');
    const v: string = settings.value;
    const i: number = state.index.get();
    // @ts-expect-error
    self.nonExistent();
  },
  onRendered({ self }) {
    self.setValue('rendered');
    // @ts-expect-error
    self.nonExistent();
  },
});


/*******************************
  this typed in events/lifecycle
*******************************/

defineComponent({
  createComponent: () => ({
    activate() { },
    deactivate() { },
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


/*******************************
  Keys handler typing
*******************************/

defineComponent({
  defaultState: { focused: false },
  createComponent: ({ state }) => ({
    activate() { state.focused.set(true); },
    deactivate() { state.focused.set(false); },
  }),
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


/*******************************
  Chained return types via this
*******************************/

defineComponent({
  defaultState: { count: 0 },
  createComponent: ({ state }) => ({
    getCount() { return state.count.get(); },
    doubled() { return this.getCount() * 2; },
    display() { return `Count: ${this.doubled()}`; },
  }),
});


/*******************************
  Debounce pattern (arrow fn + self)
*******************************/

defineComponent({
  defaultSettings: { debounceInterval: 300 },
  createComponent: ({ self }) => ({
    setValue(value: string) { },
    setValueDebounced: (value: string) => {
      self.setValue(value); // works — self is untyped but available
    },
  }),
});


/*******************************
  Realistic: menu-like component
*******************************/

defineComponent({
  tagName: 'ui-menu',
  defaultState: { activeIndex: -1 },
  defaultSettings: { value: '', iconOnly: false },
  createComponent: ({ self, $$, state, dispatchEvent, settings, isServer }) => ({
    setValue(value: string) {
      self.selectValue(value); // untyped self
      dispatchEvent('change', { value });
    },
    selectValue(value: string) {
      this.getItemByValue(value); // typed this
    },
    getMenuItems() { return $$('menu-item'); },
    getItemByValue(value: string) { return this.getMenuItems(); },
    getActiveIndex() { return state.activeIndex.get(); },
  }),
  events: {
    'deep click menu-item'({ self, value }) {
      if (value !== undefined) {
        self.setValue(value);
        // @ts-expect-error
        self.nonExistent();
      }
    },
  },
  onRendered({ self, settings }) {
    if (settings.value) { self.setValue(settings.value); }
  },
});


/*******************************
  Realistic: todo-list (no spec)
*******************************/

defineComponent({
  tagName: 'todo-app',
  defaultState: { todos: [] as Array<{id: string; title: string; completed: boolean}>, filter: 'all' as string, editingId: null as string | null },
  createComponent: ({ self, state, reaction }) => ({
    initialize() {
      self.loadTodos();
      reaction(() => {
        const todos = state.todos.get();
        localStorage.setItem('todos', JSON.stringify(todos));
      });
    },
    loadTodos() {
      const stored = localStorage.getItem('todos');
      if (stored) state.todos.set(JSON.parse(stored));
    },
    hasTodos() { return state.todos.get().length > 0; },
    filteredTodos() {
      const todos = state.todos.get();
      const filter = state.filter.get();
      if (filter === 'active') return todos.filter(t => !t.completed);
      return todos;
    },
    addTodo(title: string) {
      state.todos.push({ id: String(Date.now()), title, completed: false });
    },
    toggleAll() {
      state.todos.setArrayProperty('completed', true);
    },
  }),
  events: {
    'keydown .new-todo'({ self, value, target, event }) {
      if ((event as KeyboardEvent).key === 'Enter') {
        self.addTodo(value);
        (target as HTMLInputElement).value = '';
      }
    },
    'change .toggle-all'({ self }) { self.toggleAll(); },
  },
  keys: {
    'esc'({ state }) { state.editingId.set(null); },
  },
});


/*******************************
  No createComponent
*******************************/

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


/*******************************
  All destructured params resolve
*******************************/

defineComponent({
  defaultSettings: { label: 'test' },
  defaultState: { count: 0 },
  createComponent: ({ settings, state, el, $, $$, dispatchEvent, isServer, isClient, reaction, signal, afterFlush, flush, nonreactive, darkMode, rerender, isRendered, abortController, self, tpl, component }) => {
    // All standard params have correct types
    const _s: string = settings.label;
    const _c: number = state.count.get();
    const _el: HTMLElement = el;
    const _dark: boolean = darkMode;
    const _server: boolean = isServer;
    const _client: boolean = isClient;
    const _rendered: boolean = isRendered();
    const _abort: AbortController = abortController;

    // self/tpl/component are Record<string, any> in createComponent
    self.anything;
    tpl.anything;
    component.anything;

    return { getLabel() { return settings.label; } };
  },
});
