import type { Locale, Weekday, Zone } from '../inputs.js';

export interface Settings {
  /** The default zone every factory reads in. Null resets to the machine's zone */
  zone?: Zone | null;
  /** The default locale for formatting. Null resets to the runtime's */
  locale?: Locale | null;
  /** The first day of the week for `startOf('week')` (default: monday) */
  weekStart?: Weekday;
  /** Names a zone answers to, on top of cities and abbreviations: `{ hq: 'Europe/Berlin' }` */
  zoneAliases?: Record<string, Zone>;
}

/** Sets package-wide defaults once at app boot. Returns the settings in effect */
export function configure(settings?: Settings): {
  zone: string | undefined;
  locale: string | undefined;
  weekStart: number;
  zoneAliases: Record<string, string>;
};
