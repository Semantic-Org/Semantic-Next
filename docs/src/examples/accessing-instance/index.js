import { $ } from '@semantic-ui/query';

$('button').on('click', () => {
  let tpl = $('ui-counter').getComponent();
  let number = Number($('input').val());
  tpl.counter.set(number);
});
