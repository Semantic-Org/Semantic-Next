import { defineComponent } from '@semantic-ui/component';

import template from './ReferenceModal.html?raw';
import css from './ReferenceModal.css?raw';

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
