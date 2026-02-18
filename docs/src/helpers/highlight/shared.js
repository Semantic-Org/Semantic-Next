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

const suiDefaults = {
  unformatted: ['code', 'pre'],
  inline_custom_elements: false,
  inline: ['ui-icon', 'ui-label'],
};

export function formatCode(code, { lang = 'html', sui = true, ...prettyOptions } = {}) {
  code = code.trim();
  if (lang === 'html') {
    code = pretty(code, {
      ocd: true,
      ...(sui && suiDefaults),
      ...prettyOptions,
    });
  }
  return code;
}
