import { defineComponent } from '@semantic-ui/component';

const template = `{{getValue}}`;

const createComponent = (self) => ({
   getValue: () => 'test'
});

defineComponent({
  tagName: 'ui-counter',
  template: template,
  createComponent,
  onCreated: function() {
    console.log('created');
  }
});
