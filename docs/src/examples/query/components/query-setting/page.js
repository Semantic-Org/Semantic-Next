import { $ } from '@semantic-ui/query';

$('.toggle').on('click', () => {
  const active = $('ui-display').setting('active');
  $('ui-display').setting('active', !active);
});

$('.change').on('click', () => {
  $('ui-display').setting('message', 'Updated!');
});