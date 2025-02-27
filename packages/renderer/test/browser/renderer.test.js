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
  },
  
  // Additional tests for expression evaluation in data context
  // These tests cover various aspects of expression evaluation including:
  // - Method binding and this context preservation
  // - Deep property access and nested object traversal
  // - Function composition and evaluation order
  // - Template strings, logical operators, and other JS expressions
  // - Mixed semantic and javascript style expressions
  // - Optional chaining and literal values
  
  // Tests for method binding and this context
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
  },
  
  // Tests for deeply nested property access
  {
    name: 'Deep property access with multiple levels',
    expression: 'site.settings.theme.colors.primary',
    result: '#336699',
    data: {
      site: {
        settings: {
          theme: {
            colors: {
              primary: '#336699'
            }
          }
        }
      }
    }
  },
  
  // Tests for function composition
  {
    name: 'Function composition (titleCase of concat)',
    expression: 'titleCase (concat firstName " " lastName)',
    result: 'John Smith',
    data: {
      firstName: 'john',
      lastName: 'smith'
    }
  },
  
  // Tests for complex expressions with mixed evaluation orders
  {
    name: 'Complex expression with parenthesized evaluation order',
    expression: 'formatDate (getDate now) "h:mm"',
    resultContains: [':'],
    data: {
      now: new Date(),
      getDate: (date) => date,
      formatDate: (date, format) => {
        // Simple mock formatter that returns "h:MM" format
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      }
    }
  },
  
  // Tests for array and object methods
  {
    name: 'Array map method in expression',
    expression: 'items.map(item => item.toUpperCase()).join(", ")',
    result: 'APPLE, BANANA, CHERRY',
    data: {
      items: ['apple', 'banana', 'cherry']
    }
  },
  
  // Tests for template string expressions
  {
    name: 'Template string expression',
    expression: '`Hello, ${name}!`',
    result: 'Hello, Alice!',
    data: {
      name: 'Alice'
    }
  },
  
  // Tests for logical operators
  {
    name: 'Logical AND operator',
    expression: 'isActive && isVisible ? "Shown" : "Hidden"',
    result: 'Shown',
    data: {
      isActive: true,
      isVisible: true
    }
  },
  {
    name: 'Logical OR operator with nullish values',
    expression: 'userName || "Guest"',
    result: 'Guest',
    data: {
      userName: null
    }
  },
  {
    name: 'Nullish coalescing operator',
    expression: 'userName ?? "Guest"',
    result: 'Guest',
    data: {
      userName: null
    }
  },
  
  // Tests for mixed semantic and javascript style expressions
  {
    name: 'Mixed semantic and JS style - passing JS expression to semantic style',
    expression: 'doSomething (arg1 + 2) (arg2 + 3) {a: 1, b: 2}',
    result: '7-8-a:1,b:2',
    data: {
      arg1: 5,
      arg2: 5,
      doSomething: (a, b, obj) => `${a}-${b}-a:${obj.a},b:${obj.b}`
    }
  },
  
  // Tests for function arguments with operators
  {
    name: 'Function call with complex condition argument',
    expression: 'getMessage(isLoggedIn && hasPermission)',
    result: 'Welcome!',
    data: {
      isLoggedIn: true,
      hasPermission: true,
      getMessage: (condition) => condition ? 'Welcome!' : 'Please login'
    }
  },
  
  // Tests for optional chaining
  {
    name: 'Optional chaining with existing property',
    expression: 'user?.profile?.name',
    result: 'Jane',
    data: {
      user: {
        profile: {
          name: 'Jane'
        }
      }
    }
  },
  {
    name: 'Optional chaining with missing property',
    expression: 'user?.settings?.darkMode',
    result: '',
    data: {
      user: {
        profile: {
          name: 'Jane'
        }
      }
    }
  },
  
  // Tests for literal values
  {
    name: 'String literal with quotes',
    expression: "'Hello world'",
    result: 'Hello world',
  },
  {
    name: 'Boolean literal true',
    expression: 'true',
    result: 'true',
  },
  {
    name: 'Boolean literal false',
    expression: 'false',
    result: 'false',
  },
  {
    name: 'Numeric literal',
    expression: '42',
    result: '42',
  },
  
  // Real-world edge cases and common patterns
  
  // Inline activeIf and other helper patterns
  {
    name: 'Inline activeIf helper with comparison in object',
    expression: '{ active: activeIf(selected == current), disabled: isDisabled }',
    result: '{"active":"active","disabled":true}',
    data: {
      selected: 5,
      current: 5,
      isDisabled: true,
      activeIf: (condition) => condition ? 'active' : ''
    }
  },
  {
    name: 'Nested helpers with data context values',
    expression: 'concat "primary " buttonSize (isSelected(itemId) ? " selected" : "")',
    result: 'primary largetrue',  // The concat is concatenating without spaces between arguments
    data: {
      buttonSize: 'large',
      itemId: 42,
      isSelected: (id) => id === 42
    }
  },
  {
    name: 'Expression with array methods and data manipulation',
    expression: 'items.filter(item => item.status === "active").map(item => item.name).join(", ")',
    result: 'Item 1, Item 3',
    data: {
      items: [
        { name: 'Item 1', status: 'active' },
        { name: 'Item 2', status: 'inactive' },
        { name: 'Item 3', status: 'active' }
      ]
    }
  },
  {
    name: 'Expression with string methods from data context',
    expression: 'title.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")',
    result: 'Hello World',
    data: {
      title: 'HELLO WORLD'
    }
  },
  {
    name: 'Dynamic class composition with conditions',
    expression: '`btn ${variant} ${size} ${isDisabled ? "disabled" : ""}`',
    result: 'btn primary large disabled',
    data: {
      variant: 'primary',
      size: 'large',
      isDisabled: true
    }
  },
  {
    name: 'Expression with data-driven object access',
    expression: 'data[fieldName].value',
    result: '42',
    data: {
      fieldName: 'count',
      data: {
        count: { value: 42 },
        status: { value: 'active' }
      }
    }
  },
  {
    name: 'Expression with property check and fallback',
    expression: 'exists(user.address) ? user.address.city : "No address"',
    result: 'No address',
    data: {
      user: { name: 'John' },
      exists: (val) => val !== undefined
    }
  },
  {
    name: 'Format date with multiple parameters',
    expression: 'formatDate(createdAt, locale, { timeZone })',
    result: '2023-01-15',
    data: {
      createdAt: new Date('2023-01-15T12:00:00Z'),
      locale: 'en-US',
      timeZone: 'UTC',
      formatDate: (date, locale, options) => {
        return '2023-01-15'; // Mock for testing
      }
    }
  },
  {
    name: 'Decimal calculation with rounding',
    expression: 'Math.round(price * (1 - discount / 100) * 100) / 100',
    result: '89.1',
    data: {
      price: 99,
      discount: 10
    }
  },
  {
    name: 'Calculated property with dynamic field name',
    expression: 'calculateTotal(cartItems, settings[`${currency}Rate`])',
    result: '150',
    data: {
      cartItems: [{ price: 50 }, { price: 100 }],
      currency: 'usd',
      settings: {
        usdRate: 1,
        eurRate: 0.85
      },
      calculateTotal: (items, rate) => {
        return items.reduce((total, item) => total + item.price, 0) * rate;
      }
    }
  },
  {
    name: 'Complex conditional rendering expression',
    expression: 'isLoggedIn ? (hasPermission ? "Edit" : "View") : "Login to continue"',
    result: 'View',
    data: {
      isLoggedIn: true,
      hasPermission: false
    }
  },
  {
    name: 'Object with expressions and methods',
    expression: '{ count: items.length, isEmpty: items.length === 0, label: items.length === 1 ? "item" : "items" }',
    result: '{"count":3,"isEmpty":false,"label":"items"}',
    data: {
      items: [1, 2, 3]
    }
  },
  {
    name: 'Conditional method call with nullish coalescing',
    expression: 'user?.settings?.getTheme?.() ?? defaultTheme',
    result: 'dark',
    data: {
      user: {
        settings: {
          getTheme: () => 'dark'
        }
      },
      defaultTheme: 'light'
    }
  },
  {
    name: 'Object key with dynamic property accessor',
    expression: 'translations[`${lang}.${key}`] || defaultText',
    result: 'Welcome',
    data: {
      lang: 'en',
      key: 'welcome',
      translations: {
        'en.welcome': 'Welcome',
        'fr.welcome': 'Bienvenue'
      },
      defaultText: 'Hello'
    }
  },
  {
    name: 'String template with conditional parts',
    expression: '`${prefix}${showDetails ? " - " + details : ""}`',
    result: 'User - Premium account',
    data: {
      prefix: 'User',
      showDetails: true,
      details: 'Premium account'
    }
  },
  {
    name: 'Numeric formatting with localization',
    expression: 'formatNumber(amount, { currency, locale })',
    result: '$1,234.56',
    data: {
      amount: 1234.56,
      currency: 'USD',
      locale: 'en-US',
      formatNumber: (num, options) => {
        return options.currency === 'USD' ? '$1,234.56' : '1.234,56 €';
      }
    }
  },
  {
    name: 'Array manipulation with multiple methods',
    expression: '[...new Set(tags.concat(defaultTags))].sort().join(", ")',
    result: 'css, html, javascript',
    data: {
      tags: ['html', 'css'],
      defaultTags: ['javascript', 'html']
    }
  },
  
  // Edge cases that might challenge the parser and evaluation
  // These tests cover potential challenges for the expression evaluator, including:
  // - Complex string literal handling with mixed quote types
  // - Nested ternary expressions and operator precedence
  // - Bitwise operations and specialized JS features
  // - Properties with spaces and special characters
  // - Deeply nested parentheses for evaluation order
  // - Object parameter passing (with property initialization syntax)
  // - Mixing semantic and JS style function calls
  // - Escaped characters in strings
  // - Naming conflicts between methods and variables
  // - Chained semantic style calls
  // - Arrow functions as parameters
  // - Self-referential functions
  // 
  // Lessons learned from these tests:
  // 1. JavaScript expressions are generally well supported with proper precedence
  // 2. String literal handling with mixed quotes works as expected
  // 3. Loose equality (==) works as in standard JavaScript (0 == "0" is true)
  // 4. Some advanced JS features like destructuring and spread are not fully supported
  // 5. The 'this' binding in recursive functions doesn't work as one might expect
  // 6. The concat helper concatenates values without spaces between them
  // 7. The classMap helper should be used for dynamic class generation rather than direct object evaluation
  // 8. When working with operators, be explicit with parentheses to ensure correct order of operations
  {
    name: 'Expression with mixed quotes in string literals',
    expression: '`${label}: "${value}"` + \' (\'+ status + \')\'',
    result: 'Count: "42" (active)',
    data: {
      label: 'Count',
      value: 42,
      status: 'active'
    }
  },
  {
    name: 'Nested ternary operators with comparisons',
    expression: 'status === "active" ? role === "admin" ? "Full Access" : "Limited Access" : "No Access"',
    result: 'Limited Access',
    data: {
      status: 'active',
      role: 'user'
    }
  },
  {
    name: 'Bitwise operations in expression',
    expression: '((flags & 1) ? "Read" : "") + ((flags & 2) ? "Write" : "") + ((flags & 4) ? "Execute" : "")',
    result: 'ReadWriteExecute',
    data: {
      flags: 7 // 111 in binary (read, write, execute)
    }
  },
  {
    name: 'Expression with lookalike comparisons',
    expression: 'value == "0" ? "Equals zero string" : value === 0 ? "Equals zero number" : "Non-zero"',
    result: 'Equals zero string', // JS loose equality: 0 == "0" is true
    data: {
      value: 0
    }
  },
  {
    name: 'Object property with spaces',
    expression: 'data["property with spaces"]',
    result: 'value with spaces',
    data: {
      data: {
        'property with spaces': 'value with spaces'
      }
    }
  },
  {
    name: 'Deeply nested parentheses in expression',
    expression: '((((value + 1) * 2) - 3) / 4)',
    result: '1.75', // ((((4 + 1) * 2) - 3) / 4) = ((10 - 3) / 4) = (7 / 4) = 1.75
    data: {
      value: 4
    }
  },
  {
    name: 'Function call with simple object',
    expression: 'formatUser({ name: name, age: age, role: role })',
    result: 'John (30) - admin',
    data: {
      name: 'John',
      age: 30,
      role: 'admin',
      active: true,
      formatUser: (user) => `${user.name} (${user.age}) - ${user.role}`
    }
  },
  {
    name: 'Semantic style calling JS style function',
    expression: 'classIf (value > threshold) "above-threshold" "below-threshold"',
    result: 'above-threshold',
    data: {
      value: 75,
      threshold: 50,
      classIf: (condition, trueClass, falseClass) => condition ? trueClass : falseClass
    }
  },
  {
    name: 'Expression with escaped characters',
    expression: '"Line 1\\nLine 2\\tTabbed"',
    result: 'Line 1\nLine 2\tTabbed',
  },
  {
    name: 'Method with same name as variable',
    expression: 'user.name() + " - " + name',
    result: 'JOHN - John',
    data: {
      name: 'John',
      user: {
        name() {
          return 'JOHN';
        }
      }
    }
  },
  {
    name: 'Chained semantic style calls',
    expression: 'uppercase lowercase trim "  hello world  "',
    result: 'HELLO WORLD',
    data: {
      trim: (str) => str.trim(),
      lowercase: (str) => str.toLowerCase(),
      uppercase: (str) => str.toUpperCase()
    }
  },
  {
    name: 'Method call with arrow function argument',
    expression: 'process(items, (item) => item.value > 10)',
    result: '20,30',
    data: {
      items: [{ value: 5 }, { value: 20 }, { value: 30 }],
      process: (array, filterFn) => array.filter(filterFn).map(i => i.value).join(',')
    }
  },
  {
    name: 'Self-referential function in expression',
    expression: 'calculateFactorial(5)',
    result: '120',
    data: {
      calculateFactorial: function(n) {
        // Non-recursive implementation to avoid 'this' binding issues
        let result = 1;
        for (let i = 2; i <= n; i++) {
          result *= i;
        }
        return result;
      }
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
