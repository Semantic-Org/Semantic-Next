import { defineComponent } from '@semantic-ui/component';

import css from './component.css?raw';
import template from './component.html?raw';
// These are default settings some are overidden in index.html/js
const defaultSettings = {
  age: 24,
  job: 'Sailor',
  birthday: { month: 'January', day: 1 },
  married: true,
  siblings: ['John', 'James'],
  getName: () => 'Jill',
};

export const UserProfile = defineComponent({
  tagName: 'user-profile',
  template,
  css,
  defaultSettings,
});
