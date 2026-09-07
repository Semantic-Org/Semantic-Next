import type { CalendarDate } from '../calendar-date.js';
import type { DateTime } from '../date-time.js';
import type { Duration } from '../duration.js';
import type { Time } from '../time.js';

/** A datetime, a date or a time, or a string that reads as one */
export type Point = DateTime | CalendarDate | Time | Date | string;

/** A sort comparator over points of one kind, or durations. A raw value reads as the first's kind */
export function compare(a: Point | Duration, b: Point | Duration): -1 | 0 | 1;

/** The point that comes first, from several arguments or one array */
export function earliest<T extends Point>(
  ...points: T[] | [T[]]
): T extends string ? DateTime | CalendarDate | Time : T;
/** The point that comes last, from several arguments or one array */
export function latest<T extends Point>(...points: T[] | [T[]]): T extends string ? DateTime | CalendarDate | Time : T;

/** The kind of a value from this library, or undefined */
export function kindOf(
  value: unknown,
): 'datetime' | 'date' | 'time' | 'duration' | 'dateRange' | 'datetimeRange' | 'timeRange' | undefined;
