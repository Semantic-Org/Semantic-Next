import { defineComponent, getText } from '@semantic-ui/component';
import { inArray } from '@semantic-ui/utils';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  sections: []
};

const defaultState = {
  openSections: [], // array of indexes that are open
};

const createComponent = ({self, state}) => ({
  isExpanded(index) {
    return inArray(index, state.openSections.get());
  },
  toggleSection(index) {
    const indexes = state.openSections.get();
    if(inArray(index, indexes)) {
      state.openSections.removeItem(index);
    }
    else {
      state.openSections.push(index);
    }
  }
});

const events = {
  'click .header'({self, data}) {
    self.toggleSection(+data.index);
  }
};

defineComponent({
  tagName: 'ui-accordion',
  events,
  template,
  css,
  defaultSettings,
  defaultState,
  createComponent
});
