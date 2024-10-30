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

  // whether to save the learn/example panes
  saveState: true,
  saveStateID: 'learn',

  files: {}, // files to display alongside lesson
  solutionFiles: {}, // solution files for lessons with a solve button

  // populates previous / next buttons
  previousLesson: {},
  nextLesson: {},

  // populates menu
  menu: [],

  activeURL: '',
  playgroundConfig: {
    files: [],
    example: '',
    sandboxURL: '',
    panelIndexes: {},
  },
};

const state = {
  currentFiles: [],
};

const createComponent = ({ $, state, settings }) => ({
  initialize() {
    state.currentFiles.set(settings.files);
  },
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
  console.log(data);
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
  'click .solve'({settings, data, state}) {
    state.currentFiles.set(settings.solutionFiles);
  },
  'click .toggle-menu'({ self }) {
    self.toggleNavMenu();
  },
  'click ui-button[href]'({ self, event }) {
    const href = $(event.target).attr('href');
    //event.preventDefault();
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
