import { Invoices } from '../invoices.js';

Invoices.mutator('setStatus', {
  mutate(invoice, { status }) {
    invoice.status = status;
  },
});
