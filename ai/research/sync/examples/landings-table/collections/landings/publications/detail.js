import { Landings } from '../landings.js';

// the edit modal's fuller view of the same collection — the client pool
// unions the two projections per doc. args are this publication's contract
Landings.publish('detail', {
  permission: 'landings_view',
  filter: { deletedAt: null },
  fields: ['vessel', 'port', 'status', 'weight', 'value', 'notes', 'landedAt'],
  handler(ctx, { id }) {
    return Landings.find({ id });
  },
});
