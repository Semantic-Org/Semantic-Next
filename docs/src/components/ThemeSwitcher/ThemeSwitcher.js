import { UIIcon } from '@semantic-ui/core';

import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import { get } from '@semantic-ui/utils';
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
      const icons = {
        dark: 'moon',
        light: 'sun'
      };
      const icon = get(icons, tpl.theme.get());
      return icon;
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
  tpl.theme.set(tpl.getLocalTheme());
  if(isClient) {
    tpl.calculateTheme();
  }
};


const events = {
  'click .hitbox'({tpl}) {
    const currentTheme = tpl.theme.get();
    const newTheme = (currentTheme == 'light')
      ? 'dark'
      : 'light'
    ;
    tpl.theme.set(newTheme);
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
  onCreated,
  createInstance,
});

export default ThemeSwitcher;
export { ThemeSwitcher };
