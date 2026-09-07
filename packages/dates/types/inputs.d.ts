/**
 * The input shapes every factory and method reads
 */

import type { CalendarDate } from './calendar-date.js';
import type { DateTime } from './date-time.js';
import type { Duration } from './duration.js';
import type { Time } from './time.js';

/**
 * A Temporal value. Temporal's own declarations ship with newer TypeScript libs and with the polyfills,
 * so the values this library hands back from `toTemporal()` are typed loosely until they are everywhere
 */
export type TemporalValue = any;

/** A unit name, singular or plural, or an abbreviation like `h`, `min`, `d`, `mo` */
export type Unit =
  | 'year'
  | 'years'
  | 'quarter'
  | 'quarters'
  | 'month'
  | 'months'
  | 'week'
  | 'weeks'
  | 'day'
  | 'days'
  | 'hour'
  | 'hours'
  | 'minute'
  | 'minutes'
  | 'second'
  | 'seconds'
  | 'millisecond'
  | 'milliseconds'
  | 'microsecond'
  | 'microseconds'
  | 'nanosecond'
  | 'nanoseconds'
  | (string & {});

/** A unit a calendar date can start, end or step by */
export type DateUnit = 'year' | 'quarter' | 'month' | 'week' | 'day' | (string & {});

/** A weekday by name (`'monday'`, `'Fri'`) or ISO number, 1 for monday through 7 for sunday */
export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | (string & {});

/**
 * A zone in any spelling: an IANA name (`'America/New_York'`), a city (`'Berlin'`, `'los angeles'`), an
 * abbreviation (`'PT'`, `'CET'`), a fixed offset (`'+05:30'`), `'UTC'`, or a name set with
 * `configure({ zoneAliases })`
 */
export type Zone = string;

/** The options form of a factory's second argument */
export interface ReadOptions {
  /** The zone to read the value in (default: the configured zone, else the machine's) */
  zone?: Zone;
  /** Read whatever this engine's `Date` reads, and return null instead of throwing for what even `Date` cannot read */
  loose?: boolean;
  /** Read a numeric date like `07.09.2026` day first, as most of the world writes it (default: the configured `dayFirst`, else month first, the engine's order) */
  dayFirst?: boolean;
}

/** Duration fields, plural, as Temporal spells them */
export interface DurationFields {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
  microseconds?: number;
  nanoseconds?: number;
}

/**
 * Anything that reads as a duration: a `Duration`, a Temporal.Duration, a fields object, a phrase like
 * `'1h 30m'` or `'2 weeks and 3 days'`, an ISO string like `'PT1H30M'`, or a number of milliseconds
 */
export type DurationInput = Duration | DurationFields | string | number | TemporalValue;

/** Calendar fields for a datetime or date, singular, as Temporal's `with()` spells them */
export interface DateTimeFields {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
  microsecond?: number;
  nanosecond?: number;
}

/**
 * Anything that reads as a datetime: an ISO string, a `Date`, epoch milliseconds, a fields object, a
 * `DateTime`, a `CalendarDate` (its midnight in the zone), or a Temporal value
 */
export type DateTimeInput = DateTime | CalendarDate | Date | number | string | DateTimeFields | TemporalValue;

/** Anything that reads as a calendar date: `'2026-09-06'`, a fields object, a `DateTime`, a `Date`, or a Temporal value */
export type CalendarDateInput = CalendarDate | DateTime | Date | string | DateTimeFields | TemporalValue;

/** Anything that reads as a time of day: `'09:00'`, `'5:30pm'`, a fields object, a `DateTime`, a `Date`, or a Temporal value */
export type TimeInput = Time | DateTime | Date | string | DateTimeFields | TemporalValue;

/**
 * How to format: a preset (`'short'`, `'medium'`, `'long'`, `'full'`, and for a datetime `'date'` or
 * `'time'`), an `Intl.DateTimeFormat` options bag, or a day.js token pattern like `'YYYY-MM-DD h:mm a'`
 */
export type FormatSpec =
  | 'short'
  | 'medium'
  | 'long'
  | 'full'
  | 'date'
  | 'time'
  | Intl.DateTimeFormatOptions
  | (string & {});

/** A BCP 47 locale tag, overriding the configured locale for one call */
export type Locale = string;
