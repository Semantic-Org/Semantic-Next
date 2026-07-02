import { $ } from '@semantic-ui/query';
import { plasmaConfig } from '../data/homepage.js';
import { createPlasma } from './plasma.js';

createPlasma('#plasma', { ...plasmaConfig, fadeInClass: false });

/*-------------------------------
      Tour Scroll Switching
-------------------------------*/

const $tourExamples = $('.tour .example');
const $tourCopies = $('.tour .content .copy');

const updateTourSection = () => {
  let activeSection = $tourCopies.first().data('section');
  $tourCopies.each((copy) => {
    const $copy = $(copy);
    if ($copy.bounds().top < window.innerHeight / 3) {
      activeSection = $copy.data('section');
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
