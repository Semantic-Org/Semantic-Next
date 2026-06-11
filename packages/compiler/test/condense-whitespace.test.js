import { describe, expect, it } from 'vitest';

import { TemplateCompiler } from '@semantic-ui/compiler';

const compile = (template, options) => new TemplateCompiler().compile(template, options);

describe('condenseWhitespace', () => {
  describe('inter-tag whitespace', () => {
    it('removes cross-line whitespace between tags', () => {
      const ast = compile(`<ul>
        <li>a</li>
        <li>b</li>
      </ul>`);
      expect(ast).toEqual([
        { type: 'html', html: '<ul><li>a</li><li>b</li></ul>' },
      ]);
    });

    it('keeps a same-line space between inline tags', () => {
      const ast = compile(`<span>a</span> <span>b</span>`);
      expect(ast).toEqual([
        { type: 'html', html: '<span>a</span> <span>b</span>' },
      ]);
    });

    it('collapses same-line whitespace runs between tags to one space', () => {
      const ast = compile(`<span>a</span>   <span>b</span>`);
      expect(ast).toEqual([
        { type: 'html', html: '<span>a</span> <span>b</span>' },
      ]);
    });
  });

  describe('text content', () => {
    it('collapses whitespace runs in text to one space', () => {
      const ast = compile(`<p>hello   world</p>`);
      expect(ast).toEqual([
        { type: 'html', html: '<p>hello world</p>' },
      ]);
    });

    it('collapses cross-line runs inside text to one space', () => {
      const ast = compile(`<p>hello
        world</p>`);
      expect(ast).toEqual([
        { type: 'html', html: '<p>hello world</p>' },
      ]);
    });
  });

  describe('expression boundaries', () => {
    it('collapses cross-line whitespace between expressions to one space', () => {
      const ast = compile(`<p>{first}
        {last}</p>`);
      expect(ast).toEqual([
        { type: 'html', html: '<p>' },
        { type: 'expression', value: 'first' },
        { type: 'html', html: ' ' },
        { type: 'expression', value: 'last' },
        { type: 'html', html: '</p>' },
      ]);
    });

    it('collapses whitespace between a tag and an expression to one space', () => {
      const ast = compile(`<td>
        {value}
      </td>`);
      expect(ast).toEqual([
        { type: 'html', html: '<td> ' },
        { type: 'expression', value: 'value' },
        { type: 'html', html: ' </td>' },
      ]);
    });

    it('leaves tight expression bindings untouched', () => {
      const ast = compile(`<td>{value}</td>`);
      expect(ast).toEqual([
        { type: 'html', html: '<td>' },
        { type: 'expression', value: 'value' },
        { type: 'html', html: '</td>' },
      ]);
    });
  });

  describe('attributes', () => {
    it('preserves whitespace inside attribute values', () => {
      const ast = compile(`<div title="a >  b" class="x">ok</div>`);
      expect(ast).toEqual([
        { type: 'html', html: '<div title="a >  b" class="x">ok</div>' },
      ]);
    });

    it('preserves attribute whitespace when an expression splits the tag', () => {
      const ast = compile(`<tr class="{rowClass}" data-id="{id}">
        <td>x</td>
      </tr>`);
      expect(ast).toEqual([
        { type: 'html', html: '<tr class="' },
        { type: 'expression', value: 'rowClass' },
        { type: 'html', html: '" data-id="' },
        { type: 'expression', value: 'id' },
        { type: 'html', html: '"><td>x</td></tr>' },
      ]);
    });
  });

  describe('raw text elements', () => {
    it('preserves whitespace inside pre', () => {
      const ast = compile(`<div>
        <pre>  keep
    this   exactly
  </pre>
      </div>`);
      expect(ast).toEqual([
        { type: 'html', html: '<div><pre>  keep\n    this   exactly\n  </pre></div>' },
      ]);
    });

    it('preserves whitespace inside textarea', () => {
      const ast = compile(`<textarea>
  line one
  line two
</textarea>`);
      expect(ast).toEqual([
        { type: 'html', html: '<textarea>\n  line one\n  line two\n</textarea>' },
      ]);
    });

    it('preserves whitespace inside script', () => {
      const ast = compile(`<script>
  let a = 1
  let b = 2
</script><div>
  <p>a</p>
</div>`);
      expect(ast).toEqual([
        { type: 'html', html: '<script>\n  let a = 1\n  let b = 2\n</script><div><p>a</p></div>' },
      ]);
    });

    it('preserves whitespace inside style', () => {
      const ast = compile(`<style>
  @import url(a.css);
  @import url(b.css);
</style><div>
  <p>a</p>
</div>`);
      expect(ast).toEqual([
        { type: 'html', html: '<style>\n  @import url(a.css);\n  @import url(b.css);\n</style><div><p>a</p></div>' },
      ]);
    });

    it('preserves textarea content when an expression splits the open tag', () => {
      const ast = compile(`<textarea class="{fieldClass}">  keep
    this  </textarea><div>
  <p>a</p>
</div>`);
      expect(ast).toEqual([
        { type: 'html', html: '<textarea class="' },
        { type: 'expression', value: 'fieldClass' },
        { type: 'html', html: '">  keep\n    this  </textarea><div><p>a</p></div>' },
      ]);
    });

    it('does not treat a self-closed split tag as raw text', () => {
      const ast = compile(`<textarea class="{x}"/><div>
  <p>a</p>
</div>`);
      expect(ast).toEqual([
        { type: 'html', html: '<textarea class="' },
        { type: 'expression', value: 'x' },
        { type: 'html', html: '"/><div><p>a</p></div>' },
      ]);
    });

    it('preserves pre content across an expression boundary', () => {
      const ast = compile(`<pre>  before
{code}
  after  </pre>`);
      expect(ast).toEqual([
        { type: 'html', html: '<pre>  before\n' },
        { type: 'expression', value: 'code' },
        { type: 'html', html: '\n  after  </pre>' },
      ]);
    });

    it('resumes condensing after a raw text element closes', () => {
      const ast = compile(`<pre> x </pre>
      <div>
        <p>a</p>
      </div>`);
      expect(ast).toEqual([
        { type: 'html', html: '<pre> x </pre><div><p>a</p></div>' },
      ]);
    });
  });

  describe('block boundaries', () => {
    it('removes whitespace around an each block with element content', () => {
      const ast = compile(`<tbody>
        {#each rows as row}
          <tr><td>{row.id}</td></tr>
        {/each}
      </tbody>`);
      expect(ast).toEqual([
        { type: 'html', html: '<tbody>' },
        {
          type: 'each',
          over: 'rows',
          as: 'row',
          content: [
            { type: 'html', html: '<tr><td>' },
            { type: 'expression', value: 'row.id' },
            { type: 'html', html: '</td></tr>' },
          ],
        },
        { type: 'html', html: '</tbody>' },
      ]);
    });

    it('keeps a same-line space next to a block', () => {
      const ast = compile(`<span>a</span> {#if x}b{/if}`);
      expect(ast).toEqual([
        { type: 'html', html: '<span>a</span> ' },
        {
          type: 'if',
          condition: 'x',
          content: [{ type: 'html', html: 'b' }],
          branches: [],
        },
      ]);
    });

    it('removes cross-line whitespace next to a block', () => {
      const ast = compile(`<span>a</span>
{#if x}b{/if}`);
      expect(ast).toEqual([
        { type: 'html', html: '<span>a</span>' },
        {
          type: 'if',
          condition: 'x',
          content: [{ type: 'html', html: 'b' }],
          branches: [],
        },
      ]);
    });

    it('removes whitespace around an if block with element content', () => {
      const ast = compile(`<div>
        {#if x}
          <p>y</p>
        {/if}
      </div>`);
      expect(ast).toEqual([
        { type: 'html', html: '<div>' },
        {
          type: 'if',
          condition: 'x',
          content: [{ type: 'html', html: '<p>y</p>' }],
          branches: [],
        },
        { type: 'html', html: '</div>' },
      ]);
    });

    it('removes cross-line whitespace between block branches', () => {
      const ast = compile(`{#if x}
        <b>y</b>
      {else}
        <i>z</i>
      {/if}`);
      expect(ast[0].content).toEqual([{ type: 'html', html: '<b>y</b>' }]);
      expect(ast[0].branches[0].content).toEqual([{ type: 'html', html: '<i>z</i>' }]);
    });

    it('removes whitespace around subtemplate includes', () => {
      const ast = compile(`<ul>
        {>listItem text=label}
      </ul>`);
      expect(ast[0]).toEqual({ type: 'html', html: '<ul>' });
      expect(ast[1].type).toBe('template');
      expect(ast[2]).toEqual({ type: 'html', html: '</ul>' });
    });
  });

  describe('options', () => {
    it('preserveWhitespace keeps the template untouched', () => {
      const template = `<ul>
        <li>a</li>
      </ul>`;
      const ast = compile(template, { preserveWhitespace: true });
      expect(ast).toEqual([
        { type: 'html', html: '<ul>\n        <li>a</li>\n      </ul>' },
      ]);
    });

    it('includePositions keeps source-faithful html', () => {
      const template = `<ul>
        <li>a</li>
      </ul>`;
      const ast = compile(template, { includePositions: true });
      expect(ast[0].html).toBe('<ul>\n        <li>a</li>\n      </ul>');
      expect(ast[0].start).toBe(0);
    });
  });

  describe('svg', () => {
    it('condenses svg content but not attribute fragments', () => {
      const ast = compile(`<svg width="10"
        height="20">
        <circle r="5"></circle>
      </svg>`);
      const html = ast
        .map(node => node.type === 'html' ? node.html : '')
        .join('');
      expect(html).toContain('width="10"\n        height="20"');
      const svgNode = ast.find(node => node.type === 'svg');
      expect(svgNode.content).toEqual([
        { type: 'html', html: '<circle r="5"></circle></svg>' },
      ]);
    });
  });

  describe('marker classification', () => {
    it('treats dotted branch-keyword expressions as text', () => {
      const ast = compile(`<b>Status:</b>
{error.message}`);
      expect(ast).toEqual([
        { type: 'html', html: '<b>Status:</b> ' },
        { type: 'expression', value: 'error.message' },
      ]);
    });

    it('treats keyword property reads as text', () => {
      const [first] = compile(`<b>a</b>
{loading.state}`);
      expect(first.html).toBe('<b>a</b> ');
    });

    it('treats keyword call expressions as text', () => {
      const [first] = compile(`<b>a</b>
{error('x')}`);
      expect(first.html).toBe('<b>a</b> ');
    });

    it('treats #html expressions as text', () => {
      const [first] = compile(`<b>a</b>
{#html content}`);
      expect(first.html).toBe('<b>a</b> ');
    });

    it('keeps branch keywords with arguments as boundaries', () => {
      const ast = compile(`{#async load as r}
  <b>ok</b>
{error as e}
  <i>bad</i>
{/async}`);
      expect(ast[0].content).toEqual([{ type: 'html', html: '<b>ok</b>' }]);
      expect(ast[0].errorContent).toEqual([{ type: 'html', html: '<i>bad</i>' }]);
    });

    it('detects padded block markers', () => {
      const [first] = compile(`<b>a</b>
{      #if x}<p>y</p>{/if}`);
      expect(first.html).toBe('<b>a</b>');
    });
  });

  describe('expressions inside tags', () => {
    it('braces win over > inside unquoted attribute expressions', () => {
      const ast = compile(`<div data-on={x > y} title="a  >  b">ok</div>`);
      const html = ast
        .map(node => node.type === 'html' ? node.html : '')
        .join('');
      expect(html).toContain('title="a  >  b"');
    });
  });

  describe('raw text close boundaries', () => {
    it('ignores close-tag prefixes of other elements', () => {
      const ast = compile(`<pre>a </press-thing> b
  c</pre><div>
<p>x</p>
</div>`);
      expect(ast[0].html).toBe('<pre>a </press-thing> b\n  c</pre><div><p>x</p></div>');
    });

    it('closes on whitespace-padded close tags', () => {
      const ast = compile(`<pre> x </pre >
<div>
<p>a</p>
</div>`);
      expect(ast[0].html).toBe('<pre> x </pre ><div><p>a</p></div>');
    });
  });

  describe('diagnostics modes', () => {
    it('recoverable mode keeps source-faithful offsets', () => {
      const template = `<ul>
  <li>a</li>
</ul>`;
      const ast = new TemplateCompiler().compile(template, { recoverable: true });
      expect(ast[0].html).toBe('<ul>\n  <li>a</li>\n</ul>');
    });
  });

  describe('double bracket syntax', () => {
    it('condenses around double-bracket blocks', () => {
      const ast = compile(`<tbody>
  {{#each rows as row}}
    <tr><td>{{row.id}}</td></tr>
  {{/each}}
</tbody>`);
      expect(ast[0]).toEqual({ type: 'html', html: '<tbody>' });
      expect(ast[1].content[0]).toEqual({ type: 'html', html: '<tr><td>' });
    });

    it('collapses whitespace between double-bracket expressions', () => {
      const ast = compile(`<p>{{first}}
{{last}}</p>`);
      expect(ast).toEqual([
        { type: 'html', html: '<p>' },
        { type: 'expression', value: 'first' },
        { type: 'html', html: ' ' },
        { type: 'expression', value: 'last' },
        { type: 'html', html: '</p>' },
      ]);
    });
  });
});
