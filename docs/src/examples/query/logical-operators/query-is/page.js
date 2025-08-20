import { $ } from '@semantic-ui/query';

$('.item').on('click', function() {
  // Test if element is .special
  const result = $(this).is('.special')
    ? 'Yes, this is .special'
    : 'No, this is not .special';

  $('.output').text(result);
});
