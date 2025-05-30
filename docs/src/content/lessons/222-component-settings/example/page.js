import '@semantic-ui/component';
import { $ } from '@semantic-ui/query';

// Create a profile with query
const $profile = $('<ui-profile/>');

$profile.settings({
  username: 'Jamie Smith',
  role: 'Manager',
  avatar: '/images/avatar/daniel.jpg',
});

// Add to page
$('#js-profile-container').append($profile);

$profile.on('rendered', () => {
  // We can access the component instance using component()
  const component = $profile.component();
  // Call a component method
  component.activate();
});
