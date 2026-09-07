import { configure, datetime, days, hours, minutes, now, today } from '@semantic-ui/dates';

import { beforeEach, describe, expect, it } from 'vitest';

beforeEach(() => {
  configure({ zone: 'UTC', locale: 'en-US', weekStart: 'monday' });
});

describe('datetime', () => {
  it('reads an ISO instant and shows it in the configured zone', () => {
    const moment = datetime('2026-09-06T14:30:00Z');
    expect(moment.hour).toBe(14);
    expect(moment.zone).toBe('UTC');
    expect(moment.in('America/New_York').hour).toBe(10);
  });

  it('reads a wall clock in the zone it is given', () => {
    expect(datetime('2026-09-06T14:30', 'Asia/Tokyo').toString()).toBe('2026-09-06T05:30:00.000Z');
    expect(datetime('2026-09-06 14:30', 'Asia/Tokyo').toString()).toBe('2026-09-06T05:30:00.000Z');
  });

  it('keeps an offset in the string as the instant, never as the zone', () => {
    const moment = datetime('2026-09-06T14:30:00+09:00');
    expect(moment.toString()).toBe('2026-09-06T05:30:00.000Z');
    expect(moment.zone).toBe('UTC');
  });

  it('takes a bracketed zone from the string', () => {
    expect(datetime('2026-09-06T14:30:00+09:00[Asia/Tokyo]').zone).toBe('Asia/Tokyo');
  });

  it('reads a Date, epoch milliseconds, a fields object and a Temporal value', () => {
    expect(datetime(new Date(0)).toString()).toBe('1970-01-01T00:00:00.000Z');
    expect(datetime(0).toString()).toBe('1970-01-01T00:00:00.000Z');
    expect(datetime({ year: 2026, month: 9, day: 6, hour: 9 }, 'UTC').toString()).toBe('2026-09-06T09:00:00.000Z');
    expect(datetime(Temporal.Instant.from('2026-09-06T09:00:00Z')).hour).toBe(9);
  });

  it('serializes to the instant in UTC and keeps sub-millisecond digits only when present', () => {
    expect(datetime('2026-09-06T14:30Z').toJSON()).toBe('2026-09-06T14:30:00.000Z');
    expect(datetime('2026-09-06T14:30:00.123456Z').toString()).toBe('2026-09-06T14:30:00.123456Z');
    expect(JSON.stringify({ at: datetime('2026-09-06T14:30Z') })).toBe('{"at":"2026-09-06T14:30:00.000Z"}');
  });

  it('now() is millisecond precision so it survives a JSON round trip', () => {
    const moment = now();
    expect(moment.microsecond).toBe(0);
    expect(datetime(moment.toJSON()).equals(moment)).toBe(true);
  });

  it('adds and subtracts a duration in every spelling', () => {
    const moment = datetime('2026-09-06T14:30Z');
    expect(moment.plus(days(3)).toString()).toBe('2026-09-09T14:30:00.000Z');
    expect(moment.plus({ hours: 1, minutes: 30 }).toString()).toBe('2026-09-06T16:00:00.000Z');
    expect(moment.plus('1h 30m').toString()).toBe('2026-09-06T16:00:00.000Z');
    expect(moment.plus(2, 'weeks').toString()).toBe('2026-09-20T14:30:00.000Z');
    expect(moment.minus(1, 'month').toString()).toBe('2026-08-06T14:30:00.000Z');
  });

  it('keeps the wall clock across a daylight saving change when adding days, and counts hours when adding hours', () => {
    const friday = datetime('2026-03-06T17:00', 'America/New_York');
    expect(friday.plus(days(3)).format('dddd h:mm a')).toBe('Monday 5:00 pm');
    expect(friday.plus(hours(72)).format('dddd h:mm a')).toBe('Monday 6:00 pm');
    expect(friday.plus(days(2)).hoursInDay).toBe(23);
  });

  it('moves a wall clock that does not exist that morning forward', () => {
    expect(datetime('2026-03-08T02:30', 'America/New_York').format('h:mm A z')).toBe('3:30 AM EDT');
  });

  it('starts and ends units, with the week following the configured first day', () => {
    const moment = datetime('2026-09-06T14:37:42Z');
    expect(moment.startOf('day').toString()).toBe('2026-09-06T00:00:00.000Z');
    expect(moment.startOf('week').toString()).toBe('2026-08-31T00:00:00.000Z');
    configure({ weekStart: 'sunday' });
    expect(moment.startOf('week').toString()).toBe('2026-09-06T00:00:00.000Z');
    expect(moment.startOf('quarter').toString()).toBe('2026-07-01T00:00:00.000Z');
    expect(moment.endOf('month').toString()).toBe('2026-09-30T23:59:59.999Z');
    expect(moment.startOf('hour').toString()).toBe('2026-09-06T14:00:00.000Z');
  });

  it('rounds, floors and ceils to an increment', () => {
    const moment = datetime('2026-09-06T14:37:42Z');
    expect(moment.round(15, 'minutes').toString()).toBe('2026-09-06T14:45:00.000Z');
    expect(moment.floor(15, 'minutes').toString()).toBe('2026-09-06T14:30:00.000Z');
    expect(moment.ceil('hour').toString()).toBe('2026-09-06T15:00:00.000Z');
  });

  it('finds the next and previous weekday strictly around this one', () => {
    const sunday = datetime('2026-09-06T14:30Z');
    expect(sunday.next('sunday').toString()).toBe('2026-09-13T14:30:00.000Z');
    expect(sunday.next('friday').day).toBe(11);
    expect(sunday.previous('fri').day).toBe(4);
  });

  it('sets fields and moves to another time of day', () => {
    const moment = datetime('2026-09-06T14:30Z');
    expect(moment.set({ hour: 9, minute: 0 }).toString()).toBe('2026-09-06T09:00:00.000Z');
    expect(moment.set('year', 2030).year).toBe(2030);
    expect(moment.at('9am').toString()).toBe('2026-09-06T09:00:00.000Z');
  });

  it('compares as the same instant whatever zone each side reads it in', () => {
    const moment = datetime('2026-09-06T14:30Z');
    expect(moment.equals(moment.in('Asia/Tokyo'))).toBe(true);
    expect(moment.isBefore('2026-09-07')).toBe(true);
    expect(moment.isAfter(datetime('2026-01-01T00:00Z'))).toBe(true);
    expect(moment.isSame('2026-09-06T23:00Z', 'day')).toBe(true);
    expect(moment.in('Asia/Tokyo').isSame('2026-09-06T23:00Z', 'day')).toBe(false);
  });

  it('answers past, future and the days around today', () => {
    expect(now().minus(days(1)).isPast()).toBe(true);
    expect(now().plus(days(1)).isFuture()).toBe(true);
    expect(now().isToday()).toBe(true);
    expect(now().plus(days(1)).isTomorrow()).toBe(true);
    expect(now().minus(days(1)).isYesterday()).toBe(true);
  });

  it('measures until and since as a balanced duration, or a number in a unit', () => {
    const start = datetime('2026-01-01T00:00Z');
    const end = datetime('2026-04-05T06:07Z');
    expect(start.until(end).toString()).toBe('P3M4DT6H7M');
    expect(start.until(end, 'hours')).toBeCloseTo(2262.1167, 4);
    expect(end.since(start, 'days')).toBeCloseTo(94.255, 3);
    expect(end.until(start).isNegative).toBe(true);
  });

  it('gives the half-open range of the unit around it', () => {
    const day = datetime('2026-09-06T14:30Z').range('day');
    expect(day.toString()).toBe('2026-09-06T00:00:00.000Z/2026-09-07T00:00:00.000Z');
    expect(day.contains('2026-09-07T00:00Z')).toBe(false);
  });

  it('formats with presets, Intl options and tokens', () => {
    const moment = datetime('2026-09-06T14:30Z');
    expect(moment.format()).toBe('Sep 6, 2026, 2:30 PM');
    expect(moment.format('long')).toBe('September 6, 2026 at 2:30 PM');
    expect(moment.format('date')).toBe('Sep 6, 2026');
    expect(moment.format({ weekday: 'long' })).toBe('Sunday');
    expect(moment.format('dddd, MMMM Do YYYY [at] h:mm a')).toBe('Sunday, September 6th 2026 at 2:30 pm');
    expect(moment.format('YYYY-MM-DD HH:mm:ss.SSS Z')).toBe('2026-09-06 14:30:00.000 +00:00');
    expect(moment.format('dddd D MMMM', 'de')).toBe('Sonntag 6 September');
  });

  it('phrases the distance from a reference', () => {
    const reference = '2026-09-07T14:00Z';
    expect(datetime('2026-09-07T13:59:30Z').relative(reference)).toBe('30 seconds ago');
    expect(datetime('2026-09-07T13:00Z').relative(reference)).toBe('1 hour ago');
    expect(datetime('2026-09-06T14:00Z').relative(reference)).toBe('yesterday');
    expect(datetime('2026-09-09T14:00Z').relative(reference)).toBe('in 2 days');
    expect(datetime('2026-08-01T14:00Z').relative(reference)).toBe('last month');
  });

  it('is a number under the operators Date users know', () => {
    const later = datetime('2026-09-06T14:35Z');
    const earlier = datetime('2026-09-06T14:30Z');
    expect(later - earlier).toBe(300000);
    expect(later > earlier).toBe(true);
    expect([later, earlier].sort((a, b) => a - b)[0]).toBe(earlier);
  });

  it('refuses what it cannot read, with a code', () => {
    expect(() => datetime('banana')).toThrow(/unreadableDateTime/);
    expect(() => datetime()).toThrow(/notADateTime/);
    expect(() => datetime(null)).toThrow(/notADateTime/);
    expect(() => datetime('2026-09-06T14:30Z', 'Mars/Olympus')).toThrow(/unknownZone/);
    expect(() => datetime('2026-09-06T14:30Z').plus(7, 'fortnights')).toThrow(/unknownUnit/);
  });

  it('reads what Date reads through the loose door and gives null for the rest', () => {
    expect(datetime('Sat, 06 Sep 2026 14:30:00 GMT', { loose: true }).toString()).toBe('2026-09-06T14:30:00.000Z');
    expect(datetime('not a date', { loose: true })).toBeNull();
    expect(datetime(undefined, { loose: true })).toBeNull();
    expect(datetime('2026-09-06T14:30Z', { loose: true, zone: 'Asia/Tokyo' }).hour).toBe(23);
    expect(() => datetime('banana', { loose: true, zone: 'Mars/Olympus' })).toThrow(/unknownZone/);
  });

  it('exposes the calendar date and clock time as their own values', () => {
    const moment = datetime('2026-09-06T14:30Z').in('Asia/Tokyo');
    expect(moment.date.toString()).toBe('2026-09-06');
    expect(moment.time.toString()).toBe('23:30:00');
    expect(moment.date.equals(today('Asia/Tokyo')) === moment.isToday()).toBe(true);
    expect(moment.plus(minutes(30)).minute).toBe(0);
  });
});
