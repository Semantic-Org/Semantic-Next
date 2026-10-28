import { $ } from '@semantic-ui/query';
import { About, Home } from './component.js';

const main = $('main').el();
const footer = $('footer').el();
let page;

const show = (Page) => {
  page?.unmount();
  page = Page.mount(main, { anchor: footer });
};

$('.home').on('click', () => show(Home));
$('.about').on('click', () => show(About));
show(Home);
