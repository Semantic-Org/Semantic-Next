import { isPlainObject } from '@semantic-ui/utils';

// an Intl constructor costs about a hundred format calls, so each formatter is built once per
// locale, zone and options and reused, the way utils' formatDate keeps its own
const cached = (make) => {
  const cache = new Map();
  return (...args) => {
    const key = args.map((arg) => (isPlainObject(arg) ? JSON.stringify(arg) : String(arg))).join('|');
    let formatter = cache.get(key);
    if (!formatter) {
      formatter = make(...args);
      cache.set(key, formatter);
    }
    return formatter;
  };
};

export const dateTimeFormat = cached((locale, options) => new Intl.DateTimeFormat(locale, options));
export const relativeTimeFormat = cached((locale) => new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }));
export const durationFormat = cached((locale, options) => new Intl.DurationFormat(locale, options));
export const numberFormat = cached((locale, options) => new Intl.NumberFormat(locale, options));
