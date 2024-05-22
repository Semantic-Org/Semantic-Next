import { createComponent } from '@semantic-ui/component';
import { InputComponentSpec } from '@semantic-ui/specs';

import CSS from './css/input-shadow.css?raw';
import Template from './input.html?raw';

const createInstance = ({$}) => ({
});


const onCreated = ({}) => {
};

const onRendered = function({}) {

};

const events = {
  'input input'({event, settings, dispatchEvent}) {
    console.log($(event.target).val());
    settings.value = $(event.target).val();
  }
};

const UIInput = createComponent({
  tagName: 'ui-input',
  componentSpec: InputComponentSpec,
  template: Template,
  css: CSS,
  createInstance,
  events,
  onCreated,
  onRendered,
});

export { UIInput };
