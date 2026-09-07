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
import type { DateRange } from './range.js';

/**
 * A calendar date with no time and no zone: a due date, a birthday, a booking night. It is not a
 * moment, so it never shifts when read from another zone.
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
  readonly isLeapYear: boolean;
  readonly isWeekend: boolean;
  readonly isWeekday: boolean;

  /** Adds years, months, weeks or days. A clock unit refuses */
  plus(amount: DurationInput, unit?: Unit): CalendarDate;
  minus(amount: DurationInput, unit?: Unit): CalendarDate;
  set(fields: Pick<DateTimeFields, 'year' | 'month' | 'day'>): CalendarDate;
  set(unit: Unit, value: number): CalendarDate;
  startOf(unit: DateUnit): CalendarDate;
  /** The last day of the unit, so endOf('month') is the 28th, 30th or 31st */
  endOf(unit: DateUnit): CalendarDate;
  /** The next such weekday strictly after this one */
  next(weekday: Weekday): CalendarDate;
  previous(weekday: Weekday): CalendarDate;

  equals(other: CalendarDateInput): boolean;
  isBefore(other: CalendarDateInput): boolean;
  isAfter(other: CalendarDateInput): boolean;
  isSame(other: CalendarDateInput, unit?: DateUnit): boolean;
  /** Today depends on where you stand, so these take the zone to judge from */
  isPast(zone?: Zone): boolean;
  isFuture(zone?: Zone): boolean;
  isToday(zone?: Zone): boolean;
  isTomorrow(zone?: Zone): boolean;
  isYesterday(zone?: Zone): boolean;

  /** A duration balanced from years down that remembers this date, or the whole length as a number in a unit */
  until(other: CalendarDateInput): Duration;
  until(other: CalendarDateInput, unit: Unit): number;
  since(other: CalendarDateInput): Duration;
  since(other: CalendarDateInput, unit: Unit): number;
  /** This date at a time of day in a zone, the moment an appointment happens. No time means midnight */
  at(time?: TimeInput, zone?: Zone): DateTime;
  /** A range from this date through another, both included */
  to(end: CalendarDateInput | DurationInput): DateRange;
  /** Every day of the unit containing this date, first through last */
  range(unit: DateUnit): DateRange;

  format(spec?: FormatSpec, locale?: Locale): string;
  /** `'yesterday'`, `'in 3 weeks'`, `'last month'`, measured against today unless told otherwise */
  relative(to?: CalendarDateInput, locale?: Locale): string;
  /** ISO 8601, `'2026-09-06'` */
  toString(): string;
  toJSON(): string;
  /** Midnight of this date in the zone, as a JS Date */
  toJSDate(zone?: Zone): Date;
  toTemporal(): TemporalValue;
  /** Throws. A date is not a point on the number line */
  valueOf(): never;
}

/**
 * Reads `'2026-09-06'`, three numbers, a fields object, a datetime (its date in its zone), a Date (its
 * date in the zone), or a Temporal value. A wall-clock string keeps its day. A string carrying Z or an
 * offset refuses unless `{ loose: true, zone }` says which zone chooses the day
 */
export function date(input: CalendarDateInput, options?: ReadOptions): CalendarDate;
export function date(year: number, month: number, day?: number): CalendarDate;
/** With `{ loose: true }`, null for what cannot be read */
export function date(input: CalendarDateInput, options: ReadOptions & { loose: true; }): CalendarDate | null;

export function today(zone?: Zone): CalendarDate;
export function tomorrow(zone?: Zone): CalendarDate;
export function yesterday(zone?: Zone): CalendarDate;

export function isCalendarDate(value: unknown): value is CalendarDate;
