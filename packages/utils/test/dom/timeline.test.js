import { markTimeline, measureTimeline } from '@semantic-ui/utils';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/*
  jsdom carries a full User Timing L3 performance implementation: mark and
  measure both take an options bag, entries round-trip `detail` through a
  structured clone, and a measure against a mark that never fired throws a
  DOMException. So these assert against real entries rather than a spy.
*/

const entryDetail = (name) => performance.getEntriesByName(name)[0].detail;

// hold the clock long enough that a measure cannot close in zero time
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

describe('markTimeline', () => {
  it('should emit a real performance mark', () => {
    markTimeline('mark-plain');
    const marks = performance.getEntriesByName('mark-plain', 'mark');
    expect(marks).toHaveLength(1);
    expect(marks[0].entryType).toBe('mark');
    expect(marks[0].detail).toBeNull();
  });

  it('should carry a detail onto the entry', () => {
    markTimeline('mark-detail', { detail: { rows: 12 } });
    expect(entryDetail('mark-detail')).toEqual({ rows: 12 });
  });

  it('should dress a devtools detail as a marker', () => {
    markTimeline('mark-dressed', { detail: { track: 'Sync', color: 'primary' } });
    expect(entryDetail('mark-dressed')).toEqual({
      devtools: { dataType: 'marker', track: 'Sync', color: 'primary' },
    });
  });
});

describe('measureTimeline with to', () => {
  it('should emit a measure between two marks', () => {
    performance.mark('measure-from');
    burn();
    performance.mark('measure-to');
    measureTimeline('measure-pair', { from: 'measure-from', to: 'measure-to' });
    const measures = performance.getEntriesByName('measure-pair', 'measure');
    expect(measures).toHaveLength(1);
    expect(measures[0].entryType).toBe('measure');
    expect(measures[0].duration).toBeGreaterThan(0);
  });

  it('should resolve to: now as this instant', () => {
    performance.mark('measure-now-from');
    burn();
    measureTimeline('measure-now', { from: 'measure-now-from', to: 'now' });
    const [measure] = performance.getEntriesByName('measure-now', 'measure');
    expect(measure.duration).toBeGreaterThan(0);
  });

  it('should default from to the call instant', () => {
    measureTimeline('measure-from-default', { to: 'now' });
    const [measure] = performance.getEntriesByName('measure-from-default');
    // the call instant, not the time origin
    expect(measure.startTime).toBeGreaterThan(0);
  });

  it('should honor an explicit from: 0 as the time origin', () => {
    // the default is nullish, not falsy — `from: 0` is the deliberate spelling
    // for a measure from the time origin (page navigation), and a `??`-to-`||`
    // "simplification" would silently clobber it
    measureTimeline('measure-from-origin', { to: 'now', from: 0 });
    const [measure] = performance.getEntriesByName('measure-from-origin');
    expect(measure.startTime).toBe(0);
  });

  it('should emit nothing when an endpoint mark never fired', () => {
    expect(() => measureTimeline('measure-missing', { from: 'never-fired', to: 'now' })).not.toThrow();
    expect(performance.getEntriesByName('measure-missing')).toHaveLength(0);
  });

  it('should dress a devtools detail as a track entry', () => {
    measureTimeline('measure-dressed', { to: 'now', detail: { track: 'Sync' } });
    expect(entryDetail('measure-dressed')).toEqual({
      devtools: { dataType: 'track-entry', track: 'Sync' },
    });
  });
});

describe('measureTimeline closer', () => {
  it('should emit a measure with a real duration when closed', () => {
    const done = measureTimeline('closer-basic');
    burn();
    done();
    const measures = performance.getEntriesByName('closer-basic', 'measure');
    expect(measures).toHaveLength(1);
    expect(measures[0].entryType).toBe('measure');
    expect(measures[0].duration).toBeGreaterThan(0);
  });

  it('should emit nothing before it is closed', () => {
    measureTimeline('closer-open');
    expect(performance.getEntriesByName('closer-open')).toHaveLength(0);
  });

  it('should close exactly once', () => {
    const done = measureTimeline('closer-idempotent');
    done();
    done();
    done();
    expect(performance.getEntriesByName('closer-idempotent')).toHaveLength(1);
  });

  it('should resolve a named from at done-time', () => {
    const done = measureTimeline('closer-late-mark', { from: 'late-mark' });
    burn();
    performance.mark('late-mark');
    burn();
    done();
    const [measure] = performance.getEntriesByName('closer-late-mark', 'measure');
    const [mark] = performance.getEntriesByName('late-mark', 'mark');
    expect(measure.startTime).toBe(mark.startTime);
    expect(measure.duration).toBeGreaterThan(0);
  });

  it('should emit nothing when a named from never fires', () => {
    const done = measureTimeline('closer-missing-from', { from: 'never-fired' });
    expect(() => done()).not.toThrow();
    expect(performance.getEntriesByName('closer-missing-from')).toHaveLength(0);
  });

  it('should take the detail from the open', () => {
    const done = measureTimeline('closer-open-detail', { detail: { rows: 3 } });
    done();
    expect(entryDetail('closer-open-detail')).toEqual({ rows: 3 });
  });

  it('should let the close win over the open', () => {
    const done = measureTimeline('closer-close-detail', { detail: { rows: 3 } });
    done({ detail: { rows: 9 } });
    expect(entryDetail('closer-close-detail')).toEqual({ rows: 9 });
  });

  it('should dress a devtools detail as a track entry', () => {
    const done = measureTimeline('closer-dressed');
    done({ detail: { track: 'Sync', trackGroup: 'Semantic' } });
    expect(entryDetail('closer-dressed')).toEqual({
      devtools: { dataType: 'track-entry', track: 'Sync', trackGroup: 'Semantic' },
    });
  });
});

describe('timeline detail', () => {
  it('should evaluate a thunk inside the guard', () => {
    const build = vi.fn(() => ({ rows: 4 }));
    markTimeline('detail-thunk', { detail: build });
    expect(build).toHaveBeenCalledTimes(1);
    expect(entryDetail('detail-thunk')).toEqual({ rows: 4 });
  });

  it('should evaluate an open thunk at record-time, not call-time', () => {
    let rows = 0;
    const done = measureTimeline('detail-late-thunk', { detail: () => ({ rows }) });
    rows = 7;
    done();
    expect(entryDetail('detail-late-thunk')).toEqual({ rows: 7 });
  });

  it('should swallow a throwing thunk', () => {
    expect(() =>
      markTimeline('detail-throws', {
        detail: () => {
          throw new Error('boom');
        },
      })
    ).not.toThrow();
    expect(performance.getEntriesByName('detail-throws')).toHaveLength(0);
  });

  it('should swallow a throwing thunk on a close', () => {
    const done = measureTimeline('detail-throws-close');
    expect(() =>
      done({
        detail: () => {
          throw new Error('boom');
        },
      })
    ).not.toThrow();
    expect(performance.getEntriesByName('detail-throws-close')).toHaveLength(0);
  });

  it('should treat a falsy detail as absent', () => {
    markTimeline('detail-zero', { detail: 0 });
    expect(entryDetail('detail-zero')).toBeNull();
  });

  it('should treat a thunk that resolves falsy as absent', () => {
    markTimeline('detail-thunk-zero', { detail: () => 0 });
    expect(entryDetail('detail-thunk-zero')).toBeNull();
  });

  it('should pass an object with no devtools vocabulary through', () => {
    markTimeline('detail-plain', { detail: { rows: 4, table: 'todos' } });
    expect(entryDetail('detail-plain')).toEqual({ rows: 4, table: 'todos' });
  });

  it('should pass a pre-built devtools envelope through', () => {
    const built = { devtools: { dataType: 'track-entry', track: 'Sync', color: 'primary' } };
    measureTimeline('detail-prebuilt', { to: 'now', detail: built });
    expect(entryDetail('detail-prebuilt')).toEqual(built);
  });

  it('should pass a non-object detail through', () => {
    markTimeline('detail-string', { detail: 'todos' });
    expect(entryDetail('detail-string')).toBe('todos');
  });

  it('should dress from a single vocabulary key', () => {
    markTimeline('detail-properties', { detail: { properties: [['rows', '4']] } });
    expect(entryDetail('detail-properties')).toEqual({
      devtools: { dataType: 'marker', properties: [['rows', '4']] },
    });
  });

  it('should keep a tooltip that survived the build', () => {
    measureTimeline('detail-tooltip', {
      to: 'now',
      detail: { track: 'Sync', tooltipText: 'rebased 3 writes' },
    });
    expect(entryDetail('detail-tooltip')).toEqual({
      devtools: { dataType: 'track-entry', track: 'Sync', tooltipText: 'rebased 3 writes' },
    });
  });

  it('should drop a tooltip that folded away', () => {
    measureTimeline('detail-folded-tooltip', {
      to: 'now',
      detail: { track: 'Sync', tooltipText: 0 },
    });
    const { devtools } = entryDetail('detail-folded-tooltip');
    expect(devtools).toEqual({ dataType: 'track-entry', track: 'Sync' });
    expect('tooltipText' in devtools).toBe(false);
  });

  it('should honor an explicit dataType over the default', () => {
    measureTimeline('detail-datatype', { to: 'now', detail: { dataType: 'marker', track: 'Sync' } });
    expect(entryDetail('detail-datatype')).toEqual({
      devtools: { dataType: 'marker', track: 'Sync' },
    });
  });
});
