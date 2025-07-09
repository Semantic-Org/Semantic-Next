import { $ } from '@semantic-ui/query';

const updateOutput = (message) => {
  $('.output').text(message);
};

$('.get').on('click', () => {
  $('.item').removeClass('highlighted');
  const firstItem = $('.item').first();
  firstItem.addClass('highlighted');
  updateOutput(
    `Got first item as Query object\nText: "${firstItem.text()}"\nCan chain methods: ${firstItem.length > 0}`,
  );
});

$('.chain').on('click', () => {
  $('.item').removeClass('highlighted');
  $('.item').first().addClass('highlighted').text('First Item (Modified)');
  updateOutput('Chained .first().addClass().text() methods successfully');
});
