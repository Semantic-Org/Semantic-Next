import { $ } from '@semantic-ui/query';

// Append content to container
$('.container').append('<p class="appended">Appended paragraph</p>');

// Append multiple items to list
$('.list').append(
  '<div class="appended">Item 3 (appended)</div>',
  '<div class="appended">Item 4 (appended)</div>',
);
