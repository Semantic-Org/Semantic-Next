import { defineComponent, getText } from '@semantic-ui/component';

import './event-log.js';

const css = await getText('./component.css');
const template = await getText('./component.html');

const createComponent = () => ({
  entries: [
    { label: 'Signed in', time: new Date('2026-07-24T06:15:00') },
    { label: 'Uploaded a file', time: new Date('2026-07-24T09:40:00') },
    { label: 'Signed out', time: new Date('2026-07-24T11:05:00') },
  ],
});

defineComponent({
  tagName: 'property-binding',
  template,
  css,
  createComponent,
});
