import { $ } from '@semantic-ui/query';

// using query
$('user-profile').settings({
  getName: () => 'Sam',
  birthday: {
    month: 'January',
    day: '1st',
  },
});


/* vanilla js
const el = document.querySelector('user-profile');
el.getName = () => 'Sam';
el.birthday = {
  month: 'September',
  day: '30th',
};
*/
