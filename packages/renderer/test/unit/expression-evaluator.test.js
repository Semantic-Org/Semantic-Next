import { Signal } from '@semantic-ui/reactivity';
import { describe, expect, it } from 'vitest';

import { ExpressionEvaluator } from '../../src/expression-evaluator.js';

/*******************************
        Test Fixtures
*******************************/

const helpers = {
  addOne: (v = 0) => v + 1,
  concat: (...args) => args.join(''),
  not: (a) => !a,
  maybe: (cond, a, b) => (cond ? a : b),
  classIf: (expr, trueClass = '', falseClass = '') => expr ? `${trueClass} ` : falseClass ? `${falseClass} ` : '',
  exists: (a) => a != null && a !== '',
  join: (arr, d) => (arr ? arr.join(d) : ''),
  getValue: (obj = {}, prop) => obj[prop],
  activeIf: (expr) => (expr ? 'active' : ''),
  classMap: (obj) =>
    Object.entries(obj)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(' '),
  isClient: true,
};

const data = {
  count: 42,
  value: 1,
  label: 'Submit',
  isOpen: false,
  isActive: true,
  disabled: false,
  isDog: true,
  fruit: 'cherry',
  items: ['one', 'two', 'three'],
  user: { name: 'Jack', role: 'admin', settings: { theme: 'dark' } },
};

const signalData = {
  count: new Signal(42),
  value: new Signal(1),
  label: 'Submit',
  isOpen: new Signal(false),
  isActive: new Signal(true),
  fruit: new Signal('cherry'),
  user: { name: new Signal('Jack'), role: 'admin', settings: { theme: 'dark' } },
};

function make(overrides = {}) {
  return new ExpressionEvaluator({
    data: overrides.data ?? data,
    helpers: overrides.helpers ?? helpers,
    ...overrides,
  });
}

/*******************************
        getLiteralValue
*******************************/

describe('getLiteralValue', () => {
  const ee = make();

  it('parses single-quoted strings', () => {
    expect(ee.getLiteralValue("'hello'")).toBe('hello');
  });

  it('parses double-quoted strings', () => {
    expect(ee.getLiteralValue('"hello"')).toBe('hello');
  });

  it('handles escaped quotes inside strings', () => {
    expect(ee.getLiteralValue("'it\\'s'")).toBe("it's");
    expect(ee.getLiteralValue('"say \\"hi\\""')).toBe('say "hi"');
  });

  it('parses empty strings', () => {
    expect(ee.getLiteralValue("''")).toBe('');
    expect(ee.getLiteralValue('""')).toBe('');
  });

  it('parses true and false', () => {
    expect(ee.getLiteralValue('true')).toBe(true);
    expect(ee.getLiteralValue('false')).toBe(false);
  });

  it('parses integers', () => {
    expect(ee.getLiteralValue('42')).toBe(42);
    expect(ee.getLiteralValue('0')).toBe(0);
  });

  it('parses negative numbers', () => {
    expect(ee.getLiteralValue('-5')).toBe(-5);
  });

  it('parses floats', () => {
    expect(ee.getLiteralValue('3.14')).toBe(3.14);
    expect(ee.getLiteralValue('.5')).toBe(0.5);
  });

  it('parses numbers with leading +', () => {
    expect(ee.getLiteralValue('+3')).toBe(3);
  });

  it('returns undefined for identifiers', () => {
    expect(ee.getLiteralValue('count')).toBeUndefined();
    expect(ee.getLiteralValue('myVar')).toBeUndefined();
    expect(ee.getLiteralValue('_private')).toBeUndefined();
  });

  it('returns undefined for a single quote character', () => {
    // length 1, so the first guard (length > 1) prevents matching
    expect(ee.getLiteralValue("'")).toBeUndefined();
  });
});

/*******************************
       classifyExpression
*******************************/

describe('classifyExpression', () => {
  const ee = make();

  it('returns false for single-token identifiers', () => {
    expect(ee.classifyExpression('count')).toBe(false);
    expect(ee.classifyExpression('user.name')).toBe(false);
  });

  it('returns true for multi-token Lisp-style (no JS operators)', () => {
    expect(ee.classifyExpression('addOne value')).toBe(true);
    expect(ee.classifyExpression("maybe disabled 'off' 'on'")).toBe(true);
    expect(ee.classifyExpression("classIf isActive 'active'")).toBe(true);
  });

  it('returns false when JS operators are present outside quotes', () => {
    expect(ee.classifyExpression('count + 1')).toBe(false);
    expect(ee.classifyExpression('isOpen ? "yes" : "no"')).toBe(false);
    expect(ee.classifyExpression('value === 5')).toBe(false);
    expect(ee.classifyExpression('!disabled')).toBe(false);
  });

  it('ignores JS operators inside quoted strings', () => {
    // The + is inside quotes, so stripped expression is just identifiers
    expect(ee.classifyExpression("concat 'a+b' label")).toBe(true);
  });

  it('returns false for expressions without spaces', () => {
    expect(ee.classifyExpression('addOne(value)')).toBe(false);
  });

  it('returns cached result on second call', () => {
    const expr = 'someUnique testExpr';
    const first = ee.classifyExpression(expr);
    const second = ee.classifyExpression(expr);
    expect(first).toBe(second);
  });
});

/*******************************
     addParensToExpression
*******************************/

describe('addParensToExpression', () => {
  const ee = make();

  it('wraps inline objects with parens', () => {
    expect(ee.addParensToExpression("getValue {one: 'two'} 'one'")).toBe(
      "getValue ({one: 'two'}) 'one'",
    );
  });

  it('wraps inline arrays with parens', () => {
    expect(ee.addParensToExpression("join ['a','b'] ' '")).toBe(
      "join (['a','b']) ' '",
    );
  });

  it('wraps object at start of expression', () => {
    expect(ee.addParensToExpression('{a: 1} rest')).toBe('({a: 1}) rest');
  });

  it('wraps object at end of expression', () => {
    expect(ee.addParensToExpression('fn {a: 1}')).toBe('fn ({a: 1})');
  });

  it('leaves expressions without inline objects/arrays unchanged', () => {
    expect(ee.addParensToExpression('addOne value')).toBe('addOne value');
  });

  it('handles empty string', () => {
    expect(ee.addParensToExpression('')).toBe('');
  });
});

/*******************************
       getExpressionArray
*******************************/

describe('getExpressionArray', () => {
  const ee = make();

  it('tokenizes simple spaced expression', () => {
    expect(ee.getExpressionArray('addOne value')).toEqual(['addOne', 'value']);
  });

  it('handles parenthesized sub-expressions', () => {
    expect(ee.getExpressionArray('maybe (not disabled) yes')).toEqual([
      'maybe',
      'not disabled',
      'yes',
    ]);
  });

  it('preserves quoted strings as single tokens', () => {
    expect(ee.getExpressionArray("classIf isActive 'active'")).toEqual([
      'classIf',
      'isActive',
      "'active'",
    ]);
  });

  it('handles nested parentheses', () => {
    expect(ee.getExpressionArray('a (b (c d))')).toEqual([
      'a',
      'b (c d)',
    ]);
  });

  it('handles single token', () => {
    expect(ee.getExpressionArray('count')).toEqual(['count']);
  });
});

/*******************************
      getDeepDataValue
*******************************/

describe('getDeepDataValue', () => {
  const ee = make();

  it('returns simple key value', () => {
    expect(ee.getDeepDataValue(data, 'count')).toBe(42);
  });

  it('traverses dotted path', () => {
    expect(ee.getDeepDataValue(data, 'user.name')).toBe('Jack');
  });

  it('traverses deep dotted path', () => {
    expect(ee.getDeepDataValue(data, 'user.settings.theme')).toBe('dark');
  });

  it('returns undefined for missing keys', () => {
    expect(ee.getDeepDataValue(data, 'user.missing.deep')).toBeUndefined();
  });

  it('returns undefined for null intermediate', () => {
    expect(ee.getDeepDataValue({ a: null }, 'a.b')).toBeUndefined();
  });

  it('unwraps Signals at simple key', () => {
    const obj = { x: new Signal(99) };
    expect(ee.getDeepDataValue(obj, 'x')).toBe(99);
  });

  it('unwraps Signals mid-path', () => {
    const obj = { a: new Signal({ b: 'deep' }) };
    expect(ee.getDeepDataValue(obj, 'a.b')).toBe('deep');
  });

  it('calls functions mid-path', () => {
    const obj = { a: () => ({ b: 'called' }) };
    expect(ee.getDeepDataValue(obj, 'a.b')).toBe('called');
  });
});

/*******************************
      evaluateJavascript
*******************************/

describe('evaluateJavascript', () => {
  const ee = make();

  it('evaluates simple arithmetic', () => {
    expect(ee.evaluateJavascript('1 + 2', {})).toBe(3);
  });

  it('accesses data context', () => {
    expect(ee.evaluateJavascript('count + 1', data)).toBe(43);
  });

  it('accesses helpers', () => {
    expect(ee.evaluateJavascript('addOne(5)', {})).toBe(6);
  });

  it('accesses helper boolean values', () => {
    expect(ee.evaluateJavascript('isClient', {})).toBe(true);
  });

  it('auto-unwraps Signals via proxy', () => {
    const ctx = { val: new Signal(10) };
    expect(ee.evaluateJavascript('val + 1', ctx)).toBe(11);
  });

  it('returns undefined for invalid JS', () => {
    expect(ee.evaluateJavascript('}{bad', {})).toBeUndefined();
  });

  it('filters debugger keyword from proxy has() trap', () => {
    // The 'debugger' keyword should not be resolvable via the proxy
    // so it doesn't conflict with the reserved word inside with(ctx){}
    expect(ee.evaluateJavascript('typeof debugger', {})).toBeUndefined();
  });

  it('clears jsContext after evaluation (no leakage)', () => {
    ee.evaluateJavascript('count', data);
    expect(ee.jsContext).toBeNull();
  });

  it('clears jsContext even after error', () => {
    ee.evaluateJavascript('}{', data);
    expect(ee.jsContext).toBeNull();
  });

  it('includeHelpers: false uses separate proxy without helpers', () => {
    const ctx = { count: 10 };
    expect(ee.evaluateJavascript('count', ctx, { includeHelpers: false })).toBe(10);
    // Helper should not be accessible
    expect(ee.evaluateJavascript('addOne(1)', ctx, { includeHelpers: false })).toBeUndefined();
  });
});

/*******************************
      lookupTokenValue
*******************************/

describe('lookupTokenValue', () => {
  const ee = make();

  it('resolves string literals', () => {
    expect(ee.lookupTokenValue("'hello'", data)).toBe('hello');
  });

  it('resolves numeric literals', () => {
    expect(ee.lookupTokenValue('42', data)).toBe(42);
  });

  it('resolves boolean literals', () => {
    expect(ee.lookupTokenValue('true', data)).toBe(true);
    expect(ee.lookupTokenValue('false', data)).toBe(false);
  });

  it('resolves simple data keys', () => {
    expect(ee.lookupTokenValue('count', data)).toBe(42);
    expect(ee.lookupTokenValue('label', data)).toBe('Submit');
  });

  it('unwraps Signal data values', () => {
    expect(ee.lookupTokenValue('count', signalData)).toBe(42);
  });

  it('resolves dotted paths', () => {
    expect(ee.lookupTokenValue('user.name', data)).toBe('Jack');
    expect(ee.lookupTokenValue('user.settings.theme', data)).toBe('dark');
  });

  it('returns helper functions', () => {
    const result = ee.lookupTokenValue('addOne', data);
    expect(typeof result).toBe('function');
  });

  it('skips JS eval for simple identifiers not in data/helpers', () => {
    // Simple identifier that doesn't exist anywhere — should return
    // undefined without hitting evaluateJavascript
    expect(ee.lookupTokenValue('nonexistent', data)).toBeUndefined();
  });

  it('skips JS eval for simple dotted paths not in data', () => {
    expect(ee.lookupTokenValue('foo.bar.baz', data)).toBeUndefined();
  });

  it('falls through to JS eval for complex expressions', () => {
    expect(ee.lookupTokenValue('count + 1', data)).toBe(43);
  });

  it('returns undefined for empty token', () => {
    expect(ee.lookupTokenValue('', data)).toBeUndefined();
  });
});

/*******************************
      accessTokenValue
*******************************/

describe('accessTokenValue', () => {
  const ee = make();

  it('returns plain values unchanged', () => {
    expect(ee.accessTokenValue(42, 'count', data)).toBe(42);
    expect(ee.accessTokenValue('hello', 'label', data)).toBe('hello');
  });

  it('unwraps Signal values', () => {
    const sig = new Signal('wrapped');
    expect(ee.accessTokenValue(sig, 'x', data)).toBe('wrapped');
  });

  it('returns undefined for undefined input', () => {
    expect(ee.accessTokenValue(undefined, 'x', data)).toBeUndefined();
  });

  it('binds dotted method to parent context', () => {
    const obj = {
      inner: {
        greeting: 'hi',
        greet() {
          return this.greeting;
        },
      },
    };
    const fn = obj.inner.greet;
    const result = ee.accessTokenValue(fn, 'inner.greet', obj);
    // Should be bound — calling it returns the parent's value
    expect(result()).toBe('hi');
  });
});

/*******************************
    lookupExpressionValue
*******************************/

describe('lookupExpressionValue', () => {
  const ee = make();

  it('resolves simple identifiers', () => {
    expect(ee.lookupExpressionValue('count', data)).toBe(42);
    expect(ee.lookupExpressionValue('label', data)).toBe('Submit');
  });

  it('resolves dotted paths', () => {
    expect(ee.lookupExpressionValue('user.name', data)).toBe('Jack');
  });

  it('resolves JS expressions', () => {
    expect(ee.lookupExpressionValue('count + 1', data)).toBe(43);
  });

  it('resolves JS ternary', () => {
    expect(ee.lookupExpressionValue('isOpen ? "open" : "closed"', data)).toBe('closed');
    expect(ee.lookupExpressionValue('isActive ? "yes" : "no"', data)).toBe('yes');
  });

  it('resolves Lisp-style helper calls', () => {
    expect(ee.lookupExpressionValue('addOne value', data)).toBe(2);
  });

  it('resolves Lisp-style with string args', () => {
    expect(ee.lookupExpressionValue("maybe disabled 'off' 'on'", data)).toBe('on');
  });

  it('resolves nested parenthesized sub-expressions', () => {
    expect(ee.lookupExpressionValue("maybe (not disabled) 'on' 'off'", data)).toBe('on');
  });

  it('resolves mixed Lisp + JS', () => {
    expect(
      ee.lookupExpressionValue("concat 'my ' 'friend ' (isDog ? 'simon' : 'pookie')", data),
    ).toBe('my friend simon');
  });

  it('calls zero-arg functions returned from data', () => {
    const fnData = { ...data, getter: () => 'called' };
    const ee2 = make({ data: fnData });
    expect(ee2.lookupExpressionValue('getter', fnData)).toBe('called');
  });

  it('does not re-enter the same expression (cycle detection)', () => {
    // If an expression resolves to itself via helper trickery, it should
    // break the cycle and return undefined rather than stack-overflowing
    const cyclicHelpers = {
      ...helpers,
      loop: () => undefined,
    };
    const ee2 = make({ helpers: cyclicHelpers });
    // This should not throw
    expect(ee2.lookupExpressionValue('loop value', data)).toBeUndefined();
  });

  it('handles array-type expression input', () => {
    // When called internally with a pre-parsed array
    expect(ee.lookupExpressionValue(['addOne', 'value'], data)).toBe(2);
  });
});

/*******************************
          evaluate
*******************************/

describe('evaluate', () => {
  const ee = make();

  it('evaluates string expressions', () => {
    expect(ee.evaluate('count', data)).toBe(42);
    expect(ee.evaluate('count + 1', data)).toBe(43);
  });

  it('passes through non-string values', () => {
    expect(ee.evaluate(42)).toBe(42);
    expect(ee.evaluate(null)).toBeNull();
    expect(ee.evaluate(undefined)).toBeUndefined();
    const arr = [1, 2];
    expect(ee.evaluate(arr)).toBe(arr);
  });

  it('uses default data when none provided', () => {
    expect(ee.evaluate('count')).toBe(42);
  });

  it('calls dataVersion.depend() when dataVersion is set', () => {
    let depended = false;
    const ee2 = make({
      dataVersion: {
        depend: () => {
          depended = true;
        },
      },
    });
    ee2.evaluate('count', data);
    expect(depended).toBe(true);
  });

  it('does not call depend for non-string input', () => {
    let depended = false;
    const ee2 = make({
      dataVersion: {
        depend: () => {
          depended = true;
        },
      },
    });
    ee2.evaluate(42);
    expect(depended).toBe(false);
  });
});

/*******************************
     Signal integration
*******************************/

describe('Signal integration', () => {
  const ee = make({ data: signalData });

  it('unwraps Signal for simple identifier', () => {
    expect(ee.evaluate('count', signalData)).toBe(42);
  });

  it('unwraps Signal for dotted path', () => {
    expect(ee.evaluate('user.name', signalData)).toBe('Jack');
  });

  it('unwraps Signal in JS expression', () => {
    expect(ee.evaluate('count + 1', signalData)).toBe(43);
  });

  it('unwraps Signal in ternary', () => {
    expect(ee.evaluate('isOpen ? "open" : "closed"', signalData)).toBe('closed');
  });

  it('unwraps Signal in Lisp-style helper call', () => {
    expect(ee.evaluate("classIf isActive 'active'", signalData)).toBe('active ');
  });
});

/*******************************
     Inline objects & arrays
*******************************/

describe('inline objects and arrays', () => {
  const ee = make();

  it('evaluates inline object argument', () => {
    expect(ee.evaluate("getValue {one: 'two'} 'one'", data)).toBe('two');
  });

  it('evaluates inline array argument', () => {
    expect(ee.evaluate("join ['1', '2', '3'] ' and '", data)).toBe('1 and 2 and 3');
  });

  it('evaluates classMap with inline object', () => {
    expect(
      ee.evaluate('classMap { one: true, two: true, three: isActive }', data),
    ).toBe('one two three');
  });
});

/*******************************
     JS-style helper calls
*******************************/

describe('JS-style function calls', () => {
  const ee = make();

  it('evaluates helper with computed argument', () => {
    expect(ee.evaluate('addOne(value + 1)', data)).toBe(3);
  });

  it('evaluates equality + helper', () => {
    expect(ee.evaluate('activeIf(value == 1)', data)).toBe('active');
    expect(ee.evaluate('activeIf(value == 99)', data)).toBe('');
  });
});

/*******************************
     Edge cases — JS tricking
       the Lisp engine
*******************************/

describe('JS expressions inside Lisp structure', () => {
  const ee = make();

  it('JS call inside Lisp parens — concat "a" (addOne(1))', () => {
    expect(ee.evaluate("concat 'a' (addOne(1))", data)).toBe('a2');
  });

  it('JS ternary inside Lisp parens with helper — maybe (value > 0) "pos" "neg"', () => {
    const withMaybe = make({
      helpers: { ...helpers, maybe: (c, a, b) => (c ? a : b) },
    });
    expect(withMaybe.evaluate("maybe (value > 0) 'pos' 'neg'", data)).toBe('pos');
  });

  it('JS arithmetic as Lisp argument — addOne (value * 10)', () => {
    expect(ee.evaluate('addOne (value * 10)', data)).toBe(11);
  });

  it('nested helper without parens — addOne addOne value', () => {
    // Right-to-left: addOne(value) = 2, then addOne(2) = 3
    expect(ee.evaluate('addOne addOne value', data)).toBe(3);
  });

  it('helper with multiple resolved sub-expressions', () => {
    expect(ee.evaluate('concat (addOne value) (addOne count)', data)).toBe('243');
  });

  it('boolean helper with JS comparison in parens', () => {
    expect(ee.evaluate("classIf (value == 1) 'yes' 'no'", data)).toBe('yes ');
    expect(ee.evaluate("classIf (value == 99) 'yes' 'no'", data)).toBe('no ');
  });

  it('data key shadows helper — data wins for simple lookup', () => {
    const shadowData = { ...data, addOne: 'shadowed' };
    const ee2 = make({ data: shadowData });
    expect(ee2.evaluate('addOne', shadowData)).toBe('shadowed');
  });

  it('template-style method call from kitchen sink — addOne value 0', () => {
    // Matches the kitchen-sink component where addOne has two params
    const ee2 = make({
      helpers: { ...helpers, addOne: (v = 0, v2 = 0) => v + v2 + 1 },
    });
    expect(ee2.evaluate('addOne value 0', data)).toBe(2);
  });
});

/*******************************
     Edge cases — reserved words
       and special data keys
*******************************/

describe('reserved words and special data keys', () => {
  it('debugger as data key is not accessible via proxy', () => {
    const ee = make({ data: { debugger: 'should not resolve' } });
    // The proxy filters 'debugger' in has() — it won't be found
    const result = ee.evaluateJavascript('typeof debugger', { debugger: 'value' });
    expect(result).toBeUndefined();
  });

  it('data key named "undefined" does not break', () => {
    const ee = make();
    expect(ee.evaluate('undefined', { undefined: 'trick' })).toBe('trick');
  });

  it('data key named "true" does not shadow literal', () => {
    const ee = make();
    // getLiteralValue matches 'true' first, so this returns the boolean
    expect(ee.lookupTokenValue('true', { true: 'surprise' })).toBe(true);
  });

  it('null resolves to JS null', () => {
    const ee = make();
    expect(ee.evaluate('null', data)).toBeNull();
  });

  it('empty expression returns undefined', () => {
    const ee = make();
    expect(ee.evaluate('', data)).toBeUndefined();
  });

  it('whitespace-only expression returns undefined', () => {
    const ee = make();
    expect(ee.evaluate('   ', data)).toBeUndefined();
  });
});

/*******************************
     Edge cases — argument
       collection correctness
*******************************/

describe('argument collection in Lisp evaluation', () => {
  it('function receives all arguments to its right', () => {
    const ee = make({
      helpers: { ...helpers, list: (...args) => args },
    });
    const result = ee.evaluate("list 'a' 'b' 'c'", data);
    expect(result).toEqual(['a', 'b', 'c']);
  });

  it('function receives resolved sub-expression results', () => {
    const ee = make({
      helpers: { ...helpers, list: (...args) => args },
    });
    const result = ee.evaluate('list (addOne 1) (addOne 2)', data);
    expect(result).toEqual([2, 3]);
  });

  it('rightmost function gets no arguments', () => {
    // In "concat (not disabled)", not is rightmost function in its group
    // It should be called with disabled (false) and return true
    expect(make().evaluate('concat (not disabled)', data)).toBe('true');
  });

  it('mixed literals and data in argument positions', () => {
    const ee = make({
      helpers: { ...helpers, list: (...args) => args },
    });
    const result = ee.evaluate("list value 'hello' true 42", data);
    expect(result).toEqual([1, 'hello', true, 42]);
  });

  it('helper that returns falsy values passes them correctly', () => {
    const ee = make({
      helpers: { ...helpers, zero: () => 0, list: (...args) => args },
    });
    const result = ee.evaluate("list (zero) 'after'", data);
    expect(result).toEqual([0, 'after']);
  });
});

/*******************************
     Realistic mixed batch
*******************************/

describe('mixed batch — realistic component render expressions', () => {
  const ee = make();

  const cases = [
    ['label', 'Submit'],
    ['count', 42],
    ['user.name', 'Jack'],
    ['user.settings.theme', 'dark'],
    ['count + 1', 43],
    ["classIf isActive 'active'", 'active '],
    ['isOpen ? "open" : "closed"', 'closed'],
    ["maybe disabled 'off' 'on'", 'on'],
    ["concat 'my ' 'friend ' (isDog ? 'simon' : 'pookie')", 'my friend simon'],
    ['addOne(value + 1)', 3],
    ["getValue {one: 'two'} 'one'", 'two'],
    ["fruit == 'cherry' ? 'yum' : 'yuck'", 'yum'],
    ['addOne value', 2],
    ["maybe (not disabled) 'on' 'off'", 'on'],
    ["join ['1', '2', '3'] ' and '", '1 and 2 and 3'],
  ];

  for (const [expression, expected] of cases) {
    it(`{${expression}} → ${JSON.stringify(expected)}`, () => {
      expect(ee.evaluate(expression, data)).toEqual(expected);
    });
  }
});
