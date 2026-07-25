import { $ } from '@semantic-ui/query';

// the tag travels with the handler, so nothing here has to keep a reference to it
$('.pad')
  .on('pointermove.tracking', function(event) {
    $(this).text(`${event.offsetX}, ${event.offsetY}`);
  })
  .on('pointerleave.tracking', function() {
    $(this).text('move or click me');
  })
  .on('click.marking', function() {
    $(this).toggleClass('marked');
  });

$('.remove.tracking').on('click', () => $('.pad').off('.tracking'));
$('.remove.marking').on('click', () => $('.pad').off('.marking'));
