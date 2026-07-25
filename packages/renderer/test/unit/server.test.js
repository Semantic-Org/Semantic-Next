import { TemplateCompiler } from '@semantic-ui/compiler';
import { TemplateHelpers } from '@semantic-ui/templating';
import { describe, expect, it } from 'vitest';

import {
  BLOCK_MARKER,
  COMMENT_MARKER,
  DATA_SUI_BIND,
  isInsideRawText,
  MARKER_VERSION,
  RAW_TEXT_MARKER,
} from '../../src/build-html-string.js';
import { ServerRenderer } from '../../src/engines/native/server.js';

function compile(template) {
  return new TemplateCompiler(template).compile();
}

function renderToString({ ast, data = {}, css = '', subTemplates = {}, helpers = {} }) {
  const renderer = new ServerRenderer({
    ast,
    data,
    subTemplates,
    helpers: { ...TemplateHelpers, ...helpers },
  });
  const content = renderer.render();
  let result = '';
  if (css) {
    result += `<style>${css}</style>`;
  }
  result += content;
  return `<template shadowrootmode="open">${result}</template>`;
}

function render({ ast, data = {}, subTemplates = {}, helpers = {}, snippets = {} } = {}) {
  const renderer = new ServerRenderer({
    ast,
    data,
    subTemplates,
    snippets,
    helpers: { ...TemplateHelpers, ...helpers },
  });
  return renderer.render();
}

// Strip hydration markers and whitespace for clean comparison. Also strips
// the Plan-04 data-sui-bind attribute (server-stamped hydration hint) so
// tests can assert against clean post-hydration structure.
function stripMarkers(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+data-sui-bind="[^"]*"/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Extract the content inside the DSD <template> tag
function dsdContent(html) {
  const match = html.match(/<template shadowrootmode="open">([\s\S]*)<\/template>/);
  return match ? match[1] : html;
}

describe('renderToString', () => {
  /*******************************
          Static HTML
  *******************************/

  describe('static HTML', () => {
    it('renders plain HTML', () => {
      const ast = compile('<div class="a"><span>text</span></div>');
      const result = renderToString({ ast });
      expect(stripMarkers(dsdContent(result))).toBe('<div class="a"><span>text</span></div>');
    });

    it('renders void elements', () => {
      const ast = compile('<div><br><hr><img src="x.png" alt="y"></div>');
      const result = renderToString({ ast });
      expect(stripMarkers(dsdContent(result))).toBe('<div><br><hr><img src="x.png" alt="y"></div>');
    });

    it('renders sibling elements', () => {
      const ast = compile('<header>H</header><main>M</main><footer>F</footer>');
      const result = renderToString({ ast });
      expect(stripMarkers(dsdContent(result))).toBe('<header>H</header><main>M</main><footer>F</footer>');
    });
  });

  /*******************************
          Expressions
  *******************************/

  describe('expressions', () => {
    it('renders text expression', () => {
      const ast = compile('<div>{name}</div>');
      const result = renderToString({ ast, data: { name: 'Alice' } });
      expect(stripMarkers(dsdContent(result))).toBe('<div>Alice</div>');
    });

    it('renders multiple expressions with text between', () => {
      const ast = compile('<span>{a} {b}</span>');
      const result = renderToString({ ast, data: { a: 'X', b: 'Y' } });
      expect(stripMarkers(dsdContent(result))).toBe('<span>X Y</span>');
    });

    it('renders expression between static text', () => {
      const ast = compile('<p>Hello {name}, welcome!</p>');
      const result = renderToString({ ast, data: { name: 'World' } });
      expect(stripMarkers(dsdContent(result))).toBe('<p>Hello World, welcome!</p>');
    });

    it('renders numeric expression', () => {
      const ast = compile('<span>{total}</span>');
      const result = renderToString({ ast, data: { total: 42 } });
      expect(stripMarkers(dsdContent(result))).toBe('<span>42</span>');
    });

    // false and 0 are the ones worth guarding — a literal that resolves falsy
    // used to disappear rather than throw, so it never surfaced as a failure
    it('renders literal expressions', () => {
      const cases = [['true', 'true'], ['false', 'false'], ['1', '1'], ['0', '0'], ["'baz'", 'baz']];
      for (const [expression, expected] of cases) {
        const ast = compile(`<div>{${expression}}</div>`);
        expect(stripMarkers(dsdContent(renderToString({ ast })))).toBe(`<div>${expected}</div>`);
      }
    });

    it('renders a literal expression in an attribute', () => {
      const ast = compile('<div class="{1}">x</div>');
      expect(stripMarkers(dsdContent(renderToString({ ast })))).toBe('<div class="1">x</div>');
    });

    it('escapes HTML in text expressions', () => {
      const ast = compile('<div>{text}</div>');
      const result = renderToString({ ast, data: { text: '<script>alert(1)</script>' } });
      expect(dsdContent(result)).toContain('&lt;script&gt;');
    });

    it('renders unsafeHTML without escaping', () => {
      const ast = compile('<div>{#html content}</div>');
      const result = renderToString({ ast, data: { content: '<b>bold</b>' } });
      expect(stripMarkers(dsdContent(result))).toBe('<div><b>bold</b></div>');
    });

    it('preserves hydration markers in output', () => {
      const ast = compile('<div>{name}</div>');
      const result = renderToString({ ast, data: { name: 'Alice' } });
      expect(dsdContent(result)).toContain('<!--sui:v1:0-->Alice');
    });
  });

  /*******************************
          Attributes
  *******************************/

  describe('attributes', () => {
    it('renders dynamic attribute', () => {
      const ast = compile('<div class="{cls}">text</div>');
      const result = renderToString({ ast, data: { cls: 'active' } });
      expect(stripMarkers(dsdContent(result))).toBe('<div class="active">text</div>');
    });

    it('renders mixed static + dynamic attribute', () => {
      const ast = compile('<div class="base {mod}">text</div>');
      const result = renderToString({ ast, data: { mod: 'extra' } });
      expect(stripMarkers(dsdContent(result))).toBe('<div class="base extra">text</div>');
    });

    it('renders boolean attribute true', () => {
      const ast = compile('<button disabled={isDisabled}>Go</button>');
      const result = renderToString({ ast, data: { isDisabled: true } });
      const content = stripMarkers(dsdContent(result));
      expect(content).toContain('disabled');
      expect(content).toContain('Go');
    });

    it('removes boolean attribute when false', () => {
      const ast = compile('<button disabled={isDisabled}>Go</button>');
      const result = renderToString({ ast, data: { isDisabled: false } });
      const content = stripMarkers(dsdContent(result));
      expect(content).not.toContain('disabled');
      expect(content).toContain('Go');
    });
  });

  /*******************************
          Conditionals
  *******************************/

  describe('conditionals', () => {
    it('renders true branch', () => {
      const ast = compile('<div>{#if show}<span>yes</span>{else}<span>no</span>{/if}</div>');
      const result = renderToString({ ast, data: { show: true } });
      expect(stripMarkers(dsdContent(result))).toBe('<div><span>yes</span></div>');
    });

    it('renders false branch', () => {
      const ast = compile('<div>{#if show}<span>yes</span>{else}<span>no</span>{/if}</div>');
      const result = renderToString({ ast, data: { show: false } });
      expect(stripMarkers(dsdContent(result))).toBe('<div><span>no</span></div>');
    });

    it('renders else-if branch', () => {
      const ast = compile(
        '{#if is mode "a"}<span>A</span>{else if is mode "b"}<span>B</span>{else}<span>C</span>{/if}',
      );
      const result = renderToString({ ast, data: { mode: 'b' }, helpers: { is: (a, b) => a == b } });
      expect(stripMarkers(dsdContent(result))).toBe('<span>B</span>');
    });

    it('renders empty for false with no else', () => {
      const ast = compile('<div>{#if show}<span>content</span>{/if}</div>');
      const result = renderToString({ ast, data: { show: false } });
      expect(stripMarkers(dsdContent(result))).toBe('<div></div>');
    });

    it('renders a literal condition', () => {
      const yes = compile('<div>{#if true}<span>yes</span>{else}<span>no</span>{/if}</div>');
      expect(stripMarkers(dsdContent(renderToString({ ast: yes })))).toBe('<div><span>yes</span></div>');
      const no = compile('<div>{#if false}<span>yes</span>{else}<span>no</span>{/if}</div>');
      expect(stripMarkers(dsdContent(renderToString({ ast: no })))).toBe('<div><span>no</span></div>');
    });

    it('preserves block markers for hydration', () => {
      const ast = compile('{#if show}<span>yes</span>{/if}');
      const result = renderToString({ ast, data: { show: true } });
      const content = dsdContent(result);
      expect(content).toContain('<!--sui-block:v1:0-->');
      expect(content).toContain('<!--/sui-block:v1:0:b1000-->');
    });
  });

  describe('match', () => {
    it('renders the matching case', () => {
      const ast = compile(
        `{#match status}{is 'loading'}<span>wait</span>{is 'done'}<span>ready</span>{else}<span>idle</span>{/match}`,
      );
      const result = renderToString({ ast, data: { status: 'done' } });
      expect(stripMarkers(dsdContent(result))).toBe('<span>ready</span>');
    });

    it('renders a multi-value case', () => {
      const ast = compile(`{#match status}{is 'loading' 'pending'}<span>wait</span>{else}<span>done</span>{/match}`);
      const result = renderToString({ ast, data: { status: 'pending' } });
      expect(stripMarkers(dsdContent(result))).toBe('<span>wait</span>');
    });

    it('renders else when no case matches', () => {
      const ast = compile(`{#match status}{is 'loading'}<span>wait</span>{else}<span>idle</span>{/match}`);
      const result = renderToString({ ast, data: { status: 'mystery' } });
      expect(stripMarkers(dsdContent(result))).toBe('<span>idle</span>');
    });

    it('renders empty when no case matches and there is no else', () => {
      const ast = compile(`<div>{#match status}{is 'loading'}<span>wait</span>{/match}</div>`);
      const result = renderToString({ ast, data: { status: 'other' } });
      expect(stripMarkers(dsdContent(result))).toBe('<div></div>');
    });

    it('stamps the matched branch index on the close marker', () => {
      const ast = compile(`{#match s}{is 'a'}<i>A</i>{is 'b'}<i>B</i>{else}<i>C</i>{/match}`);
      expect(dsdContent(renderToString({ ast, data: { s: 'a' } }))).toContain('<!--/sui-block:v1:0:b0-->');
      expect(dsdContent(renderToString({ ast, data: { s: 'b' } }))).toContain('<!--/sui-block:v1:0:b1-->');
      expect(dsdContent(renderToString({ ast, data: { s: 'z' } }))).toContain('<!--/sui-block:v1:0:b2-->');
    });

    it('stamps b-1 when no case matches and there is no else', () => {
      const ast = compile(`{#match s}{is 'a'}<i>A</i>{/match}`);
      expect(dsdContent(renderToString({ ast, data: { s: 'z' } }))).toContain('<!--/sui-block:v1:0:b-1-->');
    });

    it('matches {isExactly} strictly', () => {
      const ast = compile(
        `{#match v}{isExactly ''}<span>empty</span>{isExactly 0}<span>zero</span>{else}<span>other</span>{/match}`,
      );
      // 0 === '' is false, so strict skips the empty-string case
      expect(stripMarkers(dsdContent(renderToString({ ast, data: { v: 0 } })))).toBe('<span>zero</span>');
    });
  });

  /*******************************
          Each Loops
  *******************************/

  describe('each loops', () => {
    it('renders simple list', () => {
      const ast = compile('<ul>{#each item in items}<li>{item}</li>{/each}</ul>');
      const result = renderToString({ ast, data: { items: ['a', 'b', 'c'] } });
      expect(stripMarkers(dsdContent(result))).toBe('<ul><li>a</li><li>b</li><li>c</li></ul>');
    });

    it('renders with per-item attributes', () => {
      const ast = compile('{#each item in items}<div data-id="{item.id}">{item.label}</div>{/each}');
      const data = { items: [{ id: 'x1', label: 'One' }, { id: 'x2', label: 'Two' }] };
      const result = renderToString({ ast, data });
      expect(stripMarkers(dsdContent(result))).toBe(
        '<div data-id="x1">One</div><div data-id="x2">Two</div>',
      );
    });

    it('renders with index', () => {
      const ast = compile('{#each item, i in items}<span>{i}:{item}</span>{/each}');
      const result = renderToString({ ast, data: { items: ['a', 'b'] } });
      expect(stripMarkers(dsdContent(result))).toBe('<span>0:a</span><span>1:b</span>');
    });

    it('renders else content for empty list', () => {
      const ast = compile('{#each item in items}<li>{item}</li>{else}<p>none</p>{/each}');
      const result = renderToString({ ast, data: { items: [] } });
      expect(stripMarkers(dsdContent(result))).toBe('<p>none</p>');
    });

    it('renders object iteration', () => {
      const ast = compile('{#each val, key in obj}<span>{key}={val}</span>{/each}');
      const result = renderToString({ ast, data: { obj: { a: '1', b: '2' } } });
      expect(stripMarkers(dsdContent(result))).toBe('<span>a=1</span><span>b=2</span>');
    });
  });

  /*******************************
          Async
  *******************************/

  describe('async blocks', () => {
    it('renders loading content', () => {
      const ast = compile('{#async fetchData as result}<div>Done</div>{loading}<div>Loading...</div>{/async}');
      const data = { fetchData: () => new Promise(() => {}) };
      const result = renderToString({ ast, data });
      expect(stripMarkers(dsdContent(result))).toBe('<div>Loading...</div>');
    });

    it('renders nothing when no loading content', () => {
      const ast = compile('{#async fetchData as result}<div>Done</div>{/async}');
      const data = { fetchData: () => new Promise(() => {}) };
      const result = renderToString({ ast, data });
      expect(stripMarkers(dsdContent(result))).toBe('');
    });
  });

  /*******************************
          Snippets
  *******************************/

  describe('snippets', () => {
    it('renders snippet inline', () => {
      const ast = compile('{#snippet badge}<b>{label}</b>{/snippet}<div>{>badge label="X"}</div>');
      const result = renderToString({ ast });
      expect(stripMarkers(dsdContent(result))).toBe('<div><b>X</b></div>');
    });

    it('renders snippet used twice', () => {
      const ast = compile('{#snippet tag}<span>{label}</span>{/snippet}{>tag label="X"}{>tag label="Y"}');
      const result = renderToString({ ast });
      expect(stripMarkers(dsdContent(result))).toBe('<span>X</span><span>Y</span>');
    });
  });

  /*******************************
          Slots
  *******************************/

  describe('slots', () => {
    it('renders default slot', () => {
      const ast = compile('<div>{>slot}</div>');
      const result = renderToString({ ast });
      expect(stripMarkers(dsdContent(result))).toBe('<div><slot></slot></div>');
    });

    it('renders named slot', () => {
      const ast = compile('<header>{>slot header}</header><main>{>slot}</main>');
      const result = renderToString({ ast });
      expect(stripMarkers(dsdContent(result))).toBe(
        '<header><slot name="header"></slot></header><main><slot></slot></main>',
      );
    });
  });

  /*******************************
          DSD Wrapping
  *******************************/

  describe('DSD output', () => {
    it('wraps in template shadowrootmode', () => {
      const ast = compile('<div>hello</div>');
      const result = renderToString({ ast });
      expect(result).toMatch(/^<template shadowrootmode="open">.*<\/template>$/);
    });

    it('includes CSS in style tag', () => {
      const ast = compile('<div>hello</div>');
      const result = renderToString({ ast, css: '.a { color: red; }' });
      expect(result).toContain('<style>.a { color: red; }</style>');
    });

    it('omits style tag when no CSS', () => {
      const ast = compile('<div>hello</div>');
      const result = renderToString({ ast });
      expect(result).not.toContain('<style>');
    });
  });

  /*******************************
          Complex Nesting
  *******************************/

  describe('complex nesting', () => {
    it('if inside each', () => {
      const ast = compile(
        '{#each item in items}<div>{#if item.on}<b>{item.name}</b>{else}<i>{item.name}</i>{/if}</div>{/each}',
      );
      const data = { items: [{ name: 'A', on: true }, { name: 'B', on: false }] };
      const result = renderToString({ ast, data });
      expect(stripMarkers(dsdContent(result))).toBe('<div><b>A</b></div><div><i>B</i></div>');
    });

    it('each inside if', () => {
      const ast = compile('{#if hasItems}<ul>{#each n in items}<li>{n}</li>{/each}</ul>{/if}');
      const data = { hasItems: true, items: ['a', 'b'] };
      const result = renderToString({ ast, data });
      expect(stripMarkers(dsdContent(result))).toBe('<ul><li>a</li><li>b</li></ul>');
    });
  });
});
describe('marker contract', () => {
  it('emits sui:v1: prefix for text expressions', () => {
    const ast = compile('<div>{name}</div>');
    const html = render({ ast, data: { name: 'A' } });
    // Anchor: ssr-hydration skill — "Text expression: <!--sui:v1:N-->"
    expect(html).toMatch(/<!--sui:v1:0-->/);
  });

  it('emits sui-block:v1: open marker for conditional blocks', () => {
    const ast = compile('{#if show}<i>x</i>{/if}');
    const html = render({ ast, data: { show: true } });
    // Anchor: ssr-hydration skill — "Block open: <!--sui-block:v1:N-->"
    expect(html).toContain(`<!--${BLOCK_MARKER}0-->`);
  });

  it('emits matching close marker with branchIndex meta for if main branch', () => {
    const ast = compile('{#if show}<i>x</i>{else}<i>y</i>{/if}');
    const html = render({ ast, data: { show: true } });
    // Anchor: ssr-hydration skill — "b1000 means the if main branch was taken"
    expect(html).toContain('<!--/sui-block:v1:0:b1000-->');
  });

  it('emits b0 meta for first elseif branch', () => {
    const ast = compile('{#if a}<i>A</i>{else if b}<i>B</i>{else}<i>C</i>{/if}');
    const html = render({ ast, data: { a: false, b: true } });
    expect(html).toContain('<!--/sui-block:v1:0:b0-->');
  });

  it('emits b1 meta for second elseif/else branch', () => {
    const ast = compile('{#if a}<i>A</i>{else if b}<i>B</i>{else}<i>C</i>{/if}');
    const html = render({ ast, data: { a: false, b: false } });
    // The "else" lives at branches[1]
    expect(html).toContain('<!--/sui-block:v1:0:b1-->');
  });

  it('emits b-1 meta when no conditional branch matches and no else exists', () => {
    const ast = compile('{#if a}<i>A</i>{else if b}<i>B</i>{/if}');
    const html = render({ ast, data: { a: false, b: false } });
    // Anchor: ssr-hydration skill — "b-1 means no branch matched"
    // The parseServerMeta regex allows `b-1`, so the server MUST emit it.
    expect(html).toContain('<!--/sui-block:v1:0:b-1-->');
  });

  it('emits sui-item:v1: marker for every each item', () => {
    const ast = compile('{#each item in items}<li>{item}</li>{/each}');
    const html = render({ ast, data: { items: ['a', 'b', 'c'] } });
    // Anchor: shared/each.js — server emits per-item marker so the client
    // can adopt the matching node range at hydrate time.
    const matches = html.match(/<!--sui-item:v1:[^-]*-->/g) || [];
    expect(matches.length).toBe(3);
  });

  it('URL-encodes item keys that contain HTML-comment-forbidden characters', () => {
    // Keys with `--` or `>` would corrupt the comment marker (WHATWG spec).
    const ast = compile('{#each item in items}<li>{item.value}</li>{/each}');
    const html = render({ ast, data: { items: [{ id: 'a--b>c', value: 'X' }] } });
    // Anchor: shared/each.js encodeItemKey — must be URL-encoded
    expect(html).toContain('sui-item:v1:a--b%3Ec');
    // And must NOT contain raw `>` in the comment data (browsers would
    // terminate the comment early).
    expect(html).not.toMatch(/<!--sui-item:v1:[^<]*>[^<-]/);
  });

  it('uses MARKER_VERSION from build-html-string for every emitted marker', () => {
    // Single source of truth; any version drift here strands client hydrators.
    expect(MARKER_VERSION).toBe('v1');
    const ast = compile('<div>{x}</div>{#if x}<i/>{/if}');
    const html = render({ ast, data: { x: true } });
    expect(html).toContain(`sui:${MARKER_VERSION}:`);
    expect(html).toContain(`sui-block:${MARKER_VERSION}:`);
  });
});

/*****************************************************************
  data-sui-bind stamping — the client uses this for the fast
  hydration path. Skill `ssr-hydration` Phase 1: "for each element
  with one or more attribute markers, the assembler stamps a
  data-sui-bind=... attribute".
******************************************************************/

describe('data-sui-bind stamping', () => {
  it('stamps data-sui-bind on elements with a dynamic attribute', () => {
    const ast = compile('<div class="{cls}">x</div>');
    const html = render({ ast, data: { cls: 'a' } });
    // Server doesn't emit __sui0__ tokens (it evaluates inline) so the
    // client's hydrator needs the stamp to know this element has a binding.
    expect(html).toContain(`${DATA_SUI_BIND}="class=0"`);
  });

  it('stamps multiple bindings as comma-separated list on a single element', () => {
    const ast = compile('<div class="{cls}" data-id="{id}">x</div>');
    const html = render({ ast, data: { cls: 'a', id: 'b' } });
    // First entry per attribute, by attr name.
    expect(html).toMatch(/data-sui-bind="(class=0,data-id=1|data-id=1,class=0)"/);
  });

  it('prefixes property bindings with a dot inside data-sui-bind', () => {
    const ast = compile('<input .value={val}>');
    const html = render({ ast, data: { val: 'x' } });
    // Anchor: build-html-string DATA_SUI_BIND comment — `.prop` for property.
    expect(html).toContain('data-sui-bind=".value=0"');
  });

  it('prefixes event bindings with @ inside data-sui-bind', () => {
    const ast = compile('<button @click={handler}>x</button>');
    const html = render({ ast, data: { handler: () => {} } });
    // Anchor: build-html-string DATA_SUI_BIND comment — `@event` for event listener.
    expect(html).toContain('data-sui-bind="@click=0"');
  });

  it('places data-sui-bind inside the tag, not after the closing >', () => {
    const ast = compile('<div class="{cls}">x</div>');
    const html = render({ ast, data: { cls: 'a' } });
    // The stamp must be inside the open tag — otherwise the client's
    // selector ([data-sui-bind]) won't find the element.
    expect(html).toMatch(/<div [^>]*data-sui-bind="[^"]*"[^>]*>/);
  });

  it('stamps data-sui-bind on a self-closing custom element', () => {
    // Self-closing form: <ui-x foo={bar} />
    // The compiler expands self-closing custom elements to <ui-x ...></ui-x>
    // — the scanner still injects the bind attr inside the (open) tag.
    const ast = compile('<ui-x class="{cls}" />');
    const html = render({ ast, data: { cls: 'a' } });
    expect(html).toContain('data-sui-bind="class=0"');
  });

  it('does NOT emit __sui0__ attribute marker tokens — server evaluates inline', () => {
    // The client renderer uses __suiN__ in attribute values. The server
    // evaluates them inline. If __suiN__ leaks into server output, it
    // means the renderer is mixing client-side tokens into the SSR HTML.
    const ast = compile('<div class="x {a} y {b}">t</div>');
    const html = render({ ast, data: { a: 'A', b: 'B' } });
    expect(html).not.toContain('__sui0__');
    expect(html).not.toContain('__sui1__');
    expect(stripMarkers(html)).toContain('class="x A y B"');
  });
});

/*****************************************************************
  Boolean & special attribute handling — the unquoted-vs-quoted
  distinction in novel-patterns: unquoted boolean removes the
  attribute when falsy. Skill `novel-patterns` rule 6.
******************************************************************/

describe('boolean attribute handling', () => {
  it('removes a boolean attribute when expression evaluates to undefined', () => {
    const ast = compile('<button disabled={isDisabled}>x</button>');
    const html = render({ ast, data: { isDisabled: undefined } });
    expect(stripMarkers(html)).toBe('<button>x</button>');
  });

  it('removes a boolean attribute when expression evaluates to null', () => {
    const ast = compile('<button disabled={isDisabled}>x</button>');
    const html = render({ ast, data: { isDisabled: null } });
    expect(stripMarkers(html)).toBe('<button>x</button>');
  });

  it('removes a boolean attribute when expression evaluates to 0', () => {
    // The REMOVE_ATTR isFalsy list includes 0. A user writing
    // <input disabled={count}> with count=0 expects no disabled attr.
    const ast = compile('<button disabled={count}>x</button>');
    const html = render({ ast, data: { count: 0 } });
    expect(stripMarkers(html)).toBe('<button>x</button>');
  });

  it('removes a boolean attribute when expression evaluates to empty string', () => {
    const ast = compile('<button disabled={flag}>x</button>');
    const html = render({ ast, data: { flag: '' } });
    expect(stripMarkers(html)).toBe('<button>x</button>');
  });

  it('keeps a boolean attribute when expression is the literal string "false"', () => {
    // String 'false' is truthy in JS but in HTML this attribute should
    // still appear (consistent with unquoted={value} semantics that only
    // remove on JS-falsy). Documents the actual contract.
    const ast = compile('<button disabled={flag}>x</button>');
    const html = render({ ast, data: { flag: 'false' } });
    const stripped = stripMarkers(html);
    expect(stripped).toContain('disabled');
  });

  it('property bindings remove the .prop= attribute from server HTML', () => {
    // Properties (.prop=) need raw values, not stringified ones. The
    // server emits REMOVE_ATTR (regex-stripped from final output) so the
    // .prop="value" attribute disappears, but data-sui-bind records the
    // binding so the client wires it up at hydrate time.
    // Anchor: server.js REMOVE_ATTR contract.
    const ast = compile('<input .value={val}>');
    const html = render({ ast, data: { val: 'hello' } });
    expect(html).not.toContain('__SUI_REMOVE__');
    expect(html).not.toContain('.value="hello"');
    expect(html).not.toContain('value="hello"');
    // The hydration hint must still be present so the client can find
    // the binding and assign the property.
    expect(html).toContain('data-sui-bind=".value=0"');
  });

  it('event handlers remove the @event= attribute from server HTML', () => {
    // Events (@click=) can't be functions in HTML — server must strip the
    // attribute but record the binding via data-sui-bind.
    const ast = compile('<button @click={onClick}>go</button>');
    const html = render({ ast, data: { onClick: () => {} } });
    expect(html).not.toContain('__SUI_REMOVE__');
    expect(html).not.toContain('@click="');
    expect(html).not.toContain('onclick');
    // The hydration hint must still be present.
    expect(html).toContain('data-sui-bind="@click=0"');
  });
});

/*****************************************************************
  XSS escaping — attribute values from data context must never
  let the user break out of the attribute or inject markup.
******************************************************************/

describe('attribute value escaping', () => {
  it('escapes double quotes inside attribute values', () => {
    const ast = compile('<div title="{name}">x</div>');
    const html = render({ ast, data: { name: 'a"b' } });
    // Anchor: server.js — .replace(/"/g, '&quot;')
    expect(html).toContain('title="a&quot;b"');
    expect(html).not.toContain('title="a"b"');
  });

  it('escapes ampersand in attribute values', () => {
    const ast = compile('<a href="{url}">x</a>');
    const html = render({ ast, data: { url: 'https://x.com/?a=1&b=2' } });
    expect(html).toContain('href="https://x.com/?a=1&amp;b=2"');
  });

  it('keeps quotes intact when value contains < or > (browser parses quoted attribute literally)', () => {
    // HTML5 quoted-attribute parsing treats `<` and `>` as literal text
    // inside a quoted attribute. The server's escape chain (only `&` and
    // `"`) is therefore sufficient. Document the safety contract.
    const ast = compile('<div title="{name}">x</div>');
    const html = render({ ast, data: { name: '<script>alert(1)</script>' } });
    // The quote stays closed; the value is HTML-safe.
    expect(html).toContain('title="<script>alert(1)</script>"');
    // No unescaped & — that would be the actual escape gap.
    const ast2 = compile('<div title="{name}">x</div>');
    const html2 = render({ ast: ast2, data: { name: 'a&b' } });
    expect(html2).toContain('title="a&amp;b"');
  });

  it('escapes HTML in text expressions but allows entities in unsafeHTML', () => {
    const ast = compile('<p>{a}|{#html b}</p>');
    const html = render({
      ast,
      data: {
        a: '<i>raw</i>',
        b: '<i>raw</i>',
      },
    });
    expect(html).toContain('&lt;i&gt;raw&lt;/i&gt;');
    expect(html).toContain('<i>raw</i>');
  });

  it('renders empty string for undefined/null text expression values', () => {
    // Anchor: server.js — String(value ?? '')
    const ast = compile('<p>before {name} after</p>');
    const html = render({ ast, data: { name: undefined } });
    expect(stripMarkers(html)).toBe('<p>before after</p>');
  });

  it('renders empty string for null in unsafeHTML', () => {
    const ast = compile('<p>{#html value}</p>');
    const html = render({ ast, data: { value: null } });
    expect(stripMarkers(html)).toBe('<p></p>');
  });
});

/*****************************************************************
  Snippet & slot edge cases — the unit test inventory only covered
  basic snippet/slot use.
******************************************************************/

describe('snippet handling', () => {
  it('renders snippet when it is declared AFTER its use site', () => {
    // Compiler emits the snippet definition AST node; renderer collects it
    // on the first scan. If "snippet collection" runs in-order, a snippet
    // used before its definition would emit empty content.
    const ast = compile('<div>{>badge label="X"}</div>{#snippet badge}<b>{label}</b>{/snippet}');
    const html = render({ ast });
    // Real-world: authors place snippets at the bottom of a template.
    // This test documents which order the server supports.
    expect(stripMarkers(html)).toBe('<div><b>X</b></div>');
  });

  it('renders snippet with reactiveData args', () => {
    const ast = compile('{#snippet row}<b>{title}</b>{/snippet}<div>{>row title=current}</div>');
    const html = render({ ast, data: { current: 'Hello' } });
    expect(stripMarkers(html)).toBe('<div><b>Hello</b></div>');
  });

  it('renders empty block for an unresolved template name', () => {
    // Anchor: renderTemplate falls through to "if (template)" guard — when
    // neither a snippet nor a subTemplate matches the name, the block
    // markers still surround empty content (so client hydration can find
    // and dispose them).
    const ast = compile('<div>{>nonExistentTemplate}</div>');
    const html = render({ ast });
    // Should contain the block open/close markers with no content in between.
    expect(html).toMatch(/<div><!--sui-block:v1:\d+--><!--\/sui-block:v1:\d+--><\/div>/);
  });
});

describe('slot rendering', () => {
  it('renders <slot> for unnamed slot', () => {
    const ast = compile('<div>{>slot}</div>');
    const html = render({ ast });
    expect(stripMarkers(html)).toBe('<div><slot></slot></div>');
  });

  it('renders <slot name="x"> for named slot', () => {
    const ast = compile('<div>{>slot foo}</div>');
    const html = render({ ast });
    expect(stripMarkers(html)).toBe('<div><slot name="foo"></slot></div>');
  });

  it('correctly tracks tag boundaries after a slot (subsequent dynamic attr binds correctly)', () => {
    // Server.js line 257 only appends '<slot>' to htmlBuffer (not the full
    // closing tag), which could throw off analyzePosition's
    // lastOpen/lastClose detection for the *next* expression.
    const ast = compile('<div>{>slot}<i class="{cls}">x</i></div>');
    const html = render({ ast, data: { cls: 'active' } });
    // The next dynamic attribute must still get a data-sui-bind stamp
    // and its value rendered as a normal attribute (NOT as text or
    // misplaced inside a tag).
    expect(html).toContain('class="active"');
    expect(html).toContain(`${DATA_SUI_BIND}="class=`);
  });
});

/*****************************************************************
  Block-in-attribute — conditional/rerender are allowed inside
  attribute values; each/async/template/svg/slot must throw.
  Anchor: commit-hooks.js renderASTToString switch.
******************************************************************/

describe('blocks inside attribute values', () => {
  it('renders {#if} inside an attribute value, picking the matched branch', () => {
    const ast = compile('<div class="{#if active}on{else}off{/if}">x</div>');
    const html = render({ ast, data: { active: true } });
    expect(stripMarkers(html)).toBe('<div class="on">x</div>');
  });

  it('renders {#if} else branch inside an attribute value', () => {
    const ast = compile('<div class="{#if active}on{else}off{/if}">x</div>');
    const html = render({ ast, data: { active: false } });
    expect(stripMarkers(html)).toBe('<div class="off">x</div>');
  });

  it('stamps data-sui-bind for {#if} block in attribute position', () => {
    // The block is at attribute position — it has an entry ID and the
    // client wires a Reaction to it via the data-sui-bind fast path.
    const ast = compile('<div class="{#if active}on{else}off{/if}">x</div>');
    const html = render({ ast, data: { active: true } });
    expect(html).toContain(`${DATA_SUI_BIND}="class=0"`);
  });

  it('throws when {#each} is placed inside an attribute value', () => {
    // Anchor: server.js renderEach throws — renderASTToString throws also.
    const ast = compile('<div class="{#each x in xs}{x}{/each}">y</div>');
    expect(() => render({ ast, data: { xs: ['a'] } })).toThrow(/cannot be rendered inside an attribute/);
  });

  it('throws when {#async} is placed inside an attribute value', () => {
    const ast = compile(
      '<div class="{#async fetchData as r}{r}{loading}wait{/async}">x</div>',
    );
    expect(() => render({ ast, data: { fetchData: () => new Promise(() => {}) } }))
      .toThrow(/cannot be rendered inside an attribute/);
  });

  it('throws when {>template} is placed inside an attribute value', () => {
    const ast = compile('<div class="{>nameless}">x</div>');
    expect(() => render({ ast })).toThrow(/cannot be rendered inside an attribute/);
  });

  it('refuses to inject blocks into property bindings', () => {
    // Property/event positions cannot accept a stringified block result.
    // Server emits REMOVE_ATTR so the attribute disappears.
    const ast = compile('<input .value="{#if a}x{else}y{/if}">');
    const html = render({ ast, data: { a: true } });
    expect(html).not.toContain('__SUI_REMOVE__');
    expect(html).not.toContain('.value=');
  });
});

/*****************************************************************
  isServer / isClient semantics — the SSR contract is that
  callback params reflect environment. ServerRenderer doesn't
  evaluate isServer/isClient itself, but the helpers in
  TemplateHelpers do (via isServer from @semantic-ui/utils).
  This documents the server-rendering branch behavior.
******************************************************************/

describe('isServer branch selection', () => {
  it('renders the {#if isServer} branch when isServer is true in data', () => {
    // In real component code, isServer is passed in as a data value
    // (from the Template's data context). Server can take the true branch.
    const ast = compile('{#if isServer}server-only{else}client-only{/if}');
    const html = render({ ast, data: { isServer: true, isClient: false } });
    expect(stripMarkers(html)).toBe('server-only');
  });

  it('renders the {#if isClient} false branch on server', () => {
    const ast = compile('{#if isClient}client{else}server{/if}');
    const html = render({ ast, data: { isClient: false, isServer: true } });
    expect(stripMarkers(html)).toBe('server');
  });
});

/*****************************************************************
  Subtemplate handling — server.js subTemplates lookup vs.
  template-as-value (passed directly via expression).
******************************************************************/

describe('subtemplate rendering', () => {
  it('looks up subtemplate by string name', () => {
    // Subtemplates are passed as { name: { ast } } records to the renderer.
    const ast = compile('<div>{>row}</div>');
    const rowAST = compile('<i>row</i>');
    const html = render({ ast, subTemplates: { row: { ast: rowAST } } });
    expect(stripMarkers(html)).toBe('<div><i>row</i></div>');
  });

  it('renders subtemplate with reactiveData args', () => {
    const ast = compile('<div>{>row name=current}</div>');
    const rowAST = compile('<i>{name}</i>');
    const html = render({ ast, data: { current: 'X' }, subTemplates: { row: { ast: rowAST } } });
    expect(stripMarkers(html)).toBe('<div><i>X</i></div>');
  });

  it('renders nothing for an unknown subtemplate name', () => {
    // Author error: typo'd template name. The server should not crash —
    // it emits the block markers (so the client can hydrate) but the
    // content section is empty.
    const ast = compile('<div>{>typo}</div>');
    const html = render({ ast });
    // Block markers should still be present in the output
    expect(html).toContain(`<!--${BLOCK_MARKER}`);
    expect(stripMarkers(html)).toBe('<div></div>');
  });
});

/*****************************************************************
  Rerender / guard blocks — server emits markers and content but
  does not actually maintain reactivity (server is single-pass).
******************************************************************/

describe('rerender block', () => {
  it('renders content for a {#rerender} block', () => {
    const ast = compile('{#rerender key}<div>{label}</div>{/rerender}');
    const html = render({ ast, data: { key: 'a', label: 'hello' } });
    expect(stripMarkers(html)).toBe('<div>hello</div>');
  });

  it('emits open/close markers for {#rerender}', () => {
    const ast = compile('{#rerender x}<i>y</i>{/rerender}');
    const html = render({ ast, data: { x: 1 } });
    expect(html).toContain(`<!--${BLOCK_MARKER}`);
    expect(html).toContain('<!--/sui-block:v1:0-->');
  });

  it('renders {#guard} block content', () => {
    // Guard compiles to the same `rerender` node type.
    const ast = compile('{#guard key}<b>{name}</b>{/guard}');
    const html = render({ ast, data: { key: 'a', name: 'Z' } });
    expect(stripMarkers(html)).toBe('<b>Z</b>');
  });
});

/*****************************************************************
  Raw-text elements — <script>, <style>, <textarea>, <title>
  contain text-only content per HTML parser rules.

  The client renderer uses RAW_TEXT_MARKER to handle these.
  The server renderer currently does NOT emit raw-text markers —
  it renders expressions inside them as comment-marked text.
  This is a server/client mismatch candidate.

  Anchor: build-html-string.js — `insideRawText` tracking;
  RAW_TEXT_OPEN / RAW_TEXT_CLOSE; emits RAW_TEXT_MARKER after
  closing tag. Server's renderNodes does no such tracking.
******************************************************************/

describe('raw-text elements', () => {
  it('emits comment markers for expressions inside <style> — but comments inside <style> are LITERAL TEXT', () => {
    // The browser does NOT parse comments inside <style>; they become
    // raw CSS text. So `<!--sui:v1:0-->` shows up as text in the
    // stylesheet, corrupting the CSS.
    //
    // Real scenario: a component template with `<style>.x { color: {color}; }</style>`.
    // The unit test would expose this if the server emits comment markers.
    const ast = compile('<style>.x { color: {color}; }</style>');
    const html = render({ ast, data: { color: 'red' } });
    // If this test fails (server DOES emit `<!--sui:v1:`), it's a real
    // server/client mismatch — the client would emit a RAW_TEXT_MARKER
    // *after* the </style>, not inside it.
    expect(html).not.toMatch(/<style>[^<]*<!--sui:v1:/);
  });

  it('renders expression value inside <style> as plain text (no comment marker)', () => {
    // Braceless body — the compiler's `{` expression delimiter doesn't have
    // raw-text awareness, so CSS rule braces around an expression eat the
    // body into a single expression token. That constraint is documented
    // separately; here we pin that expressions DO render to plain text
    // inside <style> when the compiler emits them as expression nodes.
    const ast = compile('<style>{rule}</style>');
    const html = render({ ast, data: { rule: '.x color red' } });
    expect(html).toContain('.x color red');
    expect(html).not.toMatch(/<style>[^<]*<!--sui:v1:/);
  });

  it('emits sui-rawtext marker after a raw-text element with expressions (matches client)', () => {
    // The client renderer's buildHTMLString emits <!--sui-rawtext:v1:N-->
    // *after* the </style> closing tag, and stores the expression nodes
    // in entries[id].nodes. The server MUST do the same so hydration's
    // marker walker finds it.
    const ast = compile('<style>.x { color: {color}; }</style>');
    const html = render({ ast, data: { color: 'red' } });
    // Expected: marker after </style>
    expect(html).toContain(`<!--${RAW_TEXT_MARKER}`);
  });

  it('does NOT emit comment markers inside <script> body', () => {
    // Browsers treat <script> content as raw text — a comment inside
    // would become literal `<!--sui:v1:0-->const x = ...;` JS source,
    // which throws SyntaxError on parse.
    const ast = compile('<script>const x = {value};</script>');
    const html = render({ ast, data: { value: 42 } });
    expect(html).not.toMatch(/<script>[^<]*<!--sui:v1:/);
  });

  it('does NOT emit comment markers inside <textarea> body', () => {
    // <textarea> content is text; a comment marker inside renders as
    // literal characters in the text field.
    const ast = compile('<textarea>{value}</textarea>');
    const html = render({ ast, data: { value: 'hello' } });
    expect(html).not.toMatch(/<textarea>[^<]*<!--sui:v1:/);
  });

  it('does NOT emit comment markers inside <script> when a closed <style> precedes it', () => {
    // <style>...</style><script>{x}</script> in a single html node — the
    // first raw-text element is closed, but the buffer ends inside the
    // unclosed <script>. isInsideRawText must recognize the latest open.
    const ast = compile('<style>.x{color:red}</style><script>{value}</script>');
    const html = render({ ast, data: { value: 42 } });
    expect(html).not.toMatch(/<script>[^<]*<!--sui:v1:/);
  });
});

describe('isInsideRawText', () => {
  it('returns true when buffer ends inside an unclosed raw-text element', () => {
    expect(isInsideRawText('<div><script>const x = ')).toBe(true);
    expect(isInsideRawText('<style>.a{')).toBe(true);
  });

  it('returns false when the only raw-text element is closed', () => {
    expect(isInsideRawText('<style>.a{}</style><div>')).toBe(false);
  });

  it('returns true when a later raw-text element is unclosed after an earlier one closed', () => {
    expect(isInsideRawText('<style>.a{}</style><script>const x = ')).toBe(true);
    expect(isInsideRawText('<script>const x;</script><style>.b{')).toBe(true);
  });

  it('returns false when all raw-text elements in the buffer are closed', () => {
    expect(isInsideRawText('<style>.a{}</style><script>x;</script>')).toBe(false);
  });

  it('returns false for buffers with no raw-text element', () => {
    expect(isInsideRawText('<div><p>hello</p></div>')).toBe(false);
  });
});

/*****************************************************************
  Each block specifics — empty list, object iteration, missing
  data, escape encoding.
******************************************************************/

describe('each loop edge cases', () => {
  it('emits no per-item markers for empty array', () => {
    const ast = compile('{#each item in items}<li>{item}</li>{/each}');
    const html = render({ ast, data: { items: [] } });
    expect(html).not.toContain('sui-item:v1:');
  });

  it('renders else content when items is undefined', () => {
    // Server.js: `rawItems = lookup(...) || []`. So undefined collapses
    // to [], which falls through to elseContent.
    const ast = compile('{#each item in items}<li>{item}</li>{else}<p>none</p>{/each}');
    const html = render({ ast, data: { items: undefined } });
    expect(stripMarkers(html)).toBe('<p>none</p>');
  });

  it('renders else content when items is null', () => {
    const ast = compile('{#each item in items}<li>{item}</li>{else}<p>none</p>{/each}');
    const html = render({ ast, data: { items: null } });
    expect(stripMarkers(html)).toBe('<p>none</p>');
  });

  it('uses item.id as the encoded item key when present', () => {
    // Anchor: shared/each.js getItemId — prefers id over index.
    const ast = compile('{#each item in items}<li>{item.name}</li>{/each}');
    const html = render({ ast, data: { items: [{ id: 'alpha', name: 'A' }] } });
    expect(html).toContain('sui-item:v1:alpha');
  });

  it('falls back to index when no id-like field exists', () => {
    const ast = compile('{#each item in items}<li>{item.name}</li>{/each}');
    const html = render({ ast, data: { items: [{ name: 'X' }, { name: 'Y' }] } });
    expect(html).toContain('sui-item:v1:0');
    expect(html).toContain('sui-item:v1:1');
  });

  it('emits stable composite keys for primitive string items', () => {
    // Anchor: shared/each.js — string items get `item + ':' + index` as raw key.
    const ast = compile('{#each item in items}<li>{item}</li>{/each}');
    const html = render({ ast, data: { items: ['a', 'b'] } });
    // The literal raw key `a:0` is URL-encoded to `a%3A0`.
    expect(html).toContain('sui-item:v1:a%3A0');
    expect(html).toContain('sui-item:v1:b%3A1');
  });

  it('escapes HTML in per-item expression values', () => {
    const ast = compile('{#each item in items}<li>{item}</li>{/each}');
    const html = render({ ast, data: { items: ['<x>'] } });
    expect(html).toContain('&lt;x&gt;');
    expect(html).not.toMatch(/<li><!--[^>]*-->\<x\>/);
  });
});

/*****************************************************************
  Async block — server always renders loading content, never awaits.
  Anchor: server.js renderAsync.
******************************************************************/

describe('async block', () => {
  it('does NOT await the promise (server is single-pass)', () => {
    let called = false;
    const ast = compile(
      '{#async fetch as r}<i>{r}</i>{loading}<p>wait</p>{/async}',
    );
    render({
      ast,
      data: {
        fetch: () => {
          called = true;
          return new Promise(() => {});
        },
      },
    });
    // The server never invokes the async expression's promise consumer.
    // It's an open question whether `fetch` is even invoked; the
    // implementation only emits loadingContent. If `called` is true,
    // server-side execution of the async function is happening, which
    // could be a footgun for components that hit network in the
    // resolver function.
    //
    // Per server.js: `if (node.loadingContent?.length)` — the renderer
    // only reads loadingContent. The async function expression is NOT
    // evaluated server-side (no lookupExpression call on node.expression).
    expect(called).toBe(false);
  });

  it('emits empty content when {#async} has no {loading} block', () => {
    const ast = compile('{#async fetch as r}<i>{r}</i>{/async}');
    const html = render({ ast, data: { fetch: () => new Promise(() => {}) } });
    expect(stripMarkers(html)).toBe('');
    // Block markers should still be present so the client can hydrate.
    expect(html).toContain(`<!--${BLOCK_MARKER}`);
  });

  it('emits block close marker even without loading content', () => {
    const ast = compile('{#async fetch as r}<i>{r}</i>{/async}');
    const html = render({ ast, data: { fetch: () => new Promise(() => {}) } });
    expect(html).toMatch(/<!--\/sui-block:v1:0(:b-?\d+)?-->/);
  });
});

/*****************************************************************
  Nested data context — childContext used by each loops uses
  prototype-chain inheritance (skill native-renderer: "preserves
  getters: child reads inherited keys live"). Verify it works
  the same on server (which doesn't need reactivity but does
  need parent-key visibility).
******************************************************************/

describe('parent-data visibility from each item content', () => {
  it('item content can read parent-data keys via prototype chain', () => {
    const ast = compile('{#each item in items}<i>{label}: {item}</i>{/each}');
    const html = render({ ast, data: { items: ['a'], label: 'TAG' } });
    expect(stripMarkers(html)).toBe('<i>TAG: a</i>');
  });

  it('item local key shadows parent key with the same name', () => {
    // Anchor: childContext uses Object.assign(child, extras); extras win.
    const ast = compile('{#each item in items}<i>{item}</i>{/each}');
    const html = render({ ast, data: { items: ['child'], item: 'parent' } });
    expect(stripMarkers(html)).toBe('<i>child</i>');
  });
});

/*****************************************************************
  Object iteration in each — collectionType branch (server.js
  renderEach uses arrayFromObject + collectionType).
******************************************************************/

describe('each loop over objects', () => {
  it('iterates object keys in declaration order', () => {
    const ast = compile('{#each val, key in obj}<i>{key}={val}</i>{/each}');
    const html = render({ ast, data: { obj: { a: 1, b: 2 } } });
    expect(stripMarkers(html)).toBe('<i>a=1</i><i>b=2</i>');
  });

  it('emits per-item markers using object keys (URL-encoded)', () => {
    const ast = compile('{#each val, key in obj}<i>{key}={val}</i>{/each}');
    const html = render({ ast, data: { obj: { 'a key': 1 } } });
    expect(html).toContain('sui-item:v1:a%20key');
  });

  it('handles object with mixed key types', () => {
    const ast = compile('{#each val, key in obj}<i>{key}={val}</i>{/each}');
    const html = render({ ast, data: { obj: { x: 'X', y: 'Y' } } });
    const stripped = stripMarkers(html);
    expect(stripped).toContain('x=X');
    expect(stripped).toContain('y=Y');
  });
});

/*****************************************************************
  Markers as raw HTML coexistence — verify the server preserves the
  raw values around markers correctly. The client's TreeWalker
  expects to find the comment immediately followed by text.
******************************************************************/

describe('marker adjacency invariants', () => {
  it('places sui:v1: marker immediately before the evaluated value (no whitespace)', () => {
    // Anchor: server.js renderExpression returns marker + value as one
    // string. The client's hydrator splits the text node at the marker.
    const ast = compile('<p>{name}</p>');
    const html = render({ ast, data: { name: 'Hello' } });
    // No newline or space between -->
    expect(html).toContain('<!--sui:v1:0-->Hello');
  });

  it('places block close marker after content with no trailing newline', () => {
    const ast = compile('{#if a}<i>X</i>{/if}');
    const html = render({ ast, data: { a: true } });
    expect(html).toContain('<i>X</i><!--/sui-block:v1:0:b1000-->');
  });

  it('emits the per-item marker BEFORE each rendered item', () => {
    // Client looks for the per-item marker as the start sentinel.
    const ast = compile('{#each item in items}<li>{item}</li>{/each}');
    const html = render({ ast, data: { items: ['a', 'b'] } });
    // Pattern: <!--sui-item:v1:KEY-->...<li>...</li>...<!--sui-item:v1:KEY-->...
    const pattern = /<!--sui-item:v1:[^<-]*-->\s*<li>/g;
    expect((html.match(pattern) || []).length).toBe(2);
  });
});

/*****************************************************************
  Complex assertions on htmlBuffer correctness — the htmlBuffer
  drives analyzePosition's classification. If the buffer drifts
  from the actual output, attributes can be misclassified as text
  or vice versa.
******************************************************************/

describe('htmlBuffer accuracy under blocks', () => {
  it('correctly classifies attribute position after an each block', () => {
    // The htmlBuffer should reflect the each block's output enough that
    // subsequent siblings get correct classification.
    const ast = compile('<div>{#each item in items}<i>{item}</i>{/each}<b class="{cls}">x</b></div>');
    const html = render({ ast, data: { items: ['a'], cls: 'tag' } });
    expect(html).toContain('class="tag"');
    expect(html).toContain(`${DATA_SUI_BIND}="class=`);
  });

  it('correctly classifies attribute position after a conditional block', () => {
    const ast = compile('<div>{#if show}<i>x</i>{/if}<b class="{cls}">x</b></div>');
    const html = render({ ast, data: { show: false, cls: 'tag' } });
    expect(html).toContain('class="tag"');
  });
});
