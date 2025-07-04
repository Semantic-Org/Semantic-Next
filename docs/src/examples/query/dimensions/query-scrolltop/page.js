import { $ } from '@semantic-ui/query';

// Get initial scroll position
$('.position').text($('.scrollbox').scrollTop());

// Set scroll position to middle
$('.scrollbox').scrollTop(50);

// Update display on scroll
$('.scrollbox').on('scroll', () => {
  $('.position').text($('.scrollbox').scrollTop());
});
