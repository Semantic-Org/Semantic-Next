import { $ } from '@semantic-ui/query';

// Get CSS property values
$('.color').text($('.box').css('color'));
$('.background').text($('.box').css('background-color'));
$('.width').text($('.target').css('width'));

// Set multiple CSS properties
$('.target').css({
  'background-color': 'lightgreen',
  'font-size': '18px',
  'text-align': 'center',
});

// Set single CSS property
$('.box').css('font-weight', 'bold');
