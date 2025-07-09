import { $ } from '@semantic-ui/query';

const container = $('.container');
const target = $('.target');
const other = $('.other');

if (container.contains(target)) {
  container.addClass('highlight');
}

if (!container.contains(other)) {
  other.addClass('excluded');
}