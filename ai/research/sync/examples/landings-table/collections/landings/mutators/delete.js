import { Landings } from '../landings.js';

// soft delete — both channels' filter: { deletedAt: null } baseline hides it everywhere
Landings.mutator('delete', {
  mutate(landing) {
    landing.deletedAt = new Date();
  },
});
