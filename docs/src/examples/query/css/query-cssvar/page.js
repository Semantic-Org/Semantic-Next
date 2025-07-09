import { $ } from '@semantic-ui/query';

// Get CSS variable values
$('.themecolor').text($('.themed').cssVar('theme-color'));
$('.spacing').text($('.themed').cssVar('spacing'));
$('.rootvar').text($(':root').cssVar('standard-5'));

// Set CSS variables
$('.themed').cssVar('theme-color', 'purple');
$('.themed').cssVar('spacing', '30px');
