import { defineComponent } from '@semantic-ui/component';

import css from '../../menu-bundle.css?raw';
import componentSpec from '../../specs/menu-item.component.js';
import template from './menu-item.html?raw';

const onCreated = ({ data }) => {
};

const events = {
  'touchstart .menu'({ event, tpl, $ }) {
    $(this).addClass('pressed');
  },
  'touchend .menu'({ event, tpl, $ }) {
    $(this).removeClass('pressed');
  },
};

export const MenuItem = defineComponent({
  tagName: 'menu-item',
  events: events,
  onCreated,
  componentSpec,
  template,
  css,
});
