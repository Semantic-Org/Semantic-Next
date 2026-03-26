import { defineComponent } from '@semantic-ui/component';
import { beforeEach, describe, expect, it } from 'vitest';

/*******************************
         Test Helpers
*******************************/

let tagCounter = 0;
function uniqueTag() {
  return `test-rerender-${++tagCounter}`;
}
function shadowText(el) {
  return el.shadowRoot.innerHTML.replace(/<!--[\s\S]*?-->/g, '').trim();
}
async function waitForUpdate(el) {
  await el.updateComplete;
  await new Promise(r => setTimeout(r, 0));
  await el.updateComplete;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

/*******************************
  rerender → expression
*******************************/

describe('rerender → expression', () => {
  it('reactive: inner expression updates when signal changes', async () => {
    const tag = uniqueTag();
    defineComponent({
      tagName: tag,
      template: '{#rerender key}<span>{name}</span>{/rerender}',
      defaultState: { key: 0, name: 'Alice' },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('Alice');

    el.template.state.name.set('Bob');
    el.template.state.key.increment();
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('Bob');
    expect(shadowText(el)).not.toContain('Alice');
  });

  it('non-reactive: inner expression updates when rerender key forces re-evaluation', async () => {
    const tag = uniqueTag();
    let callCount = 0;
    defineComponent({
      tagName: tag,
      template: '{#rerender version}<span>{getLabel}</span>{/rerender}',
      defaultState: { version: 0 },
      createComponent: ({ state }) => {
        const labels = ['first', 'second', 'third'];
        return {
          getLabel: () => {
            const v = state.version.get();
            return labels[v] || 'unknown';
          },
        };
      },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('first');

    el.template.state.version.set(1);
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('second');
    expect(shadowText(el)).not.toContain('first');
  });
});

/*******************************
  rerender → async → expression
*******************************/

describe('rerender → async → expression', () => {
  it('reactive: async content updates when signal changes inside rerender', async () => {
    const tag = uniqueTag();
    defineComponent({
      tagName: tag,
      template:
        '{#rerender key}{#async fetchData as result}<span>{result}</span>{loading}<span>loading</span>{/async}{/rerender}',
      defaultState: { key: 0, label: 'alpha' },
      createComponent: ({ state }) => ({
        async fetchData(lbl = state.label.get()) {
          await new Promise(r => setTimeout(r, 50));
          return `loaded:${lbl}`;
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    // Wait for initial async resolution
    await new Promise(r => setTimeout(r, 100));
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('loaded:alpha');

    el.template.state.label.set('beta');
    el.template.state.key.increment();
    await waitForUpdate(el);

    // Wait for new async resolution
    await new Promise(r => setTimeout(r, 100));
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('loaded:beta');
  });

  it('non-reactive: async function returns new data when rerender key changes', async () => {
    const tag = uniqueTag();
    let fetchCount = 0;
    defineComponent({
      tagName: tag,
      template:
        '{#rerender version}{#async getData as result}<span>{result}</span>{loading}<span>loading</span>{/async}{/rerender}',
      defaultState: { version: 0 },
      createComponent: ({ state }) => ({
        async getData(v = state.version.get()) {
          await new Promise(r => setTimeout(r, 50));
          return `data-v${v}`;
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    await new Promise(r => setTimeout(r, 100));
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('data-v0');

    el.template.state.version.set(1);
    await waitForUpdate(el);

    await new Promise(r => setTimeout(r, 100));
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('data-v1');
    expect(shadowText(el)).not.toContain('data-v0');
  });
});

/*******************************
  rerender → if → expression
*******************************/

describe('rerender → if → expression', () => {
  it('reactive: conditional branch switches when signal changes inside rerender', async () => {
    const tag = uniqueTag();
    defineComponent({
      tagName: tag,
      template: '{#rerender key}{#if active}<span>ON:{label}</span>{else}<span>OFF:{label}</span>{/if}{/rerender}',
      defaultState: { key: 0, active: true, label: 'status' },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('ON:status');

    el.template.state.active.toggle();
    el.template.state.key.increment();
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('OFF:status');
    expect(shadowText(el)).not.toContain('ON:');
  });

  it('non-reactive: conditional updates with plain data when rerender key changes', async () => {
    const tag = uniqueTag();
    defineComponent({
      tagName: tag,
      template:
        '{#rerender version}{#if getStatus}<span>VISIBLE:{getMessage}</span>{else}<span>HIDDEN</span>{/if}{/rerender}',
      defaultState: { version: 0 },
      createComponent: ({ state }) => ({
        getStatus: () => state.version.get() % 2 === 0,
        getMessage: () => `v${state.version.get()}`,
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('VISIBLE:v0');

    el.template.state.version.set(1);
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('HIDDEN');
    expect(shadowText(el)).not.toContain('VISIBLE');

    el.template.state.version.set(2);
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('VISIBLE:v2');
  });
});

/*******************************
  rerender → each → expression
*******************************/

describe('rerender → each → expression', () => {
  it('reactive: each items update when signal changes inside rerender', async () => {
    const tag = uniqueTag();
    defineComponent({
      tagName: tag,
      template: '{#rerender key}{#each item in items}<span>{item.name}</span>{/each}{/rerender}',
      defaultState: {
        key: 0,
        items: [{ name: 'Red' }, { name: 'Green' }],
      },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('Red');
    expect(shadowText(el)).toContain('Green');

    el.template.state.items.set([{ name: 'Blue' }, { name: 'Yellow' }, { name: 'Purple' }]);
    el.template.state.key.increment();
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('Blue');
    expect(shadowText(el)).toContain('Yellow');
    expect(shadowText(el)).toContain('Purple');
    expect(shadowText(el)).not.toContain('Red');
    expect(shadowText(el)).not.toContain('Green');
  });

  it('non-reactive: each renders new plain data when rerender key changes', async () => {
    const tag = uniqueTag();
    defineComponent({
      tagName: tag,
      template: '{#rerender version}{#each item in getItems}<span>{item.label}:{item.count}</span>{/each}{/rerender}',
      defaultState: { version: 0 },
      createComponent: ({ state }) => ({
        getItems: () => {
          const v = state.version.get();
          return v === 0
            ? [{ label: 'A', count: 1 }, { label: 'B', count: 2 }]
            : [{ label: 'X', count: 10 }, { label: 'Y', count: 20 }, { label: 'Z', count: 30 }];
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('A:1');
    expect(shadowText(el)).toContain('B:2');

    el.template.state.version.set(1);
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('X:10');
    expect(shadowText(el)).toContain('Y:20');
    expect(shadowText(el)).toContain('Z:30');
    expect(shadowText(el)).not.toContain('A:1');
    expect(shadowText(el)).not.toContain('B:2');
  });
});
