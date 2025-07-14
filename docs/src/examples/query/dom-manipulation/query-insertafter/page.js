import { $ } from '@semantic-ui/query';

let insertCount = 0;

$('.insert-after-1').on('click', () => {
  insertCount++;
  const newElement = `<div class="item inserted">Inserted ${insertCount}</div>`;
  $(newElement).insertAfter('[data-id="1"]');
});

$('.insert-after-2').on('click', () => {
  insertCount++;
  const newElement = `<div class="item inserted">Inserted ${insertCount}</div>`;
  $(newElement).insertAfter('[data-id="2"]');
});

$('.reset-btn').on('click', () => {
  $('.inserted').remove();
  insertCount = 0;
});
