import { Landings } from '../landings.js';

Landings.mutator('setStatus', {
  mutate(landing, { status }) {
    landing.status = status;
  },
});
