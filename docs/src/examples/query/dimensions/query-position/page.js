import { $ } from '@semantic-ui/query';

// Move relative to inner container
$('.move')
  .filter('.inner')
  .on('click', () => {
    $('.box').position({
      top: 50,
      left: 50,
    });
    updatePositions();
  }).end()
  .filter('.outer')
  .on('click', () => {
    $('.box').position({
      relativeTo: '.outer.container',
      top: 50,
      left: 50,
    });
    updatePositions();
  })
  .end()
  .filter('.global')
  .on('click', () => {
    $('.box').position({
      type: 'global',
      top: 50,
      left: 50,
    });
    updatePositions();
  });

function updatePositions() {
  const position = $('.box').position({ relativeTo: '.outer.container', round: true });

  $('.inner.position').text(`top: ${position.local.top}px, left: ${position.local.left}px`);
  $('.outer.position').text(`top: ${position.relative.top}px, left: ${position.relative.left}px`);
  $('.global.position').text(`top: ${position.global.top}px, left: ${position.global.left}px`);
}

// Show initial positions
updatePositions();
