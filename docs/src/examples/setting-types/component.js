import { createComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const settings = {
  age: 24,
  job: 'Sailor',
  birthday: {
    month: 'January',
    day: '1st',
  },
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
