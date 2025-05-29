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
  // Color scale shades to show
  shades: [0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  // Whether to show color values
  showValues: true,
  // Whether to show copy functionality
  showCopy: true
};

const defaultState = {
  copiedColor: '',
};

const createComponent = ({ self, state, settings, $, isServer, dispatchEvent }) => ({
  
  // Get all color data for display
  getColors() {
    const { colors, shades } = settings;
    const val = colors.map(colorName => ({
      name: colorName,
      displayName: colorName.charAt(0).toUpperCase() + colorName.slice(1),
      shades: shades.map(shade => ({
        name: shade,
        cssVar: `--${colorName}-${shade}`,
        // change text color depending on shade
        textVar: (shade < 50)
          ? `--${colorName}-90`
          : `--${colorName}-10`,
        value: self.getColorValue(colorName, shade)
      }))
    }));
    return val;
  },

  // Get computed color value from CSS
  getColorValue(colorName, shade) {
    if(isServer) {
      return;
    }
    const cssVar = `--${colorName}-${shade}`;
    const computed = getComputedStyle(document.documentElement);
    return computed.getPropertyValue(cssVar).trim();
  },

  // Copy color value to clipboard
  async copyColor(colorName, shade) {
    const cssVar = `--${colorName}-${shade}`;
    const value = self.getColorValue(colorName, shade);
    await copyText(value || cssVar);

    state.copiedColor.set(`${colorName}-${shade}`);

    clearTimeout(self.timeout);
    self.timeout = setTimeout(() => {
      state.copiedColor.set(null);
      delete self.timeout;
    }, 2000);

    dispatchEvent('colorCopied', {
      colorName,
      shade,
      cssVar,
      value
    });
  },

  // Check if a color is currently copied
  isColorCopied(colorName, shade) {
    const copied = state.copiedColor.get();
    return copied === `${colorName}-${shade}`;
  }
});

const events = {
  'click .swatch'({ self, settings, data, event }) {
    const { color, shade } = data;
    if (settings.showCopy && color && shade) {
      self.copyColor(color, shade);
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
