import { pathCovers } from '@semantic-ui/utils';

// b at or under a, aligned segment by segment
console.log(pathCovers('contact', 'contact.taxId'));
console.log(pathCovers('contact', 'contacts'));
console.log(pathCovers('lines', 'lines[#a1].amount'));

// direction matters, a parent covers a child and never the reverse
console.log(pathCovers('lines[#a1].amount', 'lines'));

// a wildcard covers any single segment
console.log(pathCovers('lines.*.cost', 'lines[#a1].cost'));
console.log(pathCovers('lines.*.cost', 'lines[#a1].fee'));

// keyed and positional stay apart, [#7] never means [7]
console.log(pathCovers('lines[#7]', 'lines[#7].cost'));
console.log(pathCovers('lines[#7]', 'lines.7.cost'));

// one relation answers a write guard
const editable = 'invoice.lines';
console.log(pathCovers(editable, 'invoice.lines[#a1].qty'));
console.log(pathCovers(editable, 'invoice.total'));
