import {
  adoptStylesheet,
  parseCSS,
  prefixCSS,
  scopeStyles,
  selectorSpecificity,
  stringifyCSS,
} from '@semantic-ui/utils';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const declaration = (property, value, important = false) => ({ type: 'declaration', property, value, important });
const rule = (selectors, children = []) => ({ type: 'rule', selectors, children });
const at = (
  name,
  prelude,
  children,
) => (children ? { type: 'at', name, prelude, children } : { type: 'at', name, prelude });

describe('prefixCSS', () => {
  it('should add -webkit-user-select prefix', () => {
    const input = '  .select-none {\n    user-select: none;\n  }';
    const output = prefixCSS(input);
    expect(output).toContain('-webkit-user-select: none;');
    expect(output).toContain('user-select: none;');
  });

  it('should add -webkit-backdrop-filter prefix', () => {
    const input = '  .blur {\n    backdrop-filter: blur(4px);\n  }';
    const output = prefixCSS(input);
    expect(output).toContain('-webkit-backdrop-filter: blur(4px);');
    expect(output).toContain('backdrop-filter: blur(4px);');
  });

  it('should add -webkit-print-color-adjust prefix', () => {
    const input = '  .exact {\n    print-color-adjust: exact;\n  }';
    const output = prefixCSS(input);
    expect(output).toContain('-webkit-print-color-adjust: exact;');
  });

  it('should add -moz-text-size-adjust prefix', () => {
    const input = '  html {\n    text-size-adjust: 100%;\n  }';
    const output = prefixCSS(input);
    expect(output).toContain('-moz-text-size-adjust: 100%;');
    expect(output).toContain('text-size-adjust: 100%;');
  });

  it('should not prefix already-prefixed lines', () => {
    const input = '    -webkit-user-select: none;';
    const output = prefixCSS(input);
    const count = (output.match(/-webkit-user-select/g) || []).length;
    expect(count).toBe(1);
  });

  it('should not modify unrelated properties', () => {
    const input = '  .flex {\n    display: flex;\n    color: red;\n  }';
    const output = prefixCSS(input);
    expect(output).toBe(input);
  });

  it('should preserve indentation', () => {
    const input = '      user-select: none;';
    const output = prefixCSS(input);
    expect(output).toContain('      -webkit-user-select: none;');
  });

  it('should handle multiple properties in one block', () => {
    const input = '.foo {\n  user-select: none;\n  backdrop-filter: blur(10px);\n}';
    const output = prefixCSS(input);
    expect(output).toContain('-webkit-user-select');
    expect(output).toContain('-webkit-backdrop-filter');
  });

  it('should return empty/null input unchanged', () => {
    expect(prefixCSS('')).toBe('');
    expect(prefixCSS(null)).toBe(null);
    expect(prefixCSS(undefined)).toBe(undefined);
  });
});

describe('adoptStylesheet', () => {
  it('should early-return on server without side effects', () => {
    // In Node environment, isServer is true so adoptStylesheet should bail early
    const result = adoptStylesheet('.test { color: red; }');
    expect(result).toBeUndefined();
  });

  it('should early-return on server even with options', () => {
    expect(() => {
      adoptStylesheet('.test { color: red; }', null, { cacheStylesheet: false });
    }).not.toThrow();
  });

  it('should early-return on server with custom hash', () => {
    const result = adoptStylesheet('.test { color: red; }', null, { hash: 'custom' });
    expect(result).toBeUndefined();
  });
});

describe('parseCSS', () => {
  describe('shapes', () => {
    it('keeps nesting as written', () => {
      expect(parseCSS('.a { color: red; &:hover { color: blue } }')).toEqual([
        rule(['.a'], [declaration('color', 'red'), rule(['&:hover'], [declaration('color', 'blue')])]),
      ]);
    });

    it('reads a block at-rule with its prelude', () => {
      expect(parseCSS('@media (min-width: 40em) { .a { gap: 1rem } }')).toEqual([
        at('media', '(min-width: 40em)', [rule(['.a'], [declaration('gap', '1rem')])]),
      ]);
    });

    it('reads a statement at-rule with no body', () => {
      expect(parseCSS('@import url("x.css") layer(base);')).toEqual([at('import', 'url("x.css") layer(base)')]);
      expect(parseCSS('@layer a, b;')).toEqual([at('layer', 'a, b')]);
    });

    it('drops comments, keeps custom properties and reads !important', () => {
      expect(parseCSS('/* note */ :host { --gap: 4px; width: 100% !important }')).toEqual([
        rule([':host'], [declaration('--gap', '4px'), declaration('width', '100%', true)]),
      ]);
    });

    it('reads every !important spelling', () => {
      expect(parseCSS('.a { a: b ! important; c: d !IMPORTANT; e: f!important }')).toEqual([
        rule(['.a'], [declaration('a', 'b', true), declaration('c', 'd', true), declaration('e', 'f', true)]),
      ]);
    });

    it('keeps property case as written', () => {
      expect(parseCSS(':host { --Brand: 1; Color: red }')).toEqual([
        rule([':host'], [declaration('--Brand', '1'), declaration('Color', 'red')]),
      ]);
    });

    it('keeps declarations and nested blocks in source order', () => {
      const css = '.a { @starting-style { opacity: 0 } opacity: 1; &.in { color: red } }';
      expect(parseCSS(css)).toEqual([
        rule(['.a'], [
          at('starting-style', '', [declaration('opacity', '0')]),
          declaration('opacity', '1'),
          rule(['&.in'], [declaration('color', 'red')]),
        ]),
      ]);
    });

    it('splits a selector list on top-level commas only', () => {
      expect(parseCSS('[data-x="a,b"], :is(.c, .d), .e { f: g }')).toEqual([
        rule(['[data-x="a,b"]', ':is(.c, .d)', '.e'], [declaration('f', 'g')]),
      ]);
    });

    it('lets strings and parentheses hold delimiters', () => {
      const css =
        '.a { content: "a;b}"; background: url(data:image/svg+xml;base64,AB==); width: calc((1px + 2px) * 2) }';
      expect(parseCSS(css)).toEqual([
        rule(['.a'], [
          declaration('content', '"a;b}"'),
          declaration('background', 'url(data:image/svg+xml;base64,AB==)'),
          declaration('width', 'calc((1px + 2px) * 2)'),
        ]),
      ]);
    });

    it('drops comments inside a selector or a value and reads CRLF', () => {
      expect(parseCSS('.a /* x */ .b {\r\n  color: /* y */ red;\r\n}')).toEqual([
        rule(['.a .b'], [declaration('color', 'red')]),
      ]);
    });

    it('reads declaration blocks and keyframes by what they hold', () => {
      const css =
        '@font-face { font-family: Lato } @property --p { syntax: "<length>"; inherits: true } @keyframes spin { from { a: b } to { a: c } }';
      expect(parseCSS(css)).toEqual([
        at('font-face', '', [declaration('font-family', 'Lato')]),
        at('property', '--p', [declaration('syntax', '"<length>"'), declaration('inherits', 'true')]),
        at('keyframes', 'spin', [rule(['from'], [declaration('a', 'b')]), rule(['to'], [declaration('a', 'c')])]),
      ]);
    });

    it('reads an empty sheet and a non-string as no nodes', () => {
      expect(parseCSS('')).toEqual([]);
      expect(parseCSS('   ')).toEqual([]);
      expect(parseCSS(null)).toEqual([]);
      expect(parseCSS(undefined)).toEqual([]);
      expect(parseCSS(42)).toEqual([]);
    });

    it('never throws on malformed input', () => {
      expect(parseCSS('.a { color: red')).toEqual([rule(['.a'], [declaration('color', 'red')])]);
      expect(parseCSS('.a { nocolon; color: red }')).toEqual([rule(['.a'], [declaration('color', 'red')])]);
      expect(parseCSS('color: red; .a { b: c }')).toEqual([rule(['.a'], [declaration('b', 'c')])]);
      expect(() => parseCSS('.a { content: "unclosed; color: red }')).not.toThrow();
      expect(() => parseCSS('}}}{{{')).not.toThrow();
      expect(() => parseCSS('@media')).not.toThrow();
      expect(() => parseCSS('.a { @media (x) { ')).not.toThrow();
      expect(() => parseCSS('.a { b: calc(1px')).not.toThrow();
    });
  });

  describe('flatten', () => {
    it('multiplies selector lists and hoists a nested at-rule', () => {
      const css = '.a, .b { color: red; .c, > .d { color: blue } @media print { display: none } }';
      expect(parseCSS(css, { flatten: true })).toEqual([
        rule(['.a', '.b'], [declaration('color', 'red')]),
        rule(['.a .c', '.a > .d', '.b .c', '.b > .d'], [declaration('color', 'blue')]),
        at('media', 'print', [rule(['.a', '.b'], [declaration('display', 'none')])]),
      ]);
    });

    it('substitutes every & where written', () => {
      const css = '.a { .dark & { color: red } & + & { color: blue } &.x { color: green } &::part(y) { color: pink } }';
      expect(parseCSS(css, { flatten: true })).toEqual([
        rule(['.dark .a'], [declaration('color', 'red')]),
        rule(['.a + .a'], [declaration('color', 'blue')]),
        rule(['.a.x'], [declaration('color', 'green')]),
        rule(['.a::part(y)'], [declaration('color', 'pink')]),
      ]);
    });

    it('keeps trailing declarations after a nested block in written order', () => {
      const css = '.a { @starting-style { opacity: 0 } opacity: 1; &.in { color: red } }';
      expect(parseCSS(css, { flatten: true })).toEqual([
        at('starting-style', '', [rule(['.a'], [declaration('opacity', '0')])]),
        rule(['.a'], [declaration('opacity', '1')]),
        rule(['.a.in'], [declaration('color', 'red')]),
      ]);
    });

    it('lifts a nested at-rule holding declarations and rules', () => {
      expect(parseCSS('.a { @media (x) { color: red; .b { color: blue } } }', { flatten: true })).toEqual([
        at('media', '(x)', [
          rule(['.a'], [declaration('color', 'red')]),
          rule(['.a .b'], [declaration('color', 'blue')]),
        ]),
      ]);
    });

    it('nests deeper levels through every parent', () => {
      expect(parseCSS('.a { .b { .c { d: e } } }', { flatten: true })).toEqual([
        rule(['.a .b .c'], [declaration('d', 'e')]),
      ]);
    });

    it('leaves keyframes and top-level at-rules in place', () => {
      const css =
        '@keyframes spin { from { a: b } to { a: c } } @media print { .a { .b { c: d } } } @import url(x.css);';
      expect(parseCSS(css, { flatten: true })).toEqual([
        at('keyframes', 'spin', [rule(['from'], [declaration('a', 'b')]), rule(['to'], [declaration('a', 'c')])]),
        at('media', 'print', [rule(['.a .b'], [declaration('c', 'd')])]),
        at('import', 'url(x.css)'),
      ]);
    });

    it('keeps a written empty rule and writes none for a parent with only nested rules', () => {
      expect(parseCSS('.empty {} .a { .b { c: d } }', { flatten: true })).toEqual([
        rule(['.empty']),
        rule(['.a .b'], [declaration('c', 'd')]),
      ]);
    });
  });
});

describe('stringifyCSS', () => {
  it('writes one canonical layout', () => {
    expect(stringifyCSS(parseCSS('.a{color:red}'))).toBe('.a {\n  color: red;\n}');
    expect(stringifyCSS(parseCSS('@media print { .a { display: none } }'))).toBe(
      '@media print {\n  .a {\n    display: none;\n  }\n}',
    );
    expect(stringifyCSS(parseCSS('.a { width: 1px !important }'))).toBe('.a {\n  width: 1px !important;\n}');
    expect(stringifyCSS(parseCSS('.a, .b { c: d }'))).toBe('.a, .b {\n  c: d;\n}');
  });

  it('writes statements, empty blocks and nested blocks', () => {
    expect(stringifyCSS(parseCSS('@import url("x.css");'))).toBe('@import url("x.css");');
    expect(stringifyCSS(parseCSS('@font-face {}'))).toBe('@font-face {\n}');
    expect(stringifyCSS(parseCSS('.a { b: c; &:hover { d: e } }'))).toBe(
      '.a {\n  b: c;\n  &:hover {\n    d: e;\n  }\n}',
    );
  });

  it('takes an indent', () => {
    expect(stringifyCSS(parseCSS('.a { b: c; .d { e: f } }'), { indent: '' })).toBe('.a {\nb: c;\n.d {\ne: f;\n}\n}');
    expect(stringifyCSS(parseCSS('.a{b:c}'), { indent: '\t' })).toBe('.a {\n\tb: c;\n}');
  });

  it('writes nothing for no nodes', () => {
    expect(stringifyCSS([])).toBe('');
    expect(stringifyCSS(null)).toBe('');
    expect(stringifyCSS('nope')).toBe('');
  });

  it('round trips every tree parseCSS produces', () => {
    const sheets = [
      '.a { color: red; &:hover { color: blue } }',
      '@media (min-width: 40em) { .a { gap: 1rem } }',
      '@layer a, b; @layer a { .x { y: z } } @property --p { syntax: "<length>"; inherits: true }',
      '.a { @media (x) { color: red; .b { color: blue } } }',
      '.a { @starting-style { opacity: 0 } opacity: 1; &.in { color: red } }',
      '@font-face {} .empty {} @import url(x.css);',
    ];
    for (const css of sheets) {
      const tree = parseCSS(css);
      expect(parseCSS(stringifyCSS(tree))).toEqual(tree);
      const flat = parseCSS(css, { flatten: true });
      expect(parseCSS(stringifyCSS(flat))).toEqual(flat);
    }
  });
});

describe('selectorSpecificity', () => {
  it('counts ids, classes and elements', () => {
    expect(selectorSpecificity('.a:hover > #b::before')).toEqual([1, 2, 1]);
    expect(selectorSpecificity('li')).toEqual([0, 0, 1]);
    expect(selectorSpecificity('ul li.item[data-x="a b"]')).toEqual([0, 2, 2]);
    expect(selectorSpecificity('*')).toEqual([0, 0, 0]);
    expect(selectorSpecificity('& > .a')).toEqual([0, 1, 0]);
  });

  it('follows the functional pseudo-class rules', () => {
    expect(selectorSpecificity(':is(.a, #b) .c')).toEqual([1, 1, 0]);
    expect(selectorSpecificity('a:not(.b, #c)')).toEqual([1, 0, 1]);
    expect(selectorSpecificity(':where(.a)')).toEqual([0, 0, 0]);
    expect(selectorSpecificity('li:nth-child(2n of .x)')).toEqual([0, 2, 1]);
    expect(selectorSpecificity('li:nth-child(2n+1)')).toEqual([0, 1, 1]);
  });

  it('follows the shadow-dom rules', () => {
    expect(selectorSpecificity(':host')).toEqual([0, 1, 0]);
    expect(selectorSpecificity(':host(.x)')).toEqual([0, 2, 0]);
    expect(selectorSpecificity('::slotted(span)')).toEqual([0, 0, 2]);
    expect(selectorSpecificity('::part(label)')).toEqual([0, 0, 1]);
  });

  it('counts legacy single-colon pseudo-elements as elements', () => {
    expect(selectorSpecificity('a:before')).toEqual([0, 0, 2]);
    expect(selectorSpecificity('p:first-line')).toEqual([0, 0, 2]);
  });

  it('reads nothing as zero', () => {
    expect(selectorSpecificity('')).toEqual([0, 0, 0]);
    expect(selectorSpecificity(null)).toEqual([0, 0, 0]);
  });
});

describe('scopeStyles', () => {
  it('prepends the scope to every selector in a list', () => {
    expect(scopeStyles('.first, .second { color: red; }', '.scope')).toBe(
      '.scope .first, .scope .second {\n  color: red;\n}',
    );
  });

  it('keeps nested rules under a scoped parent', () => {
    const css = '.a { color: red; &:hover { color: blue } .b { padding: 0 } @media (x) { color: green } }';
    expect(scopeStyles(css, '.scope')).toBe(
      '.scope .a {\n  color: red;\n  &:hover {\n    color: blue;\n  }\n  .b {\n    padding: 0;\n  }\n  @media (x) {\n    color: green;\n  }\n}',
    );
  });

  it('leaves the sheet as written with an empty scope', () => {
    expect(scopeStyles('.no-scope { margin: 10px; }', '')).toBe('.no-scope {\n  margin: 10px;\n}');
  });

  it('preserves the case of the scope selector', () => {
    expect(scopeStyles('.case-test { padding: 5px; }', '.SCOPE-TEST')).toContain('.SCOPE-TEST .case-test');
  });

  it('replaces :host when replaceHost is true', () => {
    const scoped = scopeStyles(':host { display: block; } :host(.active) { color: green; }', '.my-component', {
      replaceHost: true,
    });
    expect(scoped).toContain('.my-component {');
    expect(scoped).toContain('.my-component.active {');
    expect(scoped).not.toContain(':host');
  });

  it('prepends to :host when replaceHost is false', () => {
    expect(scopeStyles(':host { display: block; }', '.my-component')).toContain('.my-component :host');
  });

  it('appends the scope to html and body by default and prepends when asked', () => {
    const css = 'html { font-size: 16px; } BODY { margin: 0; }';
    const appended = scopeStyles(css, '.root-scope');
    expect(appended).toContain('html .root-scope');
    expect(appended).toContain('BODY .root-scope');
    const prepended = scopeStyles(css, '.root-scope', { appendToRootElements: false });
    expect(prepended).toContain('.root-scope html');
    expect(prepended).toContain('.root-scope BODY');
  });

  it('scopes the rules inside media, supports, layer and container blocks', () => {
    const css =
      '@media (max-width: 768px) { .r { a: b } } @supports (display: grid) { .g { a: b } } @layer base { .l { a: b } } @container (min-width: 1px) { .c { a: b } }';
    const scoped = scopeStyles(css, '.s');
    expect(scoped).toContain('@media (max-width: 768px) {\n  .s .r {');
    expect(scoped).toContain('@supports (display: grid) {\n  .s .g {');
    expect(scoped).toContain('@layer base {\n  .s .l {');
    expect(scoped).toContain('@container (min-width: 1px) {\n  .s .c {');
  });

  it('leaves keyframe selectors, declaration at-rules and statements alone', () => {
    const css = '@import url(x.css); @keyframes spin { from { a: b } 50% { a: c } } @font-face { font-family: Lato }';
    expect(scopeStyles(css, '.s')).toBe(
      '@import url(x.css);\n@keyframes spin {\n  from {\n    a: b;\n  }\n  50% {\n    a: c;\n  }\n}\n@font-face {\n  font-family: Lato;\n}',
    );
  });

  it('keeps pseudo-classes and pseudo-elements on the scoped selector', () => {
    const scoped = scopeStyles('.h:hover { a: b } .b::before { content: "" }', '.s');
    expect(scoped).toContain('.s .h:hover');
    expect(scoped).toContain('.s .b::before');
  });

  it('writes nothing for an empty or comment-only sheet', () => {
    expect(scopeStyles('', '.s')).toBe('');
    expect(scopeStyles('/* just a comment */', '.s')).toBe('');
  });
});

// the house's own stylesheets are the conformance bar: every file reads, writes back and reads again as the same tree
describe('house css corpus', () => {
  const root = fileURLToPath(new URL('../../../', import.meta.url));
  const files = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      if (name === 'node_modules' || name === 'dist') {
        continue;
      }
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        walk(full);
      }
      else if (name.endsWith('.css')) {
        files.push(full);
      }
    }
  };
  for (const dir of ['src', 'packages']) {
    try {
      walk(join(root, dir));
    }
    catch {
      // a checkout without the tree around the package has no corpus to read
    }
  }
  const normalize = (css) =>
    css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{};:,>+~])\s*/g, '$1')
      .replace(/;}/g, '}')
      .trim();

  it.skipIf(files.length === 0)('reads and writes back every file', () => {
    expect(files.length).toBeGreaterThan(300);
    for (const file of files) {
      const css = readFileSync(file, 'utf8');
      const tree = parseCSS(css);
      const text = stringifyCSS(tree);
      expect(parseCSS(text), file).toEqual(tree);
      expect(normalize(text), file).toBe(normalize(css));
      const flat = parseCSS(css, { flatten: true });
      expect(parseCSS(stringifyCSS(flat)), file).toEqual(flat);
    }
  });
});
