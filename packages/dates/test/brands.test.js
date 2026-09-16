import {
  date,
  dateRange,
  datetime,
  duration,
  IS_CALENDAR_DATE,
  IS_DATE_TIME,
  IS_DURATION,
  IS_RANGE,
  IS_TEMPORAL,
  IS_TIME,
  time,
  timeRange,
} from '@semantic-ui/dates';

import { describe, expect, it } from 'vitest';

describe('the brands', () => {
  it('mark every kind under the one family key beside its own, and never a Date', () => {
    expect(IS_TEMPORAL).toBe(Symbol.for('semantic-ui/Temporal'));
    const values = [
      datetime(0),
      date('2026-09-06'),
      time('09:00'),
      duration('PT1H'),
      dateRange('2026-09-01', '2026-09-07'),
      datetime(0).to(datetime(1)),
      timeRange('09:00', '17:00'),
    ];
    for (const value of values) {
      expect(value[IS_TEMPORAL]).toBe(true);
    }
    expect(
      datetime(0)[IS_DATE_TIME] && date('2026-09-06')[IS_CALENDAR_DATE] && time('09:00')[IS_TIME]
        && duration('PT1H')[IS_DURATION],
    ).toBe(true);
    expect(timeRange('09:00', '17:00')[IS_RANGE]).toBe(true);
    expect(new Date()[IS_TEMPORAL]).toBeUndefined();
    expect({}[IS_TEMPORAL]).toBeUndefined();
  });
});
