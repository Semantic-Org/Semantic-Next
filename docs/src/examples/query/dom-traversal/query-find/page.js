import { $ } from '@semantic-ui/query';

// Find specific elements within container
const foundParagraphs = $('.container').find('.text');
const foundNotes = $('.container').find('.note');

// Count and highlight found elements
$('.found').text(foundParagraphs.count());
$('.notes').text(foundNotes.count());

// Highlight found elements
foundParagraphs.addClass('found-element');
foundNotes.addClass('found-element');
