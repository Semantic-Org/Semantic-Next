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
  extractAstroIslandHTML(input) {
    const regex = /(?:<|\\x3C)(?!(!--|script))([\w\-]+)(?:\s+[^>]*)?>(.*?)(?:<|\\x3C)\/\1>|(?:<|\\x3C)[\w\-]+(?:\s+[^>]*)?\/?>|(?:(?!<|\\x3C|\(?\(?=>\)?)[\s\S])+/gi;
    const matches = input.match(regex);
    const filteredMatches = matches.filter(match =>
      !match.startsWith('<script') &&
      !match.startsWith('\\x3Cscript') &&
      !match.startsWith('!--astro:end-->') &&
      !match.startsWith('\\x3C!--astro:end-->') &&
      !match.startsWith('(()=>')
    );
    return filteredMatches.join('').trim();
  },
  setCode() {
    let
      defaultSlot = $('slot').not('[name]').get(0),
      nodes = defaultSlot.assignedNodes(),
      html = $(nodes).not('script').html(),
      code = tpl.extractAstroIslandHTML( html )
    ;
    console.log(nodes, code);
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
