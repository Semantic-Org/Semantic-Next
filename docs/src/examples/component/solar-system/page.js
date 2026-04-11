import { $ } from '@semantic-ui/query';

const allPlanets = [
  { name: 'Mercury', radius: 48, size: 5, period: 4, color: '#b5b5b5', delay: -1.5 },
  { name: 'Venus', radius: 68, size: 9, period: 7, color: '#e8cda2', delay: -3 },
  { name: 'Earth', radius: 92, size: 10, period: 10, color: '#4b9fe0', delay: -6 },
  { name: 'Mars', radius: 116, size: 7, period: 15, color: '#e05d3a', delay: -8 },
  { name: 'Jupiter', radius: 152, size: 22, period: 28, color: '#d4a574', delay: -12 },
  { name: 'Saturn', radius: 188, size: 17, period: 40, color: '#e8d5a3', delay: -25, rings: true },
  { name: 'Uranus', radius: 218, size: 13, period: 55, color: '#7ec8e3', delay: -30 },
  { name: 'Neptune', radius: 240, size: 12, period: 72, color: '#3f5fcf', delay: -50 },
];

const byName = (...names) => allPlanets.filter(p => names.includes(p.name));

const presets = {
  all: allPlanets,
  inner: byName('Mercury', 'Venus', 'Earth', 'Mars'),
  outer: byName('Jupiter', 'Saturn', 'Uranus', 'Neptune'),
  habitable: byName('Venus', 'Earth', 'Mars'),
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
  $('solar-system').settings({ planets: presets[event.detail.value] });
});
