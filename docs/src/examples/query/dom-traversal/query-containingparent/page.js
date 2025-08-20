import { $ } from '@semantic-ui/query';

const $box = $('.box');
const $log = $('.log');
const $target = $('.target');

// Simple log helper
const log = (text) => $log.text(text);

// Show initial position
log(`Target offsetTop: ${$target.prop('offsetTop')}px`);

// Toggle transform on box
$('.toggle-transform').on('click', () => {
  const currentTransform = $box.css('transform');
  if (currentTransform === 'none') {
    $box.css('transform', 'scale(1)');
    log('Box transform set to: scale(1) - Now box is the containing parent!');
  }
  else {
    $box.css('transform', 'none');
    log('Box transform set to: none');
  }

  // Show how offsetTop is now relative to different element
  setTimeout(() => {
    $log.append(`<br>Target offsetTop: ${$target.prop('offsetTop')}px`);
  }, 10);
});

// Toggle filter on box
$('.toggle-filter').on('click', () => {
  const currentFilter = $box.css('filter');
  if (currentFilter === 'none') {
    $box.css('filter', 'brightness(1)');
    log('Box filter set to: brightness(1) - Now box is the containing parent!');
  }
  else {
    $box.css('filter', 'none');
    log('Box filter set to: none');
  }

  // Show how offsetTop is now relative to different element
  setTimeout(() => {
    $log.append(`<br>Target offsetTop: ${$target.prop('offsetTop')}px`);
  }, 10);
});

// Find containing parent
$('.find').on('click', () => {
  $('.highlight').removeClass('highlight');

  const $containingParent = $('.target').containingParent();
  $containingParent.addClass('highlight');

  if ($containingParent.is('.container')) {
    log('Containing parent: .container (as expected)');
  }
  else if ($containingParent.is('.box')) {
    log('Containing parent: .box (due to transform/filter!)');
  }

  // Compare with browser's offsetParent
  const $offsetParent = $('.target').containingParent({ calculate: false });
  if (!$offsetParent.is($containingParent)) {
    $log.append('<br>Note: Browser offsetParent is different!');
  }
});
