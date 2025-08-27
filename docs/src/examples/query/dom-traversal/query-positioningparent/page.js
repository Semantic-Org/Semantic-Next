import { $ } from '@semantic-ui/query';

const $box = $('.box');
const $target = $('.target');
const $fixedTarget = $('.fixed-target');

// Toggle filter on box
$('.toggle-filter').on('click', () => {
  const currentFilter = $box.css('filter');
  if (!currentFilter) {
    $box.css('filter', 'brightness(1)');
  }
  else {
    $box.css('filter', '');
  }
});

// Find positioning parent for absolute element
$('.find-absolute').on('click', () => {
  $('.highlight').removeClass('highlight');
  const $positioningParent = $target.positioningParent();
  $positioningParent.addClass('highlight');
});

// Find positioning parent for fixed element
$('.find-fixed').on('click', () => {
  $('.highlight').removeClass('highlight');
  const $positioningParent = $fixedTarget.positioningParent();
  $positioningParent.addClass('highlight');
});
