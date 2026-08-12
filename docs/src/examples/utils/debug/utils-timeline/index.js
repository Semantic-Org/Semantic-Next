import { isDevelopment, markTimeline, measureTimeline } from '@semantic-ui/utils';

// a mark is a point on the timeline
markTimeline('parse:start');
const rows = Array.from({ length: 20000 }, (_, index) => ({ id: index, total: index * 2 }));
markTimeline('parse:end');

// with `to`, a measure records immediately between two endpoints, and reads
// back off the performance timeline
measureTimeline('parse', { from: 'parse:start', to: 'parse:end' });
const [parse] = performance.getEntriesByName('parse');
console.log(parse.entryType, `${parse.duration.toFixed(2)}ms`);

// devtools dressing composes into the { devtools } envelope for you. the
// structural keys are cheap enough for every build, tooltipText is prose, so it
// rides a development ternary and folds out of production. to: 'now' is the
// reserved endpoint for this instant
markTimeline('total:start');
const total = rows.reduce((sum, row) => sum + row.total, 0);

measureTimeline('total', {
  from: 'total:start',
  to: 'now',
  detail: {
    track: 'Semantic UI',
    color: 'primary',
    properties: [['rows', rows.length], ['total', total]],
    tooltipText: isDevelopment ? 'summing every row before first paint' : 0,
  },
});
console.log(performance.getEntriesByName('total')[0].detail);

// without `to`, the measure captures its own start and returns the closer, so
// there is no end mark to mistype and no way to silently drop the measurement
const done = measureTimeline('format');
const labels = rows.map((row) => `${row.id}: ${row.total}`);
done();

const [format] = performance.getEntriesByName('format');
console.log(labels.length, `${format.duration.toFixed(2)}ms`);

// the closer is idempotent, so a retry path can close a measure twice
done();
console.log(performance.getEntriesByName('format').length);
