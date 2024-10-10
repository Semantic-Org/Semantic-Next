import { defineComponent } from '@semantic-ui/component';

const template = `{{getValue}}`;

const createInstance = (self) => ({
   getValue: () => 'test'
});

defineComponent({
  tagName: 'ui-counter',
  template: template,
  createInstance,
  onCreated: function() {
    console.log('created');
  }
});
