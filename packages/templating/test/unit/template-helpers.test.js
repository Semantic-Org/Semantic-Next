import { registerHelper, registerHelpers, TemplateHelpers } from '@semantic-ui/templating';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/*
  Behavior in this suite is anchored to the public docs:
    docs/src/pages/docs/api/helpers/*
    docs/src/pages/docs/guides/templates/helpers.mdx
    docs/src/examples/templates/helpers-*

  When the documented contract diverges from the current implementation
  the test asserts the DOCUMENTED behavior so the resulting failure
  surfaces the doc/code gap.
*/

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
      // docs/api/helpers/logical.mdx — exists "Checks if a value is not empty"
      expect(TemplateHelpers.exists('hello')).toBe(true);
      expect(TemplateHelpers.exists([1])).toBe(true);
      expect(TemplateHelpers.exists({ a: 1 })).toBe(true);
    });

    it('exists treats nullish, empty strings, and empty containers as missing', () => {
      // docs/api/helpers/logical.mdx — same conditions as isEmpty apply
      expect(TemplateHelpers.exists(null)).toBe(false);
      expect(TemplateHelpers.exists(undefined)).toBe(false);
      expect(TemplateHelpers.exists('')).toBe(false);
      expect(TemplateHelpers.exists([])).toBe(false);
      expect(TemplateHelpers.exists({})).toBe(false);
    });

    it('exists treats falsey primitives as not existing', () => {
      // docs/api/helpers/logical.mdx — exists note: "the same conditions as
      // isEmpty apply, all falsey values will return false"
      expect(TemplateHelpers.exists(0)).toBe(false);
      expect(TemplateHelpers.exists(false)).toBe(false);
    });

    it('isEmpty returns true for empty containers and nullish values', () => {
      // docs/api/helpers/logical.mdx — isEmpty "Checks if a value is empty"
      expect(TemplateHelpers.isEmpty(null)).toBe(true);
      expect(TemplateHelpers.isEmpty(undefined)).toBe(true);
      expect(TemplateHelpers.isEmpty('')).toBe(true);
      expect(TemplateHelpers.isEmpty([])).toBe(true);
      expect(TemplateHelpers.isEmpty({})).toBe(true);
    });

    it('isEmpty treats falsey primitives as empty', () => {
      // docs/api/helpers/logical.mdx — "empty includes falsey values like
      // false, 0 undefined etc."
      expect(TemplateHelpers.isEmpty(0)).toBe(true);
      expect(TemplateHelpers.isEmpty(false)).toBe(true);
    });

    it('isEmpty returns false for non-empty values', () => {
      expect(TemplateHelpers.isEmpty('x')).toBe(false);
      expect(TemplateHelpers.isEmpty([0])).toBe(false);
      expect(TemplateHelpers.isEmpty({ a: 1 })).toBe(false);
    });

    it('hasAny returns true for arrays with elements', () => {
      // docs/api/helpers/logical.mdx — hasAny "Checks if an array has any elements"
      expect(TemplateHelpers.hasAny([1, 2])).toBe(true);
      expect(TemplateHelpers.hasAny([0])).toBe(true);
    });

    it('hasAny returns false for empty arrays and nullish values', () => {
      expect(TemplateHelpers.hasAny([])).toBe(false);
      expect(TemplateHelpers.hasAny(undefined)).toBe(false);
      expect(TemplateHelpers.hasAny(null)).toBe(false);
    });

    it('both returns a boolean indicating both values are truthy', () => {
      // docs/api/helpers/logical.mdx — both "Returns: boolean — true if both
      // values are truthy, false otherwise"
      expect(TemplateHelpers.both(true, true)).toBe(true);
      expect(TemplateHelpers.both(true, false)).toBe(false);
      expect(TemplateHelpers.both(false, true)).toBe(false);
      expect(TemplateHelpers.both(1, 'x')).toBe(true);
      expect(TemplateHelpers.both(0, 'x')).toBe(false);
    });

    it('either returns a boolean indicating at least one value is truthy', () => {
      // docs/api/helpers/logical.mdx — either "Returns: boolean — true if
      // either value is truthy, false otherwise"
      expect(TemplateHelpers.either(false, true)).toBe(true);
      expect(TemplateHelpers.either(false, false)).toBe(false);
      expect(TemplateHelpers.either(0, 7)).toBe(true);
      expect(TemplateHelpers.either(0, 0)).toBe(false);
    });

    it('maybe acts as ternary, returning trueExpr/falseExpr by truthiness', () => {
      // docs/api/helpers/logical.mdx — maybe "Returns trueExpr if expr is
      // truthy, falseExpr otherwise"
      expect(TemplateHelpers.maybe(true, 'yes', 'no')).toBe('yes');
      expect(TemplateHelpers.maybe(false, 'yes', 'no')).toBe('no');
      expect(TemplateHelpers.maybe(1, 'a', 'b')).toBe('a');
      expect(TemplateHelpers.maybe('', 'a', 'b')).toBe('b');
    });

    it('not negates truthiness', () => {
      // docs/api/helpers/comparison.mdx — not "Checks negation (!)"
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
    it('is uses loose equality (==)', () => {
      // docs/api/helpers/comparison.mdx — is "Checks equality (==)"
      // Example: is(5, "5") // true
      expect(TemplateHelpers.is(1, '1')).toBe(true);
      expect(TemplateHelpers.is(1, 1)).toBe(true);
      expect(TemplateHelpers.is(null, undefined)).toBe(true);
      expect(TemplateHelpers.is(0, false)).toBe(true);
      expect(TemplateHelpers.is('a', 'b')).toBe(false);
    });

    it('isExactly uses strict equality (===)', () => {
      // docs/api/helpers/comparison.mdx — isExactly "Checks strict equality (===)"
      // Example: isExactly(5, "5") // false
      expect(TemplateHelpers.isExactly(1, 1)).toBe(true);
      expect(TemplateHelpers.isExactly(1, '1')).toBe(false);
      expect(TemplateHelpers.isExactly(null, undefined)).toBe(false);
    });

    it('notEqual uses loose inequality (!=)', () => {
      // docs/api/helpers/comparison.mdx — notEqual "Checks inequality (!=)"
      expect(TemplateHelpers.notEqual(1, 2)).toBe(true);
      expect(TemplateHelpers.notEqual('a', 'a')).toBe(false);
      // Per doc, != is loose — 1 and '1' are equal, so notEqual is false
      expect(TemplateHelpers.notEqual(1, '1')).toBe(false);
      expect(TemplateHelpers.notEqual(null, undefined)).toBe(false);
    });

    it('isNot is an alias of notEqual', () => {
      // docs/api/helpers/comparison.mdx — isNot "Alias of notEqual"
      expect(TemplateHelpers.isNot(1, 2)).toBe(true);
      expect(TemplateHelpers.isNot(1, 1)).toBe(false);
      expect(TemplateHelpers.isNot(1, '1')).toBe(false);
    });

    it('isNotExactly uses strict inequality (!==)', () => {
      // docs/api/helpers/comparison.mdx — isNotExactly "Checks strict inequality (!==)"
      expect(TemplateHelpers.isNotExactly(1, 1)).toBe(false);
      expect(TemplateHelpers.isNotExactly(1, '1')).toBe(true);
    });

    it('greaterThan / lessThan check ordering exclusively', () => {
      // docs/api/helpers/comparison.mdx — greaterThan(a, b) returns a > b
      // and lessThan(a, b) returns a < b
      expect(TemplateHelpers.greaterThan(2, 1)).toBe(true);
      expect(TemplateHelpers.greaterThan(1, 1)).toBe(false);
      expect(TemplateHelpers.lessThan(1, 2)).toBe(true);
      expect(TemplateHelpers.lessThan(2, 2)).toBe(false);
    });

    it('greaterThanEquals / lessThanEquals check ordering inclusively', () => {
      // docs/api/helpers/comparison.mdx — greaterThanEquals(a, b) returns a >= b
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
      // docs/api/helpers/strings.mdx — concat "Concatenates all arguments"
      expect(TemplateHelpers.concat('a', 'b', 'c')).toBe('abc');
      expect(TemplateHelpers.concat('hi ', 'world')).toBe('hi world');
      expect(TemplateHelpers.concat(1, 2)).toBe('12');
    });

    it('concat with no arguments returns empty string', () => {
      // docs/api/helpers/strings.mdx — concat returns a string
      expect(TemplateHelpers.concat()).toBe('');
    });

    it('capitalize uppercases the first letter', () => {
      // docs/api/helpers/strings.mdx — capitalize "Capitalizes the first letter of text"
      expect(TemplateHelpers.capitalize('hello')).toBe('Hello');
      expect(TemplateHelpers.capitalize('')).toBe('');
    });

    it('titleCase converts text to title case', () => {
      // docs/api/helpers/strings.mdx — titleCase "Converts text to title case"
      expect(TemplateHelpers.titleCase('hello world')).toBe('Hello World');
    });

    it('stringify wraps JSON.stringify', () => {
      // docs/api/helpers/strings.mdx — stringify "Converts a value to JSON string"
      expect(TemplateHelpers.stringify({ a: 1 })).toBe('{"a":1}');
      expect(TemplateHelpers.stringify([1, 2])).toBe('[1,2]');
      expect(TemplateHelpers.stringify('x')).toBe('"x"');
    });

    it('maybePlural returns empty for one, suffix otherwise', () => {
      // docs/api/helpers/numeric.mdx — maybePlural "Adds a plural suffix if
      // the value is not 1"
      expect(TemplateHelpers.maybePlural(1)).toBe('');
      expect(TemplateHelpers.maybePlural(2)).toBe('s');
      expect(TemplateHelpers.maybePlural(0)).toBe('s');
    });

    it('maybePlural accepts a custom plural suffix', () => {
      // docs/api/helpers/numeric.mdx — maybePlural(value, plural='s')
      expect(TemplateHelpers.maybePlural(1, 'es')).toBe('');
      expect(TemplateHelpers.maybePlural(2, 'es')).toBe('es');
    });

    it('tokenize lowercases and slugifies', () => {
      // docs/api/helpers/strings.mdx — tokenize "Creates a URL-friendly token from a string"
      // (e.g., "hello-world")
      expect(TemplateHelpers.tokenize('Hello World!')).toBe('hello-world');
      expect(TemplateHelpers.tokenize('foo_bar')).toBe('foo-bar');
    });

    it('escapeHTML encodes HTML special characters', () => {
      // docs/api/helpers/strings.mdx — escapeHTML "Escapes HTML special
      // characters in a string"
      expect(TemplateHelpers.escapeHTML('<b>x</b>')).toBe('&lt;b&gt;x&lt;/b&gt;');
      expect(TemplateHelpers.escapeHTML('"a&b\'')).toBe('&quot;a&amp;b&#39;');
    });

    it('default returns the value when present, fallback when null/undefined', () => {
      // docs/api/helpers/logical.mdx — default "Returns the fallback value if
      // the first value is null or undefined, otherwise returns the first value"
      expect(TemplateHelpers.default('value', 'fallback')).toBe('value');
      expect(TemplateHelpers.default(null, 'fallback')).toBe('fallback');
      expect(TemplateHelpers.default(undefined, 'fallback')).toBe('fallback');
    });

    it('default uses ?? so 0, false, and empty string are kept', () => {
      // docs/api/helpers/logical.mdx — "Uses nullish coalescing (??) internally,
      // so only null and undefined trigger the fallback. Other falsy values
      // like 0, false, or '' will not use the fallback."
      expect(TemplateHelpers.default(0, 'fallback')).toBe(0);
      expect(TemplateHelpers.default('', 'fallback')).toBe('');
      expect(TemplateHelpers.default(false, 'fallback')).toBe(false);
    });

    it('truncate forwards options to utils.truncate', () => {
      // docs/api/helpers/strings.mdx — truncate(text, length, options)
      // options.suffix default '...' and wordBoundary default true
      expect(TemplateHelpers.truncate('hello world long text', 10, {
        wordBoundary: false,
        suffix: '...',
      })).toBe('hello w...');
    });

    it('truncate returns text unchanged when shorter than length', () => {
      // docs/api/helpers/strings.mdx — only truncates when needed
      expect(TemplateHelpers.truncate('short', 50)).toBe('short');
    });

    it('lowercase converts text to lowercase', () => {
      // docs/api/helpers/strings.mdx — lowercase "Converts text to lowercase"
      expect(TemplateHelpers.lowercase('HELLO')).toBe('hello');
      expect(TemplateHelpers.lowercase('Mixed Case')).toBe('mixed case');
    });

    it('uppercase converts text to uppercase', () => {
      // docs/api/helpers/strings.mdx — uppercase "Converts text to uppercase"
      expect(TemplateHelpers.uppercase('hello')).toBe('HELLO');
      expect(TemplateHelpers.uppercase('Mixed Case')).toBe('MIXED CASE');
    });
  });

  /*******************************
            CSS classes
  *******************************/

  describe('CSS class helpers', () => {
    it('classIf appends a trailing space when truthy', () => {
      // docs/api/helpers/css.mdx — classIf "The resulting class name with a
      // trailing space"
      expect(TemplateHelpers.classIf(true, 'active')).toBe('active ');
    });

    it('classIf returns the false branch when condition is falsy', () => {
      // docs/api/helpers/css.mdx — classIf(expr, trueClass, falseClass)
      expect(TemplateHelpers.classIf(false, 'active', 'inactive')).toBe('inactive ');
    });

    it('classIf returns empty string when no fallback is provided', () => {
      // docs/api/helpers/css.mdx — falseClass default is ''
      expect(TemplateHelpers.classIf(false)).toBe('');
      expect(TemplateHelpers.classIf(false, 'active')).toBe('');
    });

    it('classMap joins truthy keys with trailing space', () => {
      // docs/api/helpers/css.mdx — classMap "Resulting class names with a
      // trailing space"
      expect(TemplateHelpers.classMap({ a: true, b: false, c: 1 })).toBe('a c ');
    });

    it('classMap returns empty string when no truthy keys', () => {
      expect(TemplateHelpers.classMap({})).toBe('');
      expect(TemplateHelpers.classMap({ a: false, b: 0, c: null })).toBe('');
    });

    it('activeIf / selectedIf / disabledIf / checkedIf yield padded class on truthy', () => {
      // docs/api/helpers/css.mdx — each returns "<name> " when truthy
      expect(TemplateHelpers.activeIf(true)).toBe('active ');
      expect(TemplateHelpers.selectedIf(true)).toBe('selected ');
      expect(TemplateHelpers.disabledIf(true)).toBe('disabled ');
      expect(TemplateHelpers.checkedIf(true)).toBe('checked ');
    });

    it('activeIf / selectedIf / disabledIf / checkedIf yield empty on falsy', () => {
      // docs/api/helpers/css.mdx — each returns '' when falsy
      expect(TemplateHelpers.activeIf(false)).toBe('');
      expect(TemplateHelpers.selectedIf(false)).toBe('');
      expect(TemplateHelpers.disabledIf(false)).toBe('');
      expect(TemplateHelpers.checkedIf(false)).toBe('');
    });

    it('classes joins an array with a trailing space by default', () => {
      // docs/api/helpers/css.mdx — classes(classNames, spaceAfter=true)
      expect(TemplateHelpers.classes(['a', 'b'])).toBe('a b ');
    });

    it('classes honors spaceAfter=false to omit the trailing space', () => {
      // docs/api/helpers/css.mdx — classes(classNames, spaceAfter=true) — the
      // spaceAfter parameter is documented and configurable. Passing false
      // should produce a joined string without the trailing space.
      expect(TemplateHelpers.classes(['a', 'b'], false)).toBe('a b');
    });
  });

  /*******************************
          Array & Object
  *******************************/

  describe('Array & Object helpers', () => {
    it('first returns the first element', () => {
      // docs/api/helpers/arrays.mdx — first "Gets the first element of an array"
      expect(TemplateHelpers.first([1, 2, 3])).toBe(1);
    });

    it('first returns undefined for an empty array', () => {
      // docs/api/helpers/arrays.mdx — "or undefined if empty"
      expect(TemplateHelpers.first([])).toBeUndefined();
    });

    it('last returns the last element', () => {
      // docs/api/helpers/arrays.mdx — last "Gets the last element of an array"
      expect(TemplateHelpers.last([1, 2, 3])).toBe(3);
    });

    it('last returns undefined for an empty array', () => {
      // docs/api/helpers/arrays.mdx — "or undefined if empty"
      expect(TemplateHelpers.last([])).toBeUndefined();
    });

    it('count returns length, with 0 fallback for nullish', () => {
      // docs/api/helpers/arrays.mdx — count "The length of the array, or 0
      // if null/undefined"
      expect(TemplateHelpers.count([1, 2, 3])).toBe(3);
      expect(TemplateHelpers.count([])).toBe(0);
      expect(TemplateHelpers.count(undefined)).toBe(0);
      expect(TemplateHelpers.count(null)).toBe(0);
    });

    it('join uses space as default delimiter', () => {
      // docs/api/helpers/arrays.mdx — join(array, delimiter=' ', spaceAfter=false)
      expect(TemplateHelpers.join(['a', 'b'])).toBe('a b');
    });

    it('join honors a custom delimiter', () => {
      // docs/api/helpers/arrays.mdx — delimiter is the second argument
      expect(TemplateHelpers.join(['a', 'b', 'c'], '-')).toBe('a-b-c');
    });

    it('join appends a trailing space when spaceAfter is true', () => {
      // docs/api/helpers/arrays.mdx — spaceAfter "Whether to add a space after
      // the joined string"
      expect(TemplateHelpers.join(['a', 'b'], '-', true)).toBe('a-b ');
    });

    it('join returns a string for an empty array', () => {
      // docs/api/helpers/arrays.mdx — Returns: string. The contract specifies
      // the helper always returns a string value.
      expect(TemplateHelpers.join([], ',')).toBe('');
    });

    it('classes always appends a trailing space', () => {
      // docs/api/helpers/css.mdx — classes(classNames, spaceAfter=true)
      expect(TemplateHelpers.classes(['a', 'b'])).toBe('a b ');
    });

    it('joinComma defaults to no oxford comma', () => {
      // docs/api/helpers/arrays.mdx — joinComma(array, oxford=false, quotes=false)
      // The documented default for `oxford` is false, so the result should not
      // include the serial comma before "and".
      expect(TemplateHelpers.joinComma(['a', 'b', 'c'])).toBe('a, b and c');
    });

    it('joinComma applies the oxford comma when oxford is true', () => {
      // docs/api/helpers/arrays.mdx — oxford true => 'a, b, and c'
      expect(TemplateHelpers.joinComma(['a', 'b', 'c'], true)).toBe('a, b, and c');
    });

    it('joinComma honors quotes flag', () => {
      // docs/api/helpers/arrays.mdx — quotes "Whether to wrap items in quotes"
      expect(TemplateHelpers.joinComma(['a', 'b', 'c'], false, true)).toBe('"a", "b" and "c"');
    });

    it('joinComma handles single and pair lists', () => {
      // docs/api/helpers/arrays.mdx — natural-language joining
      expect(TemplateHelpers.joinComma(['solo'])).toBe('solo');
      expect(TemplateHelpers.joinComma(['a', 'b'])).toBe('a and b');
    });

    it('joinComma returns empty string for empty array', () => {
      // docs/api/helpers/arrays.mdx — Returns: string
      expect(TemplateHelpers.joinComma([])).toBe('');
    });

    it('range produces a numeric range', () => {
      // docs/api/helpers/arrays.mdx — range(start, stop, step=1)
      expect(TemplateHelpers.range(1, 5)).toEqual([1, 2, 3, 4]);
    });

    it('range supports custom step', () => {
      // docs/api/helpers/arrays.mdx — step parameter
      expect(TemplateHelpers.range(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
    });

    it('arrayFromObject converts object entries to {key, value} array', () => {
      // docs/api/helpers/objects.mdx — arrayFromObject "Converts an object to
      // an array for use with {#each}", returning an array of key-value pair
      // objects. The example uses {key} and {value} as iteration variables.
      expect(TemplateHelpers.arrayFromObject({ a: 1, b: 2 })).toEqual([
        { value: 1, key: 'a' },
        { value: 2, key: 'b' },
      ]);
    });

    it('arrayFromObject passes arrays through unchanged', () => {
      // Not documented; preserves existing source behavior so callers passing
      // an already-array value through `{#each arrayFromObject items}` still
      // iterate correctly.
      const input = [1, 2, 3];
      expect(TemplateHelpers.arrayFromObject(input)).toBe(input);
    });

    it('sequence produces multiples', () => {
      // `sequence` is exposed by the helper map but not present in the public
      // helper docs. Behavior anchored to the existing implementation.
      expect(TemplateHelpers.sequence(3)).toEqual([1, 2, 3]);
      expect(TemplateHelpers.sequence(3, 2, 5)).toEqual([10, 12, 14]);
    });
  });

  /*******************************
          Date & Number
  *******************************/

  describe('Date & Number helpers', () => {
    const fixedDate = new Date('2024-06-15T14:30:45Z');

    it('formatDate uses the L preset (MM/DD/YYYY) by default', () => {
      // docs/api/helpers/dates.mdx — formatDate(date, format='L', options)
      const out = TemplateHelpers.formatDate(fixedDate);
      expect(out).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it('formatDate accepts a custom format string', () => {
      // docs/api/helpers/dates.mdx — example: formatDate(date, 'YYYY-MM-DD')
      const out = TemplateHelpers.formatDate(fixedDate, 'YYYY');
      expect(out).toBe('2024');
    });

    it('formatDateTime defaults to LLL preset', () => {
      // docs/api/helpers/dates.mdx — formatDateTime(date, format='LLL', options)
      const out = TemplateHelpers.formatDateTime(fixedDate);
      // LLL = "MMMM D, YYYY h:mm a" — should contain the year
      expect(out).toContain('2024');
    });

    it('formatTime defaults to LTS preset', () => {
      // The component-templating skill documents `formatTime(date, format='LTS', options)`
      // and the date helpers example (docs/src/examples/templates/helpers-date)
      // uses {formatTime lastLogin}. (The api/helpers/dates.mdx page still
      // references the pre-rename `formatDateTimeSeconds`; CLAUDE.md records
      // the BREAKING rename to `formatTime`.)
      const out = TemplateHelpers.formatTime(fixedDate);
      // LTS = "h:mm:ss a"
      expect(out).toMatch(/\d+:\d{2}:\d{2}\s?(am|pm)/i);
    });

    it('roundNumber rounds to N decimal places', () => {
      // docs/api/helpers/numeric.mdx — roundNumber "Rounds a number to a
      // specified number of decimal places", precision: "Number of decimal places"
      // Example: <p>Price: ${roundNumber price 2}</p>
      expect(TemplateHelpers.roundNumber(1.567, 2)).toBe(1.57);
      expect(TemplateHelpers.roundNumber(2.345, 1)).toBe(2.3);
      expect(TemplateHelpers.roundNumber(0, 5)).toBe(0);
    });

    it('round is an alias for roundNumber and uses decimal places', () => {
      // docs/api/helpers/numeric.mdx — round "Alias for roundNumber. Rounds a
      // number to a specified number of decimal places."
      expect(TemplateHelpers.round(1.567, 2)).toBe(1.57);
      expect(TemplateHelpers.round(2.345, 1)).toBe(2.3);
    });

    it('roundDecimal rounds to N decimal places', () => {
      // docs/api/helpers/numeric.mdx — roundDecimal "Rounds a number to a
      // specified number of decimal places using decimal rounding"
      expect(TemplateHelpers.roundDecimal(1.567, 2)).toBe(1.57);
      expect(TemplateHelpers.roundDecimal(2.345, 1)).toBe(2.3);
      expect(TemplateHelpers.roundDecimal(0, 2)).toBe(0);
    });

    it('numberFromIndex adds 1 to a 0-based index', () => {
      // docs/api/helpers/numeric.mdx — numberFromIndex "Returns the index plus
      // one, useful for human-readable numbering"
      expect(TemplateHelpers.numberFromIndex(0)).toBe(1);
      expect(TemplateHelpers.numberFromIndex(4)).toBe(5);
    });
  });

  /*******************************
            Environment
  *******************************/

  describe('Environment flags', () => {
    it('isClient and isServer are mutually exclusive booleans', () => {
      // Not in the public helper docs — these properties are runtime
      // environment markers re-exported from @semantic-ui/utils. Asserting
      // only the shape contract here.
      expect(typeof TemplateHelpers.isClient).toBe('boolean');
      expect(typeof TemplateHelpers.isServer).toBe('boolean');
      expect(TemplateHelpers.isClient).not.toBe(TemplateHelpers.isServer);
    });
  });

  /*******************************
              Debug
  *******************************/

  describe('Debug helpers', () => {
    it('log forwards arguments to console.log', () => {
      // docs/api/helpers/debug.mdx — log "Logs arguments to the console"
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      TemplateHelpers.log('a', 'b', 'c');
      expect(spy).toHaveBeenCalledWith('a', 'b', 'c');
      spy.mockRestore();
    });

    it('debugger does not throw', () => {
      // docs/api/helpers/debug.mdx — debugger "Triggers the JavaScript debugger".
      // Without a debugger attached this is a no-op and must not throw.
      expect(() => TemplateHelpers.debugger()).not.toThrow();
    });

    it('debugReactivity does not throw outside a reactive scope', () => {
      // docs/api/helpers/debug.mdx — debugReactivity "Debugs reactivity by
      // logging the current reaction source". Should be safe to call without
      // an active reaction.
      expect(() => TemplateHelpers.debugReactivity()).not.toThrow();
    });
  });

  /*******************************
            Reactivity
  *******************************/

  describe('Reactivity helpers', () => {
    it('guard returns the wrapped value when given a non-function', () => {
      // docs/api/helpers/reactivity.mdx — guard "Returns: the result of the
      // guarded expression". A literal should pass straight through.
      expect(TemplateHelpers.guard(5)).toBe(5);
      expect(TemplateHelpers.guard('hi')).toBe('hi');
    });

    it('guard invokes a function value and returns its result', () => {
      // docs/api/helpers/reactivity.mdx — same: returns the result of the
      // guarded expression. Functions are invoked via the underlying
      // Reaction.guard.
      expect(TemplateHelpers.guard(() => 42)).toBe(42);
    });

    it('nonreactive returns the wrapped value when given a non-function', () => {
      // docs/api/helpers/reactivity.mdx — nonreactive "Returns: the result of
      // the non-reactive expression"
      expect(TemplateHelpers.nonreactive(5)).toBe(5);
    });

    it('nonreactive invokes a function value and returns its result', () => {
      expect(TemplateHelpers.nonreactive(() => 7)).toBe(7);
    });
  });

  /*******************************
            Registration
  *******************************/

  describe('registerHelper / registerHelpers', () => {
    it('registerHelper adds a single helper by name', () => {
      // docs/api/helpers/index.mdx — registerHelper(name, fn) "Register a
      // single template helper function"
      const fn = (a, b) => a + b;
      registerHelper('addNumbers', fn);
      expect(TemplateHelpers.addNumbers).toBe(fn);
      expect(TemplateHelpers.addNumbers(2, 3)).toBe(5);
    });

    it('registerHelpers adds multiple helpers at once', () => {
      // docs/api/helpers/index.mdx — registerHelpers(helpers) "Register
      // multiple template helper functions at once"
      const helpers = {
        triple: (n) => n * 3,
        shout: (s) => `${s}!`,
      };
      registerHelpers(helpers);
      expect(TemplateHelpers.triple(4)).toBe(12);
      expect(TemplateHelpers.shout('hi')).toBe('hi!');
    });

    it('registerHelper overwrites an existing helper', () => {
      // The docs do not forbid overwriting; templating supports redefining
      // helpers as a customization point.
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
