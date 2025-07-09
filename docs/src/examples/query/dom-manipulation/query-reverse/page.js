import { $ } from '@semantic-ui/query';

const updateOrderDisplay = () => {
  const order = $('.item').map(el => $(el).attr('data-order')).join(', ');
  $('.order-display').text(order);
};

$('.reverse-btn').on('click', () => {
  // Get reversed collection and replace in DOM
  const $items = $('.item').reverse();
  $('.container').html($items);
  updateOrderDisplay();
});

$('.reset-btn').on('click', () => {
  // Reset to original order (1, 2, 3, 4)
  const $items = $('.item').toArray().sort((a, b) =>
    parseInt($(a).attr('data-order')) - parseInt($(b).attr('data-order'))
  );
  $('.container').html($items);
  updateOrderDisplay();
});

// Initial display
updateOrderDisplay();
