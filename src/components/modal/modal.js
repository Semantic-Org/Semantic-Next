import { createComponent } from '@semantic-ui/component';
import { ModalComponentSpec } from '@semantic-ui/specs';

import CSS from './css/modal-shadow.css?raw';
import Template from './modal.html?raw';

const createInstance = ({$}) => ({
  show() {
    $('dialog').get(0).showModal();
  },
  hide() {
    $('dialog').get(0).close();
  }
});


const onCreated = ({}) => {
};

const onRendered = function({}) {
};

const events = {
  'click ui-icon.close'({event, tpl}) {
    tpl.hide();
  },
  'click dialog'({event, settings, data, tpl}) {
    if(settings.closeable && $(event.target).is('dialog')) {
      tpl.hide();
    }
  }
};

const UIModal = createComponent({
  tagName: 'ui-modal',
  componentSpec: ModalComponentSpec,
  template: Template,
  css: CSS,
  createInstance,
  events,
  onCreated,
  onRendered,
});

export { UIModal };
