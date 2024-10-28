import { defineComponent } from '@semantic-ui/component';
import { isEmpty } from '@semantic-ui/utils';

/* Subcomponents */
import { CodePlayground } from '../CodePlayground/CodePlayground.js';
import { NavMenu } from '../NavMenu/NavMenu.js';

/* UI */
import '@semantic-ui/core/src/components/button';

import template from './LearnExample.html?raw';
import css from './LearnExample.css?raw';


const settings = {
  lesson: {
    title: '',
    hint: '',
    references: [],
  },
  previousLesson: {},
  nextLesson: {},
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

const createComponent = ({ $, settings }) => ({
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
  },
  hasPreviousLesson() {
    return !isEmpty(settings.previousLesson);
  },
  hasNextLesson() {
    return !isEmpty(settings.nextLesson);
  },
});

const onCreated = ({ data }) => {
};

const onRendered = ({}) => {
};

const onThemeChanged = ({}) => {
};

const keys = {
};

const events = {
  'click'({ self, event, $ }) {
    if($(event.target).closest('.toggle-menu').exists()) {
      return;
    }
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
