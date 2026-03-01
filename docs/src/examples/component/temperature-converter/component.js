import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  celsius: 0,
  fahrenheit: 32,
};

const createComponent = ({ state }) => ({
  setCelsius(value) {
    const c = +value;
    state.celsius.set(c);
    state.fahrenheit.set(+(32 + (9 / 5) * c).toFixed(1));
  },
  setFahrenheit(value) {
    const f = +value;
    state.fahrenheit.set(f);
    state.celsius.set(+((5 / 9) * (f - 32)).toFixed(1));
  },
});

const events = {
  'input .celsius'({ self, value }) {
    self.setCelsius(value);
  },
  'input .fahrenheit'({ self, value }) {
    self.setFahrenheit(value);
  },
};

defineComponent({
  tagName: 'temperature-converter',
  template,
  css,
  defaultState,
  createComponent,
  events,
});
