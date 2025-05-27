import { defineComponent, getText } from '@semantic-ui/component';
import { copyText } from '@semantic-ui/utils';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  // Available color names for display
  colors: [
    'red',
    'orange',
    'yellow',
    'olive',
    'green',
    'teal',
    'blue',
    'violet',
    'purple',
    'pink',
    'brown',
    'grey',
  ],
  // Color scale steps to show
  steps: [0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  // Whether to show color values
  showValues: true,
  // Whether to show copy functionality
  showCopy: true
};

const defaultState = {
  copiedColor: '',
  copyTimeout: null
};

const createComponent = ({ self, state, settings, $, isServer, dispatchEvent }) => ({
  
  // Get all color data for display
  getColorData() {
    const colors = settings.colors;
    const steps = settings.steps;
    return colors.map(colorName => ({
      name: colorName,
      displayName: colorName.charAt(0).toUpperCase() + colorName.slice(1),
      steps: steps.map(step => ({
        step,
        cssVar: `--${colorName}-${step}`,
        textVar: (step < 50) ? `--${colorName}-90`: `--${colorName}-10`,
        value: self.getColorValue(colorName, step)
      }))
    }));
  },

  // Get computed color value from CSS
  getColorValue(colorName, step) {
    if(isServer) {
      return;
    }
    const cssVar = `--${colorName}-${step}`;
    const computed = getComputedStyle(document.documentElement);
    return computed.getPropertyValue(cssVar).trim();
    console.log(`--${colorName}-${step}`, $('.color-palette').cssVar(`${colorName}-${step}`));
    return $('.color-palette').cssVar(`${colorName}-${step}`)
  },

  // Copy color value to clipboard
  async copyColor(colorName, step) {
    const cssVar = `--${colorName}-${step}`;
    const value = self.getColorValue(colorName, step);
    await copyText(value || cssVar);

    // Clear existing timeout
    const currentTimeout = state.copyTimeout.get();
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }

    // Set copied feedback
    state.copiedColor.set(`${colorName}-${step}`);

    // Clear feedback after 2 seconds
    self.timeout = setTimeout(() => {
      state.copiedColor.set(null);
      delete self.timeout;
    }, 2000);

    dispatchEvent('colorCopied', {
      colorName,
      step,
      cssVar,
      value
    });
  },

  // Check if a color is currently copied
  isColorCopied(colorName, step) {
    const copied = state.copiedColor.get();
    return copied === `${colorName}-${step}`;
  }
});

const events = {
  'click .swatch'({ self, settings, data, event }) {
    const { color, step } = data;
    if (settings.showCopy && color && step) {
      self.copyColor(color, step);
    }
  }
};


export const ColorPalette = defineComponent({
  tagName: 'color-palette',
  template,
  css,
  defaultSettings,
  defaultState,
  events,
  createComponent,
});
