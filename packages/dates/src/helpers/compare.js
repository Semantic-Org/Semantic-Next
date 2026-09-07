import { isArray, isDate, isDevelopment, isString } from '@semantic-ui/utils';

import { CalendarDate } from '../calendar-date.js';
import { DateTime } from '../date-time.js';
import { Time } from '../time.js';
import { refuse, refuseType } from './errors.js';
import {
  IS_CALENDAR_DATE,
  IS_DATE_RANGE,
  IS_DATE_TIME,
  IS_DATE_TIME_RANGE,
  IS_DURATION,
  IS_RANGE,
  IS_TIME,
  IS_TIME_RANGE,
} from './identity.js';
import { isInstant, isPlainDate, isPlainDateTime, isPlainTime, isZonedDateTime } from './units.js';

const looksLikeTime = /^\d{1,2}(?::\d{2}){0,2}(?:\.\d+)?\s*(?:[ap]\.?m\.?)?$/i;
const looksLikeDateTime = /[T ]\d|[zZ]$|\[[^\]]+\]$/;

// a string reads by its shape: a clock is a time, anything carrying a time or zone is a datetime, the
// rest is a date. every other input already knows what it is
export const point = (input) => {
  if (input?.[IS_DATE_TIME] || input?.[IS_CALENDAR_DATE] || input?.[IS_TIME]) {
    return input;
  }
  if (isString(input)) {
    const text = input.trim();
    if (looksLikeTime.test(text)) {
      return new Time(text);
    }
    if (looksLikeDateTime.test(text)) {
      return new DateTime(text);
    }
    return new CalendarDate(text);
  }
  if (isDate(input) || isZonedDateTime(input) || isInstant(input) || isPlainDateTime(input)) {
    return new DateTime(input);
  }
  if (isPlainDate(input)) {
    return new CalendarDate(input);
  }
  if (isPlainTime(input)) {
    return new Time(input);
  }
  return refuseType('notAPoint', String(input), {
    explanation: isDevelopment ? 'a point is a datetime, a date or a time, or a string that reads as one' : 0,
  });
};

export const kindOf = (value) => {
  if (value?.[IS_DATE_TIME]) {
    return 'datetime';
  }
  if (value?.[IS_CALENDAR_DATE]) {
    return 'date';
  }
  if (value?.[IS_TIME]) {
    return 'time';
  }
  if (value?.[IS_DURATION]) {
    return 'duration';
  }
  if (value?.[IS_DATE_RANGE]) {
    return 'dateRange';
  }
  if (value?.[IS_DATE_TIME_RANGE]) {
    return 'datetimeRange';
  }
  if (value?.[IS_TIME_RANGE]) {
    return 'timeRange';
  }
  return undefined;
};

const sameKind = (left, right) => {
  if (kindOf(left) !== kindOf(right)) {
    refuseType('mixedKinds', `${kindOf(left)} with ${kindOf(right)}`, {
      explanation: isDevelopment
        ? 'compare a datetime with a datetime, a date with a date. convert first: datetime.date, date.at(time, zone)'
        : 0,
    });
  }
};

// a sort comparator. both sides must be the same kind of thing, a raw value reads as the first's kind.
// ranges order by their start, then by their end, the order a database gives its range types
export const compare = (a, b) => {
  if (a?.[IS_DURATION]) {
    return a.compare(b);
  }
  if (a?.[IS_RANGE]) {
    sameKind(a, b);
    return compare(a.start, b.start) || compare(a.end, b.end);
  }
  const left = point(a);
  const right = b?.[IS_DURATION] ? b : point(b);
  sameKind(left, right);
  return left.isBefore(right) ? -1 : left.isAfter(right) ? 1 : 0;
};

const pick = (values, verb, wins) => {
  const points = (values.length === 1 && isArray(values[0]) ? values[0] : values).map(point);
  if (!points.length) {
    refuse('noPoints', verb, { explanation: isDevelopment ? `${verb}() needs at least one point` : 0 });
  }
  return points.reduce((best, next) => (wins(compare(next, best)) ? next : best));
};

export const earliest = (...values) => pick(values, 'earliest', (order) => order < 0);

export const latest = (...values) => pick(values, 'latest', (order) => order > 0);
