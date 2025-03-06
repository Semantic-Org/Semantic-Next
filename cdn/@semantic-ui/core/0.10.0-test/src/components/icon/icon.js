import { defineComponent } from '@semantic-ui/component';
import { IconComponentSpec } from '@semantic-ui/specs';;

import CSS from './css/icon-shadow.css?raw';
import Template from './icon.html?raw';

const createComponent = ({self, $}) => ({


});


const onCreated = ({self, el}) => {
};

const onRendered = function({$, isClient}) {
};

const UIIcon = defineComponent({
  tagName: 'ui-icon',
  componentSpec: IconComponentSpec,
  template: Template,
  css: CSS,
  createComponent,
  onCreated,
  onRendered,
});

export { UIIcon };
