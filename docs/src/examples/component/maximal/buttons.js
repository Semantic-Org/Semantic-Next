import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./buttons.html');

const events = {
  'click .decrease'({findParent}) {
    const parent = findParent('numberAdjust');
    parent.decrease();
  },
  'click .increase'({findParent}) {
    const parent = findParent('numberAdjust');
    parent.increase();
  },
};

export const buttons = defineComponent({
  template,
  events
});
