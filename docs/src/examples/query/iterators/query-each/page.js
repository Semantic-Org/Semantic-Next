import { $ } from '@semantic-ui/query';

const updateOutput = (message) => {
  $('.output').text(message);
};

$('.iterate').on('click', () => {
  let results = [];
  $('.item').each((el, index) => {
    $(el).addClass('processed');
    results.push(`Item ${index}: "${el.text()}"`);
  });
  updateOutput(results.join('\n'));
});

$('.number').on('click', () => {
  $('.item').each((el, index) => {
    $(el).text(`${index + 1}. ${el.text().replace(/^\d+\.\s*/, '')}`);
  });
  updateOutput('Added numbers to all items');
});

$('.reset').on('click', () => {
  $('.item').removeClass('processed');
  $('.item').each((el, index) => {
    const letters = ['A', 'B', 'C', 'D'];
    $(el).text(`Item ${letters[index]}`);
  });
  updateOutput('Reset all items');
});
