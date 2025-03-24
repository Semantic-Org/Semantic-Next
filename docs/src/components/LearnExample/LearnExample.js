import { defineComponent } from '@semantic-ui/component';
import { inArray, isEmpty, openLink, getJSON } from '@semantic-ui/utils';

/* Sub Components */
import { HintModal } from './subtemplates/HintModal.js';
import { ReferenceModal } from './subtemplates/ReferenceModal.js';

/* Components */
import { CodePlayground } from '../CodePlayground/CodePlayground.js';
import { NavMenu } from '../NavMenu/NavMenu.js';

/* UI */
import '@semantic-ui/core/src/components/button';

import css from './LearnExample.css?raw';
import template from './LearnExample.html?raw';

const defaultSettings = {
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

  // populates menu showing all lessons
  menu: [],
  // used to select correct menu section
  activeURL: '',

  playgroundConfig: {
    files: [],
    example: '',
    sandboxURL: '',
    panelIndexes: {},
  },

  lessonEndpoint: '/content-api/lessons/{id}.json',
  baseURL: '/learn',
};

const defaultState = {
  layout: 'tabs',
  mobileView: 'lesson',
};

const createComponent = ({ $, $$, el, data, self, state, reaction, isRendered, settings }) => ({
  mobileMenu: [
    { label: 'Lesson', value: 'lesson' },
    { label: 'Code', value: 'code' },
    { label: 'Preview', value: 'preview' },
  ],
  initialize() {
    self.calculateMobileView();
  },
  calculateMobileView() {
    reaction(() => {
      const layout = state.mobileView.get();
      if (!isRendered()) {
        return;
      }
      const playground = $('code-playground').component();
      // we update the playground instance to change view
      if (playground && inArray(layout, ['code', 'preview'])) {
        playground.setMobileView(layout);
      }
    });
  },
  getClassMap() {
    const classes = {
      learn: true,
    };
    classes[`mobile-${state.mobileView.get()}`] = true;
    return classes;
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
    return $('code-playground').component();
  },
  calculateCodeLayout() {
    const playground = self.getPlayground();
    if (!playground) {
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
      if (self.isFile(text)) {
        $(el).html(`<a href="#${text}">${text}</a>`);
      }
    });
  },
  getLessonJSON(id) {
    return settings.lessonEndpoint.replace('{id}', id);
  },
  changeLesson(newLesson) {
    settings.lesson = newLesson.lesson;
    settings.previousLesson = newLesson.previousLesson;
    settings.nextLesson = newLesson.nextLesson;
    settings.files = newLesson.files;
    settings.solutionFiles = newLesson.solutionFiles;
    $(el).setSlot(newLesson.lessonHTML);
    console.log('setting state to', newLesson.lesson.id);
    window.history.pushState(newLesson, `Semantic UI`, `${settings.baseURL}/${newLesson.lesson.id}`);
  },
  openFile(filename) {
    self.getPlayground().selectFilename(filename);
  },
  updatePlaygroundFiles(files) {
    const playground = $('code-playground').component();
    playground.setFiles(files);
  }
});

const events = {
  'global popstate window'({self, event}) {
    const lesson = event.state;
    console.log(lesson.lesson.id);
    self.changeLesson(lesson);
  },
  'click'({ self, event, $ }) {
    if ($(event.target).closest('.toggle-menu').exists()) {
      return;
    }
    if (self.isNavMenuVisible()) {
      self.hideNavMenu();
    }
  },
  'click .solve'({ settings, self }) {
    self.updatePlaygroundFiles(settings.solutionFiles);
  },
  'click .toggle-menu'({ self }) {
    self.toggleNavMenu();
  },
  'click ui-button.layout'({ $ }) {
    $('code-playground').component().toggleTabs();
  },
  'click ui-button.hint'({ findChild }) {
    findChild('hintModal').show();
  },
  'click ui-button.references'({ findChild, settings }) {
    findChild('referenceModal').show();
  },
  'change ui-menu.mobile'({ state, data }) {
    state.mobileView.set(data.value);
  },
  async 'click .next'({event, self, settings}) {
    event.preventDefault();
    const newLesson = await getJSON(self.getLessonJSON(settings.nextLesson.id))
    self.changeLesson(newLesson);
  },
  'click a[href]'({ self, target, event }) {
    const href = $(target).attr('href');
    const file = href.replace(/^(\/#|#)/, '');
    if (self.isFile(file)) {
      self.openFile(file);
      event.preventDefault();
    }
    else {
      if (href.startsWith('/learn')) {
        return;
      }
      openLink(href, { newWindow: true, target: '_help', event });
    }
  },
  'click ui-button[href]'({ self, event }) {
    const href = $(event.target).attr('href');
    // self.loadPage(href);
    // event.preventDefault();
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
  defaultSettings,
  events,
  defaultState,
  subTemplates: {
    hintModal: HintModal,
    referenceModal: ReferenceModal,
  },
});

export default LearnExample;
export { LearnExample };
