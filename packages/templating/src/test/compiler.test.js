import { describe, expect, it, vi } from 'vitest';

import { TemplateCompiler } from '../compiler.js';

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
        { type: 'html', html: '</p>\n        </div>' }
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
        { type: 'html', html: '\n        </div>' }
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
          data: { data1: 'value', data2: 'value' }
        },
        { type: 'html', html: '\n        </div>' }
      ];
      console.log(ast);
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
          reactiveData: { one: "'one'", two: 'two' }
        },
        { type: 'html', html: '\n        </div>' }
      ];
      console.log(ast);
      expect(ast).toEqual(expectedAST);
    });
  });

});
