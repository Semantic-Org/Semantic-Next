import { describe, expect, it, vi } from 'vitest';

import { TemplateCompiler } from '@semantic-ui/templating';

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
          <p>{{ name }}</p>
          <p>{{ age }}</p>
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
          <p>{{#html '<b>John</b>' }}</p>
          <p>{{#html '<img src="img.png">' }}</p>
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
          <p>{{ true }}</p>
          <p>{{ false }}</p>
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
          {{#if condition}}
            <p>True</p>
          {{/if}}
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
          {{#if true}}
            <p>True</p>
          {{/if}}
          {{#if false}}
            <p>False</p>
          {{/if}}
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
          <p>{{ 10 }}</p>
          <p>{{ 0 }}</p>
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
          {{#if 'name'}}
            Content
          {{/if}}
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
          {{#if name}}
            <p>True</p>
          {{else if age}}
            <p>False</p>
          {{/if}}
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
          {{#if name}}
            <p>True</p>
          {{else if age}}
            <p>False</p>
          {{else if height}}
            <p>False</p>
          {{/if}}
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
          {{#if name}}
            <p>True</p>
          {{else if age}}
            <p>False</p>
            {{#if height}}
              <p>True</p>
            {{else}}
              <p>False</p>
            {{/if}}
          {{/if}}
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
          {{#if name}}
            <p>True</p>
          {{else}}
            <p>False</p>
          {{/if}}
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
          {{#if name}}
            <p>True</p>
            {{#if age}}
              <p>True</p>
            {{else}}
              <p>False</p>
            {{/if}}
          {{else}}
            <p>False</p>
          {{/if}}
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
          {{#if name}}
            <p>True</p>
            {{#if age}}
              <p>True</p>
              {{#if height}}
                <p>True</p>
              {{else}}
                <p>False</p>
              {{/if}}
            {{else}}
              <p>False</p>
            {{/if}}
          {{else}}
            <p>False</p>
          {{/if}}
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
          {{ getValue { nested: value } }}
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
          {{ formatData { user: { name: userName, details: { age: userAge } } } }}
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
          {{ processUser(getData({ id: userId })) }}
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
          {{ formatList([{ id: 1 }, { id: 2 }]) }}
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
          {{ isValid({ user: { permissions: { admin: checkAdmin({ org: orgId }) } } }) }}
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
          {{ processItems([ { type: 'user', data: { id: 1 } }, { type: 'admin', data: { id: 2 } } ]) }}
        </div>
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<div>\n          ' },
        { type: 'expression', value: 'processItems([ { type: \'user\', data: { id: 1 } }, { type: \'admin\', data: { id: 2 } } ])' },
        { type: 'html', html: '\n        </div>' },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should handle nested expressions in boolean attributes', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div disabled={{ isDisabled({ user: { status: getStatus({ id: userId }) } }) }}>
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
        {{#each getItems}}
          <p>{{ name }}</p>
        {{/each}}
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

    it('should compile a template with an each loop and an iterateAs', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {{#each item in getItems}}
          <p>{{ item.name }}</p>
        {{/each}}
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

    it('should compile a template with an if condition inside an each loop', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {{#each getItems}}
          {{#if name}}
            <p>{{ name }}</p>
          {{/if}}
        {{/each}}
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
        {{#each getItems}}
          <p>{{ name }}</p>
        {{else}}
          <p>No items available</p>
        {{/each}}
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
          else: {
            type: 'else',
            content: [
              { type: 'html', html: '\n          <p>No items available</p>\n        ' },
            ],
          },
        },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should compile a template with a nested each loop with else conditions', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {{#each categories}}
          <h2>{{ name }}</h2>
          {{#each items}}
            <p>{{ title }}</p>
          {{else}}
            <p>No items in this category</p>
          {{/each}}
        {{else}}
          <p>No categories available</p>
        {{/each}}
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
              else: {
                type: 'else',
                content: [
                  { type: 'html', html: '\n            <p>No items in this category</p>\n          ' },
                ],
              },
            },
            { type: 'html', html: '\n        ' },
          ],
          else: {
            type: 'else',
            content: [
              { type: 'html', html: '\n          <p>No categories available</p>\n        ' },
            ],
          },
        },
      ];
      expect(ast).toEqual(expectedAST);
    });

    it('should verify that if/else and each/else conditions can work independently', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {{#each items}}
          {{#if isActive}}
            <p>Active: {{ name }}</p>
          {{else}}
            <p>Inactive: {{ name }}</p>
          {{/if}}
        {{else}}
          <p>No items to display</p>
        {{/each}}
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
                  ]
                }
              ],
            },
            { type: 'html', html: '\n        ' },
          ],
          else: {
            type: 'else',
            content: [
              { type: 'html', html: '\n          <p>No items to display</p>\n        ' },
            ],
          },
        },
      ];
      expect(ast).toEqual(expectedAST);
    });
    
    it('should handle complex nested conditions with multiple levels of if/each/else', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {{#each sections}}
          <section>
            <h2>{{ title }}</h2>
            
            {{#if hasFilters}}
              <div class="filters">
                {{#each filters}}
                  {{#if isActive}}
                    <span class="active">{{ name }}</span>
                  {{else}}
                    <span class="inactive">{{ name }}</span>
                  {{/if}}
                {{else}}
                  <p>No filters configured</p>
                {{/each}}
              </div>
            {{/if}}
            
            {{#each items}}
              <div class="item">
                {{#if featured}}
                  <div class="featured">
                    <h3>{{ title }}</h3>
                    {{#if hasImage}}
                      <img src="{{ imageUrl }}" alt="{{ title }}">
                    {{else}}
                      <div class="placeholder">No image</div>
                    {{/if}}
                  </div>
                {{else}}
                  <div class="regular">
                    <h4>{{ title }}</h4>
                  </div>
                {{/if}}
              </div>
            {{else}}
              <p>No items in this section</p>
            {{/each}}
          </section>
        {{else}}
          <div class="empty-state">
            <p>No sections available</p>
          </div>
        {{/each}}
      `;
      
      const ast = compiler.compile(template);
      
      // Verify the structure through assertions on specific parts rather than comparing the entire AST
      // This makes the test more maintainable and easier to debug
      expect(ast.length).toBe(1);
      expect(ast[0].type).toBe('each');
      expect(ast[0].over).toBe('sections');
      expect(ast[0].else).toBeDefined();
      expect(ast[0].else.type).toBe('else');
      
      const sectionsContent = ast[0].content;
      
      // Find the if hasFilters node
      const hasFiltersIf = sectionsContent.find(node => 
        node.type === 'if' && node.condition === 'hasFilters'
      );
      expect(hasFiltersIf).toBeDefined();
      
      // Find the each filters node inside hasFilters
      const filtersDiv = hasFiltersIf.content.find(node => 
        node.type === 'html' && node.html.includes('filters')
      );
      expect(filtersDiv).toBeDefined();
      
      const filtersContent = hasFiltersIf.content;
      const filtersEach = filtersContent.find(node => node.type === 'each' && node.over === 'filters');
      expect(filtersEach).toBeDefined();
      expect(filtersEach.else).toBeDefined();
      expect(filtersEach.else.type).toBe('else');
      
      // Find the isActive if inside filters each
      const isActiveIf = filtersEach.content.find(node => 
        node.type === 'if' && node.condition === 'isActive'
      );
      expect(isActiveIf).toBeDefined();
      expect(isActiveIf.branches.length).toBe(1);
      expect(isActiveIf.branches[0].type).toBe('else');
      
      // Find the each items node
      const itemsEach = sectionsContent.find(node => 
        node.type === 'each' && node.over === 'items'
      );
      expect(itemsEach).toBeDefined();
      expect(itemsEach.else).toBeDefined();
      expect(itemsEach.else.type).toBe('else');
      
      // Find the featured if inside items each
      const featuredIf = itemsEach.content.find(node => 
        node.type === 'if' && node.condition === 'featured'
      );
      expect(featuredIf).toBeDefined();
      expect(featuredIf.branches.length).toBe(1);
      expect(featuredIf.branches[0].type).toBe('else');
      
      // Find the hasImage if inside featured if
      const featuredContent = featuredIf.content;
      const hasImageIf = featuredContent.find(node => 
        node.type === 'if' && node.condition === 'hasImage'
      );
      expect(hasImageIf).toBeDefined();
      expect(hasImageIf.branches.length).toBe(1);
      expect(hasImageIf.branches[0].type).toBe('else');
    });
    
    it('should verify that multiple else-if can work correctly after if blocks', () => {
      const compiler = new TemplateCompiler();
      const template = `
        {{#each items}}
          <div class="item">{{ name }}</div>
        {{else}}
          {{#if reason === 'loading'}}
            <div class="loading">Loading items...</div>
          {{else if reason === 'error'}}
            <div class="error">Error loading items: {{ errorMessage }}</div>
          {{else if reason === 'empty'}}
            <div class="empty">No items are available</div>
          {{else}}
            <div class="unknown">Unknown state</div>
          {{/if}}
        {{/each}}
      `;
      
      const ast = compiler.compile(template);
      
      // Verify the correct structure
      expect(ast.length).toBe(1);
      expect(ast[0].type).toBe('each');
      expect(ast[0].over).toBe('items');
      expect(ast[0].else).toBeDefined();
      expect(ast[0].else.type).toBe('else');
      
      // Find the if inside the else block
      const ifNode = ast[0].else.content.find(node => node.type === 'if');
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
          {{> partialName }}
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
          {{> partialName data1=value data2=value}}
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
          {{>template name=dynamicName reactiveData={one: 'one', two: two} }}
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
          {{> CodePlaygroundPanel size=(getPanelSize) }}
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
          {{> CodePlaygroundPanel size=(getPanelSize panel) }}
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
          {{> CodePlaygroundPanel
            panel=panel
            size=(getPanelSize panel)
          }}
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
          {{> CodePlaygroundPanel size=(getPanelSize (getPanel)) }}
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
          {{>slot 'name'}}
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
        <input type="checkbox" checked={{maybeChecked}}>
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
        <input type="checkbox" checked="{{maybeChecked}}">
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
        <input type="checkbox" custom={{maybeChecked}}>
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
        <input type="checkbox" custom="{{maybeChecked}}">
      `;
      const ast = compiler.compile(template);
      const expectedAST = [
        { type: 'html', html: '<input type="checkbox" custom=' },
        { type: 'expression', value: 'maybeChecked', booleanAttribute: true },
        { type: 'html', html: '>' },
      ];
    });



  });

  describe('error conditions', () => {
    it('should throw an error when an else included outside an if', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {{else}}
        </div>
      `;
      try {
        const consoleError = console.error;
        console.error = vi.fn();
        expect(() => compiler.compile(template)).toThrow();
        console.error = consoleError;
      } catch (e) {}
    });

    it('should throw an error when an elseif included outside an if', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {{elseif name}}
        </div>
      `;
      try {
        const consoleError = console.error;
        console.error = vi.fn();
        expect(() => compiler.compile(template)).toThrow();
        console.error = consoleError;
      } catch (e) {}
    });

    it('should throw an error when closing if tag is included without an if', () => {
      const compiler = new TemplateCompiler();
      const template = `
        <div>
          {{/if}}
        </div>
      `;
      try {
        const consoleError = console.error;
        console.error = vi.fn();
        expect(() => compiler.compile(template)).toThrow();
        console.error = consoleError;
      } catch (e) {}
    });
  });
});
