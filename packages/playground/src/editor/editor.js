import { acceptCompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { bracketMatching, indentOnInput, indentUnit, syntaxHighlighting } from '@codemirror/language';
import { setDiagnostics } from '@codemirror/lint';
import { highlightSelectionMatches, search, searchKeymap } from '@codemirror/search';
import { Compartment, EditorState, Prec } from '@codemirror/state';
import {
  drawSelection,
  dropCursor,
  EditorView,
  highlightSpecialChars,
  keymap,
  lineNumbers as cmLineNumbers,
} from '@codemirror/view';
import { classHighlighter } from '@lezer/highlight';

import { getLanguage } from './languages.js';
import { pragmas } from './pragmas.js';

/*
  Editor adapter — CodeMirror binding. The surface speaks filenames, plain
  strings, and marker lists; CodeMirror types appear only here and through the
  documented `view` escape hatch, so a Monaco binding stays a binding.

  Per-file EditorStates are cached across openFile calls — switching files
  preserves each file's undo history, selection, and expanded pragma folds.
*/

const severities = { error: 'error', warning: 'warning', info: 'info' };

export const createEditor = ({
  parent,
  lineNumbers = false,
  lineWrapping = false,
  readonly = false,
  pragmaMode = 'on',
  tabSize = 2,
  onChange,
  // (fileName) => Extension[] — per-file intelligence (LSP plugins, completion sources)
  getFileExtensions,
} = {}) => {
  const compartments = {
    language: new Compartment(),
    lineNumbers: new Compartment(),
    lineWrapping: new Compartment(),
    readonly: new Compartment(),
    perFile: new Compartment(),
  };

  let currentFile;
  const fileStates = new Map();

  const notifyChange = EditorView.updateListener.of((update) => {
    if (update.docChanged && currentFile) {
      onChange?.(currentFile, update.state.doc.toString());
    }
  });

  const baseExtensions = [
    highlightSpecialChars(),
    history(),
    drawSelection(),
    dropCursor(),
    indentOnInput(),
    indentUnit.of(' '.repeat(tabSize)),
    EditorState.tabSize.of(tabSize),
    bracketMatching(),
    closeBrackets(),
    search({ top: true }),
    highlightSelectionMatches(),
    syntaxHighlighting(classHighlighter),
    pragmas(pragmaMode),
    notifyChange,
    // completion accept fires before indent so Tab does the right thing in both states
    Prec.highest(keymap.of([{ key: 'Tab', run: acceptCompletion }])),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...completionKeymap,
      indentWithTab,
    ]),
    compartments.lineNumbers.of(lineNumbers ? cmLineNumbers() : []),
    compartments.lineWrapping.of(lineWrapping ? EditorView.lineWrapping : []),
    compartments.readonly.of(readonly ? EditorState.readOnly.of(true) : []),
  ];

  const createFileState = (fileName, content) => {
    return EditorState.create({
      doc: content,
      extensions: [
        ...baseExtensions,
        compartments.language.of(getLanguage(fileName)),
        compartments.perFile.of(getFileExtensions?.(fileName) ?? []),
      ],
    });
  };

  // explicit root — CM injects its structural styles there; inside shadow DOM
  // the default (document) leaves the editor unstyled
  const view = new EditorView({ parent, root: parent.getRootNode() });

  const adapter = {
    view,

    get fileName() {
      return currentFile;
    },

    openFile(fileName, content) {
      if (currentFile) {
        fileStates.set(currentFile, view.state);
      }
      if (currentFile === fileName) {
        return;
      }
      let state = fileStates.get(fileName);
      if (!state || state.doc.toString() !== content) {
        state = createFileState(fileName, content);
      }
      currentFile = fileName;
      view.setState(state);
    },

    getContent() {
      return view.state.doc.toString();
    },

    setContent(content) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: content },
      });
    },

    setDiagnostics(markers = []) {
      view.dispatch(setDiagnostics(
        view.state,
        markers.map(marker => ({
          from: Math.min(marker.start ?? 0, view.state.doc.length),
          to: Math.min((marker.start ?? 0) + (marker.length ?? 0), view.state.doc.length),
          severity: severities[marker.severity] ?? 'error',
          message: marker.message,
        })),
      ));
    },

    setLineNumbers(enabled) {
      view.dispatch({ effects: compartments.lineNumbers.reconfigure(enabled ? cmLineNumbers() : []) });
    },

    setLineWrapping(enabled) {
      view.dispatch({ effects: compartments.lineWrapping.reconfigure(enabled ? EditorView.lineWrapping : []) });
    },

    setReadonly(enabled) {
      view.dispatch({ effects: compartments.readonly.reconfigure(enabled ? EditorState.readOnly.of(true) : []) });
    },

    measure() {
      const gutter = view.dom.querySelector('.cm-gutters');
      const lines = [...view.dom.querySelectorAll('.cm-line')];
      const gutterWidth = gutter?.offsetWidth ?? 0;
      const lineWidth = Math.max(0, ...lines.map(line => line.scrollWidth));
      return {
        naturalWidth: gutterWidth + lineWidth,
        naturalHeight: Number.parseFloat(gutter ? getComputedStyle(gutter).minHeight : '0') || view.contentHeight,
      };
    },

    focus() {
      view.focus();
    },

    destroy() {
      view.destroy();
      fileStates.clear();
    },
  };

  return adapter;
};
