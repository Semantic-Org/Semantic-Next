import { createComponent } from '@semantic-ui/component';
import template from './CodeExample.html?raw';
import css from './CodeExample.css?raw';
import { ReactiveVar, Reaction} from '@semantic-ui/reactivity';

import CodeSample from '../CodeSample/CodeSample.js';

const settings = {
  title: false,
  description: false,
  language: 'html',
  showCode: false, // show code on start
};

const createInstance = ({ $, isServer, settings, tpl }) => ({
  codeVisible : new ReactiveVar(false),
  code: new ReactiveVar(''),
  removeComments(input) {
    return input.replace(/<!--[\s\S]*?-->/g, '');
  },
  setCode() {
    let
      defaultSlot = $('slot').not('[name]').get(0),
      nodes = defaultSlot.assignedNodes(),
      html = $(nodes).not('script').map(el => $(el).html()).join('\n'),
      code = tpl.removeComments( html )
    ;
    console.log(html);
    tpl.code.set(code);
  }
});

const onCreated = function({tpl}) {
};


const events = {
  'click .code.link'({event, tpl}) {
    if(!tpl.code.get()) {
      tpl.setCode();
    }
    tpl.codeVisible.toggle();
  }
};

const CodeExample = createComponent({
  tagName: 'code-example',
  template,
  events,
  css,
  onCreated,
  createInstance,
  settings,
});

export default CodeExample;
export { CodeExample };
