import type { DurationFields, DurationInput, Locale, TemporalValue, Unit } from './inputs.js';

/**
 * A length of time. Fields stay as written until balanced, and a duration measured with `until()` or
 * `since()` remembers where it started, so months and years can total in any unit.
 */
export class Duration {
  constructor(input: DurationInput, unit?: Unit);

  readonly years: number;
  readonly months: number;
  readonly weeks: number;
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly milliseconds: number;
  readonly microseconds: number;
  readonly nanoseconds: number;
  /** 1, 0 or -1 */
  readonly sign: number;
  readonly isZero: boolean;
  readonly isNegative: boolean;
  /** The point this duration was measured from, when it came from `until()` or `since()` */
  readonly anchor: TemporalValue | undefined;

  /** The nonzero fields as a plain object */
  fields(): DurationFields;

  plus(other: DurationInput, unit?: Unit): Duration;
  minus(other: DurationInput, unit?: Unit): Duration;
  times(factor: number): Duration;
  negated(): Duration;
  abs(): Duration;
  /** Carries overflow upward: 90 minutes becomes an hour and a half. Weeks, months and years need the anchor */
  balance(largest?: Unit): Duration;
  /** Rounds to the nearest whole unit */
  round(smallest: Unit): Duration;

  /** The whole duration in one unit, fractional. Months and years need the anchor */
  total(unit: Unit): number;
  /** -1, 0 or 1 by length */
  compare(other: DurationInput): number;
  equals(other: DurationInput): boolean;

  /** Words in the locale: `'2 hours, 30 minutes'`, `'2 hr, 30 min'`, `'2h 30m'`, `'2:30:00'` */
  format(style?: 'long' | 'short' | 'narrow' | 'digital', locale?: Locale): string;
  /** ISO 8601, `'PT1H30M'` */
  toString(): string;
  toJSON(): string;
  toTemporal(): TemporalValue;
  /** Milliseconds, so a duration drops into setTimeout. Months and years refuse unless anchored */
  valueOf(): number;
}

/** Reads a phrase, an ISO string, a fields object, or a number with a unit. A bare number is milliseconds */
export function duration(input: DurationInput, unit?: Unit): Duration;

export function years(count: number): Duration;
export function months(count: number): Duration;
export function weeks(count: number): Duration;
export function days(count: number): Duration;
export function hours(count: number): Duration;
export function minutes(count: number): Duration;
export function seconds(count: number): Duration;
export function milliseconds(count: number): Duration;

export function isDuration(value: unknown): value is Duration;
