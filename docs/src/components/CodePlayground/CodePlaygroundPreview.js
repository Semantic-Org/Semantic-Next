import { createComponent } from '@semantic-ui/component';
import { TemplateCompiler } from '@semantic-ui/templating';
import template from './CodePlaygroundPreview.html?raw';
import css from './CodePlaygroundPreview.css?raw';
import './PrettyJSON.js';

const state = {
  tab: 'preview',
  useTabs: true,
  template: '',
};

const createInstance = ({tpl, findParent, state, $, $$}) => ({

  getMenu: () => {
    let menu = [
      { label: 'Preview', value: 'preview' },
      { label: 'Console', value: 'console' },
    ];
    if(tpl.getFile()) {
      menu.push({ label: 'Template AST', value: 'ast' });
    }
    return menu;
  },

  getFile() {
    let parent = findParent('codePlayground');
    if(!parent?.files) {
      return;
    }
    return parent.files['component.html']?.content;
  },

  getAST() {
    const template = state.template.get();
    const compiler = new TemplateCompiler(template);
    const ast = compiler.compile();
    return JSON.stringify(ast);
  }

});

const onRendered = ({tpl, state}) => {
  const fileContent = tpl.getFile();
  state.template.set(fileContent);
};

const events = {
  'change ui-menu'({state, data}) {
    state.tab.set(data.value);
  },
};

const CodePlaygroundPreview = createComponent({
  template,
  css,
  createInstance,
  events,
  state,
  onRendered,
});

export default CodePlaygroundPreview;
export { CodePlaygroundPreview };
