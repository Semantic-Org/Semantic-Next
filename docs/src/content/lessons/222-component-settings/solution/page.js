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
  
  // Get a reference to our component
  const getProfile = () => $('#js-profile-container ui-profile').component();
  
  // Update profile button
  $('#update-profile').on('click', () => {
    // Get values from inputs
    const username = $('#username').value();
    const role = $('#role').value();
    
    // Use the updateProfile method from our component
    getProfile().updateProfile({
      username: username,
      role: role
    });
  });
  
  // Toggle active status
  $('#toggle-active').on('click', () => {
    const profile = getProfile();
    
    if (profile.isActive.get()) {
      profile.deactivate();
    } else {
      profile.activate();
    }
  });
});