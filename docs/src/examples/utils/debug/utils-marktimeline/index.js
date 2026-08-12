import { isDevelopment, markTimeline } from '@semantic-ui/utils';

// a mark is a point on the performance timeline
markTimeline('parse:start');
const rows = Array.from({ length: 20000 }, (_, index) => ({ id: index, total: index * 2 }));
markTimeline('parse:end');

const [start] = performance.getEntriesByName('parse:start');
console.log(start.entryType, start.name);

// devtools dressing composes into the { devtools } envelope for you. the
// structural keys are cheap enough for every build, tooltipText is prose, so it
// rides a development ternary and folds out of production
markTimeline('rows:built', {
  detail: {
    track: 'Semantic UI',
    color: 'primary',
    properties: [['rows', rows.length]],
    tooltipText: isDevelopment ? 'row fixtures ready before first paint' : 0,
  },
});
console.log(performance.getEntriesByName('rows:built')[0].detail);
