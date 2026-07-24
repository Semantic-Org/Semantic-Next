import { Landings } from '../landings.js';

Landings.mutator('save', {
  schema: { id: String, vessel: String, port: String, weight: Number, notes: String },
  mutate(landing, fields) {
    Object.assign(landing, fields);
  },
});
