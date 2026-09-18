/**
 * The subpath registers the seven kinds with `@semantic-ui/schema` as it loads and upgrades the
 * built-in `datetime` to `DateTime` under the same name. The bare entry has none of it
 * @see https://next.semantic-ui.com/docs/api/dates/schema
 */

import type { Type } from '@semantic-ui/schema';

import type { CalendarDate } from './calendar-date.js';
import type { DateTime } from './date-time.js';
import type { Duration } from './duration.js';
import type { Time } from './time.js';

/** The registered Types, one per kind, `DateTimeType` the upgraded built-in `datetime` */
export const DateTimeType: Type;
export const CalendarDateType: Type;
export const TimeType: Type;
export const DurationType: Type;
export const DateRangeType: Type;
export const DateTimeRangeType: Type;
export const TimeRangeType: Type;

/** The classes, the same objects the bare entry exports */
export const DateTime: typeof import('./date-time.js').DateTime;
export const CalendarDate: typeof import('./calendar-date.js').CalendarDate;
export const Time: typeof import('./time.js').Time;
export const Duration: typeof import('./duration.js').Duration;
export const DateRange: typeof import('./range.js').DateRange;
export const DateTimeRange: typeof import('./range.js').DateTimeRange;
export const TimeRange: typeof import('./range.js').TimeRange;

export type {
  CalendarDate as CalendarDateValue,
  DateTime as DateTimeValue,
  Duration as DurationValue,
  Time as TimeValue,
};
