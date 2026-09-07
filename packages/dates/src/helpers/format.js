import { isPlainObject, isString } from '@semantic-ui/utils';

import { refuse } from './errors.js';
import { ordinal, pad } from './units.js';
import { locale as pickLocale } from './zones.js';

// longest spelling first so MMMM never reads as four Ms
const tokenPattern =
  /\[([^\]]*)\]|YYYY|YY|MMMM|MMM|MM|M|Do|DD|D|dddd|ddd|dd|HH|H|hh|h|mm|m|ss|s|SSS|A|a|ZZ|Z|zzzz|z|X|x|Q|W/g;

const nameCache = new Map();

// month and weekday names come from Intl for the locale, so tokens stay legible outside English
const names = (locale) => {
  const key = locale ?? '';
  if (!nameCache.has(key)) {
    const month = (style) =>
      Array.from(
        { length: 12 },
        (_, i) => new Intl.DateTimeFormat(locale, { month: style, timeZone: 'UTC' }).format(Date.UTC(2000, i, 1)),
      );
    // 2024-01-01 fell on a monday, so index 0 is monday to match ISO weekday numbering
    const weekday = (style) =>
      Array.from(
        { length: 7 },
        (_, i) => new Intl.DateTimeFormat(locale, { weekday: style, timeZone: 'UTC' }).format(Date.UTC(2024, 0, 1 + i)),
      );
    nameCache.set(key, { MMM: month('short'), MMMM: month('long'), ddd: weekday('short'), dddd: weekday('long') });
  }
  return nameCache.get(key);
};

const zoneName = (parts, locale, style) =>
  new Intl.DateTimeFormat(locale, { timeZoneName: style, timeZone: parts.zone })
    .formatToParts(parts.epoch)
    .find((part) => part.type === 'timeZoneName')?.value;

const tokens = {
  YYYY: (p) => pad(p.year, 4),
  YY: (p) => pad(p.year % 100),
  M: (p) => String(p.month),
  MM: (p) => pad(p.month),
  MMM: (p, l) => names(l).MMM[p.month - 1],
  MMMM: (p, l) => names(l).MMMM[p.month - 1],
  D: (p) => String(p.day),
  DD: (p) => pad(p.day),
  Do: (p) => ordinal(p.day),
  dd: (p, l) => names(l).ddd[p.weekday - 1].slice(0, 2),
  ddd: (p, l) => names(l).ddd[p.weekday - 1],
  dddd: (p, l) => names(l).dddd[p.weekday - 1],
  H: (p) => String(p.hour),
  HH: (p) => pad(p.hour),
  h: (p) => String(p.hour % 12 || 12),
  hh: (p) => pad(p.hour % 12 || 12),
  m: (p) => String(p.minute),
  mm: (p) => pad(p.minute),
  s: (p) => String(p.second),
  ss: (p) => pad(p.second),
  SSS: (p) => pad(p.millisecond, 3),
  A: (p) => (p.hour < 12 ? 'AM' : 'PM'),
  a: (p) => (p.hour < 12 ? 'am' : 'pm'),
  Z: (p) => p.offset,
  ZZ: (p) => p.offset.replace(':', ''),
  z: (p, l) => zoneName(p, l, 'short'),
  zzzz: (p, l) => zoneName(p, l, 'long'),
  X: (p) => String(Math.floor(p.epoch / 1000)),
  x: (p) => String(p.epoch),
  Q: (p) => String(Math.ceil(p.month / 3)),
  W: (p) => String(p.weekOfYear),
};

// the field each token reads, so a date asked for hours refuses instead of printing zeros
const needs = {
  YYYY: 'year',
  YY: 'year',
  M: 'month',
  MM: 'month',
  MMM: 'month',
  MMMM: 'month',
  Q: 'month',
  D: 'day',
  DD: 'day',
  Do: 'day',
  dd: 'weekday',
  ddd: 'weekday',
  dddd: 'weekday',
  W: 'weekOfYear',
  H: 'hour',
  HH: 'hour',
  h: 'hour',
  hh: 'hour',
  A: 'hour',
  a: 'hour',
  m: 'minute',
  mm: 'minute',
  s: 'second',
  ss: 'second',
  SSS: 'millisecond',
  Z: 'offset',
  ZZ: 'offset',
  z: 'zone',
  zzzz: 'zone',
  X: 'epoch',
  x: 'epoch',
};

export const formatTokens = (parts, pattern, locale) => {
  const resolved = pickLocale(locale);
  return pattern.replace(tokenPattern, (token, literal) => {
    if (literal !== undefined) {
      return literal;
    }
    if (parts[needs[token]] === undefined) {
      refuse('noField', `${token} in '${pattern}'`, {
        explanation: `a ${parts.kind} has no ${needs[token]}. combine it into a datetime first`,
      });
    }
    return tokens[token](parts, resolved);
  });
};

const presets = {
  datetime: {
    short: { dateStyle: 'short', timeStyle: 'short' },
    medium: { dateStyle: 'medium', timeStyle: 'short' },
    long: { dateStyle: 'long', timeStyle: 'short' },
    full: { dateStyle: 'full', timeStyle: 'short' },
    date: { dateStyle: 'medium' },
    time: { timeStyle: 'short' },
  },
  date: {
    short: { dateStyle: 'short' },
    medium: { dateStyle: 'medium' },
    long: { dateStyle: 'long' },
    full: { dateStyle: 'full' },
  },
  time: {
    default: { timeStyle: 'short' },
    short: { timeStyle: 'short' },
    medium: { timeStyle: 'medium' },
    long: { timeStyle: 'long' },
    full: { timeStyle: 'full' },
  },
};

// a preset name or an Intl options bag resolves to Intl options, a token pattern resolves to undefined
export const intlOptions = (kind, spec) => {
  if (spec === undefined) {
    return presets[kind].default ?? presets[kind].medium;
  }
  if (isPlainObject(spec)) {
    return spec;
  }
  return isString(spec) ? presets[kind][spec] : undefined;
};

// Intl gets epoch milliseconds and a zone on every engine. a date is its UTC midnight read in UTC, a
// time is that clock on the epoch day, so the fields print unshifted whether Temporal is native or not
const epochOf = (kind, subject) => {
  if (kind === 'date') {
    return Date.UTC(subject.year, subject.month - 1, subject.day);
  }
  if (kind === 'time') {
    return Date.UTC(1970, 0, 1, subject.hour, subject.minute, subject.second, subject.millisecond);
  }
  return subject;
};

const formatter = (kind, options, locale, zone) =>
  new Intl.DateTimeFormat(pickLocale(locale), { ...options, timeZone: kind === 'datetime' ? zone : 'UTC' });

export const formatIntl = (kind, subject, options, locale, zone) =>
  formatter(kind, options, locale, zone).format(epochOf(kind, subject));

export const formatIntlRange = (kind, start, end, options, locale, zone) =>
  formatter(kind, options, locale, zone).formatRange(epochOf(kind, start), epochOf(kind, end));

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;
const monthSeconds = 30.436875 * daySeconds;
const yearSeconds = 365.2425 * daySeconds;

// thresholds: 44 seconds is seconds, 44 minutes is minutes, 21 hours is hours, 25 days is days
const pickUnit = (seconds) => {
  const size = Math.abs(seconds);
  if (size < 45) {
    return ['second', 1];
  }
  if (size < 45 * minuteSeconds) {
    return ['minute', minuteSeconds];
  }
  if (size < 22 * hourSeconds) {
    return ['hour', hourSeconds];
  }
  if (size < 26 * daySeconds) {
    return ['day', daySeconds];
  }
  if (size < 320 * daySeconds) {
    return ['month', monthSeconds];
  }
  return ['year', yearSeconds];
};

export const relativeSeconds = (seconds, locale) => {
  const [name, size] = pickUnit(seconds);
  const value = Math.round(seconds / size);
  return new Intl.RelativeTimeFormat(pickLocale(locale), { numeric: 'auto' }).format(value, name);
};

// Intl supplies yesterday and tomorrow
export const relativeDays = (days, locale) => {
  const size = Math.abs(days);
  const [name, value] = size < 7
    ? ['day', days]
    : size < 26
    ? ['week', Math.round(days / 7)]
    : size < 320
    ? ['month', Math.round(days / 30.436875)]
    : ['year', Math.round(days / 365.2425)];
  return new Intl.RelativeTimeFormat(pickLocale(locale), { numeric: 'auto' }).format(value, name);
};
