import { defineComponent } from '@semantic-ui/component';

defineComponent({
  tagName: 'current-time',
  state: { time: new Date() },
  template: `Time is <b>{formatDate time "h:mm:ss a"}</b>`,
  css: 'b { color: var(--primary-text-color); }',
  onCreated({state}) {
    setInterval(() => state.time.now(), 1000);
  }
});
