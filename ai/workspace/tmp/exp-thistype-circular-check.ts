/**
 * Isolate: does putting M in the callback parameter type prevent inference?
 */

interface Signal<T> {
  get(): T;
  set(value: T): void;
  value: T;
}

// Case 1: M only in return — works (proven earlier)
declare function test1<M extends Record<string, any>>(
  options: { create: () => M & ThisType<M> }
): void;

test1({
  create() {
    return {
      foo() { return 1; },
      test() {
        // @ts-expect-error
        this.nonExistent();
      },
    };
  },
});

// Case 2: M in param AND return — does it break?
declare function test2<M extends Record<string, any>>(
  options: { create: (params: { self: M }) => M & ThisType<M> }
): void;

test2({
  create({ self }) {
    return {
      foo() { return 1; },
      test() {
        this.nonExistent(); // does this error?
      },
    };
  },
});

// Case 3: M in param via wrapper, but with NoInfer
declare function test3<M extends Record<string, any>>(
  options: { create: (params: { self: NoInfer<M> }) => M & ThisType<M> }
): void;

test3({
  create({ self }) {
    return {
      foo() { return 1; },
      test() {
        this.nonExistent(); // does this error?
      },
    };
  },
});

// Case 4: M not in param at all, but other stuff is
interface Params4<S> { settings: S; el: HTMLElement; }

declare function test4<M extends Record<string, any>, S extends Record<string, any>>(
  options: { defaultSettings?: S; create: (params: Params4<S>) => M & ThisType<M> }
): void;

test4({
  defaultSettings: { label: 'hi' },
  create({ settings }) {
    return {
      foo() { return 1; },
      getLabel() { return settings.label; },
      test() {
        // @ts-expect-error
        this.nonExistent();
      },
    };
  },
});

// Case 5: M in param but behind a separate interface (not nested in callback param)
interface Params5<S> { settings: S; el: HTMLElement; }

declare function test5<M extends Record<string, any>, S extends Record<string, any>>(
  options: {
    defaultSettings?: S;
    create: (params: Params5<S>) => M & ThisType<M & Params5<S>>;
    onCreated?: (this: M, params: Params5<S>) => void;
  }
): void;

test5({
  defaultSettings: { label: 'hi' },
  create({ settings }) {
    return {
      foo() { return 1; },
      test() {
        // @ts-expect-error
        this.nonExistent();
        const l: string = this.settings.label;
      },
    };
  },
  onCreated({ settings }) {
    this.foo();
    // @ts-expect-error
    this.nonExistent();
  },
});
