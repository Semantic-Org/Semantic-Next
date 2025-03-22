import '@semantic-ui/component';
import { $ } from '@semantic-ui/query';

// Wait for DOM to be fully loaded
$(document).ready(() => {
  // Create a profile with JavaScript settings
  const profile = document.createElement('ui-profile');
  
  // Set settings directly as properties
  profile.username = 'Jamie Smith';
  profile.role = 'Manager';
  profile.avatar = '/images/avatar/daniel.jpg';
  
  // Add to page
  $('#js-profile-container').append(profile);
  
  // We can access the component instance using component()
  const component = $(profile).component();
  
  // Call a component method
  component.activate();
});