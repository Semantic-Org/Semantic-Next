import { $ } from '@semantic-ui/query';
import { plasmaConfig } from '../data/homepage.js';
import { createPlasma } from './plasma.js';

createPlasma('#plasma', plasmaConfig);

/*-------------------------------
      Tour Scroll Switching
-------------------------------*/

const $tourExamples = $('.tour .example');
const $tourCopies = $('.tour .content .copy');
const sections = ['templates', 'specs', 'components'];

const updateTourSection = () => {
  let activeSection = sections[0];
  $tourCopies.each((copy, index) => {
    const bounds = $(copy).bounds();
    if (bounds.top < window.innerHeight / 3) {
      activeSection = sections[index];
    }
  });
  $tourExamples.each((example) => {
    const $example = $(example);
    if ($example.data('section') === activeSection) {
      $example.addClass('active');
    }
    else {
      $example.removeClass('active');
    }
  });
};

$(window).on('scroll', updateTourSection);
updateTourSection();

/*-------------------------------
      Showcase Tab Switching
-------------------------------*/

const $showcaseMenu = $('.showcase .menu');
const $showcaseExamples = $('.showcase .example');

$showcaseMenu.on('change', (event) => {
  const value = event.detail.value;
  $showcaseExamples.each((example) => {
    const $example = $(example);
    if ($example.data('example') === value) {
      $example.addClass('active');
    }
    else {
      $example.removeClass('active');
    }
  });
});
