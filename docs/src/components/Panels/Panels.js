import { createComponent } from '@semantic-ui/component';
import { each, isString, isNumber, roundNumber, inArray, sum, memoize } from '@semantic-ui/utils';

import template from './Panels.html?raw';
import css from './Panels.css?raw';

const settings = {
  direction: 'vertical',
  saveState: false,
  saveStateID: 'panels',
};

const createInstance = ({tpl, el, settings, $}) => ({
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
    if(settings.saveState) {
      const details = tpl.panels.map((panel, index) => {
        return {
          size: roundNumber(tpl.getPanelSize(panel)),
          minimized: tpl.isMinimized(index)
        };
      });
      localStorage.setItem(settings.saveStateID, JSON.stringify(details));
    }
  },

  getStoredLayout() {
    if(!settings.saveState) {
      return;
    }
    let storedLayout = localStorage.getItem(settings.saveStateID);
    if(storedLayout) {
      let details;
      try {
        details = JSON.parse(storedLayout);
      } catch(e) {}
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
    tpl.panels = $panels.get();
  },

  setPanelRendered(el) {
    tpl.renderedPanels.push(el);
    if(tpl.renderedPanels.length == tpl.panels.length) {
      requestAnimationFrame(() => tpl.setPanelInitialSizes());
    }
  },

  setPanelInitialSizes() {
    let storedLayout = tpl.getStoredLayout();
    if(storedLayout) {
      tpl.setPanelStoredSizes(storedLayout);
    }
    else {
      tpl.setPanelCalculatedSizes();
    }
  },
  canUseStoredSizes(storedLayout = []) {
    if(storedLayout.length != tpl.panels.length) {
      return false;
    }
    const totalSize = sum(storedLayout.map(p => p.size));
    if(totalSize > 100.5 || totalSize < 99.5) {
      return false;
    }
    return true;
  },
  setPanelStoredSizes(storedLayout = []) {

    let sizeDelta = 100 - sum(storedLayout.map(p => p.size));

    // correcting imprecise sizing
    if(sizeDelta) {
      console.log('correcting layout', storedLayout);
      let sizeChange = sizeDelta / storedLayout.filter(s => !s.minimized).length;
      storedLayout = storedLayout.map(p => {
        if(!p.minimized) {
          p.size = roundNumber(p.size + sizeChange);
        }
        return p;
      });
      console.log('correcting to', storedLayout);
      localStorage.setItem(settings.saveStateID, JSON.stringify(storedLayout));
    }

    each(storedLayout, (stored, index) => {
      let panel = tpl.panels[index];
      if(stored.minimized) {
        panel.minimized = true;
        let naturalSize = tpl.getNaturalPanelSize(index);
        const relativeSize = tpl.getRelativeSize(naturalSize);
        tpl.setPanelSize(index, relativeSize);
      }
      else {
        tpl.setPanelSize(index, stored.size);
      }
      panel.tpl.initialized.set(true);
    });
  },
  setPanelCalculatedSizes() {
    let exactPanels = tpl.getExactPanels();
    each(exactPanels, (panel) => {
      let index = tpl.panels.indexOf(panel);
      const size = panel.settings.size;
      let relativeSize = tpl.getRelativeSettingSize(size, index);
      tpl.setPanelSize(index, relativeSize);
      panel.tpl.initialized.set(true);
    });

    // we have to perform grow stage after setting fixed size panels
    let growPanels = tpl.getGrowingPanels();
    const availableWidth = tpl.getAvailableGrowWidth();

    if(growPanels.length == 0 && availableWidth > 0) {
      console.error('No panels can grow but panels have excess pixels. Using last panel to grow');
      growPanels = tpl.panels.slice(-1);
    }

    each(growPanels, (panel) => {
      let relativeSize = availableWidth / growPanels.length;
      let index = tpl.panels.indexOf(panel);
      const minSize = tpl.getRelativeSettingSize(panel.settings.minSize);
      const maxSize = tpl.getRelativeSettingSize(panel.settings.minSize);
      if(relativeSize < minSize) {
        relativeSize = minSize;
      }
      if(relativeSize > maxSize) {
        relativeSize = maxSize;
      }
      tpl.setPanelSize(index, relativeSize);
      panel.tpl.initialized.set(true);
    });
  },

  // cache some sizing on pane group
  setGroupCalculations() {
    tpl.cache.groupSize = tpl.getGroupSize();
    tpl.cache.groupScrollOffset = tpl.getGroupScrollOffset();
    tpl.cache.naturalSizes = tpl.panels.map((panel, index) => tpl.getNaturalPanelSize(index));
  },
  removeGroupCalculations() {
    delete tpl.cache.groupSize;
    delete tpl.cache.groupScrollOffset;
    delete tpl.cache.naturalSizes;
  },

  // store current resize position when starting drag
  setDragStartCalculations(panel, eventData) {
    // handle is after the pane it's resizing
    tpl.cache.resizeIndex = tpl.getPanelIndex(panel) - 1;
    tpl.cache.resizeStart = eventData.startPosition + tpl.cache.groupScrollOffset;
  },

  // remove calculations after drag end
  removeDragStartCalculations() {
    delete tpl.cache.resizeStart;
    delete tpl.cache.resizeIndex;
  },

  setPointerCalculations(panel, eventData) {
    tpl.cache.resizeEnd = eventData.endPosition + tpl.cache.groupScrollOffset;
    tpl.cache.resizeDelta = tpl.cache.resizeEnd - tpl.cache.resizeStart;
  },
  setEndPointerCalculations() {
    tpl.cache.resizeStart = tpl.cache.resizeEnd;
    tpl.cache.resizeDelta = 0;
  },

  isMinimized(index) {
    return tpl.getPanelSetting(index, 'minimized');
  },

  // get available width for elements set to 'grow'
  getAvailableGrowWidth() {
    let availableWidth = 100;
    each(tpl.panels, (panel) => {
      const setWidth = $(panel).css('flex-grow');
      if(panel.settings.width !== 'grow' && setWidth) {
        availableWidth -= setWidth;
      }
    });
    return availableWidth;
  },

  getGrowingPanels() {
    return tpl.panels.filter(panel => !panel.tpl.initialized.get() && panel.settings.size == 'grow');
  },
  getExactPanels() {
    return tpl.panels.filter(panel => !panel.tpl.initialized.get() && panel.settings.size !== 'grow');
  },

  getRelativeSettingSize(size, index) {
    if(size == 'natural') {
      let pixels = tpl.getNaturalPanelSize(index);
      return tpl.getRelativeSize(pixels);
    }
    else if(isString(size) && size.includes('px')) {
      const parts = size.split('px');
      const pixels = Number(parts[0]);
      return tpl.getRelativeSize(pixels);
    }
    else if(size && size !== 'grow') {
      return parseFloat(size);
    }
  },

  getPanelSetting(index, setting) {
    let panel = tpl.panels[index];
    return panel.settings[setting];
  },
  getPanelIndex(el) {
    return tpl.panels.indexOf(el);
  },
  getChangeAmount(delta) {
    const panelSize = tpl.getGroupSize();
    return Math.abs(delta / panelSize * 100);
  },
  getPanelSize(panel) {
    const size = $(panel).css('flex-grow');
    return size ? parseFloat(size) : undefined;
  },
  getPanelSizePixels(index) {
    let panel = this.panels[index];
    return (tpl.getPanelSize(panel) / 100) * tpl.getGroupSize();
  },

  getGroupScrollOffset() {
    return (settings.direction == 'horizontal')
      ? $('.panels', { pierceShadow: false }).scrollLeft()
      : $('.panels', { pierceShadow: false }).scrollTop()
    ;
  },
  getAvailableFlex() {
    let usedFlex = 0;
    each(tpl.panels, (panel, index) => {
      const size = tpl.getPanelSize(panel);
      if(size) {
        usedFlex += size;
      }
    });
    return 100 - usedFlex;
  },
  getGroupSize() {
    if(tpl.cache.groupSize) {
      return tpl.cache.groupSize;
    }
    return (settings.direction == 'horizontal')
      ? $('.panels', { pierceShadow: false }).width()
      : $('.panels', { pierceShadow: false }).height()
    ;
  },
  getRelativeSize(pixelSize) {
    const relativeSize = pixelSize / tpl.getGroupSize() * 100;
    return Math.min(relativeSize, 100);
  },
  getPixelSize(relativeSize) {
    return (relativeSize / 100) * tpl.getGroupSize();
  },

  getNaturalPanelSize(index) {
    let panel = tpl.panels[index];
    let getPanelNaturalSize = tpl.getPanelSetting(index, 'getNaturalSize');
    let naturalSize = getPanelNaturalSize(panel, { direction: settings.direction, minimized: panel.settings.minimized });
    return naturalSize;
  },

  setNaturalPanelSize(index) {
    let naturalSize = tpl.getNaturalPanelSize(index);
    if(naturalSize == 0) {
      return;
    }
    const relativeSize = tpl.getRelativeSize(naturalSize);
    tpl.changePanelSize(index, relativeSize);
    tpl.saveLayout();
  },

  setPanelMinimized(index) {
    let naturalSize = tpl.getNaturalPanelSize(index);
    const relativeSize = tpl.getRelativeSize(naturalSize);
    tpl.changePanelSize(index, relativeSize, { manualResize: true });
    if(naturalSize == 0) {
      return;
    }
    tpl.saveLayout();
  },

  setPanelMaximized(index, previousSize) {
    let naturalSize = tpl.getNaturalPanelSize(index);
    const relativeSize = tpl.getRelativeSize(naturalSize);
    const openSize = (previousSize)
      ? Math.min(previousSize, relativeSize)
      : relativeSize
    ;
    tpl.changePanelSize(index, openSize, { manualResize: true });
    tpl.saveLayout();
  },


  changePanelSize(index, newRelativeSize, resizeSettings) {
    let currentSize = tpl.getPanelSizePixels(index) || 0;
    let newSize = tpl.getPixelSize(newRelativeSize) || 0;
    let sizeDelta = newSize - currentSize;

    tpl.setGroupCalculations();
    tpl.resizePanels(index, sizeDelta, resizeSettings);
    tpl.removeGroupCalculations();
  },

  setPanelSize(index, relativeSize) {
    let panel = tpl.panels[index];
    $(panel).css('flex-grow', relativeSize);
  },

  setPanelSizePixels(index, pixelSize, settings) {
    let relativeSize = tpl.getRelativeSize(pixelSize);
    tpl.setPanelSize(index, relativeSize, settings);
  },

  debugSizes() {
    let total = 0;
    let sizes = [];
    each(tpl.panels, (panel) => {
      const size = tpl.getPanelSize(panel);
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
      lastIndex = tpl.panels.length - 1,
      standard = delta > 0,
      hasMinimized = false,
      // if the handle is on the other side
      getLeftIndex = () => {
        return index;
      },
      getRightIndex = () => {
        if(index + 1 >= tpl.panels.length) {
          return index - 1;
        }
        return index + 1;
      },
      getNaturalSize = memoize((index) => {
        let naturalSize = tpl.cache.naturalSizes[index];
        return naturalSize;
      }),
      getMaxSize = memoize((index) => {
        let maxSize = tpl.getPanelSetting(index, 'maxSize');
        return maxSize;
      }),
      isMinimized = memoize((index) => {
        let minimized = tpl.isMinimized(index);
        return minimized || false;
      }),
      getMinSize = memoize((index) => {
        let minSize = tpl.getPanelSetting(index, 'minSize');
        return minSize || 31.2;
      }),
      getSize = (index) => {
        let panelSize = tpl.getPanelSizePixels(index);
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
        tpl.setPanelSizePixels(sizeIndex, size);
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
          if(pixelsAdded || cannotResize(growIndex)) {
            return;
          }
          const currentSize = getSize(growIndex);
          const newSize = currentSize + pixelsToAdd;
          setSize(growIndex, newSize);
          pixelsAdded = true;
        });
      });

    };

    /*-----------------------
      Check All Collapsed
    -----------------------*/

    let i = tpl.panels.length;
    let collapseCount = 0;
    while(i--) {
      if(cannotResize(i)) {
        collapseCount++;
      }
    }
    // When all but one panel are collapsed we cant resize
    if(collapseCount + 1 >= tpl.panels.length) {
      return;
    }

    /*
      Standard (Postive Delta)
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
    pixelsToTake = takePixels(takeDirection, pixelsToTake, donorIndex => (getMaxSize(donorIndex) || getNaturalSize(donorIndex)));

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


    tpl.debugSizes();
  },
});

const onCreated = ({ el, tpl }) => {
  tpl.addPanels();
};

const onDestroyed = ({ tpl }) => {
};

const onRendered = ({ $, el, tpl, settings }) => {
};

const events = {
  'rendered ui-panel'({tpl, event, data}) {
    const panel = event.target;
    if(inArray(panel, tpl.panels)) {
      tpl.setPanelRendered(panel, data);
    }
  },
  'resizeStart ui-panel'({tpl, event, data}) {
    const panel = event.target;
    if(inArray(panel, tpl.panels)) {
      tpl.setGroupCalculations();
      tpl.setDragStartCalculations(panel, data);
    }
  },
  'resizeDrag ui-panel'({tpl, event, data}) {
    // note: the handle event fires on the preceding panel to the handle
    // so for | 1 || 2 | the handle fires on '2'
    const panel = event.target;
    if(inArray(panel, tpl.panels)) {
      requestAnimationFrame(() => {
        tpl.setPointerCalculations(panel, data);
        let { resizeIndex, resizeDelta } = tpl.cache;
        tpl.resizePanels(resizeIndex, resizeDelta);
        tpl.setEndPointerCalculations();
      });
    }
  },
  'resizeEnd ui-panel'({tpl, event, data}) {
    const panel = event.target;
    if(inArray(panel, tpl.panels)) {
      tpl.removeDragStartCalculations();
      tpl.removeGroupCalculations();
      tpl.saveLayout();
    }
  },
};

const UIPanels = createComponent({
  tagName: 'ui-panels',
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

export default UIPanels;
export { UIPanels };
