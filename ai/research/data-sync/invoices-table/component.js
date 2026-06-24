import { defineComponent } from '@semantic-ui/component';

import { Invoices } from './collections/invoices/invoices.js';
import { invoiceModal } from './invoice-modal.js';

import template from './component.html?raw';

const defaultState = {
  search: '',
  status: 'all',
  sort: { createdAt: -1 },
  page: 1,
  editingID: null,
  adding: false,
};

const subscriptions = ({ subscribe, state }) => ({
  // function form = reactive args. typing, filtering, paging, sorting all
  // re-subscribe with overlap-then-swap — the table never blanks
  invoices: subscribe('invoices.table', () => {
    const status = state.status.get();
    return {
      query: state.search.get(),
      where: status === 'all' ? {} : { status },
      sort: state.sort.get(),
      page: state.page.get(),
    };
  }),
});

const createComponent = ({ self, state }) => ({

  // the search-index window surfaces directly: {#each invoice in invoices},
  // {invoices.total}, {not invoices.ready} read the handle (iterable + meta).
  // events still reach it through the bag — subscriptions.invoices.pages

  sortIcon(field) {
    const sort = state.sort.get();
    if (sort[field] === undefined) return '';
    return sort[field] === 1 ? 'arrow-up' : 'arrow-down';
  },

  toggleSort(field) {
    const current = state.sort.get()[field];
    state.sort.set({ [field]: current === 1 ? -1 : 1 });
    state.page.set(1);
  },
});

const events = {

  'input .search'({ state, value }) {
    state.search.set(value);
    state.page.set(1);
  },

  'change ui-dropdown.status'({ state, value }) {
    state.status.set(value);
    state.page.set(1);
  },

  'click th[data-field]'({ self, data }) {
    self.toggleSort(data.field);
  },

  'click ui-button.add'({ state }) {
    state.adding.set(true);
  },

  'click ui-menu.row-actions [data-action=edit]'({ state, data }) {
    state.editingID.set(data.id);
  },

  'click ui-menu.row-actions [data-action=delete]'({ data }) {
    Invoices.delete(data);
  },

  'click ui-button.prev'({ state }) {
    state.page.decrement(1, 1);
  },

  'click ui-button.next'({ state, subscriptions }) {
    state.page.increment(1, subscriptions.invoices.pages);
  },

  'close invoice-modal'({ state }) {
    state.editingID.clear();
    state.adding.set(false);
  },
};

export const InvoicesPage = defineComponent({
  tagName: 'invoices-page',
  template,
  defaultState,
  subscriptions,
  createComponent,
  events,
  subTemplates: { invoiceModal },
});
