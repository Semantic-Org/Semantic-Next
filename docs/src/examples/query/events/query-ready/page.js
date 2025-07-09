import { $ } from '@semantic-ui/query';

$(document).ready(() => {
  $('.status')
    .text('DOM Ready!')
    .addClass('ready');
});