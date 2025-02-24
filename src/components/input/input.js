import { defineComponent } from '@semantic-ui/component';
import { InputComponentSpec } from '@semantic-ui/specs';

import CSS from './css/input-shadow.css?raw';
import Template from './input.html?raw';

const defaultSettings = {
  focused: false,
};

const createComponent = ({$, settings}) => ({

  getStateClasses() {
    const focus = settings.focused;
    return {
      focus
    };
  },

});


const onCreated = ({}) => {
};

const onRendered = function({}) {

};

const events = {
  'focus input'({ settings }) {
    console.log('set focus');
    settings.focused = true;
  },
  'blur input'({ settings }) {
    settings.focused = false;
  },
  'input input'({event, el, settings, value, dispatchEvent}) {
    el.value = value;
  }
};

const UIInput = defineComponent({
  tagName: 'ui-input',
  componentSpec: InputComponentSpec,
  template: Template,
  css: CSS,
  createComponent,
  events,
  onCreated,
  onRendered,
  defaultSettings,
});

export { UIInput };
