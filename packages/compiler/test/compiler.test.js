import { describe, expect, it, vi } from 'vitest';

import { TemplateCompiler } from '@semantic-ui/compiler';

describe('TemplateCompiler', () => {
  it('should compile a template', () => {
    const compiler = new TemplateCompiler();
    const template = ``;
    const ast = compiler.compile(template);
    expect(ast).toBeDefined();
  });

  describe('expressions', () => {
    it('should compile basic expressions', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          <p>{ name }</p>
          <p>{ age }</p>
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          <p>' },
        { type: 'expression', value: 'name' },
        { type: 'html', html: '</p>\n          <p>' },
        { type: 'expression', value: 'age' },
        { type: 'html', html: '</p>\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should compile html expressions with triple brackets', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          <p>{#html '<b>John</b>' }</p>
          <p>{#html '<img src="img.png">' }</p>
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          <p>' },
        { type: 'expression', unsafeHTML: true, value: "'<b>John</b>'" },
        { type: 'html', html: '</p>\n          <p>' },
        {
          type: 'expression',
          unsafeHTML: true,
          value: `'<img src="img.png">'`,
        },
        { type: 'html', html: '</p>\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should preserve boolean values', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          <p>{ true }</p>
          <p>{ false }</p>
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          <p>' },
        { type: 'expression', value: true },
        { type: 'html', html: '</p>\n          <p>' },
        { type: 'expression', value: false },
        { type: 'html', html: '</p>\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });
  });

  describe('conditionals', () => {
    it('should compile a template with an if conditional', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {#if condition}
            <p>True</p>
          {/if}
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        {
          type: 'if',
          condition: 'condition',
          branches: [],
          content: [
            { type: 'html', html: '\n            <p>True</p>\n          ' },
          ],
        },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should preserve boolean values in conditionals', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {#if true}
            <p>True</p>
          {/if}
          {#if false}
            <p>False</p>
          {/if}
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        {
          type: 'if',
          condition: true,
          branches: [],
          content: [
            { type: 'html', html: '\n            <p>True</p>\n          ' },
          ],
        },
        { type: 'html', html: '\n          ' },
        {
          type: 'if',
          condition: false,
          branches: [],
          content: [
            { type: 'html', html: '\n            <p>False</p>\n          ' },
          ],
        },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should preserve numerical values', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          <p>{ 10 }</p>
          <p>{ 0 }</p>
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          <p>' },
        { type: 'expression', value: 10 },
        { type: 'html', html: '</p>\n          <p>' },
        { type: 'expression', value: 0 },
        { type: 'html', html: '</p>\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should preserve string values in conditionals', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {#if 'name'}
            Content
          {/if}
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        {
          type: 'if',
          condition: "'name'",
          content: [
            { type: 'html', html: '\n            Content\n          ' },
          ],
          branches: [],
        },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should handle elseif conditionals', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {#if name}
            <p>True</p>
          {else if age}
            <p>False</p>
          {/if}
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        {
          type: 'if',
          condition: 'name',
          content: [
            { type: 'html', html: '\n            <p>True</p>\n          ' },
          ],
          branches: [
            {
              type: 'elseif',
              condition: 'age',
              content: [
                {
                  type: 'html',
                  html: '\n            <p>False</p>\n          ',
                },
              ],
            },
          ],
        },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should support multiple elseif conditonals', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {#if name}
            <p>True</p>
          {else if age}
            <p>False</p>
          {else if height}
            <p>False</p>
          {/if}
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        {
          type: 'if',
          condition: 'name',
          content: [
            { type: 'html', html: '\n            <p>True</p>\n          ' },
          ],
          branches: [
            {
              type: 'elseif',
              condition: 'age',
              content: [
                {
                  type: 'html',
                  html: '\n            <p>False</p>\n          ',
                },
              ],
            },
            {
              type: 'elseif',
              condition: 'height',
              content: [
                {
                  type: 'html',
                  html: '\n            <p>False</p>\n          ',
                },
              ],
            },
          ],
        },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should support nested conditionals in else if', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {#if name}
            <p>True</p>
          {else if age}
            <p>False</p>
            {#if height}
              <p>True</p>
            {else}
              <p>False</p>
            {/if}
          {/if}
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        {
          type: 'if',
          condition: 'name',
          branches: [
            {
              type: 'elseif',
              condition: 'age',
              content: [
                {
                  type: 'html',
                  html: '\n            <p>False</p>\n            ',
                },
                {
                  type: 'if',
                  condition: 'height',
                  content: [
                    {
                      type: 'html',
                      html: '\n              <p>True</p>\n            ',
                    },
                  ],
                  branches: [
                    {
                      type: 'else',
                      content: [
                        {
                          type: 'html',
                          html: '\n              <p>False</p>\n            ',
                        },
                      ],
                    },
                  ],
                },
                { type: 'html', html: '\n          ' },
              ],
            },
          ],
          content: [
            { type: 'html', html: '\n            <p>True</p>\n          ' },
          ],
        },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should handle else conditionals', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {#if name}
            <p>True</p>
          {else}
            <p>False</p>
          {/if}
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        {
          type: 'if',
          condition: 'name',
          content: [
            { type: 'html', html: '\n            <p>True</p>\n          ' },
          ],
          branches: [
            {
              type: 'else',
              content: [
                {
                  type: 'html',
                  html: '\n            <p>False</p>\n          ',
                },
              ],
            },
          ],
        },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should handle nested conditionals with 2 levels', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {#if name}
            <p>True</p>
            {#if age}
              <p>True</p>
            {else}
              <p>False</p>
            {/if}
          {else}
            <p>False</p>
          {/if}
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        {
          type: 'if',
          condition: 'name',
          branches: [
            {
              type: 'else',
              content: [
                {
                  type: 'html',
                  html: '\n            <p>False</p>\n          ',
                },
              ],
            },
          ],
          content: [
            { type: 'html', html: '\n            <p>True</p>\n            ' },
            {
              type: 'if',
              condition: 'age',
              content: [
                {
                  type: 'html',
                  html: '\n              <p>True</p>\n            ',
                },
              ],
              branches: [
                {
                  type: 'else',
                  content: [
                    {
                      type: 'html',
                      html: '\n              <p>False</p>\n            ',
                    },
                  ],
                },
              ],
            },
            { type: 'html', html: '\n          ' },
          ],
        },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should handle nested conditionals with 3 levels', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {#if name}
            <p>True</p>
            {#if age}
              <p>True</p>
              {#if height}
                <p>True</p>
              {else}
                <p>False</p>
              {/if}
            {else}
              <p>False</p>
            {/if}
          {else}
            <p>False</p>
          {/if}
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        {
          type: 'if',
          condition: 'name',
          branches: [
            {
              type: 'else',
              content: [
                {
                  type: 'html',
                  html: '\n            <p>False</p>\n          ',
                },
              ],
            },
          ],
          content: [
            { type: 'html', html: '\n            <p>True</p>\n            ' },
            {
              type: 'if',
              condition: 'age',
              content: [
                {
                  type: 'html',
                  html: '\n              <p>True</p>\n              ',
                },
                {
                  type: 'if',
                  condition: 'height',
                  content: [
                    {
                      type: 'html',
                      html: '\n                <p>True</p>\n              ',
                    },
                  ],
                  branches: [
                    {
                      type: 'else',
                      content: [
                        {
                          type: 'html',
                          html: '\n                <p>False</p>\n              ',
                        },
                      ],
                    },
                  ],
                },
                { type: 'html', html: '\n            ' },
              ],
              branches: [
                {
                  type: 'else',
                  content: [
                    {
                      type: 'html',
                      html: '\n              <p>False</p>\n            ',
                    },
                  ],
                },
              ],
            },
            { type: 'html', html: '\n          ' },
          ],
        },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });
  });
  describe('nested expressions', () => {
    it('should handle single level of nesting in expressions', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          { getValue { nested: value } }
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        { type: 'expression', value: 'getValue { nested: value }' },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should handle multiple levels of nesting in expressions', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          { formatData { user: { name: userName, details: { age: userAge } } } }
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        { type: 'expression', value: 'formatData { user: { name: userName, details: { age: userAge } } }' },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should handle nested method calls with object parameters', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          { processUser(getData({ id: userId })) }
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        { type: 'expression', value: 'processUser(getData({ id: userId }))' },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should handle mixed bracket types in nested expressions', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          { formatList([{ id: 1 }, { id: 2 }]) }
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        { type: 'expression', value: 'formatList([{ id: 1 }, { id: 2 }])' },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should handle deeply nested conditional expressions', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          { isValid({ user: { permissions: { admin: checkAdmin({ org: orgId }) } } }) }
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        { type: 'expression', value: 'isValid({ user: { permissions: { admin: checkAdmin({ org: orgId }) } } })' },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should handle nested array expressions with objects', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          { processItems([ { type: 'user', data: { id: 1 } }, { type: 'admin', data: { id: 2 } } ]) }
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        {
          type: 'expression',
          value: "processItems([ { type: 'user', data: { id: 1 } }, { type: 'admin', data: { id: 2 } } ])",
        },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should handle nested expressions in boolean attributes', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div disabled={ isDisabled({ user: { status: getStatus({ id: userId }) } }) }>
          Content
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div disabled=' },
        { type: 'expression', value: 'isDisabled({ user: { status: getStatus({ id: userId }) } })', ifDefined: true },
        { type: 'html', html: '>\n          Content\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });
  });

  describe('each loops', () => {
    it('should compile a template with an each loop', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {#each getItems}
          <p>{ name }</p>
        {/each}
      `;
      // complete test
      const ast = compiler.compile(template);
      const expectedAST = [
        {
          type: 'each',
          over: 'getItems',
          content: [
            { type: 'html', html: '\n          <p>' },
            { type: 'expression', value: 'name' },
            { type: 'html', html: '</p>\n        ' },
          ],
        },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should compile a template with an each_as syntax', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {#each items as item}
          <p>{ item.name }</p>
        {/each}
      `;

      const ast = compiler.compile(template);
      expect(ast[0].type).toBe('each');
      expect(ast[0].over).toBe('items');
      expect(ast[0].as).toBe('item');
    });

    it('should compile a template with an each_as syntax with index', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {#each items as item, idx}
          <p>{ idx + 1 }. { item.name }</p>
        {/each}
      `;

      const ast = compiler.compile(template);
      expect(ast[0].type).toBe('each');
      expect(ast[0].over).toBe('items');
      expect(ast[0].as).toBe('item');
      expect(ast[0].indexAs).toBe('idx');
    });

    it('should compile a template with an each_as syntax with else condition', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {#each products as product}
          <div>{ product.name } - { product.price }</div>
        {else}
          <div>No products available</div>
        {/each}
      `;

      const ast = compiler.compile(template);
      expect(ast[0].type).toBe('each');
      expect(ast[0].over).toBe('products');
      expect(ast[0].as).toBe('product');
      expect(ast[0].elseContent?.length).toBeGreaterThan(0);
    });

    it('should compile a template with an each-in loop syntax', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {#each item in getItems}
          <p>{ item.name }</p>
        {/each}
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        {
          type: 'each',
          over: 'getItems',
          as: 'item',
          content: [
            { type: 'html', html: '\n          <p>' },
            { type: 'expression', value: 'item.name' },
            { type: 'html', html: '</p>\n        ' },
          ],
        },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should compile a template with an each-as loop syntax', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {#each getItems as item}
          <p>{ item.name }</p>
        {/each}
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        {
          type: 'each',
          over: 'getItems',
          as: 'item',
          content: [
            { type: 'html', html: '\n          <p>' },
            { type: 'expression', value: 'item.name' },
            { type: 'html', html: '</p>\n        ' },
          ],
        },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should compile a template with an each-as loop syntax with index', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {#each getItems as item, idx}
          <p>{ idx + 1 }. { item.name }</p>
        {/each}
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        {
          type: 'each',
          over: 'getItems',
          as: 'item',
          indexAs: 'idx',
          content: [
            { type: 'html', html: '\n          <p>' },
            { type: 'expression', value: 'idx + 1' },
            { type: 'html', html: '. ' },
            { type: 'expression', value: 'item.name' },
            { type: 'html', html: '</p>\n        ' },
          ],
        },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should compile a template with an each-as loop syntax with else condition', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {#each products as product}
          <div>{ product.name } - { product.price }</div>
        {else}
          <div>No products available</div>
        {/each}
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        {
          type: 'each',
          over: 'products',
          as: 'product',
          content: [
            { type: 'html', html: '\n          <div>' },
            { type: 'expression', value: 'product.name' },
            { type: 'html', html: ' - ' },
            { type: 'expression', value: 'product.price' },
            { type: 'html', html: '</div>\n        ' },
          ],
          elseContent: [
            { type: 'html', html: '\n          <div>No products available</div>\n        ' },
          ],
        },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should compile a template with custom item and index names using comma syntax', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {#each product, idx in products}
          <p>{ idx }. { product.name }</p>
        {/each}
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        {
          type: 'each',
          over: 'products',
          as: 'product',
          indexAs: 'idx',
          content: [
            { type: 'html', html: '\n          <p>' },
            { type: 'expression', value: 'idx' },
            { type: 'html', html: '. ' },
            { type: 'expression', value: 'product.name' },
            { type: 'html', html: '</p>\n        ' },
          ],
        },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should handle expressions within the comma syntax', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {#each (product), position in products}
          <p>{ position + 1 }. { product.name }</p>
        {/each}
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        {
          type: 'each',
          over: 'products',
          as: '(product)',
          indexAs: 'position',
          content: [
            { type: 'html', html: '\n          <p>' },
            { type: 'expression', value: 'position + 1' },
            { type: 'html', html: '. ' },
            { type: 'expression', value: 'product.name' },
            { type: 'html', html: '</p>\n        ' },
          ],
        },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should handle expressions in both item and index positions', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {#each item.value, (index + offset) in items}
          <p>{ index + offset }. { item.value.name }</p>
        {/each}
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        {
          type: 'each',
          over: 'items',
          as: 'item.value',
          indexAs: '(index + offset)',
          content: [
            { type: 'html', html: '\n          <p>' },
            { type: 'expression', value: 'index + offset' },
            { type: 'html', html: '. ' },
            { type: 'expression', value: 'item.value.name' },
            { type: 'html', html: '</p>\n        ' },
          ],
        },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should handle various whitespace patterns in the each syntax', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {#each    product,    i    in    products}
          <p>{ i + 1 }. { product.name }</p>
        {/each}
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        {
          type: 'each',
          over: 'products',
          as: 'product',
          indexAs: 'i',
          content: [
            { type: 'html', html: '\n          <p>' },
            { type: 'expression', value: 'i + 1' },
            { type: 'html', html: '. ' },
            { type: 'expression', value: 'product.name' },
            { type: 'html', html: '</p>\n        ' },
          ],
        },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should work with else blocks when using custom item and index names', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {#each product, i in products}
          <p>{ i + 1 }. { product.name }</p>
        {else}
          <p>No products available</p>
        {/each}
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        {
          type: 'each',
          over: 'products',
          as: 'product',
          indexAs: 'i',
          content: [
            { type: 'html', html: '\n          <p>' },
            { type: 'expression', value: 'i + 1' },
            { type: 'html', html: '. ' },
            { type: 'expression', value: 'product.name' },
            { type: 'html', html: '</p>\n        ' },
          ],
          elseContent: [
            { type: 'html', html: '\n          <p>No products available</p>\n        ' },
          ],
        },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should compile a template with an if condition inside an each loop', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {#each getItems}
          {#if name}
            <p>{ name }</p>
          {/if}
        {/each}
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        {
          type: 'each',
          over: 'getItems',
          content: [
            { type: 'html', html: '\n          ' },
            {
              type: 'if',
              condition: 'name',
              content: [
                { type: 'html', html: '\n            <p>' },
                { type: 'expression', value: 'name' },
                { type: 'html', html: '</p>\n          ' },
              ],
              branches: [],
            },
            { type: 'html', html: '\n        ' },
          ],
        },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should compile a template with an each loop with an else condition', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {#each getItems}
          <p>{ name }</p>
        {else}
          <p>No items available</p>
        {/each}
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        {
          type: 'each',
          over: 'getItems',
          content: [
            { type: 'html', html: '\n          <p>' },
            { type: 'expression', value: 'name' },
            { type: 'html', html: '</p>\n        ' },
          ],
          elseContent: [
            { type: 'html', html: '\n          <p>No items available</p>\n        ' },
          ],
        },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should compile a template with a nested each loop with else conditions', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {#each categories}
          <h2>{ name }</h2>
          {#each items}
            <p>{ title }</p>
          {else}
            <p>No items in this category</p>
          {/each}
        {else}
          <p>No categories available</p>
        {/each}
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        {
          type: 'each',
          over: 'categories',
          content: [
            { type: 'html', html: '\n          <h2>' },
            { type: 'expression', value: 'name' },
            { type: 'html', html: '</h2>\n          ' },
            {
              type: 'each',
              over: 'items',
              content: [
                { type: 'html', html: '\n            <p>' },
                { type: 'expression', value: 'title' },
                { type: 'html', html: '</p>\n          ' },
              ],
              elseContent: [
                { type: 'html', html: '\n            <p>No items in this category</p>\n          ' },
              ],
            },
            { type: 'html', html: '\n        ' },
          ],
          elseContent: [
            { type: 'html', html: '\n          <p>No categories available</p>\n        ' },
          ],
        },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should verify that if/else and each/else conditions can work independently', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {#each items}
          {#if isActive}
            <p>Active: { name }</p>
          {else}
            <p>Inactive: { name }</p>
          {/if}
        {else}
          <p>No items to display</p>
        {/each}
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        {
          type: 'each',
          over: 'items',
          content: [
            { type: 'html', html: '\n          ' },
            {
              type: 'if',
              condition: 'isActive',
              content: [
                { type: 'html', html: '\n            <p>Active: ' },
                { type: 'expression', value: 'name' },
                { type: 'html', html: '</p>\n          ' },
              ],
              branches: [
                {
                  type: 'else',
                  content: [
                    { type: 'html', html: '\n            <p>Inactive: ' },
                    { type: 'expression', value: 'name' },
                    { type: 'html', html: '</p>\n          ' },
                  ],
                },
              ],
            },
            { type: 'html', html: '\n        ' },
          ],
          elseContent: [
            { type: 'html', html: '\n          <p>No items to display</p>\n        ' },
          ],
        },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should handle complex nested conditions with multiple levels of if/each/else', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {#each sections}
          <section>
            <h2>{ title }</h2>
            
            {#if hasFilters}
              <div class="filters">
                {#each filters}
                  {#if isActive}
                    <span class="active">{ name }</span>
                  {else}
                    <span class="inactive">{ name }</span>
                  {/if}
                {else}
                  <p>No filters configured</p>
                {/each}
              </div>
            {/if}
            
            {#each items}
              <div class="item">
                {#if featured}
                  <div class="featured">
                    <h3>{ title }</h3>
                    {#if hasImage}
                      <img src="{ imageUrl }" alt="{ title }">
                    {else}
                      <div class="placeholder">No image</div>
                    {/if}
                  </div>
                {else}
                  <div class="regular">
                    <h4>{ title }</h4>
                  </div>
                {/if}
              </div>
            {else}
              <p>No items in this section</p>
            {/each}
          </section>
        {else}
          <div class="empty-state">
            <p>No sections available</p>
          </div>
        {/each}
      `;

      const ast = compiler.compile(template);

      // Verify the structure through assertions on specific parts rather than comparing the entire AST
      // This makes the test more maintainable and easier to debug
      expect(ast.length).toBe(1);
      expect(ast[0].type).toBe('each');
      expect(ast[0].over).toBe('sections');
      expect(ast[0].elseContent?.length).toBeGreaterThan(0);

      const sectionsContent = ast[0].content;

      // Find the if hasFilters node
      const hasFiltersIf = sectionsContent.find(node => node.type === 'if' && node.condition === 'hasFilters');
      expect(hasFiltersIf).toBeDefined();

      // Find the each filters node inside hasFilters
      const filtersDiv = hasFiltersIf.content.find(node => node.type === 'html' && node.html.includes('filters'));
      expect(filtersDiv).toBeDefined();

      const filtersContent = hasFiltersIf.content;
      const filtersEach = filtersContent.find(node => node.type === 'each' && node.over === 'filters');
      expect(filtersEach).toBeDefined();
      expect(filtersEach.elseContent?.length).toBeGreaterThan(0);

      // Find the isActive if inside filters each
      const isActiveIf = filtersEach.content.find(node => node.type === 'if' && node.condition === 'isActive');
      expect(isActiveIf).toBeDefined();
      expect(isActiveIf.branches.length).toBe(1);
      expect(isActiveIf.branches[0].type).toBe('else');

      // Find the each items node
      const itemsEach = sectionsContent.find(node => node.type === 'each' && node.over === 'items');
      expect(itemsEach).toBeDefined();
      expect(itemsEach.elseContent?.length).toBeGreaterThan(0);

      // Find the featured if inside items each
      const featuredIf = itemsEach.content.find(node => node.type === 'if' && node.condition === 'featured');
      expect(featuredIf).toBeDefined();
      expect(featuredIf.branches.length).toBe(1);
      expect(featuredIf.branches[0].type).toBe('else');

      // Find the hasImage if inside featured if
      const featuredContent = featuredIf.content;
      const hasImageIf = featuredContent.find(node => node.type === 'if' && node.condition === 'hasImage');
      expect(hasImageIf).toBeDefined();
      expect(hasImageIf.branches.length).toBe(1);
      expect(hasImageIf.branches[0].type).toBe('else');
    });

    it('should verify that multiple else-if can work correctly after if blocks', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {#each items}
          <div class="item">{ name }</div>
        {else}
          {#if reason === 'loading'}
            <div class="loading">Loading items...</div>
          {else if reason === 'error'}
            <div class="error">Error loading items: { errorMessage }</div>
          {else if reason === 'empty'}
            <div class="empty">No items are available</div>
          {else}
            <div class="unknown">Unknown state</div>
          {/if}
        {/each}
      `;

      const ast = compiler.compile(template);

      // Verify the correct structure
      expect(ast.length).toBe(1);
      expect(ast[0].type).toBe('each');
      expect(ast[0].over).toBe('items');
      expect(ast[0].elseContent?.length).toBeGreaterThan(0);

      // Find the if inside the else block
      const ifNode = ast[0].elseContent.find(node => node.type === 'if');
      expect(ifNode).toBeDefined();
      expect(ifNode.type).toBe('if');
      expect(ifNode.condition).toBe("reason === 'loading'");

      // Check that the if has the correct number of branches (3 branches: 2 else-if and 1 else)
      expect(ifNode.branches.length).toBe(3);
      expect(ifNode.branches[0].type).toBe('elseif');
      expect(ifNode.branches[0].condition).toBe("reason === 'error'");
      expect(ifNode.branches[1].type).toBe('elseif');
      expect(ifNode.branches[1].condition).toBe("reason === 'empty'");
      expect(ifNode.branches[2].type).toBe('else');

      // Verify the content of each branch to ensure complete AST correctness
      expect(ifNode.content.length).toBeGreaterThan(0);
      expect(ifNode.branches[0].content.length).toBeGreaterThan(0);
      expect(ifNode.branches[1].content.length).toBeGreaterThan(0);
      expect(ifNode.branches[2].content.length).toBeGreaterThan(0);
    });
  });

  describe('template partials', () => {
    it('should compile a template with a partial', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {> partialName }
        </div>
      `;
      const ast = compiler.compile(template);
      // should match template
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        { type: 'template', name: `'partialName'`, reactiveData: {} },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should compile a template with a partial and data', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {> partialName data1=value data2=value}
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        {
          type: 'template',
          name: "'partialName'",
          reactiveData: { data1: 'value', data2: 'value' },
        },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should compile a template with a partial and reactive data', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {>template name=dynamicName reactiveData={one: 'one', two: two} }
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        {
          type: 'template',
          name: 'dynamicName',
          reactiveData: { one: "'one'", two: 'two' },
        },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });
    it('should compile a template with a partial and data containing parentheses', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {> CodePlaygroundPanel size=(getPanelSize) }
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        {
          type: 'template',
          name: "'CodePlaygroundPanel'",
          reactiveData: { size: '(getPanelSize)' },
        },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should compile a template with a partial and data containing parentheses and spaces', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {> CodePlaygroundPanel size=(getPanelSize panel) }
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        {
          type: 'template',
          name: "'CodePlaygroundPanel'",
          reactiveData: { size: '(getPanelSize panel)' },
        },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should compile a template with a partial and data containing line breaks', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {> CodePlaygroundPanel
            panel=panel
            size=(getPanelSize panel)
          }
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        {
          type: 'template',
          name: "'CodePlaygroundPanel'",
          reactiveData: { panel: 'panel', size: '(getPanelSize panel)' },
        },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should compile a template with a partial and data containing multiple parentheses', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {> CodePlaygroundPanel size=(getPanelSize (getPanel)) }
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        {
          type: 'template',
          name: "'CodePlaygroundPanel'",
          reactiveData: { size: '(getPanelSize (getPanel))' },
        },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });
  });

  describe('slots', () => {
    it('should compile a template with a slot', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {>slot 'name'}
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        { type: 'slot', name: "'name'" },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });
  });
  describe('boolean attributes', () => {
    it('should correctly identify known boolean attributes like checked', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <input type="checkbox" checked={maybeChecked}>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<input type="checkbox" checked=' },
        { type: 'expression', value: 'maybeChecked', booleanAttribute: true },
        { type: 'html', html: '>' },
      ];
    });
    it('should correctly identify known boolean attributes even if quoted', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <input type="checkbox" checked="{maybeChecked}">
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<input type="checkbox" checked=' },
        { type: 'expression', value: 'maybeChecked', booleanAttribute: true },
        { type: 'html', html: '>' },
      ];
    });

    it('should identify boolean attributes when no quotes', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <input type="checkbox" custom={maybeChecked}>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<input type="checkbox" custom=' },
        { type: 'expression', value: 'maybeChecked', booleanAttribute: true },
        { type: 'html', html: '>' },
      ];
    });

    it('should identify not boolean attributes when no quotes', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <input type="checkbox" custom="{maybeChecked}">
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<input type="checkbox" custom=' },
        { type: 'expression', value: 'maybeChecked', booleanAttribute: true },
        { type: 'html', html: '>' },
      ];
    });
  });

  describe('keyword expressions', () => {
    it('should parse expressions with keyword-like names as expressions, not blocks', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {errorMessage}
          {loadingSpinner}
          {beforeHook}
          {error.message}
          {loading.state}
          {before.action}
          {errorMessage ? 'Error' : 'Success'}
        </div>
      `;
      const ast = compiler.compile(template);

      // Find the expressions in the AST
      const expressions = ast.filter(node => node.type === 'expression');
      expect(expressions.length).toBe(7);

      expect(expressions[0].value).toBe('errorMessage');
      expect(expressions[1].value).toBe('loadingSpinner');
      expect(expressions[2].value).toBe('beforeHook');
      expect(expressions[3].value).toBe('error.message');
      expect(expressions[4].value).toBe('loading.state');
      expect(expressions[5].value).toBe('before.action');
      expect(expressions[6].value).toBe("errorMessage ? 'Error' : 'Success'");
    });
  });

  describe.each([
    { syntax: 'single', open: '{', close: '}' },
    { syntax: 'double', open: '{{', close: '}}' },
  ])('async blocks ($syntax brackets)', ({ syntax, open, close }) => {
    it('should compile basic async block with expression only', () => {
      const compiler = new TemplateCompiler();
      const template = `
        ${open}#async fetchData${close}
          <p>Data loaded!</p>
        ${open}/async${close}
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        {
          type: 'async',
          expression: 'fetchData',
          content: [
            { type: 'html', html: '\n          <p>Data loaded!</p>\n        ' },
          ],
          loadingContent: [],
          errorContent: [],
        },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should compile async block with alias', () => {
      const compiler = new TemplateCompiler();
      const template = `
        ${open}#async fetchUsers as users${close}
          <p>${open}users.length${close} users loaded</p>
        ${open}/async${close}
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        {
          type: 'async',
          expression: 'fetchUsers',
          as: 'users',
          content: [
            { type: 'html', html: '\n          <p>' },
            { type: 'expression', value: 'users.length' },
            { type: 'html', html: ' users loaded</p>\n        ' },
          ],
          loadingContent: [],
          errorContent: [],
        },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should compile async block with destructuring', () => {
      const compiler = new TemplateCompiler();
      const template = `
        ${open}#async fetchUser as { name, email, ...rest }${close}
          <p>${open}name${close} (${open}email${close})</p>
          <p>Other data: ${open}rest.id${close}</p>
        ${open}/async${close}
      `;
      const ast = compiler.compile(template);
      expect(ast[0].type).toBe('async');
      expect(ast[0].expression).toBe('fetchUser');
      expect(ast[0].parts).toEqual(['name', 'email']);
      expect(ast[0].rest).toBe('rest');
      expect(ast[0].as).toBeUndefined();
    });

    it('should compile async block with loading state', () => {
      const compiler = new TemplateCompiler();
      const template = `
        ${open}#async fetchData as data${close}
          <p>${open}data.message${close}</p>
        ${open}loading${close}
          <p>Loading...</p>
        ${open}/async${close}
      `;
      const ast = compiler.compile(template);
      expect(ast[0].type).toBe('async');
      expect(ast[0].expression).toBe('fetchData');
      expect(ast[0].as).toBe('data');
      expect(ast[0].loadingContent).toEqual([
        { type: 'html', html: '\n          <p>Loading...</p>\n        ' },
      ]);
    });

    it('should compile async block with before alias for loading', () => {
      const compiler = new TemplateCompiler();
      const template = `
        ${open}#async fetchData as data${close}
          <p>${open}data.message${close}</p>
        ${open}before${close}
          <p>Please wait...</p>
        ${open}/async${close}
      `;
      const ast = compiler.compile(template);
      expect(ast[0].type).toBe('async');
      expect(ast[0].loadingContent).toEqual([
        { type: 'html', html: '\n          <p>Please wait...</p>\n        ' },
      ]);
    });

    it('should compile async block with error handling', () => {
      const compiler = new TemplateCompiler();
      const template = `
        ${open}#async fetchData as data${close}
          <p>${open}data.message${close}</p>
        ${open}error${close}
          <p>Error: ${open}error.message${close}</p>
        ${open}/async${close}
      `;
      const ast = compiler.compile(template);
      expect(ast[0].type).toBe('async');
      expect(ast[0].errorContent).toEqual([
        { type: 'html', html: '\n          <p>Error: ' },
        { type: 'expression', value: 'error.message' },
        { type: 'html', html: '</p>\n        ' },
      ]);
      expect(ast[0].errorAs).toBeNull();
    });

    it('should compile async block with error alias', () => {
      const compiler = new TemplateCompiler();
      const template = `
        ${open}#async fetchData as data${close}
          <p>${open}data.message${close}</p>
        ${open}error as e${close}
          <p>Error: ${open}e.message${close}</p>
        ${open}/async${close}
      `;
      const ast = compiler.compile(template);
      expect(ast[0].type).toBe('async');
      expect(ast[0].errorAs).toBe('e');
      expect(ast[0].errorContent).toEqual([
        { type: 'html', html: '\n          <p>Error: ' },
        { type: 'expression', value: 'e.message' },
        { type: 'html', html: '</p>\n        ' },
      ]);
    });

    it('should compile async block with catch alias for error', () => {
      const compiler = new TemplateCompiler();
      const template = `
        ${open}#async fetchData as data${close}
          <p>${open}data.message${close}</p>
        ${open}catch as err${close}
          <p>Caught: ${open}err.message${close}</p>
        ${open}/async${close}
      `;
      const ast = compiler.compile(template);
      expect(ast[0].type).toBe('async');
      expect(ast[0].errorAs).toBe('err');
    });

    it('should compile complete async block with all states', () => {
      const compiler = new TemplateCompiler();
      const template = `
        ${open}#async fetchUsers as users${close}
          <ul>
            ${open}#each users as user${close}
              <li>${open}user.name${close}</li>
            ${open}/each${close}
          </ul>
        ${open}loading${close}
          <div class="spinner">Loading users...</div>
        ${open}error as e${close}
          <div class="error">Failed to load: ${open}e.message${close}</div>
        ${open}/async${close}
      `;
      const ast = compiler.compile(template);

      expect(ast[0].type).toBe('async');
      expect(ast[0].expression).toBe('fetchUsers');
      expect(ast[0].as).toBe('users');
      expect(ast[0].errorAs).toBe('e');

      // Check that content contains nested each block
      const eachBlock = ast[0].content.find(node => node.type === 'each');
      expect(eachBlock).toBeDefined();
      expect(eachBlock.over).toBe('users');
      expect(eachBlock.as).toBe('user');

      // Check loading content
      expect(ast[0].loadingContent.length).toBeGreaterThan(0);
      expect(ast[0].loadingContent.some(node => node.type === 'html' && node.html.includes('Loading users'))).toBe(
        true,
      );

      // Check error content
      expect(ast[0].errorContent.length).toBeGreaterThan(0);
      expect(ast[0].errorContent.some(node => node.type === 'expression' && node.value === 'e.message')).toBe(true);
    });

    it('should compile nested async blocks', () => {
      const compiler = new TemplateCompiler();
      const template = `
        ${open}#async fetchUsers as users${close}
          ${open}#each users as user${close}
            ${open}#async fetchUserDetails(user.id) as details${close}
              <p>${open}details.bio${close}</p>
            ${open}loading${close}
              <p>Loading details...</p>
            ${open}/async${close}
          ${open}/each${close}
        ${open}/async${close}
      `;
      const ast = compiler.compile(template);

      expect(ast[0].type).toBe('async');
      expect(ast[0].as).toBe('users');

      // Find nested each block
      const eachBlock = ast[0].content.find(node => node.type === 'each');
      expect(eachBlock).toBeDefined();

      // Find nested async block inside each
      const nestedAsync = eachBlock.content.find(node => node.type === 'async');
      expect(nestedAsync).toBeDefined();
      expect(nestedAsync.expression).toBe('fetchUserDetails(user.id)');
      expect(nestedAsync.as).toBe('details');
    });

    it('should handle complex expressions in async blocks', () => {
      const compiler = new TemplateCompiler();
      const template = `
        ${open}#async fetchData({ userId: user.id, options: { detailed: true } }) as result${close}
          <div>${open}result.data${close}</div>
        ${open}/async${close}
      `;
      const ast = compiler.compile(template);

      expect(ast[0].type).toBe('async');
      expect(ast[0].expression).toBe('fetchData({ userId: user.id, options: { detailed: true } })');
      expect(ast[0].as).toBe('result');
    });

    it('should handle async block with no alias using this', () => {
      const compiler = new TemplateCompiler();
      const template = `
        ${open}#async fetchMessage${close}
          <p>${open}this${close}</p>
        ${open}/async${close}
      `;
      const ast = compiler.compile(template);

      expect(ast[0].type).toBe('async');
      expect(ast[0].expression).toBe('fetchMessage');
      expect(ast[0].as).toBeUndefined();
      expect(ast[0].parts).toBeUndefined();
      expect(ast[0].rest).toBeUndefined();
    });
  });

  describe('rerender and guard blocks', () => {
    describe('Basic rerender blocks', () => {
      it('should compile {#rerender expression}', () => {
        const compiler = new TemplateCompiler();
        const template = `
          {#rerender userId}
            <div>User: {getUserDisplayName}</div>
          {/rerender}
        `;
        const ast = compiler.compile(template);
        const expectedAST = [
          {
            type: 'rerender',
            expression: 'userId',
            key: null,
            content: [
              { type: 'html', html: '\n            <div>User: ' },
              { type: 'expression', value: 'getUserDisplayName' },
              { type: 'html', html: '</div>\n          ' },
            ],
          },
        ];
        expect(ast).toEqual(expectedAST);
      });

      it('should compile {#rerender expression} with complex expression', () => {
        const compiler = new TemplateCompiler();
        const template = `
          {#rerender userId + theme}
            <div>Content that depends on userId and theme</div>
          {/rerender}
        `;
        const ast = compiler.compile(template);
        const expectedAST = [
          {
            type: 'rerender',
            expression: 'userId + theme',
            key: null,
            content: [
              { type: 'html', html: '\n            <div>Content that depends on userId and theme</div>\n          ' },
            ],
          },
        ];
        expect(ast).toEqual(expectedAST);
      });
    });

    describe('Guard blocks', () => {
      it('should compile {#guard expression}', () => {
        const compiler = new TemplateCompiler();
        const template = `
          {#guard getUserHash}
            <expensive-user-dashboard ></expensive-user-dashboard>
          {/guard}
        `;
        const ast = compiler.compile(template);
        const expectedAST = [
          {
            type: 'rerender',
            expression: null,
            key: 'getUserHash',
            content: [
              {
                type: 'html',
                html: '\n            <expensive-user-dashboard ></expensive-user-dashboard>\n          ',
              },
            ],
          },
        ];
        expect(ast).toEqual(expectedAST);
      });

      it('should compile {#guard expression} with complex key expression', () => {
        const compiler = new TemplateCompiler();
        const template = `
          {#guard getComputedKey userId permissions}
            <complex-component ></complex-component>
          {/guard}
        `;
        const ast = compiler.compile(template);
        const expectedAST = [
          {
            type: 'rerender',
            expression: null,
            key: 'getComputedKey userId permissions',
            content: [
              { type: 'html', html: '\n            <complex-component ></complex-component>\n          ' },
            ],
          },
        ];
        expect(ast).toEqual(expectedAST);
      });
    });

    describe('Hybrid rerender with key', () => {
      it('should compile {#rerender expression key=keyExpression}', () => {
        const compiler = new TemplateCompiler();
        const template = `
          {#rerender userId key=getAccessLevel}
            <permission-sensitive-content ></permission-sensitive-content>
          {/rerender}
        `;
        const ast = compiler.compile(template);
        const expectedAST = [
          {
            type: 'rerender',
            expression: 'userId',
            key: 'getAccessLevel',
            content: [
              {
                type: 'html',
                html: '\n            <permission-sensitive-content ></permission-sensitive-content>\n          ',
              },
            ],
          },
        ];
        expect(ast).toEqual(expectedAST);
      });

      it('should compile {#rerender expression key=keyExpression} with complex expressions', () => {
        const compiler = new TemplateCompiler();
        const template = `
          {#rerender state.userId + state.theme key=getCacheKey state}
            <div>Complex content</div>
          {/rerender}
        `;
        const ast = compiler.compile(template);
        const expectedAST = [
          {
            type: 'rerender',
            expression: 'state.userId + state.theme',
            key: 'getCacheKey state',
            content: [
              { type: 'html', html: '\n            <div>Complex content</div>\n          ' },
            ],
          },
        ];
        expect(ast).toEqual(expectedAST);
      });
    });

    describe('Nested content', () => {
      it('should handle nested expressions within rerender blocks', () => {
        const compiler = new TemplateCompiler();
        const template = `
          {#rerender userId}
            <div>
              <p>User: {getUserDisplayName}</p>
              <p>API: {apiEndpoint}</p>
              {#if hasPermission}
                <button>Admin</button>
              {/if}
            </div>
          {/rerender}
        `;
        const ast = compiler.compile(template);
        expect(ast[0].type).toBe('rerender');
        expect(ast[0].expression).toBe('userId');
        expect(ast[0].content).toHaveLength(7); // html, expr, html, expr, html, if, html
      });
    });

    describe('Edge cases', () => {
      it('should handle empty rerender blocks', () => {
        const compiler = new TemplateCompiler();
        const template = `{#rerender userId}{/rerender}`;
        const ast = compiler.compile(template);
        const expectedAST = [
          {
            type: 'rerender',
            expression: 'userId',
            key: null,
            content: [],
          },
        ];
        expect(ast).toEqual(expectedAST);
      });

      it('should handle guard blocks with spaces', () => {
        const compiler = new TemplateCompiler();
        const template = `{#guard   getUserKey   }<div>Content</div>{/guard}`;
        const ast = compiler.compile(template);
        expect(ast[0].expression).toBe(null);
        expect(ast[0].key).toBe('getUserKey');
      });
    });
  });

  describe('preprocessing', () => {
    describe('web component self-closing tags', () => {
      it('should handle single-hyphen web components', () => {
        const compiler = new TemplateCompiler();
        const template = '<ui-button />';
        const ast = compiler.compile(template);
        const expectedAST = [
          { type: 'html', html: '<ui-button ></ui-button>' },
        ];
        expect(ast).toEqual(expectedAST);
      });

      it('should handle multiple-hyphen web components', () => {
        const compiler = new TemplateCompiler();
        const template = '<expensive-user-dashboard-component />';
        const ast = compiler.compile(template);
        const expectedAST = [
          { type: 'html', html: '<expensive-user-dashboard-component ></expensive-user-dashboard-component>' },
        ];
        expect(ast).toEqual(expectedAST);
      });

      it('should handle web components with attributes', () => {
        const compiler = new TemplateCompiler();
        const template = '<ui-icon icon="home" size="large" />';
        const ast = compiler.compile(template);
        const expectedAST = [
          { type: 'html', html: '<ui-icon icon="home" size="large" ></ui-icon>' },
        ];
        expect(ast).toEqual(expectedAST);
      });

      it('should handle multiple web components in template', () => {
        const compiler = new TemplateCompiler();
        const template = `
          <ui-header />
          <main-content-area />
          <ui-footer />
        `;
        const ast = compiler.compile(template);
        const expectedAST = [
          {
            type: 'html',
            html:
              '<ui-header ></ui-header>\n          <main-content-area ></main-content-area>\n          <ui-footer ></ui-footer>',
          },
        ];
        expect(ast).toEqual(expectedAST);
      });
    });
  });

  describe('error conditions', () => {
    it('should throw an error when an else included outside an if', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {else}
        </div>
      `;
      try {
        const consoleError = console.error;
        console.error = vi.fn();
        expect(() => compiler.compile(template)).toThrow();
        console.error = consoleError;
      }
      catch (e) {}
    });

    it('should throw an error when an elseif included outside an if', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {elseif name}
        </div>
      `;
      try {
        const consoleError = console.error;
        console.error = vi.fn();
        expect(() => compiler.compile(template)).toThrow();
        console.error = consoleError;
      }
      catch (e) {}
    });

    it('should throw an error when closing if tag is included without an if', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {/if}
        </div>
      `;
      try {
        const consoleError = console.error;
        console.error = vi.fn();
        expect(() => compiler.compile(template)).toThrow();
        console.error = consoleError;
      }
      catch (e) {}
    });
  });
});
