import { registerPlugin } from '@semantic-ui/component';

export const Persist = registerPlugin({
  namespace: 'persist',
  appliesTo: 'configured',
  onCreated({ state, config, reaction }) {
    for (const key of config) {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        state[key].set(JSON.parse(saved));
      }
      reaction(() => {
        const value = JSON.stringify(state[key].get());
        localStorage.setItem(key, value);
      });
    }
  },
});
