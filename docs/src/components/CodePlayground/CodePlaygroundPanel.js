import { createComponent, adoptStylesheet } from '@semantic-ui/component';

import codeMirrorCSS from './codemirror.css?raw';

import template from './CodePlaygroundPanel.html?raw';
import css from './CodePlaygroundPanel.css?raw';

const state = {
  minimized: false,
  lastPanelSize: undefined,
};

const createInstance = ({tpl, settings, state, $}) => ({

  getNaturalSize(panel, direction) {
    const labelHeight = $('.label').height();
    if(state.minimized.get()) {
      return labelHeight;
    }
    else {
      const extraSpacing = 5;
      const codeHeight = parseFloat($(panel).find('.CodeMirror-sizer').first().css('min-height'));
      const size = codeHeight + labelHeight + extraSpacing;
      return size;
    }
  },

  configureCodeEditors() {
    const el = $('playground-code-editor').get(0);
    if(el) {
      adoptStylesheet(codeMirrorCSS, el.shadowRoot);
      tpl.modifyCodeMirror(el._codemirror);
    }
  },

  setCodeSize(cm, { width = null, height = null } = {}) {
    myCodeMirror.setSize(width, height);
  },

  modifyCodeMirror(cm) {

    cm.refresh();

    cm.setOption('tabSize', settings.tabSize);

    // Enable multiple selections
    cm.setOption('allowMultipleSelections', true);

    // Use the drawSelection extension to display multiple selections
    cm.setOption('drawSelectionMatches', true);

    cm.setOption('extraKeys', {
      ...cm.getOption('extraKeys'),
      Tab: (cm) => {
        if (cm.somethingSelected()) {
          cm.indentSelection('add');
        } else {
          cm.execCommand('insertSoftTab');
        }
      },
      'Shift-Tab': () => {
        const indentUnit = cm.getOption('indentUnit') ?? 2;
        const selections = cm.listSelections();
        cm.operation(() => {
          selections.forEach((selection) => {
            const fromLine = selection.from().line;
            const toLine = selection.to().line;
            for (let i = fromLine; i <= toLine; i++) {
              const lineContent = cm.getLine(i);
              const trimmedLine = lineContent.trimStart();
              const outdentSize = Math.min(lineContent.length - trimmedLine.length, indentUnit);
              cm.replaceRange('', { line: i, ch: 0 }, { line: i, ch: outdentSize });
            }
          });
        });
      },
      'Ctrl-D': () => {
        // Get the current selection
        const selection = cm.getSelection();
        // Find all occurrences of the selected text
        const cursor = cm.getSearchCursor(selection);
        const matches = [];
        while (cursor.findNext()) {
          matches.push({ anchor: cursor.from(), head: cursor.to() });
        }

        // Add the occurrences as selections
        cm.setSelections(matches);
      },
    });

    if(settings.inline) {
      cm.on('change', (instance, changeObj) => {
        setTimeout(() => { // Use setTimeout to allow the DOM to update
          const scrollInfo = instance.getScrollInfo();
          const contentHeight = scrollInfo.height;
          const clientHeight = scrollInfo.clientHeight;
          const wrapper = instance.getWrapperElement();

          // Only resize if content has transitioned to overflow state
          if (contentHeight > clientHeight) {
            wrapper.style.height = `${contentHeight}px`;
            instance.refresh();
          }
        }, 1);
      });
    }
  }
});

const events = {
  'click .toggle-size'({$, state}) {
    const minimized = !state.minimized.get();
    state.minimized.set(minimized);
    if(minimized) {
      const panel = $('ui-panel').getComponent();
      state.lastPanelSize = $('ui-panel').css('flex-grow');
      panel.setNaturalSize();
    }
    else {
      const panels = $(this).closest('ui-panels').getComponent();
      const panelEl = $('ui-panel').get(0);
      const index = panels.getPanelIndex(panelEl);
      panels.setPanelSize(index, state.lastPanelSize, { donor: true });
    }
  },
  'click .label'({ $ }) {
    $('playground-code-editor').focus();
  },
  'focus ui-panel'({ $ }) {
    $('.label').addClass('active');
  },
  'blur ui-panel'({ $ }) {
    $('.label').removeClass('active');
  }
};

const onRendered = ({ $, tpl, data, state, settings }) => {

  if(data.panel.type == 'file') {
    tpl.configureCodeEditors();
  }
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
});

export default CodePlaygroundPanel;
export { CodePlaygroundPanel };
