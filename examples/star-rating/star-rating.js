import { defineComponent } from '@semantic-ui/component';

import css from './star-rating.css?raw';
import template from './star-rating.html?raw';

const settings = {
  value: 0,
  maxValue: 5,
  locked: false,
  showValue: true,
  size: 'medium'
};

const state = {
  rating: 0,
  hoveredIndex: -1,
  starArray: []
};

const createComponent = ({dispatchEvent, data, state, settings}) => ({
  initialize() {
    console.log(data);
    state.rating.set(settings.value);
    state.starArray.set(Array(settings.maxValue).fill(0));
  },

  getStarClasses(index) {
    return {
      hovered: index <= state.hoveredIndex.get(),
      filled: index < state.rating.get()
    };
  },

  getRatingClasses() {
    return {
      locked: settings.locked,
      [settings.size]: true
    };
  },

  setRating(rating) {
    if (!settings.locked) {
      state.rating.set(rating);
      dispatchEvent('change', { rating });
    }
  }
});

const events = {
  'mouseenter div.star'({state, data}) {
    state.hoveredIndex.set(+data.index);
  },
  'mouseleave div.star'({state, data}) {
    state.hoveredIndex.clear();
  },
  'click div.star'({self, data}) {
    const rating = Number(data.index) + 1;
    self.setRating(rating);
  }
};

export const StarRating = defineComponent({
  tagName: 'star-rating',
  template,
  css,
  createComponent,
  settings,
  state,
  events
});
