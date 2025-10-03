import { $ } from '@semantic-ui/query';

// standard css selectors
$('.first').text('✅ Class Selector');
$('.box:nth-child(2)').text('✅ Complex CSS Selector');
$('.box[three]').text('✅ Attribute Selector');

// native elements
const fourEl = document.querySelector('.fourth');
$(fourEl).text('✅ Element Selector');

// NodeList
const fiveEl = document.querySelectorAll('.fifth');
$(fiveEl).text('✅ NodeList');

// Other query instances
const $sixEl = $('.sixth');
$($sixEl).text('✅ Query Collection');
