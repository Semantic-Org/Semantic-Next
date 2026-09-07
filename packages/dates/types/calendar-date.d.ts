import type { DateTime } from './date-time.js';
import type { Duration } from './duration.js';
import type {
  CalendarDateInput,
  DateTimeFields,
  DateUnit,
  DurationInput,
  FormatSpec,
  Locale,
  ReadOptions,
  TemporalValue,
  TimeInput,
  Unit,
  Weekday,
  Zone,
} from './inputs.js';
import type { DateRange, DateTimeRange } from './range.js';

/**
 * A calendar date with no time and no zone: a due date, a birthday, a booking night. It is not a
 * moment, so it never shifts when read from another zone.
 * @see {@link https://next.semantic-ui.com/docs/api/dates/date CalendarDate}
 */
export class CalendarDate {
  constructor(input: CalendarDateInput, options?: ReadOptions);
  constructor(year: number, month: number, day?: number);

  readonly year: number;
  readonly month: number;
  readonly day: number;
  /** ISO, 1 for monday through 7 for sunday */
  readonly weekday: number;
  readonly quarter: number;
  readonly dayOfYear: number;
  /** ISO week number */
  readonly weekOfYear: number;
  readonly daysInMonth: number;
  readonly daysInYear: number;
  /** @see https://next.semantic-ui.com/docs/api/dates/date#isleapyear */
  isLeapYear(): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/date#isweekend */
  isWeekend(): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/date#isweekday */
  isWeekday(): boolean;

  /**
   * Adds years, months, weeks or days. A clock unit refuses
   * @see https://next.semantic-ui.com/docs/api/dates/date#plus
   */
  plus(amount: DurationInput, unit?: Unit): CalendarDate;
  /** @see https://next.semantic-ui.com/docs/api/dates/date#minus */
  minus(amount: DurationInput, unit?: Unit): CalendarDate;
  /** @see https://next.semantic-ui.com/docs/api/dates/date#set */
  set(fields: Pick<DateTimeFields, 'year' | 'month' | 'day'>): CalendarDate;
  set(unit: Unit, value: number): CalendarDate;
  /**
   * The first day of the unit around this value. A week starts on the configured first day, or on `firstDay`
   * @see https://next.semantic-ui.com/docs/api/dates/date#startof
   */
  startOf(unit: DateUnit, firstDay?: Weekday): CalendarDate;
  /**
   * The last day of the unit, so endOf('month') is the 28th, 30th or 31st
   * @see https://next.semantic-ui.com/docs/api/dates/date#endof
   */
  endOf(unit: DateUnit, firstDay?: Weekday): CalendarDate;
  /**
   * The next such weekday strictly after this one
   * @see https://next.semantic-ui.com/docs/api/dates/date#next
   */
  next(weekday: Weekday): CalendarDate;
  /** @see https://next.semantic-ui.com/docs/api/dates/date#previous */
  previous(weekday: Weekday): CalendarDate;

  /** @see https://next.semantic-ui.com/docs/api/dates/date#equals */
  equals(other: CalendarDateInput): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/date#isbefore */
  isBefore(other: CalendarDateInput): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/date#isafter */
  isAfter(other: CalendarDateInput): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/date#issame */
  isSame(other: CalendarDateInput, unit?: DateUnit, firstDay?: Weekday): boolean;
  /**
   * Today depends on where you stand, so these take the zone to judge from
   * @see https://next.semantic-ui.com/docs/api/dates/date#ispast
   */
  isPast(zone?: Zone): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/date#isfuture */
  isFuture(zone?: Zone): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/date#istoday */
  isToday(zone?: Zone): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/date#istomorrow */
  isTomorrow(zone?: Zone): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/date#isyesterday */
  isYesterday(zone?: Zone): boolean;

  /**
   * A duration balanced from years down that remembers this date, or the whole length as a number in a unit
   * @see https://next.semantic-ui.com/docs/api/dates/date#until
   */
  until(other: CalendarDateInput): Duration;
  until(other: CalendarDateInput, unit: Unit): number;
  /** @see https://next.semantic-ui.com/docs/api/dates/date#since */
  since(other: CalendarDateInput): Duration;
  since(other: CalendarDateInput, unit: Unit): number;
  /**
   * This date at a time of day in a zone, the moment an appointment happens. No time means midnight
   * @see https://next.semantic-ui.com/docs/api/dates/date#at
   */
  at(time?: TimeInput, zone?: Zone): DateTime;
  /**
   * A range from this date through another, both included
   * @see https://next.semantic-ui.com/docs/api/dates/date#to
   */
  to(end: CalendarDateInput | DurationInput): DateRange;
  to(count: number, unit: Unit): DateRange;
  /**
   * Every day of the unit containing this date, first through last
   * @see https://next.semantic-ui.com/docs/api/dates/date#range
   */
  range(unit: DateUnit, firstDay?: Weekday): DateRange;
  /**
   * The day's points by a step, as datetimes in the zone: `today().points('hour')`
   * @see https://next.semantic-ui.com/docs/api/dates/date#points
   */
  points(step: Unit | DurationInput, zone?: Zone): DateTime[];
  /**
   * The day cut into ranges by a step, as datetime ranges in the zone: `today().split('hour')`
   * @see https://next.semantic-ui.com/docs/api/dates/date#split
   */
  split(step: Unit | DurationInput, zone?: Zone): DateTimeRange[];

  /** @see https://next.semantic-ui.com/docs/api/dates/date#format */
  format(spec?: FormatSpec, locale?: Locale): string;
  /**
   * `'yesterday'`, `'in 3 weeks'`, `'last month'`, measured against today unless told otherwise
   * @see https://next.semantic-ui.com/docs/api/dates/date#formatrelative
   */
  formatRelative(to?: CalendarDateInput, locale?: Locale): string;
  /**
   * ISO 8601, `'2026-09-06'`
   * @see https://next.semantic-ui.com/docs/api/dates/date#tostring
   */
  toString(): string;
  /** @see https://next.semantic-ui.com/docs/api/dates/date#tojson */
  toJSON(): string;
  /**
   * Midnight of this date in the zone, as a JS Date
   * @see https://next.semantic-ui.com/docs/api/dates/date#tojsdate
   */
  toJSDate(zone?: Zone): Date;
  /** @see https://next.semantic-ui.com/docs/api/dates/date#totemporal */
  toTemporal(): TemporalValue;
  /**
   * Throws. A date is not a point on the number line
   * @see https://next.semantic-ui.com/docs/api/dates/date#valueof
   */
  valueOf(): never;
}

/**
 * Reads `'2026-09-06'`, three numbers, a fields object, a datetime (its date in its zone), a Date (its
 * date in the zone), or a Temporal value. A wall-clock string keeps its day. A string carrying Z or an
 * offset refuses unless `{ loose: true, zone }` says which zone chooses the day
 * @see https://next.semantic-ui.com/docs/api/dates/date#date
 */
export function date(input: CalendarDateInput, options?: ReadOptions): CalendarDate;
export function date(year: number, month: number, day?: number): CalendarDate;
/** With `{ loose: true }`, null for what cannot be read */
export function date(input: unknown, options: ReadOptions & { loose: true; }): CalendarDate | null;
/** Read in a zone, which matters for a `Date` */
export function date(input: CalendarDateInput, zone: Zone): CalendarDate;

/** @see https://next.semantic-ui.com/docs/api/dates/date#today */
export function today(zone?: Zone): CalendarDate;
/** @see https://next.semantic-ui.com/docs/api/dates/date#tomorrow */
export function tomorrow(zone?: Zone): CalendarDate;
/** @see https://next.semantic-ui.com/docs/api/dates/date#yesterday */
export function yesterday(zone?: Zone): CalendarDate;

/** @see https://next.semantic-ui.com/docs/api/dates/helpers#iscalendardate */
export function isCalendarDate(value: unknown): value is CalendarDate;
