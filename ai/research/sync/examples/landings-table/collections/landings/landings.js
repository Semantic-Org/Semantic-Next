import { collection } from '@semantic-ui/data';

const hoursSince = (date) => (Date.now() - date) / (1000 * 60 * 60);

export const Landings = collection('landings', {
  schema: {
    vessel: String,
    port: String,
    status: { type: String, options: ['draft', 'submitted', 'settled'], default: 'draft' },
    weight: { type: Number, default: 0 }, // kg across the whole landing
    value: { type: Number, default: 0 },
    notes: String,
    internal: { type: Object, private: true, unsafe: true }, // never crosses the wire, loose region
    // searchable, never sent — computed fields are stored: recomputed and
    // written whenever inputs change, ordinary field otherwise
    searchText: {
      type: String,
      private: true,
      computed: landing => [landing.vessel, landing.port, landing.status, String(landing.weight)].join(' '),
    },
    landedAt: { type: Date, default: () => new Date() },
    deletedAt: Date,
  },

  // isomorphic presentation — same function runs in a server filing and a
  // client template. helpers are derived display, computed fields are
  // derived data: sortable/searchable means computed, printable means helper
  helpers: {
    summary() {
      return `${this.vessel} — ${this.weight} kg`;
    },
    // the logbook is due within a day of landing, so late is hours not weeks
    isFilingLate() {
      return this.status === 'draft' && hoursSince(this.landedAt) > 24;
    },
  },
});
