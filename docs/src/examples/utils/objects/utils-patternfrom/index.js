import { pathCovers, patternFrom } from '@semantic-ui/utils';

// every element address collapses to the wildcard, fields stay
console.log(patternFrom('lines[#jack@semantic-ui.com].tax'));
console.log(patternFrom('lines.2.tax'));
console.log(patternFrom('invoice.total'));

// so per element writes group under one dependency pattern
const written = ['lines[#a1].tax', 'lines[#a2].tax', 'lines[#a1].qty'];
console.log([...new Set(written.map(patternFrom))]);

// the pattern still covers the concrete path it came from
const path = 'lines[#a1].tax';
console.log(pathCovers(patternFrom(path), path));
