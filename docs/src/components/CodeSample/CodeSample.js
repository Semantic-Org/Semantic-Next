import pretty from 'pretty';
import { codeToHtml } from 'shiki';

import { createComponent } from '@semantic-ui/component';
import template from './CodeSample.html?raw';
import css from './CodeSample.css?raw';

import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';
import { each } from '@semantic-ui/utils';


const settings = {
  sourceType: 'html',
  sourceTypes: 'auto',
  code: '',
  template: false,
  attached: false,
  onCodeVisible: function(){},
};

const createInstance = ({ el, $, settings, tpl }) => ({

  // internal
  code          : new ReactiveVar(false),
  sourceType    : new ReactiveVar(''),
  sourceTypes   : new ReactiveVar([]),
  slottedCode   : new ReactiveVar(false),
  formattedCode : new ReactiveVar(false),

  watchCode() {
    console.log(settings);
    tpl.reaction(async () => {
      tpl.sourceType.get(); // reactivity source

      let code;
      tpl.formattedCode.set(false);
      if(settings.code) {
        code = settings.code;
      }
      else if(tpl.slottedCode.get()) {
        code = tpl.slottedCode.get();
      }
      if(code) {
        if(settings.sourceType == 'html') {
          tpl.formatHTML(code);
        }
        tpl.code.set(code);
        await tpl.highlight(code);
      }
    });
  },

  async highlight(code) {
    let
      language = tpl.sourceType.get(),
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
    sourceTypes() {
      let
        sourceTypes
      ;
      if(settings.sourceTypes !== 'auto') {
        sourceTypes = settings.sourceTypes;
      }
      else if(settings.sourceType == 'html') {
        sourceTypes = ['html', 'astro'];
      }
      else {
        sourceTypes = [ setings.sourceType ];
      }
      return sourceTypes;
    },
  },


  formatHTML: function(html) {
    return pretty(html);
  },

  set: {
    sourceType() {
      if(settings.sourceType) {
        tpl.sourceType.set(settings.sourceType);
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
  tpl.set.sourceType();
  tpl.configureHighlighting();
  tpl.watchCode();
};

const onRendered = function({tpl, settings}) {
};


const events = {
};

const CodeSample = createComponent({
  tagName: 'code-sample',
  template,
  events,
  css,
  onCreated,
  onRendered,
  createInstance,
  settings,
});

export default CodeSample;
export { CodeSample };
