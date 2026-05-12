import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  value: 0,
  max: 100,
  min: 0,
  showLabel: true,
  animated: true,
  size: 'medium',
  theme: 'primary',
  inlineLabel: true,
  completeText: 'Complete',
};


const createComponent = ({ self, settings }) => ({
  getPercentage() {
    const { value, min, max } = settings;
    const range = max - min;
    const adjustedValue = Math.max(min, Math.min(max, value));
    return ((adjustedValue - min) / range) * 100;
  },

  isComplete() {
    return settings.value >= settings.max;
  },

  isLabelInline() {
    if (settings.size === 'mini') {
      return false;
    }
    return settings.inlineLabel;
  },

  getDisplayPercentage() {
    const percentage = Math.round(self.getPercentage());
    return `${percentage}%`;
  },

  getBarClasses() {
    return {
      [settings.size]: true,
      [settings.theme]: true,
      'active': settings.animated && settings.value < settings.max,
      'complete': self.isComplete()
    };
  }
});


export const ProgressBar = defineComponent({
  tagName: 'progress-bar',
  template,
  css,
  defaultSettings,
  createComponent,
});
