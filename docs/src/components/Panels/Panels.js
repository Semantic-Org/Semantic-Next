import { createComponent } from '@semantic-ui/component';
import { each, findIndex, isString, inArray, range, memoize } from '@semantic-ui/utils';

import template from './Panels.html?raw';
import css from './Panels.css?raw';


const settings = {
  direction: 'vertical',
};

const createInstance = ({tpl, el, settings, $}) => ({
  panels: [],
  renderedPanels: [],
  group: {
    size: undefined,
    scrollOffset: undefined,
  },
  resize: {
    start: undefined,
    end: undefined,
    index: undefined,
    delta: undefined,
  },

  // we want to get all panels that are not inside other ui panels
  // i.e. if this is a complex layout we dont want to grab nested children
  // note we cant assume the panels are immediate children of the component
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
    each(tpl.panels, (panel, index) => {
      const size = panel.settings.size;
      if(size !== 'grow') {
        let relativeWidth = tpl.getRelativeSettingSize(panel.settings.size, index);
        $(panel).css('flex-grow', relativeWidth);
        panel.tpl.initialized.set(true);
      }
    });
    // we have to perform grow stage after setting fixed size panels
    let growPanels = tpl.getGrowingPanels();
    const availableWidth = tpl.getAvailableGrowWidth();
    if(growPanels.length == 0 && availableWidth > 0) {
      console.error('No panels can grow but panels have excess pixels. Using last panel to grow');
      growPanels = tpl.panels.slice(-1);
    }
    each(growPanels, (panel, index) => {
      let relativeWidth = availableWidth / growPanels.length;
      const minWidth = tpl.getRelativeSettingSize(panel.settings.minWidth);
      const maxWidth = tpl.getRelativeSettingSize(panel.settings.minWidth);
      if(relativeWidth < minWidth) {
        relativeWidth = minWidth;
      }
      if(relativeWidth > maxWidth) {
        relativeWidth = maxWidth;
      }
      $(panel).css('flex-grow', relativeWidth);
      panel.tpl.initialized.set(true);
    });
  },
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
    return tpl.panels.filter(panel => panel.settings.size == 'grow');
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
  setStartingCalculations(panel, eventData) {
    const naturalSizes = tpl.panels.map((panel, index) => tpl.getNaturalPanelSize(index));
    tpl.group = {
      ...tpl.group,
      scrollOffset: tpl.getGroupScrollOffset(),
      size: tpl.getGroupSize(),
      naturalSizes
    };
    tpl.resize = {
      ...tpl.resize,
      index: tpl.getPanelIndex(panel),
      start: eventData.startPosition + tpl.group.scrollOffset
    };
  },

  removeStartingCalculations() {
    delete tpl.group.scrollOffset;
    delete tpl.group.size;
    delete tpl.resize.start;
    delete tpl.resize.index;
  },

  setResizeCalculations(panel, eventData) {
    tpl.resize = {
      ...tpl.resize,
      end: eventData.endPosition + tpl.group.scrollOffset,
    };
    tpl.resize.delta = tpl.resize.end - tpl.resize.start;
  },

  removeResizeCalculations() {
    tpl.resize.start = tpl.resize.end;
  },

  getPanelSetting(index, setting) {
    let panel = tpl.panels[index];
    return panel.settings[setting];
  },
  isMinimized(index) {
    return tpl.getPanelSetting(index, 'minimized');
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
    if(tpl.group.size) {
      return tpl.group.size;
    }
    return (settings.direction == 'horizontal')
      ? $('.panels', { pierceShadow: false }).width()
      : $('.panels', { pierceShadow: false }).height()
    ;
  },
  setPanelSize(index, relativeSize, { donorType, donorIndexes = [] } = {}) {
    let panel = tpl.panels[index];
    if(donorType) {
      let currentSize = tpl.getPanelSizePixels(index) || 0;
      let newSize = tpl.getPixelSize(relativeSize) || 0;
      let sizeDelta = newSize - currentSize;
      tpl.resizePanels(index, sizeDelta, { handleBefore: false});
    }
    else {
      $(panel).css('flex-grow', relativeSize);
    }
  },
  setPanelSizePixels(index, pixelSize, settings) {
    let relativeSize = tpl.getRelativeSize(pixelSize);
    tpl.setPanelSize(index, relativeSize, settings);
  },
  getRelativeSize(pixelSize) {
    return Math.min(pixelSize / tpl.getGroupSize() * 100, 100);
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
  setNaturalPanelSize(index, settings = { donorType: 'adjacent' }) {
    let naturalSize = tpl.getNaturalPanelSize(index);
    if(naturalSize == 0) {
      return;
    }
    tpl.setPanelSizePixels(index, naturalSize, settings);
  },
  debugSizes() {
    let total = 0;
    let sizes = [];
    each(tpl.panels, (panel) => {
      const size = tpl.getPanelSize(panel);
      total += size;
      sizes.push(size);
    });
    if(total < 99.5 || total > 100.5) {
      console.log('issue with resizing');
      console.log(total);
      console.log(sizes);
    }
  },

  resizePanels(index, delta, { handleBefore = true } = {}) {
    let
      lastIndex = tpl.panels.length - 1,
      standard = delta > 0,
      inverted = delta < 0,
      // if the handle is on the other side
      getLeftIndex = () => {
        return (handleBefore)
          ? index - 1
          : index
        ;
      },
      getRightIndex = () => {
        return (handleBefore)
          ? index
          : index + 1
        ;
      },
      getNaturalSize = memoize((index) => {
        let naturalSize = tpl.group.naturalSizes[index];
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
        return minSize || 0;
      }),
      getSize = memoize((index) => {
        let panelSize = tpl.getPanelSizePixels(index);
        return panelSize;
      }),
      setSize = (index, size) => {
        if(isMinimized(index)) {
          return false;
        }
        tpl.setPanelSizePixels(index, size);
      },
      pixelsToGrow = Math.abs(delta),
      pixelsToTake = Math.abs(delta),
      leftIndex,
      rightIndex
    ;

    leftIndex = getLeftIndex();
    rightIndex = getRightIndex();

    if(standard) {

      /*--------------
        Collapse Pass
      ---------------*/

      while (rightIndex <= lastIndex) {
        let
          currentSize = getSize(rightIndex),
          naturalSize = getNaturalSize(index),
          maxSize = getMaxSize(index) || naturalSize
        ;
        // has any pixels to give
        if (currentSize > maxSize) {
          if (currentSize - pixelsToTake >= maxSize) {
            // can subtract all from this column
            setSize(rightIndex, currentSize - pixelsToTake);
            pixelsToTake = 0;
            break;
          } else {
            // can only subtract partial amount from this column
            setSize(rightIndex, maxSize);
            pixelsToTake -= currentSize - maxSize;
          }
        }
        rightIndex++;
      }

      /*--------------
        Min-Width Pass
      ---------------*/

      if (pixelsToTake > 0) {

        // reset index
        rightIndex = getRightIndex();

        // collapse pass
        while (rightIndex <= lastIndex) {
          let
            currentSize = getSize(rightIndex),
            minSize = getMinSize(rightIndex)
          ;
          // has any pixels to give
          if (currentSize > minSize) {
            if (currentSize - pixelsToTake >= minSize) {
              // can subtract all from this column
              setSize(rightIndex, currentSize - pixelsToTake);
              pixelsToTake = 0;
              break;
            } else {
              // can only subtract partial amount from this column
              setSize(rightIndex, minSize);
              pixelsToTake -= currentSize - minSize;
            }
          }
          rightIndex++;
        }
      }

      // if couldn't take all the pixels we needed then let's not grow as much
      pixelsToGrow -= pixelsToTake;

      /*-----------------
        Grow-Left Pass
      ------------------*/

      while (leftIndex >= 0) {
        let
          currentSize = getSize(leftIndex),
          naturalSize = getNaturalSize(leftIndex),
          maxSize = getMaxSize(leftIndex) || naturalSize
        ;
        // has any pixels to give
        if (currentSize < maxSize) {
          if (currentSize + pixelsToGrow <= maxSize) {
            // can subtract all from this column
            setSize(leftIndex, currentSize + pixelsToGrow);
            pixelsToGrow = 0;
            break;
          } else {
            // can only subtract partial amount from this column
            setSize(leftIndex, maxSize);
            pixelsToGrow -= maxSize - currentSize;
          }
        }
        leftIndex--;
      }

      /*--------------
        Adjacent Pass
      ---------------*/

      // add leftover pixels so that we're even
      if (pixelsToGrow > 0) {
        // reset index
        leftIndex = getLeftIndex();

        // grow pass
        let currentSize = getSize(leftIndex);
        setSize(leftIndex, currentSize + pixelsToGrow);
      }

    }
    else if(inverted) {

      /*-----------------
       Collapse-Left Pass
      ------------------*/

      while (leftIndex >= 0) {
        let
          currentSize = getSize(leftIndex),
          naturalSize = getNaturalSize(leftIndex)
        ;
        // has any pixels to give
        if (currentSize > naturalSize) {
          if (currentSize - pixelsToTake >= naturalSize) {
            // can subtract all from this column
            setSize(leftIndex, currentSize - pixelsToTake);
            pixelsToTake = 0;
            break;
          } else {
            // can only subtract partial amount from this column
            setSize(leftIndex, naturalSize);
            pixelsToTake -= currentSize - naturalSize;
          }
        }
        leftIndex--;
      }

      /*--------------
        Min-Width Pass
      ---------------*/

      if (pixelsToTake > 0) {

        // reset index
        leftIndex = getLeftIndex();

        // collapse pass
        while (leftIndex >= 0) {
          let
            currentSize = getSize(leftIndex),
            minSize = getMinSize(leftIndex)
          ;
          // has any pixels to give
          if (currentSize > minSize) {
            if (currentSize - pixelsToTake >= minSize) {
              // can subtract all from this column
              setSize(leftIndex, currentSize - pixelsToTake);
              pixelsToTake = 0;
              break;
            } else {
              // can only subtract partial amount from this column
              setSize(leftIndex, minSize);
              pixelsToTake -= currentSize - minSize;
            }
          }
          leftIndex--;
        }
      }

      // if couldn't take all the pixels we needed then let's not grow as much
      pixelsToGrow -= pixelsToTake;
      rightIndex = getRightIndex();

      /*--------------
       Max Width Pass
      ---------------*/

      while (rightIndex <= lastIndex) {
        let
          currentSize = getSize(rightIndex),
          naturalSize = getNaturalSize(rightIndex),
          maxSize = getMaxSize(rightIndex) || naturalSize
        ;
        // has any pixels to give
        if (currentSize < maxSize) {
          if (currentSize + pixelsToGrow <= maxSize) {
            // can subtract all from this column
            setSize(rightIndex, currentSize + pixelsToGrow);
            pixelsToGrow = 0;
            break;
          } else {
            // can only subtract partial amount from this column
            setSize(rightIndex, maxSize);
            pixelsToGrow -= naturalSize - currentSize;
          }
        }
        rightIndex++;
      }
      /*--------------
        Adjacent Pass
      ---------------*/

      if (pixelsToGrow > 0) {
        rightIndex = getRightIndex();
        let currentSize = getSize(rightIndex);
        setSize(rightIndex, currentSize + pixelsToGrow);
      }

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
      tpl.setStartingCalculations(panel, data);
    }
  },
  'resizeDrag ui-panel'({tpl, event, data}) {
    // note: the handle event fires on the preceding panel to the handle
    // so for | 1 || 2 | the handle fires on '2'
    const panel = event.target;
    if(inArray(panel, tpl.panels)) {
      requestAnimationFrame(() => {
        tpl.setResizeCalculations(panel, data);
        tpl.resizePanels(tpl.resize.index, tpl.resize.delta);
        tpl.removeResizeCalculations();
      });
    }
  },
  'resizeEnd ui-panel'({tpl, event, data}) {
    const panel = event.target;
    if(inArray(panel, tpl.panels)) {
      tpl.removeStartingCalculations();
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
