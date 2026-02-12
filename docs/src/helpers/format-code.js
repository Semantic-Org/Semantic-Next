import fs from 'node:fs';
import pretty from 'pretty';
import { createHighlighter } from 'shiki';

const sui = {
  id: 'sui',
  scopeName: 'source.sui',
  aliases: ['sui-template'],
  ...JSON.parse(fs.readFileSync('./../sui.tmlanguage.json', 'utf-8')),
  name: 'sui',
};

const highlighter = await createHighlighter({
  themes: ['github-dark'],
  langs: ['html', 'json', 'javascript', sui],
});

// greys out everything except classes/attributes to emphasize them
const highlightClassesReplacements = {
  // dark mode
  '#85e89d': '#979797', // <foo
  '#e1e4e8': '#979797',
  '#b392f0': '#58C1FE', // attr
  '#032F62': '#6F42C1',
  '#FFAB70': '#58C1FE',
  // light mode
  '#22863a': '#777',
  '#24292e': '#777',
};

export const formatCode = (code, lang = 'html', { highlightClasses = false } = {}) => {
  if (lang === 'html') {
    code = pretty(code, { ocd: true });
  }
  const colorReplacements = highlightClasses ? highlightClassesReplacements : {};
  return highlighter.codeToHtml(code, { lang, theme: 'github-dark', colorReplacements });
};
