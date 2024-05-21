import { createComponent } from '@semantic-ui/component';
import { } from '@semantic-ui/utils';

import template from './GlobalSearch.html?raw';
import css from './GlobalSearch.css?raw';

import { UIModal } from '@semantic-ui/core';

const settings = {
  openKey: 'ctrl + k'
};

const createInstance = ({tpl, el, bindKey, settings, $}) => ({
  initialize() {
    bindKey(settings.openKey, tpl.openModal);
  },
  openModal() {
    $('ui-modal').get(0).tpl.show();
  },
  hideModal() {
    $('ui-modal').get(0).tpl.hide();
  }
});

const events = {
  'click .search input'({tpl}) {
    tpl.openModal();
  },
};

const GlobalSearch = createComponent({
  tagName: 'global-search',
  template,
  css,
  createInstance,
  events,
  settings,
});

export default GlobalSearch;
export { GlobalSearch };
