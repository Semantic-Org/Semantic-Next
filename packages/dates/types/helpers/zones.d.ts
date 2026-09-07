import type { Locale, Weekday, Zone } from '../inputs.js';

/** @see {@link https://next.semantic-ui.com/docs/api/dates/setup#configure Settings} */
export interface Settings {
  /** The default zone every factory reads in. Null resets to the machine's zone */
  zone?: Zone | null;
  /** The default locale for formatting. Null resets to the runtime's */
  locale?: Locale | null;
  /** The first day of the week for `startOf('week')` (default: monday) */
  weekStart?: Weekday;
  /** Read a loose numeric date day first, `07.09.2026` as the 7th of September (default: false, the engine's month-first order) */
  dayFirst?: boolean;
  /** Names a zone answers to, on top of cities and abbreviations: `{ hq: 'Europe/Berlin' }` */
  zoneAliases?: Record<string, Zone>;
}

/**
 * Sets package-wide defaults once at app boot. Returns the settings in effect
 * @see https://next.semantic-ui.com/docs/api/dates/setup#configure
 */
export function configure(settings?: Settings): {
  zone: string | undefined;
  locale: string | undefined;
  weekStart: number;
  dayFirst: boolean;
  zoneAliases: Record<string, string>;
};
