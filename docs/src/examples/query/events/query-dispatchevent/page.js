import { $ } from '@semantic-ui/query';
import { formatDate } from '@semantic-ui/utils';

const addLog = (text) => {
  $('.empty').remove();
  $('.log').append(`<div>${text}</div>`);
};

// custom events can pass through data, like the current time
const dispatchPingEvent = () => {
  $('.ping-dispatcher').dispatchEvent('ping', { date: new Date() });
};

// ping dispatcher will start the ping/pong chain on first click
// by sending a 'ping' event
$('.ping-dispatcher').on('click', dispatchPingEvent);

// pong dispatcher will emit a custom event which we can respond to
$('pong-dispatcher')
  .on('pong', function(event) {
    const displayDate = formatDate(event.detail.date, 'h:mm:ss a', { timezone: 'local' });
    addLog(`Pong received - ${displayDate}.`);
    setTimeout(dispatchPingEvent, 1000);
  })
;
