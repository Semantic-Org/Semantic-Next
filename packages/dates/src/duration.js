import { isDevelopment } from '@semantic-ui/utils';

import { guard, refuse } from './helpers/errors.js';
import { addFields, fieldNames, fieldsFrom, fieldsOf, temporalDurationFrom } from './helpers/fields.js';
import { IS_DURATION } from './helpers/identity.js';
import { inspect, isTemporalDuration, unit } from './helpers/units.js';
import { locale as pickLocale } from './helpers/zones.js';

/*
  a length of time. fields stay as written (90 minutes is 90 minutes until you balance it), and a
  duration that came from until() or since() remembers where it started, so months and years total
*/

export class Duration {
  // brand duration
  get [IS_DURATION]() {
    return true;
  }
  static [Symbol.hasInstance](value) {
    return !!value?.[IS_DURATION];
  }

  #temporal;
  #anchor;

  constructor(input, name, anchor) {
    this.#temporal = isTemporalDuration(input) ? input : temporalDurationFrom(fieldsFrom(input, name));
    this.#anchor = anchor;
    Object.freeze(this);
  }

  /*******************************
              Reads
  *******************************/

  get years() {
    return this.#temporal.years;
  }
  get months() {
    return this.#temporal.months;
  }
  get weeks() {
    return this.#temporal.weeks;
  }
  get days() {
    return this.#temporal.days;
  }
  get hours() {
    return this.#temporal.hours;
  }
  get minutes() {
    return this.#temporal.minutes;
  }
  get seconds() {
    return this.#temporal.seconds;
  }
  get milliseconds() {
    return this.#temporal.milliseconds;
  }
  get microseconds() {
    return this.#temporal.microseconds;
  }
  get nanoseconds() {
    return this.#temporal.nanoseconds;
  }
  get sign() {
    return this.#temporal.sign;
  }
  get isZero() {
    return this.#temporal.blank;
  }
  get isNegative() {
    return this.#temporal.sign < 0;
  }
  get anchor() {
    return this.#anchor;
  }

  fields() {
    return fieldsOf(this.#temporal);
  }

  /*******************************
            Arithmetic
  *******************************/

  plus(other, name) {
    return new Duration(
      temporalDurationFrom(addFields(this.fields(), fieldsFrom(other, name), 1)),
      undefined,
      this.#anchor,
    );
  }

  minus(other, name) {
    return new Duration(
      temporalDurationFrom(addFields(this.fields(), fieldsFrom(other, name), -1)),
      undefined,
      this.#anchor,
    );
  }

  times(factor) {
    const fields = {};
    for (const [field, value] of Object.entries(this.fields())) {
      fields[field] = value * factor;
    }
    return new Duration(temporalDurationFrom(fields), undefined, this.#anchor);
  }

  negated() {
    return new Duration(this.#temporal.negated(), undefined, this.#anchor);
  }

  abs() {
    return new Duration(this.#temporal.abs(), undefined, this.#anchor);
  }

  // carries overflow upward: 90 minutes balances to an hour and a half. days are the ceiling until
  // the duration knows its calendar, then weeks, months and years open up
  balance(largest = 'day') {
    const target = unit(largest);
    if (!this.#anchor && (target === 'week' || target === 'month' || target === 'year')) {
      Duration.#requireAnchor(this, `balance to ${target}`);
    }
    return new Duration(
      guard(
        () => this.#fixed().round({ largestUnit: target, relativeTo: this.#anchor }),
        'cannotBalance',
        String(this),
      ),
      undefined,
      this.#anchor,
    );
  }

  round(smallest) {
    const target = unit(smallest);
    return new Duration(
      guard(() => this.#fixed().round({ smallestUnit: target, relativeTo: this.#anchor }), 'cannotRound', String(this)),
      undefined,
      this.#anchor,
    );
  }

  // Temporal treats a week as seven days only when told where it starts. in the ISO calendar that is
  // always true, so an unanchored duration folds weeks into days before it totals or balances
  #fixed() {
    if (this.#anchor || !this.#temporal.weeks) {
      return this.#temporal;
    }
    return temporalDurationFrom(addFields({ ...this.fields(), weeks: 0 }, { days: this.#temporal.weeks * 7 }, 1));
  }

  static #requireAnchor(duration, verb) {
    const fields = duration.fields();
    if (!duration.anchor && (fields.years || fields.months)) {
      refuse('needsAnchor', `${verb} of ${duration}`, {
        explanation: isDevelopment
          ? 'months and years have no fixed length. take the duration from a.until(b), which remembers a, or write it in days'
          : 0,
      });
    }
  }

  /*******************************
             Measure
  *******************************/

  // the whole duration in one unit, fractional. weeks, months and years need the anchor
  total(name) {
    const target = unit(name);
    if (this.#anchor) {
      return this.#temporal.total({ unit: target, relativeTo: this.#anchor });
    }
    Duration.#requireAnchor(this, `total in ${target}`);
    if (target === 'year' || target === 'month') {
      refuse('needsAnchor', `total in ${target}`, {
        explanation: isDevelopment
          ? 'a month has no fixed length. total a duration taken from a.until(b), which knows its calendar'
          : 0,
      });
    }
    const fixed = this.#fixed();
    return target === 'week' ? fixed.total('day') / 7 : fixed.total(target);
  }

  compare(other) {
    const rival = other instanceof Duration ? other : new Duration(other);
    const anchor = this.#anchor ?? rival.anchor;
    if (!anchor) {
      Duration.#requireAnchor(this, 'compare');
      Duration.#requireAnchor(rival, 'compare');
    }
    return Temporal.Duration.compare(this.#fixed(), rival.#fixed(), anchor ? { relativeTo: anchor } : undefined);
  }

  equals(other) {
    return this.compare(other) === 0;
  }

  /*******************************
              Output
  *******************************/

  // Intl.DurationFormat, and the sub-second fields only show when nothing larger is set, so a
  // wall-clock difference reads as hours and minutes and a timer reads as milliseconds
  format(style = 'long', locale) {
    const fields = this.fields();
    const large = fieldNames.slice(0, 7).some((field) => fields[field]);
    const shown = {};
    for (const field of fieldNames) {
      if (fields[field] && (!large || fieldNames.indexOf(field) < 7)) {
        shown[field] = fields[field];
      }
    }
    // Intl.DurationFormat prints nothing for a zero duration, so zero is spelled out as seconds
    if (this.isZero) {
      const unitDisplay = style === 'long' ? 'long' : style === 'narrow' ? 'narrow' : 'short';
      return style === 'digital'
        ? new Intl.DurationFormat(pickLocale(locale), { style, hoursDisplay: 'always' }).format({ hours: 0 })
        : new Intl.NumberFormat(pickLocale(locale), { style: 'unit', unit: 'second', unitDisplay }).format(0);
    }
    return new Intl.DurationFormat(pickLocale(locale), { style }).format(shown);
  }

  toString() {
    return this.#temporal.toString();
  }

  toJSON() {
    return this.#temporal.toString();
  }

  toTemporal() {
    return this.#temporal;
  }

  // milliseconds, so a duration drops into setTimeout and arithmetic. calendar units refuse unless anchored
  valueOf() {
    return this.total('millisecond');
  }

  [inspect]() {
    return `Duration(${this.#temporal})${this.#anchor ? ` from ${this.#anchor}` : ''}`;
  }
}

export const duration = (
  input,
  name,
) => (input instanceof Duration && name === undefined ? input : new Duration(input, name));

// a duration that remembers the point it was measured from, so months and years can total
export const anchored = (temporal, anchor) => new Duration(temporal, undefined, anchor);

export const isDuration = (value) => value instanceof Duration;

// a duration is a fields object, a phrase, or one of these: hours(2), days(3)
export const years = (count) => new Duration(count, 'year');
export const months = (count) => new Duration(count, 'month');
export const weeks = (count) => new Duration(count, 'week');
export const days = (count) => new Duration(count, 'day');
export const hours = (count) => new Duration(count, 'hour');
export const minutes = (count) => new Duration(count, 'minute');
export const seconds = (count) => new Duration(count, 'second');
export const milliseconds = (count) => new Duration(count, 'millisecond');
