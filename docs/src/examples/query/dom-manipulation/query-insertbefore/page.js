import { $ } from '@semantic-ui/query';

let insertCount = 0;

$('.insert-before-2').on('click', () => {
  insertCount++;
  const newElement = `<div class="item inserted">Inserted ${insertCount}</div>`;
  $(newElement).insertBefore('[data-id="2"]');
});

$('.insert-before-3').on('click', () => {
  insertCount++;
  const newElement = `<div class="item inserted">Inserted ${insertCount}</div>`;
  $(newElement).insertBefore('[data-id="3"]');
});

$('.reset-btn').on('click', () => {
  $('.inserted').remove();
  insertCount = 0;
});
