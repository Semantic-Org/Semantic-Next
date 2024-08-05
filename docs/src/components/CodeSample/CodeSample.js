import pretty from 'pretty';
import { codeToHtml } from 'shiki';

import { createComponent } from '@semantic-ui/component';
import template from './CodeSample.html?raw';
import css from './CodeSample.css?raw';

import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';
import { copyText } from '@semantic-ui/utils';


const settings = {
  language: 'html',
  languageMenu: 'auto',
  code: '',
  copyable: true,
  segment: true,
  attached: false,
  onCodeVisible: function(){},
};

const createInstance = ({ el, $, settings, reaction, darkMode, tpl }) => ({

  // internal
  code          : new ReactiveVar(false),
  language      : new ReactiveVar(''),
  languages     : new ReactiveVar([]),
  slottedCode   : new ReactiveVar(false),
  formattedCode : new ReactiveVar(''),

  getCode() {
    let code;
    if(settings.code) {
      code = settings.code;
    }
    else if(tpl.slottedCode.get()) {
      code = tpl.slottedCode.get();
    }
    return code;
  },

  watchCode() {
    reaction(async () => {
      tpl.language.get(); // reactivity source
      const code = tpl.getCode();
      if(code) {
        if(settings.language == 'html') {
          tpl.formatHTML(code);
        }
        tpl.code.set(code);
        await tpl.highlight(code);
      }
    });
  },

  async highlight(code = tpl.getCode(), darkModeOverride) {
    let
      useDarkMode = (darkModeOverride !== undefined)
        ? darkModeOverride
        : darkMode,
      language = tpl.language.get(),
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
          '#FFAB70': '58C1FE'
          // light mode
          '#22863a': '#777',
          '#24292e': '#777',
        }
      })
    ;
    tpl.formattedCode.set(formattedCode);
    Reaction.afterFlush(function() {
      settings.onCodeVisible(formattedCode.value, tpl.code.get());
    });
  },

  configureHighlighting() {
    // nothing yet
  },

  get: {
    languages() {
      let
        languages
      ;
      if(settings.languageMenu !== 'auto') {
        languages = settings.languageMenu;
      }
      else if(settings.language == 'html') {
        languages = ['html', 'astro'];
      }
      else {
        languages = [ settings.language ];
      }
      return languages;
    },
  },


  formatHTML: function(html) {
    return pretty(html, {ocd: true});
  },

  set: {
    language() {
      if(settings.language) {
        tpl.language.set(settings.language);
      }
    },
    slottedCode() {
      let slottedCode = el.innerHTML;
      if(slottedCode) {
        tpl.slottedCode.set(slottedCode);
      }
    }
  },

});

const onCreated = function({tpl }) {
  tpl.set.slottedCode();
  tpl.set.language();
  tpl.configureHighlighting();
  tpl.watchCode();
};


const onThemeChanged = function({tpl, isClient, darkMode, settings}) {
  tpl.highlight(tpl.getCode(), darkMode);
};

const events = {
  'click ui-icon[copy]'({event, tpl}) {
    copyText(tpl.code.get());
  }
};

const CodeSample = createComponent({
  tagName: 'code-sample',
  template,
  events,
  css,
  onCreated,
  onThemeChanged,
  createInstance,
  settings,
});

export default CodeSample;
export { CodeSample };
