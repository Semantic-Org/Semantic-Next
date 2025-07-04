import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  minChars: 1,
  searchItems: [
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
  ],
};

const defaultState = {
  value: '',
  searchTerm: '',
  focused: false,
};

const createComponent = ({ $, state, settings, self }) => ({
  async getResults(term) {
    const SIMULATED_DELAY = 200;
    const matchResult = (result) => result.title.toLowerCase().includes(term.toLowerCase());
    return new Promise((resolve, reject) => {
      // simulate async search with occasional errors for testing
      clearTimeout(self.timer);
      self.timer = setTimeout(() => {
        const matchingResults = settings.searchItems.filter(matchResult);
        resolve(matchingResults);
      }, SIMULATED_DELAY);
    });
  },

  canSearch() {
    return state.focused.get() && state.searchTerm.get().length >= settings.minChars;
  },

  setValue({ title, id }) {
    // clear search
    state.searchTerm.set('');

    // set input to current value
    $('input').val(title);

    // set component value
    state.value.set(id);
  },
});

const events = {
  'input input'({ event, state, value }) {
    state.searchTerm.set(value || '');
  },
  'mousedown .result'({ self, data }) {
    self.setValue(data);
  },
  'focus input'({ state }) {
    state.focused.set(true);
  },
  'blur input'({ state }) {
    state.focused.set(false);
  },
};

defineComponent({
  tagName: 'ui-search',
  template,
  events,
  css,
  defaultState,
  defaultSettings,
  createComponent,
});
