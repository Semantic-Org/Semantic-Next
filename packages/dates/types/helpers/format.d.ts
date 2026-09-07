import type { Locale, Weekday } from '../inputs.js';

/** The weekday names in the locale, starting on the configured first day or on `firstDay`: a picker's header row */
export function weekdayNames(locale?: Locale, style?: 'short' | 'long', firstDay?: Weekday): string[];
/** The twelve month names in the locale: a month dropdown */
export function monthNames(locale?: Locale, style?: 'short' | 'long'): string[];
