import pretty from 'pretty';
import { codeToHtml } from 'shiki';

import { createComponent } from '@semantic-ui/component';
import template from './CodeSample.html?raw';
import css from './CodeSample.css?raw';

import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';
import { each } from '@semantic-ui/utils';


const settings = {
  language: 'html',
  languageMenu: 'auto',
  code: '',
  copyable: true,
  segment: true,
  attached: false,
  onCodeVisible: function(){},
};

const createInstance = ({ el, $, settings, tpl }) => ({

  // internal
  code          : new ReactiveVar(false),
  language      : new ReactiveVar(''),
  languages     : new ReactiveVar([]),
  slottedCode   : new ReactiveVar(false),
  formattedCode : new ReactiveVar(''),

  watchCode() {
    tpl.reaction(async () => {
      tpl.language.get(); // reactivity source

      let code;
      if(settings.code) {
        code = settings.code;
      }
      else if(tpl.slottedCode.get()) {
        code = tpl.slottedCode.get();
      }
      if(code) {
        if(settings.language == 'html') {
          tpl.formatHTML(code);
        }
        tpl.code.set(code);
        await tpl.highlight(code);
      }
    });
  },

  async highlight(code) {
    let
      language = tpl.language.get(),
      formattedCode = await codeToHtml(code, {
        lang: language,
        theme: 'vitesse-light',
      })
    ;
    tpl.formattedCode.set(formattedCode);
    Reaction.afterFlush(function() {
      tpl.set.copyableCode(code);
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
    copyableCode(code) {
      // handle copy code
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


const events = {
};

const CodeSample = createComponent({
  tagName: 'code-sample',
  template,
  events,
  css,
  onCreated,
  createInstance,
  settings,
});

export default CodeSample;
export { CodeSample };
