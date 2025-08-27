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
  });

function updatePositions() {
  const { relative, local } = $('.box').position({ relativeTo: '.outer.container', round: true });

  $('.inner.position').text(`top: ${local.top}px, left: ${local.left}px`);
  $('.outer.position').text(`top: ${relative.top}px, left: ${relative.left}px`);
}

// Show initial positions
updatePositions();
