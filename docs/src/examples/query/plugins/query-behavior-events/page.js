import { $ } from '@semantic-ui/query';

let clears = 0;

$('.section').on('scrollspy:enter', ({ detail }) => {
  $('.enter').text(detail.index + 1);
});

$('.section').on('scrollspy:clear', () => {
  clears += 1;
  $('.clear').text(clears);
});

$('.section').scrollspy();

// after destroy the container still scrolls and nothing else moves
$('.destroy').on('click', () => {
  $('.section').scrollspy('destroy');
  $('.destroy').addAttr('disabled');
});
