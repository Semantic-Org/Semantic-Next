import { $ } from 'https://cdn.semantic-ui.com/query@canary';

$('#library').on('change', (e) => {
  const library = e.target.value;
  $('#icon-set').attr('href', `https://cdn.semantic-ui.com/icons@canary/${library}`);
});
