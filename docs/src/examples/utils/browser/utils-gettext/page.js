import { $ } from '@semantic-ui/query';
import { getText } from '@semantic-ui/utils';

const $button = $('.load');
const $output = $('.output');

$button.on('click', async () => {
  const css = await getText('/fixtures/styles.css');
  $output.text(css);
});
