import { parseHTML } from '@semantic-ui/utils';

const html = `<article class="post" data-id=42>
  <h2>Hello <em>world</em></h2>
  <!-- a comment -->
  <img src="hero.png" alt="">
  <script>if (a < b) { go(); }</script>
</article>`;

// a tree of plain nodes, everything as written
const [article] = parseHTML(html);
console.log(article.name, article.attributes);

// children in source order, filter by type
console.log(article.children.filter((node) => node.type === 'element').map((node) => node.name));

// a raw text element holds its content as one text child, nothing inside it is a tag
const script = article.children.find((node) => node.name === 'script');
console.log(script.children);

// spans point back into the source, so a node can be sliced out exactly as written
const heading = article.children.find((node) => node.name === 'h2');
console.log(html.slice(heading.start, heading.end));
console.log(html.slice(heading.innerStart, heading.innerEnd));

// a self-closing tag on a custom element closes it, as its author meant
console.log(parseHTML('<my-icon name="home"/><p>after</p>').map((node) => node.name));

// or reads as a browser does, an open tag whose content follows
console.log(parseHTML('<my-icon name="home"/><p>after</p>', { closeOnSlash: false }).map((node) => node.name));
