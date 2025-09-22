import { $ } from '@semantic-ui/query';

const $box = $('.box');
const $log = $('.log');

// Toggle display: none
$('.toggle-display').on('click', () => {
  const currentDisplay = $box.css('display');
  if (currentDisplay === 'none') {
    $box.css('display', 'block');
    $log.text('Display set to: block');
  }
  else {
    $box.css('display', 'none');
    $log.text('Display set to: none');
  }
});

// Toggle opacity: 0
$('.toggle-opacity').on('click', () => {
  const currentOpacity = $box.css('opacity');
  if (currentOpacity === '0') {
    $box.css('opacity', '1');
    $log.text('Opacity set to: 1');
  }
  else {
    $box.css('opacity', '0');
    $log.text('Opacity set to: 0');
  }
});

// Check visibility
$('.check').on('click', () => {
  const visible = $box.isVisible();
  const visibleWithOpacity = $box.isVisible({ includeOpacity: true });

  $log.html(`
    .isVisible(): ${visible}<br>
    .isVisible({ includeOpacity: true }): ${visibleWithOpacity}
  `);
});
