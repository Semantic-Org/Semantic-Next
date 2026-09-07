import { isDate, isDevelopment, isNumber, isPlainObject, isString } from '@semantic-ui/utils';

import { CalendarDate } from './calendar-date.js';
import { DateTime } from './date-time.js';
import { anchored } from './duration.js';
import { guard, loosely, refuse, refuseType } from './helpers/errors.js';
import { temporalDurationOf } from './helpers/fields.js';
import { formatIntl, formatTokens, intlOptions } from './helpers/format.js';
import { IS_TIME } from './helpers/identity.js';
import { inspect, isPlainDateTime, isPlainTime, isZonedDateTime, singularKeys, unit } from './helpers/units.js';
import { zoneId } from './helpers/zones.js';
import { TimeRange } from './range.js';

// a time of day with no date: opening hours, a daily reminder, a shift start. it wraps at midnight

const clock = /^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?\s*([ap]\.?m\.?)?$/i;

export class Time {
  // brand time
  get [IS_TIME]() {
    return true;
  }
  static [Symbol.hasInstance](value) {
    return !!value?.[IS_TIME];
  }

  #plain;

  // time(9, 30), or time(input, { zone, loose })
  constructor(input, second, third) {
    const settings = isPlainObject(second) ? second : {};
    this.#plain = isPlainTime(input)
      ? input
      : Time.#read(input, isPlainObject(second) ? undefined : second, third, settings);
    Object.freeze(this);
  }

  static #read(input, minute, second, settings) {
    if (settings.zone !== undefined) {
      zoneId(settings.zone);
    }
    if (input === undefined || input === null) {
      return refuseType('notATime', String(input), {
        explanation: isDevelopment
          ? 'now().time is the current clock. a missing value is refused so an absent field never silently becomes now'
          : 0,
      });
    }
    if (isNumber(input)) {
      return guard(
        () =>
          Temporal.PlainTime.from({ hour: input, minute: minute ?? 0, second: second ?? 0 }, { overflow: 'reject' }),
        'unreadableTime',
        `${input}:${minute ?? 0}`,
      );
    }
    if (input instanceof Time) {
      return input.toTemporal();
    }
    if (input instanceof DateTime) {
      return input.toTemporal().toPlainTime();
    }
    if (isDate(input)) {
      return new DateTime(input, settings).toTemporal().toPlainTime();
    }
    if (isString(input)) {
      try {
        return Time.#parse(input);
      }
      catch (error) {
        if (!settings.loose || error.code !== 'unreadableTime') {
          throw error;
        }
        return new DateTime(input, settings).toTemporal().toPlainTime();
      }
    }
    if (isZonedDateTime(input) || isPlainDateTime(input)) {
      return input.toPlainTime();
    }
    if (isPlainObject(input)) {
      return guard(
        () => Temporal.PlainTime.from(singularKeys(input), { overflow: 'reject' }),
        'unreadableTime',
        JSON.stringify(input),
      );
    }
    return refuseType('notATime', String(input), {
      explanation: isDevelopment
        ? "a time is a clock string like '09:00' or '5pm', numbers, a fields object, a datetime, or a Temporal value"
        : 0,
    });
  }

  // '9am', '5:30 pm', '09:00', '17:30:15'. anything else goes to Temporal's ISO reader
  static #parse(text) {
    const match = clock.exec(text.trim());
    if (match) {
      const [, hourText, minute = '0', second = '0', meridiem] = match;
      let hour = Number(hourText);
      if (meridiem) {
        const afternoon = meridiem[0].toLowerCase() === 'p';
        if (hour < 1 || hour > 12) {
          refuse('unreadableTime', text, {
            explanation: isDevelopment ? 'clock hours with am or pm run 1 through 12' : 0,
          });
        }
        hour = (hour % 12) + (afternoon ? 12 : 0);
      }
      return guard(
        () => Temporal.PlainTime.from({ hour, minute: Number(minute), second: Number(second) }, { overflow: 'reject' }),
        'unreadableTime',
        text,
      );
    }
    return guard(
      () => Temporal.PlainTime.from(text.trim()),
      'unreadableTime',
      text,
      isDevelopment
        ? "write a clock time: '09:00', '5:30pm', '17:30:15.250'. { loose: true } reads a datetime the way Date reads it and keeps the clock"
        : undefined,
    );
  }

  /*******************************
              Reads
  *******************************/

  get hour() {
    return this.#plain.hour;
  }
  get minute() {
    return this.#plain.minute;
  }
  get second() {
    return this.#plain.second;
  }
  get millisecond() {
    return this.#plain.millisecond;
  }
  get microsecond() {
    return this.#plain.microsecond;
  }
  get nanosecond() {
    return this.#plain.nanosecond;
  }

  /*******************************
            Arithmetic
  *******************************/

  // arithmetic wraps like a clock face: 23:00 plus two hours is 01:00
  plus(amount, name) {
    return new Time(
      guard(() => this.#plain.add(temporalDurationOf(amount, name)), 'cannotAdd', `${amount} ${name ?? ''}`),
    );
  }

  minus(amount, name) {
    return new Time(
      guard(() => this.#plain.subtract(temporalDurationOf(amount, name)), 'cannotSubtract', `${amount} ${name ?? ''}`),
    );
  }

  set(fields, value) {
    const changes = isString(fields) ? { [unit(fields)]: value } : singularKeys(fields);
    return new Time(guard(() => this.#plain.with(changes), 'cannotSet', JSON.stringify(changes)));
  }

  startOf(name) {
    return new Time(
      guard(() => this.#plain.round({ smallestUnit: unit(name), roundingMode: 'floor' }), 'cannotRound', String(name)),
    );
  }

  endOf(name) {
    return this.startOf(name).plus({ [`${unit(name)}s`]: 1 }).minus({ milliseconds: 1 });
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
    return new Time(
      guard(
        () => this.#plain.round({ smallestUnit: unit(target), roundingIncrement: count, roundingMode: mode }),
        'cannotRound',
        `${count} ${target}`,
      ),
    );
  }

  /*******************************
            Comparison
  *******************************/

  equals(other) {
    return this.#compare(other) === 0;
  }

  #compare(other) {
    return Temporal.PlainTime.compare(this.#plain, new Time(other).toTemporal());
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
    return this.startOf(name).equals(new Time(other).startOf(name));
  }

  /*******************************
             Measure
  *******************************/

  // within the day, signed: 22:00 until 02:00 is minus twenty hours, not four
  until(other, name) {
    const span = anchored(this.#plain.until(new Time(other).toTemporal(), { largestUnit: 'hour' }), undefined);
    return name === undefined ? span : span.total(name);
  }

  since(other, name) {
    return new Time(other).until(this, name);
  }

  // this time on a date in a zone. the mirror of date.at(time, zone)
  on(day, zone) {
    return new CalendarDate(day).at(this, zone);
  }

  to(end) {
    return new TimeRange(this, end);
  }

  /*******************************
              Output
  *******************************/

  format(spec, locale) {
    const options = intlOptions('time', spec);
    return options ? formatIntl('time', this.#plain, options, locale) : formatTokens(this.#parts(), spec, locale);
  }

  #parts() {
    return {
      kind: 'time',
      hour: this.hour,
      minute: this.minute,
      second: this.second,
      millisecond: this.millisecond,
    };
  }

  toString() {
    return this.#plain.toString();
  }

  toJSON() {
    return this.#plain.toString();
  }

  toTemporal() {
    return this.#plain;
  }

  valueOf() {
    return refuse('notANumber', String(this), {
      explanation: isDevelopment
        ? 'a time of day is not a point on the number line. compare with isBefore, isAfter or equals, or measure with until'
        : 0,
    });
  }

  [inspect]() {
    return `Time(${this.#plain})`;
  }
}

export const time = (input, second, third) => {
  const build = () => (input instanceof Time ? input : new Time(input, second, third));
  return isPlainObject(second) && second.loose ? loosely(build) : build();
};

export const isTime = (value) => value instanceof Time;
