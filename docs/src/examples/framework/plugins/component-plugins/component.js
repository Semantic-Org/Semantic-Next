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

addPlugin(I18n, {
  locale: 'en',
  strings,
});

defineComponent({
  tagName: 'checkout-summary',
  i18n: 'checkout',
  template,
  css,
  events: {
    'click .locales ui-button'({ i18n, data }) {
      i18n.setLocale(data.locale);
    },
  },
});
