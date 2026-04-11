/**
 * DEFINITIVE SOLUTION: ThisType<M> for defineComponent self-typing.
 *
 * Approach: The return type of createComponent is `M & ThisType<M & CallParams<St, S>>`.
 * TypeScript infers M from the object literal shape, then feeds it into ThisType.
 * Inside the returned object's methods, `this` is typed as `M & CallParams<St, S>`.
 *
 * This matches the runtime behavior: Template.call() uses func.apply(thisContext, args)
 * where thisContext is the instance (which has all M's methods merged in).
 *
 * The `self` parameter in CallParams is typed as a loose `Record<string, (...args: any[]) => any>`
 * so it doesn't create circular inference. Users who prefer `self` get autocomplete for
 * method names but `any` return types. Users who prefer `this` get full typing.
 *
 * KEY INSIGHT: This is not a compromise — the runtime already binds `this` to the instance
 * when calling event handlers and lifecycle hooks via Template.call().
 */

import { Query, QueryOptions } from '@semantic-ui/query';
import { Reaction, Signal, SignalOptions } from '@semantic-ui/reactivity';
import { Template, CallParams, RenderedTemplate, DataContext } from '@semantic-ui/templating';
import { TemplateHelpers } from '@semantic-ui/templating';


// ============================================================
// OPTION A: Minimal change — just add ThisType<M> to createComponent return
//
// Pro: Smallest diff, backward compatible
// Con: `self` param stays loose (Record<string, any>)
//      Users must use `this` for typed self-reference
// ============================================================

interface DefineComponentOptions_A<
  TState extends Record<string, any>,
  TSettings extends Record<string, any>,
  TComponentInstance extends Record<string, any>,
  TProperties extends Record<string, any>,
> {
  tagName?: string;
  template?: string;
  ast?: any;
  css?: string;
  pageCSS?: string;
  delegatesFocus?: boolean;
  templateName?: string;

  createComponent?: (
    params: CallParams<TState, TSettings, TComponentInstance, TProperties>
  ) => TComponentInstance & ThisType<TComponentInstance & CallParams<TState, TSettings, TComponentInstance, TProperties>>;

  events?: Record<
    string,
    (
      this: TComponentInstance,
      params: CallParams<TState, TSettings, TComponentInstance, TProperties> & {
        event: Event;
        isDeep: boolean;
        target: HTMLElement;
        value: any;
        data: Record<string, any>;
      }
    ) => void
  >;
  keys?: Record<
    string,
    (
      this: TComponentInstance,
      params: CallParams<TState, TSettings, TComponentInstance, TProperties> & {
        event: KeyboardEvent;
        inputFocused: boolean;
        repeatedKey: boolean;
      }
    ) => void | boolean
  >;

  onCreated?: (this: TComponentInstance, params: CallParams<TState, TSettings, TComponentInstance, TProperties>) => void;
  onRendered?: (this: TComponentInstance, params: CallParams<TState, TSettings, TComponentInstance, TProperties>) => void;
  onUpdated?: (this: TComponentInstance, params: CallParams<TState, TSettings, TComponentInstance, TProperties>) => void;
  onDestroyed?: (this: TComponentInstance, params: CallParams<TState, TSettings, TComponentInstance, TProperties>) => void;
  onThemeChanged?: (this: TComponentInstance, params: CallParams<TState, TSettings, TComponentInstance, TProperties>) => void;
  onAttributeChanged?: (attributeName: string, oldValue: string | null, newValue: string | null) => void;

  defaultSettings?: TSettings;
  defaultState?: TState;
  subTemplates?: Record<string, Function>;
  renderingEngine?: string;
  properties?: TProperties;
  componentSpec?: boolean;
  plural?: boolean;
  singularTag?: string;
}

declare function defineComponent_A<
  TState extends Record<string, any> = Record<string, any>,
  TSettings extends Record<string, any> = Record<string, any>,
  TComponentInstance extends Record<string, any> = Record<string, any>,
  TProperties extends Record<string, any> = Record<string, any>,
>(
  options: DefineComponentOptions_A<TState, TSettings, TComponentInstance, TProperties>,
): any;


// ============================================================
// TEST A1: Basic self-reference via `this`
// ============================================================
defineComponent_A({
  createComponent({ el }) {
    return {
      foo() { return 1; },
      bar(x: string) { return x.length; },
      callSelf() {
        const n: number = this.foo();
        const m: number = this.bar('test');
        // @ts-expect-error
        this.nonExistent();
      },
    };
  },
});

// ============================================================
// TEST A2: Settings + State + this
// ============================================================
defineComponent_A({
  defaultSettings: { label: 'hello', count: 42 },
  defaultState: { active: false },

  createComponent({ settings, state }) {
    const l: string = settings.label;
    // @ts-expect-error
    const bad: number = settings.label;

    return {
      getLabel() { return settings.label; },
      isActive() { return state.active.get(); },
      display() {
        // this.getLabel() — typed via ThisType
        const label: string = this.getLabel();
        return `${label}: ${this.isActive()}`;
      },
    };
  },
});

// ============================================================
// TEST A3: Events and lifecycle hooks with `this`
// ============================================================
defineComponent_A({
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
      // @ts-expect-error
      this.nonExistent();
    },
  },

  onCreated({ settings }) {
    this.setValue('init');
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

// ============================================================
// TEST A4: `self` still works (loose) alongside `this` (precise)
// ============================================================
defineComponent_A({
  createComponent({ self }) {
    return {
      foo() { return 1; },
      bar() {
        // `self` is loose — works but returns any:
        self.foo();
        // `this` is precise:
        const n: number = this.foo();
        // @ts-expect-error — this.nonExistent doesn't exist
        this.nonExistent();
      },
    };
  },
});

// ============================================================
// TEST A5: Full realistic component
// ============================================================
defineComponent_A({
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
          dispatchEvent('change', { count: next });
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
// TEST A6: Parameter type checking
// ============================================================
defineComponent_A({
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
// TEST A7: Async methods
// ============================================================
defineComponent_A({
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
// TEST A8: Access settings/state via `this` (ThisType union)
// ============================================================
defineComponent_A({
  defaultSettings: { theme: 'dark' },
  defaultState: { visible: true },

  createComponent({ settings, state }) {
    return {
      toggle() { state.visible.set(!state.visible.get()); },
      getTheme() { return settings.theme; },
      render() {
        this.toggle();
        // settings also accessible via this (from CallParams in ThisType):
        const t: string = this.settings.theme;
      },
    };
  },
});

// ============================================================
// TEST A9: Generic methods (own type params)
// ============================================================
defineComponent_A({
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
// TEST A10: Keys handler
// ============================================================
defineComponent_A({
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
