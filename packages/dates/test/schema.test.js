import * as bare from '@semantic-ui/dates';
import { configure, date, dateRange, datetime, duration, months, time, timeRange } from '@semantic-ui/dates';
import {
  CalendarDate,
  DateRange,
  DateTime,
  DateTimeRange,
  Duration,
  Time,
  TimeRange,
  VALUE,
} from '@semantic-ui/dates/schema';

import { beforeEach, describe, expect, it } from 'vitest';

const kinds = { DateTime, CalendarDate, Time, Duration, DateRange, DateTimeRange, TimeRange };

beforeEach(() => {
  configure({ zone: null, locale: 'en-US', weekStart: 'monday' });
});

describe('the value protocol', () => {
  it('is attached to the same seven classes the bare entry exports', () => {
    for (const [name, Kind] of Object.entries(kinds)) {
      expect(Kind).toBe(bare[name]);
      expect(Kind[VALUE].kind).toBe(
        bare.kindOf(
          Kind === Duration
            ? duration(1)
            : Kind === DateTime
            ? datetime(0)
            : Kind === CalendarDate
            ? date('2026-09-06')
            : Kind === Time
            ? time('09:00')
            : Kind === DateRange
            ? dateRange('2026-09-01', '2026-09-07')
            : Kind === DateTimeRange
            ? datetime(0).to(datetime(1))
            : timeRange('09:00', '17:00'),
        ),
      );
      expect(Kind[VALUE].family).toBe(DateTime[VALUE].family);
      expect(Object.isFrozen(Kind[VALUE])).toBe(true);
    }
    expect(DateTime[VALUE].family).toEqual([
      DateTime,
      CalendarDate,
      Time,
      Duration,
      DateRange,
      DateTimeRange,
      TimeRange,
    ]);
    expect(VALUE).toBe(Symbol.for('semantic-ui/value'));
  });

  it('reads through the factories and refuses with the coded refusal', () => {
    expect(CalendarDate[VALUE].decode('2026-09-06').equals('2026-09-06')).toBe(true);
    expect(CalendarDate[VALUE].parse(new Date('2026-09-06T12:00:00Z')).toString()).toBe(
      date(new Date('2026-09-06T12:00:00Z')).toString(),
    );
    expect(() => CalendarDate[VALUE].parse('next tuesday')).toThrow(/unreadableDate/);
    expect(() => CalendarDate[VALUE].decode('next tuesday')).toThrow(/unreadableDate/);
    expect(() => Time[VALUE].decode('25:00')).toThrow(/unreadableTime/);
    expect(Duration[VALUE].decode('PT90M').equals('1h 30m')).toBe(true);
    expect(DateRange[VALUE].decode('2026-09-01/2026-09-07').equals(dateRange('2026-09-01', '2026-09-07'))).toBe(true);
    expect(() => DateRange[VALUE].decode('2026-09-07/2026-09-01')).toThrow(/backwards/);
    expect(DateTime[VALUE].decode('2026-09-06T14:30:00.000Z').equals(datetime('2026-09-06T14:30Z'))).toBe(true);
  });

  it('keys a datetime by its exact instant, and a Date on the same line', () => {
    const exact = datetime('2026-09-06T14:30:00.000000001Z');
    expect(DateTime[VALUE].key(exact)).toBe(1788705000000000001n);
    expect(DateTime[VALUE].key(datetime('2026-09-06T14:30Z'))).not.toBe(DateTime[VALUE].key(exact));
    expect(DateTime[VALUE].key(new Date('2026-09-06T14:30:00Z'))).toBe(
      DateTime[VALUE].key(datetime('2026-09-06T14:30Z', 'Asia/Tokyo')),
    );
    expect(DateTime[VALUE].ordered).toBe(true);
  });

  it('keys a day and a clock as numbers that order as the kind orders', () => {
    expect(CalendarDate[VALUE].key(date('2026-09-06'))).toBe(20260906);
    expect(CalendarDate[VALUE].key(date('2026-09-06')) < CalendarDate[VALUE].key(date('2026-10-01'))).toBe(true);
    expect(Time[VALUE].key(time('00:00'))).toBe(0);
    expect(Time[VALUE].key(time('17:30:15.250'))).toBe(63015250000000);
    expect(Time[VALUE].key(time('17:30:15.250000001')) - Time[VALUE].key(time('17:30:15.250'))).toBe(1);
    expect(Time[VALUE].key(time('23:59:59.999999999')) < Number.MAX_SAFE_INTEGER).toBe(true);
    expect(CalendarDate[VALUE].ordered && Time[VALUE].ordered).toBe(true);
  });

  it('keys a duration by its milliseconds and refuses months and years, anchored or not', () => {
    expect(Duration[VALUE].key(duration('PT90M'))).toBe(5400000);
    expect(Duration[VALUE].key(duration('1 week'))).toBe(604800000);
    expect(Duration[VALUE].key(duration('PT1H30M'))).toBe(Duration[VALUE].key(duration('90m')));
    expect(() => Duration[VALUE].key(months(2))).toThrow(/calendarDuration/);
    expect(() => Duration[VALUE].key(date('2026-01-31').until('2026-03-31'))).toThrow(/calendarDuration/);
    expect(Duration[VALUE].ordered).toBe(true);
    expect(Duration[VALUE].summable).toBe(true);
    expect(DateTime[VALUE].summable).toBeUndefined();
    expect(Duration[VALUE].encode(duration('PT90M'))).toBe('PT90M');
    expect(() => Duration[VALUE].encode(months(2))).toThrow(/calendarDuration/);
    expect(DateTime[VALUE].encode).toBeUndefined();
  });

  it('keys a span by its wire text and declares no order', () => {
    expect(DateRange[VALUE].key(dateRange('2026-09-01', '2026-09-07'))).toBe('2026-09-01/2026-09-07');
    expect(TimeRange[VALUE].key(timeRange('22:00', '06:00'))).toBe('22:00:00/06:00:00');
    expect(DateTimeRange[VALUE].key(datetime('2026-09-06T14:30Z', 'Asia/Tokyo').to(datetime('2026-09-06T15:30Z'))))
      .toBe('2026-09-06T14:30:00.000Z/2026-09-06T15:30:00.000Z');
    expect([DateRange, DateTimeRange, TimeRange].every((Kind) => Kind[VALUE].ordered === false)).toBe(true);
  });

  it('states what an instant field means for a calendar day, per operator, half-open in the configured zone', () => {
    const day = date('2026-03-08');
    expect(() => DateTime[VALUE].condition('eq', day)).toThrow(/noZone/);
    configure({ zone: 'America/New_York' });
    const spelled = (maps) =>
      maps.map((map) => Object.fromEntries(Object.entries(map).map(([operator, at]) => [operator, at.toString()])));
    const start = '2026-03-08T05:00:00.000Z';
    const end = '2026-03-09T04:00:00.000Z';
    expect(spelled(DateTime[VALUE].condition('eq', day))).toEqual([{ $gte: start, $lt: end }]);
    expect(spelled(DateTime[VALUE].condition('$ne', day))).toEqual([{ $lt: start }, { $gte: end }]);
    expect(spelled(DateTime[VALUE].condition('$gte', day))).toEqual([{ $gte: start }]);
    expect(spelled(DateTime[VALUE].condition('$lt', day))).toEqual([{ $lt: start }]);
    expect(spelled(DateTime[VALUE].condition('$lte', day))).toEqual([{ $lt: end }]);
    expect(spelled(DateTime[VALUE].condition('$gt', day))).toEqual([{ $gte: end }]);
    const [{ $gte: springStart, $lt: springEnd }] = DateTime[VALUE].condition('eq', day);
    expect(springStart.until(springEnd, 'hours')).toBe(23);
    const [{ $gte: fallStart, $lt: fallEnd }] = DateTime[VALUE].condition('eq', date('2026-11-01'));
    expect(fallStart.until(fallEnd, 'hours')).toBe(25);
    expect(DateTime[VALUE].condition('eq', '2026-03-08')).toBeUndefined();
    expect(DateTime[VALUE].condition('eq', datetime('2026-03-08T12:00Z'))).toBeUndefined();
    expect(DateTime[VALUE].condition('$in', [day])).toBeUndefined();
    expect(DateTime[VALUE].span).toBeUndefined();
  });

  it('declares on DateTime alone the built-in it upgrades', () => {
    expect(DateTime[VALUE].upgrades).toBe(Date);
    for (const Kind of [CalendarDate, Time, Duration, DateRange, DateTimeRange, TimeRange]) {
      expect(Kind[VALUE].upgrades).toBeUndefined();
    }
  });
});
