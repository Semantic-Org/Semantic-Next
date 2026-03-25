import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  minChars: 1,
  items: [
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
    { id: 'raspberry', title: 'Raspberry' },
  ]
};

const defaultState = {
  value: '',
  searchTerm: '',
  menuVisible: false,
  selectedIndex: -1,
};

const createComponent = ({ $, state, settings, self }) => ({
  results: [],

  async getResults(term) {
    const SIMULATED_DELAY = 200;
    const matchResult = (result) => result.title.toLowerCase().includes(term.toLowerCase());
    return new Promise((resolve) => {
      clearTimeout(self.timer);
      self.timer = setTimeout(() => {
        const matchingResults = settings.items.filter(matchResult);
        self.setResults(matchingResults);
        requestAnimationFrame(() => resolve(matchingResults));
      }, SIMULATED_DELAY);
    });
  },

  setResults(results) {
    self.results = results;
    state.selectedIndex.set(0);
  },

  canSearch() {
    return state.menuVisible.get() && state.searchTerm.get().length >= settings.minChars;
  },

  selectPrevious() {
    const index = state.selectedIndex.get();
    if (index > 0) {
      state.selectedIndex.decrement();
    }
  },

  selectNext() {
    const index = state.selectedIndex.get();
    if (index < self.results.length - 1) {
      state.selectedIndex.increment();
    }
  },

  selectCurrent() {
    const index = state.selectedIndex.get();
    const result = self.results[index];
    console.log(index, result);
    if (result) {
      self.clearSearch();
      self.setValue(result);
    }
  },

  showMenu() {
    state.menuVisible.set(true);
  },

  hideMenu() {
    state.menuVisible.set(false);
  },

  clearSearch() {
    self.hideMenu();
    state.searchTerm.set('');
    state.selectedIndex.set(-1);
  },

  setValue({ title, id }) {
    state.searchTerm.set(title);
    state.value.set(id);
  },
});

const events = {
  'input ui-input'({ state, value = '' }) {
    state.searchTerm.set(value || '');
  },
  'mousedown .result'({ self, data }) {
    self.setValue(data);
  },
  'focus, input ui-input'({ self }) {
    self.showMenu();
  },
  'blur ui-input'({ self }) {
    self.hideMenu();
  },
};

const keys = {
  'up'({ self }) {
    self.selectPrevious();
  },
  'down'({ self }) {
    self.selectNext();
  },
  'enter'({ self }) {
    self.selectCurrent();
  },
  'esc'({ self }) {
    self.clearSearch();
  },
};

defineComponent({
  tagName: 'ui-search',
  template,
  events,
  keys,
  css,
  defaultState,
  defaultSettings,
  createComponent,
});
