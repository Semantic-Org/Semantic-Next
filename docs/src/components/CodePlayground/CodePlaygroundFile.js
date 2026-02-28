import { adoptStylesheet, defineComponent } from '@semantic-ui/component';

import css from './CodePlaygroundFile.css?raw';
import template from './CodePlaygroundFile.html?raw';
import codeMirrorCSS from './lib/codemirror.css?raw';

import { templateLang } from './lang/template-lang.js';

const defaultSettings = {
  lineNumbers: true,
};

const defaultState = {
  initialized: false, // avoid the flash when mode is set from changing file types
};

const createComponent = ({ self, settings, state, data, $, $$ }) => ({
  getClassMap() {
    return {
      initialized: state.initialized.get(),
    };
  },

  setEditorInstance() {
    // CM6 editor instance
    const editorEl = $$('playground-code-editor').get(0);
    const view = editorEl?._editorView;

    if (!view) {
      return;
    }

    // retrieve classes from instance
    const EditorView = view.constructor;
    const EditorState = view.state.constructor;
    const Transaction = view.state.update({}).constructor;

    const compartment = [...view.state.config.compartments.keys()][0];
    const Compartment = compartment.constructor;
    const StateEffect = compartment.reconfigure([]).constructor;

    const ViewPlugin = view.plugins[0]?.spec?.plugin?.constructor;
    // Duck-type StateField by its create/update methods
    const StateField = view.state.config.base.find(x =>
      typeof x?.create === 'function' && typeof x?.update === 'function'
    )?.constructor;
    // Duck-type RangeSet by its iter method and size property
    const RangeSet = view.state.values.find(v => typeof v?.iter === 'function' && typeof v?.size === 'number')
      ?.constructor;
    const Facet = EditorView.updateListener.constructor;

    // store playground code editor el
    self.editorEl = editorEl;

    // store code mirror view
    self.editorView = view;

    // store base classes
    self.cm = {
      EditorView,
      EditorState,
      Transaction,
      Compartment,
      StateEffect,
      StateField,
      ViewPlugin,
      RangeSet,
      Facet,
      // Shortcuts
      updateListener: EditorView.updateListener,
      appendConfig: StateEffect.appendConfig,
      userEvent: Transaction.userEvent,
    };

    // Find the language compartment by duck-typing LanguageSupport shape
    const compartmentEntries = [...view.state.config.compartments.entries()];
    const languageCompartment = compartmentEntries.find(([comp, value]) =>
      value?.language && value?.support && value?.extension
    )?.[0];

    // safety check for race conditions -- try again
    if (!languageCompartment && !self.retried) {
      self.retried = true;
      requestIdleCallback(() => self.setEditorInstance());
    }

    self.cm.languageCompartment = languageCompartment;
  },

  configureCodeEditors() {
    // add custom styles
    if (self.editorEl) {
      adoptStylesheet(codeMirrorCSS, self.editorEl.shadowRoot);
    }

    const $editor = $('playground-file-editor');

    // disable line numbers if requested
    if (data.lineNumbers) {
      $editor.addAttr('line-numbers');
    }
    else {
      $editor.removeAttr('line-numbers');
    }
    // disable line numbers if requested
    if (data.lineWrapping) {
      $editor.addAttr('line-wrapping');
    }
    else {
      $editor.removeAttr('line-wrapping');
    }

    // handle custom syntax
    const isHTML = (data?.filename || '').search('.html') !== -1;
    if (self.editorView && isHTML) {
      requestIdleCallback(() => {
        self.setLanguage(templateLang);
        // Set data-language for CSS scoping
        const contentEl = self.editorView.contentDOM;
        if (contentEl) {
          contentEl.setAttribute('data-language', 'html');
        }
        state.initialized.set(true);
      });
    }
    else {
      state.initialized.set(true);
    }
  },

  setLanguage(lang) {
    if (!self.cm.languageCompartment) {
      return;
    }
    self.editorView.dispatch({
      effects: self.cm.languageCompartment.reconfigure(lang),
    });
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

const onRendered = ({ self, data }) => {
  requestIdleCallback(() => {
    self.setEditorInstance();
    self.configureCodeEditors();
    self.setupFolds();
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
