import { $ } from '@semantic-ui/query';

// Move relative to inner container
$('.move')
  .filter('.inner')
  .on('click', () => {
    $('.box').containerPosition({
      top: 50,
      left: 50,
    });
    updatePositions();
  }).end()
  .filter('.outer')
  .on('click', () => {
    $('.box').containerPosition({
      container: '.outer.container',
      top: 50,
      left: 50,
    });
    updatePositions();
  });

function updatePositions() {
  const innerPos = $('.box').containerPosition({ round: true });
  const outerPos = $('.box').containerPosition({ container: '.outer.container', round: true });

  $('.inner.position').text(`top: ${innerPos.top}px, left: ${innerPos.left}px`);
  $('.outer.position').text(`top: ${outerPos.top}px, left: ${outerPos.left}px`);
}

// Show initial positions
updatePositions();
