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
    width: undefined,
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
    tpl.resizePanels(tpl.resize.index, tpl.resize.delta);
  },
  removeResizeCalculations() {
    tpl.start = tpl.end;
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
    return tpl.getPanelSize(panel) * tpl.getGroupSize();
  },
  getNaturalPanelSize(panel) {
    return (settings.direction == 'horizontal')
      ? $(panel).naturalWidth()
      : $(panel).naturalHeight()
    ;
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
  setPanelWidth(index, relativeWidth) {
    let panel = tpl.panels[index];
    $(panel).css('flex-grow', relativeWidth);
  },
  setPanelWidthPixels(index, pixelWidth) {
    let relativeWidth = pixelWidth / tpl.get.groupSize();
    tpl.setPanelWidth(index, relativeWidth);
  },
  debugSizes() {
    let total = 0;
    each(tpl.panels, (panel) => {
      const size = tpl.getPanelSize(panel);
      total += size;
    });
  },
  resizePanels(index, delta) {
    let
      leftIndex = index - 1,
      rightIndex = index + 1,
      lastIndex = tpl.panels.length - 1,
      standard = delta > 0,
      inverted = delta < 0,
      getNaturalSize = (index) => {
        tpl.getNaturalPanelSize(index);
      },
      getMaxSize = (index) => {
        return tpl.panelSettings[index]?.maxSize;
      },
      getMinSize = (index) => {
        return tpl.panelSettings[index]?.minSize;
      },
      getSize = (index) => {
        tpl.getPanelSizePixels(index);
      },
      setWidth = (index, width) => {
        tpl.setPanelWidthPixels(index, width);
      },
      pixelsToGrow = Math.abs(delta),
      pixelsToTake = Math.abs(delta)
    ;

    if(standard) {

      /*--------------
        Collapse Pass
      ---------------*/

      while (rightIndex <= lastIndex) {
        let
          currentWidth = getSize(rightIndex),
          naturalSize = getNaturalSize(index),
          maxWidth = getMaxSize(index) || naturalSize
        ;
        // has any pixels to give
        if (currentWidth > maxWidth) {
          if (currentWidth - pixelsToTake >= maxWidth) {
            // can subtract all from this column
            setWidth(rightIndex, currentWidth - pixelsToTake);
            pixelsToTake = 0;
            break;
          } else {
            // can only subtract partial amount from this column
            setWidth(rightIndex, maxWidth);
            pixelsToTake -= currentWidth - maxWidth;
          }
        }
        rightIndex++;
      }

      /*--------------
        Min-Width Pass
      ---------------*/

      if (pixelsToTake > 0) {
        // reset index
        rightIndex = index + 1;

        // collapse pass
        while (rightIndex <= lastIndex) {
          let
            currentWidth = getSize(rightIndex),
            minWidth = getMinSize(rightIndex)
          ;
          // has any pixels to give
          if (currentWidth > minWidth) {
            if (currentWidth - pixelsToTake >= minWidth) {
              // can subtract all from this column
              setWidth(rightIndex, currentWidth - pixelsToTake);
              pixelsToTake = 0;
              break;
            } else {
              // can only subtract partial amount from this column
              setWidth(rightIndex, minWidth);
              pixelsToTake -= currentWidth - minWidth;
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
          currentWidth = getSize(leftIndex),
          naturalSize = getNaturalSize(leftIndex),
          maxWidth = getMaxSize(leftIndex) || naturalSize
        ;
        // has any pixels to give
        if (currentWidth < maxWidth) {
          if (currentWidth + pixelsToGrow <= maxWidth) {
            // can subtract all from this column
            setWidth(leftIndex, currentWidth + pixelsToGrow);
            pixelsToGrow = 0;
            break;
          } else {
            // can only subtract partial amount from this column
            setWidth(leftIndex, maxWidth);
            pixelsToGrow -= maxWidth - currentWidth;
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
        leftIndex = index;

        // grow pass
        let currentWidth = getSize(leftIndex);
        setWidth(leftIndex, currentWidth + pixelsToGrow);
      }

    }
    else if(inverted) {

      /*-----------------
       Collapse-Left Pass
      ------------------*/

      while (leftIndex >= 0) {
        let
          currentWidth = getSize(leftIndex),
          naturalSize = getNaturalSize(leftIndex)
        ;
        // has any pixels to give
        if (currentWidth > naturalSize) {
          if (currentWidth - pixelsToTake >= naturalSize) {
            // can subtract all from this column
            setWidth(leftIndex, currentWidth - pixelsToTake);
            pixelsToTake = 0;
            break;
          } else {
            // can only subtract partial amount from this column
            setWidth(leftIndex, naturalSize);
            pixelsToTake -= currentWidth - naturalSize;
          }
        }
        leftIndex--;
      }

      /*--------------
        Min-Width Pass
      ---------------*/

      if (pixelsToTake > 0) {

        // reset index
        leftIndex = index;

        // collapse pass
        while (leftIndex >= 0) {
          let
            currentWidth = getSize(leftIndex),
            minWidth = getMinSize(leftIndex)
          ;
          // has any pixels to give
          if (currentWidth > minWidth) {
            if (currentWidth - pixelsToTake >= minWidth) {
              // can subtract all from this column
              setWidth(leftIndex, currentWidth - pixelsToTake);
              pixelsToTake = 0;
              break;
            } else {
              // can only subtract partial amount from this column
              setWidth(leftIndex, minWidth);
              pixelsToTake -= currentWidth - minWidth;
            }
          }
          leftIndex--;
        }
      }

      // if couldn't take all the pixels we needed then let's not grow as much
      pixelsToGrow -= pixelsToTake;
      rightIndex = index + 1;

      /*--------------
       Max Width Pass
      ---------------*/

      while (rightIndex <= lastIndex) {
        let
          currentWidth = getSize(rightIndex),
          naturalSize = getNaturalSize(rightIndex),
          maxWidth = getMaxSize(rightIndex) || naturalSize
        ;
        // has any pixels to give
        if (currentWidth < maxWidth) {
          if (currentWidth + pixelsToGrow <= maxWidth) {
            // can subtract all from this column
            setWidth(rightIndex, currentWidth + pixelsToGrow);
            pixelsToGrow = 0;
            break;
          } else {
            // can only subtract partial amount from this column
            setWidth(rightIndex, maxWidth);
            pixelsToGrow -= naturalSize - currentWidth;
          }
        }
        rightIndex++;
      }
      /*--------------
        Adjacent Pass
      ---------------*/

      if (pixelsToGrow > 0) {
        rightIndex = index + 1;
        let currentWidth = getSize(rightIndex);
        setWidth(rightIndex, currentWidth + pixelsToGrow);
      }

    }

    console.log('resize', index, delta);
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
      requestAnimationFrame(tpl.resizePanels);
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
