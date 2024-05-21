import { UIIcon } from '@semantic-ui/core';

import { createComponent } from '@semantic-ui/component';
import { get } from '@semantic-ui/utils';
import template from './ThemeSwitcher.html?raw';
import css from './ThemeSwitcher.css?raw';


const state = {
  theme: undefined
};

const createInstance = function ({ $, isServer, reaction, state, tpl }) {
  return {
    getLocalTheme() {
      if(isServer) {
        return 'light';
      }
      return tpl.getThemePreference() || tpl.getSystemPreference();
    },
    getThemePreference() {
      return localStorage.getItem('theme');
    },
    getSystemPreference() {
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
          $('body').removeClass('dark').addClass('light');
        }
        else {
          $('body').removeClass('light').addClass('dark');
        }
      });
    }
  };
};

const onCreated = function({tpl, reaction, reactiveVar, state, isClient}) {
  state.theme.set(tpl.getLocalTheme());
  if(isClient) {
    tpl.calculateTheme();
  }
};


const events = {
  'click'({tpl, state}) {
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

const ThemeSwitcher = createComponent({
  tagName: 'theme-switcher',
  template,
  events,
  css,
  state,
  onCreated,
  createInstance,
});

export default ThemeSwitcher;
export { ThemeSwitcher };
