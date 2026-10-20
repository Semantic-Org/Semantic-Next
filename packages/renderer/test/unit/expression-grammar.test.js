import { Signal } from '@semantic-ui/reactivity';
import { TemplateHelpers } from '@semantic-ui/templating';
import { describe, expect, it } from 'vitest';

import { ExpressionEvaluator } from '../../src/expression-evaluator.js';

/*
  the expression grammar as a reader of component-templating.md and the
  expressions-kitchen-sink example expects it, one case per form. the data is the
  kitchen sink's context the way the renderer flattens it, instance methods beside
  settings and state, with the rest of the matrix's values alongside
*/

/*******************************
          Fixtures
*******************************/

const date = new Date(2026, 0, 2, 3, 4, 5);
const TIME = /^\d{1,2}:\d{2}:\d{2} [ap]m$/;

const pet = () => ({
  name: 'Simon',
  treats: 3,
  describe() {
    return `${this.name} has ${this.treats} treats`;
  },
});

const data = {
  value: 1,
  date,
  timezone: new Signal('PST'),
  fruit: new Signal('cherry'),
  isTrue: () => true,
  isDog: () => true,
  addOne(value = 0, value2 = 0) {
    return value + value2 + 1;
  },
  getValue(obj = {}, prop) {
    return obj[prop];
  },
  pet,

  count: 42,
  label: 'Submit',
  isActive: true,
  isOpen: new Signal(false),
  empty: null,
  note: 'x',
  status: 'success',
  items: ['one', 'two', 'three'],
  numbers: [5, 10, 15],
  stats: { total: 42, successCount: 28 },
  user: { name: 'Jack', role: 'admin', settings: { theme: 'dark' }, roles: ['admin', 'editor'] },
  profile: new Signal({ name: 'Sig', prefs: new Signal({ theme: 'light' }) }),
  getAccount: () => ({ loggedIn: new Signal(true) }),
  getFilterFn: () => (item) => item.length <= 5,
};

const helpers = {
  ...TemplateHelpers,
  list: (...args) => args,
  double: (n = 0) => n * 2,
  makeAdder: (n) => (m) => n + m,
  getCount: () => new Signal(7),
  getUser: () => new Signal({ name: 'Sig' }),
  fetchUsers: () => Promise.resolve(['a']),
  currentRoute: () => ({
    name: 'home',
    url: { pathname: '/' },
    describe() {
      return `at ${this.name}`;
    },
  }),
};

const evaluator = new ExpressionEvaluator({ data, helpers });

const read = (expression, context = data) => evaluator.evaluate(expression, context);

const show = (expression) => `{${expression.replace(/\n/g, '\\n')}}`;

// one form per row, the title saying what a reader expects of it
function pin(title, expression, expected, context) {
  it(`${title}: ${show(expression)}`, () => {
    expect(read(expression, context)).toEqual(expected);
  });
}

/*******************************
        Kitchen Sink
*******************************/

describe('the kitchen sink, row by row', () => {
  pin('basic output', 'value', 1);
  pin('path reaching through a function', 'pet.name', 'Simon');
  pin('method keeps its own object as this', 'pet.describe', 'Simon has 3 treats');
  pin('inline arithmetic', 'value + 2 * 5', 11);
  pin('inline arithmetic with order of operations', '(value + 2) * 5', 15);
  pin('inline ternary', "isTrue ? 'yes' : 'no'", 'yes');
  pin('calling a method with spaced arguments', 'addOne value', 2);

  it("helper with JS style: {formatDate(date, 'h:mm:ss a', { timezone: timezone })}", () => {
    expect(read("formatDate(date, 'h:mm:ss a', { timezone: timezone })")).toMatch(TIME);
  });

  pin(
    'inline js inside a Lisp method',
    "concat 'my ' 'friend ' (isDog ? 'simon dog' : 'pookie cat')",
    'my friend simon dog',
  );
  pin('using a signal in js', "fruit == 'cherry' ? 'yum' : 'yuck'", 'yum');
  pin('method call with data context evaluation', 'activeIf(value == 1)', 'active ');

  it("method using mixed syntax: {formatDate date 'h:mm:ss a' { timezone: timezone }}", () => {
    const mixed = read("formatDate date 'h:mm:ss a' { timezone: timezone }");
    expect(mixed).toMatch(TIME);
    expect(mixed).toBe(read("formatDate(date, 'h:mm:ss a', { timezone: timezone })"));
  });

  pin('helper with an inline object', 'classMap { one: true, two: true, three: date }', 'one two three ');
  pin('the iterable of {#each number in [value, 2, 3]}', '[value, 2, 3]', [1, 2, 3]);
  pin('method with an inline array', "join ['1', '2', '3'] ' and '", '1 and 2 and 3');
  pin('method with inline addition', 'addOne(value + 1)', 3);
  pin('method with an inline object', "getValue {one: 'two'} 'one'", 'two');
  pin('the data of {>test obj={a: 1}}', '{a: 1}', { a: 1 });
});

/*******************************
          Literals
*******************************/

describe('literals', () => {
  pin('single-quoted string', "'hello'", 'hello');
  pin('double-quoted string', '"hello"', 'hello');
  pin('string with spaces', "'hello world'", 'hello world');
  pin('empty string', "''", '');
  pin('single quotes holding a double quote', '\'say "hi"\'', 'say "hi"');
  pin('double quotes holding an apostrophe', '"it\'s"', "it's");
  pin('escaped quote inside a string', "'it\\'s'", "it's");
  pin('integer', '42', 42);
  pin('zero', '0', 0);
  pin('negative integer', '-5', -5);
  pin('decimal', '3.14', 3.14);
  pin('negative decimal', '-0.5', -0.5);
  pin('leading-dot decimal', '.5', 0.5);
  pin('exponent', '1e3', 1000);
  pin('true', 'true', true);
  pin('false', 'false', false);
  pin('null', 'null', null);
  pin('undefined', 'undefined', undefined);
});

/*******************************
     Data Keys and Signals
*******************************/

describe('data keys and signals', () => {
  pin('a number in the data', 'count', 42);
  pin('a string in the data', 'label', 'Submit');
  pin('a boolean in the data', 'isActive', true);
  pin('a missing key', 'missing', undefined);
  pin('a signal unwraps', 'isOpen', false);
  pin('a signal holding a string unwraps', 'fruit', 'cherry');
  pin('a signal as a Lisp argument', "is fruit 'cherry'", true);
  pin('a signal in a JS expression', "isOpen ? 'open' : 'closed'", 'closed');
  pin('a zero-arg function is invoked as the terminal token', 'isTrue', true);
  pin('a helper value that is not a function', 'isClient', TemplateHelpers.isClient);
  pin('a helper value that is not a function, true here', 'isServer', TemplateHelpers.isServer);
});

/*******************************
         Dotted Paths
*******************************/

describe('dotted paths', () => {
  pin('through data', 'user.name', 'Jack');
  pin('deep through data', 'user.settings.theme', 'dark');
  pin('array length', 'items.length', 3);
  pin('array index', 'items.0', 'one');
  pin('array index deeper in', 'user.roles.1', 'editor');
  pin('array index as a Lisp argument', 'list numbers.0 numbers.1', [5, 10]);
  pin('through a function', 'pet.treats', 3);
  pin('through a function returning an object with a signal', 'getAccount.loggedIn', true);
  pin('through a signal', 'profile.name', 'Sig');
  pin('through a signal along the path', 'profile.prefs.theme', 'light');
  pin('through a registered helper', 'currentRoute.name', 'home');
  pin('deep through a registered helper', 'currentRoute.url.pathname', '/');
  pin('method at the end keeps this, through a function', 'pet.describe', 'Simon has 3 treats');
  pin('method at the end keeps this, through a registered helper', 'currentRoute.describe', 'at home');
  pin('data wins over a helper at the root', 'currentRoute.name', 'from data', {
    ...data,
    currentRoute: { name: 'from data' },
  });
  pin('missing along the path', 'user.missing.deep', undefined);
  pin('as a Lisp argument', "concat user.name '!'", 'Jack!');
});

/*******************************
       Lisp-Style Calls
*******************************/

describe('Lisp-style calls', () => {
  pin('string argument', "concat 'a' 'b'", 'ab');
  pin('double-quoted string argument', 'concat "a" "b"', 'ab');
  pin('number argument', 'addOne 5', 6);
  pin('decimal argument', 'addOne 1.5', 2.5);
  pin('negative number as the only argument', 'double -5', -10);
  pin('negative number among arguments', 'list -1 2', [-1, 2]);
  pin('boolean arguments', 'list true false', [true, false]);
  pin('null and undefined arguments', 'list null undefined', [null, undefined]);
  pin('boolean picking a branch', "maybe true 'y' 'n'", 'y');
  pin('data argument', 'addOne count', 43);
  pin('object argument', "getValue {one: 'two'} 'one'", 'two');
  pin('object argument with inner spaces', "getValue { one: 'two' } 'one'", 'two');
  pin('object with data values', 'classMap {active: isActive, open: isOpen}', 'active ');
  pin('array argument', "join ['1', '2'] '-'", '1-2');
  pin('array of data', 'list [value, count]', [[1, 42]]);
  pin('empty object and array', 'list {} []', [{}, []]);
  pin('nested call in parens', 'addOne (addOne 1)', 3);
  pin('chaining right to left without parens', 'double double value', 4);
  pin('chaining into a data function', 'not isTrue', false);
  pin('chaining into a helper', "titleCase concat 'a' ' ' 'b'", 'A B');
  pin('one inline object', 'list {a: 1}', [{ a: 1 }]);
  pin('several inline objects', "list 'member' {userId: 'u42'} {exact: true}", ['member', { userId: 'u42' }, {
    exact: true,
  }]);
  pin('objects and arrays side by side', 'list {a: 1} [1, 2] {b: 2}', [{ a: 1 }, [1, 2], { b: 2 }]);
  pin('nested object', "getValue {a: {b: 1}} 'a'", { b: 1 });
  pin('nested object with a space before the last close', "getValue {a: {b: 1} } 'a'", { b: 1 });
  pin('nested array with a space before the last close', "list 'x' [1, [2, 3] ] 'y'", ['x', [1, [2, 3]], 'y']);
  pin('object spanning lines', 'classMap {\n  one: true,\n  two: false\n}', 'one ');
  pin('object holding a string with a brace', "getValue {a: 'x }'} 'a'", 'x }');
  pin('string containing braces', "concat 'a {b} c' note", 'a {b} cx');
  pin('string that is a brace', "concat '{' '}'", '{}');
  pin('string containing spaces', "list 'a b' 'c'", ['a b', 'c']);
  pin('strings containing parentheses', "list 'f(x)' '(a' 'b)'", ['f(x)', '(a', 'b)']);
  pin('string containing the other kind of quote', "concat \"it's\" ' ok'", "it's ok");
  pin('string containing double quotes', "concat 'say \"hi\"' '!'", 'say "hi"!');
  pin('string containing an escaped quote', "concat 'it\\'s' ' ok'", "it's ok");
  pin('strings containing operator characters', "concat 'a: ' 'b, ' 'c => d'", 'a: b, c => d');
});

/*******************************
        JS-Style Calls
*******************************/

describe('JS-style calls', () => {
  pin('string argument', "concat('a', 'b')", 'ab');
  pin('number argument', 'addOne(1)', 2);
  pin('boolean argument', "maybe(true, 'y', 'n')", 'y');
  pin('object argument', "getValue({one: 'two'}, 'one')", 'two');
  pin('array argument', "join(['1', '2'], '-')", '1-2');
  pin('nested call', 'addOne(addOne(1))', 3);
  pin('data argument', 'addOne(value)', 2);
  pin('signal argument', "is(fruit, 'cherry')", true);
  pin('glued as a Lisp argument', "concat 'a' addOne(1)", 'a2');
  pin('glued as a Lisp argument with inner spaces', "concat 'a' addOne(value + 1)", 'a3');
  pin('glued as a Lisp argument with an object', "list 'a' getValue({one: 'two'}, 'one')", ['a', 'two']);
  pin('parenthesized as a Lisp argument', "concat 'a' (addOne(1)) 'b'", 'a2b');
  pin('beside a Lisp group', 'list (addOne 1) addOne(2)', [2, 3]);
  pin('method call on a path', 'pet.describe()', 'Simon has 3 treats');
  pin('method call on a string in the data', 'user.name.toUpperCase()', 'JACK');
  pin('array method with an arrow', 'items.map(i => i.length)', [3, 3, 5]);
});

/*******************************
         Mixed Style
*******************************/

describe('mixed style, Lisp outside and JS inside', () => {
  pin('a ternary in parens', "concat user.name ' is ' (count >= 18 ? 'an adult' : 'a minor')", 'Jack is an adult');
  pin('a comparison in parens', "maybe (value > 0) 'pos' 'neg'", 'pos');
  pin('arithmetic in parens', 'addOne (value * 10)', 11);
  pin('equality in parens', "classIf (value == 1) 'yes' 'no'", 'yes ');
  pin('an object with a JS value', 'list {name: label, adult: (count >= 21)}', [{ name: 'Submit', adult: true }]);
  pin('a global in parens', "concat 'Max: ' (Math.max(...numbers))", 'Max: 15');
});

/*******************************
        JS Expressions
*******************************/

describe('JS expressions', () => {
  pin('arithmetic', 'count + 1', 43);
  pin('subtraction', 'count - 1', 41);
  pin('subtraction without space after minus', 'count -1', 41);
  pin('arithmetic on a path', 'numbers.length * 2', 6);
  pin('comparison', 'count > 1', true);
  pin('strict equality', "status === 'success'", true);
  pin('ternary', "value ? 'y' : 'n'", 'y');
  pin('logical and', 'count > 1 && value == 1', true);
  pin('logical or', "empty || 'fallback'", 'fallback');
  pin('nullish', "empty ?? 'd'", 'd');
  pin('negation', '!isActive', false);
  pin('optional chaining', "user?.missing?.x ?? 'none'", 'none');
  pin('template literal', '`${count} items`', '42 items');
  pin('array literal', '[1, 2, 3]', [1, 2, 3]);
  pin('object literal with spaces', '{ a: value }', { a: 1 });
  pin('object literal spanning lines', '{\n  a: 1\n}', { a: 1 });
  pin('in', "'name' in user", true);
  pin('typeof', 'typeof count', 'number');
  pin('typeof compared', "typeof value === 'number'", true);
  pin('instanceof', 'count instanceof Object', false);
  pin('bracket access', 'items[0]', 'one');
  pin('computed key', "stats[status + 'Count'] || 0", 28);
  pin('method chain', "items.filter(i => i.length > 3).join(',')", 'three');
  pin('a global', 'Math.max(...numbers)', 15);
  pin('a global on data', 'Object.keys(stats).length', 2);
  pin('an iife', '(() => value + 1)()', 2);
  pin('a data function is an accessor', 'isTrue && count', 42);
});

/*******************************
      Helper Return Kinds
*******************************/

describe('what a helper returns', () => {
  it('a function, from a helper: {makeAdder 2}', () => {
    const adder = read('makeAdder 2');
    expect(typeof adder).toBe('function');
    expect(adder(3)).toBe(5);
  });

  it('a function, from a data method: {getFilterFn}', () => {
    const filter = read('getFilterFn');
    expect(typeof filter).toBe('function');
    expect(filter('short')).toBe(true);
  });

  it('an object: {currentRoute}', () => {
    expect(read('currentRoute')).toMatchObject({ name: 'home', url: { pathname: '/' } });
  });

  it('an object, from a data method: {pet}', () => {
    expect(read('pet')).toMatchObject({ name: 'Simon', treats: 3 });
  });
  pin('a signal unwraps', 'getCount', 7);
  pin('a signal unwraps along a path', 'getUser.name', 'Sig');
  pin('a signal unwraps as a Lisp argument', 'addOne getCount', 8);
  pin('a signal unwraps in a JS expression', 'getCount + 1', 8);

  it('a promise passes through: {fetchUsers}', async () => {
    const pending = read('fetchUsers');
    expect(pending).toBeInstanceOf(Promise);
    expect(await pending).toEqual(['a']);
  });

  it('a promise passes through a JS call: {fetchUsers()}', async () => {
    expect(await read('fetchUsers()')).toEqual(['a']);
  });
});

/*******************************
          Each Context
*******************************/

describe('inside {#each}', () => {
  const person = { name: 'Al', age: 1 };
  const direct = { ...person, this: person, index: 0 };
  const primitive = { this: 'ab', index: 1 };
  const numeric = { this: 5, index: 0 };
  const named = { item: person, index: 0 };
  const indexed = { product: person, i: 2 };
  const entry = { value: 1, key: 'a' };

  pin('direct context, a field', 'name', 'Al', direct);
  pin('direct context, this', 'this', person, direct);
  pin('direct context, a path on this', 'this.name', 'Al', direct);
  pin('direct context, JS on this', 'this.age + 1', 2, direct);
  pin('direct context, a method on this', 'this.name.toUpperCase()', 'AL', direct);
  pin('direct context, index', 'index', 0, direct);
  pin('direct context, index in JS', 'index + 1', 1, direct);
  pin('direct context, index through a helper', 'numberFromIndex index', 1, direct);
  pin('primitive item, this', 'this', 'ab', primitive);
  pin('primitive item, a path on this', 'this.length', 2, primitive);
  pin('primitive item, a method on this', 'this.toUpperCase()', 'AB', primitive);
  pin('primitive item, strict equality on this', "this === 'ab'", true, primitive);
  pin('primitive item, typeof this', 'typeof this', 'string', primitive);
  pin('numeric item, arithmetic on this', 'this * 2', 10, numeric);
  pin('numeric item, strict equality on this', 'this === 5', true, numeric);
  pin('named item', 'item.name', 'Al', named);
  pin('named item in JS', 'item.age + 1', 2, named);
  pin('custom index', 'i + 1', 3, indexed);
  pin('custom index beside the item', "concat product.name ' #' (i + 1)", 'Al #3', indexed);
  pin('object iteration, key', 'key', 'a', entry);
  pin('object iteration, value', 'value', 1, entry);
  pin('object iteration, both', "concat key '=' value", 'a=1', entry);
  pin('iterable from a helper', 'range 0 4', [0, 1, 2, 3]);
  pin('iterable from a JS filter', 'items.filter(i => i.length === 3)', ['one', 'two']);
});

/*******************************
          Whitespace
*******************************/

describe('whitespace', () => {
  // the compiler trims what sits inside the braces, so only inner whitespace reaches here
  pin('leading and trailing spaces around a Lisp call', '  addOne value  ', 2);
  pin('leading and trailing spaces around a JS expression', '  count + 1  ', 43);
  pin('leading and trailing spaces around a key', '  count  ', 42);
  pin('several spaces between Lisp tokens', 'addOne   value', 2);
  pin('several spaces inside a JS expression', 'count   +   1', 43);
  pin('a newline between Lisp tokens', 'addOne\nvalue', 2);
  pin('a newline and indent between Lisp tokens', 'addOne\n  value', 2);
  pin('a newline inside a JS expression', 'count\n+ 1', 43);
  pin('a newline before a Lisp object argument', 'classMap\n  {a: true}', 'a ');
});

/*******************************
          Demo Forms
*******************************/

describe('the demo forms', () => {
  const seen = [];
  const router = new ExpressionEvaluator({
    data,
    helpers: {
      ...helpers,
      isCurrentRoute: (...args) => {
        seen.push(args);
        return args[0] === 'team';
      },
    },
  });

  it("{isCurrentRoute 'member' {userId: 'u42'} {exact: true}} hands over the name and both objects", () => {
    seen.length = 0;
    expect(router.evaluate("isCurrentRoute 'member' {userId: 'u42'} {exact: true}")).toBe(false);
    expect(seen).toEqual([['member', { userId: 'u42' }, { exact: true }]]);
  });

  it("{activeIf isCurrentRoute('team')} calls the JS-style argument", () => {
    seen.length = 0;
    expect(router.evaluate("activeIf isCurrentRoute('team')")).toBe('active ');
    expect(seen).toEqual([['team']]);
  });

  it("{activeIf isCurrentRoute('team', {exact: true})} carries the object through", () => {
    seen.length = 0;
    expect(router.evaluate("activeIf isCurrentRoute('team', {exact: true})")).toBe('active ');
    expect(seen).toEqual([['team', { exact: true }]]);
  });

  pin('either over a path through a helper', "either currentRoute.name 'boundary'", 'home');
  pin('a deep path through a helper', 'currentRoute.url.pathname', '/');
});
