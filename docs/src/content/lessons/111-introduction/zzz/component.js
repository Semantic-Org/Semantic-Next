import { defineComponent } from '@semantic-ui/component';
defineComponent({
  tagName: 'hello-world',
  template: `<b>{getMessage}</b>.`,
  css: `b { color: var(--primary-text-color); }`,
  createComponent: () => ({
    getMessage() {
      return 'Hello world';
    }
  }),
});
