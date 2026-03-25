import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  reactions: '👍 12, ❤️ 5, 😂 3, 🎉 8',
};

const defaultState = {
  reactionState: [],
};

const createComponent = ({ state, settings }) => ({
  initialize() {
    const reactions = settings.reactions.split(',').map(entry => {
      const [emoji, count] = entry.trim().split(/\s+/);
      return { emoji, count: parseInt(count) || 0, active: false };
    });
    state.reactionState.set(reactions);
  },

  toggle(index) {
    const reaction = state.reactionState.getIndex(index);
    const active = !reaction.active;
    const count = reaction.count + (active ? 1 : -1);
    state.reactionState.setIndex(index, { ...reaction, active, count });
  },
});

const events = {
  'click .reaction'({ self, data }) {
    self.toggle(data.index);
  },
};

defineComponent({
  tagName: 'emoji-reactions',
  template,
  css,
  defaultSettings,
  defaultState,
  createComponent,
  events,
});
