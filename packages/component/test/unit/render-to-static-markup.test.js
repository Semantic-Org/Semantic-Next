import { describe, expect, it } from 'vitest';

import { defineComponent, renderToStaticMarkup, renderToString } from '@semantic-ui/component';

const Card = defineComponent({
  tagName: 'static-card',
  template: '<div class="card">{title}</div>',
  css: '.card { padding: 8px; }',
});

const Blocks = defineComponent({
  tagName: 'static-blocks',
  template: '<ul class="{kind}">{#each item in items}<li>{item.label}</li>{/each}</ul>'
    + '{#if on}<b>on</b>{else}<i>off</i>{/if}'
    + "{#match tone}{is 'warm'}<em>warm</em>{else}<em>cold</em>{/match}"
    + '{#rerender kind}<span>{kind}</span>{/rerender}',
});
const blocksData = { kind: 'list', items: [{ label: 'a' }, { label: 'b' }], on: false, tone: 'warm' };

const Slotted = defineComponent({
  tagName: 'static-slotted',
  template: '<header>{>slot header}</header><main>{>slot}</main>',
});

const Rows = defineComponent({
  tagName: 'static-rows',
  template: '{#snippet badge}<b>{label}</b>{/snippet}<table>{>row label=x}</table>{>badge label=x}',
  subTemplates: { row: { template: '<tr><td>{label}</td></tr>' } },
});

const Note = defineComponent({
  tagName: 'static-note',
  template: 'Hi {name}, see {link} {#html raw}',
});
const noteData = { name: 'A & B', link: '<x>', raw: '<i>raw</i>' };

const seen = { isServer: null, created: 0 };
const Greeting = defineComponent({
  tagName: 'static-greeting',
  template: '<p>{greeting} {tone}</p>',
  defaultSettings: { name: 'nobody', tone: 'calm' },
  createComponent: ({ isServer, settings }) => ({
    initialize() {
      seen.isServer = isServer;
    },
    greeting() {
      return `hi ${settings.name}`;
    },
  }),
  onCreated() {
    seen.created++;
  },
});

// the icon-like spec the alias suite uses: bare values claim an attribute each
const Icon = defineComponent({
  tagName: 'static-icon',
  template: '<i class="{icon} {size}"></i>',
  componentSpec: {
    attributes: ['icon', 'size'],
    properties: [],
    optionAttributes: { 'home': 'icon', 'arrow-right': 'icon', 'small': 'size', 'large': 'size' },
    propertyTypes: { icon: String, size: String },
    allowedValues: { icon: ['home', 'arrow-right'], size: ['small', 'large'] },
    attributeClasses: [],
  },
});

const shadowContent = (html) => html.match(/<template shadowrootmode="open">([\s\S]*)<\/template>/)[1];
const withoutMarkers = (html) => html.replace(/<!--[\s\S]*?-->/g, '').replace(/\s+data-sui-bind="[^"]*"/g, '');

describe('renderToStaticMarkup', () => {
  it('returns the template content alone, without a shadow root or style', () => {
    expect(renderToStaticMarkup(Card, { title: 'Hello' })).toBe('<div class="card">Hello</div>');
  });

  it('carries no hydration markers or bind attributes where renderToString carries both', () => {
    const html = renderToStaticMarkup(Blocks, blocksData);
    expect(html).toBe('<ul class="list"><li>a</li><li>b</li></ul><i>off</i><em>warm</em><span>list</span>');
    expect(html).not.toContain('<!--');
    expect(html).not.toContain('data-sui-bind');

    const dsd = renderToString(Blocks, blocksData);
    expect(dsd).toContain('<!--sui');
    expect(dsd).toContain('data-sui-bind');
  });

  it('fills each slot in place with the content passed for it', () => {
    const html = renderToStaticMarkup(Slotted, {}, { slots: { default: '<p>body</p>', header: '<h1>hi</h1>' } });
    expect(html).toBe('<header><h1>hi</h1></header><main><p>body</p></main>');
    expect(html).not.toContain('<slot');
  });

  it('emits nothing at a slot when no content is passed', () => {
    expect(renderToStaticMarkup(Slotted)).toBe('<header></header><main></main>');
  });

  it('renders subtemplates and snippets inline with their data', () => {
    expect(renderToStaticMarkup(Rows, { x: 'x1' })).toBe('<table><tr><td>x1</td></tr></table><b>x1</b>');
  });

  describe('text', () => {
    it('leaves & and < unescaped under text mode', () => {
      expect(renderToStaticMarkup(Note, noteData, { text: true })).toBe('Hi A & B, see <x> <i>raw</i>');
    });

    it('escapes them by default, with {#html} raw either way', () => {
      expect(renderToStaticMarkup(Note, noteData)).toBe('Hi A &amp; B, see &lt;x&gt; <i>raw</i>');
    });
  });

  describe('lifecycle', () => {
    it('runs createComponent as the server and fires onCreated, defaults under the attributes', () => {
      expect(renderToStaticMarkup(Greeting, { name: 'jack' })).toBe('<p>hi jack calm</p>');
      expect(seen.isServer).toBe(true);
      expect(seen.created).toBe(1);
    });

    it('resolves spec attribute aliases the way renderToString does', () => {
      const attrs = { home: true, large: true };
      const html = renderToStaticMarkup(Icon, attrs);
      expect(html).toBe('<i class="home large"></i>');
      expect(html).toBe(withoutMarkers(shadowContent(renderToString(Icon, attrs))));
    });
  });
});

describe('renderToString', () => {
  it('keeps its declarative shadow DOM output', () => {
    expect(renderToString(Card, { title: 'Hello' })).toBe(
      '<static-card title="Hello"><template shadowrootmode="open"><style>.card { padding: 8px; }</style>'
        + '<div class="card"><!--sui:v1:0-->Hello</div></template></static-card>',
    );
    expect(renderToString(Blocks, blocksData)).toBe(
      '<static-blocks kind="list" items="[{&quot;label&quot;:&quot;a&quot;},{&quot;label&quot;:&quot;b&quot;}]" tone="warm">'
        + '<template shadowrootmode="open"><ul class="list" data-sui-bind="class=0"><!--sui-block:v1:1-->'
        + '<!--sui-item:v1:0--><li><!--sui:v1:0-->a</li><!--sui-item:v1:1--><li><!--sui:v1:0-->b</li>'
        + '<!--/sui-block:v1:1--></ul><!--sui-block:v1:2--><i>off</i><!--/sui-block:v1:2:b0-->'
        + '<!--sui-block:v1:3--><em>warm</em><!--/sui-block:v1:3:b0--><!--sui-block:v1:4--><span>'
        + '<!--sui:v1:0-->list</span><!--/sui-block:v1:4--></template></static-blocks>',
    );
    expect(renderToString(Slotted, {}, { slots: { default: '<p>body</p>', header: '<h1>hi</h1>' } })).toBe(
      '<static-slotted><template shadowrootmode="open"><header><slot name="header"></slot></header>'
        + '<main><slot></slot></main></template><p>body</p><span slot="header"><h1>hi</h1></span></static-slotted>',
    );
    expect(renderToString(Rows, { x: 'x1' })).toBe(
      '<static-rows x="x1"><template shadowrootmode="open"><table><!--sui-block:v1:0--><tr><td>'
        + '<!--sui:v1:0-->x1</td></tr><!--/sui-block:v1:0--></table><!--sui-block:v1:1--><b><!--sui:v1:0-->x1</b>'
        + '<!--/sui-block:v1:1--></template></static-rows>',
    );
    expect(renderToString(Note, noteData)).toBe(
      '<static-note name="A &amp; B" link="&lt;x&gt;" raw="&lt;i&gt;raw&lt;/i&gt;"><template shadowrootmode="open">'
        + 'Hi <!--sui:v1:0-->A &amp; B, see <!--sui:v1:1-->&lt;x&gt; <!--sui:v1:2--><i>raw</i></template></static-note>',
    );
  });
});

const Part = defineComponent({
  tagName: 'static-part',
  template: '<span class="part">{label}</span>',
  css: '.part { color: red; }',
});

const Panel = defineComponent({
  tagName: 'static-panel',
  template: '<section><header>{>slot title}</header>{>slot}</section>',
  css: '.panel { border: 0; }',
});

const Page = defineComponent({
  tagName: 'static-page',
  template: '<div><static-part label="x"></static-part><static-part label="y"></static-part>'
    + '<static-panel><h2 slot="title">T</h2><p>body</p></static-panel></div>',
  css: '.page { margin: 0; }',
});
const pageHTML = '<div><span class="part">x</span><span class="part">y</span>'
  + '<section><header><h2 slot="title">T</h2></header><p>body</p></section></div>';

describe('renderToStaticMarkup with nested components', () => {
  it('renders a nested component flat where its tag sat, its children assigned to its slots', () => {
    const html = renderToStaticMarkup(Page);
    expect(html).toBe(pageHTML);
    expect(html).not.toContain('<static-');
    expect(html).not.toContain('shadowrootmode');
  });

  it('returns the css of every component it reached under css: true, each once, parent first', () => {
    expect(renderToStaticMarkup(Page, {}, { css: true })).toEqual({
      html: pageHTML,
      css: '.page { margin: 0; }\n.part { color: red; }\n.panel { border: 0; }',
    });
  });
});

// the compiler trims a template's ends even under preserveWhitespace, so the row's newline sits mid-template
const RowText = defineComponent({ template: '- {label}', preserveWhitespace: true });
const ListText = defineComponent({
  template: 'Hi {name} & {link}\n{#each item in items}{>row label=item}\n{/each}',
  preserveWhitespace: true,
  defaultSettings: { name: 'nobody', items: ['a', 'b'] },
  subTemplates: { row: RowText },
});
const Bare = defineComponent({
  template: '<table>{>row label=x}</table><static-part label="z"></static-part>',
  defaultSettings: { x: 'd' },
  subTemplates: { row: { template: '<tr><td>{label}</td></tr>' } },
});

describe('renderToStaticMarkup with a tag-less definition', () => {
  it('renders the prototype template with its own defaults and subtemplates', () => {
    expect(renderToStaticMarkup(Bare)).toBe('<table><tr><td>d</td></tr></table><span class="part">z</span>');
    expect(renderToStaticMarkup(Bare, { x: 'x1' })).toContain('<td>x1</td>');
  });

  it('renders text mode the same way', () => {
    expect(renderToStaticMarkup(ListText, { link: '<x>' }, { text: true })).toBe('Hi nobody & <x>\n- a\n- b\n');
  });

  it('collects the css of the definition and of what it expanded', () => {
    expect(renderToStaticMarkup(Bare, {}, { css: true }).css).toBe('.part { color: red; }');
  });

  it('is refused by renderToString, which needs a tag to wrap', () => {
    expect(() => renderToString(Bare)).toThrow('renderToString requires a component with a tagName');
  });
});

describe('renderToStaticMarkup slot content', () => {
  it('renders non-string content as text, the way renderToString does', () => {
    expect(renderToStaticMarkup(Slotted, {}, { slots: { default: 42 } })).toBe('<header></header><main>42</main>');
    expect(renderToString(Slotted, {}, { slots: { default: 42 } })).toContain('42');
  });
});
