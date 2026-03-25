import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  log: [],
};

const createComponent = ({ state, dispatchEvent }) => ({

  appendLog(message, date) {
    state.log.push({message: message, date: date});
  },

  sendPong() {
    dispatchEvent('pong', { date: new Date() });
  }

});

const events = {
  'global ping .ping-dispatcher': ({ self, data, dispatchEvent, timeout }) => {
    self.appendLog(`Ping received`, data.date);
    timeout(self.sendPong, 1000);
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
