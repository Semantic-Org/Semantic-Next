import { defineComponent } from '@semantic-ui/component';
import { TemplateCompiler } from '@semantic-ui/templating';
import template from './CodePlaygroundPreview.html?raw';
import css from './CodePlaygroundPreview.css?raw';
import './PrettyJSON.js';

const state = {
  tab: 'preview',
  useTabs: true,
  template: '',
};

const createComponent = ({self, findParent, state, $, $$}) => ({

  getMenu: () => {
    let menu = [
      { label: 'Preview', value: 'preview' },
      //{ label: 'Console', value: 'console' },
    ];
    if(self.getFile()) {
      menu.push({ label: 'AST', value: 'ast' });
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

const onRendered = ({self, state}) => {
  const fileContent = self.getFile();
  state.template.set(fileContent);
};

const events = {
  'change ui-menu'({state, data}) {
    state.tab.set(data.value);
  },
};

const CodePlaygroundPreview = defineComponent({
  template,
  css,
  createComponent,
  events,
  state,
  onRendered,
});

export default CodePlaygroundPreview;
export { CodePlaygroundPreview };
