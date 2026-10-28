import { $ } from '@semantic-ui/query';

$('.update').on('click', () => {
  $('card-example').update({
    color: 'red',
    title: 'Updated Card',
    subtitle: 'Synced settings and plain data',
  });
});
