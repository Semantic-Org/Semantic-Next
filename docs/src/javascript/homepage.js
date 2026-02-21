import { $ } from '@semantic-ui/query';
import { plasmaConfig } from '../data/homepage.js';
import { createPlasma } from './plasma.js';

createPlasma('#plasma', plasmaConfig);

const $visual = $('.visual');
const $copies = $('.tour .copy');
const allSections = ['one', 'two', 'three', 'four'];
const copySections = ['two', 'three', 'four'];

const update = () => {
  let activeClass = 'one';
  $copies.each((copy, index) => {
    const bounds = $(copy).bounds();
    if (bounds.top < window.innerHeight / 3) {
      activeClass = copySections[index];
    }
  });
  if (!$visual.hasClass(activeClass)) {
    allSections.forEach(s => $visual.removeClass(s));
    $visual.addClass(activeClass);
  }
};

$(window).on('scroll', update);
update();
