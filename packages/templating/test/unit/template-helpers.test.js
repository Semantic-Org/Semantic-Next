import { registerHelper, registerHelpers, TemplateHelpers } from '@semantic-ui/templating';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('TemplateHelpers', () => {
  // Capture and restore TemplateHelpers around mutating tests so that
  // registerHelper / registerHelpers cases cannot pollute later runs.
  let originalHelpers;
  beforeEach(() => {
    originalHelpers = { ...TemplateHelpers };
  });
  afterEach(() => {
    for (const key of Object.keys(TemplateHelpers)) {
      if (!(key in originalHelpers)) {
        delete TemplateHelpers[key];
      }
      else {
        TemplateHelpers[key] = originalHelpers[key];
      }
    }
  });

  /*******************************
              Logical
  *******************************/

  describe('Logical helpers', () => {
    it('exists returns true for non-empty values', () => {
      expect(TemplateHelpers.exists('hello')).toBe(true);
      expect(TemplateHelpers.exists([1])).toBe(true);
      expect(TemplateHelpers.exists({ a: 1 })).toBe(true);
    });

    it('exists treats nullish, empty strings, and empty arrays as missing', () => {
      expect(TemplateHelpers.exists(null)).toBe(false);
      expect(TemplateHelpers.exists(undefined)).toBe(false);
      expect(TemplateHelpers.exists('')).toBe(false);
      expect(TemplateHelpers.exists([])).toBe(false);
      expect(TemplateHelpers.exists({})).toBe(false);
    });

    it('exists treats primitives without length or own keys as empty', () => {
      // Primitives like 0, true, false fall into isEmpty's for-in loop
      // and resolve to "empty" since they have no enumerable own properties.
      expect(TemplateHelpers.exists(0)).toBe(false);
      expect(TemplateHelpers.exists(true)).toBe(false);
      expect(TemplateHelpers.exists(false)).toBe(false);
    });

    it('isEmpty mirrors the @semantic-ui/utils predicate', () => {
      expect(TemplateHelpers.isEmpty(null)).toBe(true);
      expect(TemplateHelpers.isEmpty(undefined)).toBe(true);
      expect(TemplateHelpers.isEmpty('')).toBe(true);
      expect(TemplateHelpers.isEmpty([])).toBe(true);
      expect(TemplateHelpers.isEmpty({})).toBe(true);
      expect(TemplateHelpers.isEmpty('x')).toBe(false);
      expect(TemplateHelpers.isEmpty([0])).toBe(false);
    });

    it('hasAny checks for length > 0', () => {
      expect(TemplateHelpers.hasAny([1, 2])).toBe(true);
      expect(TemplateHelpers.hasAny('abc')).toBe(true);
      expect(TemplateHelpers.hasAny([])).toBe(false);
      expect(TemplateHelpers.hasAny('')).toBe(false);
      expect(TemplateHelpers.hasAny(undefined)).toBe(false);
      expect(TemplateHelpers.hasAny(null)).toBe(false);
    });

    it('both returns logical and', () => {
      expect(TemplateHelpers.both(true, true)).toBe(true);
      expect(TemplateHelpers.both(true, false)).toBe(false);
      expect(TemplateHelpers.both(1, 'x')).toBe('x');
      expect(TemplateHelpers.both(0, 'x')).toBe(0);
    });

    it('either returns logical or', () => {
      expect(TemplateHelpers.either(false, 'fallback')).toBe('fallback');
      expect(TemplateHelpers.either('first', 'second')).toBe('first');
      expect(TemplateHelpers.either(0, 7)).toBe(7);
    });

    it('maybe acts as ternary', () => {
      expect(TemplateHelpers.maybe(true, 'yes', 'no')).toBe('yes');
      expect(TemplateHelpers.maybe(false, 'yes', 'no')).toBe('no');
      expect(TemplateHelpers.maybe(1, 'a', 'b')).toBe('a');
      expect(TemplateHelpers.maybe('', 'a', 'b')).toBe('b');
    });

    it('not negates truthiness', () => {
      expect(TemplateHelpers.not(true)).toBe(false);
      expect(TemplateHelpers.not(0)).toBe(true);
      expect(TemplateHelpers.not('')).toBe(true);
      expect(TemplateHelpers.not('x')).toBe(false);
    });
  });

  /*******************************
            Comparison
  *******************************/

  describe('Comparison helpers', () => {
    it('is uses loose equality', () => {
      expect(TemplateHelpers.is(1, '1')).toBe(true);
      expect(TemplateHelpers.is(1, 1)).toBe(true);
      expect(TemplateHelpers.is(null, undefined)).toBe(true);
      expect(TemplateHelpers.is(0, false)).toBe(true);
      expect(TemplateHelpers.is('a', 'b')).toBe(false);
    });

    it('isExactly uses strict equality', () => {
      expect(TemplateHelpers.isExactly(1, 1)).toBe(true);
      expect(TemplateHelpers.isExactly(1, '1')).toBe(false);
      expect(TemplateHelpers.isExactly(null, undefined)).toBe(false);
    });

    it('isNot uses strict inequality', () => {
      expect(TemplateHelpers.isNot(1, 2)).toBe(true);
      expect(TemplateHelpers.isNot(1, 1)).toBe(false);
      // strict inequality => 1 and '1' are NOT equal
      expect(TemplateHelpers.isNot(1, '1')).toBe(true);
    });

    it('notEqual aliases isNot', () => {
      expect(TemplateHelpers.notEqual(1, 2)).toBe(true);
      expect(TemplateHelpers.notEqual('a', 'a')).toBe(false);
    });

    it('isNotExactly uses strict inequality', () => {
      expect(TemplateHelpers.isNotExactly(1, 1)).toBe(false);
      expect(TemplateHelpers.isNotExactly(1, '1')).toBe(true);
    });

    it('greaterThan / lessThan', () => {
      expect(TemplateHelpers.greaterThan(2, 1)).toBe(true);
      expect(TemplateHelpers.greaterThan(1, 1)).toBe(false);
      expect(TemplateHelpers.lessThan(1, 2)).toBe(true);
      expect(TemplateHelpers.lessThan(2, 2)).toBe(false);
    });

    it('greaterThanEquals / lessThanEquals are inclusive', () => {
      expect(TemplateHelpers.greaterThanEquals(2, 2)).toBe(true);
      expect(TemplateHelpers.greaterThanEquals(1, 2)).toBe(false);
      expect(TemplateHelpers.lessThanEquals(2, 2)).toBe(true);
      expect(TemplateHelpers.lessThanEquals(3, 2)).toBe(false);
    });
  });

  /*******************************
              String
  *******************************/

  describe('String helpers', () => {
    it('concat joins all arguments without delimiter', () => {
      expect(TemplateHelpers.concat('a', 'b', 'c')).toBe('abc');
      expect(TemplateHelpers.concat('hi ', 'world')).toBe('hi world');
      expect(TemplateHelpers.concat(1, 2)).toBe('12');
    });

    it('concat with no arguments returns empty string', () => {
      expect(TemplateHelpers.concat()).toBe('');
    });

    it('capitalize uppercases the first letter', () => {
      expect(TemplateHelpers.capitalize('hello')).toBe('Hello');
      expect(TemplateHelpers.capitalize('')).toBe('');
    });

    it('titleCase capitalizes major words', () => {
      expect(TemplateHelpers.titleCase('hello world')).toBe('Hello World');
    });

    it('stringify wraps JSON.stringify', () => {
      expect(TemplateHelpers.stringify({ a: 1 })).toBe('{"a":1}');
      expect(TemplateHelpers.stringify([1, 2])).toBe('[1,2]');
      expect(TemplateHelpers.stringify('x')).toBe('"x"');
    });

    it('maybePlural returns empty for one, suffix otherwise', () => {
      expect(TemplateHelpers.maybePlural(1)).toBe('');
      expect(TemplateHelpers.maybePlural(2)).toBe('s');
      expect(TemplateHelpers.maybePlural(0)).toBe('s');
    });

    it("maybePlural treats '1' (string) like 1 (== check)", () => {
      expect(TemplateHelpers.maybePlural('1')).toBe('');
    });

    it('maybePlural accepts a custom plural suffix', () => {
      expect(TemplateHelpers.maybePlural(1, 'es')).toBe('');
      expect(TemplateHelpers.maybePlural(2, 'es')).toBe('es');
    });

    it('tokenize lowercases and slugifies', () => {
      expect(TemplateHelpers.tokenize('Hello World!')).toBe('hello-world');
      expect(TemplateHelpers.tokenize('foo_bar')).toBe('foo-bar');
    });

    it('tokenize defaults to empty string', () => {
      expect(TemplateHelpers.tokenize()).toBe('');
    });

    it('escapeHTML encodes HTML special characters', () => {
      expect(TemplateHelpers.escapeHTML('<b>x</b>')).toBe('&lt;b&gt;x&lt;/b&gt;');
      expect(TemplateHelpers.escapeHTML('"a&b\'')).toBe('&quot;a&amp;b&#39;');
    });

    it('escapeHTML returns empty string for falsy input', () => {
      expect(TemplateHelpers.escapeHTML(undefined)).toBe('');
      expect(TemplateHelpers.escapeHTML(null)).toBe('');
      expect(TemplateHelpers.escapeHTML('')).toBe('');
    });

    it('default returns the value when present, fallback otherwise', () => {
      expect(TemplateHelpers.default('value', 'fallback')).toBe('value');
      expect(TemplateHelpers.default(null, 'fallback')).toBe('fallback');
      expect(TemplateHelpers.default(undefined, 'fallback')).toBe('fallback');
    });

    it('default uses ?? so 0 and empty string are kept', () => {
      expect(TemplateHelpers.default(0, 'fallback')).toBe(0);
      expect(TemplateHelpers.default('', 'fallback')).toBe('');
      expect(TemplateHelpers.default(false, 'fallback')).toBe(false);
    });

    it('truncate forwards options to utils.truncate', () => {
      expect(TemplateHelpers.truncate('hello world long text', 10, {
        wordBoundary: false,
        suffix: '...',
      })).toBe('hello w...');
    });

    it('truncate returns text unchanged when shorter than length', () => {
      expect(TemplateHelpers.truncate('short', 50)).toBe('short');
    });

    it('lowercase / uppercase transform strings', () => {
      expect(TemplateHelpers.lowercase('HELLO')).toBe('hello');
      expect(TemplateHelpers.uppercase('hello')).toBe('HELLO');
    });

    it('lowercase / uppercase pass through values without case methods', () => {
      expect(TemplateHelpers.lowercase(null)).toBe(null);
      expect(TemplateHelpers.lowercase(undefined)).toBe(undefined);
      expect(TemplateHelpers.lowercase(5)).toBe(5);
      expect(TemplateHelpers.uppercase(null)).toBe(null);
      expect(TemplateHelpers.uppercase(undefined)).toBe(undefined);
    });
  });

  /*******************************
            CSS classes
  *******************************/

  describe('CSS class helpers', () => {
    it('classIf appends a trailing space when truthy', () => {
      expect(TemplateHelpers.classIf(true, 'active')).toBe('active ');
    });

    it('classIf returns the false branch when condition is falsy', () => {
      expect(TemplateHelpers.classIf(false, 'active', 'inactive')).toBe('inactive ');
    });

    it('classIf returns empty string when no fallback is provided', () => {
      expect(TemplateHelpers.classIf(false)).toBe('');
      expect(TemplateHelpers.classIf(false, 'active')).toBe('');
    });

    it('classIf returns empty string when chosen class is empty', () => {
      expect(TemplateHelpers.classIf(true, '')).toBe('');
      expect(TemplateHelpers.classIf(true, '', 'fallback')).toBe('');
    });

    it('classMap joins truthy keys with trailing space', () => {
      expect(TemplateHelpers.classMap({ a: true, b: false, c: 1 })).toBe('a c ');
    });

    it('classMap returns empty string when no truthy keys', () => {
      expect(TemplateHelpers.classMap({})).toBe('');
      expect(TemplateHelpers.classMap({ a: false, b: 0, c: null })).toBe('');
    });

    it('activeIf / selectedIf / disabledIf / checkedIf yield padded class on truthy', () => {
      expect(TemplateHelpers.activeIf(true)).toBe('active ');
      expect(TemplateHelpers.selectedIf(true)).toBe('selected ');
      expect(TemplateHelpers.disabledIf(true)).toBe('disabled ');
      expect(TemplateHelpers.checkedIf(true)).toBe('checked ');
    });

    it('activeIf / selectedIf / disabledIf / checkedIf yield empty on falsy', () => {
      expect(TemplateHelpers.activeIf(false)).toBe('');
      expect(TemplateHelpers.selectedIf(false)).toBe('');
      expect(TemplateHelpers.disabledIf(false)).toBe('');
      expect(TemplateHelpers.checkedIf(false)).toBe('');
    });
  });

  /*******************************
          Array & Object
  *******************************/

  describe('Array & Object helpers', () => {
    it('first returns the first element', () => {
      expect(TemplateHelpers.first([1, 2, 3])).toBe(1);
    });

    it('last returns the last element', () => {
      expect(TemplateHelpers.last([1, 2, 3])).toBe(3);
    });

    it('count returns length, with 0 fallback for nullish', () => {
      expect(TemplateHelpers.count([1, 2, 3])).toBe(3);
      expect(TemplateHelpers.count([])).toBe(0);
      expect(TemplateHelpers.count(undefined)).toBe(0);
      expect(TemplateHelpers.count(null)).toBe(0);
    });

    it('count works on strings via .length', () => {
      expect(TemplateHelpers.count('abc')).toBe(3);
      expect(TemplateHelpers.count('')).toBe(0);
    });

    it('join with empty array short-circuits to undefined', () => {
      expect(TemplateHelpers.join([], ',')).toBeUndefined();
    });

    it('join uses space as default delimiter', () => {
      expect(TemplateHelpers.join(['a', 'b'])).toBe('a b');
    });

    it('join honors a custom delimiter', () => {
      expect(TemplateHelpers.join(['a', 'b', 'c'], '-')).toBe('a-b-c');
    });

    it('join appends a trailing space when spaceAfter is true', () => {
      expect(TemplateHelpers.join(['a', 'b'], '-', true)).toBe('a-b ');
    });

    it('classes always appends a trailing space', () => {
      expect(TemplateHelpers.classes(['a', 'b'])).toBe('a b ');
    });

    it('joinComma defaults to oxford-comma "and" form', () => {
      expect(TemplateHelpers.joinComma(['a', 'b', 'c'])).toBe('a, b, and c');
    });

    it('joinComma without oxford drops the serial comma', () => {
      expect(TemplateHelpers.joinComma(['a', 'b', 'c'], false)).toBe('a, b and c');
    });

    it('joinComma honors quotes flag', () => {
      expect(TemplateHelpers.joinComma(['a', 'b', 'c'], false, true)).toBe('"a", "b" and "c"');
    });

    it('joinComma handles single and pair lists', () => {
      expect(TemplateHelpers.joinComma(['solo'])).toBe('solo');
      expect(TemplateHelpers.joinComma(['a', 'b'])).toBe('a and b');
    });

    it('joinComma returns empty string for empty array', () => {
      expect(TemplateHelpers.joinComma([])).toBe('');
    });

    it('range produces a numeric range', () => {
      expect(TemplateHelpers.range(1, 5)).toEqual([1, 2, 3, 4]);
    });

    it('range supports custom step', () => {
      expect(TemplateHelpers.range(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
    });

    it('sequence produces multiples', () => {
      expect(TemplateHelpers.sequence(3)).toEqual([1, 2, 3]);
      expect(TemplateHelpers.sequence(3, 2, 5)).toEqual([10, 12, 14]);
    });

    it('arrayFromObject converts object entries to {key, value} array', () => {
      expect(TemplateHelpers.arrayFromObject({ a: 1, b: 2 })).toEqual([
        { value: 1, key: 'a' },
        { value: 2, key: 'b' },
      ]);
    });

    it('arrayFromObject passes arrays through unchanged', () => {
      const input = [1, 2, 3];
      expect(TemplateHelpers.arrayFromObject(input)).toBe(input);
    });
  });

  /*******************************
          Date & Number
  *******************************/

  describe('Date & Number helpers', () => {
    const fixedDate = new Date('2024-06-15T14:30:45Z');

    it('formatDate uses L preset (MM/DD/YYYY)', () => {
      const out = TemplateHelpers.formatDate(fixedDate);
      expect(out).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it('formatDate accepts a custom format string', () => {
      const out = TemplateHelpers.formatDate(fixedDate, 'YYYY');
      expect(out).toBe('2024');
    });

    it('formatDateTime defaults to LLL preset', () => {
      const out = TemplateHelpers.formatDateTime(fixedDate);
      // LLL = "MMMM D, YYYY h:mm a" — should contain a year
      expect(out).toContain('2024');
    });

    it('formatTime defaults to LTS preset', () => {
      const out = TemplateHelpers.formatTime(fixedDate);
      // LTS => "h:mm:ss a" — must contain digits and an am/pm marker
      expect(out).toMatch(/\d+:\d{2}:\d{2}\s?(am|pm)/i);
    });

    it('formatDate / formatDateTime / formatTime return Invalid Date for nullish', () => {
      expect(TemplateHelpers.formatDate(null)).toBe('Invalid Date');
      expect(TemplateHelpers.formatDateTime(null)).toBe('Invalid Date');
      expect(TemplateHelpers.formatTime(null)).toBe('Invalid Date');
    });

    it('roundNumber rounds to N significant digits', () => {
      // Significant-digit rounding: 1.567 with 2 sig figs => 1.6
      expect(TemplateHelpers.roundNumber(1.567, 2)).toBe(1.6);
      expect(TemplateHelpers.roundNumber(0, 5)).toBe(0);
    });

    it('round aliases roundNumber', () => {
      expect(TemplateHelpers.round(1.567, 2)).toBe(1.6);
    });

    it('roundDecimal rounds to N decimal places', () => {
      expect(TemplateHelpers.roundDecimal(1.567, 2)).toBe(1.57);
      expect(TemplateHelpers.roundDecimal(2.345, 1)).toBe(2.3);
      expect(TemplateHelpers.roundDecimal(0, 2)).toBe(0);
    });

    it('numberFromIndex adds 1 to a 0-based index', () => {
      expect(TemplateHelpers.numberFromIndex(0)).toBe(1);
      expect(TemplateHelpers.numberFromIndex(4)).toBe(5);
      expect(TemplateHelpers.numberFromIndex(-1)).toBe(0);
    });
  });

  /*******************************
            Environment
  *******************************/

  describe('Environment flags', () => {
    it('isClient and isServer are mutually exclusive booleans', () => {
      expect(typeof TemplateHelpers.isClient).toBe('boolean');
      expect(typeof TemplateHelpers.isServer).toBe('boolean');
      expect(TemplateHelpers.isClient).not.toBe(TemplateHelpers.isServer);
    });
  });

  /*******************************
              Global
  *******************************/

  describe('Global helpers', () => {
    it('log forwards arguments to console.log', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      TemplateHelpers.log('a', 'b', 'c');
      expect(spy).toHaveBeenCalledWith('a', 'b', 'c');
      spy.mockRestore();
    });

    it('debugger does not throw', () => {
      expect(() => TemplateHelpers.debugger()).not.toThrow();
    });

    it('debugReactivity does not throw outside a reactive scope', () => {
      expect(() => TemplateHelpers.debugReactivity()).not.toThrow();
    });

    it('guard returns the wrapped value when given a non-function', () => {
      expect(TemplateHelpers.guard(5)).toBe(5);
      expect(TemplateHelpers.guard('hi')).toBe('hi');
    });

    it('guard invokes a function value', () => {
      expect(TemplateHelpers.guard(() => 42)).toBe(42);
    });

    it('nonreactive returns the wrapped value when given a non-function', () => {
      expect(TemplateHelpers.nonreactive(5)).toBe(5);
    });

    it('nonreactive invokes a function value', () => {
      expect(TemplateHelpers.nonreactive(() => 7)).toBe(7);
    });
  });

  /*******************************
            Registration
  *******************************/

  describe('registerHelper / registerHelpers', () => {
    it('registerHelper adds a single helper by name', () => {
      const fn = (a, b) => a + b;
      registerHelper('addNumbers', fn);
      expect(TemplateHelpers.addNumbers).toBe(fn);
      expect(TemplateHelpers.addNumbers(2, 3)).toBe(5);
    });

    it('registerHelpers adds multiple helpers via Object.assign', () => {
      const helpers = {
        triple: (n) => n * 3,
        shout: (s) => `${s}!`,
      };
      registerHelpers(helpers);
      expect(TemplateHelpers.triple(4)).toBe(12);
      expect(TemplateHelpers.shout('hi')).toBe('hi!');
    });

    it('registerHelper overwrites an existing helper', () => {
      const original = TemplateHelpers.capitalize;
      registerHelper('capitalize', () => 'OVERRIDDEN');
      expect(TemplateHelpers.capitalize('anything')).toBe('OVERRIDDEN');
      // Restored automatically by afterEach
      expect(original).toBeTypeOf('function');
    });

    it('registerHelpers overwrites existing keys', () => {
      registerHelpers({ not: () => 'replaced' });
      expect(TemplateHelpers.not(true)).toBe('replaced');
    });

    it('cleanup restores helpers between tests', () => {
      // Verify capitalize is back to its original behavior after the
      // overwrite test above ran. This implicitly exercises the afterEach hook.
      expect(TemplateHelpers.capitalize('hello')).toBe('Hello');
    });
  });
});
