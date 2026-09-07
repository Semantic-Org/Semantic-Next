import { isDevelopment, isPlainObject, isString } from '@semantic-ui/utils';

import { CalendarDate } from './calendar-date.js';
import { DateTime } from './date-time.js';
import { days, duration } from './duration.js';
import { isUnreadable, loosely, refuse, refuseType, unreadable } from './helpers/errors.js';
import { isDurationFields } from './helpers/fields.js';
import { formatIntlRange, intlOptions } from './helpers/format.js';
import { IS_DATE_RANGE, IS_DATE_TIME_RANGE, IS_DURATION, IS_RANGE, IS_TIME_RANGE } from './helpers/identity.js';
import { inspect, isTemporalDuration } from './helpers/units.js';
import { Time } from './time.js';

/*
  a span between two points, named by what it holds. a date range runs through its end, both days
  included, because that is how people write dates: the 1st through the 7th is seven days. a datetime
  or time range runs until its end, the end excluded, because that is how bookings and shifts abut
*/

const factoryNames = { date: 'dateRange', datetime: 'datetimeRange', time: 'timeRange' };

// dateRange('a/b', { loose }) has no end, so an options bag can sit second. a fields object end has
// unit keys, and this has only the two option keys, so the two never read as each other
const isOptions = (value) =>
  isPlainObject(value) && Object.keys(value).every((key) => key === 'loose' || key === 'zone');

// the shared body. the three exported classes seal it to a kind, so a value names what it holds
class Range {
  // brand range
  get [IS_RANGE]() {
    return true;
  }
  static [Symbol.hasInstance](value) {
    return !!value?.[IS_RANGE];
  }

  #start;
  #end;

  // (start, end, { zone, loose }), or (interval, { zone, loose })
  constructor(start, end, options = {}) {
    const kind = this.constructor.kind;
    if (isOptions(end)) {
      [end, options] = [undefined, end];
    }
    if (start instanceof Range && end === undefined) {
      if (start.kind !== kind) {
        refuseType('mixedRange', `${factoryNames[start.kind]} as ${factoryNames[kind]}`, {
          explanation: isDevelopment
            ? 'a range keeps its kind. convert the ends: datetime.date, date.at(time, zone), or dateRange.in(zone)'
            : 0,
        });
      }
      return start;
    }
    if (isString(start) && end === undefined) {
      [start, end] = start.split('/');
    }
    this.#start = Range.#read(kind, start, undefined, options.zone);
    this.#end = Range.#readEnd(kind, end, this.#start);
    if (this.#end.isBefore(this.#start)) {
      refuse('backwards', `${this.#start} to ${this.#end}`, {
        explanation: isDevelopment ? 'a range runs forward. swap the ends, or use earliest() and latest()' : 0,
      });
    }
    Object.freeze(this);
  }

  // an end reads through the kind's own factory, and a datetime end reads in the start's zone
  static #read(kind, value, start, zone) {
    if (kind === 'date') {
      return new CalendarDate(value);
    }
    if (kind === 'datetime') {
      return new DateTime(value, start?.zone ?? zone);
    }
    return new Time(value);
  }

  // an end is a length when written as one, otherwise a point of the kind, and a string or fields
  // object the kind cannot read is tried as a length: '5pm' is a time, '2h' is two hours
  static #readEnd(kind, value, start) {
    let unread;
    if (!(value?.[IS_DURATION] || isTemporalDuration(value) || isDurationFields(value))) {
      try {
        return Range.#read(kind, value, start);
      }
      catch (error) {
        if (!(isString(value) || isPlainObject(value)) || !isUnreadable(error)) {
          throw error;
        }
        unread = error;
      }
    }
    let length;
    try {
      length = duration(value);
    }
    catch (error) {
      // an end is a point first, so what reads as neither is refused as the point it was meant to be
      throw unread ?? error;
    }
    return kind === 'date' ? start.plus(length).minus(days(1)) : start.plus(length);
  }

  /*******************************
              Reads
  *******************************/

  get start() {
    return this.#start;
  }
  get end() {
    return this.#end;
  }
  get kind() {
    return this.constructor.kind;
  }
  get isEmpty() {
    return this.kind !== 'date' && this.#start.equals(this.#end);
  }

  // the whole length, anchored at the start so months and years total. a date range counts its last day
  get duration() {
    return this.kind === 'date' ? this.#start.until(this.#end.plus(days(1))) : this.#start.until(this.#end);
  }

  /*******************************
            Comparison
  *******************************/

  contains(value) {
    if (value instanceof Range) {
      const rival = this.#make(this.kind, value);
      return !rival.start.isBefore(this.#start) && !rival.end.isAfter(this.#end);
    }
    return this.#holds(value);
  }

  #holds(value) {
    const at = Range.#read(this.kind, value, this.#start);
    if (at.isBefore(this.#start)) {
      return false;
    }
    return this.#inclusive() ? !at.isAfter(this.#end) : at.isBefore(this.#end);
  }

  #inclusive() {
    return this.kind === 'date';
  }

  overlaps(other) {
    const rival = this.#make(this.kind, other);
    if (this.#inclusive()) {
      return !this.#start.isAfter(rival.end) && !rival.start.isAfter(this.#end);
    }
    return this.#start.isBefore(rival.end) && rival.start.isBefore(this.#end);
  }

  #make(kind, start, end) {
    return new byKind[kind](start, end);
  }

  equals(other) {
    const rival = this.#make(this.kind, other);
    return this.#start.equals(rival.start) && this.#end.equals(rival.end);
  }

  /*******************************
             Measure
  *******************************/

  intersection(other) {
    const rival = this.#make(this.kind, other);
    if (!this.overlaps(rival)) {
      return null;
    }
    const start = this.#start.isAfter(rival.start) ? this.#start : rival.start;
    const end = this.#end.isBefore(rival.end) ? this.#end : rival.end;
    return this.#make(this.kind, start, end);
  }

  // a time wraps at midnight and lands behind the last point, which is where its walk ends
  points(step) {
    const size = Range.#step(step);
    const points = [];
    for (let i = 0;; i++) {
      const next = this.#start.plus(size.times(i));
      if (!this.#holds(next) || (i > 0 && !next.isAfter(points[i - 1]))) {
        return points;
      }
      points.push(next);
    }
  }

  // points(unit) walks by whole units, points(duration) by that length. either way the steps count out from
  // the start, so monthly from the 31st lands on each month's last day rather than drifting to the 28th
  static #step(step) {
    const size = isString(step) && !/\d/.test(step) ? duration(1, step) : duration(step);
    if (size.isZero || size.isNegative) {
      refuse('emptyStep', String(size), {
        explanation: isDevelopment ? 'a range walks forward, the step must be positive' : 0,
      });
    }
    return size;
  }

  split(step) {
    const points = this.points(step);
    return points.map((start, i) => {
      const following = points[i + 1];
      if (following === undefined) {
        return this.#make(this.kind, start, this.#end);
      }
      return this.#make(this.kind, start, this.#inclusive() ? following.minus(days(1)) : following);
    });
  }

  // datetimes re-read in a zone. a date range becomes the datetime range covering those days there,
  // which is the bound a database query wants: midnight through the midnight after the last day
  in(zone) {
    if (this.kind === 'date') {
      return this.#make('datetime', this.#start.at('00:00', zone), this.#end.plus(days(1)).at('00:00', zone));
    }
    if (this.kind === 'datetime') {
      return this.#make('datetime', this.#start.in(zone), this.#end.in(zone));
    }
    return refuse('noZone', String(this), {
      explanation: isDevelopment
        ? 'a time range has no date to place in a zone. use time.on(date, zone) for each end'
        : 0,
    });
  }

  /*******************************
              Output
  *******************************/

  format(spec, locale) {
    const options = intlOptions(this.kind, spec);
    if (!options) {
      refuse('noTokens', String(spec), {
        explanation: isDevelopment ? 'a range formats with a preset or Intl options. format each end for tokens' : 0,
      });
    }
    if (this.kind === 'datetime') {
      return formatIntlRange('datetime', this.#start.epoch, this.#end.epoch, options, locale, this.#start.zone);
    }
    return formatIntlRange(this.kind, this.#start.toTemporal(), this.#end.toTemporal(), options, locale);
  }

  toString() {
    return `${this.#start}/${this.#end}`;
  }

  toJSON() {
    return this.toString();
  }

  valueOf() {
    return refuse('notANumber', String(this), {
      explanation: isDevelopment ? 'a range is not a number. read its duration, or compare its start and end' : 0,
    });
  }

  [inspect]() {
    return `${this.constructor.name}(${this.#start} ${this.#inclusive() ? 'through' : 'until'} ${this.#end})`;
  }
}

export class DateRange extends Range {
  // brand date range
  get [IS_DATE_RANGE]() {
    return true;
  }
  static [Symbol.hasInstance](value) {
    return !!value?.[IS_DATE_RANGE];
  }
  static kind = 'date';
}

export class DateTimeRange extends Range {
  // brand datetime range
  get [IS_DATE_TIME_RANGE]() {
    return true;
  }
  static [Symbol.hasInstance](value) {
    return !!value?.[IS_DATE_TIME_RANGE];
  }
  static kind = 'datetime';
}

export class TimeRange extends Range {
  // brand time range
  get [IS_TIME_RANGE]() {
    return true;
  }
  static [Symbol.hasInstance](value) {
    return !!value?.[IS_TIME_RANGE];
  }
  static kind = 'time';
}

const byKind = { date: DateRange, datetime: DateTimeRange, time: TimeRange };

const build = (Kind, start, end, options) => {
  const settings = isOptions(end) ? end : options ?? {};
  const make = () => new Kind(start, end, options);
  return settings.loose ? loosely(make, unreadable.range) : make();
};

export const dateRange = (start, end, options) => build(DateRange, start, end, options);
export const datetimeRange = (start, end, options) => build(DateTimeRange, start, end, options);
export const timeRange = (start, end, options) => build(TimeRange, start, end, options);

export const isDateRange = (value) => value instanceof DateRange;
export const isDateTimeRange = (value) => value instanceof DateTimeRange;
export const isTimeRange = (value) => value instanceof TimeRange;
