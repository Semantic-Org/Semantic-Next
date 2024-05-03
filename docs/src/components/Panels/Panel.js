import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import { sum, isString } from '@semantic-ui/utils';

import template from './Panel.html?raw';
import css from './Panel.css?raw';


const settings = {
  direction: 'vertical',
  resizable: true,
  itemCount: 'auto',
  minSize: 0,
  maxSize: 0,
  size: 'split',
  getNaturalSize: (panel, direction) => {
    const $children = $(panel).children();
    return (direction == 'horizontal')
      ? ($children.length > 1)
        ? sum($children.width())
        : $children.width()
      : ($children.length > 1)
        ? sum($children.height())
        : $children.height()
    ;
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
  getSplitSize() {
    const availableFlex = tpl.getPanels().getAvailableFlex();
    return availableFlex / (tpl.getItemCount() - tpl.getIndex());
  },
  getInitialFlex() {
    const defaultSize = settings.size;
    if(isString(defaultSize) && defaultSize.includes('px')) {
      const parts = defaultSize.split('px');
      const pixels = Number(parts[0]);
      return tpl.getPanels().getRelativeSize(pixels);
    }
    else if(isString(defaultSize)) {
      return Number(defaultSize);
    }
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
    return settings.resizable && tpl.getIndex() > 0;
  },
  setInitialSize() {
    let index = tpl.getIndex();
    // set size as if split evenly
    tpl.getPanels().setPanelSize(index, tpl.getSplitSize(), { donor: false });
    // then donate pixels if we are forcing a size
    if(settings.size == 'natural') {
      tpl.setNaturalWidth();
    }
    else if(settings.size !== 'split') {
      let initialFlex = tpl.getInitialFlex();
      tpl.getPanels().setPanelSize(index, initialFlex, { donor: true, splitDonor: true });
    }
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
  },
  setPreviousNaturalWidth() {
    const panels = tpl.getPanels();
    const index = panels.getPanelIndex(el);
    panels.setNaturalPanelSize(index - 1);
  },
  setNaturalWidth() {
    const panels = tpl.getPanels();
    const index = panels.getPanelIndex(el);
    panels.setNaturalPanelSize(index);
  }
});

const onCreated = ({ tpl, el }) => {
};

const onDestroyed = ({ tpl }) => {
};

const onRendered = ({ $, el, tpl, isClient, settings }) => {
  if(isClient) {
    tpl.registerPanel();
    tpl.setInitialSize();
  }
};

const events = {
  'mousedown .handle'({event, settings, tpl}) {
    tpl.beginResize(event);
    event.preventDefault();
  },
  'dblclick .handle': function({event, tpl, el}) {
    tpl.setPreviousNaturalWidth();
  },
};

const UIPanel = createComponent({
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

export default UIPanel;
export { UIPanel };
