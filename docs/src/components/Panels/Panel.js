import { createComponent } from '@semantic-ui/component';
import { sum } from '@semantic-ui/utils';

import template from './Panel.html?raw';
import css from './Panel.css?raw';

const settings = {
  direction: 'vertical',
  resizable: true,
  itemCount: 'auto',
  minSize: '0px',
  maxSize: '0px',
  size: 'grow',
  label: '',
  canMinimize: true,
  minimized: false,
  getNaturalSize: (panel, { direction, minimized }) => {
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

  getClassMap: () => ({
    resizing: tpl.resizing.get(),
    minimized: settings.minimized,
    initialized: tpl.initialized.get()
  }),

  getHandleClassMap: () => ({
    initialized: tpl.initialized.get(),
    disabled: !tpl.isResizable()
  }),

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
  getPointerPosition(event) {
    const positionObj = event.touches
      ? event.touches[0]
      : event
    ;
    return (settings.direction == 'horizontal')
      ? positionObj.pageX
      : positionObj.pageY
    ;
  },
  startResize(event) {
    tpl.resizing.set(true);
    tpl.initialSize = tpl.getCurrentFlex();
    dispatchEvent('resizeStart', {
      initialSize: tpl.initialSize,
      direction: settings.direction,
      startPosition: tpl.getPointerPosition(event),
    });
    $('body')
      .addClass('resizing')
      .css('cursor', tpl.getResizeCursor())
      .on('mousemove', (event) => {
        tpl.resizeDrag(event);
      })
      .on('touchmove', tpl.resizeDrag)
    ;
    $('body')
      .one('pointerup', (event) => {
        tpl.endResize(event);
      })
    ;
  },
  resizeDrag(event) {
    dispatchEvent('resizeDrag', {
      initialSize: tpl.initialSize,
      endPosition: tpl.getPointerPosition(event),
    });
  },
  endResize() {
    $('body')
      .off('mousemove')
      .off('touchmove')
      .removeClass('resizing')
      .css('cursor', null)
    ;
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
  'dblclick .handle': function({ tpl }) {
    tpl.setPreviousNaturalSize();
  },
  'mousedown, touchstart .handle'({event, tpl}) {
    tpl.startResize(event);
    event.preventDefault();
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
