import { $ } from '@semantic-ui/query';

let blockIntercept = false;
let blockOn = false;

$('.block-intercept').on('change', function() {
  blockIntercept = this.checked;
});
$('.block-on').on('change', function() {
  blockOn = this.checked;
});

const log = (selector, text) => {
  const $log = $(selector);
  $log.html($log.html() + text + '<br>');
};

// intercept fires top-down (capture phase)
$('.outer').intercept('click', () => {
  $('.log').html('');
  log('.intercept-log', '1. outer');
});
$('.middle').intercept('click', () => {
  log('.intercept-log', '2. middle');
  if (blockIntercept) {
    log('.intercept-log', '<em>⛔ stopped</em>');
    log('.on-log', '<em>⛔ cancelled by intercept</em>');
    return false;
  }
});
$('.inner').intercept('click', () => log('.intercept-log', '3. inner'));

// on fires bottom-up (bubble phase)
$('.inner').on('click', () => log('.on-log', '1. inner'));
$('.middle').on('click', () => {
  log('.on-log', '2. middle');
  if (blockOn) {
    log('.on-log', '<em>⛔ stopped</em>');
    return false;
  }
});
$('.outer').on('click', () => log('.on-log', '3. outer'));
