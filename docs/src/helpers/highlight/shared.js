import pretty from 'pretty';

export const colorReplacements = {
  // dark mode
  '#85e89d': '#979797',
  '#e1e4e8': '#979797',
  '#b392f0': '#58C1FE',
  '#032F62': '#6F42C1',
  '#FFAB70': '#58C1FE',
  // light mode
  '#22863a': '#777',
  '#24292e': '#777',
};

// js-beautify default inline elements + ui-label
const defaultInline = [
  'a',
  'abbr',
  'area',
  'audio',
  'b',
  'bdi',
  'bdo',
  'br',
  'button',
  'canvas',
  'cite',
  'code',
  'data',
  'datalist',
  'del',
  'dfn',
  'em',
  'embed',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'keygen',
  'label',
  'map',
  'mark',
  'math',
  'meter',
  'noscript',
  'object',
  'output',
  'progress',
  'q',
  'ruby',
  's',
  'samp',
  'select',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'svg',
  'template',
  'textarea',
  'time',
  'u',
  'var',
  'video',
  'wbr',
  'text',
  'acronym',
  'big',
  'strike',
  'tt',
];

const suiDefaults = {
  unformatted: ['code', 'pre'],
  inline_custom_elements: false,
  inline: [...defaultInline, 'ui-label'],
};

export function formatCode(code, { lang = 'html', sui = true, ...prettyOptions } = {}) {
  code = code.trim();
  if (lang === 'html') {
    code = pretty(code, {
      ocd: true,
      ...(sui && suiDefaults),
      ...prettyOptions,
    });
    if (sui) {
      // break trailing text after block-level icons onto its own line
      code = code.replace(/^([ \t]+)(<ui-icon[^>]*><\/ui-icon>)(\S)/gm, '$1$2\n$1$3');
    }
  }
  return code;
}
