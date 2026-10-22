/* playground-fold */
import { addPlugin, defineComponent, getText } from '@semantic-ui/component';
import { I18n } from './i18n-plugin.js';

const template = await getText('./component.html');
const css = await getText('./component.css');

const strings = {
  en: {
    checkout: {
      title: 'Order Summary',
      subtotal: 'Subtotal',
      placeOrder: 'Place Order',
    },
  },
  es: {
    checkout: {
      title: 'Resumen del pedido',
      subtotal: 'Subtotal',
      placeOrder: 'Realizar pedido',
    },
  },
  ja: {
    checkout: {
      title: '注文の概要',
      subtotal: '小計',
      placeOrder: '注文を確定する',
    },
  },
};
/* playground-fold-end */

// install plugin with app-wide locale strings
addPlugin(I18n, {
  locale: 'en',
  strings,
});

const events = {
  // i18n is injected into callbacks by the plugin
  'click .locales ui-button'({ i18n, data }) {
    i18n.setLocale(data.locale);
  },
};

defineComponent({
  tagName: 'checkout-summary',
  i18n: 'checkout', // scopes {t} lookups to strings[locale].checkout
  template,
  css,
  events,
});
