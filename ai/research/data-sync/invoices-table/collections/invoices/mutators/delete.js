import { Invoices } from '../invoices.js';

// soft delete — both channels' filter: { deletedAt: null } baseline hides it everywhere
Invoices.mutator('delete', {
  mutate(invoice) {
    invoice.deletedAt = new Date();
  },
});
