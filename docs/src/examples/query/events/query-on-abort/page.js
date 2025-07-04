import { $ } from '@semantic-ui/query';

let controller = null;

const updateStatus = (message) => {
  $('.status').text(message);
};

// Add listener with custom abort controller
$('.add').on('click', () => {
  if (controller) {
    updateStatus('Listener already exists');
    return;
  }

  controller = new AbortController();

  $('.target').on('click', () => {
    updateStatus('Target clicked! (listener is active)');
  }, { abortController: controller });

  $('.target').addClass('listening');

  $('.abort').removeClass('disabled');
  $('.add').addClass('disabled');
  updateStatus('Listener added with abort controller');
});

// Remove listener using abort controller
$('.abort').on('click', () => {
  if (!controller) {
    updateStatus('No listener to remove');
    return;
  }
  controller.abort();
  controller = null;
  $('.target').removeClass('listening');
  $('.abort').addClass('disabled');
  $('.add').removeClass('disabled');
  updateStatus('Listener removed using abort()');
});
