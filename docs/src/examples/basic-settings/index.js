import { $ } from '@semantic-ui/query';

// clicking on the link changes the name
$('.change').on('click', (event) => {
  $('name-card').settings({
    name: 'Simon'
  });
  event.preventDefault();
});
