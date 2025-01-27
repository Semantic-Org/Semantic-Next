import { $ } from '@semantic-ui/query';

// dry
const getComponent = () => $('ui-counter').getComponent();

$('button').on('click', () => {
  let counter = getComponent();
  let number = Number($('input').val());
  counter.setCounter(number);
});

$('input')
  .on('focus', () => {
    let counter = getComponent();
    counter.stopCounter();
  })
  .on('blur', () => {
    let counter = getComponent();
    counter.startCounter();
  })
;
