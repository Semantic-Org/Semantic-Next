import type { Locale, Weekday } from '../inputs.js';

/**
 * The weekday names in the locale, starting on the configured first day or on `firstDay`: a picker's header row
 * @see https://next.semantic-ui.com/docs/api/dates/helpers#weekdaynames
 */
export function weekdayNames(style?: 'short' | 'long', firstDay?: Weekday, locale?: Locale): string[];
/**
 * The twelve month names in the locale: a month dropdown
 * @see https://next.semantic-ui.com/docs/api/dates/helpers#monthnames
 */
export function monthNames(style?: 'short' | 'long', locale?: Locale): string[];
