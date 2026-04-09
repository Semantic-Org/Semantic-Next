/**
 * Full defineComponent shape using ThisType<M> for `this` inside methods.
 *
 * Key insight: the return type `M & ThisType<M>` makes `this` inside
 * the returned object literal resolve to M. TS infers M from the return
 * shape, then feeds it into ThisType — no circularity because `this`
 * is special-cased by TypeScript.
 */

interface Signal<T> {
  get(): T;
  set(value: T): void;
  value: T;
}

// The callback params — does NOT include self (self is `this`)
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

declare function defineComponent<
  M extends Record<string, (...args: any[]) => any>,
  S extends Record<string, any> = {},
  St extends Record<string, any> = {},
>(options: {
  tagName?: string;
  defaultSettings?: S;
  defaultState?: St;
  createComponent?: (params: CallParams<St, S>) => M & ThisType<M & CallParams<St, S>>;
  events?: Record<string, (this: M, params: CallParams<St, S> & { event: Event; value: any }) => void>;
  onCreated?: (this: M, params: CallParams<St, S>) => void;
  onRendered?: (this: M, params: CallParams<St, S>) => void;
  onDestroyed?: (this: M, params: CallParams<St, S>) => void;
}): any;


// ============================================================
// TEST 1: Basic method self-reference via `this`
// ============================================================
defineComponent({
  createComponent({ el }) {
    return {
      foo() { return 1; },
      bar(x: string) { return x.length; },
      callSelf() {
        const n: number = this.foo();
        const m: number = this.bar('test');
        // @ts-expect-error — nonExistent is not a method
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

    // @ts-expect-error — label is string, not number
    const bad: number = settings.label;

    return {
      getLabel() { return settings.label; },
    };
  },
});


// ============================================================
// TEST 3: State inference
// ============================================================
defineComponent({
  defaultState: { count: 0, active: false, name: 'test' },

  createComponent({ state }) {
    const a: number = state.count.get();
    const b: boolean = state.active.get();
    const c: string = state.name.get();

    // @ts-expect-error — count.get() returns number, not string
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
      getCount() {
        return state.count.get();
      },
      doubled() {
        return this.getCount() * 2;
      },
      tripled() {
        return this.getCount() * 3;
      },
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
    'click .item'({ settings, state }) {
      this.setValue('test');
      const v: string = settings.value;
      const i: number = state.index.get();

      // @ts-expect-error — nonExistent not on this
      this.nonExistent();
    },
  },

  onCreated({ settings, state }) {
    this.setValue('init');
    const v: string = settings.value;
    const i: number = state.index.get();

    // @ts-expect-error — value is string not number
    const bad: number = settings.value;
  },
});


// ============================================================
// TEST 6: Full realistic component
// ============================================================
defineComponent({
  tagName: 'ui-counter',
  defaultSettings: {
    min: 0,
    max: 100,
    step: 1,
    label: 'Counter',
  },
  defaultState: {
    count: 0,
    isDisabled: false,
  },

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
          dispatchEvent('change', { count: next });
        }
      },
      reset() {
        state.count.set(settings.min);
        dispatchEvent('reset', { count: settings.min });
      },
      getDisplayValue() {
        return `${settings.label}: ${state.count.get()}`;
      },
      // Self-referential: calls other methods via this
      incrementAndDisplay() {
        this.increment();
        return this.getDisplayValue();
      },
    };
  },

  events: {
    'click .increment'() {
      this.increment();
    },
    'click .decrement'() {
      this.decrement();
    },
    'click .reset'() {
      this.reset();
    },
  },

  onCreated({ settings }) {
    // Access methods via this in lifecycle
    const display = this.getDisplayValue();
    const l: string = settings.label;
  },
});


// ============================================================
// TEST 7: Parameter type checking via `this`
// ============================================================
defineComponent({
  createComponent() {
    return {
      greet(name: string, times: number) { return name.repeat(times); },
      test() {
        // @ts-expect-error — greet expects string, not number
        this.greet(123, 1);
      },
    };
  },
});


// ============================================================
// TEST 8: Return type flows through `this`
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
// TEST 9: `this` also has access to settings/state via ThisType union
// ============================================================
defineComponent({
  defaultSettings: { theme: 'dark' },
  defaultState: { visible: true },

  createComponent({ settings, state }) {
    return {
      toggle() {
        // Via closure (always works):
        const isVisible = state.visible.get();
        state.visible.set(!isVisible);
      },
      getTheme() {
        return settings.theme;
      },
      render() {
        // Self-reference via this:
        const theme = this.getTheme();
        this.toggle();
        // Also access settings/state via this (ThisType union):
        const t: string = this.settings.theme;
        const v: Signal<boolean> = this.state.visible;
      },
    };
  },
});


// ============================================================
// TEST 10: Verify that `self` as destructured param still
// creates circularity (negative control)
// ============================================================
declare function defineComponent_broken<
  M extends Record<string, (...args: any[]) => any>,
  S extends Record<string, any> = {},
>(options: {
  defaultSettings?: S;
  createComponent?: (params: { self: M; settings: S }) => M;
}): any;

defineComponent_broken({
  defaultSettings: { label: 'hello' },
  createComponent({ self, settings }) {
    return {
      foo() { return 1; },
      test() {
        // self is likely Record<string, (...args: any[]) => any> here
        // because M can't be inferred circularly
        self.foo();
        self.anythingGoes(); // probably no error — self is loose
      },
    };
  },
});
