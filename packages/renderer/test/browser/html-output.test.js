import { defineComponent } from '@semantic-ui/component';
import { Reaction } from '@semantic-ui/reactivity';
import { beforeEach, describe, expect, it } from 'vitest';
import { RENDERING_ENGINES } from './test-utils.js';

RENDERING_ENGINES.forEach(engine => {
  /*******************************
           Test Helpers
  *******************************/

  let tagCounter = 0;
  function uniqueTag() {
    return `test-html-${engine}-${++tagCounter}`;
  }

  // Strips renderer-internal comments (Lit uses <!--?-->, <!--lit-part-->, etc.)
  // and collapses whitespace so output is renderer-agnostic.
  function shadowHTML(el) {
    return el.shadowRoot.innerHTML
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async function waitForUpdate(el) {
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 0));
    await el.updateComplete;
  }

  // Creates a component, appends it, and waits for first render
  async function renderComponent(opts) {
    const tag = uniqueTag();
    const componentDef = { tagName: tag, renderingEngine: engine, ...opts };
    defineComponent(componentDef);
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;
    return el;
  }

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  /*******************************
   Rendered HTML Conformance
   ————————————————————————
   These tests assert exact stringified output.
   Any new renderer must produce byte-identical
   results (after comment-strip + whitespace
   normalization) to pass.
  *******************************/

  describe(`[${engine}] rendered HTML conformance — static`, () => {
    it('simple element with text', async () => {
      const el = await renderComponent({ template: '<div class="a"><span>text</span></div>' });
      expect(shadowHTML(el)).toBe('<div class="a"><span>text</span></div>');
    });

    it('void elements', async () => {
      const el = await renderComponent({ template: '<div><br><hr><img src="x.png" alt="y"></div>' });
      expect(shadowHTML(el)).toBe('<div><br><hr><img src="x.png" alt="y"></div>');
    });

    it('sibling elements', async () => {
      const el = await renderComponent({ template: '<header>H</header><main>M</main><footer>F</footer>' });
      expect(shadowHTML(el)).toBe('<header>H</header><main>M</main><footer>F</footer>');
    });

    it('deeply nested', async () => {
      const el = await renderComponent({
        template: '<div class="l1"><div class="l2"><div class="l3"><span>deep</span></div></div></div>',
      });
      expect(shadowHTML(el)).toBe(
        '<div class="l1"><div class="l2"><div class="l3"><span>deep</span></div></div></div>',
      );
    });

    it('multiple attributes', async () => {
      const el = await renderComponent({
        template: '<div id="main" class="container" data-role="content" aria-label="Main"></div>',
      });
      expect(shadowHTML(el)).toBe('<div id="main" class="container" data-role="content" aria-label="Main"></div>');
    });
  });

  describe(`[${engine}] rendered HTML conformance — expressions`, () => {
    it('expression in element content', async () => {
      const el = await renderComponent({
        template: '<div>{name}</div>',
        createComponent: () => ({ name: 'Alice' }),
      });
      expect(shadowHTML(el)).toBe('<div>Alice</div>');
    });

    it('two expressions with text between', async () => {
      const el = await renderComponent({
        template: '<span>{a} {b}</span>',
        createComponent: () => ({ a: 'X', b: 'Y' }),
      });
      expect(shadowHTML(el)).toBe('<span>X Y</span>');
    });

    it('expression between static text', async () => {
      const el = await renderComponent({
        template: '<p>Hello {name}, welcome!</p>',
        createComponent: () => ({ name: 'World' }),
      });
      expect(shadowHTML(el)).toBe('<p>Hello World, welcome!</p>');
    });

    it('expression producing empty string', async () => {
      const el = await renderComponent({
        template: '<div><span>{empty}</span></div>',
        createComponent: () => ({ empty: '' }),
      });
      expect(shadowHTML(el)).toBe('<div><span></span></div>');
    });

    it('numeric expression', async () => {
      const el = await renderComponent({
        template: '<span>{total}</span>',
        createComponent: () => ({ total: 42 }),
      });
      expect(shadowHTML(el)).toBe('<span>42</span>');
    });

    it('expressions in sibling elements', async () => {
      const el = await renderComponent({
        template: '<span class="a">{x}</span><span class="b">{y}</span>',
        createComponent: () => ({ x: 'left', y: 'right' }),
      });
      expect(shadowHTML(el)).toBe('<span class="a">left</span><span class="b">right</span>');
    });
  });

  describe(`[${engine}] rendered HTML conformance — attributes`, () => {
    it('single dynamic attribute', async () => {
      const el = await renderComponent({
        template: '<div class="{cls}" data-id="{id}">text</div>',
        createComponent: () => ({ cls: 'active', id: '42' }),
      });
      expect(shadowHTML(el)).toBe('<div class="active" data-id="42">text</div>');
    });

    it('mixed static + dynamic attribute', async () => {
      const el = await renderComponent({
        template: '<div class="base {mod}">text</div>',
        createComponent: () => ({ mod: 'extra' }),
      });
      expect(shadowHTML(el)).toBe('<div class="base extra">text</div>');
    });

    it('boolean attribute true', async () => {
      const el = await renderComponent({
        template: '<button disabled={isDisabled}>Go</button>',
        defaultState: { isDisabled: true },
      });
      expect(shadowHTML(el)).toBe('<button disabled="true">Go</button>');
    });

    it('boolean attribute false — attribute removed', async () => {
      const el = await renderComponent({
        template: '<button disabled={isDisabled}>Go</button>',
        defaultState: { isDisabled: false },
      });
      expect(shadowHTML(el)).toBe('<button>Go</button>');
    });

    it('dynamic content and attributes on same element', async () => {
      const el = await renderComponent({
        template: '<div class="{cls}" data-value="{val}">{text}</div>',
        createComponent: () => ({ cls: 'item', val: '7', text: 'hello' }),
      });
      expect(shadowHTML(el)).toBe('<div class="item" data-value="7">hello</div>');
    });
  });

  describe(`[${engine}] rendered HTML conformance — conditionals`, () => {
    it('if true branch', async () => {
      const el = await renderComponent({
        template: '<div>{#if show}<span>yes</span>{else}<span>no</span>{/if}</div>',
        defaultState: { show: true },
      });
      expect(shadowHTML(el)).toBe('<div><span>yes</span></div>');
    });

    it('if false branch', async () => {
      const el = await renderComponent({
        template: '<div>{#if show}<span>yes</span>{else}<span>no</span>{/if}</div>',
        defaultState: { show: false },
      });
      expect(shadowHTML(el)).toBe('<div><span>no</span></div>');
    });

    it('if/else-if/else — middle branch', async () => {
      const el = await renderComponent({
        template: '{#if is mode "a"}<span>A</span>{else if is mode "b"}<span>B</span>{else}<span>C</span>{/if}',
        defaultState: { mode: 'b' },
      });
      expect(shadowHTML(el)).toBe('<span>B</span>');
    });

    it('if with no else — false produces empty', async () => {
      const el = await renderComponent({
        template: '<div>{#if show}<span>content</span>{/if}</div>',
        defaultState: { show: false },
      });
      expect(shadowHTML(el)).toBe('<div></div>');
    });

    it('adjacent independent conditionals', async () => {
      const el = await renderComponent({
        template: '{#if a}<span>A</span>{/if}{#if b}<span>B</span>{/if}',
        defaultState: { a: true, b: false },
      });
      expect(shadowHTML(el)).toBe('<span>A</span>');
    });

    it('clean swap — no residual markup from old branch', async () => {
      const el = await renderComponent({
        template: '<div>{#if show}<span>yes</span>{else}<span>no</span>{/if}</div>',
        defaultState: { show: true },
      });
      expect(shadowHTML(el)).toBe('<div><span>yes</span></div>');

      el.template.state.show.set(false);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<div><span>no</span></div>');

      el.template.state.show.set(true);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<div><span>yes</span></div>');
    });

    it('three-way branch cycling', async () => {
      const el = await renderComponent({
        template:
          '{#if is mode "a"}<div class="a">A</div>{else if is mode "b"}<div class="b">B</div>{else}<div class="c">C</div>{/if}',
        defaultState: { mode: 'a' },
      });
      expect(shadowHTML(el)).toBe('<div class="a">A</div>');

      el.template.state.mode.set('b');
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<div class="b">B</div>');

      el.template.state.mode.set('x');
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<div class="c">C</div>');

      el.template.state.mode.set('a');
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<div class="a">A</div>');
    });

    it('conditional preserves surrounding static HTML', async () => {
      const el = await renderComponent({
        template: '<header>Top</header>{#if show}<main>Mid</main>{/if}<footer>Bot</footer>',
        defaultState: { show: true },
      });
      expect(shadowHTML(el)).toBe('<header>Top</header><main>Mid</main><footer>Bot</footer>');

      el.template.state.show.set(false);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<header>Top</header><footer>Bot</footer>');

      el.template.state.show.set(true);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<header>Top</header><main>Mid</main><footer>Bot</footer>');
    });

    it('conditional wrapping different element types', async () => {
      const el = await renderComponent({
        template: '{#if isLink}<a href="/page">Click</a>{else}<button>Press</button>{/if}',
        defaultState: { isLink: true },
      });
      expect(shadowHTML(el)).toBe('<a href="/page">Click</a>');

      el.template.state.isLink.set(false);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<button>Press</button>');
    });
  });

  describe(`[${engine}] rendered HTML conformance — each`, () => {
    it('simple list', async () => {
      const el = await renderComponent({
        template: '<ul>{#each item in items}<li>{item}</li>{/each}</ul>',
        createComponent: () => ({ items: ['a', 'b', 'c'] }),
      });
      expect(shadowHTML(el)).toBe('<ul><li>a</li><li>b</li><li>c</li></ul>');
    });

    it('each with per-item attributes', async () => {
      const el = await renderComponent({
        template: '{#each item in items}<div class="card" data-id="{item.id}">{item.label}</div>{/each}',
        createComponent: () => ({
          items: [
            { id: 'x1', label: 'One' },
            { id: 'x2', label: 'Two' },
          ],
        }),
      });
      expect(shadowHTML(el)).toBe(
        '<div class="card" data-id="x1">One</div><div class="card" data-id="x2">Two</div>',
      );
    });

    it('each with index', async () => {
      const el = await renderComponent({
        template: '{#each item, i in items}<span>{i}:{item}</span>{/each}',
        createComponent: () => ({ items: ['a', 'b'] }),
      });
      expect(shadowHTML(el)).toBe('<span>0:a</span><span>1:b</span>');
    });

    it('each empty — else content', async () => {
      const el = await renderComponent({
        template: '{#each item in items}<li>{item}</li>{else}<p>none</p>{/each}',
        createComponent: () => ({ items: [] }),
      });
      expect(shadowHTML(el)).toBe('<p>none</p>');
    });

    it('each empty to populated transition', async () => {
      const el = await renderComponent({
        template: '{#each item in getItems}<li>{item}</li>{else}<p>none</p>{/each}',
        defaultState: { v: 0 },
        createComponent: ({ state }) => ({
          getItems: () => state.v.get() === 0 ? [] : ['a', 'b'],
        }),
      });
      expect(shadowHTML(el)).toBe('<p>none</p>');

      el.template.state.v.set(1);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<li>a</li><li>b</li>');
    });

    it('each list resize', async () => {
      const el = await renderComponent({
        template: '<ul>{#each item in getItems}<li>{item}</li>{/each}</ul>',
        defaultState: { v: 0 },
        createComponent: ({ state }) => ({
          getItems: () => state.v.get() === 0 ? ['a', 'b'] : ['x', 'y', 'z'],
        }),
      });
      expect(shadowHTML(el)).toBe('<ul><li>a</li><li>b</li></ul>');

      el.template.state.v.set(1);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<ul><li>x</li><li>y</li><li>z</li></ul>');
    });

    it('each preserves surrounding structure', async () => {
      const el = await renderComponent({
        template: '<h1>Title</h1><ul>{#each n in getItems}<li>{n}</li>{/each}</ul><footer>End</footer>',
        defaultState: { v: 0 },
        createComponent: ({ state }) => ({
          getItems: () => state.v.get() === 0 ? ['a', 'b'] : ['x'],
        }),
      });
      expect(shadowHTML(el)).toBe('<h1>Title</h1><ul><li>a</li><li>b</li></ul><footer>End</footer>');

      el.template.state.v.set(1);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<h1>Title</h1><ul><li>x</li></ul><footer>End</footer>');
    });

    it('object iteration', async () => {
      const el = await renderComponent({
        template: '{#each val, key in obj}<span>{key}={val}</span>{/each}',
        createComponent: () => ({ obj: { a: '1', b: '2' } }),
      });
      expect(shadowHTML(el)).toBe('<span>a=1</span><span>b=2</span>');
    });
  });

  describe(`[${engine}] rendered HTML conformance — snippets`, () => {
    it('snippet renders inline', async () => {
      const el = await renderComponent({
        template: '{#snippet badge}<b>{label}</b>{/snippet}<div>{>badge label="X"}</div>',
      });
      expect(shadowHTML(el)).toBe('<div><b>X</b></div>');
    });

    it('snippet used twice — independent output', async () => {
      const el = await renderComponent({
        template: '{#snippet tag}<span class="t">{label}</span>{/snippet}{>tag label="X"}{>tag label="Y"}',
      });
      expect(shadowHTML(el)).toBe('<span class="t">X</span><span class="t">Y</span>');
    });

    it('snippet with nested elements', async () => {
      const el = await renderComponent({
        template: [
          '{#snippet card}<div class="card"><h2>{title}</h2><p>{body}</p></div>{/snippet}',
          '{>card title="Hello" body="World"}',
        ].join(''),
      });
      expect(shadowHTML(el)).toBe('<div class="card"><h2>Hello</h2><p>World</p></div>');
    });

    it('snippet inside each', async () => {
      const el = await renderComponent({
        template: [
          '{#snippet row}<tr><td>{name}</td><td>{role}</td></tr>{/snippet}',
          '<table>{#each p in people}{>row name=p.name role=p.role}{/each}</table>',
        ].join(''),
        createComponent: () => ({
          people: [
            { name: 'Alice', role: 'Admin' },
            { name: 'Bob', role: 'User' },
          ],
        }),
      });
      expect(shadowHTML(el)).toBe(
        '<table><tr><td>Alice</td><td>Admin</td></tr><tr><td>Bob</td><td>User</td></tr></table>',
      );
    });
  });

  describe(`[${engine}] rendered HTML conformance — subtemplates`, () => {
    it('subtemplate renders inline in parent', async () => {
      const child = defineComponent({ renderingEngine: engine, template: '<em>{msg}</em>' });
      const el = await renderComponent({
        template: '<div>{>child msg="hi"}</div>',
        subTemplates: { child },
      });
      expect(shadowHTML(el)).toBe('<div><em>hi</em></div>');
    });

    it('subtemplate between static siblings', async () => {
      const child = defineComponent({ renderingEngine: engine, template: '<span class="sub">{text}</span>' });
      const el = await renderComponent({
        template: '<div class="before">A</div>{>child text="B"}<div class="after">C</div>',
        subTemplates: { child },
      });
      expect(shadowHTML(el)).toBe('<div class="before">A</div><span class="sub">B</span><div class="after">C</div>');
    });

    it('subtemplate inside each', async () => {
      const item = defineComponent({ renderingEngine: engine, template: '<li data-id="{id}">{name}</li>' });
      const el = await renderComponent({
        template: '<ul>{#each it in items}{>item id=it.id name=it.name}{/each}</ul>',
        createComponent: () => ({
          items: [{ id: '1', name: 'A' }, { id: '2', name: 'B' }],
        }),
        subTemplates: { item },
      });
      expect(shadowHTML(el)).toBe('<ul><li data-id="1">A</li><li data-id="2">B</li></ul>');
    });

    it('subtemplate swap on dynamic name change', async () => {
      const compact = defineComponent({ renderingEngine: engine, template: '<span class="compact">{label}</span>' });
      const expanded = defineComponent({
        renderingEngine: engine,
        template: '<div class="expanded"><h3>{label}</h3><p>detail</p></div>',
      });
      const el = await renderComponent({
        template: '{>template name=currentView reactiveData={label: getLabel}}',
        defaultState: { view: 'compact' },
        createComponent: ({ state }) => ({
          currentView: () => state.view.get(),
          getLabel: () => 'Item',
        }),
        subTemplates: { compact, expanded },
      });
      expect(shadowHTML(el)).toBe('<span class="compact">Item</span>');

      el.template.state.view.set('expanded');
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<div class="expanded"><h3>Item</h3><p>detail</p></div>');
    });

    it('reactive subtemplate data update', async () => {
      const child = defineComponent({ renderingEngine: engine, template: '<span>{label}</span>' });
      const el = await renderComponent({
        template: '{>child label=getMessage}',
        defaultState: { msg: 'hello' },
        createComponent: ({ state }) => ({
          getMessage: () => state.msg.get(),
        }),
        subTemplates: { child },
      });
      expect(shadowHTML(el)).toBe('<span>hello</span>');

      el.template.state.msg.set('world');
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<span>world</span>');
    });
  });

  describe(`[${engine}] rendered HTML conformance — slots`, () => {
    it('default slot', async () => {
      const el = await renderComponent({ template: '<div>{>slot}</div>' });
      expect(shadowHTML(el)).toBe('<div><slot></slot></div>');
    });

    it('named slot', async () => {
      const el = await renderComponent({
        template: '<header>{>slot header}</header><main>{>slot}</main>',
      });
      expect(shadowHTML(el)).toBe('<header><slot name="header"></slot></header><main><slot></slot></main>');
    });
  });

  describe(`[${engine}] rendered HTML conformance — unsafe HTML`, () => {
    it('renders raw HTML inline', async () => {
      const el = await renderComponent({
        template: '<div>{#html content}</div>',
        createComponent: () => ({ content: '<b>bold</b>' }),
      });
      expect(shadowHTML(el)).toBe('<div><b>bold</b></div>');
    });

    it('replaces raw HTML cleanly on update', async () => {
      const el = await renderComponent({
        template: '<div>{#html getContent}</div>',
        defaultState: { v: 0 },
        createComponent: ({ state }) => ({
          getContent: () =>
            state.v.get() === 0
              ? '<p class="v0">First</p>'
              : '<span class="v1">Second</span>',
        }),
      });
      expect(shadowHTML(el)).toBe('<div><p class="v0">First</p></div>');

      el.template.state.v.set(1);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<div><span class="v1">Second</span></div>');
    });
  });

  describe(`[${engine}] rendered HTML conformance — async`, () => {
    it('loading then resolved', async () => {
      const el = await renderComponent({
        template:
          '{#async fetchData as result}<div class="ok">{result}</div>{loading}<div class="wait">Loading</div>{/async}',
        createComponent: () => ({
          fetchData: () => new Promise(resolve => setTimeout(() => resolve('Done'), 50)),
        }),
      });
      expect(shadowHTML(el)).toBe('<div class="wait">Loading</div>');

      await new Promise(r => setTimeout(r, 100));
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<div class="ok">Done</div>');
    });

    it('error state', async () => {
      const el = await renderComponent({
        template:
          '{#async fetchData as result}<div class="ok">{result}</div>{error as err}<div class="err">{err.message}</div>{/async}',
        createComponent: () => ({
          fetchData: () => new Promise((_, reject) => setTimeout(() => reject(new Error('Boom')), 50)),
        }),
      });

      await new Promise(r => setTimeout(r, 100));
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<div class="err">Boom</div>');
    });

    it('surrounding HTML survives async lifecycle', async () => {
      const el = await renderComponent({
        template:
          '<header>H</header>{#async fetchData as r}<div class="r">{r}</div>{loading}<div class="l">...</div>{/async}<footer>F</footer>',
        createComponent: () => ({
          fetchData: () => new Promise(resolve => setTimeout(() => resolve('OK'), 50)),
        }),
      });
      expect(shadowHTML(el)).toBe('<header>H</header><div class="l">...</div><footer>F</footer>');

      await new Promise(r => setTimeout(r, 100));
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<header>H</header><div class="r">OK</div><footer>F</footer>');
    });
  });

  describe(`[${engine}] rendered HTML conformance — complex nesting`, () => {
    it('if inside each', async () => {
      const el = await renderComponent({
        template: '{#each item in items}<div>{#if item.on}<b>{item.name}</b>{else}<i>{item.name}</i>{/if}</div>{/each}',
        createComponent: () => ({
          items: [{ name: 'A', on: true }, { name: 'B', on: false }],
        }),
      });
      expect(shadowHTML(el)).toBe('<div><b>A</b></div><div><i>B</i></div>');
    });

    it('each inside if', async () => {
      const el = await renderComponent({
        template: '{#if show}<ul>{#each n in nums}<li>{n}</li>{/each}</ul>{else}<p>off</p>{/if}',
        defaultState: { show: true },
        createComponent: () => ({ nums: [1, 2] }),
      });
      expect(shadowHTML(el)).toBe('<ul><li>1</li><li>2</li></ul>');

      el.template.state.show.set(false);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<p>off</p>');

      el.template.state.show.set(true);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<ul><li>1</li><li>2</li></ul>');
    });

    it('adjacent blocks — each + if + each', async () => {
      const el = await renderComponent({
        template: '{#if a}<span>A</span>{/if}{#each n in nums}<b>{n}</b>{/each}',
        defaultState: { a: true },
        createComponent: () => ({ nums: [1, 2] }),
      });
      expect(shadowHTML(el)).toBe('<span>A</span><b>1</b><b>2</b>');

      el.template.state.a.set(false);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<b>1</b><b>2</b>');
    });

    it('nested each blocks', async () => {
      const el = await renderComponent({
        template:
          '{#each g in groups}<div data-g="{g.name}">{#each item in g.items}<span>{item}</span>{/each}</div>{/each}',
        createComponent: () => ({
          groups: [
            { name: 'g1', items: ['a', 'b'] },
            { name: 'g2', items: ['c'] },
          ],
        }),
      });
      expect(shadowHTML(el)).toBe(
        '<div data-g="g1"><span>a</span><span>b</span></div><div data-g="g2"><span>c</span></div>',
      );
    });

    it('snippet with conditional inside each', async () => {
      const el = await renderComponent({
        template: [
          '{#snippet badge}{#if on}<b>ON</b>{else}<i>OFF</i>{/if}{/snippet}',
          '{#each u in users}<div>{u.name}:{>badge on=u.active}</div>{/each}',
        ].join(''),
        createComponent: () => ({
          users: [
            { name: 'Alice', active: true },
            { name: 'Bob', active: false },
          ],
        }),
      });
      expect(shadowHTML(el)).toBe('<div>Alice:<b>ON</b></div><div>Bob:<i>OFF</i></div>');
    });

    it('deep nesting — if > each > if > each', async () => {
      const el = await renderComponent({
        template: [
          '<div class="root">',
          '{#if showOuter}',
          '{#each group in groups}',
          '<section data-name="{group.name}">',
          '{#if group.visible}',
          '{#each item in group.items}<span class="leaf">{item}</span>{/each}',
          '{/if}',
          '</section>',
          '{/each}',
          '{/if}',
          '</div>',
        ].join(''),
        defaultState: { showOuter: true },
        createComponent: () => ({
          groups: [
            { name: 'a', visible: true, items: ['a1', 'a2'] },
            { name: 'b', visible: false, items: ['b1'] },
            { name: 'c', visible: true, items: ['c1'] },
          ],
        }),
      });
      expect(shadowHTML(el)).toBe(
        '<div class="root">'
          + '<section data-name="a"><span class="leaf">a1</span><span class="leaf">a2</span></section>'
          + '<section data-name="b"></section>'
          + '<section data-name="c"><span class="leaf">c1</span></section>'
          + '</div>',
      );

      el.template.state.showOuter.set(false);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<div class="root"></div>');

      el.template.state.showOuter.set(true);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe(
        '<div class="root">'
          + '<section data-name="a"><span class="leaf">a1</span><span class="leaf">a2</span></section>'
          + '<section data-name="b"></section>'
          + '<section data-name="c"><span class="leaf">c1</span></section>'
          + '</div>',
      );
    });
  });

  describe(`[${engine}] rendered HTML conformance — expression updates`, () => {
    it('expression update preserves structure', async () => {
      const el = await renderComponent({
        template: '<div class="w"><span>{val}</span></div>',
        defaultState: { val: 'old' },
      });
      expect(shadowHTML(el)).toBe('<div class="w"><span>old</span></div>');

      el.template.state.val.set('new');
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<div class="w"><span>new</span></div>');
    });

    it('attribute update preserves structure', async () => {
      const el = await renderComponent({
        template: '<div class="{cls}"><span>text</span></div>',
        defaultState: { cls: 'alpha' },
      });
      expect(shadowHTML(el)).toBe('<div class="alpha"><span>text</span></div>');

      el.template.state.cls.set('beta');
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<div class="beta"><span>text</span></div>');
    });

    it('boolean attribute toggle preserves structure', async () => {
      const el = await renderComponent({
        template: '<button disabled={off}>Go</button>',
        defaultState: { off: false },
      });
      expect(shadowHTML(el)).toBe('<button>Go</button>');

      el.template.state.off.set(true);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<button disabled="true">Go</button>');

      el.template.state.off.set(false);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<button>Go</button>');
    });
  });

  describe(`[${engine}] rendered HTML conformance — stability under repeated updates`, () => {
    it('repeated conditional toggles produce identical output', async () => {
      const el = await renderComponent({
        template: '<div class="a">A</div>{#if show}<div class="b">B</div>{/if}<div class="c">C</div>',
        defaultState: { show: true },
      });
      const expectedOn = '<div class="a">A</div><div class="b">B</div><div class="c">C</div>';
      const expectedOff = '<div class="a">A</div><div class="c">C</div>';

      for (let i = 0; i < 5; i++) {
        expect(shadowHTML(el)).toBe(expectedOn);
        el.template.state.show.set(false);
        await waitForUpdate(el);
        expect(shadowHTML(el)).toBe(expectedOff);
        el.template.state.show.set(true);
        await waitForUpdate(el);
      }
      expect(shadowHTML(el)).toBe(expectedOn);
    });

    it('repeated list replacements produce identical output', async () => {
      const el = await renderComponent({
        template: '<ul>{#each n in getItems}<li>{n}</li>{/each}</ul>',
        defaultState: { v: 0 },
        createComponent: ({ state }) => ({
          getItems: () => state.v.get() % 2 === 0 ? ['a', 'b'] : ['x', 'y', 'z'],
        }),
      });
      const expectedEven = '<ul><li>a</li><li>b</li></ul>';
      const expectedOdd = '<ul><li>x</li><li>y</li><li>z</li></ul>';

      for (let v = 0; v <= 6; v++) {
        el.template.state.v.set(v);
        await waitForUpdate(el);
        expect(shadowHTML(el)).toBe(v % 2 === 0 ? expectedEven : expectedOdd);
      }
    });

    it('simultaneous updates to conditional + each + expression', async () => {
      const el = await renderComponent({
        template: [
          '<div class="wrap">',
          '{#if showH}<h1>{title}</h1>{/if}',
          '{#each item in getItems}<p>{item}</p>{/each}',
          '<footer>{footer}</footer>',
          '</div>',
        ].join(''),
        defaultState: { showH: true, title: 'T1', footer: 'F1', v: 0 },
        createComponent: ({ state }) => ({
          getItems: () => state.v.get() === 0 ? ['a', 'b'] : ['x'],
        }),
      });
      expect(shadowHTML(el)).toBe(
        '<div class="wrap"><h1>T1</h1><p>a</p><p>b</p><footer>F1</footer></div>',
      );

      el.template.state.showH.set(false);
      el.template.state.v.set(1);
      el.template.state.footer.set('F2');
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe(
        '<div class="wrap"><p>x</p><footer>F2</footer></div>',
      );
    });
  });

  describe(`[${engine}] rendered HTML conformance — real-world templates`, () => {
    it('card list with conditional actions', async () => {
      const el = await renderComponent({
        template: [
          '<div class="cards">',
          '{#each card in cards}',
          '<article data-id="{card.id}">',
          '<h2>{card.title}</h2>',
          '{#if card.active}<span class="badge">Active</span>{/if}',
          '</article>',
          '{/each}',
          '</div>',
        ].join(''),
        createComponent: () => ({
          cards: [
            { id: 'c1', title: 'One', active: true },
            { id: 'c2', title: 'Two', active: false },
          ],
        }),
      });
      expect(shadowHTML(el)).toBe(
        '<div class="cards">'
          + '<article data-id="c1"><h2>One</h2><span class="badge">Active</span></article>'
          + '<article data-id="c2"><h2>Two</h2></article>'
          + '</div>',
      );
    });

    it('nav menu with submenus', async () => {
      const el = await renderComponent({
        template: [
          '<nav>',
          '{#each item in items}',
          '<div class="menu-item {classIf item.active \'active\'}">',
          '<a href="{item.href}">{item.label}</a>',
          '{#if item.children}',
          '<ul class="sub">{#each child in item.children}<li><a href="{child.href}">{child.label}</a></li>{/each}</ul>',
          '{/if}',
          '</div>',
          '{/each}',
          '</nav>',
        ].join(''),
        createComponent: () => ({
          items: [
            { label: 'Home', href: '/', active: true, children: null },
            {
              label: 'Products',
              href: '/products',
              active: false,
              children: [
                { label: 'Widget', href: '/w' },
                { label: 'Gadget', href: '/g' },
              ],
            },
          ],
        }),
      });
      expect(shadowHTML(el)).toBe(
        '<nav>'
          + '<div class="menu-item active "><a href="/">Home</a></div>'
          + '<div class="menu-item "><a href="/products">Products</a>'
          + '<ul class="sub"><li><a href="/w">Widget</a></li><li><a href="/g">Gadget</a></li></ul>'
          + '</div>'
          + '</nav>',
      );
    });

    it('form with conditional fields and dynamic list', async () => {
      const el = await renderComponent({
        template: [
          '<form>',
          '<label>Name</label>',
          '<input type="text" value="{name}">',
          '{#if showEmail}<label>Email</label><input type="email" value="{email}">{/if}',
          '<div class="tags">{#each t in tags}<span class="tag">{t}</span>{/each}</div>',
          '<button type="submit" disabled={busy}>{btnText}</button>',
          '</form>',
        ].join(''),
        defaultState: { showEmail: true, busy: false },
        createComponent: () => ({
          name: 'John',
          email: 'j@e.com',
          tags: ['vip', 'new'],
          btnText: 'Save',
        }),
      });
      expect(shadowHTML(el)).toBe(
        '<form>'
          + '<label>Name</label>'
          + '<input type="text" value="John">'
          + '<label>Email</label><input type="email" value="j@e.com">'
          + '<div class="tags"><span class="tag">vip</span><span class="tag">new</span></div>'
          + '<button type="submit">Save</button>'
          + '</form>',
      );

      el.template.state.showEmail.set(false);
      el.template.state.busy.set(true);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe(
        '<form>'
          + '<label>Name</label>'
          + '<input type="text" value="John">'
          + '<div class="tags"><span class="tag">vip</span><span class="tag">new</span></div>'
          + '<button type="submit" disabled="true">Save</button>'
          + '</form>',
      );
    });

    it('subtemplate layout with header, items, and footer', async () => {
      const headerTpl = defineComponent({
        renderingEngine: engine,
        template: '<header><h1>{title}</h1></header>',
      });
      const itemTpl = defineComponent({
        renderingEngine: engine,
        template: '<div class="item"><b>{name}</b><em>{desc}</em></div>',
      });
      const el = await renderComponent({
        template: [
          '<div class="layout">',
          '{>headerTpl title="Dashboard"}',
          '<main>{#each it in getItems}{>itemTpl name=it.name desc=it.desc}{/each}</main>',
          '<footer>Total: {getTotal}</footer>',
          '</div>',
        ].join(''),
        defaultState: { v: 0 },
        createComponent: ({ state }) => ({
          getItems: () =>
            state.v.get() === 0
              ? [{ name: 'A', desc: 'dA' }, { name: 'B', desc: 'dB' }]
              : [{ name: 'X', desc: 'dX' }],
          getTotal: () => state.v.get() === 0 ? '2' : '1',
        }),
        subTemplates: { headerTpl, itemTpl },
      });
      expect(shadowHTML(el)).toBe(
        '<div class="layout">'
          + '<header><h1>Dashboard</h1></header>'
          + '<main><div class="item"><b>A</b><em>dA</em></div><div class="item"><b>B</b><em>dB</em></div></main>'
          + '<footer>Total: 2</footer>'
          + '</div>',
      );

      el.template.state.v.set(1);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe(
        '<div class="layout">'
          + '<header><h1>Dashboard</h1></header>'
          + '<main><div class="item"><b>X</b><em>dX</em></div></main>'
          + '<footer>Total: 1</footer>'
          + '</div>',
      );
    });
  });

  /*******************************
   Closing Tag Integrity
   ————————————————————————
   These tests target the #1 vanilla renderer
   failure mode: content after a dynamic block
   escapes its parent element because the
   renderer loses track of the insertion point.
  *******************************/

  describe(`[${engine}] closing tag integrity — content after dynamic blocks`, () => {
    it('static element after {#each} stays inside parent', async () => {
      const el = await renderComponent({
        template: '<div class="parent">{#each n in items}<span>{n}</span>{/each}<footer>after</footer></div>',
        createComponent: () => ({ items: ['a', 'b'] }),
      });
      expect(shadowHTML(el)).toBe(
        '<div class="parent"><span>a</span><span>b</span><footer>after</footer></div>',
      );
    });

    it('static element after {#if} stays inside parent', async () => {
      const el = await renderComponent({
        template: '<div class="parent">{#if show}<span>yes</span>{/if}<footer>after</footer></div>',
        defaultState: { show: true },
      });
      expect(shadowHTML(el)).toBe(
        '<div class="parent"><span>yes</span><footer>after</footer></div>',
      );

      el.template.state.show.set(false);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe(
        '<div class="parent"><footer>after</footer></div>',
      );
    });

    it('static element after {#if}/{#else} stays inside parent', async () => {
      const el = await renderComponent({
        template: '<div class="parent">{#if show}<span>on</span>{else}<span>off</span>{/if}<p>tail</p></div>',
        defaultState: { show: true },
      });
      expect(shadowHTML(el)).toBe('<div class="parent"><span>on</span><p>tail</p></div>');

      el.template.state.show.set(false);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe('<div class="parent"><span>off</span><p>tail</p></div>');
    });

    it('multiple static elements after {#each} stay inside parent', async () => {
      const el = await renderComponent({
        template: '<section>{#each n in items}<span>{n}</span>{/each}<hr><footer>end</footer></section>',
        createComponent: () => ({ items: ['x', 'y'] }),
      });
      expect(shadowHTML(el)).toBe(
        '<section><span>x</span><span>y</span><hr><footer>end</footer></section>',
      );
    });

    it('content between two dynamic blocks stays inside parent', async () => {
      const el = await renderComponent({
        template:
          '<div class="wrap">{#if a}<span>A</span>{/if}<hr class="mid">{#each n in items}<b>{n}</b>{/each}</div>',
        defaultState: { a: true },
        createComponent: () => ({ items: [1, 2] }),
      });
      expect(shadowHTML(el)).toBe(
        '<div class="wrap"><span>A</span><hr class="mid"><b>1</b><b>2</b></div>',
      );
    });

    it('conditional at end of parent — parent closes properly', async () => {
      const el = await renderComponent({
        template: [
          '<div class="section">',
          '<div class="header">Title</div>',
          '{#if expanded}<div class="content">Body</div>{/if}',
          '</div>',
        ].join(''),
        defaultState: { expanded: true },
      });
      expect(shadowHTML(el)).toBe(
        '<div class="section"><div class="header">Title</div><div class="content">Body</div></div>',
      );

      el.template.state.expanded.set(false);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe(
        '<div class="section"><div class="header">Title</div></div>',
      );

      el.template.state.expanded.set(true);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe(
        '<div class="section"><div class="header">Title</div><div class="content">Body</div></div>',
      );
    });

    it('each at end of parent — parent closes properly', async () => {
      const el = await renderComponent({
        template: '<div class="wrapper"><h2>Title</h2><ul>{#each n in items}<li>{n}</li>{/each}</ul></div>',
        createComponent: () => ({ items: ['a', 'b'] }),
      });
      expect(shadowHTML(el)).toBe(
        '<div class="wrapper"><h2>Title</h2><ul><li>a</li><li>b</li></ul></div>',
      );
    });

    it('nested parent with each then static siblings at outer level', async () => {
      const el = await renderComponent({
        template: [
          '<div class="outer">',
          '<div class="inner">{#each n in items}<span>{n}</span>{/each}</div>',
          '<footer>after-inner</footer>',
          '</div>',
        ].join(''),
        createComponent: () => ({ items: ['a', 'b'] }),
      });
      expect(shadowHTML(el)).toBe(
        '<div class="outer"><div class="inner"><span>a</span><span>b</span></div><footer>after-inner</footer></div>',
      );
    });

    it('each inside if, with content after the if, inside a parent', async () => {
      const el = await renderComponent({
        template: [
          '<div class="container">',
          '{#if show}',
          '<ul>{#each n in items}<li>{n}</li>{/each}</ul>',
          '{/if}',
          '<footer>always here</footer>',
          '</div>',
        ].join(''),
        defaultState: { show: true },
        createComponent: () => ({ items: ['x', 'y'] }),
      });
      expect(shadowHTML(el)).toBe(
        '<div class="container"><ul><li>x</li><li>y</li></ul><footer>always here</footer></div>',
      );

      el.template.state.show.set(false);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe(
        '<div class="container"><footer>always here</footer></div>',
      );
    });
  });

  /*******************************
   Real Component Patterns
   ————————————————————————
   Templates modeled after actual components
   in the Semantic UI codebase (TodoMVC,
   accordion, dropdown) to catch structural
   issues at realistic complexity.
  *******************************/

  describe(`[${engine}] real component patterns`, () => {
    it('accordion pattern — each with conditional at end of item', async () => {
      const el = await renderComponent({
        template: [
          '<div class="accordion">',
          '{#each section, i in sections}',
          '<div class="section">',
          '<div class="header" data-index="{i}">{section.title}</div>',
          '{#if isExpanded i}',
          '<div class="content">{section.body}</div>',
          '{/if}',
          '</div>',
          '{/each}',
          '</div>',
        ].join(''),
        defaultState: { openIndex: 0 },
        createComponent: ({ state }) => ({
          sections: [
            { title: 'S1', body: 'Body 1' },
            { title: 'S2', body: 'Body 2' },
            { title: 'S3', body: 'Body 3' },
          ],
          isExpanded: (i) => state.openIndex.get() === i,
        }),
      });
      expect(shadowHTML(el)).toBe(
        '<div class="accordion">'
          + '<div class="section"><div class="header" data-index="0">S1</div><div class="content">Body 1</div></div>'
          + '<div class="section"><div class="header" data-index="1">S2</div></div>'
          + '<div class="section"><div class="header" data-index="2">S3</div></div>'
          + '</div>',
      );

      el.template.state.openIndex.set(2);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe(
        '<div class="accordion">'
          + '<div class="section"><div class="header" data-index="0">S1</div></div>'
          + '<div class="section"><div class="header" data-index="1">S2</div></div>'
          + '<div class="section"><div class="header" data-index="2">S3</div><div class="content">Body 3</div></div>'
          + '</div>',
      );
    });

    it('dropdown pattern — if + each inside a menu div with content after', async () => {
      const el = await renderComponent({
        template: [
          '<div class="dropdown">',
          '<div class="text">{selected}</div>',
          '<div class="menu">',
          '{#if allowEmpty}<div class="item empty">None</div>{/if}',
          '{#each opt in options}',
          '<div class="item" data-value="{opt.value}">{opt.text}</div>',
          '{/each}',
          '</div>',
          '</div>',
        ].join(''),
        defaultState: { allowEmpty: true },
        createComponent: () => ({
          selected: 'Pick one',
          options: [
            { value: 'a', text: 'Apple' },
            { value: 'b', text: 'Banana' },
          ],
        }),
      });
      expect(shadowHTML(el)).toBe(
        '<div class="dropdown">'
          + '<div class="text">Pick one</div>'
          + '<div class="menu">'
          + '<div class="item empty">None</div>'
          + '<div class="item" data-value="a">Apple</div>'
          + '<div class="item" data-value="b">Banana</div>'
          + '</div>'
          + '</div>',
      );

      el.template.state.allowEmpty.set(false);
      await waitForUpdate(el);
      expect(shadowHTML(el)).toBe(
        '<div class="dropdown">'
          + '<div class="text">Pick one</div>'
          + '<div class="menu">'
          + '<div class="item" data-value="a">Apple</div>'
          + '<div class="item" data-value="b">Banana</div>'
          + '</div>'
          + '</div>',
      );
    });

    it('todo-item pattern — conditional at end of li', async () => {
      const todoItem = defineComponent({
        renderingEngine: engine,
        template: [
          '<li class="{classMap {completed: completed, editing: editing}}">',
          '<div class="view">',
          '<input class="toggle" type="checkbox" checked={completed}>',
          '<label>{title}</label>',
          '<button class="destroy"></button>',
          '</div>',
          '{#if editing}<input class="edit" value="{title}">{/if}',
          '</li>',
        ].join(''),
      });
      const el = await renderComponent({
        template: [
          '<ul class="todo-list">',
          '{#each todo in getTodos}',
          '{>todoItem title=todo.title completed=todo.completed editing=todo.editing}',
          '{/each}',
          '</ul>',
        ].join(''),
        createComponent: () => ({
          getTodos: () => [
            { title: 'Buy milk', completed: false, editing: false },
            { title: 'Walk dog', completed: true, editing: false },
            { title: 'Code', completed: false, editing: true },
          ],
        }),
        subTemplates: { todoItem },
      });

      const html = shadowHTML(el);

      // Every <li> must be inside the <ul>
      const ul = el.shadowRoot.querySelector('.todo-list');
      const lis = ul.querySelectorAll('li');
      expect(lis.length).toBe(3);
      for (const li of lis) {
        expect(li.parentElement).toBe(ul);
      }

      // First item: not completed, not editing
      expect(lis[0].classList.contains('completed')).toBe(false);
      expect(lis[0].querySelector('.view')).not.toBeNull();
      expect(lis[0].querySelector('.edit')).toBeNull();

      // Second item: completed
      expect(lis[1].classList.contains('completed')).toBe(true);

      // Third item: editing — has edit input, still inside the li
      expect(lis[2].classList.contains('editing')).toBe(true);
      const editInput = lis[2].querySelector('.edit');
      expect(editInput).not.toBeNull();
      expect(editInput.parentElement).toBe(lis[2]);

      // View div is still inside the li too
      expect(lis[2].querySelector('.view').parentElement).toBe(lis[2]);
    });

    it('TodoMVC-scale template — full structural integrity', async () => {
      const todoItem = defineComponent({
        renderingEngine: engine,
        template: [
          '<li class="{classMap {completed: completed}}">',
          '<div class="view">',
          '<input class="toggle" type="checkbox" checked={completed}>',
          '<label>{title}</label>',
          '<button class="destroy"></button>',
          '</div>',
          '</li>',
        ].join(''),
      });
      const el = await renderComponent({
        template: [
          '<section class="todoapp">',
          '<header class="header">',
          '<h1>todos</h1>',
          '<input class="new-todo" placeholder="What needs to be done?">',
          '</header>',
          '{#if hasTodos}',
          '<section class="main">',
          '<input id="toggle-all" class="toggle-all" type="checkbox">',
          '<label for="toggle-all">Mark all</label>',
          '<ul class="todo-list">',
          '{#each todo in getTodos}',
          '{>todoItem title=todo.title completed=todo.completed}',
          '{/each}',
          '</ul>',
          '</section>',
          '{>footer}',
          '{/if}',
          '</section>',
          '{#snippet footer}',
          '<footer class="footer">',
          '<span class="todo-count"><strong>{getActiveCount}</strong> items left</span>',
          '<ul class="filters">',
          '{#each f in filters}',
          '<li><a href="{f.href}" class="{classIf f.active \'selected\'}">{f.label}</a></li>',
          '{/each}',
          '</ul>',
          '{#if hasCompleted}<button class="clear-completed">Clear completed</button>{/if}',
          '</footer>',
          '{/snippet}',
        ].join(''),
        defaultState: { hasTodos: true, hasCompleted: true },
        createComponent: ({ state }) => ({
          getTodos: () => [
            { title: 'Buy milk', completed: false },
            { title: 'Walk dog', completed: true },
          ],
          getActiveCount: () => 1,
          filters: [
            { label: 'All', href: '#/', active: true },
            { label: 'Active', href: '#/active', active: false },
            { label: 'Completed', href: '#/completed', active: false },
          ],
        }),
        subTemplates: { todoItem },
      });

      // Structural integrity checks via DOM queries
      const todoapp = el.shadowRoot.querySelector('.todoapp');
      expect(todoapp).not.toBeNull();

      // Header inside todoapp
      const header = todoapp.querySelector('.header');
      expect(header).not.toBeNull();
      expect(header.querySelector('h1').textContent).toBe('todos');
      expect(header.querySelector('.new-todo')).not.toBeNull();

      // Main section inside todoapp (conditional rendered)
      const main = todoapp.querySelector('.main');
      expect(main).not.toBeNull();
      expect(main.querySelector('.toggle-all')).not.toBeNull();
      expect(main.querySelector('label[for="toggle-all"]').textContent).toBe('Mark all');

      // Todo list with correct items
      const todoList = main.querySelector('.todo-list');
      const todoLis = todoList.querySelectorAll('li');
      expect(todoLis.length).toBe(2);
      expect(todoLis[0].querySelector('label').textContent).toBe('Buy milk');
      expect(todoLis[0].classList.contains('completed')).toBe(false);
      expect(todoLis[1].querySelector('label').textContent).toBe('Walk dog');
      expect(todoLis[1].classList.contains('completed')).toBe(true);

      // Todo list is inside main
      expect(todoList.parentElement).toBe(main);

      // Footer (rendered via snippet) inside todoapp
      const footer = todoapp.querySelector('.footer');
      expect(footer).not.toBeNull();
      expect(footer.querySelector('.todo-count strong').textContent).toBe('1');

      // Filters list inside footer
      const filterLis = footer.querySelectorAll('.filters li');
      expect(filterLis.length).toBe(3);
      expect(filterLis[0].querySelector('a').textContent).toBe('All');
      expect(filterLis[0].querySelector('a').classList.contains('selected')).toBe(true);
      expect(filterLis[1].querySelector('a').classList.contains('selected')).toBe(false);

      // Clear completed button inside footer
      expect(footer.querySelector('.clear-completed')).not.toBeNull();

      // Footer is inside todoapp (not escaped)
      expect(footer.closest('.todoapp')).toBe(todoapp);

      // Now toggle hasTodos off — entire main + footer should vanish
      el.template.state.hasTodos.set(false);
      await waitForUpdate(el);

      expect(todoapp.querySelector('.main')).toBeNull();
      expect(todoapp.querySelector('.footer')).toBeNull();
      // Header must survive
      expect(todoapp.querySelector('.header h1').textContent).toBe('todos');

      // Toggle back on
      el.template.state.hasTodos.set(true);
      await waitForUpdate(el);

      expect(todoapp.querySelector('.main')).not.toBeNull();
      expect(todoapp.querySelector('.footer')).not.toBeNull();
      expect(todoapp.querySelectorAll('.todo-list li').length).toBe(2);
      expect(todoapp.querySelectorAll('.filters li').length).toBe(3);
    });

    it('classMap produces correct class string', async () => {
      const el = await renderComponent({
        template: '<div class="{classMap getClasses}">content</div>',
        defaultState: { active: true, disabled: false, highlighted: true },
        createComponent: ({ state }) => ({
          getClasses: () => ({
            active: state.active.get(),
            disabled: state.disabled.get(),
            highlighted: state.highlighted.get(),
          }),
        }),
      });
      const div = el.shadowRoot.querySelector('div');
      expect(div.classList.contains('active')).toBe(true);
      expect(div.classList.contains('disabled')).toBe(false);
      expect(div.classList.contains('highlighted')).toBe(true);

      el.template.state.active.set(false);
      el.template.state.disabled.set(true);
      await waitForUpdate(el);

      expect(div.classList.contains('active')).toBe(false);
      expect(div.classList.contains('disabled')).toBe(true);
      expect(div.classList.contains('highlighted')).toBe(true);
    });

    it('snippet with each + conditional — footer pattern', async () => {
      const el = await renderComponent({
        template: [
          '{#snippet statusBar}',
          '<footer class="status">',
          '<span class="count">{total}</span>',
          '<ul class="tabs">{#each t in tabs}<li class="{classIf t.active \'on\'}">{t.label}</li>{/each}</ul>',
          '{#if showClear}<button class="clear">Clear</button>{/if}',
          '</footer>',
          '{/snippet}',
          '<div class="app">',
          '<main>Content</main>',
          '{>statusBar}',
          '</div>',
        ].join(''),
        defaultState: { showClear: true },
        createComponent: () => ({
          total: '3',
          tabs: [
            { label: 'All', active: true },
            { label: 'Done', active: false },
          ],
        }),
      });

      const app = el.shadowRoot.querySelector('.app');
      const footer = app.querySelector('.status');
      expect(footer).not.toBeNull();

      // Footer is inside app
      expect(footer.closest('.app')).toBe(app);

      // Count
      expect(footer.querySelector('.count').textContent).toBe('3');

      // Tabs
      const tabLis = footer.querySelectorAll('.tabs li');
      expect(tabLis.length).toBe(2);

      // Tabs are inside the ul, inside footer
      const ul = footer.querySelector('.tabs');
      for (const li of tabLis) {
        expect(li.parentElement).toBe(ul);
      }

      // Clear button inside footer
      expect(footer.querySelector('.clear')).not.toBeNull();

      // Toggle clear off
      el.template.state.showClear.set(false);
      await waitForUpdate(el);

      expect(footer.querySelector('.clear')).toBeNull();
      // Rest of footer intact
      expect(footer.querySelector('.count').textContent).toBe('3');
      expect(footer.querySelectorAll('.tabs li').length).toBe(2);
    });

    it('subtemplate with internal conditional renders inside parent correctly', async () => {
      const detail = defineComponent({
        renderingEngine: engine,
        template: [
          '<div class="detail">',
          '<span class="name">{name}</span>',
          '{#if showExtra}<span class="extra">{extra}</span>{/if}',
          '</div>',
        ].join(''),
      });
      const el = await renderComponent({
        template:
          '<div class="list">{#each item in getItems}{>detail name=item.name showExtra=item.show extra=item.extra}{/each}</div>',
        createComponent: () => ({
          getItems: () => [
            { name: 'A', show: true, extra: 'A-extra' },
            { name: 'B', show: false, extra: 'B-extra' },
          ],
        }),
        subTemplates: { detail },
      });

      const list = el.shadowRoot.querySelector('.list');
      const details = list.querySelectorAll('.detail');
      expect(details.length).toBe(2);

      // Both details inside the list
      for (const d of details) {
        expect(d.parentElement).toBe(list);
      }

      // First detail — has extra, still inside its .detail div
      expect(details[0].querySelector('.name').textContent).toBe('A');
      expect(details[0].querySelector('.extra')).not.toBeNull();
      expect(details[0].querySelector('.extra').parentElement).toBe(details[0]);

      // Second detail — no extra, .detail div still closes correctly
      expect(details[1].querySelector('.name').textContent).toBe('B');
      expect(details[1].querySelector('.extra')).toBeNull();
      // .name is still inside .detail
      expect(details[1].querySelector('.name').parentElement).toBe(details[1]);
    });
  });
}); // RENDERING_ENGINES.forEach
