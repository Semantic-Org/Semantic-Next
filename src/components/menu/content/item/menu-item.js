import { defineComponent } from '@semantic-ui/component';
import { MenuItemComponentSpec } from '@semantic-ui/specs';

import componentSpec from '../../spec/menu-item-component.json';
import css from '../../menu-bundle.css?raw';
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
