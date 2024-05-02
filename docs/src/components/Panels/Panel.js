import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import { sum } from '@semantic-ui/utils';

import template from './Panel.html?raw';
import css from './Panel.css?raw';


const settings = {
  direction: 'vertical',
  resizable: true,
  itemCount: 'auto',
  getNaturalSize: (panel) => {
    const $children = $(panel).children();
    return sum($children.height());
  }
};

const createInstance = ({el, tpl, isServer, findParent, settings, dispatchEvent, $}) => ({
  resizing: new ReactiveVar(false),

  registerPanel() {
    let panels = tpl.getPanels();
    if(panels) {
      panels.registerPanel({el, settings});
    }
  },

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
    return $(el).index();
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
    return findParent('uiPanels');
  },
  getEventPosition(event) {
    return (settings.direction == 'horizontal')
      ? event.pageX
      : event.pageY
    ;
  },
  startResize(event) {
    tpl.resizing.set(true);
    tpl.initialSize = tpl.getCurrentFlex();
    console.log(settings.getNaturalSize);
    dispatchEvent('resizeStart', {
      initialSize: tpl.initialSize,
      direction: settings.direction,
      startPosition: (settings.direction == 'horizontal')
        ? event.pageX
        : event.pageY,
    });
  },
  resizeDrag(event) {
    dispatchEvent('resizeDrag', {
      initialSize: tpl.initialSize,
      endPosition: (settings.direction == 'horizontal')
        ? event.pageX
        : event.pageY,
    });
  },
  endResize() {
    $('body').off('mousemove').css('cursor', null);
    tpl.resizing.set(false);
    delete tpl.initialPosition;
    delete tpl.initialSize;
    dispatchEvent('resizeEnd', {
      initialSize: tpl.initialSize,
      finalSize: tpl.getCurrentFlex()
    });
  },
  beginResize(event) {
    tpl.startResize(event);
    $('body')
      .css('cursor', tpl.getResizeCursor())
      .on('mousemove', (event) => {
        tpl.resizeDrag(event);
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
  tpl.registerPanel();
  tpl.setInitialFlex();
  console.log(settings.getNaturalSize);
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
