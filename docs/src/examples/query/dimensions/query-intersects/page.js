import { $ } from '@semantic-ui/query';
import { mapObject, roundNumber } from '@semantic-ui/utils';

// Drag functionality
let isDragging = false;
let $dragged = null;
let offset = { top: 0, left: 0 };

// handle drag and drop start
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

// handle drag & drop
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
    top: event.clientY - container.top + container.scrollTop - offset.top,
    left: event.clientX - container.left + container.scrollLeft - offset.left,
  });
  checkIntersection();
}

// Initial check
requestAnimationFrame(() => checkIntersection());

function checkIntersection() {
  const result = $('.source').intersects('.target', {
    returnDetails: true,
  });
  const rect = (result.rect)
    ? mapObject(result.rect, val => `${roundNumber(val)}px`)
    : null;
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
  X: ${roundNumber(rect.left)}
  Y: ${roundNumber(rect.top)}
  Width: ${roundNumber(rect.width)}
  Height: ${roundNumber(rect.height)}`
      : 'Intersection Rectangle: None'
  }`;

  $('.output pre').text(info);

  if (rect) {
    $('.overlap').css({
      opacity: 1,
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
  }
  else {
    $('.overlap').css({
      opacity: 0,
    });
  }

  // Update visual state
  const $boxes = $('.box').not('.overlap');
  if (result.intersects) {
    $boxes.addClass('intersecting');
  }
  else {
    $boxes.removeClass('intersecting');
  }
}
