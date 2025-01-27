// component.js
import { defineComponent, getText } from '@semantic-ui/component';
import { $ } from '@semantic-ui/query';

const css = await getText('./component.css');
const template = await getText('./component.html');

const settings = {
  presets: [
    {
      name: 'Ocean',
      primary: 'oklch(0.56 0.21 251)',
      secondary: 'oklch(0.65 0.14 188.03)'
    },
    {
      name: 'Sunset',
      primary: 'oklch(0.59 0.27 29)',
      secondary: 'oklch(0.65 0.2 44.37)'
    },
    {
      name: 'Forest',
      primary: 'oklch(0.62 0.26 145.53)',
      secondary: 'oklch(0.69 0.19 119.53)'
    },
    {
      name: 'Berry',
      primary: 'oklch(0.54 0.26 314.43)',
      secondary: 'oklch(0.46 0.26 283.29)'
    }
  ]
};

const state = {
  activeTheme: null,
  customizing: false
};

const createComponent = ({self, el, state, settings}) => ({
  initialize() {
    if (settings.presets?.[0]) {
      self.applyTheme(settings.presets[0]);
    }
  },

  getThemeClasses() {
    return {
      picker: true,
      customizing: state.customizing.get()
    };
  },

  getPresetClasses(preset) {
    const activeTheme = state.activeTheme.get();
    return {
      preset: true,
      active: activeTheme && activeTheme.name === preset.name
    };
  },

  applyTheme(theme) {
    state.activeTheme.set(theme);
    $(el)
      .cssVar('primary-color', theme.primary)
      .cssVar('secondary-color', theme.secondary)
    ;
  },

  startCustomizing() {
    state.customizing.set(true);
  },

  updateThemeColor(type, color) {
    const theme = state.activeTheme.get() || {};
    theme[type] = color;
    self.applyTheme(theme);
  }
});

const events = {
  'click .preset'({self, data}) {
    const preset = settings.presets[+data.index];
    self.applyTheme(preset);
  },

  'input .color-input'({self, event, data}) {
    self.updateThemeColor(data.type, event.target.value);
  }
};

defineComponent({
  tagName: 'theme-preview',
  template,
  css,
  createComponent,
  settings,
  state,
  events
});
