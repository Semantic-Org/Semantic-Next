import { configure, date, datetime, days, hours, months, today, tomorrow, years, yesterday } from '@semantic-ui/dates';

import { beforeEach, describe, expect, it } from 'vitest';

beforeEach(() => {
  configure({ zone: 'UTC', locale: 'en-US', weekStart: 'monday' });
});

describe('date', () => {
  it('reads an ISO day, three numbers, a fields object, a datetime and a Date', () => {
    expect(date('2026-09-06').toString()).toBe('2026-09-06');
    expect(date(2026, 9, 6).toString()).toBe('2026-09-06');
    expect(date({ year: 2026, month: 2, day: 28 }).toString()).toBe('2026-02-28');
    expect(date(datetime('2026-09-06T23:30Z').in('Asia/Tokyo')).toString()).toBe('2026-09-07');
    expect(date(new Date('2026-09-06T23:30:00Z'), { zone: 'Asia/Tokyo' }).toString()).toBe('2026-09-07');
  });

  it('keeps the day of a wall-clock string and refuses an instant until told the zone', () => {
    expect(date('2026-09-06T23:30').toString()).toBe('2026-09-06');
    expect(() => date('2026-09-06T23:30:00Z')).toThrow(/notADate/);
    expect(date('2026-09-06T23:30:00Z', { loose: true, zone: 'Asia/Tokyo' }).toString()).toBe('2026-09-07');
    expect(date('nope', { loose: true })).toBeNull();
    expect(() => date()).toThrow(/notADate/);
    expect(() => date('2026-09-06', { zone: 'Mars/Olympus' })).toThrow(/unknownZone/);
    expect(() => date(2026, 2, 30)).toThrow(/unreadableDate/);
  });

  it('constrains month arithmetic to the days the month has', () => {
    expect(date('2026-01-31').plus(months(1)).toString()).toBe('2026-02-28');
    expect(date('2026-01-31').plus(1, 'month').plus(1, 'month').toString()).toBe('2026-03-28');
    expect(date('2026-03-01').minus(days(1)).toString()).toBe('2026-02-28');
  });

  it('refuses clock units, since a date has no clock', () => {
    expect(() => date('2026-09-06').plus(hours(3))).toThrow(/notADateUnit/);
    expect(() => date('2026-09-06').startOf('hour')).toThrow(/notADateUnit/);
  });

  it('starts and ends units, with the week following the configured first day', () => {
    const sunday = date('2026-09-06');
    expect(sunday.startOf('week').toString()).toBe('2026-08-31');
    expect(sunday.endOf('week').toString()).toBe('2026-09-06');
    configure({ weekStart: 'sunday' });
    expect(sunday.startOf('week').toString()).toBe('2026-09-06');
    expect(sunday.endOf('week').toString()).toBe('2026-09-12');
    expect(sunday.endOf('month').toString()).toBe('2026-09-30');
    expect(date('2026-11-15').startOf('quarter').toString()).toBe('2026-10-01');
    expect(date('2026-02-10').endOf('month').toString()).toBe('2026-02-28');
  });

  it('finds the next and previous weekday strictly around this one', () => {
    expect(date('2026-09-06').next('monday').toString()).toBe('2026-09-07');
    expect(date('2026-09-06').next('sunday').toString()).toBe('2026-09-13');
    expect(date('2026-09-06').previous('Friday').toString()).toBe('2026-09-04');
    expect(() => date('2026-09-06').next('someday')).toThrow(/unknownWeekday/);
  });

  it('reads the calendar facts around it', () => {
    const day = date('2026-09-06');
    expect(day.weekday).toBe(7);
    expect(day.isWeekend).toBe(true);
    expect(day.quarter).toBe(3);
    expect(day.weekOfYear).toBe(36);
    expect(day.daysInMonth).toBe(30);
    expect(date('2028-02-01').isLeapYear).toBe(true);
  });

  it('compares with raw strings and by unit', () => {
    const day = date('2026-09-06');
    expect(day.isBefore('2026-09-07')).toBe(true);
    expect(day.isAfter(date('2026-01-01'))).toBe(true);
    expect(day.equals('2026-09-06')).toBe(true);
    expect(day.isSame('2026-09-30', 'month')).toBe(true);
    expect(day.isSame('2026-10-01', 'month')).toBe(false);
  });

  it('measures until and since, and the anchored duration totals in months', () => {
    const start = date('2026-01-01');
    expect(start.until('2027-04-05').toString()).toBe('P1Y3M4D');
    expect(start.until('2027-04-05', 'days')).toBe(459);
    expect(date('2027-04-05').since(start, 'weeks')).toBeCloseTo(65.571, 3);
    expect(start.until('2026-07-01').total('months')).toBe(6);
    expect(start.until(start.plus(years(1))).format()).toBe('1 year');
  });

  it('combines with a time and a zone into the moment an appointment happens', () => {
    const visit = date('2026-11-03').at('9:30am', 'America/Los_Angeles');
    expect(visit.toString()).toBe('2026-11-03T17:30:00.000Z');
    expect(visit.zone).toBe('America/Los_Angeles');
    expect(date('2026-11-03').at(undefined, 'UTC').toString()).toBe('2026-11-03T00:00:00.000Z');
    expect(date('2026-11-03').toJSDate('UTC').toISOString()).toBe('2026-11-03T00:00:00.000Z');
  });

  it('gives the inclusive range of the unit around it', () => {
    const month = date('2026-09-15').range('month');
    expect(month.toString()).toBe('2026-09-01/2026-09-30');
    expect(month.contains('2026-09-30')).toBe(true);
    expect(month.points('week').length).toBe(5);
  });

  it('formats with presets and tokens, and refuses a clock token', () => {
    const day = date('2026-09-06');
    expect(day.format()).toBe('Sep 6, 2026');
    expect(day.format('full')).toBe('Sunday, September 6, 2026');
    expect(day.format('MMMM Do, YYYY')).toBe('September 6th, 2026');
    expect(day.format('YYYYMM')).toBe('202609');
    expect(day.format({ weekday: 'long', month: 'long', day: 'numeric' })).toBe('Sunday, September 6');
    expect(() => day.format('HH:mm')).toThrow(/noField/);
  });

  it('formats a year under one hundred as written', () => {
    expect(date(50, 1, 1).format()).not.toMatch(/1950/);
    expect(date(50, 1, 1).format('YYYY-MM-DD')).toBe('0050-01-01');
  });

  it('refuses a bare number, which is a year or an instant depending on who wrote it', () => {
    expect(() => date(2026)).toThrow(/notADate/);
    expect(() => date(0)).toThrow(/notADate/);
    expect(date(2026, 9, 6).toString()).toBe('2026-09-06');
  });

  it('phrases the distance in days, weeks, months and years', () => {
    const reference = '2026-09-07';
    expect(date('2026-09-06').formatRelative(reference)).toBe('yesterday');
    expect(date('2026-09-07').formatRelative(reference)).toBe('today');
    expect(date('2026-09-08').formatRelative(reference)).toBe('tomorrow');
    expect(date('2026-09-21').formatRelative(reference)).toBe('in 2 weeks');
    expect(date('2026-11-01').formatRelative(reference)).toBe('in 2 months');
    expect(date('2020-01-01').formatRelative(reference)).toBe('7 years ago');
  });

  it('is not a number, and says which method to use instead', () => {
    expect(() => date('2026-09-06') < date('2026-09-07')).toThrow(/notANumber/);
  });

  it('places today, tomorrow and yesterday in a zone', () => {
    expect(tomorrow().since(today(), 'days')).toBe(1);
    expect(today().since(yesterday(), 'days')).toBe(1);
    expect(today('Asia/Tokyo').isToday('Asia/Tokyo')).toBe(true);
    expect(tomorrow('UTC').isFuture('UTC')).toBe(true);
  });

  it('serializes to its ISO day and reads back equal', () => {
    const day = date('2026-09-06');
    expect(JSON.stringify({ on: day })).toBe('{"on":"2026-09-06"}');
    expect(date(JSON.parse(JSON.stringify(day))).equals(day)).toBe(true);
  });
});
