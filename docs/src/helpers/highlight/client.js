import { getJSON, isClient } from '@semantic-ui/utils';
import { createHighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';
import html from 'shiki/langs/html.mjs';
import githubDark from 'shiki/themes/github-dark.mjs';
import { colorReplacements, formatCode } from './shared.js';

export { formatCode };

let highlighter;

export const ready = createHighlighterCore({
  themes: [githubDark],
  langs: [html],
  engine: createOnigurumaEngine(() => import('shiki/wasm')),
}).then(async (h) => {
  highlighter = h;
  if (!isClient) {
    return;
  }
  // load SUI grammar for template highlighting
  const suiGrammar = await getJSON('/sui.tmlanguage.json');
  if (suiGrammar) {
    await highlighter.loadLanguage({
      id: 'sui',
      scopeName: 'source.sui',
      aliases: ['sui-template'],
      ...suiGrammar,
      name: 'sui',
    });
  }
  window.formatCode = formatCode;
  window.highlightCode = highlightCode;
});

export function highlightCode(code, { lang = 'html', format = true } = {}) {
  if (!highlighter) {
    return `<pre><code>${code}</code></pre>`;
  }
  if (format) {
    code = formatCode(code, { lang });
  }
  return highlighter.codeToHtml(code, { lang, theme: 'github-dark', colorReplacements });
}
