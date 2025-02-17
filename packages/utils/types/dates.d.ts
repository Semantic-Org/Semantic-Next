type DatePreset = 'LT' | 'LTS' | 'L' | 'l' | 'LL' | 'll' | 'LLL' | 'lll' | 'LLLL' | 'llll';
type DateToken = 'YYYY' | 'YY' | 'MMMM' | 'MMM' | 'MM' | 'M' | 'DD' | 'D' | 'Do' | 'dddd' | 'ddd' | 'HH' | 'hh' | 'h' | 'mm' | 'ss' | 'a';
type TimezonePreset =
  | 'UTC'
  | 'local'
  | 'America/New_York'
  | 'America/Los_Angeles'
  | 'America/Chicago'
  | 'Europe/London'
  | 'Europe/Paris'
  | 'Asia/Tokyo';

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

interface DateFormatOptionsPreset {
  locale?: LocalePreset;
  hour12?: boolean;
  timezone?: TimezonePreset;
}

interface DateFormatOptionsCustom {
  locale?: string;
  hour12?: boolean;
  timezone?: string;
}

/**
 * Formats a date object into a string with extensive formatting options
 * Supports both predefined formats and custom format strings
 *
 * @param date - The date to format
 * @param format - Predefined format string or custom format pattern
 * @param options - Additional formatting options
 * @returns The formatted date string
 *
 * @example
 * ```ts
 * // Using predefined formats
 * formatDate(new Date(), 'LT') // returns '3:30 pm'
 * formatDate(new Date(), 'L') // returns '05/18/2023'
 * formatDate(new Date(), 'LLLL') // returns 'Thursday, May 18, 2023 3:30 pm'
 *
 * // Using custom format string
 * formatDate(new Date(), 'YYYY-MM-DD') // returns '2023-05-18'
 * formatDate(new Date(), '[Today is] dddd') // returns 'Today is Thursday'
 *
 * // Using options
 * formatDate(new Date(), 'LT', {
 *   timezone: 'America/New_York',
 *   hour12: false
 * }) // returns '15:30'
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
 * - hh: 12-hour hours
 * - h: Hours
 * - mm: Minutes
 * - ss: Seconds
 * - a: am/pm
 *
 * Use square brackets to escape text: [Today is] DD
 */

export function formatDate(date: Date, format: DatePreset | DateToken, options?: DateFormatOptionsPreset): string;
export function formatDate(date: Date, format: string, options?: DateFormatOptionsCustom): string;
export function formatDate(date: Date, format?: string, options?: DateFormatOptionsCustom): string;
export function formatDate(date: Date, format: string = 'LLL', options?: DateFormatOptionsCustom): string;
