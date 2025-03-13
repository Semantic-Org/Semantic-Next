import { defineComponent } from '@semantic-ui/component';

import css from './ReferenceModal.css?raw';
import template from './ReferenceModal.html?raw';

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

export const ReferenceModal = defineComponent({
  createComponent,
  template,
  css,
});
