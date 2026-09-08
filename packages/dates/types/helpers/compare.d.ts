import type { CalendarDate } from '../calendar-date.js';
import type { DateTime } from '../date-time.js';
import type { Duration } from '../duration.js';
import type { DateRange, DateTimeRange, TimeRange } from '../range.js';
import type { Time } from '../time.js';

/** A datetime, a date or a time, or a string that reads as one */
export type Point = DateTime | CalendarDate | Time | Date | string;

/**
 * A sort comparator over points of one kind, durations, or ranges of one kind, which order by start then end. A raw value reads as the first's kind
 * @see https://next.semantic-ui.com/docs/api/dates/helpers#compare
 */
export function compare(a: Point | Duration | Range, b: Point | Duration | Range): -1 | 0 | 1;

export type Range = DateRange | DateTimeRange | TimeRange;

/** The point that comes first, from several arguments or one array */
export function earliest<T extends Point>(
  ...points: T[] | [T[]]
): T extends string ? DateTime | CalendarDate | Time : T;
/** The point that comes last, from several arguments or one array */
export function latest<T extends Point>(...points: T[] | [T[]]): T extends string ? DateTime | CalendarDate | Time : T;

/**
 * The kind of a value from this library, or undefined
 * @see https://next.semantic-ui.com/docs/api/dates/helpers#kindof
 */
export function kindOf(
  value: unknown,
): 'datetime' | 'date' | 'time' | 'duration' | 'dateRange' | 'datetimeRange' | 'timeRange' | undefined;
