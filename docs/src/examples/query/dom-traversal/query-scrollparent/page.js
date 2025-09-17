import { $ } from '@semantic-ui/query';

const $target = $('.target');
const $log = $('.log');

// Helper to clear logs
const clearLog = () => $log.text('');

// Helper to append to log
const log = (text) => {
  const current = $log.text();
  $log.text(current ? `${current}\n${text}` : text);
};

// Helper to get element description
const getElementDescription = (el) => {
  if (el === window) { return 'window (viewport)'; }
  if (el.tagName === 'HTML') { return 'html (document root)'; }

  const classes = el.className ? `.${el.className.split(' ').join('.')}` : '';
  return `${el.tagName.toLowerCase()}${classes}`;
};

// Find nearest scroll parent
$('.find.nearest').on('click', () => {
  $('.highlight').removeClass('highlight');
  clearLog();

  const $scrollParent = $target.scrollParent();

  if ($scrollParent.length) {
    const element = $scrollParent.el();

    // Only highlight if it's not window
    if (element !== window) {
      $scrollParent.addClass('highlight');
    }

    log('Finding nearest scroll parent for .target:');
    log(`→ ${getElementDescription(element)}`);

    if (element === window) {
      log('\nNote: Window is the default scroll container when no other scroll parents exist.');
    }
  }
  else {
    log('No scroll parent found');
  }
});

// Find all scroll parents
$('.find.all').on('click', () => {
  $('.highlight').removeClass('highlight');
  clearLog();

  const $scrollParents = $target.scrollParent({ all: true });

  log('Finding ALL scroll parents for .target:');

  if ($scrollParents.length) {
    $scrollParents.each((el, index) => {
      // Only highlight if it's not window
      if (el !== window) {
        $(el).addClass('highlight');
      }

      log(`${index + 1}. ${getElementDescription(el)}`);
    });

    log(`\nFound ${$scrollParents.length} scroll parent(s) in the chain.`);
  }
  else {
    log('No scroll parents found');
  }
});

// Reset highlights and clear log
$('.reset').on('click', () => {
  $('.highlight').removeClass('highlight');
  clearLog();
});
