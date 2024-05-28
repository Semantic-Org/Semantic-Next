import { createComponent } from '@semantic-ui/component';
import template from './CodePlaygroundPanel.html?raw';
import css from './CodePlaygroundPanel.css?raw';
import { CodePlaygroundFile } from './CodePlaygroundFile.js';

const state = {
  lastPanelSize: undefined,
};

const createInstance = ({tpl, settings, state, $, $$}) => ({
  getNaturalSize(panel, {minimized }) {
    const labelHeight = $$('.label').height();
    if(minimized) {
      return labelHeight;
    }
    else {
      const extraSpacing = 5;
      const scrollbarHeight = $$(panel).find('.CodeMirror-hscrollbar').height() ? 17 : 0;
      const codeHeight = parseFloat($$(panel).find('.CodeMirror-sizer').first().css('min-height'));
      const size = codeHeight + labelHeight + extraSpacing + scrollbarHeight;
      return Math.max(size, 100);
    }
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

const onRendered = ({ $, tpl, attachEvent }) => {
  attachEvent('.label', () => {
    console.log('zz')
  });
  $('ui-panel').settings({
    getNaturalSize: tpl.getNaturalSize
  });
};

const CodePlaygroundPanel = createComponent({
  template,
  css,
  createInstance,
  onRendered,
  events,
  state,
  subTemplates: {
    CodePlaygroundFile,
  }
});

export default CodePlaygroundPanel;
export { CodePlaygroundPanel };
