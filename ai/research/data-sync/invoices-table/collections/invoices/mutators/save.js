import { Invoices } from '../invoices.js';

Invoices.mutator('save', {
  schema: { id: String, client: String, total: Number, notes: String },
  mutate(invoice, fields) {
    Object.assign(invoice, fields);
  },
});
