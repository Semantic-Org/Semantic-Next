import { createComponent } from '@semantic-ui/component';
import { each, sum } from '@semantic-ui/utils';

import template from './Panel.html?raw';
import css from './Panel.css?raw';


const settings = {
  direction: 'vertical',
  resizable: true,
  itemCount: 'auto',
  minSize: 0,
  maxSize: 0,
  size: 'grow',
  label: '',
  canMinimize: true,
  minimized: false,
  minimizedHeight: 30,
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

const state = {
  lastPanelSize: undefined
};

const createInstance = ({el, tpl, isServer, reactiveVar, findParent, settings, dispatchEvent, $}) => ({
  resizing: reactiveVar(false),
  initialized: reactiveVar(false),

  getCurrentFlex() {
    return $(el).css('flex-grow');
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
  isResizable() {
    return settings.resizable && tpl.getIndex() > 0;
  },
  getPanels() {
    return findParent('uiPanels');
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
    $('body')
      .addClass('resizing')
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
  resizeDrag(event) {
    dispatchEvent('resizeDrag', {
      initialSize: tpl.initialSize,
      endPosition: (settings.direction == 'horizontal')
        ? event.pageX
        : event.pageY,
    });
  },
  endResize() {
    $('body').off('mousemove').removeClass('resizing').css('cursor', null);
    tpl.resizing.set(false);
    delete tpl.initialPosition;
    delete tpl.initialSize;
    dispatchEvent('resizeEnd', {
      initialSize: tpl.initialSize,
      finalSize: tpl.getCurrentFlex()
    });
  },
  setPreviousNaturalSize() {
    const panels = tpl.getPanels();
    const index = panels.getPanelIndex(el);
    panels.setNaturalPanelSize(index - 1);
  },
  setNaturalSize() {
    const panels = tpl.getPanels();
    const index = panels.getPanelIndex(el);
    panels.setNaturalPanelSize(index);
  },
  toggleMinimize() {
    if(settings.minimized) {
      tpl.maximize();
    }
    else {
      tpl.minimize();
    }
  },
  minimize() {
    const panels = tpl.getPanels();
    settings.minimized = true;
    // confirm not all panels are minimized at once as this is not possible
    if(panels.panels.every((panel, index) => panels.isMinimized(index))) {
      settings.minimized = false;
      return;
    }
    // store size when maximizing again
    let currentSize = $(el).css('flex-grow');
    state.lastPanelSize = Math.max(currentSize, 10);
    const index = panels.getPanelIndex(el);
    panels.setPanelMinimized(index);
  },
  maximize() {
    settings.minimized = false;
    const panels = tpl.getPanels();
    const index = panels.getPanelIndex(el);
    panels.setPanelMaximized(index, state.lastPanelSize);
  }
});

const events = {
  'click .toggle-size'({ tpl }) {
    tpl.toggleMinimize();
  },
  'dblclick .label'({ tpl }) {
    tpl.toggleMinimize();
  },
  'mousedown .handle'({event, tpl}) {
    tpl.startResize(event);
    event.preventDefault();
  },
  'dblclick .handle': function({ tpl }) {
    tpl.setPreviousNaturalSize();
  },
};

const UIPanel = createComponent({
  tagName: 'ui-panel',
  plural: true,
  template,
  css,
  createInstance,
  settings,
  events,
});

export default UIPanel;
export { UIPanel };
