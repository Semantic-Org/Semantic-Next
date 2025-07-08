import { $ } from '@semantic-ui/query';

// Toggle disabled
$('.disable').on('click', () => {
  $('ui-input').removeAttr('disabled');
});

// Toggle large
$('.large').on('click', () => {
  $('ui-input').removeAttr('large');
});

// Toggle placeholder
$('.placeholder').on('click', () => {
  $('ui-input').removeAttr('placeholder');
});
