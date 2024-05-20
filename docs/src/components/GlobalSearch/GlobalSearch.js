import { createComponent } from '@semantic-ui/component';
import { } from '@semantic-ui/utils';

import template from './GlobalSearch.html?raw';
import css from './GlobalSearch.css?raw';

const createInstance = ({tpl, el, settings, $}) => ({
  openModal() {
    $('dialog').get(0).showModal();
  },
  hideModal() {
    $('dialog').get(0).close();
  }
});

const events = {
  'input .search input'({event, tpl}) {
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
