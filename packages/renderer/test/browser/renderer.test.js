// renderer.test.js
import { describe, it, expect } from 'vitest';
import { render } from 'lit-html';

import { LitRenderer } from '@semantic-ui/renderer';
import { TemplateHelpers } from '@semantic-ui/templating';

/**
 * Renders a given AST (array of nodes) with LitRenderer into text.
 */
function renderASTtoText({ast, data, snippets}) {

  // render ast to lit
  const renderer = new LitRenderer({
    ast,
    data,
    snippets,
    helpers: TemplateHelpers,
  });
  const result = renderer.render();

  // Use lit's `render()` into a temporary container to get final html
  const container = document.createElement('div');
  render(result, container);

  let html = container.innerHTML;
  // remove lit comments from html
  html = html.replace(/<!--[\s\S]*?-->/g, '').trim();

  return html;
}

function getRendererConfig({ name, expression, data, snippet, snippets, ifDefined = false, unsafeHTML = false }) {
  let ast = [];
  if (snippet) {
    ast.push({ type: 'template', name: snippet.name, data: snippet.data });
  }
  else {
    ast.push({ type: 'expression', value: expression, ifDefined, unsafeHTML });
  }
  return { ast, data, snippets };
}

const expressionTests = [
  {
    name: 'Calling method in data context with object using spaced arguments',
    expression: `formatDate date 'h:mm:ss a' { timezone: timezone }`,
    resultContains: ['4:00:00', 'am'],
    data: {
      timezone: 'PST',
      date: new Date('2025-01-01T12:00:00Z'),
    }
  },
  {
    name: 'Calling helper method in data context with js arguments',
    expression: `formatDate(date, 'h:mm:ss a', { timezone: timezone })`,
    resultContains: ['4:00:00', 'am'],
    data: {
      timezone: 'PST',
      date: new Date('2025-01-01T12:00:00Z'),
    }
  },
  {
    name: 'Calling helper method with inline object definition',
    expression: `classMap { one: true, two: true, three: isThree }`,
    result: 'one two three', // from the example
    data: {
      isThree: true,
    }
  },
  {
    name: 'Calling method with spaced arguments and inline array definition',
    expression: `join ['1', '2', '3'] ' and '`,
    result: '1 and 2 and 3',
  },
  {
    name: 'Outputting value from data context',
    expression: 'value',
    result: '1',
    data: {
      value: 1
    }
  },
  {
    name: 'Inline addition',
    expression: 'value + 1',
    result: '2',
    data: {
      value: 1
    }
  },
  {
    name: 'Inline arithmetic',
    expression: 'value + 2 * 5',
    result: '11',
    data: {
      value: 1
    }
  },
  {
    name: 'Inline arithmetic with order of operations',
    expression: '(value + 2) * 5',
    result: '15',
    data: {
      value: 1
    }
  },
  {
    name: 'Calling a method with spaced arguments',
    expression: 'addOne value',
    result: '2',
    data: {
      addOne: (value) => value + 1,
      value: 1
    }
  },
  {
    name: 'Calling a method with js arguments and inline addition',
    expression: 'addOne(value + 1)',
    result: '3',
    data: {
      addOne: (value) => value + 1,
      value: 1
    }
  },
  {
    name: 'Calling a method with inline object',
    expression: `getValue {one: 'two'} 'one'`,
    result: 'two',
    data: {
      getValue: (obj, prop) => obj[prop],
      value: 1
    }
  },
  {
    name: 'Adding numbers',
    expression: '2 + 3',
    result: '5',
  },
  {
    name: 'Passed through to snippet',
    snippet: {
      name: `'test'`,
      data: { obj: '{a: 1}' },
    },
    snippets: {
      test: {
        type: 'snippet',
        name: 'test',
        content: [
          { type: 'expression', value: 'obj.a' }
        ]
      }
    },
    result: '1',
    data: {
      getValue: (obj, prop) => obj[prop],
    }
  },
  {
    name: 'Nested object property access',
    expression: 'user.name',
    result: 'Jack',
    data: {
      user: { name: 'Jack' }
    }
  },
  {
    name: 'Missing property returns undefined',
    expression: 'user.age',
    result: '',
    data: {
      user: { name: 'Jack' }
    }
  },
  {
    name: 'Missing method call yields no result',
    expression: 'someUndefinedFn',
    result: ''
  },
  {
    name: 'Mixed spaced & JS arguments with nested calls',
    expression: "outerFn (innerFn numberVal) { foo: 'bar' }",
    result: 'Outer(Inner(10), bar)', // or something representative
    data: {
      numberVal: 10,
      innerFn: (val) => `Inner(${val})`,
      outerFn: (a, b) => `Outer(${a}, ${b.foo})`
    }
  },
  {
    name: 'Method returning null',
    expression: 'returnsNull dataVal',
    result: '',
    data: {
      dataVal: 1,
      returnsNull: (val) => null
    }
  },
  {
    name: 'Unsafe html should preserve html',
    expression: '"<b>Hello World</b>"',
    result: '<b>Hello World</b>',
    unsafeHTML: true,
  },
  {
    name: 'Standard evaluation should create html entities',
    expression: '"Hello World<b>Remove Me</b>"',
    result: 'Hello World&lt;b&gt;Remove Me&lt;/b&gt;',
  },
  {
    name: 'If defined return true',
    expression: 'isChecked',
    result: 'true',
    ifDefined: true,
    data: { isChecked: true }
  },
  {
    name: 'Inline object and array',
    expression: `doSomething { text: 'apple' } arr`,
    result: 'gotIt',
    data: {
      doSomething(obj, arr) {
        // e.g. obj = { nested: { key: 'value' }, arr: [1,2,3] }
        if (obj?.text === 'apple' && arr?.length === 3) {
          return 'gotIt';
        }
        return 'wrong';
      },
      arr: [1, 2, 3]
    }
  },
  {
    name: 'Nested inline object and array',
    expression: `doSomething({ nested: { key: value }, arr: [1, 2, 3] })`,
    result: 'gotIt',
    data: {
      doSomething(obj) {
        // e.g. obj = { nested: { key: 'value' }, arr: [1,2,3] }
        if (obj?.nested?.key == 1 && obj?.arr?.length == 3) {
          return 'gotIt';
        }
        return 'wrong';
      },
      value: 1
    },
  },
  {
    name: 'JS ternary operator in expression',
    expression: '(someFlag ? "Y" : "N")',
    result: 'Y',
    data: { someFlag: true }
  },
  {
    name: 'Array indexing (numbers[1])',
    expression: 'numbers[1]',
    result: '2',
    data: {
      numbers: [1, 2, 3]
    }
  },
  {
    name: 'Local property overriding global helper',
    expression: `concat "Hello" "World"`,
    result: 'LocalHelloWorld',
    data: {
      concat: (a, b) => `Local${a}${b}` // overshadow global helper
    }
  }
];

describe('LitRenderer', () => {

  describe('Expression', () => {

    expressionTests.forEach((test) => {
      it(test.name, () => {
        const {ast, data, helpers, snippets} = getRendererConfig(test);
        const output = renderASTtoText({ast, data, helpers, snippets});

        if(test.result !== undefined) {
          // expect an exact match
          expect(output).toBe(test.result);
        }
        else if(test.resultContains) {
          // expect each value of an array of strings to be present
          test.resultContains.forEach(part => {
            expect(output).toContain(part);
          });
        }
      });
    });

  });
});
