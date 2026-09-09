import { parseHTML, stringifyHTML } from '@semantic-ui/utils';

const html = '<a class="link" href="/docs">Read the <em>docs</em></a>';

// what parseHTML reads, stringifyHTML writes back byte for byte
const nodes = parseHTML(html);
console.log(stringifyHTML(nodes) === html);

// change one attribute and everything else stays as written
const [link] = nodes;
link.attributes.find((attribute) => attribute.name === 'href').value = '/guide';
link.attributes.push({ name: 'target', value: '_blank', quote: '"' });
console.log(stringifyHTML(nodes));

// nodes are plain objects, so a fragment can be built by hand
console.log(stringifyHTML({
  type: 'element',
  name: 'ul',
  attributes: [],
  children: ['one', 'two'].map((item) => ({
    type: 'element',
    name: 'li',
    attributes: [],
    children: [{ type: 'text', value: item }],
  })),
}));

// a void element gets no close tag, a self-closing one is written with the slash
console.log(stringifyHTML(parseHTML('<hr><br/><my-icon name="home" />')));
