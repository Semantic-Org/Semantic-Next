import { defineComponent, adoptStylesheet } from '@semantic-ui/component';

import codeMirrorCSS from './lib/codemirror.css?raw';
import template from './CodePlaygroundFile.html?raw';
import css from './CodePlaygroundFile.css?raw';

const defaultState = {
  initialized: false, // avoid the flash when mode is set from changing file types
};

const createComponent = ({self, settings, state, data, $, $$}) => ({

  getClassMap() {
    return {
      initialized: state.initialized.get()
    };
  },

  configureCodeEditors() {
    const el = $$('playground-code-editor').get(0);
    if(el) {
      adoptStylesheet(codeMirrorCSS, el.shadowRoot);
      self.modifyCodeMirror(el._codemirror);
    }
    // we want to use custom template syntax for html files
    if((data?.filename || '').search('.html') !== -1) {
      requestAnimationFrame(() => {
        const cm = $$('playground-code-editor').get(0)?._codemirror;
        if(cm) {
          cm.setOption('mode', 'text/ui-template');
        }
        state.initialized.set(true);
      });
    }
    else {
      state.initialized.set(true);
    }
  },

  setCodeSize(cm, { width = null, height = null } = {}) {
    myCodeMirror.setSize(width, height);
  },

  modifyCodeMirror(cm) {

    cm.setSize(null, null);

    cm.refresh();

    cm.setOption('tabSize', settings.tabSize);

    cm.setOption('viewportMargin', Infinity);

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

    self.patchFold(cm);

    if(data.inline) {
      cm.on('change', (instance, changeObj) => {
        setTimeout(() => {
          // Use setTimeout to allow the DOM to update
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
  },

  // used to remove code comment in front of wrappers
  patchFold(cm) {
    cm.getAllMarks().forEach((marker) => {
      if (marker.__isFold) {
        // Before we attach the 'clear' listener, store the fold info.
        const range = marker.find();
        marker._foldRange = range;
        // If there is a widget, you can also store the widget node:
        if (marker.widgetNode) {
          marker._widgetNode = marker.widgetNode;
        }
        marker.on('clear', () => {
          let foldComment = $(marker._widgetNode).prev('.cm-comment').text();
          // remove comment mentioning folding
          requestAnimationFrame(() => {
            self.removeMatchingLine(cm, foldComment);
          });
        });
      }
    });
  },
  removeMatchingLine(cm, searchString) {
    const doc = cm.getDoc();
    const cursor = doc.getSearchCursor(searchString, {line: 0, ch: 0});
    if (cursor.findNext()) {
      const lineIndex = cursor.from().line;
      // Remove all text from this line start to the next line start.
      // This effectively deletes the entire line (including the trailing newline).
      doc.replaceRange(
        '',
        {line: lineIndex, ch: 0},
        {line: lineIndex + 1, ch: 0}
      );
    }
  }
});

const events = {
  'click .label'({ $ }) {
    $('playground-code-editor').focus();
  },
  'focus ui-panel'({ $$ }) {
    $$('.label').addClass('active');
  },
  'blur ui-panel'({ $$ }) {
    $$('.label').removeClass('active');
  }
};

const onRendered = ({ self, data }) => {
  self.configureCodeEditors();
};

const CodePlaygroundFile = defineComponent({
  template,
  css,
  createComponent,
  onRendered,
  events,
  defaultState,
});

export default CodePlaygroundFile;
export { CodePlaygroundFile };
