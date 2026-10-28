import { $ } from '@semantic-ui/query';
import { Dialog } from './component.js';

const dialog = $('dialog').el();
Dialog.mount(dialog);

$('.open').on('click', () => {
  dialog.showModal();
});
