export const BROWSER_TARGET = [
  'chrome58'
];

export const TS_COMPILER_OPTIONS = {
  experimentalDecorators: true,
  useDefineForClassFields: false,
  verbatimModuleSyntax: false
};

export const JS_LOADER_CONFIG = {
  '.ts': 'ts',
  '.html': 'text',
  '.css': 'text',
  '.png': 'file',
  '.svg': 'file',
  '.jpg': 'file',
  '.jpeg': 'file',
  '.gif': 'file',
};

export const CSS_LOADER_CONFIG = {
  '.css': 'css',
  '.png': 'file',
  '.svg': 'dataurl',
  '.jpg': 'file',
  '.jpeg': 'file',
  '.gif': 'file',
};
