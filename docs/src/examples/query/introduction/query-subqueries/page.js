import { $ } from '@semantic-ui/query';

$('.container')
  .find('.item')
  .addClass('found')
  .end()
  .addClass('parent');