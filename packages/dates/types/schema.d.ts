/**
 * The seven classes with a schema Type each, carried under the value symbol. The bare entry has
 * none of it, and `@semantic-ui/schema` is the consumer: naming one class in a schema registers
 * the seven
 * @see https://next.semantic-ui.com/docs/api/dates/schema
 */

import type { Type } from '@semantic-ui/schema';

import type { CalendarDate } from './calendar-date.js';
import type { DateTime } from './date-time.js';
import type { Duration } from './duration.js';
import type { DateRange, DateTimeRange, TimeRange } from './range.js';
import type { Time } from './time.js';

/**
 * `Symbol.for('semantic-ui/value')`, the key each class carries its Type under
 * @see https://next.semantic-ui.com/docs/api/dates/schema#value
 */
export const VALUE: unique symbol;

/** A class carrying its Type, built with `defineType` from `@semantic-ui/schema` */
export interface Declared {
  readonly [VALUE]: Type;
}

/** The classes with their Types attached, the same objects the bare entry exports */
export const DateTime: typeof import('./date-time.js').DateTime & Declared;
export const CalendarDate: typeof import('./calendar-date.js').CalendarDate & Declared;
export const Time: typeof import('./time.js').Time & Declared;
export const Duration: typeof import('./duration.js').Duration & Declared;
export const DateRange: typeof import('./range.js').DateRange & Declared;
export const DateTimeRange: typeof import('./range.js').DateTimeRange & Declared;
export const TimeRange: typeof import('./range.js').TimeRange & Declared;

export type {
  CalendarDate as CalendarDateValue,
  DateTime as DateTimeValue,
  Duration as DurationValue,
  Time as TimeValue,
};
