import { defineComponent, getText } from '@semantic-ui/component';

// poem ships css with white-space: pre-line, triggering the preserveWhitespace auto heuristic
import './poem.js';

const css = await getText('./component.css');
const template = await getText('./component.html');

const createComponent = () => ({
  first: 'Ada',
  last: 'Lovelace',
  boxClass: 'blue',
  fieldClass: 'note field',
  letters: ['d', 'e', 'f'],
});

defineComponent({
  tagName: 'whitespace-cases',
  template,
  css,
  createComponent,
});
