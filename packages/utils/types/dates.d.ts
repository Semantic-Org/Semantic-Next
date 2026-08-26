/**
 * Date manipulation and formatting utilities
 * @see {@link https://next.semantic-ui.com/docs/api/utils/dates Date Utilities Documentation}
 */

type DatePreset = 'LT' | 'LTS' | 'L' | 'l' | 'LL' | 'll' | 'LLL' | 'lll' | 'LLLL' | 'llll';
type DateToken =
  | 'YYYY'
  | 'YY'
  | 'MMMM'
  | 'MMM'
  | 'MM'
  | 'M'
  | 'DD'
  | 'D'
  | 'Do'
  | 'dddd'
  | 'ddd'
  | 'HH'
  | 'hh'
  | 'h'
  | 'mm'
  | 'ss'
  | 'a';

/** Shorthand timezone aliases resolved to IANA names internally */
type TimezoneShorthand =
  | 'ET'
  | 'CT'
  | 'MT'
  | 'PT'
  | 'AKT'
  | 'HT'
  | 'AT'
  | 'UK'
  | 'WET'
  | 'CET'
  | 'ECT'
  | 'EET'
  | 'IRST'
  | 'AET'
  | 'ACT'
  | 'AWT'
  | 'NZT'
  | 'BRT'
  | 'IST'
  | 'INST'
  | 'JST'
  | 'SGT';

type TimezonePreset =
  | 'UTC'
  | 'local'
  | TimezoneShorthand
  | 'America/New_York'
  | 'America/Chicago'
  | 'America/Denver'
  | 'America/Los_Angeles'
  | 'America/Anchorage'
  | 'America/Halifax'
  | 'America/Sao_Paulo'
  | 'Pacific/Honolulu'
  | 'Pacific/Auckland'
  | 'Europe/London'
  | 'Europe/Paris'
  | 'Europe/Helsinki'
  | 'Europe/Dublin'
  | 'Asia/Kolkata'
  | 'Asia/Tokyo'
  | 'Asia/Singapore'
  | 'Australia/Sydney'
  | 'Australia/Adelaide'
  | 'Australia/Perth';

type LocalePreset =
  | 'default'
  | 'en'
  | 'en-US'
  | 'en-GB'
  | 'es'
  | 'es-ES'
  | 'es-MX'
  | 'fr'
  | 'fr-FR'
  | 'de'
  | 'de-DE'
  | 'it'
  | 'it-IT'
  | 'ja'
  | 'ja-JP'
  | 'ko'
  | 'ko-KR'
  | 'zh'
  | 'zh-CN'
  | 'zh-TW';

/**
 * Options for formatDate with known locale/timezone presets.
 * Additional Intl.DateTimeFormat options are passed through to the underlying formatter.
 */
interface DateFormatOptionsPreset extends Omit<Intl.DateTimeFormatOptions, 'timeZone'> {
  locale?: LocalePreset;
  hour12?: boolean;
  timezone?: TimezonePreset;
}

/**
 * Options for formatDate with arbitrary locale/timezone strings.
 * Additional Intl.DateTimeFormat options are passed through to the underlying formatter.
 */
interface DateFormatOptionsCustom extends Omit<Intl.DateTimeFormatOptions, 'timeZone'> {
  locale?: string;
  hour12?: boolean;
  timezone?: string;
}

/**
 * Formats a date object into a string with extensive formatting options.
 * Supports both predefined formats and custom format strings.
 *
 * Caches `Intl.DateTimeFormat` instances for performance, uses `hourCycle: 'h23'`
 * internally and derives 12-hour values to avoid i18n edge cases. Escaped text
 * in square brackets and format tokens are handled in a single pass.
 *
 * @see {@link https://next.semantic-ui.com/docs/api/utils/dates#formatdate formatDate}
 *
 * @param date - The date to format
 * @param format - Predefined format string or custom format pattern (default `'LLL'`)
 * @param options - Formatting options including locale, timezone, hour12, and any
 *   additional `Intl.DateTimeFormatOptions` passed through to the formatter
 * @returns The formatted date string, or `'Invalid Date'` for invalid input
 *
 * @example
 * ```ts
 * // Predefined formats
 * formatDate(new Date(), 'LT')   // '3:30 pm'
 * formatDate(new Date(), 'L')    // '05/18/2023'
 * formatDate(new Date(), 'LLLL') // 'Thursday, May 18, 2023 3:30 pm'
 *
 * // Custom format with escaped text
 * formatDate(new Date(), 'YYYY-MM-DD')       // '2023-05-18'
 * formatDate(new Date(), '[Today is] dddd')   // 'Today is Thursday'
 *
 * // Timezone shorthands
 * formatDate(new Date(), 'HH:mm', { timezone: 'ET' })  // Eastern Time
 * formatDate(new Date(), 'HH:mm', { timezone: 'PT' })  // Pacific Time
 *
 * // 24-hour format
 * formatDate(new Date(), 'LT', { hour12: false }) // '15:30'
 * ```
 *
 * Format Tokens:
 * - YYYY: Full year
 * - YY: 2-digit year
 * - MMMM: Full month name
 * - MMM: 3-letter month name
 * - MM: 2-digit month number
 * - M: Month number
 * - DD: 2-digit day of month
 * - D: Day of month
 * - Do: Day of month with ordinal
 * - dddd: Full day name
 * - ddd: 3-letter day name
 * - HH: 24-hour hours
 * - hh: 12-hour hours (respects hour12 option)
 * - h: Hours (respects hour12 option)
 * - mm: Minutes
 * - ss: Seconds
 * - a: am/pm
 *
 * Use square brackets to escape text: `[Today is] DD`
 */
export function formatDate(date: Date, format: DatePreset | DateToken, options?: DateFormatOptionsPreset): string;
export function formatDate(date: Date, format?: string, options?: DateFormatOptionsCustom): string;

/**
 * The timezone alias vocabulary for {@link formatDate} — shorthand abbreviation mapped to an IANA
 * zone. Abbreviations are ambiguous by nature (IST is Kolkata, Jerusalem, or Dublin depending on
 * who you ask), so the picks are editable once at app boot
 * (e.g. `formatDate.config.timezones.IST = 'Asia/Jerusalem'`). Full IANA names always pass through.
 */
export interface FormatDateConfig {
  /** Shorthand abbreviation mapped to its IANA zone */
  timezones: Record<string, string>;
}

export namespace formatDate {
  /** The timezone alias vocabulary. Set once at app boot; full IANA names bypass it */
  let config: FormatDateConfig;
}

/**
 * Options for duration formatting
 */
export interface FormatDurationSettings {
  /** Maximum decimal places, trailing zeros drop (default: the config decimals, 1) */
  decimals?: number;
  /** Hold one unit instead of picking the largest the value fills, printed as spelled, any spelling `toDuration` reads (`'s'`, `'minutes'`, `'hr'`) */
  unit?: string;
  /** Pick the largest unit whose print reads back through `toDuration` to the same value, for a config view (default: the config lossless, false) */
  lossless?: boolean;
  /** Text between the number and the unit, `' '` for `'1.5 minutes'` (default: the config separator, `''`) */
  separator?: string;
}

/**
 * The defaults and unit ladder read by every {@link formatDuration} call. Set once at app boot
 * (e.g. `formatDuration.config.decimals = 0`); per-call settings still win over it.
 */
export interface FormatDurationConfig {
  /** Default for `decimals` */
  decimals: number;
  /** Default for `lossless` */
  lossless: boolean;
  /** Default for `separator` */
  separator: string;
  /** The units to pick from, largest first, each a spelling `toDuration.config.units` holds (`['w', 'd', 'h', 'm', 's', 'ms']`) */
  units: string[];
}

/**
 * Formats a duration for display in the largest unit it fills (`'5m'`, `'1.5h'`, `'500ms'`), or `null`
 * when there is no duration to format. The inverse of {@link toDuration}: it reads anything `toDuration`
 * reads, and every string it prints reads back through `toDuration`. `decimals` is a maximum and
 * trailing zeros drop, `unit` holds one unit for a column, and `lossless` picks the largest unit that
 * reads back to exactly the same value, so a config view never shows `'1.7m'` for `100000`. `separator`
 * goes between the number and the unit. The sign is kept.
 * @see {@link https://next.semantic-ui.com/docs/api/utils/dates#formatduration formatDuration}
 * @see {@link https://next.semantic-ui.com/examples/utils-formatduration Example}
 *
 * @param value - The milliseconds, or a duration expression
 * @param settings - Formatting options
 * @returns The formatted duration, or `null` if there is no duration to format
 *
 * @example
 * ```ts
 * formatDuration(300000) // '5m'
 * formatDuration(90000) // '1.5m'
 * formatDuration(100000) // '1.7m'
 * formatDuration(100000, { lossless: true }) // '100s'
 * formatDuration(90000, { unit: 's' }) // '90s'
 * formatDuration(90000, { unit: 'minutes', separator: ' ' }) // '1.5 minutes'
 * formatDuration('90s') // '1.5m'
 * ```
 */
export function formatDuration(value: unknown, settings?: FormatDurationSettings): string | null;
export namespace formatDuration {
  /** The defaults and unit ladder. Set once at app boot; per-call settings win */
  let config: FormatDurationConfig;
}
