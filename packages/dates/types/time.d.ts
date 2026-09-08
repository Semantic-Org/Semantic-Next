import type { CalendarDate } from './calendar-date.js';
import type { DateTime } from './date-time.js';
import type { Duration } from './duration.js';
import type {
  CalendarDateInput,
  DurationInput,
  FormatSpec,
  Locale,
  ReadOptions,
  TemporalValue,
  TimeInput,
  Unit,
  Zone,
} from './inputs.js';
import type { TimeRange } from './range.js';

/**
 * A time of day with no date: opening hours, a daily reminder. Arithmetic wraps at midnight.
 * @see {@link https://next.semantic-ui.com/docs/api/dates/time Time}
 */
export class Time {
  constructor(input: TimeInput, options?: ReadOptions);
  constructor(hour: number, minute?: number, second?: number);

  readonly hour: number;
  readonly minute: number;
  readonly second: number;
  readonly millisecond: number;
  readonly microsecond: number;
  readonly nanosecond: number;

  /** @see https://next.semantic-ui.com/docs/api/dates/time#plus */
  plus(amount: DurationInput, unit?: Unit): Time;
  /** @see https://next.semantic-ui.com/docs/api/dates/time#minus */
  minus(amount: DurationInput, unit?: Unit): Time;
  /** @see https://next.semantic-ui.com/docs/api/dates/time#set */
  set(fields: Partial<Record<'hour' | 'minute' | 'second' | 'millisecond', number>>): Time;
  set(unit: Unit, value: number): Time;
  /** @see https://next.semantic-ui.com/docs/api/dates/time#startof */
  startOf(unit: Unit): Time;
  /** @see https://next.semantic-ui.com/docs/api/dates/time#endof */
  endOf(unit: Unit): Time;
  /** @see https://next.semantic-ui.com/docs/api/dates/time#round */
  round(unit: Unit): Time;
  round(increment: number, unit: Unit): Time;
  /** @see https://next.semantic-ui.com/docs/api/dates/time#floor */
  floor(unit: Unit): Time;
  floor(increment: number, unit: Unit): Time;
  /** @see https://next.semantic-ui.com/docs/api/dates/time#ceil */
  ceil(unit: Unit): Time;
  ceil(increment: number, unit: Unit): Time;

  /** @see https://next.semantic-ui.com/docs/api/dates/time#equals */
  equals(other: TimeInput): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/time#isbefore */
  isBefore(other: TimeInput): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/time#isafter */
  isAfter(other: TimeInput): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/time#issame */
  isSame(other: TimeInput, unit?: Unit): boolean;

  /**
   * The signed length until another time within the day, or that length as a number in a unit
   * @see https://next.semantic-ui.com/docs/api/dates/time#until
   */
  until(other: TimeInput): Duration;
  until(other: TimeInput, unit: Unit): number;
  /** @see https://next.semantic-ui.com/docs/api/dates/time#since */
  since(other: TimeInput): Duration;
  since(other: TimeInput, unit: Unit): number;
  /**
   * This time on a date in a zone, the mirror of `date.at(time, zone)`
   * @see https://next.semantic-ui.com/docs/api/dates/time#on
   */
  on(day: CalendarDateInput, zone?: Zone): DateTime;
  /**
   * A range from this time until another, the end excluded
   * @see https://next.semantic-ui.com/docs/api/dates/time#to
   */
  to(end: TimeInput | DurationInput): TimeRange;
  to(count: number, unit: Unit): TimeRange;

  /** @see https://next.semantic-ui.com/docs/api/dates/time#format */
  format(spec?: FormatSpec, locale?: Locale): string;
  /**
   * ISO 8601, `'17:30:00'`
   * @see https://next.semantic-ui.com/docs/api/dates/time#tostring
   */
  toString(): string;
  /** @see https://next.semantic-ui.com/docs/api/dates/time#tojson */
  toJSON(): string;
  /** @see https://next.semantic-ui.com/docs/api/dates/time#totemporal */
  toTemporal(): TemporalValue;
  /**
   * Throws. A time of day is not a point on the number line
   * @see https://next.semantic-ui.com/docs/api/dates/time#valueof
   */
  valueOf(): never;
}

/**
 * Reads `'09:00'`, `'5:30pm'`, `'17:30:15.250'`, numbers, a fields object, a datetime or a Date
 * @see https://next.semantic-ui.com/docs/api/dates/time#time
 */
export function time(input: TimeInput, options?: ReadOptions): Time;
export function time(hour: number, minute?: number, second?: number): Time;
/** With `{ loose: true }`, null for what cannot be read */
export function time(input: unknown, options: ReadOptions & { loose: true; }): Time | null;
/** Read in a zone, which matters for a `Date` */
export function time(input: TimeInput, zone: Zone): Time;

/** @see https://next.semantic-ui.com/docs/api/dates/helpers#istime */
export function isTime(value: unknown): value is Time;
