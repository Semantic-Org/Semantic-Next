import { $ } from '@semantic-ui/query';

function checkIntersection() {
  const result = $('.source').intersects('.target', {
    returnDetails: true,
  });
  console.log(result);
  const info = `INTERSECTION DETAILS:

Intersects: ${result.intersects ? '✓ YES' : '✗ NO'}
Overlap Ratio: ${(result.ratio * 100).toFixed(1)}%

Side Detection:
  Top: ${result.top ? '✓' : '✗'}
  Bottom: ${result.bottom ? '✓' : '✗'}
  Left: ${result.left ? '✓' : '✗'}
  Right: ${result.right ? '✓' : '✗'}

${
    result.rect
      ? `Intersection Rectangle:
  X: ${result.rect.left.toFixed(1)}px
  Y: ${result.rect.top.toFixed(1)}px
  Width: ${result.rect.width.toFixed(1)}px
  Height: ${result.rect.height.toFixed(1)}px`
      : 'Intersection Rectangle: None'
  }`;

  $('.output pre').text(info);

  // Update visual state
  const $boxes = $('.box');
  if (result.intersects) {
    $boxes.addClass('intersecting');
  }
  else {
    $boxes.removeClass('intersecting');
  }
}

// Drag functionality
let isDragging = false;
let $dragged = null;
let offset = { top: 0, left: 0 };

$('.box').on('mousedown', function(event) {
  event.preventDefault();
  isDragging = true;
  $dragged = $(this);
  const bounds = $dragged.bounds();
  offset = {
    top: event.clientY - bounds.top,
    left: event.clientX - bounds.left,
  };
  moveElementToMouse(event);
});

$(document)
  .on('pointermove', function(event) {
    if (isDragging && $dragged) {
      moveElementToMouse(event);
    }
  })
  .on('pointerup', function() {
    isDragging = false;
    $dragged = null;
  });

function moveElementToMouse(event) {
  const container = $('.container').dimensions();
  $dragged.position({
    relativeTo: '.container',
    top: event.clientY - container.top - offset.top,
    left: event.clientX - container.left - offset.left,
  });
  checkIntersection();
}

// Initial check
checkIntersection();
