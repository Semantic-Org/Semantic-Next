import { isPlainObject } from '@semantic-ui/utils';

import { guard } from './errors.js';

// an Intl constructor costs about a hundred format calls, so each formatter is built once per argument
// list and reused, the way utils' formatDate keeps its own. the arguments key nested maps, a string by
// value and a frozen options object by identity, so a preset costs no serialization on a format call.
// a caller's own object may change between calls, so it keys by its fields. every call of one formatter
// passes the same number of arguments
const cached = (make) => {
  const root = new Map();
  return (...args) => {
    let level = root;
    const last = args.length - 1;
    for (let index = 0; index <= last; index++) {
      const arg = args[index];
      const key = isPlainObject(arg) && !Object.isFrozen(arg) ? JSON.stringify(arg) : arg;
      let next = level.get(key);
      if (next === undefined) {
        next = index === last ? make(...args) : new Map();
        level.set(key, next);
      }
      level = next;
    }
    return level;
  };
};

// a datetime prints in its zone unless the options name one. a date or a time has no instant, so its
// fields print through UTC whatever the options say. an unknown option throws as the formatter is built,
// so the refusal wraps the build alone and a call that finds its formatter pays nothing for it
export const zonedDateTimeFormat = cached((locale, options, zone) =>
  guard(() => new Intl.DateTimeFormat(locale, { timeZone: zone, ...options }), 'unknownFormat', JSON.stringify(options))
);
export const plainDateTimeFormat = cached((locale, options) =>
  guard(
    () => new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }),
    'unknownFormat',
    JSON.stringify(options),
  )
);
export const relativeTimeFormat = cached((locale) => new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }));
export const durationFormat = cached((locale, style, hoursDisplay) =>
  new Intl.DurationFormat(locale, { style, hoursDisplay })
);
export const unitFormat = cached((locale, unit, unitDisplay) =>
  new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay })
);
