import { $ } from '@semantic-ui/query';

function checkViewportStatus(options = {}) {
  let info = 'CLIPPING PARENT VISIBILITY CHECK';

  if (options.threshold !== undefined) {
    info += ` (${Math.round(options.threshold * 100)}% threshold)`;
  }
  if (options.fully) {
    info += ' (fully visible only)';
  }

  info += ':\n\n';

  $('.test-element').each((element) => {
    const $element = $(element);
    const name = $element.attr('data-name');
    const isVisible = $element.isInView(options);

    info += `${name}: ${isVisible ? '✓ VISIBLE IN CONTAINER' : '✗ NOT VISIBLE IN CONTAINER'}\n`;

    // Visual feedback
    $element.removeClass('in-viewport partially-visible');
    if (isVisible) {
      $element.addClass('in-viewport');
    }
    else if ($element.isInView()) {
      $element.addClass('partially-visible');
    }
  });

  // Check all elements together
  const allVisible = $('.test-element').isInView(options);
  info += `\nAll elements visible in container: ${allVisible ? '✓ YES' : '✗ NO'}`;

  $('#viewport-info').text(info);
}

// Event handlers using Query
$('#check-viewport').on('click', () => {
  checkViewportStatus();
});

$('#check-threshold').on('click', () => {
  checkViewportStatus({ threshold: 0.5 });
});

$('#check-fully').on('click', () => {
  checkViewportStatus({ fully: true });
});

$('#scroll-to-middle').on('click', () => {
  const container = $('#scroll-area').el();
  const scrollHeight = container.scrollHeight;
  const clientHeight = container.clientHeight;
  container.scrollTop = (scrollHeight - clientHeight) / 2;

  // Check after scroll
  setTimeout(() => checkViewportStatus(), 100);
});

// Check on scroll
$('#scroll-area').on('scroll', () => {
  checkViewportStatus();
});

// Initial check
checkViewportStatus();
