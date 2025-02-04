import { defineComponent } from '@semantic-ui/component';

import template from './HintModal.html?raw';
import css from './HintModal.css?raw';

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
