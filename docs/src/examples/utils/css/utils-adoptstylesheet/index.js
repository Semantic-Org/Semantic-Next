import { adoptStylesheet, getText } from '@semantic-ui/utils';

const css = await getText('styles.css');

// Adopt stylesheet to document
adoptStylesheet(css);
console.log('Stylesheet adopted - background should be blue');