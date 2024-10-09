import { createComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const state = {
  value: '',
  searchTerm: '',
  searchResults: [],
  focused: false,
  isSearching: false
};

const settings = {
  minChars: 1
};

const createInstance = ({ $, state, settings, self, reaction }) => ({

  initialize() {
    self.calculateResults();
  },

  calculateResults() {
    reaction(() => {
      const term = state.searchTerm.get();
      if (self.canSearch()) {
        self.query(term);
      }
      else {
        state.searchResults.set([]);
      }
    });
  },

  async query(term) {
    state.isSearching.set(true);
    try {
      const results = await self.getResults(term);
      state.searchResults.set(results);
    }
    catch (error) {
      console.error('Search failed:', error);
      state.searchResults.set([]);
    }
    finally {
      state.isSearching.set(false);
    }
  },

  getResults(term) {
    const fruits = [
      { id: 'apple', title: 'Apple' },
      { id: 'banana', title: 'Banana' },
      { id: 'orange', title: 'Orange' },
      { id: 'strawberry', title: 'Strawberry' },
      { id: 'grape', title: 'Grape' },
      { id: 'watermelon', title: 'Watermelon' },
      { id: 'pineapple', title: 'Pineapple' },
      { id: 'mango', title: 'Mango' },
      { id: 'pear', title: 'Pear' },
      { id: 'cherry', title: 'Cherry' },
      { id: 'blueberry', title: 'Blueberry' },
      { id: 'peach', title: 'Peach' },
      { id: 'kiwi', title: 'Kiwi' },
      { id: 'plum', title: 'Plum' },
      { id: 'raspberry', title: 'Raspberry' }
    ];
    const matchResult = (result) => result.title.toLowerCase().includes(term.toLowerCase());
    return new Promise((resolve) => {
      setTimeout(() => {
        const matchingFruits = fruits.filter(matchResult);
        resolve(matchingFruits);
      }, 500);
    });
  },

  canSearch() {
    return state.focused.get() && state.searchTerm.value.length >= settings.minChars;
  },

  setValue({title, id}) {
    // clear search
    state.searchTerm.set('');

    // set input to current value
    $('input').val(title);

    // set component value
    state.value.set(id);

  },

});

const events = {
  'input input'({ event, state }) {
    state.searchTerm.set(event.target.value);
  },
  'mousedown .result'({ self, data }) {
    self.setValue(data);
  },
  'focus input'({state}) {
    state.focused.set(true);
  },
  'blur input'({state}) {
    state.focused.set(false);
  }
};

createComponent({
  tagName: 'ui-search',
  template,
  events,
  css,
  state,
  settings,
  createInstance,
});
