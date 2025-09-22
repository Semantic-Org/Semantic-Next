import { $ } from '@semantic-ui/query';
import { openLink } from '@semantic-ui/utils';

const $button = $('.open');
const $status = $('.status');

$button.on('click', (event) => {
  openLink('https://semantic-ui.com', {
    newWindow: true,
    event,
  });
  $status.text('Opened in new window');
});
