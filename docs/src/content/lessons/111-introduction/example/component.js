import { defineComponent, getText } from '@semantic-ui/component';
import { each, range } from '@semantic-ui/utils';

const template = await getText('./component.html');
const css = await getText('./component.css');

const settings = {
  text: 'Default Text'
};

const state = {
  waves: [],
  yOffset: 100,
  amplitude: 0
};

// click ellipsus to view implementation
// dont study it too closely for now this is just "hello world"

/* playground-fold */
const createComponent = ({ state }) => ({

  getTextPath() {
    // Create smooth curve for text to follow
    const width = 500;
    const y = state.yOffset.value;
    const amp = state.amplitude.value;
    const freq = Math.PI * 2 / width;

    let path = `M 0 ${y}`;
    const interval = 10;
    const values = range(0, width / interval, interval);
    each(values, (x) =>{
      const newY = y + Math.sin(x * freq) * amp;
      path += ` L ${x} ${newY}`;
    });
    return path;
  },
  createWave(x, y) {
    const width = 500;
    const yOffset = state.yOffset.value;

    const waves = range(1, 5).map(i => {
      const frequency = (Math.PI * 2 / width) * i;
      const amplitude = Math.max(0, 100 - Math.abs(y - yOffset));

      const interval = 10;
      const points = range(0, width / interval, interval).map(px => {
        const distance = Math.abs(x - px);
        const decay = Math.max(0, 1 - (distance / 200));
        const newY = yOffset + Math.sin(px * frequency) * amplitude * decay;
        return `L ${px} ${newY}`;
      });

      return {
        path: `M 0 ${yOffset} ${points.join(' ')}`,
        opacity: 0.5 / i
      };
    });

    state.waves.set(waves);
  }
});

const events = {
  'mousemove .container'({ event, target, self, state, $ }) {
    const rect = target.getBoundingClientRect();
    const width = $(target).width();
    const height = $(target).height();
    const x = (event.clientX - rect.left) * (500 / width);
    const y = (event.clientY - rect.top) * (200 / height);

    self.createWave(x, y);
    state.amplitude.set((y - state.yOffset.value) * 0.2);
  },
  'mouseleave .container'({ state }) {
    state.waves.set([]);
    state.amplitude.set(0);
  }
};
  /* playground-fold-end */


defineComponent({
  tagName: 'hello-world',
  settings,
  state,
  createComponent,
  events,
  template,
  css
});
