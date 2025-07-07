import { $ } from '@semantic-ui/query';

$('.update').on('click', () => {
  $('ui-profile').settings({
    name: 'Alice',
    color: 'red'
  });
});