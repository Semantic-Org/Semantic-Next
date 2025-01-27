import { defineComponent } from '@semantic-ui/component';

import template from './HintModal.html?raw';
import css from './HintModal.css?raw';

const createComponent = ({ $ }) => {
  return {
    show() {
      $('ui-modal').getComponent().show();
    },
    hide() {
      $('ui-modal').getComponent().hide();
    },
  };
};

export const HintModal = defineComponent({
  createComponent,
  template,
  css,
});
