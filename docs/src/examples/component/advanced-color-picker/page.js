import { $ } from '@semantic-ui/query';

$('advanced-color-picker').on('colorselected', (event) => {
  const { color, hexcode } = event.detail;
  console.log(`You selected ${color}, or hexcode ${hexcode}`);
});
