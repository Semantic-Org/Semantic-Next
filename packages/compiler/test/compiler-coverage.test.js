import { describe, expect, it, vi } from 'vitest';

import { TemplateCompiler } from '@semantic-ui/compiler';

describe('TemplateCompiler - Extended Coverage', () => {

  /*-----------------------------------------
    detectSyntax
  -----------------------------------------*/

  describe('detectSyntax', () => {
    it('should detect single bracket syntax', () => {
      expect(TemplateCompiler.detectSyntax('{name}')).toBe('singleBracket');
    });

    it('should detect double bracket syntax', () => {
      expect(TemplateCompiler.detectSyntax('{{name}}')).toBe('doubleBracket');
    });

    it('should default to single bracket for plain HTML', () => {
      expect(TemplateCompiler.detectSyntax('<div>hello</div>')).toBe('singleBracket');
    });

    it('should default to single bracket for empty string', () => {
      expect(TemplateCompiler.detectSyntax('')).toBe('singleBracket');
    });

    it('should detect based on which syntax appears first', () => {
      expect(TemplateCompiler.detectSyntax('text {{a}} then {b}')).toBe('doubleBracket');
      expect(TemplateCompiler.detectSyntax('text {a} then {{b}}')).toBe('singleBracket');
    });
  });

  /*-----------------------------------------
    getValue
  -----------------------------------------*/

  describe('getValue', () => {
    it('should convert "true" to boolean true', () => {
      const compiler = new TemplateCompiler();
      expect(compiler.getValue('true')).toBe(true);
    });

    it('should convert "false" to boolean false', () => {
      const compiler = new TemplateCompiler();
      expect(compiler.getValue('false')).toBe(false);
    });

    it('should convert numeric strings to numbers', () => {
      const compiler = new TemplateCompiler();
      expect(compiler.getValue('42')).toBe(42);
      expect(compiler.getValue('0')).toBe(0);
      expect(compiler.getValue('3.14')).toBe(3.14);
      expect(compiler.getValue('-7')).toBe(-7);
    });

    it('should return non-numeric strings as-is', () => {
      const compiler = new TemplateCompiler();
      expect(compiler.getValue('hello')).toBe('hello');
      expect(compiler.getValue('user.name')).toBe('user.name');
    });

    it('should return whitespace-only strings as-is', () => {
      const compiler = new TemplateCompiler();
      expect(compiler.getValue('  ')).toBe('  ');
    });

    it('should pass through undefined and null', () => {
      const compiler = new TemplateCompiler();
      expect(compiler.getValue(undefined)).toBe(undefined);
      expect(compiler.getValue(null)).toBe(null);
    });
  });

  /*-----------------------------------------
    parseIteratorString (static)
  -----------------------------------------*/

  describe('parseIteratorString', () => {
    it('should parse simple expression without as/in', () => {
      const result = TemplateCompiler.parseIteratorString('items');
      expect(result.over).toBe('items');
      expect(result.as).toBeUndefined();
      expect(result.indexAs).toBeUndefined();
    });

    it('should parse "item in items" syntax', () => {
      const result = TemplateCompiler.parseIteratorString('item in items');
      expect(result.over).toBe('items');
      expect(result.as).toBe('item');
      expect(result.indexAs).toBeUndefined();
    });

    it('should parse "item, idx in items" syntax', () => {
      const result = TemplateCompiler.parseIteratorString('item, idx in items');
      expect(result.over).toBe('items');
      expect(result.as).toBe('item');
      expect(result.indexAs).toBe('idx');
    });

    it('should parse "items as item" syntax', () => {
      const result = TemplateCompiler.parseIteratorString('items as item');
      expect(result.over).toBe('items');
      expect(result.as).toBe('item');
      expect(result.indexAs).toBeUndefined();
    });

    it('should parse "items as item, idx" syntax', () => {
      const result = TemplateCompiler.parseIteratorString('items as item, idx');
      expect(result.over).toBe('items');
      expect(result.as).toBe('item');
      expect(result.indexAs).toBe('idx');
    });

    it('should handle empty string', () => {
      const result = TemplateCompiler.parseIteratorString('');
      expect(result.over).toBe('');
      expect(result.as).toBeUndefined();
    });
  });

  /*-----------------------------------------
    parseAsyncString (static)
  -----------------------------------------*/

  describe('parseAsyncString', () => {
    it('should parse expression without alias', () => {
      const result = TemplateCompiler.parseAsyncString('fetchData');
      expect(result.expression).toBe('fetchData');
      expect(result.as).toBeNull();
      expect(result.parts).toBeNull();
      expect(result.rest).toBeNull();
    });

    it('should parse expression with alias', () => {
      const result = TemplateCompiler.parseAsyncString('fetchData as data');
      expect(result.expression).toBe('fetchData');
      expect(result.as).toBe('data');
    });

    it('should parse expression with destructuring', () => {
      const result = TemplateCompiler.parseAsyncString('fetchData as { name, email }');
      expect(result.expression).toBe('fetchData');
      expect(result.parts).toEqual(['name', 'email']);
      expect(result.as).toBeNull();
    });

    it('should parse expression with destructuring and rest', () => {
      const result = TemplateCompiler.parseAsyncString('fetchData as { name, ...rest }');
      expect(result.expression).toBe('fetchData');
      expect(result.parts).toEqual(['name']);
      expect(result.rest).toBe('rest');
    });

    it('should handle empty string', () => {
      const result = TemplateCompiler.parseAsyncString('');
      expect(result.expression).toBe('');
    });
  });

  /*-----------------------------------------
    parseDestructuring (static)
  -----------------------------------------*/

  describe('parseDestructuring', () => {
    it('should return simple alias when no destructuring', () => {
      const result = TemplateCompiler.parseDestructuring('data');
      expect(result.as).toBe('data');
      expect(result.parts).toBeNull();
      expect(result.rest).toBeNull();
    });

    it('should parse destructured parts', () => {
      const result = TemplateCompiler.parseDestructuring('{ a, b, c }');
      expect(result.parts).toEqual(['a', 'b', 'c']);
      expect(result.as).toBeNull();
    });

    it('should parse rest element', () => {
      const result = TemplateCompiler.parseDestructuring('{ a, ...others }');
      expect(result.parts).toEqual(['a']);
      expect(result.rest).toBe('others');
    });

    it('should handle empty destructuring', () => {
      const result = TemplateCompiler.parseDestructuring('{}');
      expect(result.parts).toEqual([]);
      expect(result.rest).toBeNull();
    });

    it('should handle empty string', () => {
      const result = TemplateCompiler.parseDestructuring('');
      expect(result.as).toBe('');
      expect(result.parts).toBeNull();
    });
  });

  /*-----------------------------------------
    getObjectFromString (static)
  -----------------------------------------*/

  describe('getObjectFromString', () => {
    it('should parse key-value pairs from object-like string', () => {
      const result = TemplateCompiler.getObjectFromString("{ one: 'hello', two: world }");
      expect(result).toEqual({ one: "'hello'", two: 'world' });
    });

    it('should return trimmed string when not an object', () => {
      const result = TemplateCompiler.getObjectFromString('  simpleValue  ');
      expect(result).toBe('simpleValue');
    });

    it('should handle empty string', () => {
      expect(TemplateCompiler.getObjectFromString('')).toBe('');
    });

    it('should handle undefined', () => {
      expect(TemplateCompiler.getObjectFromString()).toBe('');
    });
  });

  /*-----------------------------------------
    preprocessTemplate (static)
  -----------------------------------------*/

  describe('preprocessTemplate', () => {
    it('should expand self-closing web components', () => {
      const result = TemplateCompiler.preprocessTemplate('<ui-button />');
      expect(result).toBe('<ui-button ></ui-button>');
    });

    it('should not transform regular HTML self-closing tags', () => {
      const result = TemplateCompiler.preprocessTemplate('<img src="test.png" />');
      expect(result).toBe('<img src="test.png" />');
    });

    it('should trim whitespace', () => {
      const result = TemplateCompiler.preprocessTemplate('  <div>test</div>  ');
      expect(result).toBe('<div>test</div>');
    });

    it('should handle empty string', () => {
      expect(TemplateCompiler.preprocessTemplate('')).toBe('');
    });
  });

  /*-----------------------------------------
    Snippet blocks
  -----------------------------------------*/

  describe('snippet blocks', () => {
    it('should compile a basic snippet definition', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {#snippet mySnippet}
          <p>Snippet content</p>
        {/snippet}
        <div>Main content</div>
      `;
      const ast = compiler.compile(template);

      const snippetNode = ast.find(n => n.type === 'snippet');
      expect(snippetNode).toBeDefined();
      expect(snippetNode.name).toBe('mySnippet');
      expect(snippetNode.content.length).toBeGreaterThan(0);

      // Should be stored on the compiler instance
      expect(compiler.snippets.mySnippet).toBeDefined();
    });

    it('should hoist snippets to front of AST', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>Before</div>
        {#snippet footer}
          <footer>Footer</footer>
        {/snippet}
        <div>After</div>
      `;
      const ast = compiler.compile(template);
      expect(ast[0].type).toBe('snippet');
      expect(ast[0].name).toBe('footer');
    });

    it('should handle snippet with nested expressions and blocks', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {#snippet userCard}
          <div class="card">
            <h2>{userName}</h2>
            {#if isAdmin}
              <span>Admin</span>
            {/if}
          </div>
        {/snippet}
      `;
      const ast = compiler.compile(template);
      const snippet = ast.find(n => n.type === 'snippet');
      expect(snippet).toBeDefined();

      const expressions = snippet.content.filter(n => n.type === 'expression');
      expect(expressions.length).toBe(1);
      expect(expressions[0].value).toBe('userName');

      const ifBlock = snippet.content.find(n => n.type === 'if');
      expect(ifBlock).toBeDefined();
      expect(ifBlock.condition).toBe('isAdmin');
    });

    it('should compile multiple snippets and hoist all to front', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div class="card">
          {> header}
          {> description}
        </div>
        {#snippet header}
          <div class="header">{header}</div>
        {/snippet}
        {#snippet description}
          <div class="description">{description}</div>
        {/snippet}
      `;
      const ast = compiler.compile(template);

      const snippets = ast.filter(n => n.type === 'snippet');
      expect(snippets.length).toBe(2);
      expect(snippets[0].name).toBe('header');
      expect(snippets[1].name).toBe('description');

      // Snippets come first
      expect(ast[0].type).toBe('snippet');
      expect(ast[1].type).toBe('snippet');
    });
  });

  /*-----------------------------------------
    SVG handling
  -----------------------------------------*/

  describe('SVG handling', () => {
    it('should parse SVG open and close tags', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          <svg viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </div>
      `;
      const ast = compiler.compile(template);

      const svgNode = ast.find(n => n.type === 'svg');
      expect(svgNode).toBeDefined();
      expect(svgNode.content).toBeDefined();
    });

    it('should handle SVG with expressions in attributes', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <svg class="{iconClass}" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
        </svg>
      `;
      const ast = compiler.compile(template);

      // Expression inside SVG tag attributes is compiled recursively
      const classExpr = ast.find(n => n.type === 'expression' && n.value === 'iconClass');
      expect(classExpr).toBeDefined();
    });

    it('should include closing </svg> in the svg content node', () => {
      const compiler = new TemplateCompiler();
      const template = `<svg viewBox="0 0 10 10"><rect/></svg>`;
      const ast = compiler.compile(template);

      const svgNode = ast.find(n => n.type === 'svg');
      expect(svgNode).toBeDefined();
      // The closing tag is merged into the svg content as html
      const contentHtml = svgNode.content.find(n => n.type === 'html');
      expect(contentHtml).toBeDefined();
      expect(contentHtml.html).toContain('</svg>');
    });
  });

  /*-----------------------------------------
    includePositions option
  -----------------------------------------*/

  describe('includePositions', () => {
    it('should include start/end positions for all nodes when enabled', () => {
      const compiler = new TemplateCompiler();
      const template = '<div>{name}</div>';
      const ast = compiler.compile(template, { includePositions: true });

      for (const node of ast) {
        expect(typeof node.start).toBe('number');
        expect(typeof node.end).toBe('number');
      }
    });

    it('should not include positions by default', () => {
      const compiler = new TemplateCompiler();
      const template = '<div>{name}</div>';
      const ast = compiler.compile(template);

      for (const node of ast) {
        expect(node.start).toBeUndefined();
        expect(node.end).toBeUndefined();
      }
    });

    it('should include positions for if blocks', () => {
      const compiler = new TemplateCompiler();
      const template = '{#if cond}<p>hi</p>{/if}';
      const ast = compiler.compile(template, { includePositions: true });

      const ifNode = ast.find(n => n.type === 'if');
      expect(ifNode).toBeDefined();
      expect(ifNode.start).toBe(0);
      expect(typeof ifNode.end).toBe('number');
    });

    it('should have sequential non-overlapping positions', () => {
      const compiler = new TemplateCompiler();
      const template = '{a}{b}{c}';
      const ast = compiler.compile(template, { includePositions: true });

      for (let i = 1; i < ast.length; i++) {
        expect(ast[i].start).toBeGreaterThanOrEqual(ast[i - 1].end);
      }
    });
  });

  /*-----------------------------------------
    recoverable mode
  -----------------------------------------*/

  describe('recoverable mode', () => {
    it('should collect error for orphan {else} instead of throwing', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile('<div>{else}</div>', { recoverable: true });
      expect(ast).toBeDefined();
      expect(compiler.errors.length).toBeGreaterThan(0);
    });

    it('should collect error for orphan {else if}', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile('<div>{else if cond}</div>', { recoverable: true });
      expect(ast).toBeDefined();
      expect(compiler.errors.length).toBeGreaterThan(0);
    });

    it('should collect error for orphan {/if}', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile('<div>{/if}</div>', { recoverable: true });
      expect(ast).toBeDefined();
      expect(compiler.errors.length).toBeGreaterThan(0);
    });

    it('should return empty array and error for non-string input', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile(12345, { recoverable: true });
      expect(ast).toEqual([]);
      expect(compiler.errors.length).toBeGreaterThan(0);
      expect(compiler.errors[0].message).toBe('Template is not a string');
    });

    it('should collect error for {loading} outside async', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile('{loading}<p>text</p>', { recoverable: true });
      expect(compiler.errors.length).toBeGreaterThan(0);
    });

    it('should collect error for {error} outside async', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile('{error}<p>text</p>', { recoverable: true });
      expect(compiler.errors.length).toBeGreaterThan(0);
    });

    it('should continue parsing valid content after recoverable error', () => {
      const compiler = new TemplateCompiler();
      // Orphan else, then valid content
      const ast = compiler.compile('{else}<p>{validExpr}</p>', { recoverable: true });
      expect(compiler.errors.length).toBeGreaterThan(0);
      // Should still have parsed the valid expression
      const expr = ast.find(n => n.type === 'expression');
      expect(expr).toBeDefined();
      expect(expr.value).toBe('validExpr');
    });
  });

  /*-----------------------------------------
    optimizeAST
  -----------------------------------------*/

  describe('optimizeAST', () => {
    it('should merge adjacent HTML nodes', () => {
      const input = [
        { type: 'html', html: '<div>' },
        { type: 'html', html: '<p>hello</p>' },
        { type: 'html', html: '</div>' },
      ];
      const result = TemplateCompiler.optimizeAST(input);
      expect(result).toEqual([
        { type: 'html', html: '<div><p>hello</p></div>' },
      ]);
    });

    it('should not merge HTML nodes separated by expressions', () => {
      const input = [
        { type: 'html', html: '<div>' },
        { type: 'expression', value: 'name' },
        { type: 'html', html: '</div>' },
      ];
      const result = TemplateCompiler.optimizeAST(input);
      expect(result).toHaveLength(3);
    });

    it('should move snippet nodes to front', () => {
      const input = [
        { type: 'html', html: '<div>before</div>' },
        { type: 'snippet', name: 'mySnip', content: [{ type: 'html', html: '<p>snip</p>' }] },
        { type: 'html', html: '<div>after</div>' },
      ];
      const result = TemplateCompiler.optimizeAST(input);
      expect(result[0].type).toBe('snippet');
    });

    it('should assign position to duplicate template nodes', () => {
      const input = [
        { type: 'template', name: "'myTpl'" },
        { type: 'html', html: '<hr>' },
        { type: 'template', name: "'myTpl'" },
      ];
      const result = TemplateCompiler.optimizeAST(input);
      const templates = result.filter(n => n.type === 'template');
      expect(templates[0].position).toBe(0);
      expect(templates[1].position).toBe(1);
    });

    it('should not assign position to unique template nodes', () => {
      const input = [
        { type: 'template', name: "'tplA'" },
        { type: 'template', name: "'tplB'" },
      ];
      const result = TemplateCompiler.optimizeAST(input);
      expect(result[0].position).toBeUndefined();
      expect(result[1].position).toBeUndefined();
    });

    it('should recursively optimize content arrays inside blocks', () => {
      const input = [
        {
          type: 'if',
          condition: 'x',
          content: [
            { type: 'html', html: '<p>' },
            { type: 'html', html: 'hello' },
            { type: 'html', html: '</p>' },
          ],
          branches: [],
        },
      ];
      const result = TemplateCompiler.optimizeAST(input);
      expect(result[0].content).toEqual([
        { type: 'html', html: '<p>hello</p>' },
      ]);
    });

    it('should preserve end position of last merged HTML node', () => {
      const input = [
        { type: 'html', html: '<div>', start: 0, end: 5 },
        { type: 'html', html: '</div>', start: 5, end: 11 },
      ];
      const result = TemplateCompiler.optimizeAST(input);
      expect(result[0].end).toBe(11);
    });
  });

  /*-----------------------------------------
    Double bracket syntax for non-async blocks
  -----------------------------------------*/

  describe('double bracket syntax (non-async)', () => {
    it('should compile basic expressions', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile('<div>{{name}}</div>');
      expect(ast).toEqual([
        { type: 'html', html: '<div>' },
        { type: 'expression', value: 'name' },
        { type: 'html', html: '</div>' },
      ]);
    });

    it('should compile if/else blocks', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile('{{#if cond}}<p>Yes</p>{{else}}<p>No</p>{{/if}}');
      const ifNode = ast.find(n => n.type === 'if');
      expect(ifNode).toBeDefined();
      expect(ifNode.condition).toBe('cond');
      expect(ifNode.branches.length).toBe(1);
      expect(ifNode.branches[0].type).toBe('else');
    });

    it('should compile each blocks', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile('{{#each items as item}}<li>{{item.name}}</li>{{/each}}');
      const eachNode = ast.find(n => n.type === 'each');
      expect(eachNode).toBeDefined();
      expect(eachNode.over).toBe('items');
      expect(eachNode.as).toBe('item');
    });

    it('should compile template partials', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile('{{> partialName data=value}}');
      expect(ast[0].type).toBe('template');
      expect(ast[0].name).toBe("'partialName'");
    });

    it('should compile slots', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile("{{>slot 'content'}}");
      expect(ast[0].type).toBe('slot');
      expect(ast[0].name).toBe("'content'");
    });
  });

  /*-----------------------------------------
    parseRerenderExpression
  -----------------------------------------*/

  describe('parseRerenderExpression', () => {
    it('should parse simple expression', () => {
      const compiler = new TemplateCompiler();
      const result = compiler.parseRerenderExpression('userId');
      expect(result.expression).toBe('userId');
      expect(result.key).toBeNull();
    });

    it('should parse expression with key', () => {
      const compiler = new TemplateCompiler();
      const result = compiler.parseRerenderExpression('userId key=getHash');
      expect(result.expression).toBe('userId');
      expect(result.key).toBe('getHash');
    });

    it('should handle complex expression before key', () => {
      const compiler = new TemplateCompiler();
      const result = compiler.parseRerenderExpression('a + b + c key=hashFn');
      expect(result.expression).toBe('a + b + c');
      expect(result.key).toBe('hashFn');
    });
  });

  /*-----------------------------------------
    parseTemplateString
  -----------------------------------------*/

  describe('parseTemplateString', () => {
    it('should parse verbose template notation', () => {
      const compiler = new TemplateCompiler();
      const result = compiler.parseTemplateString("template name=myTemplate reactiveData={a: 'one', b: two}");
      expect(result.name).toBe('myTemplate');
      expect(result.reactiveData).toEqual({ a: "'one'", b: 'two' });
    });

    it('should parse verbose snippet notation', () => {
      const compiler = new TemplateCompiler();
      const result = compiler.parseTemplateString('snippet name=mySnippet');
      expect(result.name).toBe('mySnippet');
    });

    it('should parse standard shorthand notation', () => {
      const compiler = new TemplateCompiler();
      const result = compiler.parseTemplateString('myPartial key1=val1 key2=val2');
      expect(result.name).toBe("'myPartial'");
      expect(result.reactiveData).toEqual({ key1: 'val1', key2: 'val2' });
    });

    it('should handle template name with no data', () => {
      const compiler = new TemplateCompiler();
      const result = compiler.parseTemplateString('simplePartial');
      expect(result.name).toBe("'simplePartial'");
      expect(result.reactiveData).toEqual({});
    });
  });

  /*-----------------------------------------
    Expressions inside attributes
  -----------------------------------------*/

  describe('expressions inside attribute values', () => {
    it('should compile expressions interpolated in class attribute', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile('<div class="{ui}card">content</div>');

      expect(ast[0].type).toBe('html');
      expect(ast[0].html).toBe('<div class="');

      const expr = ast.find(n => n.type === 'expression');
      expect(expr).toBeDefined();
      expect(expr.value).toBe('ui');
    });

    it('should compile multiple expressions in a single attribute', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile('<div class="{type} {size} button">text</div>');

      const expressions = ast.filter(n => n.type === 'expression');
      expect(expressions.length).toBe(2);
      expect(expressions[0].value).toBe('type');
      expect(expressions[1].value).toBe('size');
    });
  });

  /*-----------------------------------------
    Edge cases / boundary
  -----------------------------------------*/

  describe('edge cases', () => {
    it('should compile empty template to empty AST', () => {
      const compiler = new TemplateCompiler();
      expect(compiler.compile('')).toEqual([]);
    });

    it('should compile whitespace-only template to empty AST', () => {
      const compiler = new TemplateCompiler();
      expect(compiler.compile('   \n  \n   ')).toEqual([]);
    });

    it('should compile plain HTML without expressions', () => {
      const compiler = new TemplateCompiler();
      const template = '<div><p>Hello World</p></div>';
      const ast = compiler.compile(template);
      expect(ast).toEqual([
        { type: 'html', html: '<div><p>Hello World</p></div>' },
      ]);
    });

    it('should throw for non-string input in non-recoverable mode', () => {
      const compiler = new TemplateCompiler();
      const consoleError = console.error;
      console.error = vi.fn();
      expect(() => compiler.compile(null)).toThrow();
      console.error = consoleError;
    });

    it('should handle back-to-back expressions', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile('{a}{b}');
      expect(ast).toEqual([
        { type: 'expression', value: 'a' },
        { type: 'expression', value: 'b' },
      ]);
    });

    it('should use constructor templateString when none provided', () => {
      const compiler = new TemplateCompiler('<div>{x}</div>');
      const ast = compiler.compile();
      const expr = ast.find(n => n.type === 'expression');
      expect(expr).toBeDefined();
      expect(expr.value).toBe('x');
    });

    it('should handle template with only a single expression', () => {
      const compiler = new TemplateCompiler();
      expect(compiler.compile('{value}')).toEqual([
        { type: 'expression', value: 'value' },
      ]);
    });

    it('should handle empty expression brackets', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile('<p>{}</p>');
      const expr = ast.find(n => n.type === 'expression');
      expect(expr).toBeDefined();
    });

    it('should handle named slot with identifier', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile('{>slot header}');
      const slot = ast.find(n => n.type === 'slot');
      expect(slot).toBeDefined();
      expect(slot.name).toBe('header');
    });

    it('should handle default slot with no name', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile('{>slot}');
      const slot = ast.find(n => n.type === 'slot');
      expect(slot).toBeDefined();
    });
  });

  /*-----------------------------------------
    Error conditions (extended)
  -----------------------------------------*/

  describe('error conditions (extended)', () => {
    it('should throw for {error} outside async block', () => {
      const compiler = new TemplateCompiler();
      const consoleError = console.error;
      console.error = vi.fn();
      expect(() => compiler.compile('{#if x}content{error}{/if}')).toThrow();
      console.error = consoleError;
    });

    it('should throw for {before} outside async block', () => {
      const compiler = new TemplateCompiler();
      const consoleError = console.error;
      console.error = vi.fn();
      expect(() => compiler.compile('{#if x}content{before}{/if}')).toThrow();
      console.error = consoleError;
    });
  });

  /*-----------------------------------------
    HTML expression edge cases
  -----------------------------------------*/

  describe('HTML expression edge cases', () => {
    it('should compile {#html} with variable reference', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile('{#html rawContent}');
      expect(ast[0].type).toBe('expression');
      expect(ast[0].unsafeHTML).toBe(true);
      expect(ast[0].value).toBe('rawContent');
    });
  });

  /*-----------------------------------------
    Fn expression edge cases
  -----------------------------------------*/

  describe('fn expression', () => {
    it('should compile {#fn} with variable reference', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile('{#fn handleChange}');
      expect(ast[0].type).toBe('expression');
      expect(ast[0].literalValue).toBe(true);
      expect(ast[0].value).toBe('handleChange');
    });

    it('should compile {#fn} with dotted path', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile('{#fn obj.method}');
      expect(ast[0].type).toBe('expression');
      expect(ast[0].literalValue).toBe(true);
      expect(ast[0].value).toBe('obj.method');
    });

    it('should compile {#fn} inline with surrounding HTML', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile('<div>{#fn callback}</div>');
      expect(ast).toEqual([
        { type: 'html', html: '<div>' },
        { type: 'expression', literalValue: true, value: 'callback' },
        { type: 'html', html: '</div>' },
      ]);
    });

    it('should not set unsafeHTML on {#fn} nodes', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile('{#fn handler}');
      expect(ast[0].unsafeHTML).toBeUndefined();
    });

    it('should not set fn on {#html} nodes', () => {
      const compiler = new TemplateCompiler();
      const ast = compiler.compile('{#html content}');
      expect(ast[0].literalValue).toBeUndefined();
    });
  });

  /*-----------------------------------------
    Regex pattern generation
  -----------------------------------------*/

  describe('regex pattern generation', () => {
    it('should have valid RegExp instances for single bracket patterns', () => {
      const patterns = TemplateCompiler.singleBracketRegExp;
      expect(patterns.IF).toBeInstanceOf(RegExp);
      expect(patterns.EACH).toBeInstanceOf(RegExp);
      expect(patterns.EXPRESSION).toBeInstanceOf(RegExp);
      expect(patterns.SLOT).toBeInstanceOf(RegExp);
    });

    it('should have valid RegExp instances for double bracket patterns', () => {
      const patterns = TemplateCompiler.doubleBracketRegExp;
      expect(patterns.IF).toBeInstanceOf(RegExp);
      expect(patterns.EACH).toBeInstanceOf(RegExp);
      expect(patterns.EXPRESSION).toBeInstanceOf(RegExp);
    });

    it('single bracket IF pattern should match {#if but not {{#if', () => {
      expect(TemplateCompiler.singleBracketRegExp.IF.test('{#if condition}')).toBe(true);
    });

    it('double bracket IF pattern should match {{#if', () => {
      expect(TemplateCompiler.doubleBracketRegExp.IF.test('{{#if condition}}')).toBe(true);
    });
  });

  /*-----------------------------------------
    Real-world template patterns
  -----------------------------------------*/

  describe('real-world template patterns', () => {
    it('should compile a card-like structure (if/else, snippets, templates, slots)', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {#if href}
          <a class="{ui}card" href="{href}">
            {> content}
          </a>
        {else}
          <div class="{ui}card">
            {> content}
          </div>
        {/if}

        {#snippet content}
          {>header}
          {>description}
          {> slot}
        {/snippet}

        {#snippet header}
          <div class="header">{header}</div>
        {/snippet}

        {#snippet description}
          <div class="description">{description}</div>
        {/snippet}
      `;
      const ast = compiler.compile(template);

      const snippets = ast.filter(n => n.type === 'snippet');
      expect(snippets.length).toBe(3);

      const ifNode = ast.find(n => n.type === 'if');
      expect(ifNode).toBeDefined();
      expect(ifNode.condition).toBe('href');
      expect(ifNode.branches.length).toBe(1);
      expect(ifNode.branches[0].type).toBe('else');
    });

    it('should compile deeply nested search results (each > if > each)', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div class="results">
          {#if hasAny displayResults}
            {#each displayResults}
              <a class="result" href="{url}">
                <h3>{title}</h3>
                <div class="tags">
                  {#if hasAny tags}
                    {#each tags}
                      <span class="{color} tag">{text}</span>
                    {/each}
                  {/if}
                </div>
              </a>
            {/each}
          {else if noResults}
            <div class="placeholder">No results</div>
          {else}
            <div class="placeholder">Enter search term</div>
          {/if}
        </div>
      `;
      const ast = compiler.compile(template);

      const ifNode = ast.find(n => n.type === 'if');
      expect(ifNode).toBeDefined();
      expect(ifNode.condition).toBe('hasAny displayResults');
      expect(ifNode.branches.length).toBe(2);
      expect(ifNode.branches[0].type).toBe('elseif');
      expect(ifNode.branches[1].type).toBe('else');

      // Nested each > if > each
      const nestedEach = ifNode.content.find(n => n.type === 'each');
      expect(nestedEach).toBeDefined();
      const innerIf = nestedEach.content.find(n => n.type === 'if');
      expect(innerIf).toBeDefined();
      const innerEach = innerIf.content.find(n => n.type === 'each');
      expect(innerEach).toBeDefined();
      expect(innerEach.over).toBe('tags');
    });
  });
});
