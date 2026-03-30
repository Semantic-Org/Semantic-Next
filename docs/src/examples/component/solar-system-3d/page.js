import { $ } from '@semantic-ui/query';

const presets = {
  all: [1, 1, 1, 1, 1, 1, 1, 1],
  inner: [1, 1, 1, 1, 0, 0, 0, 0],
  outer: [0, 0, 0, 0, 1, 1, 1, 1],
  habitable: [0, 1, 1, 1, 0, 0, 0, 0],
};

$('ui-menu').settings({
  items: [
    { label: 'All Planets', value: 'all' },
    { label: 'Inner Planets', value: 'inner' },
    { label: 'Outer Planets', value: 'outer' },
    { label: 'Habitable Zone', value: 'habitable' },
  ],
});

$('ui-menu').on('change', (event) => {
  $('solar-system-3d').settings({ visible: presets[event.detail.value] });
});
