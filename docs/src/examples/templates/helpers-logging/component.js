import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  userName: 'alice',
  debugData: { status: 'active', level: 5 },
  logMessage: 'Hello from template',
};

defineComponent({
  tagName: 'helpers-logging',
  template,
  css,
  defaultState,
});
