import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import { UIIcon } from '@semantic-ui/core';
import { tokenize } from '@semantic-ui/utils';

import template from './CodeExample.html?raw';
import css from './CodeExample.css?raw';
import lightCSS from './CodeExampleLight.css?raw';

import CodeSample from '../CodeSample/CodeSample.js';

const settings = {
  title: undefined,
  description: undefined,
  language: 'html',
  code: undefined,
  showCode: false, // show code on start
};

const createInstance = ({ $, isServer, settings, tpl }) => ({
  codeVisible : new ReactiveVar(settings.showCode),
  slottedContent: new ReactiveVar(),
  code: new ReactiveVar(settings.code),
  removeComments(input = '') {
    return input.replace(/<!--[\s\S]*?-->/g, '');
  },
  canShowCode() {
    return tpl.code.get() && tpl.codeVisible.get();
  },
  setSlottedContent() {
    if(isServer) {
      return;
    }
    let
      defaultSlot = $('slot').not('[name]').get(0),
      slottedNodes = defaultSlot.assignedNodes(),
      $content = $(slottedNodes).not('script, style'),
      html = $content.outerHTML(),
      code = tpl.removeComments( html )
    ;
    tpl.slottedContent.set(code);
  },
  calculateCodeVisible() {
    tpl.reaction(() => {
      const code = settings.code || tpl.slottedContent.get();
      tpl.code.set(code);
    });
  }
});

const onCreated = function({tpl, isClient, settings}) {
  tpl.calculateCodeVisible();
};

const onRendered = function({tpl, isClient, settings}) {
  tpl.setSlottedContent();
};



const events = {
  'click .code.link'({event, tpl}) {
    tpl.codeVisible.toggle();
  }
};

const CodeExample = createComponent({
  tagName: 'code-example',
  template,
  events,
  css,
  lightCSS,
  onCreated,
  onRendered,
  createInstance,
  settings,
});

export default CodeExample;
export { CodeExample };
