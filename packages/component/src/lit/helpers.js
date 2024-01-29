import { formatDate } from '@semantic-ui/utils';

export const Helpers = {
  not: (a) => !a,
  isEqual: (a, b) => a === b,
  isNotEqual: (a, b) => a !== b,
  greaterThan: (a, b) => a > b,
  lessThan: (a, b) => a < b,
  greaterThanEquals: (a, b) => a >= b,
  lessThanEquals: (a, b) => a <= b,
  numberFromIndex: (a) => a + 1,
  formatDate: (date = new Date(), format = 'L') => formatDate(date, format),
  formatDateTime: (date = new Date(), format = 'LLL') => formatDate(date, format),
  formatDateTimeSeconds: (date = new Date(), format = 'LTS') => formatDate(date, format),
  debugger: () => { debugger; }
};
