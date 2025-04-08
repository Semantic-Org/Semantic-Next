import { defineComponent } from '@semantic-ui/component';
import { ModalComponentSpec } from '@semantic-ui/specs';
import { noop } from '@semantic-ui/utils';

import CSS from './modal-bundle.css?raw';
import Template from './modal.html?raw';

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
  componentSpec: ModalComponentSpec,
  template: Template,
  css: CSS,
  createComponent,
  events,
  onCreated,
  onRendered,
});

export { UIModal };
