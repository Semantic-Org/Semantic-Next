import { defineComponent } from '@semantic-ui/component';
import template from './CodePlaygroundPanel.html?raw';
import css from './CodePlaygroundPanel.css?raw';
import { CodePlaygroundFile } from './CodePlaygroundFile.js';
import { CodePlaygroundPreview } from './CodePlaygroundPreview.js';

const createComponent = ({data}) => ({
  initialize() {
    // nothing yet
  }
});

const events = {
  'click .label'({ $, $$ }) {
    $$('playground-code-editor').focus();
  },
  'focus ui-panel'({ $$ }) {
    $$('.label').addClass('active');
  },
  'blur ui-panel'({ $$ }) {
    $$('.label').removeClass('active');
  }
};

const CodePlaygroundPanel = defineComponent({
  template,
  css,
  createComponent,
  events,
  subTemplates: {
    CodePlaygroundFile,
    CodePlaygroundPreview
  }
});

export default CodePlaygroundPanel;
export { CodePlaygroundPanel };
