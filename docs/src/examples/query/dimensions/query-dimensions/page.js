import { $ } from '@semantic-ui/query';

function updateDimensions() {
  const dim = $('.box').dimensions();

  // Position
  $('.top').text(Math.round(dim.top));
  $('.left').text(Math.round(dim.left));
  $('.page-top').text(Math.round(dim.pageTop));
  $('.page-left').text(Math.round(dim.pageLeft));

  // Width dimensions
  $('.width').text(Math.round(dim.width));
  $('.inner-width').text(Math.round(dim.innerWidth));
  $('.outer-width').text(Math.round(dim.outerWidth));
  $('.margin-width').text(Math.round(dim.marginWidth));

  // Height dimensions
  $('.height').text(Math.round(dim.height));
  $('.inner-height').text(Math.round(dim.innerHeight));
  $('.outer-height').text(Math.round(dim.outerHeight));
  $('.margin-height').text(Math.round(dim.marginHeight));

  // Scroll dimensions
  $('.scroll-width').text(Math.round(dim.scrollWidth));
  $('.scroll-height').text(Math.round(dim.scrollHeight));
  $('.scroll-top').text(Math.round(dim.scrollTop));
  $('.scroll-left').text(Math.round(dim.scrollLeft));
}

// Show initial dimensions
updateDimensions();

// Toggle element size
$('.resize').on('click', () => {
  $('.box').toggleClass('resized');
  // Wait for transition to complete
  setTimeout(updateDimensions, 300);
});

// Toggle content to show scroll dimensions
$('.add-content').on('click', () => {
  const $box = $('.box');
  if ($box.hasClass('has-content')) {
    $box.removeClass('has-content');
    $box.html('Sample element with padding, border, and margin');
  }
  else {
    $box.addClass('has-content');
    $box.html(`Sample element with padding, border, and margin
    
<div class="extra-content">This is additional content that will cause the element to scroll when it exceeds the available space. This text should be long enough to demonstrate scroll dimensions when the content overflows the element boundaries.</div>`);
  }
  // Wait for DOM update
  setTimeout(updateDimensions, 50);
});
