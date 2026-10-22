import { registerPlugin } from '@semantic-ui/component';
import { each, intersection, keys } from '@semantic-ui/utils';

const onCreated = ({ state, config, self, reaction }) => {
  // track only the keys specified in config
  const persistedKeys = intersection(keys(state), config);

  each(persistedKeys, (key) => {
    const savedValue = self.getValue(key);
    // restore prior value
    if (savedValue !== null) {
      state[key].set(savedValue);
    }
    // track changes in a reaction and store on modify
    reaction(() => self.setValue(key, state[key].get()));
  });
};

const createPlugin = () => ({
  getValue(key) {
    const value = localStorage.getItem(key);
    return JSON.parse(value);
  },
  setValue(key, value) {
    if (value !== null) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
});

// register for it to be used
export const Persist = registerPlugin({
  createPlugin,
  onCreated,
  namespace: 'persist',
  appliesTo: 'configured', // applies only if configuration present
});
