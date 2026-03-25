import { CopyButton, Tooltip } from '@semantic-ui/core';
import pretty from 'pretty';
import { codeToHtml } from 'shiki';

import { defineComponent } from '@semantic-ui/component';
import css from './CodeSample.css?raw';
import template from './CodeSample.html?raw';

const defaultSettings = {
  language: 'html',
  languageMenu: 'auto',
  code: '',
  copyable: true,
  segment: true,
  attached: false,
};

const defaultState = {
  languages: [],
  language: null,
  darkMode: null,
};

const createComponent = ({ el, $, settings, reaction, darkMode, self, state, dispatchEvent }) => ({
  initialize() {
    state.darkMode.set(darkMode);
  },

  async formatCode(useDarkMode = state.darkMode.get()) {
    const language = settings.language;
    let code = settings.code;
    // format html
    if (settings.language == 'html') {
      code = pretty(settings.code, { ocd: true });
    }
    const formattedCode = await codeToHtml(code, {
      lang: language,
      theme: (useDarkMode)
        ? 'github-dark'
        : 'github-light',
      colorReplacements: {
        // dark mode
        '#85e89d': '#979797', // <foo
        '#e1e4e8': '#979797',
        '#b392f0': '#58C1FE', // attr
        '#032F62': '#6F42C1',
        '#FFAB70': '#58C1FE',
        // light mode
        '#22863a': '#777',
        '#24292e': '#777',
      },
    });
    dispatchEvent('formatted', { code: code, formattedCode: formattedCode });
    return formattedCode;
  },

  getLanguages() {
    let languages;
    if (settings.languageMenu !== 'auto') {
      languages = settings.languageMenu;
    }
    else if (settings.language == 'html') {
      languages = ['html', 'astro'];
    }
    else {
      languages = [settings.language];
    }
    return languages;
  },
});

const onRendered = ({ $, el, isServer, reaction, state, settings }) => {
  if (isServer) {
    return;
  }
  // allow slotted content for code instead
  if (!settings.code && el.innerHTML) {
    settings.code = el.innerHTML;
  }
};

const onThemeChanged = function({ state, darkMode }) {
  state.darkMode.set(darkMode);
};

const events = {};

const CodeSample = defineComponent({
  tagName: 'code-sample',
  template,
  events,
  css,
  onRendered,
  onThemeChanged,
  createComponent,
  defaultState,
  defaultSettings,
});

export default CodeSample;
export { CodeSample };
