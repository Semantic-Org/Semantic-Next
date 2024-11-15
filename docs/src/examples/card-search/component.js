import { defineComponent, getText } from '@semantic-ui/component';
import { each, escapeRegExp, get, weightedObjectSearch } from '@semantic-ui/utils';

// sub templates
import { card } from './card.js';

// data source for friends
import { friends } from './data.js';

// component resources
const css = await getText('./component.css');
const template = await getText('./component.html');


const state = {
  filter: 'all',
  searchTerm: '',
  friends
};

const createComponent = ({ state }) => ({

  filters: [
    { label: 'All', value: 'all' },
    { label: 'Female', value: 'female' },
    { label: 'Male', value: 'male' },
  ],

  getVisibleFriends() {
    let friends = state.friends.get();

    // filter by gender
    const filter = state.filter.get();
    if(filter !== 'all') {
      friends = friends.filter(friend => friend.gender === filter);
    }

    // filter by search term
    const searchTerm = state.searchTerm.get();
    if(searchTerm) {
      friends = weightedObjectSearch(searchTerm, friends, {
        propertiesToMatch: ['name', 'joined', 'location', 'role']
      });
    }
    return friends;
  }
});

const events = {
  'change ui-menu'({ state, data }) {
    state.filter.set(data.value);
  },
  
  'input .search'({ state, value }) {
    state.searchTerm.set(value);
  }
};

defineComponent({
  tagName: 'friend-directory',
  template,
  css,
  state,
  events,
  createComponent,
  subTemplates: {
    card
  }
});
