import { UIIcon } from '@semantic-ui/core';
import { defineComponent } from '@semantic-ui/component';
import { any, isFunction, isArray } from '@semantic-ui/utils';
import template from './NavMenu.html?raw';
import css from './NavMenu.css?raw';

const defaultSettings = {
  menu: [], // menus to display
  linkCurrentPage: false, // allow links for pages matching active URL
  expandAll: false, // expand all sections by default
  useAccordion: false, // allow accordion behavior
  navIcon: '', // replace accordion nav icion
  activeURL: '', // select active menu item
  searchable: false, // allow searching menu
  dark: false, // force dark mode
  aligned: false, // align submenus to headers
};

const defaultState = {
  url: '',
  search: undefined,
};

const createComponent = function ({ $, self, settings, state }) {
  return {
    initialize() {
      state.url.set(settings.activeURL);
    },
    getMenu() {
      const menu = self.filterVisibleSections(settings.menu);
      return self.filterBySearchTerm(menu, state.search.get());
    },
    getNavIcon(section) {
      const defaultIcon = (settings.useAccordion && section?.pages && !settings.expandAll)
        ? 'chevron-down'
        : ''
      ;
      return section?.navIcon || settings.navIcon || defaultIcon;
    },
    getMenuStyles() {
      return {
        accordion: settings.useAccordion,
        dark: settings.dark,
        aligned: settings.aligned,
      };
    },
    getTitleStates(title) {
      return {
        expandable: self.isExpandable(title),
        active: self.isActiveItem(title),
        current: self.isCurrentItem(title),
      };
    },
    canShowNavIcon(section) {
      return self.getNavIcon(section) !== undefined;
    },
    hasIcons() {
      return any(settings.menu, section => section.icon);
    },
    getPageStates(page) {
      return {
        current: self.isCurrentItem(page)
      };
    },
    shouldShow(item) {
      if (isFunction(item.shouldShow)) {
        return item.shouldShow || false;
      }
      return true;
    },
    filterBySearchTerm(menu = [], searchTerm) {
      if (!searchTerm) return menu;
      
      searchTerm = searchTerm.toLowerCase();
      
      return menu.reduce((acc, section) => {
        // Check if section name matches search term
        const sectionMatches = section.name?.toLowerCase().includes(searchTerm);
        
        // Filter pages that match search term
        const filteredPages = isArray(section.pages)
          ? section.pages.reduce((pagesAcc, page) => {
              // Check if page name matches
              const pageMatches = page.name?.toLowerCase().includes(searchTerm);
              
              // Check if any subpages match
              let filteredSubpages = [];
              let subpagesMatch = false;
              
              if (isArray(page.pages)) {
                filteredSubpages = page.pages.filter(subpage => 
                  subpage.name?.toLowerCase().includes(searchTerm)
                );
                subpagesMatch = filteredSubpages.length > 0;
              }
              
              // Include page if it matches or any of its subpages match
              if (pageMatches || subpagesMatch) {
                if (subpagesMatch && page.pages) {
                  pagesAcc.push({
                    ...page,
                    pages: filteredSubpages
                  });
                } else {
                  pagesAcc.push(page);
                }
              }
              
              return pagesAcc;
            }, [])
          : [];
          
        // Include section if it matches or any of its pages match
        if (sectionMatches || filteredPages.length > 0) {
          acc.push({
            ...section,
            pages: sectionMatches ? section.pages : filteredPages
          });
        }
        
        return acc;
      }, []);
    },
    filterVisibleSections(menu = []) {
      return menu.reduce((acc, { pages, shouldShow, ...item }) => {
        if (isFunction(shouldShow) && !shouldShow()) {
          return acc;
        }
        // recursively filter pages
        const filteredPages = isArray(pages)
          ? self.filterVisibleSections(pages)
          : [];
        const result =
          filteredPages.length > 0 ? { ...item, pages: filteredPages } : item;
        acc.push(result);
        return acc;
      }, []);
    },
    getLink(item) {
      if (settings.linkCurrentPage || !self.isCurrentItem(item)) {
        return item?.url;
      }
      return;
    },
    isLinkItem(item) {
      return item.url && !self.isCurrentItem(item);
    },
    isExpandable() {
      return settings.useAccordion && !settings.expandAll;
    },
    isActiveItem(item) {
      if(settings.expandAll) {
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
    addTrailingSlash(url) {
      return (url.substr(-1) === '/')
        ? url
        : `${url}/`
      ;
    },
    isSameURL(url1 = '', url2 = '', startsWith = false) {
      if(startsWith) {
        return url2.startsWith(url1);
      }
      if(!url1 || !url2) {
        return false;
      }
      return self.addTrailingSlash(url1) == self.addTrailingSlash(url2);
    },
    isCurrentItem(item) {
      return self.isSameURL(item?.url, state.url.get(), item.matchSubPaths);
    },
    onPageChange() {
      state.url.set(window.location.pathname);
    },
    scrollToActive() {
      const el = $('.item.current').first().el();
      if(el) {
        const rect = el.getBoundingClientRect();
        const isVisible = (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= window.innerHeight &&
          rect.right <= window.innerWidth
        );
        if (!isVisible) {
          el.scrollIntoView();
        }
      }
    }
  };
};

const onRendered =  ({ self, isClient }) => {
  if(isClient) {
    self.scrollToActive();
  }
};

const events = {
  'click .title': ({target, settings, $}) => {
    if(!settings.useAccordion) {
      return;
    }
    const $title = $(target);
    const $content = $title.next('.content');
    $title.toggleClass('active');
    $content.toggleClass('active');
  },
  'click .nav-icon'({event}) {
    event.preventDefault();
  },
  'change ui-input'({state, value}) {
    state.search.set(value);
  }
};

const NavMenu = defineComponent({
  tagName: 'nav-menu',
  template,
  css,
  createComponent,
  defaultState,
  defaultSettings,
  onRendered,
  events,
});

export default NavMenu;
export { NavMenu };
