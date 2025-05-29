import { $ } from '@semantic-ui/query';

$('.set').on('click', () => {
  const randomProgress = Math.random() * 100;
  $('progress-bar').attr('value', randomProgress);
});

$('.complete').on('click', () => {
  $('progress-bar').attr('value', 100);
});
