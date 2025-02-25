import { defineComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');
const css = await getText('./component.css');

const defaultSettings = {
  min: 1,
  max: 10,
  initialValue: 5,
  showLabels: true
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

  getSliderStyles() {
    return {
      dragging: state.dragging.get()
    };
  },

  getLabelStyles(number) {
    return {
      current: state.rating.get() == number
    };
  },

  getRatingPercentage() {
    const { min, max } = settings;
    const rating = state.rating.get();
    return ((rating - min) / (max - min)) * 100;
  },

  getPercentage() {
    if(state.currentPercentage.get()) {
      return state.currentPercentage.get();
    }
    return self.getRatingPercentage();
  },

  getGuidePercentage() {
    if(!state.currentPercentage.get()) {
      return;
    }
    return self.getRatingPercentage();
  },

  setRating(value) {
    const { min, max } = settings;
    const newValue = Math.max(min, Math.min(max, value));

    if (newValue !== state.rating.get()) {
      state.rating.set(newValue);

      // Dispatch custom event that parent components can listen to
      dispatchEvent('change', {
        rating: newValue,
        min: settings.min,
        max: settings.max
      });
    }
  },

  resetRating() {
    self.setRating(settings.initialValue);
  },

  updateRatingFromEvent(event) {
    const slider = $('.slider').el();
    const rect = slider.getBoundingClientRect();
    const position = (event.clientX - rect.left) / rect.width;
    const percentage = position * 100;
    const { min, max } = settings;
    const value = Math.round(min + position * (max - min));
    state.currentPercentage.set(percentage);
    self.setRating(value);
  }
});

const events = {
  'pointerdown'({ self, state, event }) {
    state.dragging.set(true);
    self.updateRatingFromEvent(event);
    event.preventDefault();
  },

  'global pointermove body'({ self, state, event }) {
    if(!state.dragging.get()) {
      return;
    }
    self.updateRatingFromEvent(event);
  },

  'global pointerup body'({ state, dispatchEvent }) {
    if(!state.dragging.get()) {
      return;
    }
    state.currentPercentage.set(0);
    state.dragging.set(false);
    dispatchEvent('finalized', {
      rating: state.rating.get()
    });
  },

  'click .reset'({ self }) {
    self.resetRating();
  }
};

// Define and export the component
defineComponent({
  tagName: 'rating-slider',
  template,
  css,
  defaultSettings,
  defaultState,
  createComponent,
  events
});
