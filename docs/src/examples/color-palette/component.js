import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  // Available color names for display
  colors: ['red', 'blue', 'green', 'yellow'],
  // Color scale steps to show
  steps: [0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  // Whether to show color values
  showValues: true,
  // Whether to show copy functionality
  showCopy: true
};

const defaultState = {
  // Currently copied color
  copiedColor: null,
  // Timeout for copy feedback
  copyTimeout: null
};

const createComponent = ({ self, state, settings, dispatchEvent }) => ({
  
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
    if (typeof window === 'undefined') return '';
    
    const cssVar = `--${colorName}-${step}`;
    const computed = getComputedStyle(document.documentElement);
    return computed.getPropertyValue(cssVar).trim();
  },

  // Copy color value to clipboard
  async copyColor(colorName, step) {
    const cssVar = `--${colorName}-${step}`;
    const value = self.getColorValue(colorName, step);
    
    try {
      await navigator.clipboard.writeText(value || cssVar);
      
      // Clear existing timeout
      const currentTimeout = state.copyTimeout.get();
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
      
      // Set copied feedback
      state.copiedColor.set(`${colorName}-${step}`);
      
      // Clear feedback after 2 seconds
      const timeout = setTimeout(() => {
        state.copiedColor.set(null);
        state.copyTimeout.set(null);
      }, 2000);
      
      state.copyTimeout.set(timeout);
      
      dispatchEvent('colorCopied', { 
        colorName, 
        step, 
        cssVar, 
        value 
      });
    } catch (err) {
      console.warn('Failed to copy color:', err);
    }
  },

  // Check if a color is currently copied
  isColorCopied(colorName, step) {
    const copied = state.copiedColor.get();
    return copied === `${colorName}-${step}`;
  }
});

const events = {
  'click .swatch'({ self, settings, event }) {
    if (!settings.showCopy) return;
    
    const swatch = event.target.closest('.swatch');
    const colorName = swatch.dataset.color;
    const step = swatch.dataset.step;
    
    if (colorName && step) {
      self.copyColor(colorName, parseInt(step));
    }
  }
};


const onDestroyed = ({ state }) => {
  // Clean up timeout
  const timeout = state.copyTimeout.get();
  if (timeout) {
    clearTimeout(timeout);
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
  onDestroyed
});
