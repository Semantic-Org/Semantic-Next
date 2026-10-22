/* playground-fold */
import { addPlugin, defineComponent, getText } from '@semantic-ui/component';
import { Persist } from './plugin.js';

const template = await getText('./component.html');
const css = await getText('./component.css');
/* playground-fold-end */

// enable persist plugin across components
addPlugin(Persist);

const defaultState = {
  note: 'Type here, then click Reload',
};

const events = {
  'input textarea'({ state, value }) {
    state.note.set(value);
  },
  'click .reload'() {
    location.reload();
  },
};

defineComponent({
  tagName: 'sticky-note',
  persist: ['note'], // syncs state.note to localStorage
  defaultState,
  template,
  css,
  events,
});
