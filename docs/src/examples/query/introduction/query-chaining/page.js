import { $ } from '@semantic-ui/query';

// perform 3 actions all on '.item'
$('.item')
  .addClass('bordered')
  .addClass('padded')
  .text('Chained!');
