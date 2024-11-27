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
        { type: 'template', name: `'partialName'`, data: {} },
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
          data: { data1: 'value', data2: 'value' },
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
          data: { size: '(getPanelSize)' },
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
          data: { size: '(getPanelSize panel)' },
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
          data: { panel: 'panel', size: '(getPanelSize panel)' },
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
          data: { size: '(getPanelSize (getPanel))' },
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

  /*
  describe('TemplateCompiler - preprocessAttributes', () => {
    it('should convert camelCase attributes to kebab-case', () => {
      const template = `<ui-menu expandAll="true" itemsPerPage="10"></ui-menu>`;
      const result = TemplateCompiler.preprocessAttributes(template);
      const expected = `<ui-menu expand-all="true" items-per-page="10"></ui-menu>`;
      expect(result).toBe(expected);
    });

    it('should convert boolean camelCase attributes to kebab-case', () => {
      const template = `<ui-menu expandAll></ui-menu>`;
      const result = TemplateCompiler.preprocessAttributes(template);
      const expected = `<ui-menu expand-all></ui-menu>`;
      expect(result).toBe(expected);
    });

    it('should preserve already kebab-case attributes', () => {
      const template = `<ui-menu expand-all="true" items-per-page="10"></ui-menu>`;
      const result = TemplateCompiler.preprocessAttributes(template);
      expect(result).toBe(template);
    });

    it('should not modify dynamic expressions in attributes', () => {
      const template = `<ui-menu class="{getClass section}" href={getLink section}></ui-menu>`;
      const result = TemplateCompiler.preprocessAttributes(template);
      expect(result).toBe(template);
    });

    it('should handle dynamic expressions with {{}}', () => {
      const template = `<ui-menu class="{{getClass section}}" href="{{getLink section}}"></ui-menu>`;
      const result = TemplateCompiler.preprocessAttributes(template);
      expect(result).toBe(template);
    });

    it('should handle mixed attributes correctly', () => {
      const template = `<ui-menu expandAll="true" itemsPerPage="10" class="{getClass section}" href="{{getLink section}}"></ui-menu>`;
      const result = TemplateCompiler.preprocessAttributes(template);
      const expected = `<ui-menu expand-all="true" items-per-page="10" class="{getClass section}" href="{{getLink section}}"></ui-menu>`;
      expect(result).toBe(expected);
    });

    it('should process self-closing tags with boolean attributes', () => {
      const template = `<ui-menu expandAll itemsPerPage />`;
      const result = TemplateCompiler.preprocessAttributes(template);
      const expected = `<ui-menu expand-all items-per-page />`;
      expect(result).toBe(expected);
    });

    it('should process mixed boolean and dynamic attributes', () => {
      const template = `<ui-menu expandAll class="{getClass section}" itemsPerPage></ui-menu>`;
      const result = TemplateCompiler.preprocessAttributes(template);
      const expected = `<ui-menu expand-all class="{getClass section}" items-per-page></ui-menu>`;
      expect(result).toBe(expected);
    });

    it('should handle attributes with complex expression values', () => {
      const template = `<div class="{activeIf isActiveItem section}{classIf hasIcons 'indented'}content" part="content">`;
      const result = TemplateCompiler.preprocessAttributes(template);
      expect(result).toBe(template);
    });

    it('should not mangle nested expressions', () => {
      const template = `<div class="{classes getTitleStates section}title">`;
      const result = TemplateCompiler.preprocessAttributes(template);
      expect(result).toBe(template);
    });

    it('should not mangle templates with attributes', () => {
      const template = `{>CodePlaygroundFile filename=panel.filename someAttr=value }`;
      const result = TemplateCompiler.preprocessAttributes(template);
      const expected = `{>CodePlaygroundFile filename=panel.filename someAttr=value }`;
      expect(result).toBe(expected);
    });

    it('should handle multi-line attributes with whitespace', () => {
      const template = `<div
        someAttr = "value"
        dataValue = {expr}
        thirdAttr = "test"
      >`;
      const result = TemplateCompiler.preprocessAttributes(template);
      const expected = `<div
        some-attr = "value"
        data-value = {expr}
        third-attr = "test"
      >`;
      expect(result).toBe(expected);
    });

    it('should preserve markdown attributes in class specifications', () => {
      const template = `### {title} {#title .title part="title"}`;
      const result = TemplateCompiler.preprocessAttributes(template);
      expect(result).toBe(template);
    });

    it('should handle conditional template syntax', () => {
      const template = `{#if is layout 'tabs'} <div dataAttr="value">`;
      const result = TemplateCompiler.preprocessAttributes(template);
      const expected = `{#if is layout 'tabs'} <div data-attr="value">`;
      expect(result).toBe(expected);
    });
  });
  */
});
