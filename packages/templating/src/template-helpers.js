import { Reaction } from '@semantic-ui/reactivity';
import {
  capitalize,
  toTitleCase,
  isEmpty,
  arrayFromObject,
  formatDate,
  each,
  escapeHTML,
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
    a?.length > 0;
  },
  is(a, b) {
    return a == b;
  },
  concat(a, b) {
    return a + b;
  },
  not(a) {
    return !a;
  },
  both(a, b) {
    return a && b;
  },
  classes(array = []) {
    return array.join(' ') + ' ';
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
  isEqual(a, b) {
    return a == b;
  },
  maybePlural(value, plural = 's') {
    return value == 1 ? '' : plural;
  },
  isNotEqual(a, b) {
    return a != b;
  },
  isExactlyEqual(a, b) {
    return a === b;
  },
  isNotExactlyEqual(a, b) {
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
  formatDate(date = new Date(), format = 'L') {
    return formatDate(date, format);
  },
  formatDateTime(date = new Date(), format = 'LLL') {
    return formatDate(date, format);
  },
  formatDateTimeSeconds(date = new Date(), format = 'LTS') {
    return formatDate(date, format);
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
    debugger;
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
