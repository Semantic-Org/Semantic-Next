import { defineComponent } from '@semantic-ui/component';

import { Landings } from './collections/landings/landings.js';

import template from './landing-modal.html?raw';

// one component, two modes: landing-id present = edit (fork the doc),
// absent = add (fork from schema defaults)
const defaultSettings = {
  landingID: null,
};

const subscriptions = ({ subscribe, settings }) => ({
  // edit mode needs fields the table channel never projected — the pool
  // unions landings.table and landings.detail per doc
  detail: settings.landingID ? subscribe('landings.detail', { id: settings.landingID }) : null,
});

const createComponent = ({ settings, findChild, dispatchEvent }) => ({
  draft: settings.landingID ? Landings.draft(settings.landingID) : Landings.draft(),

  isEditing: !!settings.landingID,

  close() {
    findChild('uiModal').hide();
    dispatchEvent('close');
  },
});

const events = {
  async 'click ui-button.save'({ self }) {
    if (self.isEditing) {
      self.draft.commit(); // → Landings.save, touched paths only
    }
    else {
      Landings.create(self.draft.values()); // insert mode binds explicitly
    }
    self.close();
  },

  'click ui-button.cancel'({ self }) {
    self.draft.discard();
    self.close();
  },
};

export const landingModal = defineComponent({
  tagName: 'landing-modal',
  template,
  defaultSettings,
  subscriptions,
  createComponent,
  events,
});
