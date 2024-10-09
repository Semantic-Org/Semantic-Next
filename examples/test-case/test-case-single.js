import { createComponent } from '@semantic-ui/component';

const template = `{{getValue}}`;

const createInstance = (self) => ({
   getValue: () => 'test'
});

createComponent({
  tagName: 'ui-counter',
  template: template,
  createInstance,
  onCreated: function() {
    console.log('created');
  }
});
