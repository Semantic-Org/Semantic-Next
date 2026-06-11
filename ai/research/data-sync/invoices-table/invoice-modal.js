import { defineComponent } from '@semantic-ui/component';

import { Invoices } from './collections/invoices/invoices.js';

import template from './invoice-modal.html?raw';

// one component, two modes: invoice-id present = edit (fork the doc),
// absent = add (fork from schema defaults)
const defaultSettings = {
  invoiceID: null,
};

const subscriptions = ({ subscribe, settings }) => ({
  // edit mode needs fields the table channel never projected — the pool
  // unions invoices.table and invoices.detail per doc
  detail: settings.invoiceID ? subscribe('invoices.detail', { id: settings.invoiceID }) : null,
});

const createComponent = ({ settings, findChild, dispatchEvent }) => ({
  draft: settings.invoiceID ? Invoices.draft(settings.invoiceID) : Invoices.draft(),

  isEditing: !!settings.invoiceID,

  close() {
    findChild('uiModal').hide();
    dispatchEvent('close');
  },
});

const events = {
  async 'click ui-button.save'({ self }) {
    if (self.isEditing) {
      self.draft.commit(); // → Invoices.save, touched paths only
    }
    else {
      Invoices.create(self.draft.values()); // insert mode binds explicitly
    }
    self.close();
  },

  'click ui-button.cancel'({ self }) {
    self.draft.discard();
    self.close();
  },
};

export const invoiceModal = defineComponent({
  tagName: 'invoice-modal',
  template,
  defaultSettings,
  subscriptions,
  createComponent,
  events,
});
