import { $ } from '@semantic-ui/query';

// HTML String
const newElement = $('<div class="created">HTML String ✅</div>');
$('.container').append(newElement);

// Nested HTML
const newElements = $(`<div class="created">
  Nested HTML ✅
  <div class="nested">Nested</div>
</div>`);
$('.container').append(newElements);

// DOM Fragment
const fragment = document.createDocumentFragment();

const div = document.createElement('div');
div.classList.add('created');
div.innerHTML = 'DOM Fragment ✅';
fragment.appendChild(div);

const $fragmentContent = $(fragment);
$('.container').append($fragmentContent);
