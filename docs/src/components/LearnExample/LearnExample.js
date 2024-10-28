import { defineComponent } from '@semantic-ui/component';
import { each } from '@semantic-ui/utils';

import { CodePlayground } from '../CodePlayground/CodePlayground.js';
import { NavMenu } from '../NavMenu/NavMenu.js';

import '@semantic-ui/core/src/components/button';

import template from './LearnExample.html?raw';
import css from './LearnExample.css?raw';


const settings = {
  title: '',
  hint: '',
  references: [],
  menu: [],
  playgroundConfig: {
    files: [],
    example: '',
    sandboxURL: '',
    panelIndexes: {},
  },
};

const state = {
};

const createComponent = ({ $ }) => ({
  isNavMenuVisible() {
    return $('.menu').hasClass('visible');
  },
  toggleNavMenu() {
    $('.menu').toggleClass('visible');
  },
  showNavMenu() {
    $('.menu').addClass('visible');
  },
  hideNavMenu() {
    $('.menu').removeClass('visible');
  }
});

const onCreated = ({ settings }) => {
  console.log('here');
};

const onRendered = ({}) => {
};

const onThemeChanged = ({}) => {
};

const keys = {
};

const events = {
  'click'({ self }) {
    if(self.isNavMenuVisible()) {
      self.hideNavMenu();
    }
  },
  'click .toggle-menu'({ self }) {
    self.toggleNavMenu();
  },
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
