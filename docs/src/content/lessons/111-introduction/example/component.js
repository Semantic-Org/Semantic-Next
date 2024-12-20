import { defineComponent, getText } from '@semantic-ui/component';
import { each, range } from '@semantic-ui/utils';

const template = await getText('./component.html');
const css = await getText('./component.css');

const settings = {
  text: 'Default Text'
};

const state = {
  waves: [],
  baseY: 100,
  amplitude: 0
};

const createComponent = ({ state }) => ({
  getTextPath() {
    // Create smooth curve for text to follow
    const width = 500;
    const y = state.baseY.value;
    const amp = state.amplitude.value;
    const freq = Math.PI * 2 / width;

    let path = `M 0 ${y}`;
    const values = range(0, width / 10, 10);
    each(values, (x) =>{
      const newY = y + Math.sin(x * freq) * amp;
      path += ` L ${x} ${newY}`;
    });
    return path;
  },
  createWave(x, y) {
    const width = 500;
    const baseY = state.baseY.value;

    const waves = range(1, 5).map(i => {
      const freq = (Math.PI * 2 / width) * i;
      const amp = Math.max(0, 100 - Math.abs(y - baseY));

      const points = range(0, width, 10).map(px => {
        const distance = Math.abs(x - px);
        const decay = Math.max(0, 1 - (distance / 200));
        const newY = baseY + Math.sin(px * freq) * amp * decay;
        return `L ${px} ${newY}`;
      });

      return {
        path: `M 0 ${baseY} ${points.join(' ')}`,
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
    state.amplitude.set((y - state.baseY.value) * 0.2);
  },
  'mouseleave .container'({ state }) {
    state.waves.set([]);
    state.amplitude.set(0);
  }
};

defineComponent({
  tagName: 'hello-world',
  settings,
  state,
  createComponent,
  events,
  template,
  css
});
