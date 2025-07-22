import { $ } from '@semantic-ui/query';
import { getKeyFromEvent } from '@semantic-ui/utils';

const $input = $('.input');
const $output = $('.output');

$input.on('keydown', (event) => {
  const key = getKeyFromEvent(event);
  $output.text(`Key: ${key}`);
  event.preventDefault();
});
