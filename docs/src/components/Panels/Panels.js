import { createComponent } from '@semantic-ui/component';
import { each, firstMatch, inArray } from '@semantic-ui/utils';
import { ReactiveVar } from '@semantic-ui/reactivity';

import template from './Panels.html?raw';
import css from './Panels.css?raw';


const settings = {
  direction: 'vertical',
};

const createInstance = ({tpl, settings, $}) => ({
  panels: [],
  panelSettings: [],
  panelWidths: [],
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
  registerPanel({el, settings}) {
    tpl.panels.push(el);
    tpl.panelSettings.push(settings);
  },
  setStartingCalculations(panel, eventData) {
    tpl.group = {
      ...tpl.group,
      scrollOffset: tpl.getGroupScrollOffset(),
      size: tpl.getGroupSize()
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
    return panel.tpl.data[setting];
  },
  getPanelIndex(el) {
    return tpl.panels.indexOf(el);
  },
  getChangeAmount(delta) {
    const panelSize = tpl.getGroupSize();
    return Math.abs(delta / panelSize * 100);
  },
  getPanelSize(panel) {
    return parseFloat($(panel).css('flex-grow'));
  },
  getPanelSizePixels(panel) {
    return (tpl.getPanelSize(panel) / 100) * tpl.getGroupSize();
  },
  getGroupScrollOffset() {
    return (settings.direction == 'horizontal')
      ? $('.panels').scrollLeft()
      : $('.panels').scrollTop()
    ;
  },
  getGroupSize() {
    if(tpl.group.size) {
      return tpl.group.size;
    }
    return (settings.direction == 'horizontal')
      ? $('.panels').width()
      : $('.panels').height()
    ;
  },
  setPanelSize(index, relativeSize) {
    let panel = tpl.panels[index];
    $(panel).css('flex-grow', relativeSize);
  },
  setPanelSizePixels(index, pixelSize) {
    let relativeSize = pixelSize / tpl.getGroupSize() * 100;
    tpl.setPanelSize(index, relativeSize);
  },
  debugSizes() {
    let total = 0;
    each(tpl.panels, (panel) => {
      const size = tpl.getPanelSize(panel);
      total += size;
    });
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
      getNaturalSize = (index) => {
        let panel = tpl.panels[index];
        let getPanelNaturalWidth = tpl.getPanelSetting(index, 'getNaturalSize', 'getNaturalSize');
        let naturalSize = getPanelNaturalWidth(panel, settings.direction);
        return naturalSize;
      },
      getMaxSize = (index) => {
        let maxSize = tpl.getPanelSetting(index, 'maxSize');
        return maxSize;
      },
      getMinSize = (index) => {
        let minSize = tpl.getPanelSetting(index, 'minSize');
        return minSize || 0;
      },
      getSize = (index) => {
        let panel = tpl.panels[index];
        let panelSize = tpl.getPanelSizePixels(panel);
        return panelSize;
      },
      setSize = (index, size) => {
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

const onCreated = ({ tpl }) => {

};

const onDestroyed = ({ tpl }) => {
};

const onRendered = ({ $, el, tpl, settings }) => {
};

const events = {
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
      tpl.setResizeCalculations(panel, data);
      requestAnimationFrame(() => {
        tpl.resizePanels(tpl.resize.index, tpl.resize.delta);
      });
      tpl.removeResizeCalculations();
    }
  },
  'resizeEnd ui-panel'({tpl, event, data}) {
    const panel = event.target;
    if(inArray(panel, tpl.panels)) {
      tpl.removeStartingCalculations();
    }
  },
};

const Panels = createComponent({
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

export default Panels;
export { Panels };
