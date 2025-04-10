import { defineComponent } from '@semantic-ui/component';
import { noop } from '@semantic-ui/utils';

import componentSpec from './spec/modal-component.json' assert { type: 'json' };
import template from './modal.html?raw' assert { type: 'txt' };
import css from './modal-bundle.css?raw' assert { type: 'css' };

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

const onCreated = ({}) => {
};

const onRendered = function({}) {
};

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

const UIModal = defineComponent({
  tagName: 'ui-modal',
  componentSpec,
  template,
  css,
  createComponent,
  events,
  onCreated,
  onRendered,
});

export { UIModal };
