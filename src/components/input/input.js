import { defineComponent } from '@semantic-ui/component';
import { debounce } from '@semantic-ui/utils';

import componentSpec from './specs/input-component.json' with { type: 'json' };
import template from './input.html?raw';
import css from './input-bundle.css?raw';

const defaultState = {
  focused: false,
};

const createComponent = ({ $, el, self, state, dispatchEvent, settings }) => ({
  initialize() {
    if (settings.search) {
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
      focus: state.focused.get(),
    };
  },

  getIcon() {
    if (settings.clearable && self.hasValue()) {
      return 'x';
    }
    return settings.icon;
  },

  setValue(value) {
    el.value = value;
    $('input').val(value);
    dispatchEvent('input', { value });
  },

  setValueDebounced: debounce((value) => {
    self.setValue(value);
  }, { wait: settings.debounceInterval }),
});

const events = {
  'click ui-icon'({ $, self }) {
    if (self.isClearable()) {
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
    if (settings.debounced) {
      self.setValueDebounced(value);
    }
    else {
      self.setValue(value);
    }
  },
};

const UIInput = defineComponent({
  tagName: 'ui-input',
  delegatesFocus: true,
  componentSpec,
  template,
  css,
  createComponent,
  events,
  defaultState,
});

export { UIInput };
