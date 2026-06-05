import { $ } from '@semantic-ui/query';
import { reaction, signal } from '@semantic-ui/reactivity';

const count = signal(0);

reaction(() => {
  $('.count').text(count.get());
});

$('.increment').on('click', () => count.increment());
$('.decrement').on('click', () => count.decrement());
