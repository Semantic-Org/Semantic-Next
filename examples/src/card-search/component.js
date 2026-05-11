import { defineComponent } from '@semantic-ui/component';
import { weightedObjectSearch } from '@semantic-ui/utils';

// sub templates
import { card } from './card.js';

// data source for friends
import { friends } from './data.js';

import css from './component.css?raw';
import template from './component.html?raw';
// component resources
const defaultState = {
  filter: 'all',
  searchTerm: '',
  friends,
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
    if (filter !== 'all') {
      friends = friends.filter(friend => friend.gender === filter);
    }

    // filter by search term
    const searchTerm = state.searchTerm.get();
    if (searchTerm) {
      friends = weightedObjectSearch(searchTerm, friends, {
        propertiesToMatch: ['name', 'joined', 'location', 'role'],
      });
    }
    return friends;
  },
});

const events = {
  'change ui-menu'({ state, data }) {
    state.filter.set(data.value);
  },
  'input ui-input'({ state, value }) {
    state.searchTerm.set(value);
  },
};

export const FriendDirectory = defineComponent({
  tagName: 'friend-directory',
  template,
  renderingEngine: 'native',
  css,
  defaultState,
  events,
  createComponent,
  subTemplates: {
    card,
  },
});
