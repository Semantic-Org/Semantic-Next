import { Tooltip } from '@semantic-ui/core';
import pretty from 'pretty';
import { codeToHtml } from 'shiki';

import { defineComponent } from '@semantic-ui/component';
import css from './CodeSample.css?raw';
import template from './CodeSample.html?raw';

import { Reaction, Signal } from '@semantic-ui/reactivity';
import { copyText } from '@semantic-ui/utils';

const defaultSettings = {
  language: 'html',
  languageMenu: 'auto',
  code: '',
  formattedCode: '',
  copyable: true,
  segment: true,
  attached: false,
  onCodeVisible: function() {},
};

const defaultState = {
  formattedCode: null,
  languages: [],
  language: null,
  slottedCode: null,
};

const createComponent = ({ el, $, settings, reaction, darkMode, self, state, afterFlush }) => ({
  initialize() {
    // allow slotted content for code instead
    if (!settings.code && el.innerHTML) {
      settings.code = el.innerHTML;
    }
    self.configureFormatting();
    self.formatCode();
  },

  getCode() {
    let code;
    if (settings.code) {
      code = settings.code;
    }
    else if (self.slottedCode.get()) {
      code = self.slottedCode.get();
    }
    return code;
  },

  async formatCode(useDarkMode = darkMode) {
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
    afterFlush(() => settings.onCodeVisible(formattedCode.value, settings.code));
    return formattedCode;
  },

  configureFormatting() {
    // nothing yet
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

const onRendered = ({ $, isServer, self }) => {
  if (isServer) {
    return;
  }
  $('ui-icon[copy]').tooltip({
    onHidden: function() {
      $(this).tooltip('set text', 'Copy Code');
    },
  });
};

const onThemeChanged = function({ self, isClient, darkMode, settings }) {
  self.formatCode(darkMode);
};

const events = {
  'click ui-icon[copy]'({ event, target, settings }) {
    copyText(settings.code);
    $(target)
      .tooltip('set text', 'Copied!');
    const $tooltip = $(target).tooltip('get tooltip');
    $tooltip.transition('jiggle');
  },
};

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
