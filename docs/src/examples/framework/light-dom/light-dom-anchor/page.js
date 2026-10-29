import { $ } from '@semantic-ui/query';
import { About, Home } from './component.js';

const pages = { home: Home, about: About };
const main = $('main').el();
const footer = $('footer').el();
let page;

const show = (name) => {
  page?.unmount();
  page = pages[name].mount(main, { anchor: footer });
};

$('ui-menu').on('change', ({ detail }) => show(detail.value));
show('home');
