import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  tabs: []
};

const defaultState = {
  tabIndex: 0
};

const createComponent = ({ self, state, settings}) => ({
  maybeActive(index) {
    return (state.tabIndex.get() === index)
      ? 'active'
      : ''
    ;
  },
  getTabContent() {
    return settings.tabs[state.tabIndex.value]?.content;
  },
});

const events = {
  'click .header'({ state, event }) {
    const index = Number(event.target.dataset.index);
    state.tabIndex.set(index);
  }
};

defineComponent({
  tagName: 'ui-tabs',
  template,
  css,
  defaultSettings,
  defaultState,
  createComponent,
  events
});
