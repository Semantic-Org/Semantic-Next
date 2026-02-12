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

createHighlighterCore({
  themes: [githubDark],
  langs: [html],
  engine: createOnigurumaEngine(() => import('shiki/wasm')),
}).then(highlighter => {
  window.formatCode = (code, lang = 'html') => {
    if (lang === 'html') {
      code = pretty(code, { ocd: true });
    }
    return highlighter.codeToHtml(code, { lang, theme: 'github-dark', colorReplacements });
  };
});
