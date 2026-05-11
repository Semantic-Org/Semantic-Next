import { defineComponent } from '@semantic-ui/component';

import template from './component.html?raw';
import css from './component.css?raw';
const defaultSettings = {
  min: 1,
  max: 10,
  initialValue: 5,
  showLabels: true,
};

const defaultState = {
  rating: 0,
  dragging: false,
  currentPercentage: 0,
};

const createComponent = ({ $, self, state, settings, dispatchEvent }) => ({
  initialize() {
    state.rating.set(settings.initialValue);
  },

  ratingPercentage() {
    const { min, max } = settings;
    return ((state.rating.get() - min) / (max - min)) * 100;
  },

  setRating(value) {
    const { min, max } = settings;
    const newValue = Math.max(min, Math.min(max, value));

    if (newValue !== state.rating.get()) {
      state.rating.set(newValue);
      dispatchEvent('change', {
        rating: newValue,
        min: settings.min,
        max: settings.max,
      });
    }
  },

  resetRating() {
    self.setRating(settings.initialValue);
  },

  updateRatingFromEvent(event) {
    const rect = $('.slider').bounds();
    const rawPosition = (event.clientX - rect.left) / rect.width;
    const position = Math.max(0, Math.min(1, rawPosition));
    const { min, max } = settings;
    state.currentPercentage.set(position * 100);
    self.setRating(Math.round(min + position * (max - min)));
  },
});

const events = {
  'pointerdown .slider'({ self, state, event }) {
    state.dragging.set(true);
    self.updateRatingFromEvent(event);
    return 'cancel';
  },

  'global pointermove html'({ self, state, event }) {
    if (!state.dragging.get()) {
      return;
    }
    self.updateRatingFromEvent(event);
  },

  'global pointerup html'({ state, dispatchEvent }) {
    if (!state.dragging.get()) {
      return;
    }
    state.currentPercentage.set(0);
    state.dragging.set(false);
    dispatchEvent('finalized', {
      rating: state.rating.get(),
    });
  },

  'click .reset'({ self }) {
    self.resetRating();
  },
};

// Define and export the component
export const RatingSlider = defineComponent({
  tagName: 'rating-slider',
  template,
  css,
  defaultSettings,
  defaultState,
  createComponent,
  events,
});
