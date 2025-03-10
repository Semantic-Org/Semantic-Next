import { defineComponent } from '@semantic-ui/component';
import { each, isString, isNumber, roundNumber, inArray, sum, memoize } from '@semantic-ui/utils';

import template from './Panels.html?raw';
import css from './Panels.css?raw';

const defaultSettings = {
  direction: 'vertical',
  saveState: false,
  saveStateID: 'panels',
};

const createComponent = ({self, el, settings, $}) => ({
  panels: [],
  renderedPanels: [],
  cache: {
    groupSize: undefined,
    groupScrollOffset: undefined,
    resizeStart: undefined,
    resizeEnd: undefined,
    resizeIndex: undefined,
    resizeDelta: undefined
  },

  saveLayout() {
    if(!settings.saveState) {
      return;
    }
    const panelSizes = self.panels.map((panel, index) => {
      const size = roundNumber(self.getPanelSize(panel));
      return {
        size,
        minimized: self.isMinimized(index)
      };
    });
    if(self.isLayoutCorrectSize(panelSizes)) {
      localStorage.setItem(settings.saveStateID, JSON.stringify({ panels: panelSizes }));
    }
  },

  isLayoutCorrectSize(storedLayout) {
    const totalSize = sum(storedLayout.map(p => p.size));
    const threshold = 0.1;
    const layoutShift = Math.abs(totalSize - 100);
    // quick sanity checks before storing a broken layout
    return layoutShift < threshold;
  },

  getStoredLayout() {
    if(!settings.saveState) {
      return;
    }
    let storedLayout = localStorage.getItem(settings.saveStateID);
    if(storedLayout) {
      let details;
      try {
        details = JSON.parse(storedLayout)?.panels;
      } catch(e) {
        // nothing
      }
      return details;
    }
  },

  // we want to get all panels that are not inside other ui panels
  // i.e. if this is a complex layout we dont want to grab nested children

  // we cant assume the panels are immediate children of the component
  // frameworks may add arbitrary divs for SSR hydration (like Astro)
  addPanels() {
    let $childPanelGroups = $(el).find('ui-panels');
    let $childPanelGroupPanels = $childPanelGroups.find('ui-panel');
    let $allPanels = $(el).find('ui-panel');
    let $panels = $allPanels.not($childPanelGroupPanels);
    self.panels = $panels.get();
  },

  setPanelRendered(el) {
    self.renderedPanels.push(el);
    if(self.renderedPanels.length == self.panels.length) {
      if (document.visibilityState === 'visible') {
        requestAnimationFrame(() => self.setPanelInitialSizes());
      }
      else {
        // we cant rely on request animation frame if tab is not visible
        self.setPanelInitialSizes();
      }
    }
  },

  setPanelInitialSizes() {
    let storedLayout = self.getStoredLayout();
    if(self.canUseStoredSizes(storedLayout)) {
      self.setPanelStoredSizes(storedLayout);
    }
    else {
      self.setPanelCalculatedSizes();
    }
  },
  canUseStoredSizes(storedLayout = []) {
    if(storedLayout.length != self.panels.length) {
      return false;
    }
    if(!self.isLayoutCorrectSize(storedLayout)) {
      return false;
    }
    return true;
  },
  setPanelStoredSizes(storedLayout = []) {

    let sizeDelta = 100 - sum(storedLayout.map(p => p.size));

    // correcting imprecise sizing
    if(Math.abs(sizeDelta) > 0.01) {
      let sizeChange = sizeDelta / storedLayout.filter(s => !s.minimized).length;
      storedLayout = storedLayout.map(p => {
        if(!p.minimized) {
          p.size = roundNumber(p.size + sizeChange);
        }
        return p;
      });
      localStorage.setItem(settings.saveStateID, JSON.stringify(storedLayout));
    }

    each(storedLayout, (stored, index) => {
      let panel = self.panels[index];
      if(stored.minimized) {
        panel.minimized = true;
        let naturalSize = self.getNaturalPanelSize(index);
        const relativeSize = self.getRelativeSize(naturalSize);
        self.setPanelSize(index, relativeSize);
      }
      else {
        self.setPanelSize(index, stored.size);
      }
      if(stored.size !== undefined) {
        self.setPanelInitialized(panel);
      }
    });
  },
  isPanelInitialized(panel) {
    if(panel.component) {
      return panel.component.initialized.get();
    }
    return false;
  },
  setPanelInitialized(panel) {
    if(panel.component) {
      panel.component.setInitialized();
    }
  },
  setPanelCalculatedSizes() {
    let exactPanels = self.getExactPanels();
    each(exactPanels, (panel) => {
      let index = self.panels.indexOf(panel);
      const size = panel.settings.size;
      let relativeSize = self.getRelativeSettingSize(size, index);
      self.setPanelSize(index, relativeSize);
      self.setPanelInitialized(panel);
    });

    // we have to perform grow stage after setting fixed size panels
    let growPanels = self.getGrowingPanels();
    const availableWidth = self.getAvailableGrowWidth();

    if(growPanels.length == 0 && availableWidth > 0) {
      console.error('No panels can grow but panels have excess pixels. Using last panel to grow');
      growPanels = self.panels.slice(-1);
    }

    each(growPanels, (panel) => {
      let relativeSize = availableWidth / growPanels.length;
      let index = self.panels.indexOf(panel);
      const minSize = self.getRelativeSettingSize(panel.settings.minSize);
      const maxSize = self.getRelativeSettingSize(panel.settings.minSize);
      if(relativeSize < minSize) {
        relativeSize = minSize;
      }
      if(maxSize && relativeSize > maxSize) {
        relativeSize = maxSize;
      }
      self.setPanelSize(index, relativeSize);
      self.setPanelInitialized(panel);
    });
  },

  // cache some sizing on pane group
  setGroupCalculations() {
    self.cache.groupSize = self.getGroupSize();
    self.cache.groupScrollOffset = self.getGroupScrollOffset();
    self.cache.naturalSizes = self.panels.map((panel, index) => self.getNaturalPanelSize(index));
  },
  removeGroupCalculations() {
    delete self.cache.groupSize;
    delete self.cache.groupScrollOffset;
    delete self.cache.naturalSizes;
  },

  // store current resize position when starting drag
  setDragStartCalculations(panel, eventData) {
    // handle is after the pane it's resizing
    self.cache.resizeIndex = self.getPanelIndex(panel) - 1;
    self.cache.resizeStart = eventData.startPosition + self.cache.groupScrollOffset;
  },

  // remove calculations after drag end
  removeDragStartCalculations() {
    delete self.cache.resizeStart;
    delete self.cache.resizeIndex;
  },

  setPointerCalculations(panel, eventData) {
    self.cache.resizeEnd = eventData.endPosition + self.cache.groupScrollOffset;
    self.cache.resizeDelta = self.cache.resizeEnd - self.cache.resizeStart;
  },
  setEndPointerCalculations() {
    self.cache.resizeStart = self.cache.resizeEnd;
    self.cache.resizeDelta = 0;
  },

  isMinimized(index) {
    return self.getPanelSetting(index, 'minimized');
  },

  // get available width for elements set to 'grow'
  getAvailableGrowWidth() {
    let availableWidth = 100;
    each(self.panels, (panel) => {
      const setWidth = $(panel).css('flex-grow');
      if(panel.settings.width !== 'grow' && setWidth) {
        availableWidth -= setWidth;
      }
    });
    return availableWidth;
  },

  getGrowingPanels() {
    return self.panels.filter(panel => !self.isPanelInitialized(panel) && panel.settings.size == 'grow');
  },
  getExactPanels() {
    return self.panels.filter(panel => !self.isPanelInitialized(panel) && panel.settings.size !== 'grow');
  },

  getRelativeSettingSize(size, index) {
    if(size == 'natural') {
      let pixels = self.getNaturalPanelSize(index);
      return self.getRelativeSize(pixels);
    }
    else if(isString(size) && size.includes('px')) {
      const parts = size.split('px');
      const pixels = Number(parts[0]);
      return self.getRelativeSize(pixels);
    }
    else if(size && size !== 'grow') {
      return parseFloat(size);
    }
  },

  getPixelSettingSize(size, index) {
    if(size == 'natural') {
      return self.getNaturalPanelSize(index);
    }
    else if(isString(size) && size.includes('px')) {
      const parts = size.split('px');
      const pixels = Number(parts[0]);
      return pixels;
    }
    else if(size && size !== 'grow') {
      return self.getPixelSize(size);
    }
  },

  getPanelSetting(index, setting) {
    let panel = self.panels[index];
    return panel.settings[setting];
  },
  getPanelIndex(el) {
    return self.panels.indexOf(el);
  },
  getChangeAmount(delta) {
    const panelSize = self.getGroupSize();
    return Math.abs(delta / panelSize * 100);
  },
  getPanelSize(panel) {
    const size = $(panel).css('flex-grow');
    return size ? parseFloat(size) : undefined;
  },
  getPanelSizePixels(index) {
    let panel = this.panels[index];
    return (self.getPanelSize(panel) / 100) * self.getGroupSize();
  },

  getGroupScrollOffset() {
    return (settings.direction == 'horizontal')
      ? $('.panels', { pierceShadow: false }).scrollLeft()
      : $('.panels', { pierceShadow: false }).scrollTop()
    ;
  },
  getAvailableFlex() {
    let usedFlex = 0;
    each(self.panels, (panel, index) => {
      const size = self.getPanelSize(panel);
      if(size) {
        usedFlex += size;
      }
    });
    return 100 - usedFlex;
  },
  getGroupSize() {
    if(self.cache.groupSize) {
      return self.cache.groupSize;
    }
    return (settings.direction == 'horizontal')
      ? $('.panels', { pierceShadow: false }).width()
      : $('.panels', { pierceShadow: false }).height()
    ;
  },
  getRelativeSize(pixelSize) {
    const relativeSize = pixelSize / self.getGroupSize() * 100;
    return Math.min(relativeSize, 100);
  },
  getPixelSize(relativeSize) {
    return (relativeSize / 100) * self.getGroupSize();
  },

  getNaturalPanelSize(index) {
    let panel = self.panels[index];
    let getPanelNaturalSize = self.getPanelSetting(index, 'getNaturalSize');
    let naturalSize = getPanelNaturalSize(panel, { direction: settings.direction, minimized: panel.settings.minimized });
    return naturalSize;
  },

  setNaturalPanelSize(index) {
    let naturalSize = self.getNaturalPanelSize(index);
    if(naturalSize == 0) {
      return;
    }
    const relativeSize = self.getRelativeSize(naturalSize);
    self.changePanelSize(index, relativeSize);
    self.saveLayout();
  },

  setPanelMinimized(index) {
    let naturalSize = self.getNaturalPanelSize(index);
    const relativeSize = self.getRelativeSize(naturalSize);
    self.changePanelSize(index, relativeSize, { manualResize: true });
    if(naturalSize == 0) {
      return;
    }
    self.saveLayout();
  },

  setPanelMaximized(index, previousSize) {
    let naturalSize = self.getNaturalPanelSize(index);
    const relativeSize = self.getRelativeSize(naturalSize);
    const openSize = (previousSize)
      ? Math.min(previousSize, relativeSize)
      : relativeSize
    ;
    self.changePanelSize(index, openSize, { manualResize: true });
    self.saveLayout();
  },


  changePanelSize(index, newRelativeSize, resizeSettings) {
    let currentSize = self.getPanelSizePixels(index) || 0;
    let newSize = self.getPixelSize(newRelativeSize) || 0;
    let sizeDelta = newSize - currentSize;

    self.setGroupCalculations();
    self.resizePanels(index, sizeDelta, resizeSettings);
    self.removeGroupCalculations();
  },

  setPanelSize(index, relativeSize) {
    let panel = self.panels[index];
    $(panel).css('flex-grow', relativeSize);
  },

  setPanelSizePixels(index, pixelSize, settings) {
    let relativeSize = self.getRelativeSize(pixelSize);
    self.setPanelSize(index, relativeSize, settings);
  },

  debugSizes() {
    let total = 0;
    let sizes = [];
    each(self.panels, (panel) => {
      const size = self.getPanelSize(panel);
      total += size;
      sizes.push(size);
    });
    if(total < 99.9 || total > 100.1) {
      console.log(total);
      console.log(sizes);
    }
  },

  resizePanels(index, delta, { manualResize = false } = {}) {
    let
      lastIndex = self.panels.length - 1,
      standard = delta > 0,
      hasMinimized = false,
      // if the handle is on the other side
      getLeftIndex = () => {
        return index;
      },
      getRightIndex = () => {
        if(index + 1 >= self.panels.length) {
          return index - 1;
        }
        return index + 1;
      },
      getNaturalSize = memoize((index) => {
        let naturalSize = self.cache.naturalSizes[index];
        return naturalSize;
      }),
      getMaxSize = memoize((index) => {
        let maxSize = self.getPanelSetting(index, 'maxSize');
        return self.getPixelSettingSize(maxSize) || 0;
      }),
      isMinimized = memoize((index) => {
        let minimized = self.isMinimized(index);
        return minimized || false;
      }),
      getMinSize = memoize((index) => {
        let minSize = self.getPanelSetting(index, 'minSize');
        return self.getPixelSettingSize(minSize) || 0;
      }),
      getSize = (index) => {
        let panelSize = self.getPanelSizePixels(index);
        return panelSize;
      },
      cannotResize = (resizeIndex) => {
        let result;
        if(resizeIndex == index && manualResize) {
          result = hasMinimized;
        }
        else {
          result = isMinimized(resizeIndex);
        }
        return result;
      },
      setSize = (sizeIndex, size) => {
        if(manualResize && sizeIndex == index) {
          hasMinimized = true;
        }
        self.setPanelSizePixels(sizeIndex, size);
      },
      pixelsToAdd,
      pixelsToTake
    ;

    // call a function either leftward descending or rightward ascending
    // i.e. if the resizing panel is 3
    // it will check 2, 1 for left and 4, 5 for right
    // 1 | 2 | (3) | 4 | 5

    const performLoop = (direction, callback) => {
      // we allow an index to be passed in as direction to perform just on this index
      if(isNumber(direction)) {
        callback(direction);
        return;
      }
      const
        directions = {
          all: {
            getIndex: () => 0,
            condition: (index) => (index <= lastIndex),
            incrementor: (index) => (index + 1),
          },
          left: {
            getIndex: getLeftIndex,
            condition: (index) => (index >= 0),
            incrementor: (index) => (index - 1),
          },
          right: {
            getIndex: getRightIndex,
            condition: (index) => (index <= lastIndex),
            incrementor: (index) => (index + 1),
          },
        },
        { getIndex, condition, incrementor } = directions[direction]
      ;
      let index = getIndex();
      while(condition(index)) {
        if(callback(index) === false) {
          break;
        }
        index = incrementor(index);
      }
    };

    /* Loops in a direction taking pixels from any columns that exceed a max size */
    const takePixels = (direction, pixelsToTake, getMaxSize) => {

      let pixelsLeftToTake = pixelsToTake;

      performLoop(direction, (donorIndex) => {
        // skip over panels that cannot resize
        if(cannotResize(donorIndex)) {
          return;
        }
        const currentSize = getSize(donorIndex);
        const maxSize = getMaxSize(donorIndex);

        // check if this panel exceeds max size test
        if(currentSize > maxSize) {

          const pixelsAvailableToDonate = currentSize - maxSize;

          // make sure to only take the pixels necessary
          if (pixelsAvailableToDonate >= pixelsLeftToTake) {
            const newSize = currentSize - pixelsLeftToTake;
            setSize(donorIndex, newSize);
            pixelsLeftToTake = 0;
            return false;
          } else {
            // can only get some pixels needed from this panel
            setSize(donorIndex, maxSize);
            pixelsLeftToTake -= pixelsAvailableToDonate;
          }
        }
      });
      return pixelsLeftToTake;

    };

    const addPixels = (direction, pixelsToAdd, getMaxSize) => {

      let pixelsLeftToAdd = pixelsToAdd;
      performLoop(direction, (growIndex) => {

        // dont grow panels that cannot resize
        if(cannotResize(growIndex)) {
          return;
        }

        const currentSize = getSize(growIndex);
        const maxSize = getMaxSize(growIndex);

        // check if this panel is below max size test
        if(currentSize <= maxSize) {

          const pixelsAvailableToGrow = maxSize - currentSize;

          if (pixelsAvailableToGrow >= pixelsLeftToAdd) {
            // we can add all the pixels to this panel
            const newSize = currentSize + pixelsLeftToAdd;
            setSize(growIndex, newSize);
            pixelsLeftToAdd = 0;
            return false;
          } else {
            // we can only add some pixels to this panel
            setSize(growIndex, maxSize);
            pixelsLeftToAdd -= pixelsAvailableToGrow;
          }
        }
      });
      return pixelsLeftToAdd;

    };

    const distributeExcessPixels = (direction, pixelsToAdd) => {

      let directions = (direction == 'leftFirst')
        ? ['left', 'right']
        : ['right', 'left']
      ;
      let pixelsAdded = false;

      // add pixels
      each(directions, direction => {
        if(pixelsAdded) {
          return;
        }
        performLoop(direction, (growIndex) => {
          const maxSize = getMaxSize(growIndex);
          const currentSize = getSize(growIndex);
          const newSize = currentSize + pixelsToAdd;
          if(pixelsAdded || (maxSize && newSize > getMaxSize(growIndex)) || cannotResize(growIndex)) {
            return;
          }
          setSize(growIndex, newSize);
          pixelsAdded = true;
        });
      });

    };

    /*-----------------------
      Check All Collapsed
    -----------------------*/

    let i = self.panels.length;
    let collapseCount = 0;
    while(i--) {
      if(cannotResize(i)) {
        collapseCount++;
      }
    }
    // When all but one panel are collapsed we cant resize
    if(collapseCount + 1 >= self.panels.length) {
      return;
    }

    /*
      Standard (Positive Delta)
      ------------------------
      Growing Above / Left
      Shrinking Below / Right
    */

    // this is a running tally of the pixels we need to add to panels
    pixelsToAdd = Math.abs(delta);

    // this is a running tally of the pixels we need to take from a panel
    pixelsToTake = Math.abs(delta);

    let takeDirection, addDirection, shareStrategy;

    if(manualResize) {
      takeDirection = 'all';
      addDirection = 'all';
      shareStrategy = 'all';
    }
    else {
      takeDirection = (standard) ? 'right' : 'left';
      addDirection = (standard) ? 'left' : 'right';
      shareStrategy = (standard) ? 'leftFirst': 'rightFirst';
    }

    /*--------------
       Find Donors
    ---------------*/

    if(manualResize) {
      if(delta < 0) {
        pixelsToTake = takePixels(index, pixelsToTake, (index) => 0);
      }
      else {
        pixelsToAdd = addPixels(index, pixelsToAdd, (index) => Infinity);
      }
    }

    /*--------------
       Find Donors
    ---------------*/

    /* First check if we can take pixels from panels exceeding max or natural size */
    pixelsToTake = takePixels(takeDirection, pixelsToTake, donorIndex => (getMaxSize(donorIndex) || Math.max(getNaturalSize(donorIndex), getMinSize(donorIndex))) );

    /* If we still need pixels lets donate from any panels that exceed their min width */
    if(pixelsToTake > 0) {
      pixelsToTake = takePixels(takeDirection, pixelsToTake, donorIndex => getMinSize(donorIndex));
    }

    /*--------------
       Grow Panels
    ---------------*/

    /* If we didnt get all the pixels we requested we will need to reduce the amount we grow */
    pixelsToAdd = pixelsToAdd - pixelsToTake;

    // grow all content to match their max width or natural width
    pixelsToAdd = addPixels(addDirection, pixelsToAdd, growIndex => (getMaxSize(growIndex) || getNaturalSize(growIndex)));

    // if we still have additional pixels left to grow find the best place to place them
    if(pixelsToAdd > 0) {
      distributeExcessPixels(shareStrategy, pixelsToAdd);
    }


    self.debugSizes();
  },
});

const onCreated = ({ el, self }) => {
  self.addPanels();
};

const onDestroyed = ({ self }) => {
};

const onRendered = ({ $, el, self, settings }) => {
};

const events = {
  'rendered ui-panel'({self, event, data}) {
    const panel = event.target;
    if(inArray(panel, self.panels)) {
      self.setPanelRendered(panel, data);
    }
  },
  'resizeStart ui-panel'({self, event, data}) {
    const panel = event.target;
    if(inArray(panel, self.panels)) {
      self.setGroupCalculations();
      self.setDragStartCalculations(panel, data);
    }
  },
  'resizeDrag ui-panel'({self, event, data}) {
    // note: the handle event fires on the preceding panel to the handle
    // so for | 1 || 2 | the handle fires on '2'
    const panel = event.target;
    if(inArray(panel, self.panels)) {
      requestAnimationFrame(() => {
        self.setPointerCalculations(panel, data);
        let { resizeIndex, resizeDelta } = self.cache;
        self.resizePanels(resizeIndex, resizeDelta);
        self.setEndPointerCalculations();
      });
    }
  },
  'resizeEnd ui-panel'({self, event, data}) {
    const panel = event.target;
    if(inArray(panel, self.panels)) {
      self.removeDragStartCalculations();
      self.removeGroupCalculations();
      self.saveLayout();
    }
  },
};

const UIPanels = defineComponent({
  tagName: 'ui-panels',
  plural: true,
  template,
  css,
  createComponent,
  defaultSettings,
  onCreated,
  onDestroyed,
  onRendered,
  events,
});

export default UIPanels;
export { UIPanels };
