import { $ } from '@semantic-ui/query';

const $box = $('.box');
const $container = $('.container');
const $log = $('.log');

// Simple log helper
const log = (text) => $log.text(text);

// Toggle overflow on box
$('.toggle-overflow').on('click', () => {
  const currentOverflow = $box.css('overflow');
  if (currentOverflow === 'hidden') {
    $box.css('overflow', 'visible');
    log('Box overflow set to: visible');
  }
  else {
    $box.css('overflow', 'hidden');
    log('Box overflow set to: hidden');
  }
});

// Toggle contain on container
$('.toggle-contain').on('click', () => {
  const currentContain = $container.css('contain');
  if (currentContain === 'paint') {
    $container.css('contain', 'none');
    log('Container contain set to: none');
  }
  else {
    $container.css('contain', 'paint');
    log('Container contain set to: paint');
  }
});

// Find clipping parent
$('.find').on('click', () => {
  $('.highlight').removeClass('highlight');

  const $clippingParent = $('.target').clippingParent();
  $clippingParent.addClass('highlight');

  if ($clippingParent.is('html')) {
    log('Clipping parent: html');
  }
  else {
    const className = $clippingParent.attr('class').replace(' highlight', '');
    log(`Clipping parent: .${className}`);
  }
});
