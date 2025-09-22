import { throttle } from '@semantic-ui/utils';

function trackEvent(event) {
  console.log(`Event: ${event}`);
  return event;
}

// basic throttling - leading and trailing (default)
const throttled = throttle(trackEvent, 200);
throttled('click1'); // executes immediately
throttled('click2'); // queued for trailing
throttled('click3'); // replaces click2

// leading only
setTimeout(() => {
  const leadingOnly = throttle(trackEvent, 200, { leading: true, trailing: false });
  leadingOnly('scroll1'); // executes immediately
  leadingOnly('scroll2'); // ignored
  leadingOnly('scroll3'); // ignored
}, 400);

// trailing only
setTimeout(() => {
  const trailingOnly = throttle(trackEvent, 200, { leading: false, trailing: true });
  trailingOnly('move1'); // queued
  trailingOnly('move2'); // replaces move1
  trailingOnly('move3'); // executes after 200ms
}, 700);

// high frequency events
setTimeout(() => {
  const throttledInput = throttle(trackEvent, 100);
  for (let i = 1; i <= 5; i++) {
    setTimeout(() => throttledInput(`input${i}`), i * 30);
  }
}, 1000);
