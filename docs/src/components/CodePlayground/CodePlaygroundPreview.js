import { defineComponent } from '@semantic-ui/component';
import { TemplateCompiler } from '@semantic-ui/compiler';
import css from './CodePlaygroundPreview.css?raw';
import template from './CodePlaygroundPreview.html?raw';
import './lib/pretty-json.js';

const defaultState = {
  tab: 'preview',
  useTabs: true,
  ast: [],
};

const createComponent = ({ self, afterFlush, reaction, findParent, data, state, $, $$ }) => ({
  showMenu() {
    if (data.showMenu == false) {
      return false;
    }
    return true;
  },

  getMenu() {
    let menu = [
      { label: data.previewText || 'Preview', value: 'preview' },
    ];
    const ast = state.ast.get();
    if (ast?.length) {
      menu.push({ label: 'AST', value: 'ast', badge: ast.length });
    }
    return menu;
  },

  calculateAST() {
    let template = self.getTemplate();
    if (template !== undefined) {
      const compiler = new TemplateCompiler(template);
      const ast = compiler.compile();
      state.ast.set(ast);
      afterFlush(self.updateJSON);
    }
  },

  // sadly the pretty-json web component will not automatically respond to slotted content
  updateJSON() {
    const prettyJSON = $('pretty-json').el();
    if (prettyJSON) {
      prettyJSON.connectedCallback();
    }
  },

  getTemplate() {
    let parent = findParent('codePlayground');
    if (!parent) {
      return;
    }
    let files = parent.currentFiles.get();
    if (!files) {
      return;
    }
    if (!files['component.html']) {
      const js = files['component.js']?.content;
      if (js) {
        const regex = /template:\s*([`'"])((?:\\.|(?!\1).)*)\1/;
        const match = js.match(regex);
        if (match) {
          return match[2];
        }
      }
    }
    return files['component.html']?.content;
  },
});

const onRendered = ({ reaction, self, $, isClient }) => {
  reaction(self.calculateAST);

  if (isClient) {
    $('.links a').tooltip({
      position: 'top',
      containToScroll: false,
    });
  }
};

const events = {
  'change ui-menu'({ state, data }) {
    state.tab.set(data.value);
  },
};

const CodePlaygroundPreview = defineComponent({
  template,
  css,
  createComponent,
  onRendered,
  events,
  defaultState,
});

export default CodePlaygroundPreview;
export { CodePlaygroundPreview };
