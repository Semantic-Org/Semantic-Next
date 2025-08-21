import { $ } from '@semantic-ui/query';

const $sections = $('.section');

// Find specific elements within container
const foundParagraphs = $sections.find('.text');
const foundNotes = $sections.find('.note');

// Count and highlight found elements
$('.found').text(foundParagraphs.count());
$('.notes').text(foundNotes.count());

// Highlight found elements
foundParagraphs.addClass('found-element');
foundNotes.addClass('found-element');
