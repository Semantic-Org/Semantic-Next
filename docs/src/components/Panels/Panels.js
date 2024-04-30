import { createComponent } from '@semantic-ui/component';
import { get, each, sortBy } from '@semantic-ui/utils';
import { ReactiveVar } from '@semantic-ui/reactivity';

import template from './Panels.html?raw';
import css from './Panels.css?raw';


const settings = {
  direction: 'vertical',
};

const createInstance = ({tpl, settings, $}) => ({
  onResize() {
    console.log('got here');
  }
});

const onCreated = ({ tpl }) => {

};

const onDestroyed = ({ tpl }) => {
};

const onRendered = ({ $, el, tpl, settings }) => {
};

const events = {
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
