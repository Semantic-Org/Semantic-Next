/* playground-fold */
import { defineComponent, extendParams, getText } from '@semantic-ui/component';
import { signal } from '@semantic-ui/reactivity';

const template = await getText('./component.html');
const css = await getText('./component.css');

const currency = signal('USD');
const rates = { USD: 1, EUR: 0.92, JPY: 155 };
const format = (usd, code) => (
  new Intl.NumberFormat('en-US', { style: 'currency', currency: code })
    .format(usd * rates[code])
);
/* playground-fold-end */

// inject shared helpers into all component callbacks
extendParams({
  setCurrency: (code) => currency.set(code),
  formatPrice: (usd) => format(usd, currency.get()),
});

// destructure formatPrice from callback arguments
const createComponent = ({ formatPrice }) => ({
  formatPrice,
});

const events = {
  // destructure setCurrency from callback arguments
  'click .currencies ui-button'({ setCurrency, data }) {
    setCurrency(data.currency);
  },
};

defineComponent({
  tagName: 'pricing-card',
  template,
  css,
  createComponent,
  events,
});
