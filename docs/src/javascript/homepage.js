import { $ } from '@semantic-ui/query';
import { plasmaConfig } from '../data/homepage.js';
import { createPlasma } from './plasma.js';

createPlasma('#plasma', { ...plasmaConfig, fadeInClass: false });

/*-------------------------------
      Scroll Reveals
-------------------------------*/

// gates the hidden initial states so content stays visible without js
document.body.classList.add('motion');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

// note: expressive-code blocks contain their own `.copy` button, so tour
// copy blocks are scoped under .content
document
  .querySelectorAll('.tour .content .copy, .nobuild .demo, .nobuild .intro, .showcase ui-container')
  .forEach((el) => revealObserver.observe(el));

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
