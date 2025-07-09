import { $ } from '@semantic-ui/query';

$('advanced-color-picker').on('color-selected', (event) => {
  console.log(`You selected ${event.detail.color}`);
});
