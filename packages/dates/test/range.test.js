import {
  configure,
  date,
  DateRange,
  dateRange,
  datetime,
  DateTimeRange,
  datetimeRange,
  days,
  hours,
  isDateRange,
  isTimeRange,
  minutes,
  months,
  time,
  TimeRange,
  timeRange,
} from '@semantic-ui/dates';

import { beforeEach, describe, expect, it } from 'vitest';

beforeEach(() => {
  configure({ zone: 'UTC', locale: 'en-US', weekStart: 'monday' });
});

describe('dateRange', () => {
  it('runs through its end, so the 1st through the 7th is seven days', () => {
    const week = dateRange('2026-09-01', '2026-09-07');
    expect(week.contains('2026-09-07')).toBe(true);
    expect(week.contains('2026-09-08')).toBe(false);
    expect(week.duration.total('days')).toBe(7);
    expect(week.points('day').length).toBe(7);
    expect(dateRange('2026-09-06', '2026-09-06').duration.total('days')).toBe(1);
  });

  it('covers a length from its start', () => {
    expect(dateRange(date('2026-09-06'), days(7)).toString()).toBe('2026-09-06/2026-09-12');
    expect(dateRange('2026-09-06', '1 week').points('day').length).toBe(7);
  });

  it('steps from the start, so monthly from the 31st lands on each month end', () => {
    const renewals = dateRange(date('2026-01-31'), months(6)).points('month').map(String);
    expect(renewals).toEqual(['2026-01-31', '2026-02-28', '2026-03-31', '2026-04-30', '2026-05-31', '2026-06-30']);
  });

  it('splits into sub-ranges cut to the end', () => {
    const quarters = date('2026-01-01').range('year').split('quarter').map(String);
    expect(quarters).toEqual([
      '2026-01-01/2026-03-31',
      '2026-04-01/2026-06-30',
      '2026-07-01/2026-09-30',
      '2026-10-01/2026-12-31',
    ]);
    expect(date('2026-09-15').range('month').split('week').length).toBe(5);
  });

  it('overlaps, contains and intersects with both ends included', () => {
    const september = dateRange('2026-09-01', '2026-09-30');
    expect(september.overlaps(dateRange('2026-09-30', '2026-10-05'))).toBe(true);
    expect(september.overlaps(dateRange('2026-10-01', '2026-10-05'))).toBe(false);
    expect(september.contains(dateRange('2026-09-10', '2026-09-20'))).toBe(true);
    expect(september.contains(dateRange('2026-09-10', '2026-10-20'))).toBe(false);
    expect(september.intersection(dateRange('2026-09-20', '2026-10-20')).toString()).toBe('2026-09-20/2026-09-30');
    expect(september.intersection(dateRange('2026-10-01', '2026-10-05'))).toBeNull();
  });

  it('becomes the half-open datetime bounds a query wants', () => {
    const bounds = dateRange('2026-09-01', '2026-09-07').in('UTC');
    expect(bounds.toString()).toBe('2026-09-01T00:00:00.000Z/2026-09-08T00:00:00.000Z');
    expect(bounds.duration.total('hours')).toBe(168);
    expect(bounds).toBeInstanceOf(DateTimeRange);
  });

  it('reads its own ISO interval string and datetimes as their dates', () => {
    expect(dateRange('2026-09-01/2026-09-07').toJSON()).toBe('2026-09-01/2026-09-07');
    expect(dateRange(datetime('2026-09-06T23:30Z'), datetime('2026-09-08T01:00Z')).toString()).toBe(
      '2026-09-06/2026-09-08',
    );
  });

  it('formats as one phrase', () => {
    expect(dateRange('2026-09-01', '2026-09-07').format()).toMatch(/^Sep 1\s*[–-]\s*7, 2026$/);
    expect(dateRange('2026-09-01', '2026-09-07').format({ month: 'short', day: 'numeric' })).toMatch(
      /^Sep 1\s*[–-]\s*7$/,
    );
  });

  it('reads a fields object end as a day when its keys are singular and as a length when plural', () => {
    expect(dateRange('2026-09-01', { year: 2026, month: 9, day: 30 }).toString()).toBe('2026-09-01/2026-09-30');
    expect(dateRange('2026-09-01', { days: 7 }).toString()).toBe('2026-09-01/2026-09-07');
    expect(dateRange('2026-09-01', { weeks: 1 }).toString()).toBe('2026-09-01/2026-09-07');
  });

  it('refuses to test a range of another kind for containment, like its siblings', () => {
    const week = dateRange('2026-09-01', '2026-09-07');
    expect(() => week.contains(datetimeRange(datetime('2026-09-07T09:00Z'), hours(8)))).toThrow(/mixedRange/);
    expect(() => week.overlaps(datetimeRange(datetime('2026-09-07T09:00Z'), hours(8)))).toThrow(/mixedRange/);
  });

  it('reads loosely, giving null for an end it cannot read, and takes a zone for the start', () => {
    expect(dateRange('garbage', '2026-09-07', { loose: true })).toBeNull();
    expect(dateRange('garbage/2026-09-07', { loose: true })).toBeNull();
    expect(dateRange('2026-09-01', '2026-09-07', { loose: true }).toString()).toBe('2026-09-01/2026-09-07');
    expect(datetimeRange('2026-09-07T09:00', '2h', { zone: 'Europe/Berlin' }).start.zone).toBe('Europe/Berlin');
    expect(datetimeRange('2026-09-07T09:00/2026-09-07T17:00', { zone: 'Europe/Berlin' }).end.zone).toBe(
      'Europe/Berlin',
    );
  });

  it('reads loose ends the way Date reads them, and takes a bare zone third', () => {
    expect(dateRange('Sep 1 2026', 'Sep 7 2026', { loose: true }).toString()).toBe('2026-09-01/2026-09-07');
    expect(() => dateRange('2026-09-01', '2026-09-07', { zone: 'Nowhere' })).toThrow(/unknownZone/);
    expect(dateRange(new Date('2026-09-06T23:30Z'), new Date('2026-09-07T23:30Z'), 'Tokyo').toString()).toBe(
      '2026-09-07/2026-09-08',
    );
  });

  it('splits an interval string outside its bracketed zones', () => {
    const bracketed = '2026-09-06T14:30[America/New_York]/2026-09-06T16:30[America/New_York]';
    expect(datetimeRange(bracketed).duration.total('hours')).toBe(2);
  });

  it('refuses a range that runs backwards and a copy across kinds', () => {
    expect(() => dateRange('2026-09-07', '2026-09-01')).toThrow(/backwards/);
    expect(() => new DateRange(timeRange('09:00', '17:00'))).toThrow(/mixedRange/);
    expect(() => dateRange('2026-09-01', '2026-09-07').points(days(0))).toThrow(/emptyStep/);
  });
});

describe('datetimeRange', () => {
  it('runs until its end, so back to back is not a conflict', () => {
    const booked = datetimeRange(datetime('2026-09-06T09:00Z'), hours(1));
    const requested = datetimeRange(datetime('2026-09-06T10:00Z'), hours(1));
    expect(booked.overlaps(requested)).toBe(false);
    expect(booked.contains('2026-09-06T10:00Z')).toBe(false);
    expect(booked.overlaps(datetimeRange(datetime('2026-09-06T09:30Z'), minutes(45)))).toBe(true);
    expect(booked.intersection(datetimeRange(datetime('2026-09-06T09:30Z'), minutes(45))).toString())
      .toBe('2026-09-06T09:30:00.000Z/2026-09-06T10:00:00.000Z');
  });

  it('reads a loose end in the start zone and walks by a length', () => {
    const shift = datetimeRange(datetime('2026-09-06T09:00', 'Asia/Tokyo'), '2026-09-06T17:00');
    expect(shift.end.zone).toBe('Asia/Tokyo');
    expect(shift.duration.total('hours')).toBe(8);
    expect(shift.points(hours(2)).length).toBe(4);
    expect(shift.split(hours(3)).map((slot) => slot.duration.total('hours'))).toEqual([3, 3, 2]);
  });

  it('is empty when the ends meet, and re-reads in another zone', () => {
    expect(datetimeRange(datetime('2026-09-06T09:00Z'), '2026-09-06T09:00Z').isEmpty()).toBe(true);
    expect(datetimeRange(datetime('2026-09-06T09:00Z'), hours(1)).in('Asia/Tokyo').start.hour).toBe(18);
  });

  it('formats as one phrase in the start zone', () => {
    expect(datetimeRange(datetime('2026-09-06T09:00Z'), hours(1)).format('time')).toMatch(/^9:00\s*[–-]\s*10:00 AM$/);
  });
});

describe('timeRange', () => {
  it('holds business hours and closes at the stroke of its end', () => {
    const open = timeRange(time('9am'), time('5:30pm'));
    expect(open.contains('12:00')).toBe(true);
    expect(open.contains('5:30pm')).toBe(false);
    expect(open.duration.format()).toBe('8 hours, 30 minutes');
    expect(open.split(minutes(30)).length).toBe(17);
    expect(timeRange('09:00/17:00').points(hours(4)).map(String)).toEqual(['09:00:00', '13:00:00']);
    expect(timeRange(time('9am'), minutes(90)).end.format('h:mm a')).toBe('10:30 am');
  });

  it('reads a clock end with am or pm as a time, and a length as a length', () => {
    expect(timeRange('9am', '5pm').end.toString()).toBe('17:00:00');
    expect(time('9am').to('5:30 pm').end.toString()).toBe('17:30:00');
    expect(timeRange('9am', '90m').end.toString()).toBe('10:30:00');
    expect(timeRange('09:00', { hours: 2 }).end.toString()).toBe('11:00:00');
    expect(timeRange('09:00', { hour: 17 }).end.toString()).toBe('17:00:00');
  });

  it('walks by the hour without wrapping past midnight', () => {
    expect(timeRange('00:00', '23:30').points('hour')).toHaveLength(24);
    expect(timeRange('09:00', '17:00').points('24h').map(String)).toEqual(['09:00:00']);
    expect(timeRange('00:00', '23:59').split('hour')).toHaveLength(24);
  });

  it('crosses midnight, so the night shift is one range', () => {
    const night = timeRange('22:00', '06:00');
    expect(night.duration.total('hours')).toBe(8);
    expect(night.contains('23:00')).toBe(true);
    expect(night.contains('01:00')).toBe(true);
    expect(night.contains('22:00')).toBe(true);
    expect(night.contains('06:00')).toBe(false);
    expect(night.contains('12:00')).toBe(false);
    expect(night.overlaps(timeRange('05:00', '09:00'))).toBe(true);
    expect(night.overlaps(timeRange('07:00', '21:00'))).toBe(false);
    expect(night.intersection(timeRange('05:00', '09:00')).toString()).toBe('05:00:00/06:00:00');
    expect(() => night.intersection(timeRange('05:00', '23:00'))).toThrow(/twoPieces/);
    expect(night.contains(timeRange('23:00', '02:00'))).toBe(true);
    expect(timeRange('09:00', '17:00').contains(night)).toBe(false);
    expect(night.points('hour').map(String)).toEqual([
      '22:00:00',
      '23:00:00',
      '00:00:00',
      '01:00:00',
      '02:00:00',
      '03:00:00',
      '04:00:00',
      '05:00:00',
    ]);
    expect(night.split(hours(4)).map(String)).toEqual(['22:00:00/02:00:00', '02:00:00/06:00:00']);
    expect(night.format()).toMatch(/10:00 PM.*6:00 AM/);
    expect(night.format()).not.toMatch(/1970/);
    expect(night.format(undefined, 'de-DE')).not.toMatch(/1970/);
    expect(timeRange(night.toString()).equals(night)).toBe(true);
  });

  it('reads its ends loosely, and refuses an unknown zone', () => {
    expect(timeRange('9 o clock', '5pm', { loose: true })).toBeNull();
    expect(() => timeRange('09:00', '17:00', { zone: 'Nowhere' })).toThrow(/unknownZone/);
  });

  it('walks by a count and a unit, the way plus and round are written', () => {
    const shift = timeRange('09:00', '17:00');
    expect(shift.points(30, 'minutes')).toHaveLength(16);
    expect(shift.split(30, 'minutes')).toHaveLength(16);
    expect(shift.points('30', 'minutes')).toHaveLength(16);
  });

  it('has no zone to place in', () => {
    expect(() => timeRange('09:00', '17:00').in('UTC')).toThrow(/noZone/);
  });
});

describe('range kinds', () => {
  it('name what they hold', () => {
    expect(dateRange('2026-09-01', '2026-09-07')).toBeInstanceOf(DateRange);
    expect(dateRange('2026-09-01', '2026-09-07')).not.toBeInstanceOf(TimeRange);
    expect(isDateRange(dateRange('2026-09-01', '2026-09-07'))).toBe(true);
    expect(isTimeRange(timeRange('09:00', '17:00'))).toBe(true);
    expect(timeRange('09:00', '17:00').kind).toBe('time');
    expect(() => timeRange('09:00', '17:00') < 5).toThrow(/notANumber/);
  });
});
