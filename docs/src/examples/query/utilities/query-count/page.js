import { $ } from '@semantic-ui/query';

const updateCount = () => {
  $('.count').text($('.item').count());
};

$('.add').on('click', () => {
  $('.items').append('<div class="item">Item</div>');
  updateCount();
});

$('.remove').on('click', () => {
  $('.item').last().remove();
  updateCount();
});
