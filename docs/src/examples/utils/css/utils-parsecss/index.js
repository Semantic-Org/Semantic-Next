import { parseCSS } from '@semantic-ui/utils';

const css = `
  .card {
    padding: 1rem;
    &:hover { box-shadow: var(--floating-shadow); }
    @media (max-width: 600px) { padding: 0.5rem; }
  }
  @import url("theme.css") layer(theme);
`;

// nesting stays as written
console.log(parseCSS(css));

// flattened, nested rules become plain rules and the media block lifts out
console.log(parseCSS(css, { flatten: true }));

// a tree is plain data
const [card] = parseCSS(css);
console.log(card.selectors);
console.log(card.children.map((child) => child.type));
