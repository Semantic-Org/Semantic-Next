import type { CalendarDate } from './calendar-date.js';
import type { DateTime } from './date-time.js';
import type { Duration } from './duration.js';
import type {
  CalendarDateInput,
  DateTimeInput,
  DurationInput,
  FormatSpec,
  Locale,
  TimeInput,
  Unit,
  Zone,
} from './inputs.js';
import type { Time } from './time.js';

/** The shared body of the three ranges. A date range runs through its end, the others until it */
declare abstract class Range<Point, Input> {
  readonly start: Point;
  readonly end: Point;
  readonly kind: 'date' | 'datetime' | 'time';
  readonly isEmpty: boolean;
  /** The whole length, anchored at the start. A date range counts its last day */
  readonly duration: Duration;

  /** A point inside, or a range wholly inside */
  contains(value: Input | this): boolean;
  overlaps(other: this | string): boolean;
  /** The shared part, or null when they do not meet */
  intersect(other: this | string): this | null;
  equals(other: this | string): boolean;
  /** Every point from the start, stepping by a unit or a duration, as far as the range reaches */
  each(step: Unit | DurationInput): Point[];
  /** Consecutive sub-ranges of the step, the last one cut to the end */
  split(step: Unit | DurationInput): this[];
  /** Intl's range formatting, `'Sep 1 – 7, 2026'` */
  format(spec?: FormatSpec, locale?: Locale): string;
  /** ISO 8601 interval notation, `start/end` */
  toString(): string;
  toJSON(): string;
  /** Throws. A range is not a number */
  valueOf(): never;
}

/** Two calendar dates, both included: the 1st through the 7th is seven days */
export class DateRange extends Range<CalendarDate, CalendarDateInput> {
  constructor(start: CalendarDateInput, end: CalendarDateInput | DurationInput);
  constructor(interval: string);
  /** The datetime range covering these days in a zone, midnight through the midnight after the last day */
  in(zone?: Zone): DateTimeRange;
}

/** Two moments, the end excluded: nine until ten and ten until eleven do not overlap */
export class DateTimeRange extends Range<DateTime, DateTimeInput> {
  constructor(start: DateTimeInput, end: DateTimeInput | DurationInput);
  constructor(interval: string);
  /** Both ends read in another zone */
  in(zone?: Zone): DateTimeRange;
}

/** Two times of day, the end excluded: the door closes at the stroke of five */
export class TimeRange extends Range<Time, TimeInput> {
  constructor(start: TimeInput, end: TimeInput | DurationInput);
  constructor(interval: string);
}

export function dateRange(start: CalendarDateInput, end: CalendarDateInput | DurationInput): DateRange;
export function dateRange(interval: string): DateRange;
export function datetimeRange(start: DateTimeInput, end: DateTimeInput | DurationInput): DateTimeRange;
export function datetimeRange(interval: string): DateTimeRange;
export function timeRange(start: TimeInput, end: TimeInput | DurationInput): TimeRange;
export function timeRange(interval: string): TimeRange;

export function isDateRange(value: unknown): value is DateRange;
export function isDateTimeRange(value: unknown): value is DateTimeRange;
export function isTimeRange(value: unknown): value is TimeRange;
