import { createComponent } from '@semantic-ui/component';
import template from './CodeExample.html?raw';
import css from './CodeExample.css?raw';
import { ReactiveVar, Reaction} from '@semantic-ui/reactivity';

import CodeSample from '../CodeSample/CodeSample.js';
const settings = {
  title: undefined,
  description: undefined,
  language: 'html',
  showCode: false, // show code on start
};

const createInstance = ({ $, isServer, settings, tpl }) => ({
  codeVisible : new ReactiveVar(settings.showCode),
  code: new ReactiveVar(''),
  removeComments(input) {
    return input.replace(/<!--[\s\S]*?-->/g, '');
  },
  isHeaderless() {
    return !settings.title;
  },
  setCode() {
    let
      defaultSlot = $('slot').not('[name]').get(0),
      nodes = defaultSlot.assignedNodes(),
      html = $(nodes).not('script, style').map(el => $(el).html()).join('\n'),
      code = tpl.removeComments( html )
    ;
    console.log('set code', code);
    tpl.code.set(code);
  },
  calculateCodeVisible() {
    tpl.reaction(() => {
      if(tpl.codeVisible.get() && !tpl.code.get()) {
        tpl.setCode();
      }
    });
  }
});

const onRendered = function({tpl, isClient, settings}) {
  if(isClient) {
    tpl.calculateCodeVisible();
  }
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
  onRendered,
  createInstance,
  settings,
});

export default CodeExample;
export { CodeExample };
