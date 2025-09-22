import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  temperature: 85,
};

const defaultState = {
  thresholds: {
    hot: 90,
    warm: 70,
    cool: 50,
  },
};

const createComponent = ({ state }) => ({
  getWeatherClass(temp) {
    const thresholds = state.thresholds.get();
    if (temp > thresholds.hot) { return 'hot'; }
    if (temp > thresholds.warm) { return 'warm'; }
    if (temp > thresholds.cool) { return 'cool'; }
    return 'cold';
  },
});

export default defineComponent({
  tagName: 'weather-forecast',
  template,
  css,
  defaultSettings,
  defaultState,
  createComponent,
});
