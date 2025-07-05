import { $ } from '@semantic-ui/query';

let prependCount = 0;

$('.prepend-text').on('click', () => {
  prependCount++;
  $('.container').prepend(`Prepended text ${prependCount}. `);
});

$('.prepend-element').on('click', () => {
  prependCount++;
  const element = `<div class="prepended">Prepended element ${prependCount}</div>`;
  $('.container').prepend(element);
});

$('.reset-btn').on('click', () => {
  $('.container').html(`
    <h3>Container Title</h3>
    <p>Original content</p>
    <p>More original content</p>
  `);
  prependCount = 0;
});
