// helpers.test.js
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

describe('Template Helpers', () => {
  describe('activeIf helper', () => {
    const activeIfTests = [
      {
        name: 'activeIf with true literal',
        expression: 'activeIf(true)',
        result: 'active',
      },
      {
        name: 'activeIf with false literal',
        expression: 'activeIf(false)',
        result: '',
      },
      {
        name: 'activeIf with data value that is true',
        expression: 'activeIf(isActive)',
        result: 'active',
        data: { isActive: true }
      },
      {
        name: 'activeIf with data value that is false',
        expression: 'activeIf(isActive)',
        result: '',
        data: { isActive: false }
      },
      {
        name: 'activeIf with equality comparison (true)',
        expression: 'activeIf(value === 5)',
        result: 'active',
        data: { value: 5 }
      },
      {
        name: 'activeIf with equality comparison (false)',
        expression: 'activeIf(value === 5)',
        result: '',
        data: { value: 10 }
      },
      {
        name: 'activeIf with loose equality comparison (true)',
        expression: 'activeIf(value == "5")',
        result: 'active',
        data: { value: 5 }
      },
      {
        name: 'activeIf with complex expression (true)',
        expression: 'activeIf(selected && selected.id == item.id)',
        result: 'active',
        data: {
          selected: { id: 123 },
          item: { id: 123 }
        }
      },
      {
        name: 'activeIf with complex expression (false)',
        expression: 'activeIf(selected && selected.id == item.id)',
        result: '',
        data: {
          selected: { id: 123 },
          item: { id: 456 }
        }
      },
      {
        name: 'activeIf with function call (true)',
        expression: 'activeIf(isItemActive(5))',
        result: 'active',
        data: {
          isItemActive: (id) => id === 5
        }
      },
      {
        name: 'activeIf with function call (false)',
        expression: 'activeIf(isItemActive(10))',
        result: '',
        data: {
          isItemActive: (id) => id === 5
        }
      },
      {
        name: 'activeIf with spaced equality expression (true)',
        expression: 'activeIf (value == 5)',
        result: 'active',
        data: { value: 5 }
      },
      {
        name: 'activeIf with spaced equality expression (false)',
        expression: 'activeIf(value == 5)',
        result: '',
        data: { value: 10 }
      }
    ];

    activeIfTests.forEach((test) => {
      it(test.name, () => {
        const {ast, data, helpers, snippets} = getRendererConfig(test);
        const output = renderASTtoText({ast, data, helpers, snippets});
        expect(output).toBe(test.result);
      });
    });
  });

  describe('classIf helper', () => {
    const classIfTests = [
      {
        name: 'classIf with true condition and class name',
        expression: 'classIf(true, "selected")',
        result: 'selected',
      },
      {
        name: 'classIf with false condition and class name',
        expression: 'classIf(false, "selected")',
        result: '',
      },
      {
        name: 'classIf with true condition and true/false class names',
        expression: 'classIf(true, "selected", "not-selected")',
        result: 'selected',
      },
      {
        name: 'classIf with false condition and true/false class names',
        expression: 'classIf(false, "selected", "not-selected")',
        result: 'not-selected',
      },
      {
        name: 'classIf with data variable condition (true)',
        expression: 'classIf(isSelected, "selected")',
        result: 'selected',
        data: { isSelected: true }
      },
      {
        name: 'classIf with equality comparison (true)',
        expression: 'classIf(value === 5, "equal", "not-equal")',
        result: 'equal',
        data: { value: 5 }
      },
      {
        name: 'classIf with spaced arguments',
        expression: 'classIf isSelected "selected"',
        result: 'selected',
        data: { isSelected: true }
      },
      {
        name: 'classIf with spaced arguments and two class options',
        expression: 'classIf isSelected "selected" "not-selected"',
        result: 'selected',
        data: { isSelected: true }
      }
    ];

    classIfTests.forEach((test) => {
      it(test.name, () => {
        const {ast, data, helpers, snippets} = getRendererConfig(test);
        const output = renderASTtoText({ast, data, helpers, snippets});
        expect(output).toBe(test.result);
      });
    });
  });

  describe('Logic helpers', () => {
    const logicHelperTests = [
      {
        name: 'both helper with two truthy values',
        expression: 'both(true, true)',
        result: 'true',
      },
      {
        name: 'both helper with one falsy value',
        expression: 'both(true, false)',
        result: 'false',
      },
      {
        name: 'both helper with spaced args',
        expression: 'both isActive isVisible',
        result: 'true',
        data: { isActive: true, isVisible: true }
      },
      {
        name: 'either helper with one truthy value',
        expression: 'either(true, false)',
        result: 'true',
      },
      {
        name: 'either helper with both falsy values',
        expression: 'either(false, false)',
        result: 'false',
      },
      {
        name: 'not helper with truthy value',
        expression: 'not(true)',
        result: 'false',
      },
      {
        name: 'not helper with nested expression',
        expression: 'not(isOpen && isEnabled)',
        result: 'true',
        data: { isOpen: true, isEnabled: false }
      },
      {
        name: 'maybe helper as ternary operator (true case)',
        expression: 'maybe(isActive, "Yes", "No")',
        result: 'Yes',
        data: { isActive: true }
      },
      {
        name: 'maybe helper as ternary operator (false case)',
        expression: 'maybe(isActive, "Yes", "No")',
        result: 'No',
        data: { isActive: false }
      },
      {
        name: 'maybe helper with spaced args',
        expression: 'maybe isActive "Active" "Inactive"',
        result: 'Active',
        data: { isActive: true }
      },
    ];

    logicHelperTests.forEach((test) => {
      it(test.name, () => {
        const {ast, data, helpers, snippets} = getRendererConfig(test);
        const output = renderASTtoText({ast, data, helpers, snippets});
        expect(output).toBe(test.result);
      });
    });
  });

  describe('Comparison helpers', () => {
    const comparisonHelperTests = [
      {
        name: 'is (loose equality) with matching values',
        expression: 'is(5, "5")',
        result: 'true',
      },
      {
        name: 'is (loose equality) with non-matching values',
        expression: 'is(5, "6")',
        result: 'false',
      },
      {
        name: 'isExactly (strict equality) with matching values',
        expression: 'isExactly(5, 5)',
        result: 'true',
      },
      {
        name: 'isExactly (strict equality) with type mismatch',
        expression: 'isExactly(5, "5")',
        result: 'false',
      },
      {
        name: 'greaterThan comparison (true)',
        expression: 'greaterThan(10, 5)',
        result: 'true',
      },
      {
        name: 'greaterThan comparison (false)',
        expression: 'greaterThan(5, 10)',
        result: 'false',
      },
      {
        name: 'greaterThanEquals comparison (equal)',
        expression: 'greaterThanEquals(5, 5)',
        result: 'true',
      },
      {
        name: 'lessThan comparison with variables',
        expression: 'lessThan(currentValue, maxValue)',
        result: 'true',
        data: { currentValue: 3, maxValue: 10 }
      },
      {
        name: 'lessThanEquals with spaced args',
        expression: 'lessThanEquals value maxLimit',
        result: 'false',
        data: { value: 15, maxLimit: 10 }
      }
    ];

    comparisonHelperTests.forEach((test) => {
      it(test.name, () => {
        const {ast, data, helpers, snippets} = getRendererConfig(test);
        const output = renderASTtoText({ast, data, helpers, snippets});
        expect(output).toBe(test.result);
      });
    });
  });

  describe('String helpers', () => {
    const stringHelperTests = [
      {
        name: 'join with array and delimiter',
        expression: 'join(items, "-")',
        result: 'one-two-three',
        data: { items: ['one', 'two', 'three'] }
      },
      {
        name: 'join with spaced args',
        expression: 'join items "+"',
        result: 'one+two+three',
        data: { items: ['one', 'two', 'three'] }
      },
      {
        name: 'join with empty array',
        expression: 'join emptyArray, ","',
        result: '',
        data: { emptyArray: [] }
      },
      {
        name: 'joinComma with array',
        expression: 'joinComma(items)',
        result: 'one, two, and three',
        data: { items: ['one', 'two', 'three'] }
      },
      {
        name: 'joinComma without oxford comma',
        expression: 'joinComma(items, false)',
        result: 'one, two and three',
        data: { items: ['one', 'two', 'three'] }
      },
      {
        name: 'joinComma with quotes',
        expression: 'joinComma(items, true, true)',
        result: '"one", "two", and "three"',
        data: { items: ['one', 'two', 'three'] }
      },
      {
        name: 'capitalize helper',
        expression: 'capitalize(text)',
        result: 'Hello world',
        data: { text: 'hello world' }
      },
      {
        name: 'titleCase helper',
        expression: 'titleCase(text)',
        result: 'Hello World',
        data: { text: 'hello world' }
      },
      {
        name: 'escapeHTML helper',
        expression: 'escapeHTML(htmlText)',
        result: '&amp;ltdiv&amp;gtHello&amp;lt/div&amp;gt',
        data: { htmlText: '<div>Hello</div>' }
      }
    ];

    stringHelperTests.forEach((test) => {
      it(test.name, () => {
        const {ast, data, helpers, snippets} = getRendererConfig(test);
        const output = renderASTtoText({ast, data, helpers, snippets});
        expect(output).toBe(test.result);
      });
    });
  });

  describe('Class manipulation helpers', () => {
    const classHelperTests = [
      {
        name: 'classes with array',
        expression: 'classes(["btn", "primary", "large"])',
        result: 'btn primary large',
      },
      {
        name: 'classes with individual strings',
        expression: 'classes(["btn", "primary", isDisabled ? "disabled" : ""])',
        result: 'btn primary disabled',
        data: { isDisabled: true }
      },
      {
        name: 'classMap with object',
        expression: 'classMap({ active: isActive, selected: isSelected, visible: true })',
        result: 'selected visible',
        data: { isActive: false, isSelected: true }
      },
      {
        name: 'selectedIf with truthy value',
        expression: 'selectedIf(isSelected)',
        result: 'selected',
        data: { isSelected: true }
      },
      {
        name: 'disabledIf with mixed syntax',
        expression: 'disabledIf(count < 1)',
        result: 'disabled',
        data: { count: 0 }
      },
      {
        name: 'checkedIf with function result',
        expression: 'checkedIf(isItemChecked(itemId))',
        result: 'checked',
        data: {
          itemId: 123,
          isItemChecked: (id) => id === 123
        }
      }
    ];

    classHelperTests.forEach((test) => {
      it(test.name, () => {
        const {ast, data, helpers, snippets} = getRendererConfig(test);
        const output = renderASTtoText({ast, data, helpers, snippets});
        expect(output).toBe(test.result);
      });
    });
  });

  describe('Data context and existence helpers', () => {
    const dataHelperTests = [
      {
        name: 'exists helper with defined value',
        expression: 'exists(user.name)',
        result: 'true',
        data: { user: { name: 'John' } }
      },
      {
        name: 'exists helper with undefined property',
        expression: 'exists(user.age)',
        result: 'false',
        data: { user: { name: 'John' } }
      },
      {
        name: 'isEmpty helper with empty array',
        expression: 'isEmpty(items)',
        result: 'true',
        data: { items: [] }
      },
      {
        name: 'isEmpty helper with non-empty array',
        expression: 'isEmpty(items)',
        result: 'false',
        data: { items: [1, 2, 3] }
      },
      {
        name: 'hasAny helper with empty array',
        expression: 'hasAny(items)',
        result: 'false',
        data: { items: [] }
      },
      {
        name: 'hasAny helper with non-empty array',
        expression: 'hasAny(items)',
        result: 'true',
        data: { items: [1, 2, 3] }
      },
      {
        name: 'stringify helper',
        expression: 'stringify(user)',
        result: '{"name":"John","role":"admin"}',
        data: { user: { name: 'John', role: 'admin' } }
      },
      {
        name: 'property access with dot notation',
        expression: 'user.preferences.theme',
        result: 'dark',
        data: {
          user: {
            preferences: { theme: 'dark' }
          }
        }
      },
      {
        name: 'range helper with start and stop',
        expression: 'range(1, 4)',
        resultContains: ['1', '2', '3'],
      },
      {
        name: 'arrayFromObject helper',
        expression: 'arrayFromObject(person)',
        resultContains: ['name', 'age'],
        data: {
          person: { name: 'Alice', age: 30 }
        }
      }
    ];

    dataHelperTests.forEach((test) => {
      it(test.name, () => {
        const {ast, data, helpers, snippets} = getRendererConfig(test);
        const output = renderASTtoText({ast, data, helpers, snippets});

        if (test.result !== undefined) {
          expect(output).toBe(test.result);
        } else if (test.resultContains) {
          test.resultContains.forEach(part => {
            expect(output).toContain(part);
          });
        }
      });
    });
  });

  describe('Method binding and context', () => {
    const methodBindingTests = [
      {
        name: 'Method binding with this context',
        expression: 'user.getFullName()',
        result: 'John Doe',
        data: {
          user: {
            firstName: 'John',
            lastName: 'Doe',
            getFullName() {
              return `${this.firstName} ${this.lastName}`;
            }
          }
        }
      },
      {
        name: 'Method with arguments and this context',
        expression: 'counter.add(5)',
        result: '10',
        data: {
          counter: {
            value: 5,
            add(n) {
              return this.value + n;
            }
          }
        }
      },
      {
        name: 'Deeply nested method call with this context',
        expression: 'app.user.profile.formatBio()',
        result: 'JOHN DOE - DEVELOPER',
        data: {
          app: {
            user: {
              profile: {
                name: 'John Doe',
                title: 'Developer',
                formatBio() {
                  return `${this.name} - ${this.title}`.toUpperCase();
                }
              }
            }
          }
        }
      },
      {
        name: 'Method returning object properties',
        expression: 'data.getConfig().theme',
        result: 'dark',
        data: {
          data: {
            config: { theme: 'dark' },
            getConfig() {
              return this.config;
            }
          }
        }
      }
    ];

    methodBindingTests.forEach((test) => {
      it(test.name, () => {
        const {ast, data, helpers, snippets} = getRendererConfig(test);
        const output = renderASTtoText({ast, data, helpers, snippets});
        expect(output).toBe(test.result);
      });
    });
  });
});
