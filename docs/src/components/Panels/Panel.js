import { createComponent } from '@semantic-ui/component';
import { get, each, sortBy } from '@semantic-ui/utils';
import { ReactiveVar } from '@semantic-ui/reactivity';

import template from './Panel.html?raw';
import css from './Panel.css?raw';


const settings = {
  direction: 'vertical',
  resizable: true,
  itemCount: 'auto',
};

const createInstance = ({tpl, isServer, settings, el, $}) => ({

  isResizing: new ReactiveVar(false),
  getCurrentFlex() {
    return $(el).css('flex-grow');
  },
  getInitialFlex() {
    return 100 / tpl.getItemCount();
  },
  getResizeCursor() {
    return settings.direction == 'horizontal'
      ? 'w-resize'
      : 'ns-resize'
    ;
  },
  getItemCount() {
    let itemCount;
    if(settings.itemCount == 'auto') {
      itemCount = (isServer)
        ? 3
        : $(el).siblings() + 1
      ;
    }
    else {
      itemCount = settings.itemCount;
    }
    return itemCount;
  },
  setInitialFlex() {
    const initialFlex = tpl.getInitialFlex();
    $(el).css('flex-grow', initialFlex);
  }
});

const onCreated = ({ tpl, el }) => {
};

const onDestroyed = ({ tpl }) => {
};

const onRendered = ({ $, tpl, settings }) => {

  tpl.setInitialFlex();

};

const events = {
  'mousedown .handle'({event, tpl}) {
    console.log('resizing start');
    tpl.isResizing.set(true);
    $('body').css('cursor', tpl.getResizeCursor());
    $('body').one('mouseup', () => {
      $('body').css('cursor', null);
      tpl.isResizing.set(false);
    });
    event.preventDefault();
  },
  'mouseup .handle'({event, tpl}) {
    event.preventDefault();
  }
};

const Panel = createComponent({
  tagName: 'ui-panel',
  plural: true,
  template,
  css,
  createInstance,
  settings,
  onCreated,
  onDestroyed,
  onRendered,
  events,
});

export default Panel;
export { Panel };
