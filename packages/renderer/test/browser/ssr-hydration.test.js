import { defineComponent, renderToString } from '@semantic-ui/component';
import { $ } from '@semantic-ui/query';
import { Reaction } from '@semantic-ui/reactivity';
import { beforeEach, describe, expect, it } from 'vitest';

/*******************************
       SSR Hydration Tests

 Each test server-renders a component via renderToString,
 injects the DSD HTML into the page (browser parses it and
 creates the shadow root), then verifies:
   1. Hydration wires up correctly (el.component exists)
   2. Server content is preserved (no flash)
   3. Reactivity works after hydration
*******************************/

let tagCounter = 0;
function uniqueTag() {
  return `ssr-hydration-${++tagCounter}`;
}

function shadowHTML(el) {
  return el.shadowRoot.innerHTML
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Server-render a component and inject DSD into the page.
// The browser parses the DSD, creating a shadow root.
// When the custom element upgrades, connectedCallback hydrates it.
async function ssrAndHydrate(opts, attrs = {}) {
  const tag = uniqueTag();
  const Component = defineComponent({ tagName: tag, renderingEngine: 'native', ...opts });
  const html = renderToString(Component, attrs);

  // Inject into page — browser parses DSD
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  const el = wrapper.firstElementChild;

  // Append triggers connectedCallback → hydration
  const rendered = $(el).onNext('rendered');
  document.body.appendChild(el);
  await rendered;

  return el;
}

async function waitForUpdate(el) {
  await new Promise(r => setTimeout(r, 0));
}

beforeEach(() => {
  document.body.innerHTML = '';
});

/*******************************
     1. Static HTML
*******************************/

describe('SSR hydration — static HTML', () => {
  it('hydrates a static template without expressions', async () => {
    const el = await ssrAndHydrate({
      template: '<div class="box">Hello World</div>',
    });

    expect(el.component).toBeDefined();
    expect(el.shadowRoot).toBeTruthy();
    expect(shadowHTML(el)).toBe('<div class="box">Hello World</div>');
  });

  it('preserves nested static structure', async () => {
    const el = await ssrAndHydrate({
      template: '<header>H</header><main><div class="inner">Content</div></main><footer>F</footer>',
    });

    expect(shadowHTML(el)).toBe('<header>H</header><main><div class="inner">Content</div></main><footer>F</footer>');
  });
});

/*******************************
     2. Text expressions
*******************************/

describe('SSR hydration — text expressions', () => {
  it('hydrates text expression with default value', async () => {
    const el = await ssrAndHydrate({
      template: '<div>{greeting}</div>',
      defaultSettings: { greeting: 'Hello' },
    });

    expect(shadowHTML(el)).toBe('<div>Hello</div>');
  });

  it('hydrates text expression with attribute override', async () => {
    const el = await ssrAndHydrate({
      template: '<div>{greeting}, {name}!</div>',
      defaultSettings: { greeting: 'Hello', name: 'World' },
    }, { greeting: 'Howdy', name: 'Partner' });

    expect(shadowHTML(el)).toBe('<div>Howdy, Partner!</div>');
  });

  it('text expression is reactive after hydration', async () => {
    const el = await ssrAndHydrate({
      template: '<span>{count}</span>',
      defaultState: { count: 0 },
      createComponent: ({ state }) => ({
        increment() {
          state.count.increment();
        },
      }),
    });

    expect(shadowHTML(el)).toBe('<span>0</span>');

    const updated = $(el).onNext('updated');
    el.component.increment();
    await updated;

    expect(shadowHTML(el)).toBe('<span>1</span>');
  });

  it('multiple expressions preserve surrounding text', async () => {
    const el = await ssrAndHydrate({
      template: '<p>Hello {name}, you have {count} items</p>',
      createComponent: () => ({ name: 'Alice', count: 42 }),
    });

    expect(shadowHTML(el)).toBe('<p>Hello Alice, you have 42 items</p>');
  });
});

/*******************************
     3. Attribute expressions
*******************************/

describe('SSR hydration — attribute expressions', () => {
  it('hydrates dynamic class attribute', async () => {
    const el = await ssrAndHydrate({
      template: '<div class="{theme}" data-count="{count}">{count} items</div>',
      defaultState: { theme: 'dark', count: 3 },
    });

    const div = el.shadowRoot.querySelector('div');
    expect(div.getAttribute('class')).toBe('dark');
    expect(div.getAttribute('data-count')).toBe('3');
  });

  it('attribute is reactive after hydration', async () => {
    const el = await ssrAndHydrate({
      template: '<div class="{cls}">text</div>',
      defaultState: { cls: 'before' },
      createComponent: ({ state }) => ({
        swap() {
          state.cls.set('after');
        },
      }),
    });

    expect(el.shadowRoot.querySelector('div').getAttribute('class')).toBe('before');

    const updated = $(el).onNext('updated');
    el.component.swap();
    await updated;

    expect(el.shadowRoot.querySelector('div').getAttribute('class')).toBe('after');
  });

  it('mixed static + dynamic attribute', async () => {
    const el = await ssrAndHydrate({
      template: '<div class="base {mod}">text</div>',
      createComponent: () => ({ mod: 'extra' }),
    });

    expect(el.shadowRoot.querySelector('div').getAttribute('class')).toBe('base extra');
  });
});

/*******************************
     4. Conditionals
*******************************/

describe('SSR hydration — conditionals', () => {
  it('hydrates true branch', async () => {
    const el = await ssrAndHydrate({
      template: '<div>{#if show}<span class="on">Visible</span>{else}<span class="off">Hidden</span>{/if}</div>',
      defaultState: { show: true },
    });

    expect(shadowHTML(el)).toBe('<div><span class="on">Visible</span></div>');
  });

  it('hydrates false branch', async () => {
    const el = await ssrAndHydrate({
      template: '<div>{#if show}<span>Yes</span>{else}<span>No</span>{/if}</div>',
      defaultState: { show: false },
    });

    expect(shadowHTML(el)).toBe('<div><span>No</span></div>');
  });

  it('conditional is reactive after hydration', async () => {
    const el = await ssrAndHydrate({
      template: '<div>{#if show}<span>Visible</span>{else}<span>Hidden</span>{/if}</div>',
      defaultState: { show: true },
      createComponent: ({ state }) => ({
        toggle() {
          state.show.toggle();
        },
      }),
    });

    expect(shadowHTML(el)).toBe('<div><span>Visible</span></div>');

    const updated = $(el).onNext('updated');
    el.component.toggle();
    await updated;

    expect(shadowHTML(el)).toBe('<div><span>Hidden</span></div>');
  });

  it('if/else-if/else — middle branch', async () => {
    const el = await ssrAndHydrate({
      template: '{#if is mode "a"}<span>A</span>{else if is mode "b"}<span>B</span>{else}<span>C</span>{/if}',
      defaultState: { mode: 'b' },
    });

    expect(shadowHTML(el)).toBe('<span>B</span>');
  });
});

/*******************************
     5. Each loops
*******************************/

describe('SSR hydration — each loops', () => {
  it('hydrates simple list', async () => {
    const el = await ssrAndHydrate({
      template: '<ul>{#each item in items}<li>{item}</li>{/each}</ul>',
      defaultState: { items: ['Alpha', 'Beta', 'Gamma'] },
    });

    expect(shadowHTML(el)).toBe('<ul><li>Alpha</li><li>Beta</li><li>Gamma</li></ul>');
  });

  it('hydrates each with per-item attributes', async () => {
    const el = await ssrAndHydrate({
      template: '{#each item in items}<div data-id="{item.id}">{item.name}</div>{/each}',
      createComponent: () => ({
        items: [{ id: 'x1', name: 'One' }, { id: 'x2', name: 'Two' }],
      }),
    });

    expect(shadowHTML(el)).toBe('<div data-id="x1">One</div><div data-id="x2">Two</div>');
  });

  it('hydrates each with index', async () => {
    const el = await ssrAndHydrate({
      template: '{#each item, i in items}<span>{i}:{item}</span>{/each}',
      createComponent: () => ({ items: ['a', 'b'] }),
    });

    expect(shadowHTML(el)).toBe('<span>0:a</span><span>1:b</span>');
  });

  it('hydrates empty list with else content', async () => {
    const el = await ssrAndHydrate({
      template: '{#each item in items}<li>{item}</li>{else}<p>none</p>{/each}',
      createComponent: () => ({ items: [] }),
    });

    expect(shadowHTML(el)).toBe('<p>none</p>');
  });

  it('hydrates object iteration', async () => {
    const el = await ssrAndHydrate({
      template: '{#each val, key in colors}<span>{key}={val}</span>{/each}',
      createComponent: () => ({ colors: { r: 'red', g: 'green' } }),
    });

    expect(shadowHTML(el)).toBe('<span>r=red</span><span>g=green</span>');
  });
});

/*******************************
     6. Snippets
*******************************/

describe('SSR hydration — snippets', () => {
  it('hydrates snippet', async () => {
    const el = await ssrAndHydrate({
      template:
        '{#snippet tag}<span class="tag">[{label}]</span>{/snippet}<div>{>tag label="One"} {>tag label="Two"}</div>',
    });

    expect(shadowHTML(el)).toBe('<div><span class="tag">[One]</span> <span class="tag">[Two]</span></div>');
  });

  it('hydrates snippet inside each', async () => {
    const el = await ssrAndHydrate({
      template:
        '{#snippet badge}<span>[{label}]</span>{/snippet}{#each item in items}<div>{>badge label=item.name}</div>{/each}',
      createComponent: () => ({
        items: [{ name: 'Red' }, { name: 'Blue' }],
      }),
    });

    expect(shadowHTML(el)).toBe('<div><span>[Red]</span></div><div><span>[Blue]</span></div>');
  });
});

/*******************************
     7. Subtemplates
*******************************/

describe('SSR hydration — subtemplates', () => {
  it('hydrates subtemplate', async () => {
    const child = defineComponent({
      renderingEngine: 'native',
      template: '<em>{msg}</em>',
    });

    const el = await ssrAndHydrate({
      template: '<div>{>child msg="From subtemplate"}</div>',
      subTemplates: { child },
    });

    expect(shadowHTML(el)).toBe('<div><em>From subtemplate</em></div>');
  });

  it('hydrates subtemplate between static siblings', async () => {
    const child = defineComponent({
      renderingEngine: 'native',
      template: '<span class="sub">{text}</span>',
    });

    const el = await ssrAndHydrate({
      template: '<div class="before">A</div>{>child text="B"}<div class="after">C</div>',
      subTemplates: { child },
    });

    expect(shadowHTML(el)).toBe('<div class="before">A</div><span class="sub">B</span><div class="after">C</div>');
  });
});

/*******************************
     8. Nested blocks
*******************************/

describe('SSR hydration — nested blocks', () => {
  it('hydrates if inside each', async () => {
    const el = await ssrAndHydrate({
      template:
        '{#each item in items}<div>{#if item.active}<b>{item.name}</b>{else}<i>{item.name}</i>{/if}</div>{/each}',
      createComponent: () => ({
        items: [{ name: 'Alice', active: true }, { name: 'Bob', active: false }],
      }),
    });

    expect(shadowHTML(el)).toBe('<div><b>Alice</b></div><div><i>Bob</i></div>');
  });

  it('hydrates each inside if', async () => {
    const el = await ssrAndHydrate({
      template: '<div>{#if show}<ul>{#each item in items}<li>{item}</li>{/each}</ul>{else}<p>Nothing</p>{/if}</div>',
      defaultState: { show: true, items: ['X', 'Y', 'Z'] },
    });

    expect(shadowHTML(el)).toBe('<div><ul><li>X</li><li>Y</li><li>Z</li></ul></div>');
  });
});

/*******************************
     9. Async (loading state)
*******************************/

describe('SSR hydration — async blocks', () => {
  it('server renders loading content, client resolves', async () => {
    const el = await ssrAndHydrate({
      template:
        '{#async fetchData as result}<div class="ok">{result}</div>{loading}<div class="wait">Loading...</div>{/async}',
      createComponent: () => ({
        fetchData: () => new Promise(resolve => setTimeout(() => resolve('Done'), 50)),
      }),
    });

    // Server rendered loading content — preserved during hydration
    // Client promise fires and resolves
    await new Promise(r => setTimeout(r, 100));
    await waitForUpdate(el);

    expect(shadowHTML(el)).toBe('<div class="ok">Done</div>');
  });
});

/*******************************
     10. Rerender block
*******************************/

describe('SSR hydration — rerender', () => {
  it('hydrates rerender block', async () => {
    const el = await ssrAndHydrate({
      template: '<div>{#rerender key}<span>Version: {key}</span>{/rerender}</div>',
      defaultState: { key: 0 },
    });

    expect(shadowHTML(el)).toContain('Version: 0');
  });
});

/*******************************
     11. Guard block
*******************************/

describe('SSR hydration — guard', () => {
  it('hydrates guard block with computed value', async () => {
    const el = await ssrAndHydrate({
      template: '<div>{#guard getCategory}<span>Category: {getCategory}</span>{/guard}</div>',
      defaultState: { level: 'low' },
      createComponent: ({ state }) => ({
        getCategory: () => state.level.get() === 'high' ? 'premium' : 'basic',
      }),
    });

    expect(shadowHTML(el)).toContain('Category: basic');
  });
});

/*******************************
     12. Slots
*******************************/

describe('SSR hydration — slots', () => {
  it('hydrates default slot', async () => {
    const el = await ssrAndHydrate({
      template: '<div>{>slot}</div>',
    });

    expect(shadowHTML(el)).toBe('<div><slot></slot></div>');
  });

  it('hydrates named slots', async () => {
    const el = await ssrAndHydrate({
      template: '<header>{>slot header}</header><main>{>slot}</main>',
    });

    expect(shadowHTML(el)).toBe('<header><slot name="header"></slot></header><main><slot></slot></main>');
  });
});

/*******************************
     13. Unsafe HTML
*******************************/

describe('SSR hydration — unsafe HTML', () => {
  it('hydrates unsafe HTML expression', async () => {
    const el = await ssrAndHydrate({
      template: '<div>{#html content}</div>',
      createComponent: () => ({
        content: '<b>Bold</b> and <i>italic</i>',
      }),
    });

    expect(shadowHTML(el)).toBe('<div><b>Bold</b> and <i>italic</i></div>');
  });

  it('unsafe HTML is reactive after hydration', async () => {
    const el = await ssrAndHydrate({
      template: '<div>{#html content}</div>',
      defaultState: { content: '<b>Before</b>' },
      createComponent: ({ state }) => ({
        swap() {
          state.content.set('<em>After</em>');
        },
      }),
    });

    expect(shadowHTML(el)).toBe('<div><b>Before</b></div>');

    const updated = $(el).onNext('updated');
    el.component.swap();
    await updated;

    expect(shadowHTML(el)).toBe('<div><em>After</em></div>');
  });
});

/*******************************
     14. isServer / isClient
*******************************/

describe('SSR hydration — environment guards', () => {
  it('server renders isServer branch, client swaps to isClient', async () => {
    const el = await ssrAndHydrate({
      template:
        '<div>{#if isServer}<span class="s">Server</span>{/if}{#if isClient}<span class="c">Client</span>{/if}</div>',
    });

    // After hydration, isClient is true and isServer is false
    expect(el.shadowRoot.querySelector('.c')).toBeTruthy();
    expect(el.shadowRoot.querySelector('.s')).toBeFalsy();
  });
});

/*******************************
     15. Each with conditional per item
*******************************/

describe('SSR hydration — each with per-item conditional', () => {
  it('hydrates conditional inside each items', async () => {
    const el = await ssrAndHydrate({
      template:
        '{#each item in items}<div>{#if item.active}<b>{item.name}</b>{else}<i>{item.name}</i>{/if}</div>{/each}',
      createComponent: () => ({
        items: [
          { name: 'Alice', active: true },
          { name: 'Bob', active: false },
          { name: 'Carol', active: true },
        ],
      }),
    });

    const divs = el.shadowRoot.querySelectorAll('div');
    expect(divs.length).toBe(3);
    expect(divs[0].querySelector('b').textContent).toBe('Alice');
    expect(divs[1].querySelector('i').textContent).toBe('Bob');
    expect(divs[2].querySelector('b').textContent).toBe('Carol');
  });
});

/*******************************
     16. Snippet inside each
*******************************/

describe('SSR hydration — snippet inside each', () => {
  it('hydrates snippet invoked per each item', async () => {
    const el = await ssrAndHydrate({
      template:
        '{#snippet badge}<span class="b">[{label}]</span>{/snippet}{#each item in items}<div>{>badge label=item.name}</div>{/each}',
      createComponent: () => ({
        items: [{ name: 'Red' }, { name: 'Green' }, { name: 'Blue' }],
      }),
    });

    const badges = el.shadowRoot.querySelectorAll('.b');
    expect(badges.length).toBe(3);
    expect(badges[0].textContent).toBe('[Red]');
    expect(badges[2].textContent).toBe('[Blue]');
  });
});

/*******************************
     17. Multi-branch conditional
*******************************/

describe('SSR hydration — multi-branch conditional', () => {
  it('hydrates else-if branch and reacts to change', async () => {
    const el = await ssrAndHydrate({
      template:
        '<div>{#if is mode "a"}<span>A</span>{else if is mode "b"}<span>B</span>{else}<span>C</span>{/if}</div>',
      defaultState: { mode: 'b' },
      createComponent: ({ state }) => ({
        setMode(m) {
          state.mode.set(m);
        },
      }),
    });

    expect(shadowHTML(el)).toBe('<div><span>B</span></div>');

    const updated = $(el).onNext('updated');
    el.component.setMode('a');
    await updated;

    expect(shadowHTML(el)).toBe('<div><span>A</span></div>');
  });
});

/*******************************
     18. Object iteration
*******************************/

describe('SSR hydration — object iteration', () => {
  it('hydrates object each loop', async () => {
    const el = await ssrAndHydrate({
      template: '<div>{#each val, key in colors}<span style="color:{val}">{key} </span>{/each}</div>',
      createComponent: () => ({
        colors: { red: '#e74c3c', green: '#2ecc71', blue: '#3498db' },
      }),
    });

    const spans = el.shadowRoot.querySelectorAll('span');
    expect(spans.length).toBe(3);
    expect(spans[0].textContent).toBe('red ');
    expect(spans[0].getAttribute('style')).toContain('#e74c3c');
  });
});

/*******************************
     Hydration contract
*******************************/

describe('SSR hydration — contract', () => {
  it('el.component is available after hydration', async () => {
    const el = await ssrAndHydrate({
      template: '<div>{label}</div>',
      createComponent: () => ({
        label: 'test',
        getLabel() {
          return 'test';
        },
      }),
    });

    expect(el.component).toBeDefined();
    expect(el.component.getLabel()).toBe('test');
  });

  it('el.dataContext contains state signals', async () => {
    const el = await ssrAndHydrate({
      template: '<div>{count}</div>',
      defaultState: { count: 5 },
    });

    expect(el.dataContext).toBeDefined();
    expect(el.dataContext.count).toBeDefined();
    expect(el.dataContext.count.get()).toBe(5);
  });

  it('el.settings reads reflect values', async () => {
    const el = await ssrAndHydrate({
      template: '<div>{color}</div>',
      defaultSettings: { color: 'blue' },
    });

    expect(el.settings.color).toBe('blue');
  });

  it('fires created and rendered events', async () => {
    const tag = uniqueTag();
    const Component = defineComponent({
      tagName: tag,
      renderingEngine: 'native',
      template: '<div>test</div>',
    });
    const html = renderToString(Component);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    const el = wrapper.firstElementChild;

    const events = [];
    el.addEventListener('created', () => events.push('created'));
    el.addEventListener('rendered', () => events.push('rendered'));

    const rendered = $(el).onNext('rendered');
    document.body.appendChild(el);
    await rendered;

    expect(events).toContain('created');
    expect(events).toContain('rendered');
  });

  it('destroyed fires on disconnect after hydration', async () => {
    const el = await ssrAndHydrate({
      template: '<div>bye</div>',
    });

    const destroyed = $(el).onNext('destroyed');
    el.remove();
    await destroyed;

    expect(el.component).toBeUndefined();
    expect(el.template).toBeUndefined();
  });

  it('no hydration comments remain in shadow DOM', async () => {
    const el = await ssrAndHydrate({
      template: '<div>{#if show}<span>{msg}</span>{/if}</div>',
      defaultState: { show: true },
      createComponent: () => ({ msg: 'hello' }),
    });

    const walker = document.createTreeWalker(el.shadowRoot, NodeFilter.SHOW_COMMENT);
    const comments = [];
    let node;
    while ((node = walker.nextNode())) {
      comments.push(node.data);
    }

    expect(comments.length).toBe(0);
  });
});

/*******************************
     Post-hydration reactivity
*******************************/

describe('SSR hydration — post-hydration state updates', () => {
  it('multiple sequential state updates', async () => {
    const el = await ssrAndHydrate({
      template: '<span>{count}</span>',
      defaultState: { count: 0 },
      createComponent: ({ state }) => ({
        increment() {
          state.count.increment();
        },
      }),
    });

    expect(shadowHTML(el)).toBe('<span>0</span>');

    for (let i = 1; i <= 3; i++) {
      const updated = $(el).onNext('updated');
      el.component.increment();
      await updated;
      expect(shadowHTML(el)).toBe(`<span>${i}</span>`);
    }
  });

  it('conditional branch swap back and forth', async () => {
    const el = await ssrAndHydrate({
      template: '<div>{#if show}<span>yes</span>{else}<span>no</span>{/if}</div>',
      defaultState: { show: true },
      createComponent: ({ state }) => ({
        toggle() {
          state.show.toggle();
        },
      }),
    });

    expect(shadowHTML(el)).toBe('<div><span>yes</span></div>');

    // Toggle off
    let updated = $(el).onNext('updated');
    el.component.toggle();
    await updated;
    expect(shadowHTML(el)).toBe('<div><span>no</span></div>');

    // Toggle back on
    updated = $(el).onNext('updated');
    el.component.toggle();
    await updated;
    expect(shadowHTML(el)).toBe('<div><span>yes</span></div>');
  });

  it('three-way conditional cycling', async () => {
    const el = await ssrAndHydrate({
      template:
        '{#if is mode "a"}<div class="a">A</div>{else if is mode "b"}<div class="b">B</div>{else}<div class="c">C</div>{/if}',
      defaultState: { mode: 'a' },
      createComponent: ({ state }) => ({
        setMode(m) {
          state.mode.set(m);
        },
      }),
    });

    expect(shadowHTML(el)).toBe('<div class="a">A</div>');

    let updated = $(el).onNext('updated');
    el.component.setMode('b');
    await updated;
    expect(shadowHTML(el)).toBe('<div class="b">B</div>');

    updated = $(el).onNext('updated');
    el.component.setMode('x');
    await updated;
    expect(shadowHTML(el)).toBe('<div class="c">C</div>');

    updated = $(el).onNext('updated');
    el.component.setMode('a');
    await updated;
    expect(shadowHTML(el)).toBe('<div class="a">A</div>');
  });

  it('boolean attribute updates after hydration', async () => {
    const el = await ssrAndHydrate({
      template: '<button disabled={isDisabled}>Go</button>',
      defaultState: { isDisabled: true },
      createComponent: ({ state }) => ({
        enable() {
          state.isDisabled.set(false);
        },
      }),
    });

    const btn = el.shadowRoot.querySelector('button');
    expect(btn.hasAttribute('disabled')).toBe(true);

    const updated = $(el).onNext('updated');
    el.component.enable();
    await updated;

    expect(btn.hasAttribute('disabled')).toBe(false);
  });

  it('dynamic attribute value updates after hydration', async () => {
    const el = await ssrAndHydrate({
      template: '<div class="{cls}" data-val="{val}">text</div>',
      defaultState: { cls: 'initial', val: '0' },
      createComponent: ({ state }) => ({
        update() {
          state.cls.set('changed');
          state.val.set('1');
        },
      }),
    });

    const div = el.shadowRoot.querySelector('div');
    expect(div.getAttribute('class')).toBe('initial');
    expect(div.getAttribute('data-val')).toBe('0');

    const updated = $(el).onNext('updated');
    el.component.update();
    await updated;

    expect(div.getAttribute('class')).toBe('changed');
    expect(div.getAttribute('data-val')).toBe('1');
  });
});

describe('SSR hydration — post-hydration settings changes', () => {
  it('el.settings write triggers template update', async () => {
    const el = await ssrAndHydrate({
      template: '<span>{color}</span>',
      defaultSettings: { color: 'blue' },
    });

    expect(shadowHTML(el)).toBe('<span>blue</span>');

    const updated = $(el).onNext('updated');
    el.settings.color = 'red';
    Reaction.flush();
    el.requestUpdate();
    await updated;

    expect(shadowHTML(el)).toBe('<span>red</span>');
  });

  it('property assignment updates rendered output', async () => {
    const el = await ssrAndHydrate({
      template: '<span>{name}</span>',
      defaultSettings: { name: 'Alice' },
    });

    expect(shadowHTML(el)).toBe('<span>Alice</span>');

    const updated = $(el).onNext('updated');
    el.name = 'Bob';
    el.requestUpdate();
    await updated;

    expect(shadowHTML(el)).toBe('<span>Bob</span>');
  });

  it('component method updating setting triggers update', async () => {
    const el = await ssrAndHydrate({
      template: '<span>{label}</span>',
      defaultSettings: { label: 'before' },
      createComponent: ({ settings }) => ({
        setLabel(v) {
          settings.label = v;
        },
      }),
    });

    expect(shadowHTML(el)).toBe('<span>before</span>');

    const updated = $(el).onNext('updated');
    el.component.setLabel('after');
    await updated;

    expect(shadowHTML(el)).toBe('<span>after</span>');
  });
});

describe('SSR hydration — post-hydration list mutations', () => {
  it('each list grows after hydration', async () => {
    const el = await ssrAndHydrate({
      template: '<ul>{#each item in getItems}<li>{item}</li>{/each}</ul>',
      defaultState: { items: ['a', 'b'] },
      createComponent: ({ state }) => ({
        getItems: () => state.items.get(),
        addItem(v) {
          state.items.push(v);
        },
      }),
    });

    expect(shadowHTML(el)).toBe('<ul><li>a</li><li>b</li></ul>');

    el.component.addItem('c');
    // each re-render may not fire 'updated' via state-watcher (array signal quirk)
    // so wait with timeout instead of onNext
    await new Promise(r => setTimeout(r, 50));
    await waitForUpdate(el);

    expect(el.shadowRoot.querySelectorAll('li').length).toBe(3);
    expect(el.shadowRoot.querySelectorAll('li')[2].textContent).toBe('c');
  });

  it('each list shrinks after hydration', async () => {
    const el = await ssrAndHydrate({
      template: '{#each item in getItems}<span>{item}</span>{/each}',
      defaultState: { items: ['x', 'y', 'z'] },
      createComponent: ({ state }) => ({
        getItems: () => state.items.get(),
        removeLast() {
          state.items.set(state.items.get().slice(0, -1));
        },
      }),
    });

    expect(el.shadowRoot.querySelectorAll('span').length).toBe(3);

    el.component.removeLast();
    await new Promise(r => setTimeout(r, 50));
    await waitForUpdate(el);

    expect(el.shadowRoot.querySelectorAll('span').length).toBe(2);
  });

  it('each list transitions to else content', async () => {
    const el = await ssrAndHydrate({
      template: '{#each item in getItems}<li>{item}</li>{else}<p>empty</p>{/each}',
      defaultState: { items: ['a'] },
      createComponent: ({ state }) => ({
        getItems: () => state.items.get(),
        clear() {
          state.items.set([]);
        },
      }),
    });

    expect(shadowHTML(el)).toBe('<li>a</li>');

    el.component.clear();
    await new Promise(r => setTimeout(r, 50));
    await waitForUpdate(el);

    expect(shadowHTML(el)).toBe('<p>empty</p>');
  });
});

/*******************************
     Spec-driven components
     (patterns used by real SUI primitives)
*******************************/

describe('SSR hydration — spec-driven components', () => {
  // Real SUI primitives use componentSpec compiled by SpecReader.
  // This minimal spec matches the real shape (flat attributes array,
  // propertyTypes map, optionAttributes map).

  const buttonSpec = {
    tagName: 'test-button',
    content: [],
    contentAttributes: [],
    types: ['emphasis'],
    variations: ['size', 'compact'],
    states: ['active', 'disabled'],
    settings: ['href'],
    attributes: ['emphasis', 'size', 'compact', 'active', 'disabled', 'href'],
    propertyTypes: {
      emphasis: 'string',
      size: 'string',
      compact: 'boolean',
      active: 'boolean',
      disabled: 'boolean',
      href: 'string',
    },
    optionAttributes: {
      primary: 'emphasis',
      secondary: 'emphasis',
      tiny: 'size',
      small: 'size',
      large: 'size',
      huge: 'size',
    },
    allowedValues: {
      emphasis: ['primary', 'secondary'],
      size: ['tiny', 'small', 'large', 'huge'],
    },
    defaultValues: { href: '' },
  };

  it('{ui} class string computed from spec attributes', async () => {
    const el = await ssrAndHydrate({
      template: '<div class="{ui}button" part="button">{>slot}</div>',
      componentSpec: buttonSpec,
    }, { emphasis: 'primary', size: 'large' });

    const div = el.shadowRoot.querySelector('[part="button"]');
    expect(div).toBeTruthy();
    const cls = div.getAttribute('class');
    expect(cls).toContain('primary');
    expect(cls).toContain('large');
    expect(cls).toContain('button');
  });

  it('boolean spec attributes produce correct classes', async () => {
    const el = await ssrAndHydrate({
      template: '<div class="{ui}button">{>slot}</div>',
      componentSpec: buttonSpec,
    }, { active: true, compact: true });

    const cls = el.shadowRoot.querySelector('div').getAttribute('class');
    expect(cls).toContain('active');
    expect(cls).toContain('compact');
  });

  it('conditional wrapper based on setting (href pattern)', async () => {
    const el = await ssrAndHydrate({
      template:
        '{#if href}<a class="{ui}button" href="{href}">{>slot}</a>{else}<div class="{ui}button">{>slot}</div>{/if}',
      componentSpec: buttonSpec,
      defaultSettings: { href: '' },
    }, { href: '/page' });

    expect(el.shadowRoot.querySelector('a')).toBeTruthy();
    expect(el.shadowRoot.querySelector('a').getAttribute('href')).toBe('/page');
    expect(el.shadowRoot.querySelector('div')).toBeFalsy();
  });

  it('conditional wrapper without href renders div', async () => {
    const el = await ssrAndHydrate({
      template:
        '{#if href}<a class="{ui}button" href="{href}">{>slot}</a>{else}<div class="{ui}button">{>slot}</div>{/if}',
      componentSpec: buttonSpec,
      defaultSettings: { href: '' },
    });

    expect(el.shadowRoot.querySelector('div')).toBeTruthy();
    expect(el.shadowRoot.querySelector('a')).toBeFalsy();
  });
});

/*******************************
     Event delegation after hydration
*******************************/

describe('SSR hydration — events after hydration', () => {
  it('click event fires after hydration', async () => {
    let clicked = false;
    const el = await ssrAndHydrate({
      template: '<div class="target">Click me</div>',
      events: {
        'click .target'({ self }) {
          self.handleClick();
        },
      },
      createComponent: () => ({
        handleClick() {
          clicked = true;
        },
      }),
    });

    el.shadowRoot.querySelector('.target').click();
    await new Promise(r => setTimeout(r, 10));
    expect(clicked).toBe(true);
  });

  it('event handler accesses reactive state', async () => {
    const el = await ssrAndHydrate({
      template: '<div><button class="btn">+</button><span>{count}</span></div>',
      defaultState: { count: 0 },
      events: {
        'click .btn'({ state }) {
          state.count.increment();
        },
      },
      createComponent: ({ state }) => ({
        getCount() {
          return state.count.get();
        },
      }),
    });

    expect(shadowHTML(el)).toContain('0');

    el.shadowRoot.querySelector('.btn').click();
    const updated = $(el).onNext('updated');
    await updated;

    expect(shadowHTML(el)).toContain('1');
  });
});

/*******************************
     createComponent lifecycle
*******************************/

describe('SSR hydration — createComponent lifecycle', () => {
  it('initialize() runs during hydration', async () => {
    let initRan = false;
    const el = await ssrAndHydrate({
      template: '<div>{msg}</div>',
      createComponent: () => ({
        msg: 'initialized',
        initialize() {
          initRan = true;
        },
      }),
    });

    expect(initRan).toBe(true);
    expect(shadowHTML(el)).toBe('<div>initialized</div>');
  });

  it('onCreated fires during hydration', async () => {
    let createdRan = false;
    const el = await ssrAndHydrate({
      template: '<div>test</div>',
      onCreated: () => {
        createdRan = true;
      },
    });

    expect(createdRan).toBe(true);
  });

  it('onRendered fires after hydration', async () => {
    let renderedRan = false;
    const el = await ssrAndHydrate({
      template: '<div>test</div>',
      onRendered: ({ isClient }) => {
        if (isClient) { renderedRan = true; }
      },
    });

    expect(renderedRan).toBe(true);
  });

  it('isHydrating is false after hydration completes', async () => {
    let hydrating = null;
    const el = await ssrAndHydrate({
      template: '<div>test</div>',
      onRendered: ({ isHydrating }) => {
        hydrating = isHydrating;
      },
    });

    expect(hydrating).toBe(false);
  });

  it('reaction created in initialize tracks signals after hydration', async () => {
    const el = await ssrAndHydrate({
      template: '<div>{derived}</div>',
      defaultState: { count: 1 },
      createComponent: ({ self, state, reaction, signal }) => ({
        derived: signal(''),
        initialize() {
          reaction(() => {
            self.derived.set('count is ' + state.count.get());
          });
        },
      }),
    });

    expect(shadowHTML(el)).toBe('<div>count is 1</div>');

    const updated = $(el).onNext('updated');
    el.template.state.count.set(5);
    await updated;

    expect(shadowHTML(el)).toBe('<div>count is 5</div>');
  });
});

/*******************************
     CSS scoping
*******************************/

describe('SSR hydration — CSS', () => {
  it('adoptedStyleSheets are applied after hydration', async () => {
    const el = await ssrAndHydrate({
      template: '<div class="styled">text</div>',
      css: '.styled { color: rgb(255, 0, 0); }',
    });

    expect(el.shadowRoot.adoptedStyleSheets.length).toBeGreaterThan(0);
    const div = el.shadowRoot.querySelector('.styled');
    const color = getComputedStyle(div).color;
    expect(color).toBe('rgb(255, 0, 0)');
  });

  it('server style tag removed during hydration', async () => {
    const el = await ssrAndHydrate({
      template: '<div>text</div>',
      css: '.a { color: red; }',
    });

    const styleTags = el.shadowRoot.querySelectorAll('style');
    expect(styleTags.length).toBe(0);
  });
});

/*******************************
     Server/client data divergence
*******************************/

describe('SSR hydration — data divergence', () => {
  it('onCreated state mutation updates DOM after hydration', async () => {
    // Server renders with count=0, client onCreated sets count=42.
    // Hydration should reflect the client's mutated state.
    const el = await ssrAndHydrate({
      template: '<span>{count}</span>',
      defaultState: { count: 0 },
      onCreated: ({ state, isClient }) => {
        if (isClient) {
          state.count.set(42);
        }
      },
    });

    await new Promise(r => setTimeout(r, 50));
    await waitForUpdate(el);
    expect(shadowHTML(el)).toBe('<span>42</span>');
  });

  it('computed value from createComponent matches after hydration', async () => {
    const el = await ssrAndHydrate({
      template: '<div>{getStatus}</div>',
      defaultState: { ready: true },
      createComponent: ({ state }) => ({
        getStatus: () => state.ready.get() ? 'Ready' : 'Loading',
      }),
    });

    expect(shadowHTML(el)).toBe('<div>Ready</div>');
  });
});

/*******************************
     Snippet reactivity
*******************************/

describe('SSR hydration — snippet reactivity', () => {
  it('snippet attribute expressions are reactive after hydration', async () => {
    const el = await ssrAndHydrate({
      template: '{#snippet item}<span class="{cls}">{label}</span>{/snippet}<div>{>item}</div>',
      defaultState: { cls: 'before', label: 'Hello' },
      createComponent: ({ state }) => ({
        update() {
          state.cls.set('after');
          state.label.set('Updated');
        },
      }),
    });

    const span = el.shadowRoot.querySelector('span');
    expect(span.getAttribute('class')).toBe('before');
    expect(span.textContent).toBe('Hello');

    const updated = $(el).onNext('updated');
    el.component.update();
    await updated;

    expect(span.getAttribute('class')).toBe('after');
    expect(span.textContent).toBe('Updated');
  });

  it('snippet inside conditional has reactive attributes after hydration', async () => {
    const el = await ssrAndHydrate({
      template: '{#snippet content}<i class="{icon}-icon" style={getStyle}></i>{/snippet}'
        + '{#if showLink}<a>{>content}</a>{else}{>content}{/if}',
      defaultState: { icon: 'home', showLink: false },
      createComponent: ({ state }) => ({
        getStyle: () => `--icon: var(--icon-${state.icon.get()})`,
        setIcon(name) {
          state.icon.set(name);
        },
      }),
    });

    const i = el.shadowRoot.querySelector('i');
    expect(i.getAttribute('class')).toBe('home-icon');
    expect(i.getAttribute('style')).toContain('--icon-home');

    const updated = $(el).onNext('updated');
    el.component.setIcon('star');
    await updated;

    expect(i.getAttribute('class')).toBe('star-icon');
    expect(i.getAttribute('style')).toContain('--icon-star');
  });

  it('snippet with computed function is reactive after hydration', async () => {
    const el = await ssrAndHydrate({
      template: '{#snippet badge}<span class="{getClass}">{getText}</span>{/snippet}<div>{>badge}</div>',
      defaultState: { active: false },
      createComponent: ({ state }) => ({
        getClass: () => state.active.get() ? 'active' : 'inactive',
        getText: () => state.active.get() ? 'ON' : 'OFF',
        toggle() {
          state.active.set(!state.active.get());
        },
      }),
    });

    expect(el.shadowRoot.querySelector('span').getAttribute('class')).toBe('inactive');
    expect(el.shadowRoot.querySelector('span').textContent).toBe('OFF');

    const updated = $(el).onNext('updated');
    el.component.toggle();
    await updated;

    expect(el.shadowRoot.querySelector('span').getAttribute('class')).toBe('active');
    expect(el.shadowRoot.querySelector('span').textContent).toBe('ON');
  });
});

/*******************************
     Attribute alignment
     across block directives
*******************************/

describe('SSR hydration — attribute alignment across blocks', () => {
  it('should bind attributes after {#each} to the correct elements', async () => {
    const el = await ssrAndHydrate({
      template: [
        '<div>',
        '{#each item in items}<span class="item">{item}</span>{/each}',
        '<span class="after" data-value="{label}">after</span>',
        '</div>',
      ].join(''),
      createComponent: () => ({
        items: ['a', 'b', 'c'],
        label: 'correct',
      }),
    });

    // The expression after the each should bind to .after, not to an each item
    const afterEl = el.shadowRoot.querySelector('.after');
    expect(afterEl.getAttribute('data-value')).toBe('correct');

    // Each items should not have data-value
    const items = el.shadowRoot.querySelectorAll('.item');
    expect(items.length).toBe(3);
    expect(items[0].hasAttribute('data-value')).toBe(false);
  });

  it('should bind attributes after nested {#each} to correct elements', async () => {
    const el = await ssrAndHydrate({
      template: [
        '<svg viewBox="0 0 100 100">',
        '{#each major in majors}',
        '<line class="major" transform="{getRotation major}"></line>',
        '{#each minor in minors}',
        '<line class="minor" transform="{getMinorRotation major minor}"></line>',
        '{/each}',
        '{/each}',
        '<line class="hand" transform="{handTransform}"></line>',
        '</svg>',
      ].join(''),
      createComponent: () => ({
        majors: [0, 1, 2],
        minors: [1, 2],
        getRotation: (m) => `rotate(${m * 120})`,
        getMinorRotation: (m, offset) => `rotate(${m * 120 + offset * 30})`,
        handTransform: 'rotate(90)',
      }),
    });

    // The hand element after nested each loops should have its own transform
    const hand = el.shadowRoot.querySelector('.hand');
    expect(hand.getAttribute('transform')).toBe('rotate(90)');

    // Verify markers got their own transforms, not the hand's
    const majors = el.shadowRoot.querySelectorAll('.major');
    expect(majors[0].getAttribute('transform')).toBe('rotate(0)');
    expect(majors[1].getAttribute('transform')).toBe('rotate(120)');
    expect(majors[2].getAttribute('transform')).toBe('rotate(240)');
  });
});
