import { $ } from '@semantic-ui/query';

// Get direct children
const children = $('.parent').children();
children.addClass('found');

$('.count').text(children.count());
$('.types').text(children.map(el => el.tagName.toLowerCase()).join(', '));
