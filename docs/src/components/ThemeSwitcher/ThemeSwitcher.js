import { UIIcon } from '@semantic-ui/core';

import { defineComponent } from '@semantic-ui/component';
import { get } from '@semantic-ui/utils';
import template from './ThemeSwitcher.html?raw';
import css from './ThemeSwitcher.css?raw';

const settings = {
  defaultTheme: 'light'
};

const state = {
  theme: undefined
};

const createComponent = function ({ $, isServer, reaction, state, settings, self }) {
  return {
    getLocalTheme() {
      return self.getThemePreference() || settings.defaultTheme || self.getSystemPreference();
    },
    getThemePreference() {
      if(isServer) {
        return;
      }
      return localStorage.getItem('theme');
    },
    getSystemPreference() {
      if(isServer) {
        return;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      ;
    },
    getIcon() {
      const icons = {
        dark: 'moon',
        light: 'sun'
      };
      const icon = get(icons, state.theme.get());
      return icon;
    },
    calculateTheme() {
      reaction((comp) => {
        let theme = state.theme.get();
        if(!theme || comp.isFirstRun) {
          return;
        }
        localStorage.setItem('theme', theme);
        if(theme == 'light') {
          $('html').removeClass('dark').addClass('light');
        }
        else {
          $('html').removeClass('light').addClass('dark');
        }
      });
    }
  };
};

const onCreated = function({self, reaction, reactiveVar, state, isClient}) {
  console.log('setting theme', self.getLocalTheme());
  state.theme.set(self.getLocalTheme());
  if(isClient) {
    self.calculateTheme();
  }
};


const events = {
  'click'({self, state}) {
    const currentTheme = state.theme.get();
    const newTheme = (currentTheme == 'light')
      ? 'dark'
      : 'light'
    ;
    state.theme.set(newTheme);
    $('html').dispatchEvent('themechange', {
      theme: newTheme,
      darkMode: newTheme == 'dark'
    });
  },
};

const ThemeSwitcher = defineComponent({
  tagName: 'theme-switcher',
  template,
  events,
  css,
  state,
  settings,
  onCreated,
  createComponent,
});

export default ThemeSwitcher;
export { ThemeSwitcher };
