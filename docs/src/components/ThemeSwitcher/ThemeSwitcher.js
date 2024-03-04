import { UIIcon } from '@semantic-ui/core';

import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import template from './ThemeSwitcher.html?raw';
import css from './ThemeSwitcher.css?raw';

const createInstance = function ({ $, isServer, tpl }) {
  return {
    theme: new ReactiveVar(),
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
      return (tpl.theme.get() == 'light')
        ? 'sun'
        : 'moon'
      ;
    },
    calculateTheme() {
      tpl.reaction((comp) => {
        let theme = tpl.theme.get();
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

const onCreated = function({tpl, isClient}) {
  if(isClient) {
    tpl.calculateTheme();
    tpl.theme.set(tpl.getLocalTheme());
  }
};


const events = {
  'click ui-icon'({tpl}) {
    const currentTheme = tpl.theme.get();
    const newTheme = (currentTheme == 'light')
      ? 'dark'
      : 'light'
    ;
    tpl.theme.set(newTheme);
  },
};

const ThemeSwitcher = createComponent({
  tagName: 'theme-switcher',
  template,
  events,
  css,
  onCreated,
  createInstance,
});

export default ThemeSwitcher;
export { ThemeSwitcher };
