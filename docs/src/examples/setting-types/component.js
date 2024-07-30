import { createComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const settings = {

  // attribute or prop
  age: 24,

  // attribute or prop
  job: 'Sailor',

  // serialized attribute or prop
  birthday: { month: 'January', day: '1st' },

  // attribute
  married: true,

  // serialized attribute or prop
  siblings: ['John', 'James'],

  // prop only
  getName: () => 'Jill',
};

createComponent({
  tagName: 'user-profile',
  template,
  css,
  settings,
});
