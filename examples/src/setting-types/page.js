import { $ } from '@semantic-ui/query';

// using query
$('user-profile').settings({
  getName: () => 'Sam',
  birthday: {
    month: 'January',
    day: 2,
  },
});

// configure the change link to modify the data of the component
$('.change').on('click', () => {
  $('user-profile').settings({
    birthday: {
      month: 'May',
      day: 3,
    },
  });
  return 'cancel';
});

/* vanilla js
const el = document.querySelector('user-profile');
el.getName = () => 'Sam';
el.birthday = {
  month: 'September',
  day: '30th',
};
*/
