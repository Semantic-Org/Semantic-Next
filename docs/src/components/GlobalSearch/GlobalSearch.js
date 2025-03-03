import { defineComponent } from '@semantic-ui/component';

import template from './GlobalSearch.html?raw';
import css from './GlobalSearch.css?raw';

import { UIModal } from '@semantic-ui/core';

const defaultSettings = {
  baseURL: '/',
  bundlePath: '/pagefind/',
  importPath: 'pagefind.js',
  openKey: 'ctrl + k',
  resultsPerPage: 20,
  debounceTime: 200
};

const defaultState = {
  rawResults: [],
  results: [],
  displayResults: [],
  selectedIndex: 0,
  selectedResult: undefined,
  resultOffset: 0,
  searchTerm: '',
  noResults: false,
  modalOpen: false,
};

const createComponent = ({self, el, bindKey, reaction, state, isRendered, settings, isServer, $}) => ({

  initialize() {
    if(isServer) {
      return;
    }
    bindKey(settings.openKey, self.openModal);
    self.calculateResults();
    self.calculateLoadSearch();
    self.calculateSelected();
  },

  openModal() {
    const val = $('.inline-search input').val();
    $('ui-modal').component().show();
    $('ui-modal').find('.search input').focus().val(val);
  },

  hideModal() {
    $('ui-modal').get(0).component.hide();
  },

  async calculateLoadSearch() {
    reaction(async (reaction) => {
      const { Instance } = await import('@pagefind/modular-ui');
      this.search = new Instance({
        bundlePath: settings.bundlePath
      });
      this.search.on('search', (term) => {
        state.searchTerm.set(term);
      });
      this.search.on('loading', () => {
        state.noResults.set(false);
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
        .map(result => self.mapResult(result))
        .filter(result => result.title)
      ;
      state.selectedIndex.set(0);
      if(displayResults.length == 0 && state.searchTerm.get()) {
        state.noResults.set(true);
      }
      state.displayResults.set(displayResults);
    });
  },

  calculateSelected() {
    reaction(() => {
      let index = state.selectedIndex.get();
      let result = state.displayResults.getIndex(index);
      state.selectedResult.set(result);
      self.scrollIntoView(index);
    });
  },

  scrollIntoView(index) {
    if(!isRendered()) {
      return;
    }
    const element = $('.results .result').get(index);
    const container = $('.results').get(0);
    if(!element) {
      return;
    }
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const notOnPage = elementRect.top < containerRect.top || elementRect.bottom > containerRect.bottom;
    if (notOnPage) {
      element.scrollIntoView({ block: 'nearest' });
    }
  },

  mapResult(result) {
    const primaryResult = result.sub_results[0];
    const otherResults = result.sub_results.slice(1);
    const title = primaryResult.title;
    let tags = [];
    let subtitle;
    if(result.meta.title && primaryResult.title !== result.meta.title) {
      subtitle = result.meta.title;
    }
    if(result.meta.tab) {
      tags.push({ text: result.meta.tab});
    }
    if(result.meta.pageType) {
      const colors = {
        'Guide': 'orange',
        'Example': 'purple',
        'UI Components': 'blue',
      };
      const text = result.meta.pageType;
      const color = colors[text];
      tags.push({ text, color });
      if(text == 'Example') {
        if(result.meta.category) {
          tags.push({text: result.meta.category});
        }
        if(result.meta.subcategory) {
          tags.push({text: result.meta.subcategory});
        }
      }
    }
    const displayResult = {
      title: title,
      subtitle: subtitle,
      tags: tags,
      description: result.meta.description,
      url: primaryResult.url || result.url,
      meta: result.meta,
      excerpt: result.excerpt,
      subResults: otherResults,
      rawResult: result
    };
    return displayResult;
  },

  selectPrevious() {
    if(state.selectedIndex.get() > 0) {
      state.selectedIndex.decrement();
    }
  },
  selectNext() {
    if(state.selectedIndex.get() < state.displayResults.peek().length - 1) {
      state.selectedIndex.increment();
    }
  },
  visitResult() {
    let result =  state.selectedResult.get();
    window.location.href = result.url;
    self.hideModal();
  }

});

const keys = {
  'up'({self, state}) {
    if(!state.modalOpen.get()) {
      return;
    }
    self.selectPrevious();
  },
  'down'({self, state}) {
    if(!state.modalOpen.get()) {
      return;
    }
    self.selectNext();
  },
  'enter'({self, state}) {
    if(!state.modalOpen.get()) {
      return;
    }
    self.visitResult();
  }
};

const events = {
  'input, click .inline-search'({self}) {
    self.openModal();
  },
  'change .search ui-input'({self, settings, value}) {
    if(self.doSearch) {
      self.doSearch.cancel();
    }
    self.search.triggerSearch(value);
  },
  'show ui-modal'({state}) {
    state.modalOpen.set(true);
  },
  'hide ui-modal'({state}) {
    state.modalOpen.set(false);
  }
};

const GlobalSearch = defineComponent({
  tagName: 'global-search',
  template,
  css,
  createComponent,
  events,
  keys,
  defaultState,
  defaultSettings,
});

export default GlobalSearch;
export { GlobalSearch };
