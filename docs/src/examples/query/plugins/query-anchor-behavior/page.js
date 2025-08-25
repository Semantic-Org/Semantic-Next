import { Anchor, Transition } from '@semantic-ui/core';
import { $ } from '@semantic-ui/query';

$('.popup').anchor({
  to: '.box',
  offset: 0,
  position: 'top right',
});

$('.box')
  .on('mouseenter', function() {
    $('.popup').transition('scale top in');
  })
  .on('mouseleave', function() {
    $('.popup').transition('scale top out');
  });
