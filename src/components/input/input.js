import { createComponent } from '@semantic-ui/component';
import { InputComponentSpec } from '@semantic-ui/specs';

import CSS from './css/input-shadow.css?raw';
import Template from './input.html?raw';

const state = {
  focused: false,
};

const createInstance = ({$, state}) => ({

  getStateClasses() {
    return {
      focus: state.focused.get()
    };
  },

});


const onCreated = ({}) => {
};

const onRendered = function({}) {

};

const events = {
  'focus input'({ state }) {
    state.focused.set(true);
  },
  'blur input'({ state }) {
    state.focused.set(false);
  },
  'input input'({event, el, settings, dispatchEvent}) {
    el.value = $(event.target).val();
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
  state,
});

export { UIInput };
