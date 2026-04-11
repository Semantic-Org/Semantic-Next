import { defineComponent } from '@semantic-ui/component';
import { noop } from '@semantic-ui/utils';

import css from './modal-bundle.css?raw';
import template from './modal.html?raw';
import componentSpec from './specs/modal.component.js';

const createComponent = ({ $, dispatchEvent }) => ({
  show(callback = noop) {
    if (callback() !== false) {
      $('dialog').get(0).showModal();
    }
    dispatchEvent('show');
  },
  hide(callback = noop) {
    if (callback() !== false) {
      $('dialog').get(0).close();
    }
    dispatchEvent('hide');
  },
});

const events = {
  'click ui-icon.close'({ event, self }) {
    self.hide();
  },
  'click dialog'({ $, event, settings, self }) {
    if (settings.closeable && $(event.target).is('dialog')) {
      self.hide();
    }
  },
};

const Modal = defineComponent({
  tagName: 'ui-modal',
  componentSpec,
  template,
  css,
  createComponent,
  events,
});

export { Modal };
