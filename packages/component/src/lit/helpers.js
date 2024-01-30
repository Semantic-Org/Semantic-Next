import { formatDate } from '@semantic-ui/utils';

// these could be written in shorthand but its easier to debug if you can add a line manually
export const Helpers = {
  is: (a, b) => {
    return a == b;
  },
  not: (a) => {
    return !a;
  },
  isEqual: (a, b) => {
    return a == b;
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
  debugger: () => {
    debugger;
  },
};
