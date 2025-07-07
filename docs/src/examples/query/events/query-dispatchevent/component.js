import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  log: '',
};

const createComponent = ({ state, dispatchEvent }) => ({

  appendLog(message) {
    let logValue = state.log.get();
    logValue += `\n${message}`;
    state.log.set(logValue);
  },

  sendPing() {
    console.log('dispatching pong');
    dispatchEvent('pong', { time: new Date() });
  }

});

const events = {
  'global ping .ping-dispatcher': ({ self, data, dispatchEvent }) => {
    console.log('Got here');
    self.appendLog(`Pong received`, data.date);
    setTimeout(self.sendPing, 1000);
  },
};

defineComponent({
  tagName: 'pong-dispatcher',
  template,
  css,
  defaultState,
  createComponent,
  events,
});
