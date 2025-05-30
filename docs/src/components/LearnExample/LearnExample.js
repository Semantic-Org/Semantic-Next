import { defineComponent } from '@semantic-ui/component';
import { inArray, isEqual, isEmpty, openLink, pick, getJSON } from '@semantic-ui/utils';

/* Sub Components */
import { HintModal } from './subtemplates/HintModal.js';
import { ReferenceModal } from './subtemplates/ReferenceModal.js';

/* Components */
import { CodePlayground } from '../CodePlayground/CodePlayground.js';
import { NavMenu } from '../NavMenu/NavMenu.js';

/* UI */
import { UIButton } from '@semantic-ui/core';

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
};

const defaultState = {
  layout: 'tabs',
  mobileView: 'lesson',
  currentFiles: [],
};

const createComponent = ({ $, $$, el, data, self, state, reaction, isRendered, settings }) => ({
  mobileMenu: [
    { label: 'Lesson', value: 'lesson' },
    { label: 'Code', value: 'code' },
    { label: 'Preview', value: 'preview' },
  ],
  initialize() {
    self.setFiles(settings.files);
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
  getLessonURL(id) {
    return settings.lessonEndpoint.replace('{id}', id);
  },
  changeLesson(newLesson) {
    const lesson = newLesson.lesson;
    settings.lesson = lesson;
    settings.previousLesson = newLesson.previousLesson;
    settings.nextLesson = newLesson.nextLesson;
    settings.solutionFiles = newLesson.solutionFiles;
    // use state to avoid rerender
    self.setFiles(newLesson.files);
    // markdown is in slotted content
    $(el).setSlot(newLesson.lessonHTML);
  },
  openFile(filename) {
    self.getPlayground().selectFilename(filename);
  },
  setFiles(files) {
    state.currentFiles.set(files);
    if(isRendered()) {
      const playground = $('code-playground').component();
      if(playground) {
        playground.setFiles(files);
      }
    }
  },
  setStartingState() {
    const state = pick(settings, 'lesson', 'previousLesson', 'nextLesson', 'files', 'solutionFiles');
    window.history.replaceState(state, document.title, window.location.pathname);
  },
  updateState(newLesson) {
    window.history.pushState(newLesson, `${newLesson.lesson.title} - Semantic UI`, newLesson.lesson.url);
  }
});

const onCreated = ({self}) => {
  self.setStartingState();
};

const events = {
  'global popstate window'({self, event}) {
    const lesson = event.state;
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
    self.setFiles(settings.solutionFiles);
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
  async 'click .previous'({event, self, settings}) {
    event.preventDefault();
    const lessonURL = self.getLessonURL(settings.previousLesson.id);
    const newLesson = await getJSON(lessonURL)
    self.changeLesson(newLesson);
    self.updateState(newLesson);
  },
  async 'click .next'({event, self, settings}) {
    event.preventDefault();
    const lessonURL = self.getLessonURL(settings.nextLesson.id);
    const newLesson = await getJSON(lessonURL)
    self.changeLesson(newLesson);
    self.updateState(newLesson);
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

const onRendered = ({ settings, self }) => {
  self.setFiles(settings.files);
  self.calculateCodeLayout();
  self.linkifyFiles();
};

const LearnExample = defineComponent({
  tagName: 'learn-example',
  delegatesFocus: true,
  template,
  css,
  createComponent,
  onCreated,
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
