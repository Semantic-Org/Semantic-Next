import { capitalize, isDevelopment, isPlainObject, isString, timezones } from '@semantic-ui/utils';

import { guard, refuse } from './errors.js';
import { weekdayNumber } from './units.js';

// process-wide defaults, zoneAliases being the names a zone answers to
const settings = { zone: undefined, locale: undefined, weekStart: 1, zoneAliases: {} };
const resolved = new Map([['UTC', 'UTC']]);

// utils' own abbreviation table is the base, editable at boot in either package. these override
// it with the daylight-observing reading of each US abbreviation, because the bare IANA 'EST' is a
// fixed offset that never springs forward, and nobody who types it means that
const abbreviations = {
  est: 'America/New_York',
  edt: 'America/New_York',
  eastern: 'America/New_York',
  cst: 'America/Chicago',
  cdt: 'America/Chicago',
  central: 'America/Chicago',
  mst: 'America/Denver',
  mdt: 'America/Denver',
  mountain: 'America/Denver',
  pst: 'America/Los_Angeles',
  pdt: 'America/Los_Angeles',
  pacific: 'America/Los_Angeles',
  akst: 'America/Anchorage',
  akdt: 'America/Anchorage',
  alaska: 'America/Anchorage',
  hst: 'Pacific/Honolulu',
  hawaii: 'Pacific/Honolulu',
  bst: 'Europe/London',
  cest: 'Europe/Paris',
  jst: 'Asia/Tokyo',
  kst: 'Asia/Seoul',
  aest: 'Australia/Sydney',
  aedt: 'Australia/Sydney',
  nzst: 'Pacific/Auckland',
  nzdt: 'Pacific/Auckland',
  sgt: 'Asia/Singapore',
  hkt: 'Asia/Hong_Kong',
  gmt: 'UTC',
  z: 'UTC',
};

const normalize = (text) =>
  text.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s_-]+/g, ' ');

const canonical = (id) => {
  try {
    return Temporal.Instant.fromEpochMilliseconds(0).toZonedDateTimeISO(id).timeZoneId;
  }
  catch {
    return undefined;
  }
};

// every IANA id the engine knows, by its loose full spelling and by its city. the canonical cities
// are unique, so 'los angeles' and 'sao paulo' each name exactly one zone
let index;
const cities = () => {
  if (!index) {
    const ids = typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : [];
    index = {
      full: new Map(ids.map((id) => [normalize(id), id])),
      city: new Map(ids.map((id) => [normalize(id.split('/').pop()), id])),
    };
  }
  return index;
};

// ICU's canonical list can lag the tz database (it still says Saigon where the database says
// Ho_Chi_Minh), so a city the index does not know is rebuilt in IANA spelling under each region and
// put to Temporal, which knows every link
const regions = ['Africa', 'America', 'Antarctica', 'Asia', 'Atlantic', 'Australia', 'Europe', 'Indian', 'Pacific'];
const rebuilt = (key) => {
  const city = key.split(' ').map(capitalize).join('_');
  for (const region of regions) {
    const found = canonical(`${region}/${city}`);
    if (found) {
      return found;
    }
  }
  return undefined;
};

const alias = (key) => {
  for (const table of [settings.zoneAliases, timezones]) {
    for (const [name, target] of Object.entries(table)) {
      if (normalize(name) === key) {
        return target;
      }
    }
  }
  return abbreviations[key];
};

// an IANA name, an offset, an abbreviation, a city, or a name set with configure({ zoneAliases }), in any
// case and spacing. resolves once per spelling and hands back the canonical id
export const zoneId = (id) => {
  if (id === undefined || id === null) {
    return settings.zone ?? Temporal.Now.timeZoneId();
  }
  if (!isString(id)) {
    refuse('unknownZone', String(id), {
      explanation: isDevelopment
        ? 'a zone is an IANA name like America/New_York, a city like Berlin, an abbreviation like PT, a fixed offset like +05:30, or UTC'
        : 0,
    });
  }
  const known = resolved.get(id);
  if (known) {
    return known;
  }
  const key = normalize(id);
  const found = canonical(alias(key) ?? id) ?? canonical(cities().full.get(key) ?? cities().city.get(key) ?? '')
    ?? rebuilt(key);
  if (!found) {
    refuse('unknownZone', id, {
      explanation: isDevelopment
        ? "a zone is an IANA name like America/New_York, a city like Berlin or los angeles, an abbreviation like PT or CET, a fixed offset like +05:30, or UTC. name your own once: configure({ zoneAliases: { hq: 'Europe/Berlin' } })"
        : 0,
    });
  }
  resolved.set(id, found);
  return found;
};

export const configure = ({ zone, locale, weekStart, zoneAliases } = {}) => {
  if (zoneAliases !== undefined) {
    if (!isPlainObject(zoneAliases)) {
      refuse('unknownZone', String(zoneAliases), {
        explanation: isDevelopment ? "zoneAliases is an object of names to zones: { hq: 'Europe/Berlin' }" : 0,
      });
    }
    for (const [name, target] of Object.entries(zoneAliases)) {
      settings.zoneAliases[name] = zoneId(target);
    }
    resolved.clear();
    resolved.set('UTC', 'UTC');
  }
  if (zone !== undefined) {
    settings.zone = zone === null ? undefined : zoneId(zone);
  }
  if (locale !== undefined) {
    settings.locale = locale === null ? undefined : checkedLocale(locale);
  }
  if (weekStart !== undefined) {
    settings.weekStart = weekdayNumber(weekStart);
  }
  return { ...settings, zoneAliases: { ...settings.zoneAliases } };
};

// an Accept-Language header is the classic first attempt, and Intl would refuse it far from the cause
const knownLocales = new Set();
const checkedLocale = (tag) => {
  const key = String(tag);
  if (!knownLocales.has(key)) {
    guard(
      () => Intl.getCanonicalLocales(tag),
      'unknownLocale',
      key,
      isDevelopment
        ? "a locale is a BCP 47 tag like 'en-US' or 'de', or a list of them. pick one out of an Accept-Language header"
        : 0,
    );
    knownLocales.add(key);
  }
  return tag;
};

export const locale = (override) => (override === undefined ? settings.locale : checkedLocale(override));
export const weekStart = () => settings.weekStart;
