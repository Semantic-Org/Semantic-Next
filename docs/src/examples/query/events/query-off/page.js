import { $ } from '@semantic-ui/query';

const clickHandler = () => {
  $('.status').text('Handler executed!');
};

// Add initial handler
$('.target').on('click', clickHandler);

// Remove handler
$('.remove').on('click', () => {
  $('.target').off('click', clickHandler);
  $('.status').text('Handler removed - clicking target does nothing');
});

// Add handler back
$('.add').on('click', () => {
  $('.target').on('click', clickHandler);
  $('.status').text('Handler added back - click target to test');
});
