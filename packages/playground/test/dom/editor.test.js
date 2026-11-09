import { describe, expect, it } from 'vitest';

import { createEditor } from '../../src/editor/editor.js';

const mount = (options) => {
  const parent = document.createElement('div');
  document.body.append(parent);
  const editor = createEditor({ parent, ...options });
  editor.openFile('app.js', `/* sui-fold */const hidden = true;/* sui-fold-end */\nconst shown = true;`);
  return { parent, editor };
};

describe('editor phrases', () => {
  it('names the fold widget in english by default', () => {
    const { parent } = mount();
    expect(parent.querySelector('.cm-foldMarker').title).toBe('Show hidden code');
  });

  it("uses the host's phrases for its own strings and CodeMirror's", () => {
    const { parent, editor } = mount({
      phrases: { 'Show hidden code': 'Versteckten Code anzeigen', 'Fold line': 'Zeile einklappen' },
    });
    expect(parent.querySelector('.cm-foldMarker').title).toBe('Versteckten Code anzeigen');
    expect(editor.view.state.phrase('Fold line')).toBe('Zeile einklappen');
  });
});
