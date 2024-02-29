import { createComponent } from '@semantic-ui/component';
import { IconSpec } from './spec/spec.js';

import CSS from './icon.css?raw';
import Template from './icon.html?raw';

const createInstance = ({tpl, $}) => ({


});


const onCreated = ({tpl}) => {

};

const onRendered = function({isClient}) {
};

const UIIcon = createComponent({
  tagName: 'ui-icon',
  spec: IconSpec,
  template: Template,
  css: CSS,
  createInstance,
  onCreated,
  onRendered,
});

export { UIIcon };
