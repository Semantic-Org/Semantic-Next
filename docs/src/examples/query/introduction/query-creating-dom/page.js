import { $ } from '@semantic-ui/query';

const newElement = $('<div class="created">Dynamically Created</div>');
$('.container').append(newElement);