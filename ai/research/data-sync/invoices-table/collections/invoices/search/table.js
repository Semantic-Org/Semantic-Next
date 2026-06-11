import { pgSearch, searchIndex } from '@semantic-ui/sync/server';
import { Invoices } from '../invoices.js';

// the indexed table view — a different thing to the end user than a
// publication (window args: query/where/sort/page), even though it compiles
// to a plain channel underneath. wire address derives: invoices.table
Invoices.searchIndex('table', {
  permission: 'invoices_view',
  live: false, // snapshot per args — no standing recompute
  refresh: 'own-writes', // your inserts/edits re-query immediately
  filter: { deletedAt: null }, // baseline, always ANDed
  // per-field match semantics + weights — the portable contract engines
  // implement. default for a flat list is word-prefix (typeahead feel)
  search: {
    client: { match: 'prefix', weight: 3 },
    searchText: { match: 'word' },
    notes: { match: 'text', language: 'english' },
  },
  fields: ['client', 'status', 'total', 'createdAt'], // returned projection
  where: ['status'], // client-suppliable filter whitelist
  sort: ['client', 'total', 'createdAt'], // client-drivable sort whitelist
  pageSize: 25,
  engine: pgSearch(), // substring default · elastic() · local()
});
