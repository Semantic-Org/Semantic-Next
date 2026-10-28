import { $ } from '@semantic-ui/query';

$('card-example').on('rendered', () => {
  $('card-example').update({
    title: 'Initial Card',
  });
});

$('.update').on('click', () => {
  $('card-example').update({
    color: 'red',
    title: 'Updated Card',
    subtitle: 'Synced settings and plain data',
  });
});
