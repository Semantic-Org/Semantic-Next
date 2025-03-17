import { defineComponent } from '@semantic-ui/component';
import { TemplateCompiler } from '@semantic-ui/templating';
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

  getMenu: () => {
    let menu = [
      { label: 'Preview', value: 'preview' },
    ];
    const ast = state.ast.get();
    if (ast) {
      menu.push({ label: 'AST', value: 'ast', badge: ast.length });
    }
    console.log(ast);
    return menu;
  },

  calculateAST() {
    let template = self.getTemplate();
    if(template !== undefined) {
      const compiler = new TemplateCompiler(template);
      const ast = compiler.compile();
      state.ast.set(ast);
      afterFlush(self.updateJSON);
    }
  },

  // sadly the pretty-json web component will not automatically respond to slotted content
  updateJSON() {
    const prettyJSON = $('pretty-json').el();
    if(prettyJSON) {
      prettyJSON.connectedCallback();
    }
  },

  getTemplate() {
    let parent = findParent('codePlayground');
    if(!parent) {
      return;
    }
    let files = parent.currentFiles.get();
    if (!files) {
      return;
    }
    return files['component.html']?.content;
  },

});

const onRendered = ({reaction, self}) => {
  reaction(self.calculateAST);
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
  defaultState
});

export default CodePlaygroundPreview;
export { CodePlaygroundPreview };
