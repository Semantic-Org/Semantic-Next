import { $ } from '@semantic-ui/query';

$('advanced-color-picker').on('colorselected', (event) => {
  console.log(`You selected ${event.detail.color}`);
});
