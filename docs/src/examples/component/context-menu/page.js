import { $ } from '@semantic-ui/query';

// Display action in the feedback area
const showAction = (text) => {
  $('.output').html(text);
};

// Configure box context menu with item actions
$('context-menu.box').settings({
  items: [
    { 
      label: 'View Box', 
      icon: 'eye',
      action: () => showAction('Viewing box details') 
    },
    { 
      label: 'Edit Box', 
      icon: 'edit',
      shortcut: '⌘E',
      action: () => showAction('Opening box editor') 
    },
    { 
      label: 'Duplicate Box', 
      icon: 'copy', 
      shortcut: '⌘D',
      action: () => showAction('Box duplicated') 
    },
    { divider: true },
    { 
      label: 'Delete Box', 
      icon: 'trash', 
      shortcut: '⌫',
      action: () => showAction('Box deleted') 
    }
  ]
});

// Configure image context menu
$('context-menu.image').settings({
  width: 200,
  items: [
    { 
      label: 'View Image', 
      icon: 'eye',
      action: () => showAction('Opening image in viewer') 
    },
    { 
      label: 'Save Image As...', 
      icon: 'save',
      action: () => showAction('Opening save dialog') 
    },
    { 
      label: 'Copy Image', 
      icon: 'copy',
      action: () => showAction('Image copied to clipboard') 
    },
    { divider: true },
    { 
      label: 'Share Image', 
      icon: 'share',
      action: () => showAction('Opening share dialog') 
    }
  ]
});


$('context-menu').on('select', (event) => {
  console.log(`Menu item selected`, event.detail);
});
