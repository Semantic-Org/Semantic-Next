import { defineComponent } from '@semantic-ui/component';
import { InputComponentSpec } from '@semantic-ui/specs';
import { debounce } from '@semantic-ui/utils';

import CSS from './css/input-shadow.css?raw';
import Template from './input.html?raw';


const defaultState = {
  focused: false,
}

const createComponent = ({$, el, self, state, dispatchEvent, settings}) => ({

  initialize() {
    if(settings.search) {
      self.configureSearch();
    }
  },

  // allow default styling for search
  configureSearch() {
    settings.placeholder = settings.placeholder || 'Search...';
    settings.icon = settings.icon || 'search';
    settings.clearable = settings.clearable ?? true;
    settings.debounce = true;
  },

  hasValue() {
    return (settings.value || '').length > 0;
  },

  isClearable() {
    return settings.clearable && self.hasValue();
  },

  getStateClasses() {
    return {
      focus: state.focused.get()
    };
  },

  getIcon() {
    if(settings.clearable && self.hasValue()) {
      return 'x';
    }
    return settings.icon
  },


  setValue(value) {
    el.value = value;
    $('input').val(value);
    dispatchEvent('input', { value });
  },

  setValueDebounced: debounce((value) => {
    self.setValue(value)
  }, { delay: settings.debounceInterval }),

});


const onCreated = ({}) => {
};

const onRendered = function({}) {

};

const events = {
  'click ui-icon'({ $, self }) {
    if(self.isClearable()) {
      self.setValue('');
    }
  },
  'focus input'({ state }) {
    state.focused.set(true);
  },
  'blur input'({ state, dispatchEvent, el }) {
    state.focused.set(false);
    dispatchEvent('change', { value: el.value });
  },
  'input input'({ el, self, value, settings }) {
    if(settings.debounced) {
      self.setValueDebounced(value);
    }
    else {
      self.setValue(value);
    }
  },
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
  defaultState,
});

export { UIInput };
