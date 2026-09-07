import { isDate, isDevelopment, isNumber, isPlainObject, isString } from '@semantic-ui/utils';

import { CalendarDate, today } from './calendar-date.js';
import { anchored } from './duration.js';
import { guard, loosely, refuse, refuseType } from './helpers/errors.js';
import { temporalDurationFrom } from './helpers/fields.js';
import { formatIntl, formatTokens, intlOptions, relativeSeconds } from './helpers/format.js';
import { IS_DATE_TIME } from './helpers/identity.js';
import {
  inspect,
  isInstant,
  isPlainDate,
  isPlainDateTime,
  isZonedDateTime,
  quarterStart,
  singularKeys,
  stepOf,
  unit,
  weekdayNumber,
  zoneOptions,
} from './helpers/units.js';
import { weekStart, zoneId } from './helpers/zones.js';
import { DateTimeRange } from './range.js';
import { Time } from './time.js';

/*
  an exact moment with a zone to read it in. one type for timestamps, appointments and deadlines.
  an explicit zone wins, then a bracketed zone in the string, then the default. a Z or an offset in
  the string fixes the instant only, it never becomes the zone: the offset a database prints is a
  view, and arithmetic across a DST boundary needs the real zone
*/

const hasTime = /[T ]\d{1,2}(?::?\d{2})?/;
const hasOffset = /(?:[zZ]|[+-]\d{2}(?::?\d{2})?)$/;

export class DateTime {
  // brand datetime
  get [IS_DATE_TIME]() {
    return true;
  }
  static [Symbol.hasInstance](value) {
    return !!value?.[IS_DATE_TIME];
  }

  #zoned;

  constructor(input, options) {
    const settings = zoneOptions(options);
    this.#zoned = isZonedDateTime(input) && settings.zone === undefined ? input : DateTime.#read(input, settings);
    Object.freeze(this);
  }

  static #read(input, { zone, loose } = {}) {
    // the zone resolves first so a bad one throws even when the input turns out unreadable
    const timeZone = zoneId(zone);
    if (input === undefined || input === null) {
      return refuseType('notADateTime', String(input), {
        explanation: isDevelopment
          ? 'now() is the current moment. a missing value is refused so an absent field never silently becomes now'
          : 0,
      });
    }
    if (input instanceof DateTime) {
      return zone === undefined ? input.toTemporal() : input.toTemporal().withTimeZone(timeZone);
    }
    if (input instanceof CalendarDate) {
      return input.toTemporal().toZonedDateTime({ timeZone });
    }
    if (isDate(input) || isNumber(input)) {
      const epoch = isNumber(input) ? input : input.getTime();
      if (!Number.isFinite(epoch)) {
        refuse('notFinite', String(input), {
          explanation: isDevelopment ? 'an invalid Date or a non-finite number has no moment to point at' : 0,
        });
      }
      return Temporal.Instant.fromEpochMilliseconds(epoch).toZonedDateTimeISO(timeZone);
    }
    if (isString(input)) {
      return DateTime.#parse(input, zone, loose);
    }
    if (isZonedDateTime(input)) {
      return zone === undefined ? input : input.withTimeZone(timeZone);
    }
    if (isInstant(input)) {
      return input.toZonedDateTimeISO(timeZone);
    }
    if (isPlainDateTime(input)) {
      return input.toZonedDateTime(timeZone);
    }
    if (isPlainDate(input)) {
      return input.toZonedDateTime({ timeZone });
    }
    if (isPlainObject(input)) {
      return guard(
        () => Temporal.ZonedDateTime.from({ ...singularKeys(input), timeZone }),
        'unreadableDateTime',
        JSON.stringify(input),
      );
    }
    return refuseType('notADateTime', String(input), {
      explanation: isDevelopment
        ? 'a datetime is an ISO string, a Date, epoch milliseconds, a fields object, or a Temporal value'
        : 0,
    });
  }

  static #parse(text, zone, loose) {
    const trimmed = text.trim();
    try {
      return guard(
        () => {
          if (/\[[^\]]+\]$/.test(trimmed)) {
            const zoned = Temporal.ZonedDateTime.from(trimmed);
            return zone === undefined ? zoned : zoned.withTimeZone(zoneId(zone));
          }
          if (hasTime.test(trimmed)) {
            return hasOffset.test(trimmed)
              ? Temporal.Instant.from(trimmed).toZonedDateTimeISO(zoneId(zone))
              : Temporal.PlainDateTime.from(trimmed).toZonedDateTime(zoneId(zone));
          }
          return Temporal.PlainDate.from(trimmed).toZonedDateTime({ timeZone: zoneId(zone) });
        },
        'unreadableDateTime',
        text,
        isDevelopment
          ? "write ISO 8601: '2026-09-06T14:30:00Z', '2026-09-06T14:30' for a wall clock in the zone, or '2026-09-06'. { loose: true } reads what Date reads"
          : 0,
      );
    }
    catch (error) {
      if (!loose || error.code !== 'unreadableDateTime') {
        throw error;
      }
      // whatever this engine's Date reads, RFC 2822 and locale strings included, read the way Date reads
      // them, a locale string in the machine's zone
      const epoch = Date.parse(trimmed);
      if (Number.isNaN(epoch)) {
        throw error;
      }
      return Temporal.Instant.fromEpochMilliseconds(epoch).toZonedDateTimeISO(zoneId(zone));
    }
  }

  /*******************************
              Reads
  *******************************/

  get year() {
    return this.#zoned.year;
  }
  get month() {
    return this.#zoned.month;
  }
  get day() {
    return this.#zoned.day;
  }
  get weekday() {
    return this.#zoned.dayOfWeek;
  }
  get hour() {
    return this.#zoned.hour;
  }
  get minute() {
    return this.#zoned.minute;
  }
  get second() {
    return this.#zoned.second;
  }
  get millisecond() {
    return this.#zoned.millisecond;
  }
  get microsecond() {
    return this.#zoned.microsecond;
  }
  get nanosecond() {
    return this.#zoned.nanosecond;
  }
  get zone() {
    return this.#zoned.timeZoneId;
  }
  get offset() {
    return this.#zoned.offset;
  }
  get epoch() {
    return this.#zoned.epochMilliseconds;
  }
  get quarter() {
    return Math.ceil(this.#zoned.month / 3);
  }
  get dayOfYear() {
    return this.#zoned.dayOfYear;
  }
  get weekOfYear() {
    return this.#zoned.weekOfYear;
  }
  get daysInMonth() {
    return this.#zoned.daysInMonth;
  }
  get daysInYear() {
    return this.#zoned.daysInYear;
  }
  get hoursInDay() {
    return this.#zoned.hoursInDay;
  }
  get isLeapYear() {
    return this.#zoned.inLeapYear;
  }
  get isWeekend() {
    return this.#zoned.dayOfWeek >= 6;
  }
  get isWeekday() {
    return this.#zoned.dayOfWeek < 6;
  }
  get date() {
    return new CalendarDate(this.#zoned.toPlainDate());
  }
  get time() {
    return new Time(this.#zoned.toPlainTime());
  }

  /*******************************
            Arithmetic
  *******************************/

  plus(amount, name) {
    return new DateTime(
      guard(() => this.#zoned.add(temporalDurationFrom(amount, name)), 'cannotAdd', `${amount} ${name ?? ''}`),
    );
  }

  minus(amount, name) {
    return new DateTime(
      guard(
        () => this.#zoned.subtract(temporalDurationFrom(amount, name)),
        'cannotSubtract',
        `${amount} ${name ?? ''}`,
      ),
    );
  }

  set(fields, value) {
    const changes = isString(fields) ? { [unit(fields)]: value } : singularKeys(fields);
    return new DateTime(guard(() => this.#zoned.with(changes), 'cannotSet', JSON.stringify(changes)));
  }

  at(when) {
    return this.date.at(when, this.zone);
  }

  in(zone) {
    return new DateTime(this.#zoned.withTimeZone(zoneId(zone)));
  }

  startOf(name) {
    const target = unit(name);
    switch (target) {
      case 'year':
        return new DateTime(this.#zoned.with({ month: 1, day: 1 }).startOfDay());
      case 'quarter':
        return new DateTime(this.#zoned.with({ month: quarterStart(this.month), day: 1 }).startOfDay());
      case 'month':
        return new DateTime(this.#zoned.with({ day: 1 }).startOfDay());
      case 'week':
        return new DateTime(this.#zoned.subtract({ days: (this.weekday - weekStart() + 7) % 7 }).startOfDay());
      case 'day':
        return new DateTime(this.#zoned.startOfDay());
      default:
        return new DateTime(this.#zoned.round({ smallestUnit: target, roundingMode: 'floor' }));
    }
  }

  // the last millisecond, the precision of Date and of now(). for a query bound prefer range(unit)
  endOf(name) {
    return this.startOf(name).plus(stepOf(unit(name))).minus({ milliseconds: 1 });
  }

  round(increment, name) {
    return this.#round(increment, name, 'halfExpand');
  }

  floor(increment, name) {
    return this.#round(increment, name, 'floor');
  }

  ceil(increment, name) {
    return this.#round(increment, name, 'ceil');
  }

  #round(increment, name, mode) {
    const [count, target] = isString(increment) ? [1, increment] : [increment, name];
    return new DateTime(
      guard(
        () => this.#zoned.round({ smallestUnit: unit(target), roundingIncrement: count, roundingMode: mode }),
        'cannotRound',
        `${count} ${target}`,
      ),
    );
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

  // exact time only, so another DateTime compares as it is and never re-zones
  #compare(other) {
    const rival = other instanceof DateTime ? other : new DateTime(other, this.zone);
    return Temporal.ZonedDateTime.compare(this.#zoned, rival.toTemporal());
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
    return this.startOf(name).equals(new DateTime(other, this.zone).startOf(name));
  }

  isPast() {
    return this.isBefore(now(this.zone));
  }

  isFuture() {
    return this.isAfter(now(this.zone));
  }

  isToday() {
    return this.date.equals(today(this.zone));
  }

  isTomorrow() {
    return this.date.equals(today(this.zone).plus({ days: 1 }));
  }

  isYesterday() {
    return this.date.equals(today(this.zone).minus({ days: 1 }));
  }

  /*******************************
             Measure
  *******************************/

  // a duration balanced from years down, remembering this moment so it can total in any unit.
  // with a unit, the total as a number
  until(other, name) {
    const end = new DateTime(other, this.zone);
    const span = anchored(this.#zoned.until(end.toTemporal(), { largestUnit: 'year' }), this.#zoned);
    return name === undefined ? span : span.total(name);
  }

  since(other, name) {
    return new DateTime(other, this.zone).until(this, name);
  }

  to(end) {
    return new DateTimeRange(this, end);
  }

  range(name) {
    const start = this.startOf(name);
    return new DateTimeRange(start, start.plus(stepOf(unit(name))));
  }

  /*******************************
              Output
  *******************************/

  format(spec, locale) {
    const options = intlOptions('datetime', spec);
    return options
      ? formatIntl('datetime', this.epoch, options, locale, this.zone)
      : formatTokens(this.#parts(), spec, locale);
  }

  #parts() {
    return {
      kind: 'datetime',
      year: this.year,
      month: this.month,
      day: this.day,
      weekday: this.weekday,
      hour: this.hour,
      minute: this.minute,
      second: this.second,
      millisecond: this.millisecond,
      offset: this.offset,
      zone: this.zone,
      epoch: this.epoch,
      weekOfYear: this.weekOfYear,
    };
  }

  relative(to, locale) {
    const reference = to === undefined ? now(this.zone) : new DateTime(to, this.zone);
    return relativeSeconds((this.epoch - reference.epoch) / 1000, locale);
  }

  // the instant in UTC, the form every database and API reads. the zone is a view and does not travel
  toString() {
    const nanos = this.#zoned.epochNanoseconds % 1_000_000n;
    const digits = nanos === 0n ? 3 : nanos % 1000n === 0n ? 6 : 9;
    return this.#zoned.toInstant().toString({ fractionalSecondDigits: digits });
  }

  toJSON() {
    return this.toString();
  }

  toJSDate() {
    return new Date(this.epoch);
  }

  toTemporal() {
    return this.#zoned;
  }

  valueOf() {
    return this.epoch;
  }

  [inspect]() {
    return `DateTime(${this.#zoned})`;
  }
}

// with { loose: true } an unreadable input is null, never a throw
export const datetime = (input, options) => {
  const settings = zoneOptions(options);
  const build =
    () => (input instanceof DateTime && settings.zone === undefined ? input : new DateTime(input, settings));
  return settings.loose ? loosely(build) : build();
};

// millisecond precision, the precision of Date, so a value survives a JSON round trip unchanged
export const now = (zone) =>
  new DateTime(Temporal.Instant.fromEpochMilliseconds(Date.now()).toZonedDateTimeISO(zoneId(zone)));

export const isDateTime = (value) => value instanceof DateTime;
