import { pathCovers, wildcardPath } from '@semantic-ui/utils';

// every element address collapses to the wildcard, fields stay
console.log(wildcardPath('lines[#jack@semantic-ui.com].tax'));
console.log(wildcardPath('lines.2.tax'));
console.log(wildcardPath('invoice.total'));

// so per element writes group under one wildcard spelling
const written = ['lines[#a1].tax', 'lines[#a2].tax', 'lines[#a1].qty'];
console.log([...new Set(written.map(wildcardPath))]);

// the wildcard path still covers the concrete path it came from
const path = 'lines[#a1].tax';
console.log(pathCovers(wildcardPath(path), path));
