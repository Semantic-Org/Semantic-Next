import { defineEcConfig } from 'astro-expressive-code';
import fs from 'fs';

import { semanticDark, semanticLight } from './src/themes/semantic-code-theme.mjs';

// Load the custom language definition
const sui = {
  id: 'sui',
  scopeName: 'source.sui',
  aliases: ['sui-template'],
  ...JSON.parse(fs.readFileSync('./../sui.tmlanguage.json', 'utf-8')),
  name: 'sui',
};

export default defineEcConfig({
  themes: [semanticLight, semanticDark],
  useDarkModeMediaQuery: false,
  themeCssSelector: (theme) => {
    // Map themes to html.dark class-based switching
    if (theme.type === 'dark') {
      return '.dark';
    }
    return ':root';
  },
  shiki: {
    langs: [sui],
  },
});
