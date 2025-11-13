import { getCodePlaygroundLink } from '@helpers/link-encoder.js';
import { defineComponent } from '@semantic-ui/component';
import { UIIcon } from '@semantic-ui/core';
import { openLink } from '@semantic-ui/utils';

import css from './CodeExample.css?raw';
import template from './CodeExample.html?raw';
import pageCSS from './CodeExamplePage.css?raw';

import CodeSample from '../CodeSample/CodeSample.js';

const defaultSettings = {
  title: undefined,
  description: undefined,
  language: 'html',
  code: undefined,
  showCode: false, // show code on start
};

const defaultState = {
  displayedCode: undefined,
  codeVisible: false,
};

const createComponent = ({ $, isServer, reaction, state, settings, self }) => ({
  initialize() {
    self.calculateCodeVisible();
    state.displayedCode.set(settings.code);
    if (settings.showCode) {
      state.codeVisible.set(true);
    }
  },
  canShowCode() {
    return state.displayedCode.get() && state.codeVisible.get();
  },
  removeComments(input = '') {
    return input.replace(/<!--[\s\S]*?-->/g, '');
  },
  calculateCodeVisible() {
    reaction(() => {
      const code = settings.code || state.slottedContent.get();
      state.displayedCode.set(code);
    });
  },
  getPlaygroundLink(code) {
    return getCodePlaygroundLink(code);
  },
  /*setSlottedContent() {
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
    state.displayedCode.set(code);
  },*/
});

const onRendered = function({ self }) {
  // self.setSlottedContent();
};

const events = {
  'click ui-icon.toggle'({ state }) {
    state.codeVisible.toggle();
  },
  'click ui-icon.playground'({ settings, self, event }) {
    const playgroundLink = self.getPlaygroundLink(settings.code);
    openLink(playgroundLink, { newWindow: true, event });
  },
};

const CodeExample = defineComponent({
  tagName: 'code-example',
  template,
  events,
  css,
  pageCSS,
  onRendered,
  createComponent,
  defaultSettings,
  defaultState,
});

export default CodeExample;
export { CodeExample };
