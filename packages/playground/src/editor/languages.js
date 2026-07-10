import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';

import { getExtension } from '../files.js';
import { templateLang } from './template-lang.js';

/* normalized family, exposed as data-language on the editor content for theming hooks */
export const getLanguageFamily = (fileName) => {
  const extension = getExtension(fileName);
  if (['js', 'mjs', 'jsx', 'ts', 'tsx', 'json'].includes(extension)) {
    return 'js';
  }
  if (['html', 'css'].includes(extension)) {
    return extension;
  }
  return 'text';
};

/*
  Language routing by filename. html maps to the SUI template language —
  fragments and pages alike are authored in it.
*/
export const getLanguage = (fileName) => {
  switch (getExtension(fileName)) {
    case 'js':
    case 'mjs':
      return javascript();
    case 'jsx':
      return javascript({ jsx: true });
    case 'ts':
      return javascript({ typescript: true });
    case 'tsx':
      return javascript({ typescript: true, jsx: true });
    case 'css':
      return css();
    case 'html':
      return templateLang;
    case 'json':
      return javascript();
    default:
      return [];
  }
};
