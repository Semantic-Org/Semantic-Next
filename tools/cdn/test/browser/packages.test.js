import { beforeAll, describe, expect, it } from 'vitest';

const CDN = 'https://cdn.semantic-ui.com';
const VERSION = 'canary';

/**
 * Test individual SUI packages loaded from the CDN via import map.
 * Mirrors real user usage: import map script + bare specifier imports.
 */

// Load the CDN import map once before all tests
beforeAll(async () => {
  const script = document.createElement('script');
  script.src = `${CDN}/importmap@${VERSION}.js`;
  document.head.appendChild(script);

  // Wait for import map to be injected
  await new Promise(resolve => {
    const check = () => {
      if (document.querySelector('script[type="importmap"]')) { resolve(); }
      else { setTimeout(check, 10); }
    };
    check();
  });
});

describe('CDN Package: @semantic-ui/reactivity', () => {
  it('Signal — create, get, set, subscribe', async () => {
    const { Signal } = await import('@semantic-ui/reactivity');

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
    const { Signal } = await import('@semantic-ui/reactivity');

    const items = new Signal(['a', 'b']);
    items.push('c');
    expect(items.get()).toEqual(['a', 'b', 'c']);
  });

  it('Signal — toggle boolean', async () => {
    const { Signal } = await import('@semantic-ui/reactivity');

    const flag = new Signal(false);
    flag.toggle();
    expect(flag.get()).toBe(true);
  });

  it('Reaction — tracks signal dependencies', async () => {
    const { Signal, Reaction } = await import('@semantic-ui/reactivity');

    const name = new Signal('Alice');
    let tracked;

    Reaction.create(() => {
      tracked = name.get();
    });
    Reaction.flush();
    expect(tracked).toBe('Alice');

    name.set('Bob');
    Reaction.flush();
    expect(tracked).toBe('Bob');
  });

  it('Signal.computed — derives from multiple signals', async () => {
    const { Signal, Reaction } = await import('@semantic-ui/reactivity');

    const a = new Signal(3);
    const b = new Signal(4);
    const sum = Signal.computed(() => a.get() + b.get());

    expect(sum.get()).toBe(7);

    a.set(10);
    Reaction.flush();
    expect(sum.get()).toBe(14);
  });
});

describe('CDN Package: @semantic-ui/utils', () => {
  it('array utilities — unique, flatten, range', async () => {
    const { unique, flatten, range } = await import('@semantic-ui/utils');

    expect(unique([1, 2, 2, 3])).toEqual([1, 2, 3]);
    expect(flatten([[1, 2], [3, [4]]])).toEqual([1, 2, 3, 4]);
    expect(range(5)).toEqual([0, 1, 2, 3, 4]);
  });

  it('object utilities — get, keys, pick', async () => {
    const { get, keys, pick } = await import('@semantic-ui/utils');

    const obj = { user: { name: 'Alice', age: 30 } };
    expect(get(obj, 'user.name')).toBe('Alice');
    expect(keys(obj)).toEqual(['user']);
    expect(pick({ a: 1, b: 2, c: 3 }, 'a', 'c')).toEqual({ a: 1, c: 3 });
  });

  it('type checking — isArray, isString, isPlainObject', async () => {
    const { isArray, isString, isPlainObject } = await import('@semantic-ui/utils');

    expect(isArray([1, 2])).toBe(true);
    expect(isString('hello')).toBe(true);
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject([])).toBe(false);
  });

  it('string utilities — kebabToCamel, capitalize', async () => {
    const { kebabToCamel, capitalize } = await import('@semantic-ui/utils');

    expect(kebabToCamel('my-component-name')).toBe('myComponentName');
    expect(capitalize('hello world')).toBe('Hello world');
  });

  it('deep equality and cloning', async () => {
    const { isEqual, clone } = await import('@semantic-ui/utils');

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
    const { $ } = await import('@semantic-ui/query');

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
    const { $ } = await import('@semantic-ui/query');

    const el = $('<div class="created">New Element</div>');
    expect(el.text()).toBe('New Element');
    expect(el.hasClass('created')).toBe(true);
  });

  it('$ — traversal methods', async () => {
    const { $ } = await import('@semantic-ui/query');

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
    const { defineComponent } = await import('@semantic-ui/component');

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
    const { defineComponent } = await import('@semantic-ui/component');

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
