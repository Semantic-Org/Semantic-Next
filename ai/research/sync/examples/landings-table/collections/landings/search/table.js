import { pgSearch, searchIndex } from '@semantic-ui/sync/server';
import { Landings } from '../landings.js';

// the indexed table view — a different thing to the end user than a
// publication (window args: query/where/sort/page), even though it compiles
// to a plain channel underneath. wire address derives: landings.table
Landings.searchIndex('table', {
  permission: 'landings_view',
  live: false, // snapshot per args — no standing recompute
  refresh: 'own-writes', // your inserts/edits re-query immediately
  filter: { deletedAt: null }, // baseline, always ANDed
  // per-field match semantics + weights — the portable contract engines
  // implement. default for a flat list is word-prefix (typeahead feel)
  search: {
    vessel: { match: 'prefix', weight: 3 },
    searchText: { match: 'word' },
    notes: { match: 'text', language: 'english' },
  },
  fields: ['vessel', 'port', 'status', 'weight', 'landedAt'], // returned projection
  where: ['status', 'port'], // client-suppliable filter whitelist
  sort: ['vessel', 'weight', 'landedAt'], // client-drivable sort whitelist
  pageSize: 25,
  engine: pgSearch(), // substring default · elastic() · local()
});
