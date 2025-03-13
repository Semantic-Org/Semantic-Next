import { defineComponent } from '@semantic-ui/component';

import css from './HintModal.css?raw';
import template from './HintModal.html?raw';

const createComponent = ({ $ }) => {
  return {
    show() {
      $('ui-modal').component().show();
    },
    hide() {
      $('ui-modal').component().hide();
    },
  };
};

export const HintModal = defineComponent({
  createComponent,
  template,
  css,
});
