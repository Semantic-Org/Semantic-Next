import { $ } from '@semantic-ui/query';

$('ui-card').on('rendered', () => {
  $('ui-card').update({
    title: 'Initial Card',
  });
});

$('.update').on('click', () => {
  $('ui-card').update({
    color: 'red',
    title: 'Updated Card',
    subtitle: 'Synced settings and plain data',
  });
});
