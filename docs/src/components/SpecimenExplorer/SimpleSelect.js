import { defineComponent } from '@semantic-ui/component';

import css from './SimpleSelect.css?raw';
import template from './SimpleSelect.html?raw';

const defaultSettings = {
  selected: '',
  options: [],
  attribute: '',
};

const defaultState = {
  isOpen: false,
};

const createComponent = ({ self, state, settings, $, afterFlush, findParent }) => ({
  getDisplayText() {
    const selected = settings.selected;
    if (!selected) { return 'None'; }
    const option = settings.options.find(opt => opt.value === selected);
    return option ? (option.name || option.text) : 'None';
  },

  toggle() {
    if (state.isOpen.get()) {
      self.close();
    }
    else {
      self.open();
    }
  },

  open() {
    self.triggerEl = $('.select').el();
    state.isOpen.set(true);
    afterFlush(() => {
      $('.menu').attach({
        to: self.triggerEl,
        position: 'bottom left',
        arrow: false,
        distance: 2,
      });
    });
  },

  close() {
    state.isOpen.set(false);
  },

  selectItem(value) {
    self.close();
    const explorer = findParent('specimenExplorer');
    if (explorer) {
      explorer.setSelection(settings.attribute, value);
    }
  },
});

const events = {
  'click .select'({ self }) {
    self.toggle();
  },
  'click .item'({ self, data, event }) {
    event.stopPropagation();
    self.selectItem(data.value);
  },
  'global click window'({ self, el, event, state }) {
    if (state.isOpen.get() && !el.contains(event.target)) {
      self.close();
    }
  },
};

export const SimpleSelect = defineComponent({
  template,
  css,
  defaultSettings,
  defaultState,
  createComponent,
  events,
});
