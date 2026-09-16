import { CalendarDate, DateRange, DateTime, DateTimeRange, Duration, Time, TimeRange } from '@semantic-ui/dates';

import { describe, expect, it } from 'vitest';

// this file imports the bare entry alone, so the module graph never loads the subpath
describe('the bare entry', () => {
  it('has no value protocol on any class', () => {
    const VALUE = Symbol.for('semantic-ui/value');
    for (const Kind of [DateTime, CalendarDate, Time, Duration, DateRange, DateTimeRange, TimeRange]) {
      expect(Kind[VALUE]).toBeUndefined();
    }
  });
});
