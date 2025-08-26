import { Anchor, Transition } from '@semantic-ui/core';
import { $ } from '@semantic-ui/query';

$('.outer .popup').anchor({
  to: '.outer .box',
  offset: 0,
  position: 'top right',
});

$('.scroll .popup').anchor({
  to: '.scroll .box',
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
