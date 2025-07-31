import { $ } from '@semantic-ui/query';

// lets make a $ operator that is available on an element
const boxEl = document.querySelector('.box');
boxEl.$ = (selector) => {
  return $(selector, { root: boxEl });
};

boxEl.$('.circle').addClass('red');
