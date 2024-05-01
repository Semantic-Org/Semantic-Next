import { createComponent } from '@semantic-ui/component';
import { each, inArray } from '@semantic-ui/utils';
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
  getPanelIndex(el) {
    return tpl.panels.indexOf(el);
  },
  // determine who is losing pixels
  getDonorPanel({panel, index, delta}) {
    let donorIndex;
    let panelSettings = tpl.panelSettings[index];
    const isMinWidth = false; // not implemented yet
    const isMaxWidth = false;
    if(delta > 0 && index < tpl.panels.length) {
      donorIndex = index + 1;
    }
    else if(delta < 0 && index !== 0 && isMinWidth) {
      donorIndex = index - 1;
    }
    return donorIndex ? tpl.panels[donorIndex] : undefined;
  },
  getPanelSize() {
    return settings.direction == 'horizontal'
      ? $('.panels').width()
      : $('.panels').height()
    ;
  },
  getChangeAmount(delta) {
    const panelSize = tpl.getPanelSize();
    return delta / panelSize * 100;
  },
  resizePanel({belowPanel, delta, initialSize}) {
    const index = tpl.getPanelIndex(panel);
    const donorPanel = tpl.getDonorPanel({panel, index, delta});
    const growPanel = tpl.panels[index];
    const changeAmount = tpl.getChangeAmount(delta);
    // take from next panel
    if(donorPanel) {
      tpl.shrinkPanel({donorPanel, changeAmount});
    }
    tpl.growPanel({panel, initialSize, changeAmount});
  },
  shrinkPanel({donorPanel, amount}) {
    const currentSize = $(donorPanel).css('flex-grow');
    const newSize = currentSize - amount;
    $(donorPanel).css('flex-grow', newSize);
  },
  growPanel({panel, initialSize, changeAmount}) {
    const newSize = initialSize + changeAmount;
    $(panel).css('flex-grow', newSize);
  },
  debugSizes() {
    let total = 0;
    each(tpl.panels, (panel) => {
      const size = parseFloat($(panel).css('flex-grow'));
      total += size;
      console.log(size);
    });
    console.log('total', total);
    console.log('-----');
  }
});

const onCreated = ({ tpl }) => {

};

const onDestroyed = ({ tpl }) => {
};

const onRendered = ({ $, el, tpl, settings }) => {
};

const events = {
  // we ignore deeply nested by checking if this is a registered panel
  'resize ui-panel'({tpl, event, data}) {
    const panel = event.target;
    if(inArray(panel, tpl.panels)) {
      const { initialSize, delta } = data;
      requestAnimationFrame(() => {
        tpl.resizePanel({belowPanel: panel, initialSize, delta: delta });
        tpl.debugSizes();
      });
    }
  }
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
