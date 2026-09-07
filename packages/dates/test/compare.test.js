import {
  compare,
  configure,
  date,
  dateRange,
  datetime,
  earliest,
  hours,
  kindOf,
  latest,
  time,
  timeRange,
} from '@semantic-ui/dates';

import { beforeEach, describe, expect, it } from 'vitest';

beforeEach(() => {
  configure({ zone: 'UTC', locale: 'en-US' });
});

describe('compare', () => {
  it('sorts dates, datetimes and times, reading raw values as the first kind', () => {
    expect(['2026-03-01', '2026-01-01', '2026-02-01'].map(date).sort(compare).map(String)).toEqual([
      '2026-01-01',
      '2026-02-01',
      '2026-03-01',
    ]);
    expect(compare(datetime('2026-09-06T14:30Z'), '2026-09-06T14:30:00Z')).toBe(0);
    expect(compare(time('5pm'), '9am')).toBe(1);
    expect(compare(hours(1), '90m')).toBe(-1);
  });

  it('sorts ranges of one kind by start, then by end', () => {
    const q1 = dateRange('2026-01-01', '2026-03-31');
    const january = dateRange('2026-01-01', '2026-01-31');
    const q2 = dateRange('2026-04-01', '2026-06-30');
    expect([q2, q1, january].sort(compare)).toEqual([january, q1, q2]);
    expect(() => compare(q1, timeRange('09:00', '17:00'))).toThrow(/mixedKinds/);
  });

  it("reads a raw value beside a point as the point's kind", () => {
    const moment = datetime('2026-09-06T12:00Z');
    expect(compare(moment, '2026-09-07')).toBe(-1);
    expect(earliest(moment, '2026-09-07')).toBe(moment);
    expect(compare(date('2026-09-06'), '2026-09-07')).toBe(-1);
  });

  it('refuses to compare across kinds', () => {
    expect(() => compare(date('2026-09-06'), datetime('2026-09-06T14:30Z'))).toThrow(/mixedKinds/);
  });

  it('picks the earliest and latest of several points, spread or in an array', () => {
    expect(earliest('2026-09-06', '2026-01-01', '2027-01-01').toString()).toBe('2026-01-01');
    expect(latest([datetime('2026-09-06T14:30Z'), datetime('2026-09-07T14:30Z')]).toString()).toBe(
      '2026-09-07T14:30:00.000Z',
    );
    expect(latest(time('9am'), time('5pm')).toString()).toBe('17:00:00');
  });

  it('refuses to pick from nothing, with a code', () => {
    expect(() => earliest([])).toThrow(/noPoints/);
    expect(() => latest()).toThrow(/noPoints/);
  });

  it('names the kind of any value', () => {
    expect(kindOf(datetime('2026-09-06T14:30Z'))).toBe('datetime');
    expect(kindOf(date('2026-09-06'))).toBe('date');
    expect(kindOf(time('9am'))).toBe('time');
    expect(kindOf(hours(1))).toBe('duration');
    expect(kindOf(timeRange('09:00', '17:00'))).toBe('timeRange');
    expect(kindOf('2026-09-06')).toBeUndefined();
  });
});
