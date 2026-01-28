import { adoptStylesheet, defineComponent } from '@semantic-ui/component';

import css from './CodePlaygroundFile.css?raw';
import template from './CodePlaygroundFile.html?raw';
import codeMirrorCSS from './lib/codemirror.css?raw';

import { templateLang } from './lang/template-lang.js';

const defaultState = {
  initialized: false, // avoid the flash when mode is set from changing file types
};

const createComponent = ({ self, state, data, $, $$ }) => ({
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
    self.cm.languageCompartment = compartmentEntries.find(([comp, value]) =>
      value?.language && value?.support && value?.extension
    )?.[0];
  },

  configureCodeEditors() {
    // add custom styles
    if (self.editorEl) {
      adoptStylesheet(codeMirrorCSS, self.editorEl.shadowRoot);
    }

    // handle custom syntax
    const isHTML = (data?.filename || '').search('.html') !== -1;
    if (self.editorView && isHTML) {
      requestAnimationFrame(() => {
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
    self.editorView.dispatch({
      effects: self.cm.languageCompartment.reconfigure(lang),
    });
  },

  setCodeSize({ width = null, height = null } = {}) {
    self.editorView.dom.style.width = width;
    self.editorView.dom.style.height = height;
  },

  setupFolds(view) {
    self._trackedFolds = new Map();

    const listener = self.cm.updateListener.of((update) => {
      const oldFolds = new Map(self._trackedFolds);
      const newFolds = self.syncFolds(update.view);
      self._trackedFolds = newFolds;

      for (const [key, oldFold] of oldFolds) {
        if (!newFolds.has(key)) {
          self.onFoldCleared(update.view, oldFold);
        }
      }
    });

    view.dispatch({
      effects: self.cm.appendConfig.of(listener),
    });
  },

  syncFolds(view) {
    const folds = new Map();
    const $widgets = $$(view.contentDOM).find('.cm-foldPlaceholder');

    $widgets.each((widget) => {
      const $comment = $(widget).closest('.cm-line').prev().find('.tok-comment');
      if (!$comment.length) { return; }

      const pos = view.posAtDOM(widget);
      const commentPos = view.posAtDOM($comment.get(0));
      const key = String(pos);

      folds.set(key, {
        from: pos,
        commentPos,
      });
    });

    return folds;
  },

  onFoldCleared(view, fold) {
    if (fold.commentPos == null) { return; }

    requestAnimationFrame(() => {
      const doc = view.state.doc;
      const line = doc.lineAt(fold.commentPos);
      const to = line.number < doc.lines
        ? doc.line(line.number + 1).from
        : line.to;

      view.dispatch({
        changes: { from: line.from, to, insert: '' },
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
  self.setEditorInstance();
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
