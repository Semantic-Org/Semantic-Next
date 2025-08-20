import { $ } from '@semantic-ui/query';

const addLog = (text) => {
  $('.log').append(`<div>${text}</div>`);
};

$('.click').on('click', async function() {
  addLog('Clicked');

  // async style .one()
  await $(this).onNext('mouseleave');
  addLog('Left');
});
