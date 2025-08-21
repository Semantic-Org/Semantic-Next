import { scopeStyles, getText } from '@semantic-ui/utils';

const css = await getText('styles.css');

// Basic scoping
const scoped = scopeStyles(css, '.my-component');
console.log('Scoped CSS:');
console.log(scoped);

// Replace :host selectors
const hostReplaced = scopeStyles(css, '.widget', { replaceHost: true });
console.log('\nWith :host replaced:');
console.log(hostReplaced);