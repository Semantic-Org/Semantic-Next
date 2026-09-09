import {
  each,
  indentHTML,
  indentLines,
  parseHTML,
  rawTextElements,
  stringifyHTML,
  voidElements,
} from '@semantic-ui/utils';

import { describe, expect, it } from 'vitest';

describe('HTML Utilities', () => {
  describe('indentLines', () => {
    it('should add 2 spaces of indentation by default', () => {
      const input = 'line 1\nline 2\nline 3';
      const expected = '  line 1\n  line 2\n  line 3';
      expect(indentLines(input)).toBe(expected);
    });

    it('should add custom number of spaces', () => {
      const input = 'line 1\nline 2';
      const expected = '    line 1\n    line 2';
      expect(indentLines(input, 4)).toBe(expected);
    });

    it('should handle single line text', () => {
      expect(indentLines('single line')).toBe('  single line');
      expect(indentLines('single line', 4)).toBe('    single line');
    });

    it('should handle empty string', () => {
      // Intentional: an empty string is treated as a single empty line, so it gets indented
      expect(indentLines('')).toBe('  ');
      expect(indentLines('', 4)).toBe('    ');
    });

    it('should handle non-string input', () => {
      expect(indentLines(null)).toBe('');
      expect(indentLines(undefined)).toBe('');
      expect(indentLines(123)).toBe('');
    });

    it('should preserve existing indentation', () => {
      const input = '  already indented\n  line 2';
      const expected = '    already indented\n    line 2';
      expect(indentLines(input)).toBe(expected);
    });

    it('should work with tabs', () => {
      const input = 'line 1\nline 2';
      expect(indentLines(input, 0)).toBe('line 1\nline 2');
    });
  });

  describe('indentHTML', () => {
    it('should properly indent nested HTML with default 2 spaces', () => {
      const input = '<div>\n<p>Content</p>\n</div>';
      const expected = '<div>\n  <p>Content</p>\n</div>';
      expect(indentHTML(input)).toBe(expected);
    });

    it('should handle multiple levels of nesting', () => {
      const input = '<div>\n<div>\n<p>Content</p>\n</div>\n</div>';
      const expected = '<div>\n  <div>\n    <p>Content</p>\n  </div>\n</div>';
      expect(indentHTML(input)).toBe(expected);
    });

    it('should handle void elements without increasing depth', () => {
      const input = '<div>\n<img src="test.jpg">\n<br>\n<input type="text">\n</div>';
      const expected = '<div>\n  <img src="test.jpg">\n  <br>\n  <input type="text">\n</div>';
      expect(indentHTML(input)).toBe(expected);
    });

    it('should handle self-closing tags', () => {
      const input = '<div>\n<img src="test.jpg" />\n<component />\n</div>';
      const expected = '<div>\n  <img src="test.jpg" />\n  <component />\n</div>';
      expect(indentHTML(input)).toBe(expected);
    });

    it('should handle elements with opening and closing tags on same line', () => {
      const input = '<div>\n<p>Title</p>\n<span>Text</span>\n</div>';
      const expected = '<div>\n  <p>Title</p>\n  <span>Text</span>\n</div>';
      expect(indentHTML(input)).toBe(expected);
    });

    it('should handle HTML comments', () => {
      const input = '<div>\n<!-- Comment -->\n<p>Content</p>\n</div>';
      const expected = '<div>\n  <!-- Comment -->\n  <p>Content</p>\n</div>';
      expect(indentHTML(input)).toBe(expected);
    });

    it('should use custom indent string', () => {
      const input = '<div>\n<p>Content</p>\n</div>';
      const expected = '<div>\n    <p>Content</p>\n</div>';
      expect(indentHTML(input, { indent: '    ' })).toBe(expected);
    });

    it('should use custom indent with tabs', () => {
      const input = '<div>\n<p>Content</p>\n</div>';
      const expected = '<div>\n\t<p>Content</p>\n</div>';
      expect(indentHTML(input, { indent: '\t' })).toBe(expected);
    });

    it('should respect startLevel option', () => {
      const input = '<div>\n<p>Content</p>\n</div>';
      const expected = '  <div>\n    <p>Content</p>\n  </div>';
      expect(indentHTML(input, { startLevel: 1 })).toBe(expected);
    });

    it('should remove empty lines by default', () => {
      const input = '<div>\n\n<p>Content</p>\n\n</div>';
      const expected = '<div>\n  <p>Content</p>\n</div>';
      expect(indentHTML(input)).toBe(expected);
    });

    it('should preserve empty lines when trimEmptyLines is false', () => {
      const input = '<div>\n\n<p>Content</p>\n\n</div>';
      const expected = '<div>\n  \n  <p>Content</p>\n  \n</div>';
      expect(indentHTML(input, { trimEmptyLines: false })).toBe(expected);
    });

    it('should handle messy indentation from template literals', () => {
      const input = `<div class="ui segment">
<div class="ui header">Title</div>
<p>Content here</p>
<div class="ui list">
<div class="item">
<img src="image.jpg" />
<div class="content">Item 1</div>
</div>
</div>
</div>`;

      const expected = `<div class="ui segment">
  <div class="ui header">Title</div>
  <p>Content here</p>
  <div class="ui list">
    <div class="item">
      <img src="image.jpg" />
      <div class="content">Item 1</div>
    </div>
  </div>
</div>`;

      expect(indentHTML(input)).toBe(expected);
    });

    it('should handle all void elements', () => {
      const voidTags = [
        'area',
        'base',
        'br',
        'col',
        'embed',
        'hr',
        'img',
        'input',
        'link',
        'meta',
        'param',
        'source',
        'track',
        'wbr',
      ];

      voidTags.forEach(tag => {
        const input = `<div>\n<${tag}>\n</div>`;
        const expected = `<div>\n  <${tag}>\n</div>`;
        expect(indentHTML(input)).toBe(expected);
      });
    });

    it('should handle complex real-world HTML', () => {
      const input = `<div class="ui segment">
<div class="ui header">
Product List
</div>
<div class="ui list">
<div class="item">
<img src="product1.jpg" />
<div class="content">
<div class="header">Product 1</div>
<div class="description">Description here</div>
</div>
</div>
<div class="item">
<img src="product2.jpg" />
<div class="content">
<div class="header">Product 2</div>
</div>
</div>
</div>
</div>`;

      const result = indentHTML(input);

      // Verify structure by checking key lines
      expect(result).toContain('  <div class="ui header">');
      expect(result).toContain('    <div class="item">');
      expect(result).toContain('      <img src="product1.jpg" />');
      expect(result).toContain('        <div class="header">Product 1</div>');
    });

    it('should handle non-string input', () => {
      expect(indentHTML(null)).toBe('');
      expect(indentHTML(undefined)).toBe('');
      expect(indentHTML(123)).toBe('');
    });

    it('should handle empty string', () => {
      expect(indentHTML('')).toBe('');
    });

    it('should not break on attributes with angle brackets in values', () => {
      const input = '<div>\n<input placeholder="Enter <value>">\n</div>';
      const expected = '<div>\n  <input placeholder="Enter <value>">\n</div>';
      expect(indentHTML(input)).toBe(expected);
    });
  });
});

const text = (value, start, end) => ({ type: 'text', value, start, end });
const attribute = (name, value, quote = '"') => ({ name, value, quote });

// a server render's shape: declarative shadow roots, marker comments, bind attributes
const renderLike = (rows) => {
  let html = '<bench-table><template shadowrootmode="open"><table class="ui table"><tbody><!--sui-block:v1:0-->';
  for (let i = 0; i < rows; i++) {
    html += `<!--sui-item:v1:${i}--><bench-row index="${i}" label="Row ${i}" data-sui-bind="index=0,label=1">`
      + `<template shadowrootmode="open"><tr class="row ${i % 2 ? 'odd' : 'even'}" data-sui-bind="class=0">`
      + `<td><!--sui:v1:1-->${i}</td><td title="Row ${i}"><!--sui:v1:2-->Row ${i}</td>`
      + `<td><ui-badge value="${i % 10}"><template shadowrootmode="open"><span class="badge"><!--sui:v1:0-->${
        i % 10
      }</span>`
      + '</template></ui-badge></td></tr></template></bench-row>';
  }
  return html + '<!--/sui-block:v1:0--></tbody></table></template></bench-table>';
};

// a page as an author writes one: a head with style and script, entities, unquoted values, comments, raw text
const pageLike = (bytes) => {
  let html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Catalog &amp; Orders</title>\n'
    + '<style>\n.card > .image { width: 4rem } /* a comment with <b> inside */\n</style>\n'
    + '<script type="module">\nif (a < b && c > d) { document.title = "<not a tag>"; }\n</script>\n</head>\n<body class="ui page">\n'
    + '<!-- rendered on the server -->\n<main id="content">\n';
  for (let i = 0; html.length < bytes; i++) {
    html +=
      `<section class="ui segment" data-index="${i}">\n  <h2 class="ui header">Order #${i} <span class="sub header">placed ${
        i % 28
      } days ago</span></h2>\n`
      + `  <div class="card" data-sku="SKU-${i}">\n    <img class="image" src="/img/${i}.jpg" alt="Item ${i}" loading=lazy>\n`
      + `    <a class="header" href="/items/${i}?page=1&amp;sort=date" title="It&#39;s &quot;quoted&quot;">Item ${i}</a>\n`
      + `    <p class="description">Lorem ipsum, <em>consectetur</em> &mdash; sed do eiusmod.</p>\n`
      + `    <ui-rating value="${i % 5}" max="5" disabled></ui-rating>\n    <!-- card ${i} -->\n`
      + `    <input type="checkbox" name="pick" checked />\n  </div>\n`
      + `  <textarea name="note-${i}" rows="2">notes with <tags> that are text</textarea>\n</section>\n`;
  }
  return html
    + '</main>\n<footer><p>&copy; 2026 Semantic</p></footer>\n<script src="/app.js" defer></script>\n</body>\n</html>\n';
};

describe('parseHTML', () => {
  describe('shapes', () => {
    it('should read elements, attributes and text with source spans', () => {
      expect(parseHTML('<p class="a">Hi <b>there</b></p>')).toEqual([{
        type: 'element',
        name: 'p',
        attributes: [attribute('class', 'a')],
        children: [
          text('Hi ', 13, 16),
          {
            type: 'element',
            name: 'b',
            attributes: [],
            children: [text('there', 19, 24)],
            selfClosing: false,
            start: 16,
            end: 28,
            innerStart: 19,
            innerEnd: 24,
          },
        ],
        selfClosing: false,
        start: 0,
        end: 32,
        innerStart: 13,
        innerEnd: 28,
      }]);
    });

    it('should keep every attribute form as written', () => {
      const [element] = parseHTML(
        `<a href="x" title='y' data-n=1 disabled alt="" rel = "z" @click="go" :value="v" xlink:href="#a" viewBox="0 0 1 1">`,
      );
      expect(element.attributes).toEqual([
        attribute('href', 'x'),
        attribute('title', 'y', "'"),
        attribute('data-n', '1', ''),
        attribute('disabled', null, ''),
        attribute('alt', ''),
        attribute('rel', 'z'),
        attribute('@click', 'go'),
        attribute(':value', 'v'),
        attribute('xlink:href', '#a'),
        attribute('viewBox', '0 0 1 1'),
      ]);
    });

    it('should start an attribute name with = or a quote and never end one at a quote, as the spec reads them', () => {
      expect(parseHTML("<hr role={getAriaProp 'role'}>")[0].attributes).toEqual([
        attribute('role', '{getAriaProp', ''),
        attribute("'role'}", null, ''),
      ]);
      expect(parseHTML('<div "x">')[0].attributes).toEqual([attribute('"x"', null, '')]);
      expect(parseHTML('<a =b>')[0].attributes).toEqual([attribute('=b', null, '')]);
      expect(parseHTML('<b primary={filter == filterName}>')[0].attributes).toEqual([
        attribute('primary', '{filter', ''),
        attribute('=', 'filterName}', ''),
      ]);
      expect(parseHTML('<a b"c=1>')[0].attributes).toEqual([attribute('b"c', '1', '')]);
    });

    it('should drop only a stray slash inside a tag', () => {
      expect(parseHTML('<a / b>')[0].attributes).toEqual([attribute('b', null, '')]);
    });

    it('should keep duplicate attributes in order and entities undecoded', () => {
      const [element] = parseHTML('<a class="x" class="y" title="&amp;&quot;">');
      expect(element.attributes).toEqual([
        attribute('class', 'x'),
        attribute('class', 'y'),
        attribute('title', '&amp;&quot;'),
      ]);
    });

    it('should keep tag name case and match the close tag without it', () => {
      const [element] = parseHTML('<DIV ID=x>a</div>');
      expect(element).toMatchObject({ name: 'DIV', attributes: [attribute('ID', 'x', '')], end: 17 });
      expect(element.children).toEqual([text('a', 10, 11)]);
    });

    it('should read text around and between tags, whitespace runs included', () => {
      expect(parseHTML('a <b>c</b> d')).toEqual([
        text('a ', 0, 2),
        {
          type: 'element',
          name: 'b',
          attributes: [],
          children: [text('c', 5, 6)],
          selfClosing: false,
          start: 2,
          end: 10,
          innerStart: 5,
          innerEnd: 6,
        },
        text(' d', 10, 12),
      ]);
      expect(parseHTML('   ')).toEqual([text('   ', 0, 3)]);
    });

    it('should leave a < that begins no tag in its text run', () => {
      expect(parseHTML('a < b')).toEqual([text('a < b', 0, 5)]);
      expect(parseHTML('1 <2')).toEqual([text('1 <2', 0, 4)]);
    });

    it('should read comments with their inside verbatim', () => {
      expect(parseHTML('<!-- keep --><br>')).toEqual([
        { type: 'comment', value: ' keep ', start: 0, end: 13 },
        {
          type: 'element',
          name: 'br',
          attributes: [],
          children: [],
          selfClosing: false,
          start: 13,
          end: 17,
          innerStart: 17,
          innerEnd: 17,
        },
      ]);
      expect(parseHTML('<!--[if mso]><table></table><![endif]-->')).toEqual([
        { type: 'comment', value: '[if mso]><table></table><![endif]', start: 0, end: 40 },
      ]);
      expect(parseHTML('<!-- open')).toEqual([{ type: 'comment', value: ' open', start: 0, end: 9 }]);
    });

    it('should read a doctype as written and keep CDATA and processing instructions as text', () => {
      expect(parseHTML('<!doctype html>')).toEqual([{ type: 'doctype', value: 'doctype html', start: 0, end: 15 }]);
      expect(parseHTML('<!DOCTYPE html>')).toEqual([{ type: 'doctype', value: 'DOCTYPE html', start: 0, end: 15 }]);
      expect(parseHTML('a<![CDATA[<div>]]>b')).toEqual([text('a<![CDATA[<div>]]>b', 0, 19)]);
      expect(parseHTML('<?xml version="1.0"?>')).toEqual([text('<?xml version="1.0"?>', 0, 21)]);
    });
  });

  describe('void and self-closing elements', () => {
    it('should give a void element no children and the extent of its open tag', () => {
      const [img, span] = parseHTML('<img src="a.png"><span>x</span>');
      expect(img).toMatchObject({
        name: 'img',
        children: [],
        selfClosing: false,
        start: 0,
        end: 17,
        innerStart: 17,
        innerEnd: 17,
      });
      expect(span).toMatchObject({ name: 'span', start: 17 });
    });

    it('should read a self-closed void element with its slash', () => {
      expect(parseHTML('<input disabled/>')[0]).toMatchObject({
        name: 'input',
        selfClosing: true,
        children: [],
        end: 17,
      });
    });

    it('should close a non-void element on /> by default', () => {
      const nodes = parseHTML('<my-el/><p>a</p>');
      expect(nodes).toHaveLength(2);
      expect(nodes[0]).toMatchObject({ name: 'my-el', selfClosing: true, children: [], end: 8 });
      expect(nodes[1]).toMatchObject({ name: 'p', start: 8 });
    });

    it('should read /> as a browser does under closeOnSlash false', () => {
      const [div] = parseHTML('<div/><p>a</p>', { closeOnSlash: false });
      expect(div).toMatchObject({ name: 'div', selfClosing: true, end: 14 });
      expect(div.children[0]).toMatchObject({ name: 'p' });
    });

    it('should read an unquoted value through a slash, as a browser does', () => {
      expect(parseHTML('<img src=x/>')[0]).toMatchObject({
        attributes: [attribute('src', 'x/', '')],
        selfClosing: false,
      });
    });

    it('should nest self-closed elements inside svg', () => {
      const [svg] = parseHTML('<svg viewBox="0 0 1 1"><circle cx="1"/><path d="M0 0"/></svg>');
      expect(svg.children.map((child) => child.name)).toEqual(['circle', 'path']);
      expect(svg.children[0].selfClosing).toBe(true);
    });
  });

  describe('raw text', () => {
    it('should keep script, style, textarea and title content as one uninterpreted text child', () => {
      expect(parseHTML('<script>if (a<b) x = "<i>"</script>')[0].children).toEqual([text('if (a<b) x = "<i>"', 8, 26)]);
      expect(parseHTML('<style>a > b { c: "</p>" }</style>')[0].children).toEqual([text('a > b { c: "</p>" }', 7, 26)]);
      expect(parseHTML('<textarea><b></textarea>')[0].children).toEqual([text('<b>', 10, 13)]);
      expect(parseHTML('<title>a <b> c</title>')[0].children).toEqual([text('a <b> c', 7, 14)]);
    });

    it('should match the raw text close tag without case and mark the spans', () => {
      const [script] = parseHTML('<script>x</SCRIPT>');
      expect(script).toMatchObject({ innerStart: 8, innerEnd: 9, end: 18 });
      expect(parseHTML('<script></script>')[0]).toMatchObject({ children: [], innerStart: 8, innerEnd: 8, end: 17 });
    });

    it('should run raw text to the end of the string when the close tag is missing', () => {
      const [style] = parseHTML('<style>a{}');
      expect(style.children).toEqual([text('a{}', 7, 10)]);
      expect(style).toMatchObject({ innerEnd: 10, end: 10 });
    });

    it('should not end raw text at a close tag of another name', () => {
      expect(parseHTML('<script></scripts></script>')[0].children).toEqual([text('</scripts>', 8, 18)]);
    });

    it('should cover the spec set, plaintext to the end of the string', () => {
      each(['xmp', 'iframe', 'noembed', 'noframes'], (name) => {
        expect(parseHTML(`<${name}><b></${name}>`)[0].children).toEqual([
          text('<b>', name.length + 2, name.length + 5),
        ]);
      });
      expect(parseHTML('<plaintext>a<b></plaintext>')[0].children).toEqual([text('a<b></plaintext>', 11, 27)]);
    });
  });

  describe('nesting and recovery', () => {
    it('should close what is still open when an outer close tag arrives', () => {
      const [div, after] = parseHTML('<div><span>a</div>b');
      const [span] = div.children;
      expect(span).toMatchObject({ name: 'span', innerEnd: 12, end: 12 });
      expect(div).toMatchObject({ innerEnd: 12, end: 18 });
      expect(after).toEqual(text('b', 18, 19));
    });

    it('should keep an unmatched close tag as text', () => {
      expect(parseHTML('</div>')).toEqual([text('</div>', 0, 6)]);
      expect(parseHTML('<b>x</i>y</b>')[0].children).toEqual([text('x</i>y', 3, 9)]);
    });

    it('should end an unclosed element at the end of the string', () => {
      expect(parseHTML('<b>x')[0]).toMatchObject({ innerStart: 3, innerEnd: 4, end: 4 });
    });

    it('should imply no structure of its own', () => {
      const [outer] = parseHTML('<p>a<p>b');
      expect(outer.children[1]).toMatchObject({ name: 'p' });
      expect(parseHTML('<table><tr><td>x</td></tr></table>')[0].children[0]).toMatchObject({ name: 'tr' });
    });

    it('should keep a tag cut off by the end of the string as text', () => {
      expect(parseHTML('<div class="x')).toEqual([text('<div class="x', 0, 13)]);
      expect(parseHTML('a <b')).toEqual([text('a <b', 0, 4)]);
    });

    it('should keep a tag whose quote never closes as text', () => {
      expect(parseHTML('<a href="x>')).toEqual([text('<a href="x>', 0, 11)]);
    });
  });

  describe('degenerate input', () => {
    it('should return an empty tree for nothing to read', () => {
      expect(parseHTML('')).toEqual([]);
      expect(parseHTML(null)).toEqual([]);
      expect(parseHTML(undefined)).toEqual([]);
      expect(parseHTML(42)).toEqual([]);
    });

    it('should never throw on markup soup', () => {
      each(
        ['<', '<>', '</>', '<!', '<!-', '<a =', '<a ="', '<a/', '<a /', '<<<', '<hr "x">', '<div "x"></div>'],
        (soup) => {
          expect(() => parseHTML(soup)).not.toThrow();
          expect(stringifyHTML(parseHTML(soup))).toBe(soup);
        },
      );
      // the one open element grows its close tag on the way back
      expect(stringifyHTML(parseHTML('<a b=c d>>'))).toBe('<a b=c d>></a>');
    });
  });
});

describe('stringifyHTML', () => {
  const roundTrip = (html) => stringifyHTML(parseHTML(html));

  it('should write ordinary markup back byte for byte', () => {
    const html = '<!DOCTYPE html>\n<div class="a" id=b data-x=\'y\' hidden>\n  <p>Hi <b>there</b> &amp; you</p>\n'
      + '  <!-- note -->\n  <img src="x.png" alt="">\n  <br />\n  <script>if (a < b) {}</script>\n</div>\n';
    expect(roundTrip(html)).toBe(html);
  });

  it('should keep the bytes of a template expression in an attribute', () => {
    expect(roundTrip("<hr role={getAriaProp 'role'}>")).toBe("<hr role={getAriaProp 'role'}>");
    expect(roundTrip('<div "x"></div>')).toBe('<div "x"></div>');
    expect(roundTrip('<a =b></a>')).toBe('<a =b></a>');
    expect(roundTrip('<b primary={filter == filterName}></b>')).toBe('<b primary={filter ==filterName}></b>');
  });

  it('should write a self closing tag with a space before the slash', () => {
    expect(roundTrip('<br/>')).toBe('<br />');
    expect(roundTrip('<img src="x"/>')).toBe('<img src="x" />');
    expect(roundTrip('<my-el a="1" />')).toBe('<my-el a="1" />');
  });

  it('should normalize the whitespace inside a tag and nothing else', () => {
    expect(roundTrip('<a  href = "x"\n   title=\'y\'  >z</a >')).toBe('<a href="x" title=\'y\'>z</a>');
    expect(roundTrip('<p>  two  spaces  </p>')).toBe('<p>  two  spaces  </p>');
  });

  it('should respell a close tag from its open tag', () => {
    expect(roundTrip('<DIV>x</div>')).toBe('<DIV>x</DIV>');
  });

  it('should close what the source left open', () => {
    expect(roundTrip('<b>x')).toBe('<b>x</b>');
    expect(roundTrip('<div><span>a</div>b')).toBe('<div><span>a</span></div>b');
    expect(roundTrip('<!-- open')).toBe('<!-- open-->');
    expect(roundTrip('<plaintext>a')).toBe('<plaintext>a</plaintext>');
  });

  it('should never write a close tag for a void element', () => {
    expect(roundTrip('<br>')).toBe('<br>');
    expect(stringifyHTML({ type: 'element', name: 'br', attributes: [], children: [] })).toBe('<br>');
    expect(stringifyHTML({ type: 'element', name: 'BR', attributes: [], children: [] })).toBe('<BR>');
  });

  it('should write attribute values verbatim, quoting left to the caller', () => {
    const nodes = parseHTML('<a href="/x">Go</a>');
    nodes[0].attributes[0].value = '/y';
    expect(stringifyHTML(nodes)).toBe('<a href="/y">Go</a>');
    nodes[0].attributes.push(attribute('title', 'say "hi"'));
    expect(stringifyHTML(nodes)).toBe('<a href="/y" title="say "hi"">Go</a>');
  });

  it('should take one node or a list, and nothing else', () => {
    const [a] = parseHTML('<a>x</a>');
    expect(stringifyHTML(a)).toBe('<a>x</a>');
    expect(stringifyHTML([a, a])).toBe('<a>x</a><a>x</a>');
    expect(stringifyHTML('x')).toBe('');
    expect(stringifyHTML(null)).toBe('');
    expect(stringifyHTML(undefined)).toBe('');
  });

  it('should write hand built nodes with fields missing', () => {
    expect(stringifyHTML({ type: 'element', name: 'a' })).toBe('<a></a>');
    expect(
      stringifyHTML({
        type: 'element',
        name: 'a',
        attributes: [{ name: 'x', value: '1' }],
        children: [{ type: 'text', value: 'y' }],
      }),
    ).toBe('<a x=1>y</a>');
    expect(
      stringifyHTML([{ type: 'comment', value: 'c' }, { type: 'doctype', value: 'doctype html' }, { type: 'nope' }, 7]),
    ).toBe('<!--c--><!doctype html>');
  });

  it('should round trip a server render byte for byte', () => {
    const html = renderLike(720);
    expect(html.length).toBeGreaterThan(240 * 1024);
    expect(roundTrip(html)).toBe(html);
  });

  it('should round trip an authored page byte for byte', () => {
    const html = pageLike(100 * 1024);
    expect(html.length).toBeGreaterThan(100 * 1024);
    expect(roundTrip(html)).toBe(html);
  });
});

describe('voidElements and rawTextElements', () => {
  it('should hold the spec lists', () => {
    expect(voidElements.size).toBe(14);
    expect(voidElements.has('br')).toBe(true);
    expect(voidElements.has('div')).toBe(false);
    expect(rawTextElements.size).toBe(9);
    expect(rawTextElements.has('script')).toBe(true);
    expect(rawTextElements.has('pre')).toBe(false);
  });
});
