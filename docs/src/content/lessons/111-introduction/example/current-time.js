import { defineComponent } from '@semantic-ui/component';

export const CurrentTime = defineComponent({
  template: `<b>{formatDate time "h:mm:ss a"}</b>`,
  css: 'b { color: var(--primary-text-color); }',
  state: { time: new Date() },
  onCreated({state}) {
    setInterval(() => state.time.now(), 1000);
  }
});
