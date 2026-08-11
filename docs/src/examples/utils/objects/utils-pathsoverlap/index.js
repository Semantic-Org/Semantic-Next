import { pathsOverlap } from '@semantic-ui/utils';

// one line, read either direction
console.log(pathsOverlap('lines', 'lines[#a1].amount'));
console.log(pathsOverlap('lines[#a1].amount', 'lines'));

// siblings never meet, and a prefix of the text is not a prefix of the path
console.log(pathsOverlap('lines[#a1].amount', 'lines[#a2].amount'));
console.log(pathsOverlap('lines', 'linesLog'));

// the subscription question: did this write touch what I am watching
const watching = 'invoice.lines[#a1]';
for (const written of ['invoice.lines', 'invoice.lines[#a1].qty', 'invoice.lines[#a2].qty']) {
  console.log(written, pathsOverlap(watching, written));
}
