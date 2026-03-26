import { Tooltip } from '@semantic-ui/core';
import { $ } from '@semantic-ui/query';

// Basic tooltip using data-text attribute
$('.basic').tooltip();

// Tooltip with header and text
$('.with-header').tooltip();

// Tooltip with custom position
$('.positioned').tooltip();

// Tooltip with compound position (e.g. "bottom left")
$('.compound').tooltip();

// Hoverable tooltip - stays open when hovering over tooltip
$('.hoverable').tooltip({
  hoverable: true,
});

// Tooltip without arrow
$('.no-arrow').tooltip({
  arrow: false,
});

// Tooltip removed from DOM after hiding
$('.no-preserve').tooltip({
  preserve: false,
});

// Click triggered tooltip
$('.click-trigger').tooltip({
  trigger: 'click',
});
