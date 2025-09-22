import { $ } from '@semantic-ui/query';

const updateOutput = (message) => {
  $('.output').text(message);
};

$('.iterate').on('click', () => {
  let results = [];
  $('.item').each((el, index) => {
    $(el).addClass('processed');
    const text = $(el).text();
    results.push(`Item ${index}: "${text}"`);
  });

  updateOutput(results.join('\n'));
});

$('.number').on('click', () => {
  $('.item').each((el, index) => {
    const text = $(el).text().replace(/^\d+\.\s*/, '');
    $(el).text(`${index + 1}. ${text}`);
  });

  updateOutput('Added numbers to all items');
});

$('.reset').on('click', () => {
  $('.item')
    .removeClass('processed')
    .each((el, index) => {
      const letters = ['A', 'B', 'C', 'D'];
      $(el).text(`Item ${letters[index]}`);
    });

  updateOutput('Reset all items');
});
