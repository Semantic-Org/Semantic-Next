import { createComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

// These are default settings some are overidden in index.html/js
const settings = {
  age: 24,
  job: 'Sailor',
  birthday: { month: 'January', day: 1 },
  married: true,
  siblings: ['John', 'James'],
  getName: () => 'Jill',
};

createComponent({
  tagName: 'user-profile',
  template,
  css,
  settings,
});
