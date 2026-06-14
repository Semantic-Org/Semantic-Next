import { Invoices } from '../invoices.js';

// the edit modal's fuller view of the same collection — the client pool
// unions the two projections per doc. args are this publication's contract
Invoices.publish('detail', {
  permission: 'invoices_view',
  filter: { deletedAt: null },
  fields: ['client', 'status', 'total', 'notes', 'createdAt'],
  handler(ctx, { id }) {
    return Invoices.find({ id });
  },
});
