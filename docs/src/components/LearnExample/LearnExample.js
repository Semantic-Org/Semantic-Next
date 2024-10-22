import { defineComponent } from '@semantic-ui/component';
import { each } from '@semantic-ui/utils';

import { CodePlayground } from '../CodePlayground/CodePlayground.js';

import '@semantic-ui/core/src/components/button';

import template from './LearnExample.html?raw';
import css from './LearnExample.css?raw';


const settings = {
  playgroundConfig: {
    files: [],
    example: '',
    sandboxURL: '',
    panelIndexes: {},
  },
  test: 'value'
};

const state = {
};

const createComponent = ({}) => ({

});

const onCreated = ({ settings }) => {
};

const onRendered = ({}) => {
};

const onThemeChanged = ({}) => {
};

const keys = {
};

const events = {
};


const LearnExample = defineComponent({
  tagName: 'learn-example',
  delegatesFocus: true,
  template,
  css,
  createComponent,
  settings,
  onCreated,
  onRendered,
  events,
  state,
  keys,
  onThemeChanged,
});

export default LearnExample;
export { LearnExample };
