import { isDate, isDevelopment, isNumber, isPlainObject, isString } from '@semantic-ui/utils';

import { DateTime } from './date-time.js';
import { anchored } from './duration.js';
import { guard, loosely, refuse, refuseType } from './helpers/errors.js';
import { fieldsFrom, temporalDurationFrom } from './helpers/fields.js';
import { formatIntl, formatTokens, intlOptions, relativeDays } from './helpers/format.js';
import { IS_CALENDAR_DATE } from './helpers/identity.js';
import {
  inspect,
  isPlainDate,
  isPlainDateTime,
  isZonedDateTime,
  quarterStart,
  singularKeys,
  stepOf,
  timeUnits,
  unit,
  weekdayNumber,
} from './helpers/units.js';
import { weekStart, zoneId } from './helpers/zones.js';
import { DateRange } from './range.js';
import { Time } from './time.js';

/*
  a calendar date with no time and no zone: a due date, a birthday, a booking night. it is not a
  moment, so it never shifts when read from another zone
*/

const hasTime = /[T ]\d{1,2}(?::?\d{2})?/;
const hasOffset = /(?:[zZ]|[+-]\d{2}(?::?\d{2})?)$/;

export class CalendarDate {
  // brand calendar date
  get [IS_CALENDAR_DATE]() {
    return true;
  }
  static [Symbol.hasInstance](value) {
    return !!value?.[IS_CALENDAR_DATE];
  }

  #plain;

  // date(2026, 9, 6), or date(input, { zone, loose })
  constructor(input, second, third) {
    const settings = isPlainObject(second) ? second : {};
    this.#plain = isPlainDate(input)
      ? input
      : CalendarDate.#read(input, isPlainObject(second) ? undefined : second, third, settings);
    Object.freeze(this);
  }

  static #read(input, month, day, settings) {
    if (settings.zone !== undefined) {
      zoneId(settings.zone);
    }
    if (input === undefined || input === null) {
      return refuseType('notADate', String(input), {
        explanation: isDevelopment
          ? 'today() is the current day. a missing value is refused so an absent field never silently becomes today'
          : 0,
      });
    }
    if (isNumber(input) && isNumber(month)) {
      return guard(
        () => Temporal.PlainDate.from({ year: input, month, day: day ?? 1 }, { overflow: 'reject' }),
        'unreadableDate',
        `${input}-${month}-${day}`,
      );
    }
    if (input instanceof CalendarDate) {
      return input.toTemporal();
    }
    if (input instanceof DateTime) {
      return input.toTemporal().toPlainDate();
    }
    if (isDate(input) || isNumber(input)) {
      return new DateTime(input, settings).toTemporal().toPlainDate();
    }
    if (isString(input)) {
      try {
        return CalendarDate.#parse(input);
      }
      catch (error) {
        if (!settings.loose || (error.code !== 'notADate' && error.code !== 'unreadableDate')) {
          throw error;
        }
        return new DateTime(input, settings).toTemporal().toPlainDate();
      }
    }
    if (isZonedDateTime(input) || isPlainDateTime(input)) {
      return input.toPlainDate();
    }
    if (isPlainObject(input)) {
      return guard(
        () => Temporal.PlainDate.from(singularKeys(input), { overflow: 'reject' }),
        'unreadableDate',
        JSON.stringify(input),
      );
    }
    return refuseType('notADate', String(input), {
      explanation: isDevelopment
        ? "a date is an ISO string like '2026-09-06', three numbers, a fields object, a datetime, or a Temporal value"
        : 0,
    });
  }

  // a wall-clock string keeps its day and drops the clock. a string carrying Z or an offset is an
  // instant, and which day it falls on depends on the zone, so it is refused with the two ways to choose
  static #parse(text) {
    const trimmed = text.trim();
    if (hasTime.test(trimmed) && hasOffset.test(trimmed)) {
      refuse('notADate', text, {
        explanation: isDevelopment
          ? 'that string is an instant. datetime(text, zone).date chooses its day in a zone, and so does { loose: true, zone } here'
          : 0,
      });
    }
    return guard(
      () => Temporal.PlainDate.from(trimmed),
      'unreadableDate',
      text,
      isDevelopment ? "write ISO 8601: '2026-09-06'. { loose: true } reads what Date reads" : undefined,
    );
  }

  /*******************************
              Reads
  *******************************/

  get year() {
    return this.#plain.year;
  }
  get month() {
    return this.#plain.month;
  }
  get day() {
    return this.#plain.day;
  }
  get weekday() {
    return this.#plain.dayOfWeek;
  }
  get quarter() {
    return Math.ceil(this.#plain.month / 3);
  }
  get dayOfYear() {
    return this.#plain.dayOfYear;
  }
  get weekOfYear() {
    return this.#plain.weekOfYear;
  }
  get daysInMonth() {
    return this.#plain.daysInMonth;
  }
  get daysInYear() {
    return this.#plain.daysInYear;
  }
  get isLeapYear() {
    return this.#plain.inLeapYear;
  }
  get isWeekend() {
    return this.#plain.dayOfWeek >= 6;
  }
  get isWeekday() {
    return this.#plain.dayOfWeek < 6;
  }

  /*******************************
            Arithmetic
  *******************************/

  plus(amount, name) {
    return new CalendarDate(
      guard(() => this.#plain.add(CalendarDate.#dateFields(amount, name)), 'cannotAdd', `${amount} ${name ?? ''}`),
    );
  }

  minus(amount, name) {
    return new CalendarDate(
      guard(
        () => this.#plain.subtract(CalendarDate.#dateFields(amount, name)),
        'cannotSubtract',
        `${amount} ${name ?? ''}`,
      ),
    );
  }

  static #dateFields(amount, name) {
    const fields = fieldsFrom(amount, name);
    const clock = timeUnits.find((time) => fields[`${time}s`]);
    if (clock) {
      refuse('notADateUnit', `${clock}s`, {
        explanation: isDevelopment
          ? 'a date has no clock. add days, or combine it with a time first: date.at(time, zone).plus(hours)'
          : 0,
      });
    }
    return temporalDurationFrom(fields);
  }

  set(fields, value) {
    const changes = isString(fields) ? { [unit(fields)]: value } : singularKeys(fields);
    return new CalendarDate(guard(() => this.#plain.with(changes), 'cannotSet', JSON.stringify(changes)));
  }

  startOf(name) {
    switch (unit(name)) {
      case 'year':
        return new CalendarDate(this.#plain.with({ month: 1, day: 1 }));
      case 'quarter':
        return new CalendarDate(this.#plain.with({ month: quarterStart(this.month), day: 1 }));
      case 'month':
        return new CalendarDate(this.#plain.with({ day: 1 }));
      case 'week':
        return new CalendarDate(this.#plain.subtract({ days: (this.weekday - weekStart() + 7) % 7 }));
      case 'day':
        return this;
      default:
        return refuse('notADateUnit', String(name), {
          explanation: isDevelopment ? 'a date starts at year, quarter, month, week or day' : 0,
        });
    }
  }

  // the last day of the unit: endOf('month') is the 28th, 30th or 31st
  endOf(name) {
    return this.startOf(name).plus(stepOf(unit(name))).minus({ days: 1 });
  }

  next(weekday) {
    const delta = (weekdayNumber(weekday) - this.weekday + 7) % 7 || 7;
    return this.plus({ days: delta });
  }

  previous(weekday) {
    const delta = (this.weekday - weekdayNumber(weekday) + 7) % 7 || 7;
    return this.minus({ days: delta });
  }

  /*******************************
            Comparison
  *******************************/

  equals(other) {
    return this.#compare(other) === 0;
  }

  #compare(other) {
    return Temporal.PlainDate.compare(this.#plain, new CalendarDate(other).toTemporal());
  }

  isBefore(other) {
    return this.#compare(other) < 0;
  }

  isAfter(other) {
    return this.#compare(other) > 0;
  }

  isSame(other, name) {
    if (name === undefined) {
      return this.equals(other);
    }
    return this.startOf(name).equals(new CalendarDate(other).startOf(name));
  }

  // today depends on where you stand, so these take the zone to judge from
  isPast(zone) {
    return this.isBefore(today(zone));
  }

  isFuture(zone) {
    return this.isAfter(today(zone));
  }

  isToday(zone) {
    return this.equals(today(zone));
  }

  isTomorrow(zone) {
    return this.equals(today(zone).plus({ days: 1 }));
  }

  isYesterday(zone) {
    return this.equals(today(zone).minus({ days: 1 }));
  }

  /*******************************
             Measure
  *******************************/

  until(other, name) {
    const end = new CalendarDate(other);
    const span = anchored(this.#plain.until(end.toTemporal(), { largestUnit: 'year' }), this.#plain);
    return name === undefined ? span : span.total(name);
  }

  since(other, name) {
    return new CalendarDate(other).until(this, name);
  }

  // this date at a time of day in a zone: the moment an appointment happens
  at(when, zone) {
    const plainTime = new Time(when ?? '00:00').toTemporal();
    return new DateTime(this.#plain.toZonedDateTime({ timeZone: zoneId(zone), plainTime }));
  }

  to(end) {
    return new DateRange(this, end);
  }

  // every day of the unit containing this date, first through last
  range(name) {
    return new DateRange(this.startOf(name), this.endOf(name));
  }

  /*******************************
              Output
  *******************************/

  format(spec, locale) {
    const options = intlOptions('date', spec);
    return options ? formatIntl('date', this.#plain, options, locale) : formatTokens(this.#parts(), spec, locale);
  }

  #parts() {
    return {
      kind: 'date',
      year: this.year,
      month: this.month,
      day: this.day,
      weekday: this.weekday,
      weekOfYear: this.weekOfYear,
    };
  }

  // 'tomorrow', 'in 3 weeks', 'last month'. measured against today unless told otherwise
  relative(to, locale) {
    const reference = to === undefined ? today() : new CalendarDate(to);
    return relativeDays(reference.until(this, 'day'), locale);
  }

  toString() {
    return this.#plain.toString();
  }

  toJSON() {
    return this.#plain.toString();
  }

  toJSDate(zone) {
    return this.at('00:00', zone).toJSDate();
  }

  toTemporal() {
    return this.#plain;
  }

  valueOf() {
    return refuse('notANumber', String(this), {
      explanation: isDevelopment
        ? 'a date is not a point on the number line. compare with isBefore, isAfter or equals, or measure with until'
        : 0,
    });
  }

  [inspect]() {
    return `CalendarDate(${this.#plain})`;
  }
}

export const date = (input, second, third) => {
  const build = () => (input instanceof CalendarDate ? input : new CalendarDate(input, second, third));
  return isPlainObject(second) && second.loose ? loosely(build) : build();
};

export const today = (zone) => new CalendarDate(Temporal.Now.plainDateISO(zoneId(zone)));
export const tomorrow = (zone) => today(zone).plus({ days: 1 });
export const yesterday = (zone) => today(zone).minus({ days: 1 });

export const isCalendarDate = (value) => value instanceof CalendarDate;
