import { $ } from '@semantic-ui/query';

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

// handle scroll
$('.container').on('scroll', checkVisibility);

function moveElementToMouse(event) {
  const container = $('.container').dimensions();
  $dragged.position({
    relativeTo: '.container',
    top: event.clientY - container.top + container.scrollTop - offset.top,
    left: event.clientX - container.left + container.scrollLeft - offset.left,
  });
  checkVisibility();
}

// Initial check
requestAnimationFrame(() => checkVisibility());

function checkVisibility() {
  const $box = $('.draggable');
  const $container = $('.container');

  // Check visibility with different thresholds
  const basicCheck = $box.isInView({ viewport: $container });
  const halfVisible = $box.isInView({ viewport: $container, threshold: 0.5 });
  const fullyVisible = $box.isInView({ viewport: $container, fully: true });

  const containerDims = $container.dimensions();

  const info = `VISIBILITY STATUS:

In View: ${basicCheck ? '✓ YES' : '✗ NO'}
50% Visible: ${halfVisible ? '✓ YES' : '✗ NO'}
Fully Visible: ${fullyVisible ? '✓ YES' : '✗ NO'}

Container Scroll:
  Top: ${containerDims.scrollTop}px
  Left: ${containerDims.scrollLeft}px`;

  $('.output pre').text(info);

  // Update visual state
  $box.removeClass('in-view partially-in-view out-of-view');
  if (fullyVisible) {
    $box.addClass('in-view');
  }
  else if (basicCheck) {
    $box.addClass('partially-in-view');
  }
  else {
    $box.addClass('out-of-view');
  }
}
