import { Reaction } from '@semantic-ui/reactivity';
import {
  arrayFromObject,
  capitalize,
  each,
  escapeHTML,
  first,
  formatDate,
  isEmpty,
  joinWords,
  last,
  range,
  roundDecimal,
  roundNumber,
  tokenize,
  toTitleCase,
  truncate,
  wrapFunction,
} from '@semantic-ui/utils';

/*
  These could be written in shorthand but its easier for debugging
  if you give have a line to breakpoint on
*/
export const TemplateHelpers = {
  // Logical helpers
  exists(a) {
    return !isEmpty(a);
  },
  isEmpty(a) {
    return isEmpty(a);
  },
  hasAny(a) {
    return a?.length > 0;
  },
  both(a, b) {
    return a && b;
  },
  either(a, b) {
    return a || b;
  },
  maybe(expr, trueExpr, falseExpr) {
    return expr ? trueExpr : falseExpr;
  },
  not(a) {
    return !a;
  },

  // Comparison helpers
  is(a, b) {
    return a == b;
  },
  isNot(a, b) {
    return a !== b;
  },
  notEqual(a, b) {
    return TemplateHelpers.isNot(a, b);
  },
  isExactly(a, b) {
    return a === b;
  },
  isNotExactly(a, b) {
    return a !== b;
  },
  greaterThan(a, b) {
    return a > b;
  },
  lessThan(a, b) {
    return a < b;
  },
  greaterThanEquals(a, b) {
    return a >= b;
  },
  lessThanEquals(a, b) {
    return a <= b;
  },

  // String helpers
  concat(...args) {
    return args.join('');
  },
  capitalize(text = '') {
    return capitalize(text);
  },
  titleCase(text = '') {
    return toTitleCase(text);
  },
  stringify(a) {
    return JSON.stringify(a);
  },
  maybePlural(value, plural = 's') {
    return value == 1 ? '' : plural;
  },
  tokenize(string = '') {
    return tokenize(string);
  },
  escapeHTML(string) {
    return escapeHTML(string);
  },
  default(value, fallback) {
    return value ?? fallback;
  },
  truncate(text, length, options) {
    return truncate(text, length, options);
  },
  lowercase(text) {
    return text?.toLowerCase?.() || text;
  },
  uppercase(text) {
    return text?.toUpperCase?.() || text;
  },

  // CSS helpers
  classIf(expr, trueClass = '', falseClass = '') {
    let val = expr ? trueClass : falseClass;
    return (val)
      ? `${val} `
      : '';
  },
  classMap(classObj) {
    let classNames = [];
    each(classObj, (condition, className) => {
      if (condition) {
        classNames.push(className);
      }
    });
    return (classNames.length) ? `${classNames.join(' ')} ` : '';
  },
  activeIf(expr) {
    return TemplateHelpers.classIf(expr, 'active', '');
  },
  selectedIf(expr) {
    return TemplateHelpers.classIf(expr, 'selected', '');
  },
  disabledIf(expr) {
    return TemplateHelpers.classIf(expr, 'disabled', '');
  },
  checkedIf(expr) {
    return TemplateHelpers.classIf(expr, 'checked', '');
  },

  // Array & Object helpers
  first(array) {
    return first(array);
  },
  last(array) {
    return last(array);
  },
  count(a) {
    return a?.length || 0;
  },
  join(array = [], delimiter = ' ', spaceAfter = false) {
    if (array.length == 0) {
      return;
    }
    const value = array.join(delimiter).trim();
    return (spaceAfter)
      ? `${value} `
      : value;
  },
  classes(classes, spaceAfter = true) {
    return TemplateHelpers.join(classes, ' ', true);
  },
  joinComma(array = [], oxford, quotes) {
    return joinWords(array, {
      separator: ', ',
      lastSeparator: ' and ',
      oxford: oxford,
      quotes: quotes,
    });
  },
  range(start, stop, step = 1) {
    return range(start, stop, step);
  },
  arrayFromObject(obj) {
    return arrayFromObject(obj);
  },

  // Date & Number helpers
  formatDate(date = new Date(), format = 'L', options = { timezone: 'local' }) {
    return formatDate(date, format, options);
  },
  formatDateTime(date = new Date(), format = 'LLL', options = { timezone: 'local' }) {
    return formatDate(date, format, options);
  },
  formatDateTimeSeconds(date = new Date(), format = 'LTS', options = { timezone: 'local' }) {
    return formatDate(date, format, options);
  },
  roundNumber(number, precision) {
    return roundNumber(number, precision);
  },
  round(number, precision) {
    return roundNumber(number, precision);
  },
  roundDecimal(number, precision) {
    return roundDecimal(number, precision);
  },
  numberFromIndex(a) {
    return a + 1;
  },

  // Global
  log(...args) {
    console.log(...args);
  },
  debugger(...args) {
    debugger;
  },
  debugReactivity() {
    Reaction.getSource();
  },
  guard: (value) => {
    return Reaction.guard(wrapFunction(value));
  },
  nonreactive: (value) => {
    return Reaction.nonreactive(wrapFunction(value));
  },
};
