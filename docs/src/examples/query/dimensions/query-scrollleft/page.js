import { $ } from '@semantic-ui/query';

const $container = $('.container');

// Update scroll position display
const updatePosition = () => {
  const position = $container.scrollLeft();
  $('.scroll-position').text(position);
};

// Set up scroll position buttons
$('.scroll-start').on('click', () => {
  $container.scrollLeft(0);
  updatePosition();
});

$('.scroll-middle').on('click', () => {
  $container.scrollLeft(150);
  updatePosition();
});

$('.scroll-end').on('click', () => {
  $container.scrollLeft(400);
  updatePosition();
});

// Update position when scrolling
$container.on('scroll', updatePosition);

// Initial position
updatePosition();
