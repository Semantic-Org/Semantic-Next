import { TemplateCompiler } from '@semantic-ui/templating';
import { describe, expect, it } from 'vitest';

import { renderToString } from '../../src/engines/native/server.js';

function compile(template) {
  return new TemplateCompiler(template).compile();
}

// Strip hydration markers and whitespace for clean comparison
function stripMarkers(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
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

    it('preserves block markers for hydration', () => {
      const ast = compile('{#if show}<span>yes</span>{/if}');
      const result = renderToString({ ast, data: { show: true } });
      const content = dsdContent(result);
      expect(content).toContain('<!--sui-block:v1:0-->');
      expect(content).toContain('<!--/sui-block:v1:0-->');
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
