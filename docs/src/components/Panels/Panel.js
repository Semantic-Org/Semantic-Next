import { defineComponent } from '@semantic-ui/component';
import { sum } from '@semantic-ui/utils';

import template from './Panel.html?raw';
import css from './Panel.css?raw';

const settings = {
  direction: 'vertical',
  resizable: true,
  itemCount: 'auto',
  minSize: '0px',
  maxSize: '0px',
  naturalSize: '',
  size: 'grow',
  label: '',
  canMinimize: true,
  minimized: false,
  getNaturalSize: (panel, { direction, minimized }) => {
    return panel?.component.getNaturalSize(panel, { direction, minimized });
  }
};

const state = {
  lastPanelSize: undefined
};

const createComponent = ({el, self, isServer, reactiveVar, findParent, settings, dispatchEvent, $}) => ({
  resizing: reactiveVar(false),
  initialized: reactiveVar(false),

  getClassMap: () => ({
    resizing: self.resizing.get(),
    minimized: settings.minimized,
    initialized: self.initialized.get()
  }),

  setInitialized() {
    self.initialized.set(true);
    dispatchEvent('initialized');
  },

  getNaturalSize(panel, { direction, minimized }) {
    if(settings.naturalSize) {
      const panels = self.getPanels();
      return panels.getPixelSettingSize(settings.naturalSize);
    }
    const $children = $(panel).children();
    return (direction == 'horizontal')
      ? ($children.length > 1)
        ? sum($children.width())
        : $children.width()
      : ($children.length > 1)
        ? sum($children.height())
        : $children.height()
    ;
  },

  getHandleClassMap: () => ({
    initialized: self.initialized.get(),
    disabled: !self.isResizable()
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
    return settings.resizable && self.getIndex() > 0;
  },
  getPanels() {
    const panels = findParent('uiPanels');
    return panels;
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
    self.resizing.set(true);
    self.initialSize = self.getCurrentFlex();
    dispatchEvent('resizeStart', {
      initialSize: self.initialSize,
      direction: settings.direction,
      startPosition: self.getPointerPosition(event),
    });
    $('body')
      .addClass('resizing')
      .css('cursor', self.getResizeCursor())
      .on('mousemove', (event) => {
        self.resizeDrag(event);
      })
      .on('touchmove', self.resizeDrag)
    ;
    $$('iframe')
      .one('pointerenter', (event) => {
        self.endResize(event);
      })
    ;
    $('body')
      .one('pointerup mouseleave', (event) => {
        self.endResize(event);
      })
    ;
  },
  resizeDrag(event) {
    dispatchEvent('resizeDrag', {
      initialSize: self.initialSize,
      endPosition: self.getPointerPosition(event),
    });
  },
  endResize() {
    $('body')
      .off('pointerup mouseleave mousemove touchmove')
      .removeClass('resizing')
      .css('cursor', '')
    ;
    $$('iframe').off('pointerenter');
    self.resizing.set(false);
    delete self.initialPosition;
    delete self.initialSize;
    dispatchEvent('resizeEnd', {
      initialSize: self.initialSize,
      finalSize: self.getCurrentFlex()
    });
  },
  setPreviousNaturalSize() {
    const panels = self.getPanels();
    const index = panels.getPanelIndex(el);
    panels.setNaturalPanelSize(index - 1);
  },
  setNaturalSize() {
    const panels = self.getPanels();
    const index = panels.getPanelIndex(el);
    panels.setNaturalPanelSize(index);
  },
  toggleMinimize() {
    if(settings.minimized) {
      self.maximize();
    }
    else {
      self.minimize();
    }
  },
  minimize() {
    const panels = self.getPanels();
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
    const panels = self.getPanels();
    const index = panels.getPanelIndex(el);
    panels.setPanelMaximized(index, state.lastPanelSize);
  }
});

const events = {
  'click .toggle-size'({ self }) {
    self.toggleMinimize();
  },
  'dblclick .self.label'({ self }) {
    self.toggleMinimize();
  },
  'dblclick .handle': function({ self }) {
    self.setPreviousNaturalSize();
  },
  'mousedown, touchstart .handle'({event, self}) {
    self.startResize(event);
    event.preventDefault();
  },
};

const UIPanel = defineComponent({
  tagName: 'ui-panel',
  plural: true,
  template,
  css,
  createComponent,
  settings,
  events,
});

export default UIPanel;
export { UIPanel };
