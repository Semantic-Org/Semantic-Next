import { createComponent } from '@semantic-ui/component';
import template from './CodeExample.html?raw';
import css from './CodeExample.css?raw';
import { ReactiveVar } from '@semantic-ui/reactivity';

import { UIIcon } from '@semantic-ui/core';
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
  code: new ReactiveVar(),
  removeComments(input) {
    return input.replace(/<!--[\s\S]*?-->/g, '');
  },
  setSlottedContent() {
    if(isServer) {
      return;
    }
    let
      defaultSlot = $('slot').not('[name]').get(0),
      slottedNodes = defaultSlot.assignedNodes(),
      nodes = $(slottedNodes).not('script, style'),
      html = nodes.map(el => {
        return (el.nodeType == 3)
          ? el.nodeValue.trim()
          : $(el).html().trim();
      }).join('\n'),
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
  onCreated,
  onRendered,
  createInstance,
  settings,
});

export default CodeExample;
export { CodeExample };
