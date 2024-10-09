import { createComponent, getText } from '@semantic-ui/component';
const template = await getText('./component.html');
const css = await getText('./component.css');

const settings = {
  placeholder: 'Search...',
  options: [],
  noun: 'item',
};

const state = {
  searchTerm: '',
  results: [],
  selectedResult: '',
  selectedIndex: -1,
};

const createInstance = ({ self, reaction, state, settings, bindKey, unbindKey, $ }) => ({

  initialize() {
    self.calculateResults();
    self.calculateKeybindings();
  },

  /*
    This is an example of dynamic keybinding
    we want these to only occur when we have a
    selected index
  */
  calculateKeybindings() {
    reaction(() => {
      const selectedIndex = state.selectedIndex.get();
      unbindKey('enter');
      if(selectedIndex > -1) {
        bindKey('enter', () => self.selectResult());
      }
    });
  },

  calculateResults() {
    reaction(() => {
      const searchTerm = state.searchTerm.get();

      // Select first result
      const initialIndex = searchTerm == '' ? -1 : 0;
      state.selectedIndex.set(initialIndex);

      // Simulating search results
      const results = settings.options;
      const matchResult = (result) => result.toLowerCase().includes(searchTerm.toLowerCase());
      const matchingResults = results.filter(matchResult);
      state.results.set(matchingResults);
    });
  },

  focusSearch() {
    $('input').focus();
  },

  selectPrevious() {
    if(state.selectedIndex.get() == -1) {
      state.selectedIndex.set(state.results.get().length - 1);
    }
    else if(state.selectedIndex.get() > 0) {
      state.selectedIndex.decrement();
    }
  },

  selectNext() {
    if(state.selectedIndex.get() < state.results.get().length - 1) {
      state.selectedIndex.increment();
    }
  },

  selectResult(selectedIndex = state.selectedIndex.get()) {
    const results = state.results.get();
    const selectedResult = results[selectedIndex];
    if(selectedResult) {
      state.selectedResult.set(selectedResult);
      self.clearSearch();
    }
  },

  clearSearch() {
    $('input').val('');
    state.searchTerm.set('');
    state.selectedIndex.set(-1);
  },

});

/*
  This is an example of static keybindings
  these will exist for as long as the component is rendered
*/

const keys = {
  'ctrl + f'({ self }) {
    self.focusSearch();
  },
  'up'({ self }) {
    self.selectPrevious();
  },
  'down'({ self }) {
    self.selectNext();
  },
  'esc'({ self }) {
    self.clearSearch();
  }
};

const events = {
  'input .search'({ event, state }) {
    state.searchTerm.set(event.target.value);
  },
  'click .result'({ self, data }) {
    self.selectResult(data.index);
  }
};

createComponent({
  tagName: 'search-component',
  keys,
  template,
  css,
  events,
  createInstance,
  settings,
  state
});
