import { $ } from '@semantic-ui/query';

let index = 0;
const count = $('input').count();

$('.focus').on('click', () => {
  // Query has no .focus() - need raw DOM element
  $('input').get(index).focus();
  index = (index + 1) % count;
});
