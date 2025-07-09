import { $ } from '@semantic-ui/query';

const target = $('.target');
const index = target.indexOf();

target.text(`Position: ${index}`);