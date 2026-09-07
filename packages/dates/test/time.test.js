import { configure, datetime, hours, minutes, time } from '@semantic-ui/dates';

import { beforeEach, describe, expect, it } from 'vitest';

beforeEach(() => {
  configure({ zone: 'UTC', locale: 'en-US' });
});

describe('time', () => {
  it('reads clock strings in every spelling, numbers, fields and a datetime', () => {
    expect(time('09:00').toString()).toBe('09:00:00');
    expect(time('9am').toString()).toBe('09:00:00');
    expect(time('5:30 pm').toString()).toBe('17:30:00');
    expect(time('12am').toString()).toBe('00:00:00');
    expect(time('12pm').toString()).toBe('12:00:00');
    expect(time('17:30:15.250').millisecond).toBe(250);
    expect(time(9, 30).toString()).toBe('09:30:00');
    expect(time({ hours: 17 }).toString()).toBe('17:00:00');
    expect(time(datetime('2026-09-06T14:30Z')).toString()).toBe('14:30:00');
    expect(time(new Date('2026-09-06T14:30:00Z'), { zone: 'Asia/Tokyo' }).toString()).toBe('23:30:00');
  });

  it('keeps the clock a loose string names whatever zone is configured, and takes a bare zone', () => {
    configure({ zone: 'America/Los_Angeles' });
    expect(time('September 6, 2026 5:30 PM', { loose: true }).toString()).toBe('17:30:00');
    expect(time(new Date('2026-09-06T23:30Z'), 'Tokyo').toString()).toBe('08:30:00');
    expect(() => time('09:00').set('minute', 75)).toThrow(/cannotSet/);
    expect(() => time(9.5)).toThrow(/unreadableTime/);
    expect(() => time('09:00').set('hour', 9.5)).toThrow(/cannotSet/);
  });

  it('refuses a clock it cannot read, and reads a datetime through the loose door', () => {
    expect(() => time('13pm')).toThrow(/unreadableTime/);
    expect(() => time('25:00')).toThrow(/unreadableTime/);
    expect(time('2026-09-06T14:30Z', { loose: true, zone: 'Asia/Tokyo' }).toString()).toBe('23:30:00');
    expect(time('nope', { loose: true })).toBeNull();
    expect(() => time()).toThrow(/notATime/);
  });

  it('reads a fraction of a second behind a single-digit hour', () => {
    expect(time('9:00:00.5').toString()).toBe('09:00:00.500');
    expect(time('9:00:00.250').millisecond).toBe(250);
    expect(time('9:00:00.000000001').nanosecond).toBe(1);
  });

  it('prints a fraction in groups of three, one width per precision', () => {
    expect(time('17:30').toJSON()).toBe('17:30:00');
    expect(time('17:30:15.250').toJSON()).toBe('17:30:15.250');
    expect(time('17:30:15.25').toJSON()).toBe('17:30:15.250');
    expect(time('17:30:15.000250').toJSON()).toBe('17:30:15.000250');
  });

  it('wraps like a clock face', () => {
    expect(time('23:00').plus(hours(2)).toString()).toBe('01:00:00');
    expect(time('00:30').minus(minutes(45)).toString()).toBe('23:45:00');
  });

  it('rounds and compares within the day', () => {
    expect(time('14:37').round(30, 'minutes').toString()).toBe('14:30:00');
    expect(time('14:37').ceil('hour').toString()).toBe('15:00:00');
    expect(time('9am').isBefore('5pm')).toBe(true);
    expect(time('9am').isSame('09:59', 'hour')).toBe(true);
    expect(time('22:00').until('02:00', 'hours')).toBe(-20);
    expect(time('17:00').since('9am').toString()).toBe('PT8H');
  });

  it('formats with presets and tokens', () => {
    expect(time('17:30').format()).toBe('5:30 PM');
    expect(time('17:30').format('HH:mm')).toBe('17:30');
    expect(time('17:30').format('h:mm a')).toBe('5:30 pm');
    expect(time('17:30').format('medium')).toBe('5:30:00 PM');
  });

  it('combines with a day and a zone into a moment, the mirror of date.at()', () => {
    expect(time('5:30pm').on('2026-09-06', 'UTC').toString()).toBe('2026-09-06T17:30:00.000Z');
  });

  it('is not a number, and serializes to its ISO clock', () => {
    expect(() => time('9am') < time('5pm')).toThrow(/notANumber/);
    expect(JSON.stringify({ opens: time('9am') })).toBe('{"opens":"09:00:00"}');
    expect(time(JSON.parse(JSON.stringify(time('9am')))).equals('9am')).toBe(true);
  });
});
