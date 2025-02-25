import { $ } from '@semantic-ui/query';

$('rating-slider')
  .on('change', (event) => {
    const rating = event.detail.rating;
  })
  .on('finalized', (event) => {
    const rating = event.detail.rating;
    updateFeedbackMessage(rating);
    console.log('Final rating:', rating);
  })
;

function updateFeedbackMessage(value) {
  const $message = $('.message');

  // You could also use Query to add classes
  $message.removeClass('negative neutral positive');
  let ratingClass;
  if(value <= 2) {
    $message.text(`We're sorry to hear that. How can we improve?`);
    ratingClass = 'negative';
  }
  else if(value <= 4) {
    ratingClass = 'neutral';
    $message.text('Thanks for your feedback!');
  }
  else {
    $message.text(`Excellent! We're glad you're enjoying it!`);
    ratingClass = 'positive';
  }
  $message.addClass(`visible ${ratingClass}`);
}
