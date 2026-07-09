import { acceptCompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { bracketMatching, foldGutter, indentOnInput, indentUnit, syntaxHighlighting } from '@codemirror/language';
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

import { highlightStyle } from './highlight.js';
import { getLanguage, getLanguageFamily } from './languages.js';
import { pragmas } from './pragmas.js';

/*
  Editor adapter — CodeMirror binding. The surface speaks filenames, plain
  strings, and marker lists; CodeMirror types appear only here and through the
  documented `view` escape hatch, so a Monaco binding stays a binding.

  Per-file EditorStates are cached across openFile calls — switching files
  preserves each file's undo history, selection, and expanded pragma folds.
*/

const severities = { error: 'error', warning: 'warning', info: 'info' };

/*
  Natural code dimensions for pane snapping. Accepts an editor element or any
  container holding one. Deliberately measured from the DOM, not CM's height
  model — contentHeight/scrollWidth drift from rendered reality around content
  padding and fold widgets (verified against the previous implementation's
  tuned values).
*/
export const measureEditor = (element) => {
  const editorElement = element?.classList?.contains('cm-editor')
    ? element
    : element?.querySelector('.cm-editor');
  if (!editorElement) {
    return { gutterWidth: 0, lineWidth: 0, naturalWidth: 0, naturalHeight: 0 };
  }
  const gutter = editorElement.querySelector('.cm-gutters');
  const gutterWidth = gutter?.getBoundingClientRect().width ?? 0;
  const range = document.createRange();
  let lineWidth = 0;
  for (const line of editorElement.querySelectorAll('.cm-line')) {
    range.selectNodeContents(line);
    lineWidth = Math.max(lineWidth, range.getBoundingClientRect().width);
  }
  const naturalHeight = (gutter && Number.parseFloat(getComputedStyle(gutter).minHeight))
    || editorElement.querySelector('.cm-content')?.getBoundingClientRect().height
    || 0;
  return { gutterWidth, lineWidth, naturalWidth: gutterWidth + lineWidth, naturalHeight };
};

/* classed markers so hosts can style open/closed states — CM's defaults are bare text */
const gutters = () => [
  cmLineNumbers(),
  foldGutter({
    markerDOM(open) {
      const marker = document.createElement('span');
      marker.className = open ? 'cm-foldMarker-open' : 'cm-foldMarker-closed';
      marker.textContent = open ? '⌄' : '›';
      return marker;
    },
  }),
];

export const createEditor = ({
  parent,
  lineNumbers = false,
  lineWrapping = false,
  readonly = false,
  pragmaMode = 'on',
  tabSize = 2,
  onChange,
  // fires with measureEditor() output when CM reports layout geometry changes
  onSizeChange,
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
    if (onSizeChange && (update.geometryChanged || update.docChanged)) {
      onSizeChange(measureEditor(update.view.dom));
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
    syntaxHighlighting(highlightStyle),
    // tok-* classes stay available as CSS hooks for language-specific overrides
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
    compartments.lineNumbers.of(lineNumbers ? gutters() : []),
    compartments.lineWrapping.of(lineWrapping ? EditorView.lineWrapping : []),
    compartments.readonly.of(readonly ? EditorState.readOnly.of(true) : []),
  ];

  const createFileState = (fileName, content) => {
    return EditorState.create({
      doc: content,
      extensions: [
        ...baseExtensions,
        compartments.language.of(getLanguage(fileName)),
        EditorView.contentAttributes.of({ 'data-language': getLanguageFamily(fileName) }),
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
        // same file, externally changed content (project reset) — apply as an edit
        if (view.state.doc.toString() !== content) {
          adapter.setContent(content);
        }
        return;
      }
      let state = fileStates.get(fileName);
      if (!state || state.doc.toString() !== content) {
        state = createFileState(fileName, content);
      }
      currentFile = fileName;
      view.setState(state);
      // the initial layout isn't a view update — measure once it lands
      if (onSizeChange) {
        view.requestMeasure({ read: () => onSizeChange(measureEditor(view.dom)) });
      }
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
      view.dispatch({ effects: compartments.lineNumbers.reconfigure(enabled ? gutters() : []) });
    },

    setLineWrapping(enabled) {
      view.dispatch({ effects: compartments.lineWrapping.reconfigure(enabled ? EditorView.lineWrapping : []) });
    },

    setReadonly(enabled) {
      view.dispatch({ effects: compartments.readonly.reconfigure(enabled ? EditorState.readOnly.of(true) : []) });
    },

    measure() {
      return measureEditor(view.dom);
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
