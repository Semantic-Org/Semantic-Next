import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';

import template from './Panel.html?raw';
import css from './Panel.css?raw';


const settings = {
  direction: 'vertical',
  resizable: true,
  itemCount: 'auto',
};

const createInstance = ({tpl, isServer, settings, el, $}) => ({
  resizing: new ReactiveVar(false),
  getCurrentFlex() {
    return $(el).css('flex-grow');
  },
  getInitialFlex() {
    return 100 / tpl.getItemCount();
  },
  getResizeCursor() {
    return (settings.direction == 'horizontal')
      ? 'w-resize'
      : 'ns-resize'
    ;
  },
  getIndex() {
    return $(el).index('ui-panel');
  },
  getItemCount() {
    let itemCount;
    if(settings.itemCount == 'auto') {
      itemCount = (isServer)
        ? 3
        : $(el).siblings('ui-panel').count() + 1
      ;
    }
    else {
      itemCount = settings.itemCount;
    }
    return itemCount;
  },
  isResizable() {
    return settings.resizable && tpl.getIndex() !== 0;
  },
  setInitialFlex() {
    const initialFlex = tpl.getInitialFlex();
    $(el).css('flex-grow', initialFlex);
  },
  getPanels() {
    return tpl.parent('uiPanels');
  },
  getEventPosition(event) {
    return (settings.direction == 'horizontal')
      ? event.pageX
      : event.pageY
    ;
  },
  startResize(event) {
    tpl.resizing.set(true);
    tpl.startPosition = tpl.getEventPosition(event);
  },
  resize(event) {
    let newPosition = tpl.getEventPosition(event);
    let delta = newPosition - tpl.startPosition;
  },
  endResize() {
    $('body').off('mousemove').css('cursor', null);
    tpl.resizing.set(false);
  },
  beginResize(event) {
    tpl.startResize(event);
    $('body')
      .css('cursor', tpl.getResizeCursor())
      .on('mousemove', (event) => {
        tpl.resize(event);
      });
    $('body')
      .one('mouseup', (event) => {
        tpl.endResize(event);
      })
    ;
  }
});

const onCreated = ({ tpl, el }) => {
};

const onDestroyed = ({ tpl }) => {
};

const onRendered = ({ $, el, tpl, settings }) => {
  tpl.setInitialFlex();
};

const events = {
  'mousedown .handle'({event, settings, tpl}) {
    tpl.beginResize(event);
    event.preventDefault();
  },
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
