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
  copyable: true,
  segment: true,
  attached: false,
  onCodeVisible: function() {},
};

const createComponent = ({ el, $, settings, reaction, darkMode, self }) => ({
  // internal
  code: new Signal(false),
  language: new Signal(''),
  languages: new Signal([]),
  slottedCode: new Signal(false),
  formattedCode: new Signal(''),

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

  watchCode() {
    reaction(async () => {
      self.language.get(); // reactivity source
      let code = self.getCode();
      if (code) {
        if (settings.language == 'html') {
          code = self.formatHTML(code);
        }
        self.code.set(code);
        await self.highlight(code);
      }
    });
  },

  async highlight(code = self.getCode(), darkModeOverride) {
    let useDarkMode = (darkModeOverride !== undefined)
        ? darkModeOverride
        : darkMode,
      language = self.language.get(),
      formattedCode = await codeToHtml(code, {
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
    self.formattedCode.set(formattedCode);
    Reaction.afterFlush(function() {
      settings.onCodeVisible(formattedCode.value, self.code.get());
    });
  },

  configureHighlighting() {
    // nothing yet
  },

  get: {
    languages() {
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
  },

  formatHTML: function(html) {
    return pretty(html, { ocd: true });
  },

  set: {
    language() {
      if (settings.language) {
        self.language.set(settings.language);
      }
    },
    slottedCode() {
      let slottedCode = el.innerHTML;
      if (slottedCode) {
        self.slottedCode.set(slottedCode);
      }
    },
  },
});

const onCreated = function({ self }) {
  self.set.slottedCode();
  self.set.language();
  self.configureHighlighting();
  self.watchCode();
};

const onRendered = ({ $, isServer, self }) => {
  if (isServer) {
    return;
  }
  $('ui-icon').tooltip();
};

const onThemeChanged = function({ self, isClient, darkMode, settings }) {
  self.highlight(self.getCode(), darkMode);
};

const events = {
  'click ui-icon[copy]'({ event, self }) {
    copyText(self.code.get());
  },
};

const CodeSample = defineComponent({
  tagName: 'code-sample',
  template,
  events,
  css,
  onCreated,
  onRendered,
  onThemeChanged,
  createComponent,
  defaultSettings,
});

export default CodeSample;
export { CodeSample };
