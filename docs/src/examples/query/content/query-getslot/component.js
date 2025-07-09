import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  charCount: 0,
  wordCount: 0,
  hasContent: 'No',
};

const createComponent = ({ self, state, el, $ }) => ({
  analyzeContent() {
    // Use getSlot() to get the current slot content
    const content = $(el).getSlot().trim();

    // get slot returns html we want the text
    const text = $(`<span>${content}</span>`).text();

    // Update stats
    state.charCount.set(text.length);
    state.wordCount.set(text.split(/\s+/));
    state.hasContent.set(!!text);
  },
});

const events = {
  'input': ({ self }) => {
    self.analyzeContent();
  },
};

const onRendered = ({ self, reaction }) => {
  self.analyzeContent();
};

export const SlotDemo = defineComponent({
  tagName: 'slot-demo',
  template,
  css,
  defaultState,
  onRendered,
  createComponent,
  events,
});
