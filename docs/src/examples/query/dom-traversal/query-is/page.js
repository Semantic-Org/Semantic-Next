import { $ } from '@semantic-ui/query';

$('.item').on('click', function() {
  // Reset highlighting
  $('.item').removeClass('clicked');
  $(this).addClass('clicked');

  // Test if element is .special
  const isSpecial = $(this).is('.special');
  const result = isSpecial ? 'Yes, this is .special' : 'No, this is not .special';

  $('.result').text(result);
});
