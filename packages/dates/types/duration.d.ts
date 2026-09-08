import type { DurationFields, DurationInput, Locale, TemporalValue, Unit } from './inputs.js';

/**
 * A length of time. Fields stay as written until balanced, and a duration measured with `until()` or
 * `since()` remembers where it started, so months and years can total in any unit.
 * @see {@link https://next.semantic-ui.com/docs/api/dates/duration Duration}
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
  /** @see https://next.semantic-ui.com/docs/api/dates/duration#iszero */
  isZero(): boolean;
  /** @see https://next.semantic-ui.com/docs/api/dates/duration#isnegative */
  isNegative(): boolean;
  /** The point this duration was measured from, when it came from `until()` or `since()` */
  readonly anchor: TemporalValue | undefined;

  /**
   * The nonzero fields as a plain object
   * @see https://next.semantic-ui.com/docs/api/dates/duration#tofields
   */
  toFields(): DurationFields;

  /** @see https://next.semantic-ui.com/docs/api/dates/duration#plus */
  plus(other: DurationInput, unit?: Unit): Duration;
  /** @see https://next.semantic-ui.com/docs/api/dates/duration#minus */
  minus(other: DurationInput, unit?: Unit): Duration;
  /** @see https://next.semantic-ui.com/docs/api/dates/duration#times */
  times(factor: number): Duration;
  /** @see https://next.semantic-ui.com/docs/api/dates/duration#negated */
  negated(): Duration;
  /** @see https://next.semantic-ui.com/docs/api/dates/duration#abs */
  abs(): Duration;
  /**
   * Carry overflow upward. A length stops at hours, an anchored duration at days, an explicit unit is taken as given
   * @see https://next.semantic-ui.com/docs/api/dates/duration#balance
   */
  balance(largest?: Unit): Duration;
  /**
   * Rounds to the nearest whole unit
   * @see https://next.semantic-ui.com/docs/api/dates/duration#round
   */
  round(smallest: Unit): Duration;

  /**
   * The whole duration in one unit, fractional. Months and years need the anchor
   * @see https://next.semantic-ui.com/docs/api/dates/duration#total
   */
  total(unit: Unit): number;
  /**
   * -1, 0 or 1 by length
   * @see https://next.semantic-ui.com/docs/api/dates/duration#compare
   */
  compare(other: DurationInput): number;
  /** @see https://next.semantic-ui.com/docs/api/dates/duration#equals */
  equals(other: DurationInput): boolean;

  /**
   * Words in the locale: `'2 hours, 30 minutes'`, `'2 hr, 30 min'`, `'2h 30m'`, `'2:30:00'`
   * @see https://next.semantic-ui.com/docs/api/dates/duration#format
   */
  format(style?: 'long' | 'short' | 'narrow' | 'digital', locale?: Locale): string;
  /**
   * ISO 8601, `'PT1H30M'`
   * @see https://next.semantic-ui.com/docs/api/dates/duration#tostring
   */
  toString(): string;
  /** @see https://next.semantic-ui.com/docs/api/dates/duration#tojson */
  toJSON(): string;
  /** @see https://next.semantic-ui.com/docs/api/dates/duration#totemporal */
  toTemporal(): TemporalValue;
  /**
   * The whole length in milliseconds, months and years only when anchored
   * @see https://next.semantic-ui.com/docs/api/dates/duration#tomilliseconds
   */
  toMilliseconds(): number;
  /** @see https://next.semantic-ui.com/docs/api/dates/duration#valueof */
  valueOf(): number;
}

/**
 * Reads a phrase, an ISO string, a fields object, or a number with a unit. A bare number is milliseconds
 * @see https://next.semantic-ui.com/docs/api/dates/duration#duration
 */
export function duration(input: DurationInput, unit?: Unit): Duration;
export function duration(input: DurationInput, options: { loose?: false; }): Duration;
/** With `loose`, null for input that does not read as a length instead of a throw */
export function duration(input: unknown, options: { loose: true; }): Duration | null;

/** @see https://next.semantic-ui.com/docs/api/dates/duration#years-months-weeks-days-hours-minutes-seconds-milliseconds */
export function years(count: number): Duration;
/** @see https://next.semantic-ui.com/docs/api/dates/duration#years-months-weeks-days-hours-minutes-seconds-milliseconds */
export function months(count: number): Duration;
/** @see https://next.semantic-ui.com/docs/api/dates/duration#years-months-weeks-days-hours-minutes-seconds-milliseconds */
export function weeks(count: number): Duration;
/** @see https://next.semantic-ui.com/docs/api/dates/duration#years-months-weeks-days-hours-minutes-seconds-milliseconds */
export function days(count: number): Duration;
/** @see https://next.semantic-ui.com/docs/api/dates/duration#years-months-weeks-days-hours-minutes-seconds-milliseconds */
export function hours(count: number): Duration;
/** @see https://next.semantic-ui.com/docs/api/dates/duration#years-months-weeks-days-hours-minutes-seconds-milliseconds */
export function minutes(count: number): Duration;
/** @see https://next.semantic-ui.com/docs/api/dates/duration#years-months-weeks-days-hours-minutes-seconds-milliseconds */
export function seconds(count: number): Duration;
/** @see https://next.semantic-ui.com/docs/api/dates/duration#years-months-weeks-days-hours-minutes-seconds-milliseconds */
export function milliseconds(count: number): Duration;

/** @see https://next.semantic-ui.com/docs/api/dates/helpers#isduration */
export function isDuration(value: unknown): value is Duration;
