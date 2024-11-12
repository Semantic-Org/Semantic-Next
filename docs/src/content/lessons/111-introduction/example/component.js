import { defineComponent } from '@semantic-ui/component';

const currentTime = defineComponent({
  template: `<b>{formatDate time "h:mm:ss a"}</b>`,
  css: 'b { color: var(--primary-text-color); }',
  state: { time: new Date() },
  onCreated({state}) {
    setInterval(() => state.time.now(), 1000);
  }
});

const greetUser = defineComponent({
  tagName: 'greet-user',
  css: '',
  template: `Hello {user} the time is {> currentTime}`,
  settings: { user: '' },
  subTemplates: { currentTime }
});
