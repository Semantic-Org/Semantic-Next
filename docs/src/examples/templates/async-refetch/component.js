import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const profiles = {
  ada: { name: 'Ada Lovelace', role: 'Mathematician', latency: 1500 },
  grace: { name: 'Grace Hopper', role: 'Rear Admiral', latency: 200 },
  alan: { name: 'Alan Turing', role: 'Logician', latency: 200 },
};

const defaultState = {
  userId: 'grace',
};

const createComponent = ({ timeout }) => ({
  users: [
    { label: 'Ada (slow)', value: 'ada' },
    { label: 'Grace', value: 'grace' },
    { label: 'Alan', value: 'alan' },
  ],

  // no request id or debounce here, the block drops a response once a newer fetch starts
  loadProfile(userId) {
    const profile = profiles[userId];
    return new Promise((resolve) => timeout(() => resolve(profile), profile.latency));
  },
});

const events = {
  'change ui-menu'({ state, data }) {
    state.userId.set(data.value);
  },
};

defineComponent({
  tagName: 'profile-loader',
  template,
  css,
  defaultState,
  events,
  createComponent,
});
