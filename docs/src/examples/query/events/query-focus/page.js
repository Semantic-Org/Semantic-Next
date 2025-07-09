import { $ } from '@semantic-ui/query';

$('.focus-regular').on('click', () => {
  $('input').focus();
});

$('.focus-component').on('click', () => {
  $('example-field').focus();
});
