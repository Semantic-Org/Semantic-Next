import { Anchor } from '@semantic-ui/core';
import { $ } from '@semantic-ui/query';

$('.popup').anchor({
  to: $('.box').el(),
  position: 'bottom',
});

$('.box')
  .on('mouseenter', function() {
    $('.popup').css('display', 'block');
  })
  .on('mouseleave', function() {
    $('.popup').css('display', '');
  });
