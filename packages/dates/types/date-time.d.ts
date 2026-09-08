import type { CalendarDate } from './calendar-date.js';
import type { Duration } from './duration.js';
import type {
  DateTimeFields,
  DateTimeInput,
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
import type { DateTimeRange } from './range.js';
import type { Time } from './time.js';

/**
 * An exact moment with a zone to read it in. One type for timestamps, appointments and deadlines.
 * The zone is a view: `toString()` and `toJSON()` print the instant in UTC.
 * @see {@link https://next.semantic-ui.com/docs/api/dates/datetime DateTime}
 */
export class DateTime {
  constructor(input: DateTimeInput, zone?: Zone);
  constructor(input: DateTimeInput, options?: ReadOptions);

  readonly year: number;
  readonly month: number;
  readonly day: number;
  /** ISO, 1 for monday through 7 for sunday */
  readonly weekday: number;
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
  readonly millisecond: number;
  readonly microsecond: number;
  readonly nanosecond: number;
  /** The canonical zone id */
  readonly zone: string;
  /** The UTC offset in effect, `'+05:30'` */
  readonly offset: string;
  /** Epoch milliseconds */
  readonly epoch: number;
  readonly quarter: number;
  readonly dayOfYear: number;
  /** ISO week number */
  readonly weekOfYear: number;
  readonly daysInMonth: number;
  readonly daysInYear: number;
  /** 23, 24 or 25 across a daylight saving change */
  readonly hoursInDay: number;
  /** @see https://next.semantic-ui.com/docs/api/dates/datetime#isleapyear */
  isLeapYear(): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/datetime#isweekend */
  isWeekend(): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/datetime#isweekday */
  isWeekday(): boolean;
  /** The calendar date in this zone */
  readonly date: CalendarDate;
  /** The time of day in this zone */
  readonly time: Time;

  /**
   * Adding days keeps the wall clock across a daylight saving change, adding hours counts hours
   * @see https://next.semantic-ui.com/docs/api/dates/datetime#plus
   */
  plus(amount: DurationInput, unit?: Unit): DateTime;
  /** @see https://next.semantic-ui.com/docs/api/dates/datetime#minus */
  minus(amount: DurationInput, unit?: Unit): DateTime;
  /** @see https://next.semantic-ui.com/docs/api/dates/datetime#set */
  set(fields: DateTimeFields): DateTime;
  set(unit: Unit, value: number): DateTime;
  /**
   * The same date and zone at another time of day
   * @see https://next.semantic-ui.com/docs/api/dates/datetime#at
   */
  at(time: TimeInput): DateTime;
  /**
   * The same instant read in another zone
   * @see https://next.semantic-ui.com/docs/api/dates/datetime#in
   */
  in(zone: Zone): DateTime;
  /**
   * The first instant of the unit around this value. A week starts on the configured first day, or on `firstDay`
   * @see https://next.semantic-ui.com/docs/api/dates/datetime#startof
   */
  startOf(unit: Unit, firstDay?: Weekday): DateTime;
  /**
   * The last millisecond of the unit. For a query bound prefer `range(unit)`
   * @see https://next.semantic-ui.com/docs/api/dates/datetime#endof
   */
  endOf(unit: Unit, firstDay?: Weekday): DateTime;
  /** @see https://next.semantic-ui.com/docs/api/dates/datetime#round */
  round(unit: Unit): DateTime;
  round(increment: number, unit: Unit): DateTime;
  /** @see https://next.semantic-ui.com/docs/api/dates/datetime#floor */
  floor(unit: Unit): DateTime;
  floor(increment: number, unit: Unit): DateTime;
  /** @see https://next.semantic-ui.com/docs/api/dates/datetime#ceil */
  ceil(unit: Unit): DateTime;
  ceil(increment: number, unit: Unit): DateTime;
  /**
   * The next such weekday strictly after this one, at the same time of day
   * @see https://next.semantic-ui.com/docs/api/dates/datetime#next
   */
  next(weekday: Weekday): DateTime;
  /** @see https://next.semantic-ui.com/docs/api/dates/datetime#previous */
  previous(weekday: Weekday): DateTime;

  /**
   * The same instant, whatever zone each side reads it in
   * @see https://next.semantic-ui.com/docs/api/dates/datetime#equals
   */
  equals(other: DateTimeInput): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/datetime#isbefore */
  isBefore(other: DateTimeInput): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/datetime#isafter */
  isAfter(other: DateTimeInput): boolean;
  /**
   * Same to the unit, judged in this datetime's zone
   * @see https://next.semantic-ui.com/docs/api/dates/datetime#issame
   */
  isSame(other: DateTimeInput, unit?: Unit, firstDay?: Weekday): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/datetime#ispast */
  isPast(): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/datetime#isfuture */
  isFuture(): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/datetime#istoday */
  isToday(): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/datetime#istomorrow */
  isTomorrow(): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/datetime#isyesterday */
  isYesterday(): boolean;

  /**
   * A duration balanced from years down that remembers this moment, or the whole length as a number in a unit
   * @see https://next.semantic-ui.com/docs/api/dates/datetime#until
   */
  until(other: DateTimeInput): Duration;
  until(other: DateTimeInput, unit: Unit): number;
  /** @see https://next.semantic-ui.com/docs/api/dates/datetime#since */
  since(other: DateTimeInput): Duration;
  since(other: DateTimeInput, unit: Unit): number;
  /**
   * A range from this moment until another, the end excluded
   * @see https://next.semantic-ui.com/docs/api/dates/datetime#to
   */
  to(end: DateTimeInput | DurationInput): DateTimeRange;
  to(count: number, unit: Unit): DateTimeRange;
  /**
   * The unit containing this moment as a half-open range, its start until the next start
   * @see https://next.semantic-ui.com/docs/api/dates/datetime#range
   */
  range(unit: Unit, firstDay?: Weekday): DateTimeRange;

  /**
   * A preset ('short', 'medium', 'long', 'full', 'date', 'time'), an Intl options bag, or day.js tokens. No argument reads as the locale's medium date and short time
   * @see https://next.semantic-ui.com/docs/api/dates/datetime#format
   */
  format(spec?: FormatSpec, locale?: Locale): string;
  /**
   * `'3 hours ago'`, `'in 2 days'`, `'yesterday'`, measured against now unless told otherwise
   * @see https://next.semantic-ui.com/docs/api/dates/datetime#formatrelative
   */
  formatRelative(to?: DateTimeInput, locale?: Locale): string;
  /**
   * The instant in UTC, `'2026-09-06T14:30:00.000Z'`
   * @see https://next.semantic-ui.com/docs/api/dates/datetime#tostring
   */
  toString(): string;
  /** @see https://next.semantic-ui.com/docs/api/dates/datetime#tojson */
  toJSON(): string;
  /** @see https://next.semantic-ui.com/docs/api/dates/datetime#tojsdate */
  toJSDate(): Date;
  /** @see https://next.semantic-ui.com/docs/api/dates/datetime#totemporal */
  toTemporal(): TemporalValue;
  /**
   * Epoch milliseconds, so datetimes sort and subtract with the operators Date users know
   * @see https://next.semantic-ui.com/docs/api/dates/datetime#valueof
   */
  valueOf(): number;
}

/**
 * Reads an ISO string (`'2026-09-06T14:30Z'`, `'2026-09-06T14:30'` as a wall clock in the zone,
 * `'2026-09-06'` as midnight), a Date, epoch milliseconds, a fields object, a date, or a Temporal value.
 * A missing value refuses, `now()` reads the current moment
 * @see https://next.semantic-ui.com/docs/api/dates/datetime#datetime
 */
export function datetime(input: DateTimeInput, zone?: Zone): DateTime;
export function datetime(input: DateTimeInput, options?: ReadOptions): DateTime;
/** With `{ loose: true }`, reads what `Date` reads and gives null for the rest */
export function datetime(input: unknown, options: ReadOptions & { loose: true; }): DateTime | null;

/**
 * The current moment at millisecond precision, in the zone or the configured default
 * @see https://next.semantic-ui.com/docs/api/dates/datetime#now
 */
export function now(zone?: Zone): DateTime;
/**
 * `now(zone).startOf('day')`, the bound a query for today writes
 * @see https://next.semantic-ui.com/docs/api/dates/datetime#startoftoday
 */
export function startOfToday(zone?: Zone): DateTime;
/**
 * `now(zone).endOf('day')`, the last millisecond of today
 * @see https://next.semantic-ui.com/docs/api/dates/datetime#endoftoday
 */
export function endOfToday(zone?: Zone): DateTime;

/** @see https://next.semantic-ui.com/docs/api/dates/helpers#isdatetime */
export function isDateTime(value: unknown): value is DateTime;
