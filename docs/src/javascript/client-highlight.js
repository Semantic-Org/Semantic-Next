import { createHighlighter } from 'shiki';

const colorReplacements = {
  '#85e89d': '#979797',
  '#e1e4e8': '#979797',
  '#b392f0': '#58C1FE',
  '#032F62': '#6F42C1',
  '#FFAB70': '#58C1FE',
  '#22863a': '#777',
  '#24292e': '#777',
};

createHighlighter({
  themes: ['github-dark'],
  langs: ['html'],
}).then(highlighter => {
  window.formatCode = (code, lang = 'html') => {
    return highlighter.codeToHtml(code, { lang, theme: 'github-dark', colorReplacements });
  };
});
