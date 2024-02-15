import { Reaction } from '@semantic-ui/reactivity';
import { capitalize, toTitleCase, formatDate } from '@semantic-ui/utils';

// these could be written in shorthand but its easier to debug if you can add a line manually
export const Helpers = {
  is: (a, b) => {
    return a == b;
  },
  not: (a) => {
    return !a;
  },
  maybe(expr, trueClass = '', falseClass = '') {
    return expr ? trueClass + ' ' : falseClass;
  },
  activeIf: (expr) => {
    return Helpers.maybe(expr, 'active', '');
  },
  selectedIf: (expr) => {
    return Helpers.maybe(expr, 'selected', '');
  },
  capitalize: (text = '') => {
    return capitalize(text);
  },
  titleCase: (text = '') => {
    return toTitleCase(text);
  },
  disabledIf: (expr) => {
    return Helpers.maybe(expr, 'disabled', '');
  },
  checkedIf: (expr) => {
    return Helpers.maybe(expr, 'checked', '');
  },
  isEqual: (a, b) => {
    return a == b;
  },
  maybePlural(value, plural = 's') {
    return value == 1 ? '' : plural;
  },
  isNotEqual: (a, b) => {
    return a != b;
  },
  isExactlyEqual: (a, b) => {
    return a === b;
  },
  isNotExactlyEqual: (a, b) => {
    return a !== b;
  },
  greaterThan: (a, b) => {
    return a > b;
  },
  lessThan: (a, b) => {
    return a < b;
  },
  greaterThanEquals: (a, b) => {
    return a >= b;
  },
  lessThanEquals: (a, b) => {
    return a <= b;
  },
  numberFromIndex: (a) => {
    return a + 1;
  },
  formatDate: (date = new Date(), format = 'L') => {
    return formatDate(date, format);
  },
  formatDateTime: (date = new Date(), format = 'LLL') => {
    return formatDate(date, format);
  },
  formatDateTimeSeconds: (date = new Date(), format = 'LTS') => {
    return formatDate(date, format);
  },
  object: ({ obj }) => {
    return obj;
  },
  log(...args) {
    console.log(...args);
  },
  debugger: () => {
    debugger;
  },
  reactiveDebug() {
    Reaction.getSource();
    debugger;
  },
  guard: Reaction.guard,
  nonreactive: Reaction.nonreactive,
};
