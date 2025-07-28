import { $ } from '@semantic-ui/query';
import { copyText } from '@semantic-ui/utils';

const $button = $('.copy');
const $status = $('.status');

$button.on('click', async () => {
  await copyText('Hello from Semantic UI utils!');
  $status.text('Copied to clipboard');
});
