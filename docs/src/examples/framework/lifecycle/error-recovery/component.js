import { defineComponent, getText, setRecovery, setTracing } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

// comment this out and the whole component renders empty, not just the block that threw
setRecovery(true);

// recovery swallows the error, tracing prints the block that failed
setTracing(true);

const defaultState = {
  entries: [
    { name: 'archive.zip', size: { bytes: 4200 } },
    { name: 'notes.txt' },
    { name: 'icon.svg', size: { bytes: 120 } },
  ],
};

const createComponent = () => ({
  isLarge: (entry) => entry.size.bytes > 1000,
});

defineComponent({
  tagName: 'error-recovery',
  template,
  css,
  defaultState,
  createComponent,
});
