import { isClient } from '@semantic-ui/utils';
import pretty from 'pretty';
import { createHighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';
import html from 'shiki/langs/html.mjs';
import githubDark from 'shiki/themes/github-dark.mjs';

const colorReplacements = {
  '#85e89d': '#979797',
  '#e1e4e8': '#979797',
  '#b392f0': '#58C1FE',
  '#032F62': '#6F42C1',
  '#FFAB70': '#58C1FE',
  '#22863a': '#777',
  '#24292e': '#777',
};

let highlighter;

export const ready = createHighlighterCore({
  themes: [githubDark],
  langs: [html],
  engine: createOnigurumaEngine(() => import('shiki/wasm')),
}).then(h => {
  highlighter = h;
  // backward compat for inline scripts during migration
  if (isClient) {
    window.formatCode = formatCode;
    window.highlightCode = highlightCode;
  }
});

const suiDefaults = {
  unformatted: ['code', 'pre'],
  inline_custom_elements: false,
  inline: ['ui-icon', 'ui-label'],
};

export function formatCode(code, lang = 'html', { sui = true, ...options } = {}) {
  code = code.trim();

  if (lang === 'html') {
    code = pretty(code, {
      ocd: true,
      ...(sui && suiDefaults),
      ...options,
    });
  }

  return code;
}

export function highlightCode(code, lang = 'html') {
  if (!highlighter) {
    return `<pre><code>${code}</code></pre>`;
  }
  return highlighter.codeToHtml(code, { lang, theme: 'github-dark', colorReplacements });
}
