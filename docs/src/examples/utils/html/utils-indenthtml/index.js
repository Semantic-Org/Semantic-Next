import { indentHTML } from '@semantic-ui/utils';

// basic usage
const simple = '<div>\n<p>Content</p>\n</div>';
console.log(indentHTML(simple));

// nested structures
const button = `<ui-button animated>
<span slot="visible">Hover Me</span>
<span slot="hidden">Hidden</span>
</ui-button>`;

console.log(indentHTML(button));

// custom indentation with tabs
const withTabs = '<div>\n<p>Content</p>\n</div>';
console.log(indentHTML(withTabs, { indent: '\t' }));

// starting at nesting level
const atLevel = '<div>\n<p>Content</p>\n</div>';
console.log(indentHTML(atLevel, { startLevel: 1 }));

// handles void elements
const voidElements = '<div>\n<img src="test.jpg">\n<br>\n<input type="text">\n</div>';
console.log(indentHTML(voidElements));
