import { createComponent } from '@semantic-ui/component';
import { } from '@semantic-ui/utils';

import template from './GlobalSearch.html?raw';
import css from './GlobalSearch.css?raw';

const settings = {
  openKey: 'ctrl + k'
};

const createInstance = ({tpl, el, bindKey, settings, $}) => ({
  initialize() {
    bindKey(settings.openKey, tpl.openModal);
  },
  openModal() {
    $('dialog').get(0).showModal();
  },
  hideModal() {
    $('dialog').get(0).close();
  }
});

const events = {
  'click .search input'({tpl}) {
    tpl.openModal();
  },
  'click dialog'({event, tpl}) {
    if($(event.target).is('dialog')) {
      tpl.hideModal();
    }
  }
};

const GlobalSearch = createComponent({
  tagName: 'global-search',
  template,
  css,
  createInstance,
  events,
});

export default GlobalSearch;
export { GlobalSearch };
