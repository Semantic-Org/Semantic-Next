import fs from 'node:fs';
import { createHighlighter } from 'shiki';
import { colorReplacements, formatCode } from './shared.js';

export { formatCode };

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

export function highlightCode(code, { lang = 'html', format = true, highlightClasses = false } = {}) {
  if (format) {
    code = formatCode(code, { lang });
  }
  const replacements = highlightClasses ? colorReplacements : {};
  return highlighter.codeToHtml(code, { lang, theme: 'github-dark', colorReplacements: replacements });
}
