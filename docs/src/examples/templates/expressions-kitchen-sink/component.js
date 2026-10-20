import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  value: 1,
  date: new Date(),
  numbers: [5, 10, 15],
};

const defaultState = {
  timezone: 'PST',
  fruit: 'cherry',
  profile: { name: 'Jack' },
};

const createComponent = ({ settings, self, signal, interval }) => {
  const userAccount = { loggedIn: signal(true) };
  return {
    initialize: () => interval(() => settings.date = new Date(), 1000),
    isTrue: () => true,
    isDog: () => self.isTrue(),
    addOne(value = 0, value2 = 0) {
      return value + value2 + 1;
    },
    getValue(obj = {}, prop) {
      return obj[prop];
    },
    lookup(first = {}, second = {}, prop) {
      return { ...first, ...second }[prop];
    },
    getAccount: () => userAccount,
    pet: () => ({
      name: 'Simon',
      treats: 3,
      describe() {
        return `${this.name} has ${this.treats} treats`;
      },
    }),
  };
};

export const TestComponent = defineComponent({
  tagName: 'test-component',
  template,
  css,
  defaultSettings,
  defaultState,
  createComponent,
});
