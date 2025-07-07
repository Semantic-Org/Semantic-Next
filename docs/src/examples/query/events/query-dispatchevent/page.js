import { $ } from '@semantic-ui/query';

$('.ping-dispatcher')
  .on('click', function() {
    console.log('got here', this);
    $(this).dispatchEvent('ping', { date: new Date() });
  })
;

$('.pong-dispatcher')
  .on('pong', function() {
    console.log('hereee');
    setTimeout(() => {
      $('.ping-dispatcher').dispatchEvent('ping', { date: new Date() });
    }, 1000);
  })
;
