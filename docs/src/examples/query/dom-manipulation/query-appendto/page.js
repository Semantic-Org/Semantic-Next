import { $ } from '@semantic-ui/query';

// Move items from source to containers using appendTo
$('.item').appendTo('.container');

// Create new elements and append them to first container
$('<div class="new-item">New Element</div>').appendTo('.container:first-child');
