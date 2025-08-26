import { Anchor, Transition } from '@semantic-ui/core';
import { $ } from '@semantic-ui/query';

// initialize popup inside page
$('.outer .popup').anchor({
  to: '.outer .box',
  position: 'top right',
});

// initialize popup inside scroll element
$('.scroll .popup').anchor({
  to: '.scroll .box',
  position: 'top right',
});

// show popup when a box is hovered
$('.box')
  .on('mouseenter', function() {
    $('.popup').transition('scale top in');
  })
  .on('mouseleave', function() {
    $('.popup').transition('scale top out');
  });
