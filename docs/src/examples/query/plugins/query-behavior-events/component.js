import { registerBehavior } from '@semantic-ui/query';

registerBehavior({
  name: 'scrollspy',

  createBehavior: ({ $el, self, index, attachEvent, dispatchEvent, dispatchGroupEvent }) => ({
    initialize() {
      // the scroll container is found at runtime, so it cannot be a selector in events
      self.$scroll = $el.scrollParent();
      attachEvent(self.$scroll, 'scroll', self.check);
      self.check();
    },

    check() {
      const line = self.$scroll.bounds().top;
      const section = $el.bounds();
      const atLine = section.top <= line && section.bottom > line;
      if (!atLine || $el.hasClass('active')) {
        return;
      }
      // clear reaches every element in the group, enter reaches this one
      dispatchGroupEvent('clear');
      $el.addClass('active');
      dispatchEvent('enter', { index });
    },
  }),

  events: {
    // the sender hears its own group event, which is why active is added back after it
    'scrollspy:clear': ({ $el }) => $el.removeClass('active'),
  },
});
