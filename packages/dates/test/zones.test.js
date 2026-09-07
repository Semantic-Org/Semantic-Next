import {
  configure,
  date,
  datetime,
  IS_DATE_TIME,
  monthNames,
  now,
  today,
  weekday,
  weekdayNames,
} from '@semantic-ui/dates';

import { beforeEach, describe, expect, it } from 'vitest';

beforeEach(() => {
  configure({ zone: 'UTC', locale: 'en-US', weekStart: 'monday' });
});

describe('names', () => {
  it('lists the weekdays from the first day of the week, and the months, in the locale', () => {
    expect(weekdayNames()).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    expect(weekdayNames('de-DE', 'long', 'sunday')[0]).toBe('Sonntag');
    expect(weekdayNames(undefined, 'short', 'sunday')).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    expect(monthNames()).toHaveLength(12);
    expect(monthNames('fr', 'short')[0]).toBe('janv.');
    expect(weekday('sunday')).toBe(7);
    expect(weekday('Mon')).toBe(1);
    expect(() => weekday('someday')).toThrow(/unknownWeekday/);
  });
});

describe('brands', () => {
  it('are exported, so a value is recognised without the class', () => {
    expect(datetime('2026-09-06T14:30Z')[IS_DATE_TIME]).toBe(true);
    expect(IS_DATE_TIME).toBe(Symbol.for('semantic-ui/DateTime'));
  });
});

describe('zones', () => {
  it('folds the accents off a city', () => {
    expect(datetime('2026-09-06T12:00Z', 'São Paulo').zone).toBe('America/Sao_Paulo');
  });

  const visit = datetime('2026-11-03T09:30', 'America/Los_Angeles');

  it('answers to IANA names in any case and spacing', () => {
    expect(visit.in('america/los angeles').zone).toBe('America/Los_Angeles');
    expect(visit.in('Los_Angeles').zone).toBe('America/Los_Angeles');
    expect(visit.in('utc').zone).toBe('UTC');
    expect(visit.in('+05:30').zone).toBe('+05:30');
  });

  it('answers to a city', () => {
    expect(visit.in('Berlin').zone).toBe('Europe/Berlin');
    expect(visit.in('los angeles').zone).toBe('America/Los_Angeles');
    expect(visit.in('sao paulo').zone).toBe('America/Sao_Paulo');
    expect(visit.in('mexico city').zone).toBe('America/Mexico_City');
    expect(visit.in('ho chi minh').zone).toBe('Asia/Ho_Chi_Minh');
    expect(visit.in('kyiv').zone).toBe('Europe/Kyiv');
  });

  it('answers to an abbreviation with its daylight-observing meaning', () => {
    expect(visit.in('PT').zone).toBe('America/Los_Angeles');
    expect(visit.in('est').zone).toBe('America/New_York');
    expect(visit.in('pacific').zone).toBe('America/Los_Angeles');
    expect(visit.in('CET').zone).toBe('Europe/Paris');
    expect(visit.in('UK').zone).toBe('Europe/London');
    expect(visit.in('IST').zone).toBe('Asia/Kolkata');
    expect(visit.in('gmt').zone).toBe('UTC');
  });

  it('keeps the instant across every spelling', () => {
    expect(visit.in('Berlin').equals(visit.in('Europe/Berlin'))).toBe(true);
    expect(visit.in('PT').equals(visit)).toBe(true);
    expect(visit.in('Berlin').format('h:mm a')).toBe('6:30 pm');
  });

  it('answers to a name set once with configure', () => {
    configure({ zoneAliases: { hq: 'Berlin' } });
    expect(visit.in('hq').zone).toBe('Europe/Berlin');
    expect(date('2026-09-06').at('9am', 'hq').zone).toBe('Europe/Berlin');
    expect(configure().zoneAliases.hq).toBe('Europe/Berlin');
    expect(() => configure({ zoneAliases: { nowhere: 'Nowhere/Land' } })).toThrow(/unknownZone/);
  });

  it('refuses a name that is not a zone', () => {
    expect(() => visit.in('Mars/Olympus')).toThrow(/unknownZone/);
    expect(() => now('Springfield')).toThrow(/unknownZone/);
    expect(() => visit.in(42)).toThrow(/unknownZone/);
  });

  it('sets the default zone, locale and week start for every call', () => {
    configure({ zone: 'Asia/Tokyo', locale: 'de' });
    expect(now().zone).toBe('Asia/Tokyo');
    expect(datetime('2026-09-06T14:30Z').format('dddd D MMMM')).toBe('Sonntag 6 September');
    expect(today().equals(today('Asia/Tokyo'))).toBe(true);
    configure({ zone: null, locale: null });
    expect(now().zone).toBe(Temporal.Now.timeZoneId());
  });
});
