import { registerBehavior } from '@semantic-ui/query';

registerBehavior({
  name: 'tally',

  defaultSettings: {
    step: 1,
  },

  createBehavior: ({ $el, self, settings }) => ({
    initialize() {
      // the count lives on the instance and nowhere else
      self.count = 0;
      self.render();
    },
    add() {
      self.count += settings.step;
      self.render();
    },
    getCount() {
      return self.count;
    },
    setStep(step) {
      self.setting('step', step);
    },
    render() {
      $el.text(self.count);
    },
  }),

  events: {
    'click': ({ self }) => self.add(),
  },
});
