import { timeline } from '@semantic-ui/utils';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/*
  jsdom carries a full User Timing L3 performance implementation: mark and
  measure both take an options bag, entries round-trip `detail` through a
  structured clone, and a measure against a mark that never fired throws a
  DOMException. So these assert against real entries rather than a spy.
*/

const entryDetail = (name) => performance.getEntriesByName(name)[0].detail;

// hold the clock long enough that a span cannot close in zero time
const burn = () => {
  const until = performance.now() + 1;
  while (performance.now() < until) { /* spin */ }
};

beforeEach(() => {
  performance.clearMarks();
  performance.clearMeasures();
});

afterEach(() => {
  performance.clearMarks();
  performance.clearMeasures();
});

describe('timeline.mark', () => {
  it('should emit a real performance mark', () => {
    timeline.mark('mark-plain');
    const marks = performance.getEntriesByName('mark-plain', 'mark');
    expect(marks).toHaveLength(1);
    expect(marks[0].entryType).toBe('mark');
    expect(marks[0].detail).toBeNull();
  });

  it('should carry a detail onto the entry', () => {
    timeline.mark('mark-detail', { detail: { rows: 12 } });
    expect(entryDetail('mark-detail')).toEqual({ rows: 12 });
  });

  it('should dress a devtools detail as a marker', () => {
    timeline.mark('mark-dressed', { detail: { track: 'Sync', color: 'primary' } });
    expect(entryDetail('mark-dressed')).toEqual({
      devtools: { dataType: 'marker', track: 'Sync', color: 'primary' },
    });
  });
});

describe('timeline.measure', () => {
  it('should emit a measure between two marks', () => {
    performance.mark('measure-from');
    burn();
    performance.mark('measure-to');
    timeline.measure('measure-pair', { from: 'measure-from', to: 'measure-to' });
    const measures = performance.getEntriesByName('measure-pair', 'measure');
    expect(measures).toHaveLength(1);
    expect(measures[0].entryType).toBe('measure');
    expect(measures[0].duration).toBeGreaterThan(0);
  });

  it('should measure from the time origin when from is omitted', () => {
    timeline.measure('measure-origin');
    const [measure] = performance.getEntriesByName('measure-origin');
    expect(measure.startTime).toBe(0);
    expect(measure.duration).toBeGreaterThan(0);
  });

  it('should emit nothing when an endpoint mark never fired', () => {
    expect(() => timeline.measure('measure-missing', { from: 'never-fired' })).not.toThrow();
    expect(performance.getEntriesByName('measure-missing')).toHaveLength(0);
  });

  it('should dress a devtools detail as a track entry', () => {
    timeline.measure('measure-dressed', { detail: { track: 'Sync' } });
    expect(entryDetail('measure-dressed')).toEqual({
      devtools: { dataType: 'track-entry', track: 'Sync' },
    });
  });
});

describe('timeline.span', () => {
  it('should emit a measure with a real duration when closed', () => {
    const close = timeline.span('span-basic');
    burn();
    close();
    const measures = performance.getEntriesByName('span-basic', 'measure');
    expect(measures).toHaveLength(1);
    expect(measures[0].entryType).toBe('measure');
    expect(measures[0].duration).toBeGreaterThan(0);
  });

  it('should emit nothing before it is closed', () => {
    timeline.span('span-open');
    expect(performance.getEntriesByName('span-open')).toHaveLength(0);
  });

  it('should close exactly once', () => {
    const close = timeline.span('span-idempotent');
    close();
    close();
    close();
    expect(performance.getEntriesByName('span-idempotent')).toHaveLength(1);
  });

  it('should take the detail from the open', () => {
    const close = timeline.span('span-open-detail', { detail: { rows: 3 } });
    close();
    expect(entryDetail('span-open-detail')).toEqual({ rows: 3 });
  });

  it('should let the close win over the open', () => {
    const close = timeline.span('span-close-detail', { detail: { rows: 3 } });
    close({ detail: { rows: 9 } });
    expect(entryDetail('span-close-detail')).toEqual({ rows: 9 });
  });

  it('should dress a devtools detail as a track entry', () => {
    const close = timeline.span('span-dressed');
    close({ detail: { track: 'Sync', trackGroup: 'Semantic' } });
    expect(entryDetail('span-dressed')).toEqual({
      devtools: { dataType: 'track-entry', track: 'Sync', trackGroup: 'Semantic' },
    });
  });
});

describe('timeline detail', () => {
  it('should evaluate a thunk inside the guard', () => {
    const build = vi.fn(() => ({ rows: 4 }));
    timeline.mark('detail-thunk', { detail: build });
    expect(build).toHaveBeenCalledTimes(1);
    expect(entryDetail('detail-thunk')).toEqual({ rows: 4 });
  });

  it('should swallow a throwing thunk', () => {
    expect(() =>
      timeline.mark('detail-throws', {
        detail: () => {
          throw new Error('boom');
        },
      })
    ).not.toThrow();
    expect(performance.getEntriesByName('detail-throws')).toHaveLength(0);
  });

  it('should swallow a throwing thunk on a span close', () => {
    const close = timeline.span('detail-throws-span');
    expect(() =>
      close({
        detail: () => {
          throw new Error('boom');
        },
      })
    ).not.toThrow();
    expect(performance.getEntriesByName('detail-throws-span')).toHaveLength(0);
  });

  it('should treat a falsy detail as absent', () => {
    timeline.mark('detail-zero', { detail: 0 });
    expect(entryDetail('detail-zero')).toBeNull();
  });

  it('should treat a thunk that resolves falsy as absent', () => {
    timeline.mark('detail-thunk-zero', { detail: () => 0 });
    expect(entryDetail('detail-thunk-zero')).toBeNull();
  });

  it('should pass an object with no devtools vocabulary through', () => {
    timeline.mark('detail-plain', { detail: { rows: 4, table: 'todos' } });
    expect(entryDetail('detail-plain')).toEqual({ rows: 4, table: 'todos' });
  });

  it('should pass a pre-built devtools envelope through', () => {
    const built = { devtools: { dataType: 'track-entry', track: 'Sync', color: 'primary' } };
    timeline.measure('detail-prebuilt', { detail: built });
    expect(entryDetail('detail-prebuilt')).toEqual(built);
  });

  it('should pass a non-object detail through', () => {
    timeline.mark('detail-string', { detail: 'todos' });
    expect(entryDetail('detail-string')).toBe('todos');
  });

  it('should dress from a single vocabulary key', () => {
    timeline.mark('detail-properties', { detail: { properties: [['rows', '4']] } });
    expect(entryDetail('detail-properties')).toEqual({
      devtools: { dataType: 'marker', properties: [['rows', '4']] },
    });
  });

  it('should keep a tooltip that survived the build', () => {
    timeline.measure('detail-tooltip', {
      detail: { track: 'Sync', tooltipText: 'rebased 3 writes' },
    });
    expect(entryDetail('detail-tooltip')).toEqual({
      devtools: { dataType: 'track-entry', track: 'Sync', tooltipText: 'rebased 3 writes' },
    });
  });

  it('should drop a tooltip that folded away', () => {
    timeline.measure('detail-folded-tooltip', {
      detail: { track: 'Sync', tooltipText: 0 },
    });
    const { devtools } = entryDetail('detail-folded-tooltip');
    expect(devtools).toEqual({ dataType: 'track-entry', track: 'Sync' });
    expect('tooltipText' in devtools).toBe(false);
  });

  it('should honor an explicit dataType over the default', () => {
    timeline.measure('detail-datatype', { detail: { dataType: 'marker', track: 'Sync' } });
    expect(entryDetail('detail-datatype')).toEqual({
      devtools: { dataType: 'marker', track: 'Sync' },
    });
  });
});
