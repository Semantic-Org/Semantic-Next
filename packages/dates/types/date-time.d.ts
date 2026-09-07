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
  isLeapYear(): boolean;
  isWeekend(): boolean;
  isWeekday(): boolean;
  /** The calendar date in this zone */
  readonly date: CalendarDate;
  /** The time of day in this zone */
  readonly time: Time;

  /** Adding days keeps the wall clock across a daylight saving change, adding hours counts hours */
  plus(amount: DurationInput, unit?: Unit): DateTime;
  minus(amount: DurationInput, unit?: Unit): DateTime;
  set(fields: DateTimeFields): DateTime;
  set(unit: Unit, value: number): DateTime;
  /** The same date and zone at another time of day */
  at(time: TimeInput): DateTime;
  /** The same instant read in another zone */
  in(zone: Zone): DateTime;
  /** The first instant of the unit around this value. A week starts on the configured first day, or on `firstDay` */
  startOf(unit: Unit, firstDay?: Weekday): DateTime;
  /** The last millisecond of the unit. For a query bound prefer `range(unit)` */
  endOf(unit: Unit, firstDay?: Weekday): DateTime;
  round(unit: Unit): DateTime;
  round(increment: number, unit: Unit): DateTime;
  floor(unit: Unit): DateTime;
  floor(increment: number, unit: Unit): DateTime;
  ceil(unit: Unit): DateTime;
  ceil(increment: number, unit: Unit): DateTime;
  /** The next such weekday strictly after this one, at the same time of day */
  next(weekday: Weekday): DateTime;
  previous(weekday: Weekday): DateTime;

  /** The same instant, whatever zone each side reads it in */
  equals(other: DateTimeInput): boolean;
  isBefore(other: DateTimeInput): boolean;
  isAfter(other: DateTimeInput): boolean;
  /** Same to the unit, judged in this datetime's zone */
  isSame(other: DateTimeInput, unit?: Unit, firstDay?: Weekday): boolean;
  isPast(): boolean;
  isFuture(): boolean;
  isToday(): boolean;
  isTomorrow(): boolean;
  isYesterday(): boolean;

  /** A duration balanced from years down that remembers this moment, or the whole length as a number in a unit */
  until(other: DateTimeInput): Duration;
  until(other: DateTimeInput, unit: Unit): number;
  since(other: DateTimeInput): Duration;
  since(other: DateTimeInput, unit: Unit): number;
  /** A range from this moment until another, the end excluded */
  to(end: DateTimeInput | DurationInput): DateTimeRange;
  to(count: number, unit: Unit): DateTimeRange;
  /** The unit containing this moment as a half-open range, its start until the next start */
  range(unit: Unit, firstDay?: Weekday): DateTimeRange;

  /** A preset ('short', 'medium', 'long', 'full', 'date', 'time'), an Intl options bag, or day.js tokens. No argument reads as the locale's medium date and short time */
  format(spec?: FormatSpec, locale?: Locale): string;
  /** `'3 hours ago'`, `'in 2 days'`, `'yesterday'`, measured against now unless told otherwise */
  formatRelative(to?: DateTimeInput, locale?: Locale): string;
  /** The instant in UTC, `'2026-09-06T14:30:00.000Z'` */
  toString(): string;
  toJSON(): string;
  toJSDate(): Date;
  toTemporal(): TemporalValue;
  /** Epoch milliseconds, so datetimes sort and subtract with the operators Date users know */
  valueOf(): number;
}

/**
 * Reads an ISO string (`'2026-09-06T14:30Z'`, `'2026-09-06T14:30'` as a wall clock in the zone,
 * `'2026-09-06'` as midnight), a Date, epoch milliseconds, a fields object, a date, or a Temporal value.
 * A missing value refuses, `now()` reads the current moment
 */
export function datetime(input: DateTimeInput, zone?: Zone): DateTime;
export function datetime(input: DateTimeInput, options?: ReadOptions): DateTime;
/** With `{ loose: true }`, reads what `Date` reads and gives null for the rest */
export function datetime(input: unknown, options: ReadOptions & { loose: true; }): DateTime | null;

/** The current moment at millisecond precision, in the zone or the configured default */
export function now(zone?: Zone): DateTime;
/** `now(zone).startOf('day')`, the bound a query for today writes */
export function startOfToday(zone?: Zone): DateTime;
/** `now(zone).endOf('day')`, the last millisecond of today */
export function endOfToday(zone?: Zone): DateTime;

export function isDateTime(value: unknown): value is DateTime;
