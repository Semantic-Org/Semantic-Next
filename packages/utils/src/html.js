import { isString } from './types.js';

/*-------------------
        HTML
--------------------*/

export const indentLines = (text, spaces = 2) => {
  if (!isString(text)) {
    return '';
  }
  const indent = ' '.repeat(spaces);
  return text.split('\n').map(line => `${indent}${line}`).join('\n');
};

export const indentHTML = (html, options = {}) => {
  const {
    indent = '  ',
    startLevel = 0,
    trimEmptyLines = true,
  } = options;

  if (!isString(html)) {
    return '';
  }

  // Void elements that don't have closing tags
  const voidElements = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
  ]);

  let depth = startLevel;
  const lines = html
    .split('\n')
    .map(line => line.trim())
    .filter(line => !trimEmptyLines || line.length > 0);

  return lines
    .map(line => {
      // Handle closing tags - decrease depth before indenting
      if (line.startsWith('</')) {
        depth = Math.max(0, depth - 1);
      }

      const indented = indent.repeat(depth) + line;

      // Handle opening tags - increase depth after indenting
      if (line.startsWith('<') && !line.startsWith('</') && !line.startsWith('<!--')) {
        const isSelfClosing = line.endsWith('/>');
        const tagMatch = line.match(/<(\w+)/);
        const tag = tagMatch?.[1];
        const isVoid = tag && voidElements.has(tag);
        const hasClosingTag = tag && line.includes(`</${tag}>`);

        if (!isSelfClosing && !isVoid && !hasClosingTag) {
          depth++;
        }
      }

      return indented;
    })
    .join('\n');
};
