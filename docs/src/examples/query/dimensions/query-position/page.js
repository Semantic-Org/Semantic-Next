import { $ } from '@semantic-ui/query';

// Move relative to inner container
$('.move')
  .filter('.inner')
  .on('click', () => {
    $('.box').position({
      top: 30,
      left: 30,
    });
    updatePositions();
  }).end()
  .filter('.outer')
  .on('click', () => {
    $('.box').position({
      relativeTo: '.outer.container',
      top: 30,
      left: 30,
    });
    updatePositions();
  })
  .end()
  .filter('.global')
  .on('click', () => {
    $('.box').position({
      type: 'global',
      top: 30,
      left: 30,
    });
    updatePositions();
  });

function updatePositions() {
  // position() returns coordinate information in multiple coordinate systems
  const position = $('.box').position({ relativeTo: '.outer.container', round: true });

  // Show breakdown of coordinate systems
  $('.local.top').text(position.local.top);
  $('.local.left').text(position.local.left);
  $('.outer.top').text(position.relative.top);
  $('.outer.left').text(position.relative.left);
  $('.global.top').text(position.global.top);
  $('.global.left').text(position.global.left);
}

// Show initial positions
requestAnimationFrame(updatePositions);
