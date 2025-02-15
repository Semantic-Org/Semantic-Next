import { $ } from '@semantic-ui/query';

$('ui-tabs').settings({
  tabs: [
    { title: 'Home', content: 'Welcome to the Home tab.' },
    { title: 'Profile', content: 'This is your profile.' },
    { title: 'Settings', content: 'Adjust your preferences here.' }
  ]
});
