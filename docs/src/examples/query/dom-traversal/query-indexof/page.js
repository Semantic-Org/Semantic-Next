import { $ } from '@semantic-ui/query';

const index = $('.item').indexOf('.target');

$('.debug').text(`Target is index ${index}`);
