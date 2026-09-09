import { parseCSS, stringifyCSS } from '@semantic-ui/utils';

const nodes = parseCSS('.button{color:var(--primary);&:hover{opacity:.8}}');

// one canonical layout, whatever the source looked like
console.log(stringifyCSS(nodes));

// edit the tree and write it back
nodes[0].selectors = ['.ui.button'];
nodes[0].children.push({ type: 'declaration', property: 'cursor', value: 'pointer', important: false });
console.log(stringifyCSS(nodes));

// with tabs
console.log(stringifyCSS(nodes, { indent: '\t' }));
