import { isDevelopment, timeline } from '@semantic-ui/utils';

// a mark is a point on the timeline
timeline.mark('parse:start');
const rows = Array.from({ length: 20000 }, (_, index) => ({ id: index, total: index * 2 }));
timeline.mark('parse:end');

// a measure spans two marks, and reads back off the performance timeline
timeline.measure('parse', { from: 'parse:start', to: 'parse:end' });
const [parse] = performance.getEntriesByName('parse');
console.log(parse.entryType, `${parse.duration.toFixed(2)}ms`);

// devtools dressing composes into the { devtools } envelope for you. the
// structural keys are cheap enough for every build, tooltipText is prose, so it
// rides a development ternary and folds out of production
timeline.mark('total:start');
const total = rows.reduce((sum, row) => sum + row.total, 0);
timeline.mark('total:end');

timeline.measure('total', {
  from: 'total:start',
  to: 'total:end',
  detail: {
    track: 'Semantic UI',
    color: 'primary',
    properties: [['rows', rows.length], ['total', total]],
    tooltipText: isDevelopment ? 'summing every row before first paint' : 0,
  },
});
console.log(performance.getEntriesByName('total')[0].detail);

// a span captures its own start and returns the closer, so a mark name that
// never fires cannot silently no-op the measurement
const done = timeline.span('format');
const labels = rows.map((row) => `${row.id}: ${row.total}`);
done();

const [format] = performance.getEntriesByName('format');
console.log(labels.length, `${format.duration.toFixed(2)}ms`);

// the closer is idempotent, so a retry path can close a span twice
done();
console.log(performance.getEntriesByName('format').length);
