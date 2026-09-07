import {
  configure,
  date,
  datetime,
  days,
  duration,
  hours,
  milliseconds,
  minutes,
  months,
  seconds,
  weeks,
} from '@semantic-ui/dates';

import { beforeEach, describe, expect, it } from 'vitest';

beforeEach(() => {
  configure({ zone: 'UTC', locale: 'en-US' });
});

describe('duration', () => {
  it('reads a phrase, an ISO string, a fields object, a number with a unit, and utils spellings', () => {
    expect(duration('1h 30m').toString()).toBe('PT1H30M');
    expect(duration('2 weeks and 3 days').toString()).toBe('P2W3D');
    expect(duration('PT2H').toString()).toBe('PT2H');
    expect(duration({ hours: 1, mins: 30 }).toString()).toBe('PT1H30M');
    expect(duration(90, 'minutes').toString()).toBe('PT90M');
    expect(duration('30s').toString()).toBe('PT30S');
    expect(duration(1500).toString()).toBe('PT1.5S');
    expect(duration('-1h 30m').toString()).toBe('-PT1H30M');
    expect(() => duration('banana')).toThrow(/unreadableDuration/);
  });

  it('spills a fraction into the next unit down, and refuses a fraction of a month', () => {
    expect(duration(1.5, 'days').toString()).toBe('P1DT12H');
    expect(duration('1.5h').toString()).toBe('PT1H30M');
    expect(() => duration('1.5 months')).toThrow(/fractionalMonth/);
  });

  it('is milliseconds under setTimeout, and refuses months until it knows its calendar', () => {
    expect(+hours(2)).toBe(7200000);
    expect(+duration('1w')).toBe(604800000);
    expect(+seconds(30)).toBe(30000);
    expect(() => +months(1)).toThrow(/needsAnchor/);
    expect(+date('2026-01-01').until('2026-02-01')).toBe(31 * 86400000);
  });

  it('totals in any unit, with weeks and months needing only what the anchor gives', () => {
    expect(minutes(90).total('hours')).toBe(1.5);
    expect(duration('1w').total('days')).toBe(7);
    expect(days(14).total('weeks')).toBe(2);
    expect(date('2026-01-01').until('2026-07-01').total('months')).toBe(6);
    expect(() => months(1).total('days')).toThrow(/needsAnchor/);
  });

  it('balances overflow upward and rounds down to a unit', () => {
    expect(minutes(150).balance().toString()).toBe('PT2H30M');
    expect(seconds(3661).balance('hour').toString()).toBe('PT1H1M1S');
    expect(duration('1 day 6 hours').balance().toString()).toBe('P1DT6H');
    expect(minutes(90).round('hour').toString()).toBe('PT2H');
  });

  it('balances a length to hours, since a day is a calendar unit, unless asked for days', () => {
    expect(hours(50).balance().toString()).toBe('PT50H');
    expect(duration('36h').balance().toString()).toBe('PT36H');
    expect(duration('36h').balance('day').toString()).toBe('P1DT12H');
    expect(weeks(1).balance().toString()).toBe('P7D');
    expect(duration('1.5 days').balance().toString()).toBe('P1DT12H');
    expect(duration('PT90M').balance().equals(duration('PT5400S').balance())).toBe(true);
    expect(duration('PT90M').balance().toString()).toBe(duration(5400000).balance().toString());
  });

  it('reads a length loosely, giving null for what is not one', () => {
    expect(duration('garbage', { loose: true })).toBeNull();
    expect(duration('5 foos', { loose: true })).toBeNull();
    expect(duration('2h', { loose: true }).toString()).toBe('PT2H');
    expect(hours(1).toMilliseconds()).toBe(3600000);
  });

  it('scales by a fraction, spilling into the unit below', () => {
    expect(hours(1).times(1.5).toString()).toBe('PT1H30M');
    expect(hours(1).times(0.5).toString()).toBe('PT30M');
    expect(days(1).times(-1.5).toString()).toBe('-P1DT12H');
  });

  it('refuses a phrase or a fields object with mixed signs, with a code', () => {
    expect(() => duration('1h -30m')).toThrow(/mixedSigns/);
    expect(() => duration({ hours: 1, minutes: -30 })).toThrow(/mixedSigns/);
    expect(duration('-1h 30m').toString()).toBe('-PT1H30M');
    expect(duration('-1h -30m').toString()).toBe('-PT1H30M');
    expect(() => duration(days(1), 'hours')).toThrow(/notADuration/);
  });

  it('adds, subtracts, multiplies, negates and takes the absolute', () => {
    expect(hours(2).plus(minutes(30)).toString()).toBe('PT2H30M');
    expect(hours(2).minus('30m').toString()).toBe('PT1H30M');
    expect(() => days(1).minus(hours(1))).toThrow(/mixedSigns/);
    expect(() => months(1).minus(days(3))).toThrow(/mixedSigns/);
    expect(days(1).times(3).toString()).toBe('P3D');
    expect(months(1).plus(days(3)).toString()).toBe('P1M3D');
    expect(hours(2).negated().isNegative).toBe(true);
    expect(hours(-2).abs().toString()).toBe('PT2H');
    expect(duration(0).isZero).toBe(true);
  });

  it('keeps days apart from hours, since a day is a calendar unit', () => {
    expect(days(1).plus(hours(25)).toString()).toBe('P1DT25H');
    expect(hours(25).plus(minutes(1)).toString()).toBe('PT25H1M');
    const start = datetime('2026-03-06T12:00', 'America/New_York');
    expect(start.plus(days(1).plus(hours(25))).toString()).toBe(start.plus(days(1)).plus(hours(25)).toString());
  });

  it('reads a bare number as milliseconds with a fraction, and refuses an empty string', () => {
    expect(duration(1500.5).toString()).toBe('PT1.5005S');
    expect(() => duration(NaN)).toThrow(/notFinite/);
    expect(() => duration('')).toThrow(/unreadableDuration/);
  });

  it('balances to weeks without an anchor, and names the anchor a month needs', () => {
    expect(duration('10d').balance('week').toString()).toBe('P1W3D');
    expect(() => duration('P1M').balance('day')).toThrow(/needsAnchor/);
    expect(() => duration('P1D').total('quarter')).toThrow(/needsAnchor/);
    expect(datetime('2026-01-31T00:00Z').until('2026-07-31T00:00Z', 'quarter')).toBe(2);
    expect(() => hours(1).format('medium')).toThrow(/unknownFormat/);
  });

  it('reads a count written as text beside its unit, the way a form sends one', () => {
    expect(days('30').toString()).toBe('P30D');
    expect(duration('90', 'minutes').toString()).toBe('PT90M');
    expect(duration('1M').toString()).toBe('P1M');
  });

  it('calls a month equal to a month without an anchor', () => {
    expect(months(1).equals(months(1))).toBe(true);
    expect(duration('P1M').equals(months(1))).toBe(true);
    expect(() => months(1).equals(days(30))).toThrow(/needsAnchor/);
  });

  it('formats a stored count of milliseconds as hours and minutes, and gives + its string', () => {
    expect(duration(93784512).format()).toBe('26 hours, 3 minutes, 4 seconds');
    expect(duration(93784512).toString()).toBe('PT93784.512S');
    expect('Takes ' + hours(2)).toBe('Takes PT2H');
    expect(hours(2) - hours(1)).toBe(3600000);
  });

  it('compares by length, using the anchor for calendar units', () => {
    expect(hours(1).compare(minutes(90))).toBe(-1);
    expect(hours(1).equals(minutes(60))).toBe(true);
    expect(date('2026-01-01').until('2026-02-01').compare(days(31))).toBe(0);
    expect(date('2026-02-01').until('2026-03-01').compare(days(31))).toBe(-1);
  });

  it('prints as words in four styles, hiding sub-second noise beside larger units', () => {
    const length = hours(2).plus(minutes(30));
    expect(length.format()).toBe('2 hours, 30 minutes');
    expect(length.format('short')).toBe('2 hr, 30 min');
    expect(length.format('narrow')).toBe('2h 30m');
    expect(length.format('digital')).toBe('2:30:00');
    expect(milliseconds(250).format()).toBe('250 milliseconds');
    expect(seconds(90).plus(milliseconds(5)).format()).toBe('1 minute, 30 seconds');
    expect(duration(0).format()).toBe('0 seconds');
    expect(hours(2).plus(minutes(5)).format('long', 'ja')).toBe('2 時間 5 分');
  });

  it('serializes to ISO and reads back equal', () => {
    const length = duration('1h 30m');
    expect(JSON.stringify({ ttl: length })).toBe('{"ttl":"PT1H30M"}');
    expect(duration(JSON.parse(JSON.stringify(length))).equals(length)).toBe(true);
    expect(weeks(1).toJSON()).toBe('P1W');
  });
});
