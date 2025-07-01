import { defineComponent, getText } from '/packages/component/src/index.js';

const template = await getText('./component.html');
const css = await getText('./component.css');

const defaultSettings = {
  title: 'Example Component',
  theme: 'primary',
  count: 0,
  disabled: false,
};

const defaultState = {
  isExpanded: false,
  clicks: 0,
  message: 'Hello from AI Workspace!',
};

const createComponent = ({ self, state, settings, dispatchEvent }) => ({
  increment() {
    state.clicks.increment();
    dispatchEvent('countChanged', {
      count: state.clicks.get(),
      component: 'example',
    });
  },

  toggleExpanded() {
    state.isExpanded.toggle();
    console.log('Expanded state:', state.isExpanded.get());
  },

  updateMessage(newMessage) {
    state.message.set(newMessage);
  },

  getStatus() {
    return {
      clicks: state.clicks.get(),
      expanded: state.isExpanded.get(),
      theme: settings.theme,
      title: settings.title,
    };
  },
});

const events = {
  'click .increment-btn': ({ self }) => {
    self.increment();
  },

  'click .toggle-btn': ({ self }) => {
    self.toggleExpanded();
  },

  'input .message-input': ({ state, value }) => {
    state.message.set(value);
  },
};

const onCreated = ({ state, settings }) => {
  console.log('Example component created with settings:', settings);
  state.clicks.set(settings.count || 0);
};

const onRendered = ({ self, isClient }) => {
  if (isClient) {
    console.log('Example component rendered in browser');
    console.log('Component status:', self.getStatus());
  }
};

export const ExampleComponent = defineComponent({
  tagName: 'example',
  template,
  css,
  defaultSettings,
  defaultState,
  createComponent,
  events,
  onCreated,
  onRendered,
});
