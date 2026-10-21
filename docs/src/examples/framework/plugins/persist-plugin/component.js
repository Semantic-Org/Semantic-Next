/* playground-fold */
import { addPlugin, defineComponent, getText } from '@semantic-ui/component';
import { Persist } from './plugin.js';

const template = await getText('./component.html');
const css = await getText('./component.css');
/* playground-fold-end */

addPlugin(Persist);

defineComponent({
  tagName: 'sticky-note',
  persist: ['note'],
  defaultState: {
    note: 'Type here, then click Reload',
  },
  template,
  css,
  events: {
    'input textarea'({ state, value }) {
      state.note.set(value);
    },
    'click .reload'() {
      location.reload();
    },
  },
});
