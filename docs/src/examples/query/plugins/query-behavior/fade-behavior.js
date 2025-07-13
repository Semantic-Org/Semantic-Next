import { $ } from '@semantic-ui/query';
import { adoptStylesheet } from '@semantic-ui/utils';

$.behavior({
  name: 'transition',
  css: `
    this {
      display: none;
    }
    this.foo {

    }

  `,
  createBehavior: () => ({
    transition(transition) {
      $(this).addClass(transition).one('transitionend', function() {
        $(this).addClass('visible').removeClass(transition);
      });
    },
    show() {
      self.transition('fade-in');
    },
    hide() {
      self.transition('fade-out');
    },
  }),
});
