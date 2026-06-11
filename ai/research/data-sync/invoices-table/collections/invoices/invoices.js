import { collection } from '@semantic-ui/data';

const daysSince = (date) => (Date.now() - date) / (1000 * 60 * 60 * 24);

export const Invoices = collection('invoices', {
  schema: {
    client: String,
    status: { type: String, options: ['draft', 'open', 'closed'], default: 'draft' },
    total: { type: Number, default: 0 },
    notes: String,
    internal: { type: Object, private: true, unsafe: true }, // never crosses the wire, loose region
    // searchable, never sent — computed fields are stored: recomputed and
    // written whenever inputs change, ordinary field otherwise
    searchText: {
      type: String,
      private: true,
      computed: invoice => [invoice.client, invoice.status, String(invoice.total)].join(' '),
    },
    createdAt: { type: Date, default: () => new Date() },
    deletedAt: Date,
  },

  // isomorphic presentation — same function runs in a server email body and
  // a client template. helpers are derived display, computed fields are
  // derived data: sortable/searchable means computed, printable means helper
  helpers: {
    summary() {
      return `${this.client} — ${this.total}`;
    },
    isOverdue() {
      return this.status === 'open' && daysSince(this.createdAt) > 30;
    },
  },
});
