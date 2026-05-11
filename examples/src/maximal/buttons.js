import { defineComponent } from '@semantic-ui/component';

import template from './buttons.html?raw';
const events = {
  'click .decrease'({ findParent }) {
    const parent = findParent('numberAdjust');
    parent.decrease();
  },
  'click .increase'({ findParent }) {
    const parent = findParent('numberAdjust');
    parent.increase();
  },
};

export const buttons = defineComponent({
  template,
  events,
});
