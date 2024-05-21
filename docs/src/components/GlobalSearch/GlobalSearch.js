import { createComponent } from '@semantic-ui/component';
import { } from '@semantic-ui/utils';

import template from './GlobalSearch.html?raw';
import css from './GlobalSearch.css?raw';

import { UIModal } from '@semantic-ui/core';

const settings = {
  baseURL: '/',
  bundlePath: '/pagefind/',
  importPath: 'pagefind.js',
  openKey: 'ctrl + k',
  resultsPerPage: 20,
};

const state = {
  rawResults: [],
  results: [],
  displayResults: [],
  selectedIndex: 0,
  resultOffset: 0,
  modalOpen: false,
};

const createInstance = ({tpl, el, bindKey, reaction, state, settings, $}) => ({

  initialize() {
    bindKey(settings.openKey, tpl.openModal);
    tpl.calculateResults();
    tpl.calculateLoadSearch();
  },

  openModal() {
    $('ui-modal').get(0).tpl.show();
  },

  hideModal() {
    $('ui-modal').get(0).tpl.hide();
  },

  async calculateLoadSearch() {
    reaction(async (reaction) => {
      const { Instance } = await import('@pagefind/modular-ui');
      this.search = new Instance({
        bundlePath: settings.bundlePath
      });
      this.search.on('results', (rawResults) => {
        state.rawResults.set(rawResults);
      });
      reaction.stop();
    });
  },

  async calculateResults() {
    reaction(async (reaction) => {
      const rawResults = state.rawResults.get();
      const startIndex = state.resultOffset.get();
      const endIndex = startIndex + settings.resultsPerPage;
      if(reaction.firstRun) {
        return;
      }

      const results = await Promise.all(rawResults.results.slice(startIndex, endIndex).map(r => r.data()));
      state.results.set(results);

      const displayResults = results
        .map(result => tpl.mapResult(result))
        .filter(result => result.title)
      ;
      state.displayResults.set(displayResults);
    });
  },

  mapResult(result) {
    const displayResult = {
      title: result.meta.title,
      description: result.meta.description,
      url: result.meta.url || result.url,
      meta: result.meta,
      rawResult: result
    };
    return displayResult;
  }
});

const keys = {
  'up'({state}) {
    if(!state.modalOpen.get()) {
      return;
    }
    console.log('up');
  },
  'down'({state}) {
    if(!state.modalOpen.get()) {
      return;
    }
    console.log('down');
  }
};

const events = {
  'click .inline-search input'({tpl}) {
    tpl.openModal();
  },
  'input .search input'({tpl, event}) {
    let searchTerm = $(event.target).val();
    tpl.search.triggerSearch(searchTerm);
  },
  'show ui-modal'({state}) {
    state.modalOpen.set(true);
  },
  'hide ui-modal'({state}) {
    state.modalOpen.set(false);
  }
};

const GlobalSearch = createComponent({
  tagName: 'global-search',
  template,
  css,
  createInstance,
  events,
  state,
  keys,
  settings,
});

export default GlobalSearch;
export { GlobalSearch };
