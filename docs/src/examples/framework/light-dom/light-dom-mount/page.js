import { $ } from '@semantic-ui/query';
import { Counter } from './component.js';

const target = $('.target').el();
let instance = Counter.mount(target);

$('.toggle').on('click', () => {
  if (target.isMounted) {
    instance.unmount();
    $('.toggle').text('Mount');
  }
  else {
    instance = Counter.mount(target);
    $('.toggle').text('Unmount');
  }
});
