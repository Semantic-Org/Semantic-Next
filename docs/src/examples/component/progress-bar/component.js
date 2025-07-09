import { defineComponent, getText } from '@semantic-ui/component';
import { inArray } from '@semantic-ui/utils';

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


const createComponent = ({ self, state, settings, reaction }) => ({
  getPercentage() {
    const { value, min, max } = settings;
    const range = max - min;
    const adjustedValue = Math.max(min, Math.min(max, value));
    return ((adjustedValue - min) / range) * 100;
  },

  isComplete() {
    return settings.value >= 100;
  },

  isLabelInline() {
    if(inArray(settings.size, ['mini'])) {
      return false;
    }
    return settings.inlineLabel;
  },

  getDisplayPercentage() {
    const percentage = Math.round(self.getPercentage());
    return `${percentage}%`;
  },

  getSizeClass() {
    return `size-${settings.size}`;
  },

  getBarClasses() {
    return {
      [settings.size]: true,
      [settings.theme]: true,
      'active': settings.animated && settings.value < 100,
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
