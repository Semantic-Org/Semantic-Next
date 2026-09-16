/**
 * The value protocol, what a schema reads off a class to store, compare and order its values.
 * This subpath attaches it to the seven classes and re-exports them. The bare entry has none of it
 * @see https://next.semantic-ui.com/docs/api/dates/schema
 */

import type { CalendarDate } from './calendar-date.js';
import type { DateTime } from './date-time.js';
import type { Duration } from './duration.js';
import type { DateRange, DateTimeRange, TimeRange } from './range.js';
import type { Time } from './time.js';

/**
 * `Symbol.for('semantic-ui/value')`, the key of the protocol on each class
 * @see https://next.semantic-ui.com/docs/api/dates/schema#value
 */
export const VALUE: unique symbol;

/**
 * What one class declares
 * @see https://next.semantic-ui.com/docs/api/dates/schema#the-protocol
 */
export interface ValueProtocol<Value, Key extends number | bigint | string> {
  /** The kind's lowercase word, `kindOf` spells the same one */
  readonly kind: 'datetime' | 'date' | 'time' | 'duration' | 'dateRange' | 'datetimeRange' | 'timeRange';
  /** Reads a written value, throwing this library's own refusal for what it cannot read */
  parse(input: unknown): Value;
  /** Reads the wire form back, `toJSON()`'s own text, throwing for anything else */
  decode(input: unknown): Value;
  /** A primitive that is equal exactly when `equals()` holds, and orders as the kind orders when `ordered` */
  key(value: Value): Key;
  /** Whether the kind orders, so a range and a sort make sense on it */
  readonly ordered: boolean;
  /** The seven classes, so a schema that names one registers them all */
  readonly family: readonly Function[];
  /** `Duration` alone declares it. `toJSON()` after the refusal a length counting months or years earns, `calendarDuration` */
  encode?(value: Value): string;
  /** `Duration` alone declares it. A length adds, so a sum over a column of them totals the key's milliseconds */
  readonly summable?: boolean;
  /**
   * `DateTime` alone declares it. A calendar day reads as that whole day in the configured zone, a
   * half-open pair. Undefined for any other operand, `noZone` with no zone configured
   */
  span?(operand: unknown): [DateTime, DateTime] | undefined;
}

export interface Declared<Value, Key extends number | bigint | string> {
  readonly [VALUE]: ValueProtocol<Value, Key>;
}

/** The classes with their protocol attached, the same objects the bare entry exports */
export const DateTime: typeof import('./date-time.js').DateTime & Declared<DateTime | Date, bigint>;
export const CalendarDate: typeof import('./calendar-date.js').CalendarDate & Declared<CalendarDate, number>;
export const Time: typeof import('./time.js').Time & Declared<Time, number>;
export const Duration: typeof import('./duration.js').Duration & Declared<Duration, number>;
export const DateRange: typeof import('./range.js').DateRange & Declared<DateRange, string>;
export const DateTimeRange: typeof import('./range.js').DateTimeRange & Declared<DateTimeRange, string>;
export const TimeRange: typeof import('./range.js').TimeRange & Declared<TimeRange, string>;

export type {
  CalendarDate as CalendarDateValue,
  DateTime as DateTimeValue,
  Duration as DurationValue,
  Time as TimeValue,
};
