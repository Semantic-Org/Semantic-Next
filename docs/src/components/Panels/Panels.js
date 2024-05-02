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
  registerPanel({el, settings}) {
    tpl.panels.push(el);
    tpl.panelSettings.push(settings);
  },
  resizePanel({afterPanel, delta, initialSize}) {
    let afterIndex = tpl.getPanelIndex(afterPanel);
    const beforePanel = tpl.panels[afterIndex - 1];
    // if the handle was dragged towards the after panel (positive)
    // then we are growing the preceding panel
    const growingPanel = (delta > 0)
      ? beforePanel
      : afterPanel
    ;
    const shrinkingPanel = tpl.getFirstAvailableDonor(growingPanel, delta);
    const changeAmount = tpl.getChangeAmount(delta);
    tpl.shrinkPanel({shrinkingPanel, changeAmount, initialSize});
    tpl.growPanel({growingPanel, changeAmount, initialSize});
  },
  getFirstAvailableDonor(growingPanel, delta) {
    let growingIndex = tpl.getPanelIndex(growingPanel);
    let donorPanels = (delta > 0)
      ? tpl.panels.slice(growingIndex + 1)
      : tpl.panels.slice(0, growingIndex - 1).reverse()
    ;
    return firstMatch(donorPanels, (panel) => {
      const index = tpl.getPanelIndex(panel);
      const settings = tpl.panelSettings[index];
      if(settings.minWidth && settings.minWidth.search('px')) {
        // check min width px
      }
      return true;
    });
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
  getGroupSize() {
    if(tpl.cachedSize) {
      return tpl.cachedSize;
    }
    return (settings.direction == 'horizontal')
      ? $('.panels').width()
      : $('.panels').height()
    ;
  },
  shrinkPanel(shrinkingPanel, shrinkAmount) {
    const currentSize = tpl.getPanelSize(shrinkingPanel);
    const newSize = currentSize - shrinkAmount;
    $(shrinkingPanel).css('flex-grow', newSize);
  },
  growPanel({growingPanel, growAmount, initialSize}) {
    const newSize = initialSize + growAmount;
    console.log('new size growing', growAmount, growingPanel);
    $(growingPanel).css('flex-grow', newSize);
  },
  debugSizes() {
    let total = 0;
    each(tpl.panels, (panel) => {
      const size = tpl.getPanelSize(panel);
      total += size;
      console.log(size);
    });
    console.log('total', total);
    console.log('-----');
  },
  setCachedSize() {
    tpl.cachedSize = tpl.getPanelSize();
  },
  removeCachedSize() {
    delete tpl.cachedSize;
  }
});

const onCreated = ({ tpl }) => {

};

const onDestroyed = ({ tpl }) => {
};

const onRendered = ({ $, el, tpl, settings }) => {
};

const events = {
  'resizeBegin ui-panel'() {
    const panel = event.target;
    if(inArray(panel, tpl.panels)) {
      tpl.setCachedSize();
    }
  },
  // note: the handle event fires on the preceding panel to the handle
  // so for | 1 || 2 | the handle fires on '2'
  'resize ui-panel'({tpl, event, data}) {
    const panel = event.target;
    if(inArray(panel, tpl.panels)) {
      const { delta } = data;
      requestAnimationFrame(() => {
        tpl.resizePanel({afterPanel: panel, delta: delta, initialSize });
        tpl.debugSizes();
      });
    }
  },
  'resizeEnd ui-panel'() {
    const panel = event.target;
    if(inArray(panel, tpl.panels)) {
      tpl.removeCachedSize();
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
