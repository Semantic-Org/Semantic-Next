import { defineComponent } from '@semantic-ui/component';
import { any, clone, isArray, isFunction, openLink } from '@semantic-ui/utils';
import { UIIcon } from '../../primitives/index.js';
import css from './nav-menu.css?raw';
import template from './nav-menu.html?raw';

const defaultSettings = {
  menu: [], // menus to display
  linkCurrentPage: false, // allow links for pages matching active URL
  expandAll: false, // expand all sections by default
  useAccordion: false, // allow accordion behavior
  navIcon: '', // replace accordion nav icon
  activeURL: '', // select active menu item
  searchable: false, // allow searching menu
  dark: false, // force dark mode
  aligned: false, // align submenus to headers
  noResultsMessage: `No sections match "{search}"`,
  searchPlaceholder: 'Search menu...',
};

const defaultState = {
  url: '',
  searchTerm: undefined, // search term when searching
  selectedIndex: 0, // selected keyboard index when searching
  maxIndex: 0,
};

const createComponent = ({ $, el, self, settings, state, reaction, isRendered }) => ({
  initialize() {
    reaction(self.calculateURL); // track current url
  },
  calculateURL() {
    state.url.set(settings.activeURL);
  },

  getMenu() {
    let menu = clone(settings.menu);
    menu = self.filterVisibleSections(menu);
    if (self.isSearching()) {
      menu = self.filterBySearchTerm(menu);
    }
    return menu;
  },

  filterVisibleSections(menu = []) {
    return menu.reduce((visibleMenus, { pages, shouldShow, ...item }) => {
      if (isFunction(shouldShow) && !shouldShow()) {
        return visibleMenus;
      }
      // recursively filter pages
      const filteredPages = isArray(pages)
        ? self.filterVisibleSections(pages)
        : [];
      const result = filteredPages.length > 0 ? { ...item, pages: filteredPages } : item;
      visibleMenus.push(result);
      return visibleMenus;
    }, []);
  },
  filterBySearchTerm(menu = [], searchTerm = state.searchTerm.get()) {
    if (!searchTerm) {
      return menu;
    }

    const matches = (a = '', b = searchTerm) => {
      return a.toLowerCase().includes(b.toLowerCase());
    };
    menu = menu.reduce((menuAcc, section) => {
      // Check if section name matches search term
      const sectionMatches = matches(section.name);

      // Add highlighted text for section if it matches
      const highlightedSection = sectionMatches
        ? {
          ...section,
          highlight: self.highlightMatch(section?.name, searchTerm),
        }
        : section;

      // Filter pages that match search term
      const matchingPages = isArray(section.pages)
        ? section.pages.reduce((pageAcc, page) => {
          // Check if page name matches
          const pageMatches = matches(page.name);

          // Add highlighted text for page if it matches
          const highlightedPage = pageMatches
            ? {
              ...page,
              highlight: self.highlightMatch(page?.name, searchTerm),
            }
            : page;

          // Check if any subpages match
          let filteredSubpages = [];
          let subpagesMatch = false;

          if (isArray(page.pages)) {
            filteredSubpages = page.pages.filter(subpage => matches(subpage?.name)).map(
              subpage => ({
                ...subpage,
                highlight: self.highlightMatch(subpage.name, searchTerm),
              }),
            );
            subpagesMatch = filteredSubpages.length > 0;
          }

          // Include page if it matches or any of its subpages match
          if (pageMatches || subpagesMatch) {
            if (subpagesMatch && page.pages) {
              pageAcc.push({
                ...highlightedPage,
                pages: filteredSubpages,
              });
            }
            else {
              pageAcc.push(highlightedPage);
            }
          }

          return pageAcc;
        }, [])
        : [];

      // Include section if it matches or any of its pages match
      if (sectionMatches || matchingPages.length > 0) {
        menuAcc.push({
          ...highlightedSection,
          pages: sectionMatches ? highlightedSection.pages : matchingPages,
        });
      }

      return menuAcc;
    }, []);

    // add in keyboard indexes starting with first match
    // then adding indexes to all items after
    let selectedIndex = -1;
    let firstMatch = false;
    const searchTermChanged = self._lastSearchTerm !== searchTerm;
    const addSelectedIndex = (item) => {
      if (item?.url) {
        selectedIndex++;
        item.selectedIndex = selectedIndex;
      }
      // reset selected index only when search term changes
      if (searchTermChanged && !firstMatch && item.highlight && item?.url) {
        state.selectedIndex.set(selectedIndex);
        firstMatch = true;
      }
      return item;
    };
    // add selected index for each menu, pages and subpages (3 deep max)
    menu = menu.map(currentMenu => {
      currentMenu = addSelectedIndex(currentMenu);
      (currentMenu?.pages || []).map(page => {
        page = addSelectedIndex(page);
        (page?.pages || []).map(subPage => addSelectedIndex(subPage));
      });
      return currentMenu;
    });
    self._lastSearchTerm = searchTerm;
    state.maxIndex.set(selectedIndex);
    return menu;
  },

  highlightMatch(text, searchTerm) {
    if (!searchTerm) { return text; }

    const index = text.toLowerCase().indexOf(searchTerm.toLowerCase());

    if (index === -1) { return text; }

    const before = text.substring(0, index);
    const match = text.substring(index, index + searchTerm.length);
    const after = text.substring(index + searchTerm.length);

    return { before, match, after };
  },

  getLink(item) {
    if (settings.linkCurrentPage || !self.isCurrentItem(item)) {
      return item?.url;
    }
    return;
  },
  getNoResultsMessage() {
    return settings.noResultsMessage.replace('{search}', state.searchTerm.get());
  },
  getNavIcon(section) {
    const defaultIcon = (settings.useAccordion && section?.pages && !settings.expandAll)
      ? 'chevron-down'
      : '';
    return section?.navIcon || settings.navIcon || defaultIcon || undefined;
  },

  getContentClasses(section) {
    return {
      active: self.isActiveItem(section),
      indented: self.hasIcons(),
    };
  },
  getMenuClasses() {
    return {
      accordion: settings.useAccordion,
      dark: settings.dark,
      aligned: settings.aligned,
    };
  },
  getTitleClasses(title) {
    return {
      expandable: self.isExpandable(title),
      selected: state.selectedIndex.value == title?.selectedIndex,
      active: settings.useAccordion ? self.isActiveItem(title) : false,
      current: self.isCurrentItem(title),
    };
  },
  getPageClasses(page) {
    return {
      selected: state.selectedIndex.value == page?.selectedIndex,
      current: self.isCurrentItem(page),
    };
  },

  canShowNavIcon(section) {
    return self.getNavIcon(section) != undefined;
  },

  shouldShow(item) {
    if (isFunction(item.shouldShow)) {
      return item.shouldShow || false;
    }
    return true;
  },

  isSameURL(url1 = '', url2 = '', startsWith = false) {
    if (startsWith) {
      return url2.startsWith(url1);
    }
    if (!url1 || !url2) {
      return false;
    }
    return self.addTrailingSlash(url1) == self.addTrailingSlash(url2);
  },
  isCurrentItem(item) {
    return self.isSameURL(item?.url, state.url.get(), item.matchSubPaths);
  },
  isActiveItem(item) {
    if (settings.expandAll) {
      return true;
    }
    if (self.isCurrentItem(item)) {
      return true;
    }
    if (isArray(item.pages)) {
      return any(item.pages, self.isActiveItem);
    }
    return false;
  },
  isLinkItem(item) {
    return item.url && !self.isCurrentItem(item);
  },
  isExpandable() {
    return settings.useAccordion && !settings.expandAll;
  },
  isSearching() {
    return settings.searchable && state.searchTerm.get();
  },

  hasNoResults() {
    return state.searchTerm.get() && self.getMenu()?.length == 0;
  },
  hasIcons() {
    return any(settings.menu, section => section.icon);
  },

  addTrailingSlash(url) {
    return (url.substr(-1) === '/')
      ? url
      : `${url}/`;
  },

  onPageChange() {
    state.url.set(window.location.pathname);
  },

  scrollToActive() {
    if (!isRendered) {
      return;
    }
    const el = $('.item.current').first().el();
    if (el) {
      const rect = el.getBoundingClientRect();
      const isVisible = (
        rect.top >= 0
        && rect.left >= 0
        && rect.bottom <= window.innerHeight
        && rect.right <= window.innerWidth
      );
      if (!isVisible) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },
});

const keys = {
  'up'({ self, state }) {
    if (self.isSearching()) {
      state.selectedIndex.decrement(1, 0);
    }
  },
  'down'({ self, state }) {
    if (self.isSearching()) {
      state.selectedIndex.increment(1, state.maxIndex.get());
    }
  },
  'enter'({ self, state, $ }) {
    if (self.isSearching()) {
      const selectedIndex = state.selectedIndex.get();
      const href = $('.selected').attr('href');
      if (selectedIndex >= 0 && href) {
        openLink(href);
      }
    }
  },
};

const onRendered = ({ self, isClient, el, settings }) => {
  if (isClient) {
    self.scrollToActive();
  }

  // Set accordion attribute on host element if needed
  if (settings.useAccordion) {
    el.setAttribute('accordion', '');
  }
  else {
    el.removeAttribute('accordion');
  }
};

const events = {
  'click .title': ({ target, settings, $ }) => {
    if (!settings.useAccordion) {
      return;
    }
    const $title = $(target);
    const $content = $title.next('.content');
    $title.toggleClass('active');
    $content.toggleClass('active');
  },
  'click .nav-icon'({ event }) {
    event.preventDefault();
  },
  'input ui-input'({ state, value }) {
    state.searchTerm.set(value);
  },
};

const NavMenu = defineComponent({
  tagName: 'nav-menu',
  template,
  css,
  createComponent,
  defaultState,
  defaultSettings,
  onRendered,
  keys,
  events,
});

export default NavMenu;
export { NavMenu };
