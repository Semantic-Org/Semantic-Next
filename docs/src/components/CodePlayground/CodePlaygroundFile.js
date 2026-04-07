import { adoptStylesheet, defineComponent } from '@semantic-ui/component';

import css from './CodePlaygroundFile.css?raw';
import template from './CodePlaygroundFile.html?raw';
import codeMirrorCSS from './lib/codemirror.css?raw';

import { acceptCompletion } from '@codemirror/autocomplete';
import { Prec } from '@codemirror/state';
import { keymap } from '@codemirror/view';

import { templateLang } from './lang/template-lang.js';
import { getClient } from './lib/lsp-client.js';

// Highest precedence so it fires before playground-elements' indent handler.
// acceptCompletion returns false when no completion is active, falling through to indent.
const tabCompletion = Prec.highest(keymap.of([{ key: 'Tab', run: acceptCompletion }]));

const defaultSettings = {
  lineNumbers: true,
};

const defaultState = {
  initialized: false,
};

const createComponent = ({ self, settings, state, data, $, $$ }) => ({

  hasLSP(filename) {
    return (filename || '').includes('.html');
  },

  getExtensions(filename) {
    // cache the full array per filename to avoid duplicate registrations
    if (!self.extensionCache) {
      self.extensionCache = {};
    }
    if (self.extensionCache[filename]) {
      return self.extensionCache[filename];
    }
    const isHTML = (filename || '').includes('.html');
    if (!isHTML) {
      self.extensionCache[filename] = [];
      return [];
    }
    const extension = [getClient().plugin(filename), tabCompletion];
    self.extensionCache[filename] = extension;
    return extension;
  },

  setSyntax(filename) {
    // Defer to run after playground-elements finishes its setState() on file switch
    requestAnimationFrame(() => {
      self.setEditorInstance();
      const isHTML = (filename || '').includes('.html');
      if (self.editorView && isHTML) {
        self.setLanguage(templateLang);
        const contentEl = self.editorView.contentDOM;
        if (contentEl) {
          contentEl.setAttribute('data-language', 'html');
        }
      }
    });
    return '';
  },

  setEditorInstance() {
    const editorEl = $$('playground-code-editor').get(0);
    const view = editorEl?._editorView;

    if (!view) {
      return;
    }

    self.editorEl = editorEl;
    self.editorView = view;

    // Find the language compartment by duck-typing LanguageSupport shape
    const compartmentEntries = [...view.state.config.compartments.entries()];
    const languageCompartment = compartmentEntries.find(([comp, value]) =>
      value?.language && value?.support && value?.extension
    )?.[0];

    if (!languageCompartment && !self.retried) {
      self.retried = true;
      requestIdleCallback(() => self.setEditorInstance());
    }

    self.languageCompartment = languageCompartment;
  },

  setLanguage(lang) {
    if (!self.languageCompartment) {
      return;
    }
    self.editorView.dispatch({
      effects: self.languageCompartment.reconfigure(lang),
    });
  },

  configureCodeEditors() {
    // add custom styles
    if (self.editorEl) {
      adoptStylesheet(codeMirrorCSS, self.editorEl.shadowRoot);
    }

    const $editor = $('playground-file-editor');

    if (data.lineNumbers) {
      $editor.addAttr('line-numbers');
    }
    else {
      $editor.removeAttr('line-numbers');
    }
    if (data.lineWrapping) {
      $editor.addAttr('line-wrapping');
    }
    else {
      $editor.removeAttr('line-wrapping');
    }
  },

  setCodeSize({ width = null, height = null } = {}) {
    self.editorView.dom.style.width = width;
    self.editorView.dom.style.height = height;
  },

  setupFolds(view = self.editorView) {
    const $widgets = $$(view.contentDOM).find('.cm-foldMarker');
    $widgets.each(function() {
      const $widget = $(this);
      const $comment = $(this).prev('.tok-comment');
      $widget
        .off('.clear')
        .on('click.clear', function() {
          const pos = view.posAtDOM($comment.el());
          const line = view.state.doc.lineAt(pos);
          view.dispatch({
            changes: {
              from: line.from,
              to: Math.min(line.to + 1, view.state.doc.length), // +1 for newline
              insert: '',
            },
          });
        });
    });
  },
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
  },
};

const onRendered = ({ self, state }) => {
  requestIdleCallback(() => {
    self.setEditorInstance();
    self.configureCodeEditors();
    self.setupFolds();
    state.initialized.set(true);
  });
};

const CodePlaygroundFile = defineComponent({
  template,
  css,
  createComponent,
  onRendered,
  events,
  defaultState,
  defaultSettings,
});

export default CodePlaygroundFile;
export { CodePlaygroundFile };
