import { Reaction } from '@semantic-ui/reactivity';
import {
  capitalize,
  toTitleCase,
  isEmpty,
  arrayFromObject,
  formatDate,
  each,
  escapeHTML,
  range,
  tokenize,
} from '@semantic-ui/utils';

/*
  These could be written in shorthand but its easier for debugging
  if you give have a line to breakpoint on
*/
export const TemplateHelpers = {
  exists(a) {
    return !isEmpty(a);
  },
  isEmpty(a) {
    return isEmpty(a);
  },
  stringify(a) {
    return JSON.stringify(a);
  },
  hasAny(a) {
    return a?.length > 0;
  },
  range(start, stop, step = 1) {
    return range(start, stop, step);
  },
  concat(...args) {
    return args.join('');
  },
  both(a, b) {
    return a && b;
  },
  either(a, b) {
    return a || b;
  },
  join(array = [], delimiter = ' ', spaceAfter = false) {
    if(array.length == 0) {
      return;
    }
    const value = array.join(delimiter).trim();
    return (spaceAfter)
      ? `${value} `
      : value
    ;
  },
  classes(classes, spaceAfter = true) {
    return TemplateHelpers.join(classes, ' ', true);
  },
  joinComma(array = [], oxford = false, quotes = false) {
    return joinWords(array, {
      separator: ', ',
      lastSeparator: ' and ',
      oxford: oxford,
      quotes: quotes,
    });
  },
  classIf(expr, trueClass = '', falseClass = '') {
    let val = expr ? trueClass : falseClass;
    return (val)
      ? `${val} `
      : ''
    ;
  },
  classMap(classObj) {
    let classNames = [];
    each(classObj, (condition, className) => {
      if(condition) {
        classNames.push(className);
      }
    });
    return (classNames.length) ? `${classNames.join(' ')} `: '';
  },
  maybe(expr, trueExpr, falseExpr) {
    return expr ? trueExpr : falseExpr;
  },
  activeIf(expr) {
    return TemplateHelpers.classIf(expr, 'active', '');
  },
  selectedIf(expr) {
    return TemplateHelpers.classIf(expr, 'selected', '');
  },
  capitalize(text = '') {
    return capitalize(text);
  },
  titleCase(text = '') {
    return toTitleCase(text);
  },
  disabledIf(expr) {
    return TemplateHelpers.classIf(expr, 'disabled', '');
  },
  checkedIf(expr) {
    return TemplateHelpers.classIf(expr, 'checked', '');
  },
  maybePlural(value, plural = 's') {
    return value == 1 ? '' : plural;
  },
  not(a) {
    return !a;
  },
  is(a, b) {
    return a == b;
  },
  notEqual(a, b) {
    return a !== b;
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
  numberFromIndex(a) {
    return a + 1;
  },
  formatDate(date = new Date(), format = 'L', options = { timezone: 'local' }) {
    return formatDate(date, format, options);
  },
  formatDateTime(date = new Date(), format = 'LLL', options = { timezone: 'local' }) {
    return formatDate(date, format, options);
  },
  formatDateTimeSeconds(date = new Date(), format = 'LTS', options = { timezone: 'local' }) {
    return formatDate(date, format, options);
  },
  object({ obj }) {
    return obj;
  },
  log(...args) {
    console.log(...args);
  },
  debugger() {
    debugger;
  },
  tokenize(string = '') {
    return tokenize(string);
  },
  debugReactivity() {
    Reaction.getSource();
  },
  arrayFromObject(obj) {
    return arrayFromObject(obj);
  },
  escapeHTML(string) {
    return escapeHTML(string);
  },
  guard: Reaction.guard,
  nonreactive: Reaction.nonreactive,
};
