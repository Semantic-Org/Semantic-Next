import { createComponent, getText } from '@semantic-ui/component';
const template = await getText('./component.html');
const css = await getText('./component.css');

const settings = {
  placeholder: 'Search...',
};

const state = {
  searchTerm: '',
  fruits: ['Tomato', 'Strawberry', 'Blueberry', 'Kumquat', 'Banana'],
  results: [],
  selectedResult: '',
  selectedIndex: -1,
};

const createInstance = ({tpl, reaction, state, settings, bindKey, unbindKey, $}) => ({

  initialize() {
    tpl.calculateResults();
  },

  calculateResults() {
    reaction(() => {
      const searchTerm = state.searchTerm.get();

      let initialIndex;

      unbindKey('enter');
      if(searchTerm !== '') {
        // only bind enter key if we have search term
        initialIndex = 0;
        console.log('binding');
        bindKey('enter', () => tpl.selectResult());
      }
      else {
        initialIndex = -1;
      }

      // Select first result
      state.selectedIndex.set(initialIndex);

      // Simulating search results
      const results = state.fruits.get();
      const matchingResults = results.filter(r => r.toLowerCase().includes(searchTerm.toLowerCase()));
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
      tpl.clearSearch();
    }
  },

  clearSearch() {
    $('input').val('');
    state.searchTerm.set('');
    state.selectedIndex.set(-1);
  },

});

const keys = {
  'ctrl + f'({tpl}) {
    tpl.focusSearch();
  },
  'up'({tpl}) {
    tpl.selectPrevious();
  },
  'down'({tpl}) {
    tpl.selectNext();
  },
  'esc'({tpl}) {
    tpl.clearSearch();
  }
};

const events = {
  'input .search'({event, state }) {
    state.searchTerm.set(event.target.value);
  },
  'click .result'({tpl, data}) {
    tpl.selectResult(data.index);
  }
};

const SearchComponent = createComponent({
  tagName: 'search-component',
  keys,
  template,
  css,
  events,
  createInstance,
  settings,
  state
});

export default SearchComponent;
