import { createComponent } from '@semantic-ui/component';
import { } from '@semantic-ui/utils';

import template from './GlobalSearch.html?raw';
import css from './GlobalSearch.css?raw';

const createInstance = ({tpl, el, settings, $}) => ({
  openModal() {
    console.log('got here');
  }
});

const events = {
  'input .search input'({event, tpl}) {
    tpl.openModal();
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
