import { $ } from '@semantic-ui/query';

// dry
const getComponent = () => $('ui-counter').getComponent();

$('button').on('click', () => {
  let tpl = getComponent();
  let number = Number($('input').val());
  tpl.counter.set(number);
});


$('input')
  .on('focus', () => {
    let tpl = getComponent();
    tpl.stopCounter();
  });
$('input')
  .on('blur', () => {
    let tpl = getComponent();
    tpl.startCounter();
  })
;
