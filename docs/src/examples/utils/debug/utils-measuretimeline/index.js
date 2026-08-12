import { isDevelopment, measureTimeline } from '@semantic-ui/utils';

// with `to`, a measure records immediately between two endpoints, and reads
// back off the performance timeline
performance.mark('parse:start');
const rows = Array.from({ length: 20000 }, (_, index) => ({ id: index, total: index * 2 }));
performance.mark('parse:end');

measureTimeline('parse', { from: 'parse:start', to: 'parse:end' });
const [parse] = performance.getEntriesByName('parse');
console.log(parse.entryType, `${parse.duration.toFixed(2)}ms`);

// to: 'now' is the reserved endpoint for this instant, and devtools dressing
// composes into the { devtools } envelope — structural keys in every build,
// prose tooltipText behind a development ternary
const total = rows.reduce((sum, row) => sum + row.total, 0);

measureTimeline('total', {
  from: 'parse:start',
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
