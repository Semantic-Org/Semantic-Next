import { defineComponent } from '@semantic-ui/component';
import { isEmpty, openLink } from '@semantic-ui/utils';

/* Sub Components */
import { HintModal } from './subtemplates/HintModal.js';
import { ReferenceModal } from './subtemplates/ReferenceModal.js';

/* Components */
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
  layout: 'tabs',
};

const createComponent = ({ $, $$, data, self, state, reaction, settings }) => ({
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
  getPlaygroundLayout() {
    return state.layout.get();
  },
  hasPreviousLesson() {
    return !isEmpty(settings.previousLesson);
  },
  hasNextLesson() {
    return !isEmpty(settings.nextLesson);
  },
  isFile(file) {
    return Boolean(settings.files[file]);
  },
  getPlayground() {
    return $('code-playground').getComponent();
  },
  calculateCodeLayout() {
    const playground = self.getPlayground();
    if(!playground) {
      return;
    }
    reaction(() => {
      const codeLayout = playground.getLayout();
      state.layout.set(codeLayout);
    });
  },
  linkifyFiles() {
    $$('code').each((el) => {
      const text = $(el).text();
      if(self.isFile(text)) {
        $(el).html(`<a href="#${text}">${text}</a>`);
      }
    });
  },
  openFile(filename) {
    self.getPlayground().selectFilename(filename);
  },
});

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
  'click ui-button.layout'({ $ }) {
    $('code-playground').getComponent().toggleTabs();
  },
  'click ui-button.hint'({findChild}) {
    findChild('hintModal').show();
  },
  'click ui-button.references'({findChild, settings}) {
    findChild('referenceModal').show();
  },
  'click a[href]'({ self, target, event }) {
    const href = $(target).attr('href');
    const file = href.replace(/^#/, '');
    if(self.isFile(file)) {
      self.openFile(file);
      event.preventDefault();
    }
    else {
      openLink(href, { newWindow: true, event });
    }
  },
  'click ui-button[href]'({ self, event }) {
    const href = $(event.target).attr('href');


    // self.loadPage(href);
    //event.preventDefault();
  },
};

const onRendered = ({ self }) => {
  self.calculateCodeLayout();
  self.linkifyFiles();
};


const LearnExample = defineComponent({
  tagName: 'learn-example',
  delegatesFocus: true,
  template,
  css,
  createComponent,
  onRendered,
  settings,
  events,
  state,
  subTemplates: {
    hintModal: HintModal,
    referenceModal: ReferenceModal,
  }
});

export default LearnExample;
export { LearnExample };
