import { defineComponent } from '@semantic-ui/component';
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

const createInstance = ({ $, isServer, reaction, settings, self }) => ({
  codeVisible : new ReactiveVar(settings.showCode),
  slottedContent: new ReactiveVar(),
  code: new ReactiveVar(settings.code),
  removeComments(input = '') {
    return input.replace(/<!--[\s\S]*?-->/g, '');
  },
  canShowCode() {
    return self.code.get() && self.codeVisible.get();
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
      code = self.removeComments( html )
    ;
    self.slottedContent.set(code);
  },
  calculateCodeVisible() {
    reaction(() => {
      const code = settings.code || self.slottedContent.get();
      self.code.set(code);
    });
  }
});

const onCreated = function({self, isClient, settings}) {
  self.calculateCodeVisible();
};

const onRendered = function({self, isClient, settings}) {
  self.setSlottedContent();
};



const events = {
  'click .code.link'({event, self}) {
    self.codeVisible.toggle();
  }
};

const CodeExample = defineComponent({
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
