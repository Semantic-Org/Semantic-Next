import { extractCSS, getText } from '@semantic-ui/utils';

const css = await getText('styles.css');

// Extract and return CSS text
const btnCSS = extractCSS('.button', css, { returnText: true });
console.log('Button CSS:');
console.log(btnCSS);

// Extract as stylesheet object
const cardSheet = extractCSS('.card', css);
console.log(`\nCard stylesheet has ${cardSheet.cssRules.length} rules`);