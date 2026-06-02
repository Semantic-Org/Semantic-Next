import { describe, expect, it } from 'vitest';

const CDN = 'https://cdn.semantic-ui.com';
const VERSION = 'canary';

// /* @vite-ignore */ keeps Vite from trying to resolve these at transform time —
// the browser fetches the absolute URL directly, matching how the CDN is actually consumed.
const cdnImport = (pkg) => import(/* @vite-ignore */ `${CDN}/${pkg}@${VERSION}`);

describe('CDN Package: @semantic-ui/reactivity', () => {
  it('Signal — create, get, set, subscribe', async () => {
    const { Signal } = await cdnImport('reactivity');

    const count = new Signal(0);
    expect(count.get()).toBe(0);

    count.set(5);
    expect(count.get()).toBe(5);

    count.increment();
    expect(count.get()).toBe(6);

    count.decrement(3);
    expect(count.get()).toBe(3);
  });

  it('Signal — array helpers', async () => {
    const { Signal } = await cdnImport('reactivity');

    const items = new Signal(['a', 'b']);
    items.push('c');
    expect(items.get()).toEqual(['a', 'b', 'c']);
  });

  it('Signal — toggle boolean', async () => {
    const { Signal } = await cdnImport('reactivity');

    const flag = new Signal(false);
    flag.toggle();
    expect(flag.get()).toBe(true);
  });

  it('reaction tracks signal dependencies', async () => {
    const { Signal, reaction, flush } = await cdnImport('reactivity');

    const name = new Signal('Alice');
    let tracked;

    reaction(() => {
      tracked = name.get();
    });
    expect(tracked).toBe('Alice');

    name.set('Bob');
    flush();
    expect(tracked).toBe('Bob');
  });

  it('computed derives from multiple signals', async () => {
    const { Signal, computed, flush } = await cdnImport('reactivity');

    const a = new Signal(3);
    const b = new Signal(4);
    const sum = computed(() => a.get() + b.get());

    expect(sum.get()).toBe(7);

    a.set(10);
    flush();
    expect(sum.get()).toBe(14);
  });
});

describe('CDN Package: @semantic-ui/utils', () => {
  it('array utilities — unique, flatten, range', async () => {
    const { unique, flatten, range } = await cdnImport('utils');

    expect(unique([1, 2, 2, 3])).toEqual([1, 2, 3]);
    expect(flatten([[1, 2], [3, [4]]])).toEqual([1, 2, 3, 4]);
    expect(range(5)).toEqual([0, 1, 2, 3, 4]);
  });

  it('object utilities — get, keys, pick', async () => {
    const { get, keys, pick } = await cdnImport('utils');

    const obj = { user: { name: 'Alice', age: 30 } };
    expect(get(obj, 'user.name')).toBe('Alice');
    expect(keys(obj)).toEqual(['user']);
    expect(pick({ a: 1, b: 2, c: 3 }, 'a', 'c')).toEqual({ a: 1, c: 3 });
  });

  it('type checking — isArray, isString, isPlainObject', async () => {
    const { isArray, isString, isPlainObject } = await cdnImport('utils');

    expect(isArray([1, 2])).toBe(true);
    expect(isString('hello')).toBe(true);
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject([])).toBe(false);
  });

  it('string utilities — kebabToCamel, capitalize', async () => {
    const { kebabToCamel, capitalize } = await cdnImport('utils');

    expect(kebabToCamel('my-component-name')).toBe('myComponentName');
    expect(capitalize('hello world')).toBe('Hello world');
  });

  it('deep equality and cloning', async () => {
    const { isEqual, clone } = await cdnImport('utils');

    expect(isEqual({ a: [1, 2] }, { a: [1, 2] })).toBe(true);
    expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);

    const original = { nested: { value: 42 } };
    const cloned = clone(original);
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
  });
});

describe('CDN Package: @semantic-ui/query', () => {
  it('$ — select and manipulate DOM', async () => {
    const { $ } = await cdnImport('query');

    document.body.innerHTML = '<div class="test">Hello</div>';
    const el = $('.test');

    expect(el.exists()).toBe(true);
    expect(el.text()).toBe('Hello');

    el.addClass('active');
    expect(el.hasClass('active')).toBe(true);

    el.text('Updated');
    expect(el.text()).toBe('Updated');
  });

  it('$ — create elements from HTML', async () => {
    const { $ } = await cdnImport('query');

    const el = $('<div class="created">New Element</div>');
    expect(el.text()).toBe('New Element');
    expect(el.hasClass('created')).toBe(true);
  });

  it('$ — traversal methods', async () => {
    const { $ } = await cdnImport('query');

    document.body.innerHTML = `
      <div class="parent">
        <span class="child first">A</span>
        <span class="child second">B</span>
      </div>
    `;

    expect($('.parent').find('.child').length).toBe(2);
    expect($('.first').next().text()).toBe('B');
    expect($('.second').parent().hasClass('parent')).toBe(true);
  });
});

describe('CDN Package: @semantic-ui/component', () => {
  it('defineComponent — custom element with template and state', async () => {
    const { defineComponent } = await cdnImport('component');

    defineComponent({
      tagName: 'cdn-test-counter',
      template: '<span class="value">{count}</span>',
      defaultState: { count: 0 },
      createComponent: ({ state }) => ({
        increment() {
          state.count.increment();
        },
      }),
    });

    document.body.innerHTML = '<cdn-test-counter></cdn-test-counter>';
    const el = document.querySelector('cdn-test-counter');
    await customElements.whenDefined('cdn-test-counter');
    await el.updateComplete;

    expect(el.shadowRoot).toBeTruthy();
    expect(el.shadowRoot.querySelector('.value').textContent).toBe('0');
  });

  it('defineComponent — reactive template updates', async () => {
    const { defineComponent } = await cdnImport('component');

    defineComponent({
      tagName: 'cdn-test-greeter',
      template: '<span class="msg">Hello {name}</span>',
      defaultSettings: { name: 'World' },
    });

    document.body.innerHTML = '<cdn-test-greeter name="CDN"></cdn-test-greeter>';
    const el = document.querySelector('cdn-test-greeter');
    await customElements.whenDefined('cdn-test-greeter');
    await el.updateComplete;

    expect(el.shadowRoot.querySelector('.msg').textContent).toBe('Hello CDN');
  });
});
