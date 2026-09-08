import type { CalendarDate } from './calendar-date.js';
import type { DateTime } from './date-time.js';
import type { Duration } from './duration.js';
import type {
  CalendarDateInput,
  DateTimeInput,
  DurationInput,
  FormatSpec,
  Locale,
  ReadOptions,
  TimeInput,
  Unit,
  Zone,
} from './inputs.js';
import type { Time } from './time.js';

/**
 * The shared body of the three ranges. A date range runs through its end, the others until it
 * @see {@link https://next.semantic-ui.com/docs/api/dates/ranges Range}
 */
declare abstract class Range<Point, Input> {
  readonly start: Point;
  readonly end: Point;
  readonly kind: 'date' | 'datetime' | 'time';
  /** @see https://next.semantic-ui.com/docs/api/dates/ranges#isempty */
  isEmpty(): boolean;
  /** The whole length, anchored at the start. A date range counts its last day */
  readonly duration: Duration;

  /**
   * A point inside, or a range wholly inside
   * @see https://next.semantic-ui.com/docs/api/dates/ranges#contains
   */
  contains(value: Input | this): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/ranges#overlaps */
  overlaps(other: this | string): boolean;
  /**
   * The shared part, or null when they do not meet
   * @see https://next.semantic-ui.com/docs/api/dates/ranges#intersection
   */
  intersection(other: this | string): this | null;
  /** @see https://next.semantic-ui.com/docs/api/dates/ranges#equals */
  equals(other: this | string): boolean;
  /**
   * Every point from the start, stepping by a unit or a duration, as far as the range reaches
   * @see https://next.semantic-ui.com/docs/api/dates/ranges#points
   */
  points(step: Unit | DurationInput): Point[];
  /**
   * Consecutive sub-ranges of the step, the last one cut to the end: a day in hour slots, a year in months
   * @see https://next.semantic-ui.com/docs/api/dates/ranges#split
   */
  split(step: Unit | DurationInput): this[];
  /**
   * Intl's range formatting, `'Sep 1 – 7, 2026'`
   * @see https://next.semantic-ui.com/docs/api/dates/ranges#format
   */
  format(spec?: FormatSpec, locale?: Locale): string;
  /**
   * ISO 8601 interval notation, `start/end`, and the kind's factory reads it back
   * @see https://next.semantic-ui.com/docs/api/dates/ranges#tostring
   */
  toString(): string;
  /** @see https://next.semantic-ui.com/docs/api/dates/ranges#tojson */
  toJSON(): string;
  /**
   * Throws. A range is not a number
   * @see https://next.semantic-ui.com/docs/api/dates/ranges#valueof
   */
  valueOf(): never;
}

/**
 * Two calendar dates, both included: the 1st through the 7th is seven days
 * @see {@link https://next.semantic-ui.com/docs/api/dates/ranges DateRange}
 */
export class DateRange extends Range<CalendarDate, CalendarDateInput> {
  constructor(start: CalendarDateInput, end: CalendarDateInput | DurationInput, options?: Zone | ReadOptions);
  constructor(interval: string, options?: Zone | ReadOptions);
  /**
   * The datetime range covering these days in a zone, midnight through the midnight after the last day
   * @see https://next.semantic-ui.com/docs/api/dates/ranges#in
   */
  in(zone?: Zone): DateTimeRange;
}

/**
 * Two moments, the end excluded: nine until ten and ten until eleven do not overlap
 * @see {@link https://next.semantic-ui.com/docs/api/dates/ranges DateTimeRange}
 */
export class DateTimeRange extends Range<DateTime, DateTimeInput> {
  constructor(start: DateTimeInput, end: DateTimeInput | DurationInput, options?: Zone | ReadOptions);
  constructor(interval: string, options?: Zone | ReadOptions);
  /**
   * Both ends read in another zone
   * @see https://next.semantic-ui.com/docs/api/dates/ranges#in
   */
  in(zone?: Zone): DateTimeRange;
}

/**
 * Two times of day, the end excluded: the door closes at the stroke of five
 * @see {@link https://next.semantic-ui.com/docs/api/dates/ranges TimeRange}
 */
export class TimeRange extends Range<Time, TimeInput> {
  constructor(start: TimeInput, end: TimeInput | DurationInput, options?: Zone | ReadOptions);
  constructor(interval: string, options?: Zone | ReadOptions);
}

/** @see https://next.semantic-ui.com/docs/api/dates/ranges#daterange */
export function dateRange(
  start: CalendarDateInput,
  end: CalendarDateInput | DurationInput,
  options?: ReadOptions,
): DateRange;
export function dateRange(interval: string, options?: Zone | ReadOptions): DateRange;
/** With `loose`, null when either end cannot be read */
export function dateRange(start: unknown, end: unknown, options: ReadOptions & { loose: true; }): DateRange | null;
/** @see https://next.semantic-ui.com/docs/api/dates/ranges#datetimerange */
export function datetimeRange(
  start: DateTimeInput,
  end: DateTimeInput | DurationInput,
  options?: ReadOptions,
): DateTimeRange;
export function datetimeRange(interval: string, options?: Zone | ReadOptions): DateTimeRange;
export function datetimeRange(
  start: unknown,
  end: unknown,
  options: ReadOptions & { loose: true; },
): DateTimeRange | null;
/** @see https://next.semantic-ui.com/docs/api/dates/ranges#timerange */
export function timeRange(start: TimeInput, end: TimeInput | DurationInput, options?: Zone | ReadOptions): TimeRange;
export function timeRange(interval: string, options?: Zone | ReadOptions): TimeRange;
export function timeRange(start: unknown, end: unknown, options: ReadOptions & { loose: true; }): TimeRange | null;

/** @see https://next.semantic-ui.com/docs/api/dates/helpers#isdaterange */
export function isDateRange(value: unknown): value is DateRange;
/** @see https://next.semantic-ui.com/docs/api/dates/helpers#isdatetimerange */
export function isDateTimeRange(value: unknown): value is DateTimeRange;
/** @see https://next.semantic-ui.com/docs/api/dates/helpers#istimerange */
export function isTimeRange(value: unknown): value is TimeRange;
