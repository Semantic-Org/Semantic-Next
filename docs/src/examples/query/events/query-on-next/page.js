import { $ } from '@semantic-ui/query';

const addLog = (text) => {
  $('.log').append(`<div>${text}</div>`);
};

$('.click').on('click', async function() {
  addLog('Clicked');

  // will always run once after reentry into button
  await $(this).onNext('mouseleave');
  await $(this).onNext('mouseenter');
  addLog('You re-entered the button');
});
