import { getCollection } from 'astro:content';
import { topbarMenu, topbarDisplayMenu, sidebarMenuUI, sidebarMenuFramework, sidebarMenuAPI } from './menus.js';
import { firstMatch, groupBy, asyncEach, each, findIndex, flatten, keys, isArray, clone, isString, any, unique } from '@semantic-ui/utils';

/* Used to sort lessons */
import semverMajor from 'semver/functions/major';
import semverMinor from 'semver/functions/minor';
import semverPatch from 'semver/functions/patch';
import semverCompare from 'semver/functions/compare';

const examples = await getCollection('examples');
const examplePages = examples
  .filter(doc => !doc?.data?.hidden)
  .map(doc => ({
    ...doc.data,
    url: `/examples/${doc.slug}`,
  }))
;

export const getLessonContent = (lesson) => {
  return {
    id: lesson.slug,
    title: lesson.data.title,
    category: lesson.data.category,
    subcategory: lesson.data.subcategory,
    url: `/learn/${lesson.slug}`,
    hidden: lesson.data.hidden,
    sort: lesson.data.sort,
    hint: lesson.data.hint,
    references: lesson.data.references,
    shortTitle: lesson.data.shortTitle,
    selectedFile: lesson.data.selectedFile,
    major: semverMajor(lesson.data.sort),
    minor: semverMinor(lesson.data.sort),
    patch: semverPatch(lesson.data.sort),
    hideNavigation: lesson.data.hideNavigation,
  };
};

const lessons = await getCollection('lessons');
const lessonDocs = lessons
  .filter(doc => !doc?.data?.hidden)
  .map(getLessonContent)
;
export const lessonPages = lessonDocs.sort((a, b) => {
  return semverCompare(a.sort, b.sort);
});


export const getNextLesson = (currentLesson) => {
  const lessonIndex = findIndex(lessonPages, lesson => lesson.id == currentLesson.id);
  const previousLesson = (lessonIndex > -1) ? lessonPages[lessonIndex + 1] : {};
  return previousLesson;
};

export const getPreviousLesson = (currentLesson) => {
  const lessonIndex = findIndex(lessonPages, lesson => lesson.id == currentLesson.id);
  const nextLesson = (lessonIndex > -1) ? lessonPages[lessonIndex - 1] : {};
  return nextLesson;
};

/* Gets Sidebar Menu for Examples Section */
const createExampleMenu = () => {
  const categories = groupBy(examplePages, 'category');
  let menu = [];

  const getCategoryIcon = (category) => {
    const group = firstMatch(sidebarMenuFramework, (group => group.name == category));
    if(group) {
      return group?.icon;
    }
  };

  each(categories, (examples, category) => {
    let subcategories = groupBy(examples, 'subcategory');
    let pages = [];
    if(keys(subcategories).length) {
      // has subcategories
      each(subcategories, (examples, subcategory) => {
        pages.push({
          name: subcategory,
          pages: examples.map(example => ({
            name: example.shortTitle || example.title,
            url: example.url
          }))
        });
      });
    }
    else {
      // no subcategories
      pages = examples.map(example => ({
        name: example.shortTitle || example.title,
        url: example.url
      }));
    }
    menu.push({
      name: category,
      icon: getCategoryIcon(category),
      pages
    });
  });
  return menu.filter(menu => menu);
};
export const sidebarMenuExamples = createExampleMenu();


/* Gets Sidebar Menu for Examples Section */
const createLearnMenu = () => {
  let menu = [];
  let categories = groupBy(lessonPages, 'major');
  each(categories, (lessons, majorVersion) => {
    let subcategories = groupBy(lessons, 'minor');
    let pages = [];
    if(keys(subcategories).length) {
      // has subcategories
      each(subcategories, (lessons, subcategory) => {
        pages.push({
          name: lessons[0].subcategory,
          pages: lessons.map(lesson => ({
            name: lesson.shortTitle || lesson.title,
            url: lesson.url
          }))
        });
      });
    }
    else {
      // no subcategories
      pages = lessons.map(lesson => ({
        name: lesson.shortTitle || lesson.title,
        url: lesson.url
      }));
    }
    menu.push({
      name: lessons[0].category,
      pages
    });
  });
  return menu.filter(menu => menu);
};
export const sidebarMenuLearn = createLearnMenu();

/* Removes trailing slash which can cause issues between build and serve */
export const removeTrailingSlash = (url = '') => {
  return isString(url)
    ? url.replace(/\/$/, '')
    : url
  ;
};

/* Gets active section from topbar display menu based on current URL */
export const getActiveTopbarSection = async (activeURL = '') => {
  activeURL = removeTrailingSlash(activeURL);
  const topbarMenuWithLinks = await getTopbarMenu();
  const isActive = (item) => {
    if(isArray(item.baseURLs) && any(item.baseURLs, baseURL => activeURL.startsWith(baseURL))) {
      return true;
    }
    if(item.baseURL && activeURL.startsWith(item.baseURL)) {
      return true;
    }
    if (item?.url === activeURL) {
      return true;
    }
    return false;
  };
  const activeItem = firstMatch(topbarMenuWithLinks, isActive);
  return activeItem?._id;
};

/* Helper to check if a URL belongs to a section's menu */
const isInSectionMenu = (sectionId, currentPath) => {
  let menu = [];
  if (sectionId === 'ui') {
    menu = sidebarMenuUI;
  }
  else if (sectionId === 'framework') {
    menu = sidebarMenuFramework;
  }
  else if (sectionId === 'api') {
    menu = sidebarMenuAPI;
  }
  else if (sectionId === 'examples') {
    menu = sidebarMenuExamples;
  }
  else if (sectionId === 'learn') {
    menu = sidebarMenuLearn;
  }

  // Check if current path matches any URL in the menu or its nested pages
  return any(menu, section => {
    if (currentPath.startsWith(section.url)) {
      return true;
    }
    // Check nested pages
    if (section.pages) {
      return any(section.pages, page => {
        if (isArray(page.pages)) {
          // Handle subcategories
          return any(page.pages, subpage => currentPath.startsWith(subpage.url));
        }
        return currentPath.startsWith(page.url);
      });
    }
    return false;
  });
};

/* Gets active display section and its items for the sidebar */
export const getActiveSidebarSection = (currentPath) => {
  currentPath = removeTrailingSlash(currentPath);

  const activeSection = firstMatch(topbarDisplayMenu, item => {
    if (item._ids) {
      // For grouped sections, check if URL matches any of the sections or their menu items
      return any(item._ids, id => {
        const section = firstMatch(topbarMenu, m => m._id === id);
        return section && (
          currentPath.startsWith(section.url) || 
          isInSectionMenu(section._id, currentPath)
        );
      });
    }
    // For single sections, check if URL matches the section or its menu items
    return item._id && (
      currentPath.startsWith(item.url) || 
      isInSectionMenu(item._id, currentPath)
    );
  });

  return activeSection;
};

/* Generates sidebar items based on active section */
export const getSidebarItems = (activeSection, currentPath) => {
  if (!activeSection) return [];
  currentPath = removeTrailingSlash(currentPath);

  if (activeSection._ids) {
    const items = activeSection._ids
      .map(id => {
        const section = firstMatch(topbarMenu, m => m._id === id);
        return section ? {
          label: section.name,
          href: section.url,
          active: currentPath.startsWith(section.url) || isInSectionMenu(section._id, currentPath)
        } : null;
      })
      .filter(Boolean);
    
    // Don't show UIMenu if there's only one item
    return items.length <= 1 ? [] : items;
  }

  if (activeSection._id) {
    // Single sections don't need the UIMenu
    return [];
  }

  return [];
};

/* Get Sidebar Menu for a given Topbar Section */
export const getSidebarMenu = async ({url, topbarSection}) => {
  let menu = [];
  if(url && !topbarSection) {
    topbarSection = await getActiveTopbarSection(url);
  }
  // Handle both direct section matches and sections that are part of _ids groups
  const section = firstMatch(topbarDisplayMenu, item => {
    if (item._ids && item._ids.includes(topbarSection)) {
      return true;
    }
    return item._id === topbarSection;
  });

  // If section is part of a group (like Documentation), get the appropriate menu
  if (section?._ids) {
    if (topbarSection === 'ui') {
      menu = sidebarMenuUI;
    }
    else if (topbarSection === 'framework') {
      menu = sidebarMenuFramework;
    }
    else if (topbarSection === 'api') {
      menu = sidebarMenuAPI;
    }
  } else {
    // Handle individual sections
    if (topbarSection === 'examples') {
      menu = sidebarMenuExamples;
    }
    else if (topbarSection === 'learn') {
      menu = sidebarMenuLearn;
    }
  }
  return menu;
};


/* Adds links for prev/next page used at bottom of guide pages */
export const getPageTraversalLinks = async ({url}) => {
  const menu = await await getFlattenedSidebarMenu({ url });
  const currentIndex = findIndex(menu, item => item.url == url);

  let next;
  let previous;
  if(currentIndex >= 0) {
    previous = menu[currentIndex - 1];
    if(currentIndex != menu.length - 1) {
      next = menu[currentIndex + 1];
    }
  }
  return {
    previous,
    next
  };
};

/*
  Gets Entire Site Menu Deeply Nested
*/
export const getSiteMenu = async () => {
  let menu = await getTopbarMenu({ includeURLS: false });
  await asyncEach(menu, async item => {
    item.menu = await getSidebarMenu({ topbarSection: item._id });
  });
  return menu;
};

/*
  Flattened Version of Sidebar Menu
*/
export const getFlattenedSidebarMenu = async ({topbarSection, url, menu } = {}) => {
  if(!menu) {
    if(!topbarSection && url) {
      topbarSection = await getActiveTopbarSection(url);
    }
    menu = await getSidebarMenu({ topbarSection });
  }
  const menuArrays = menu.map(section => {
    const parentItem = { name: section.name, url: section.url };
    return [
      parentItem,
      ...(section.pages || [])
    ];
  });
  return flatten(menuArrays).filter(Boolean);
};

/*
  Topbar Menu for mobile and that includes secondary navs
*/
export const getTopbarMenu = async ({ includeURLS = true} = {}) => {
  const menu = clone(topbarMenu);
  if(includeURLS) {
    await asyncEach(menu, async item => {
      // get all urls that represent this topbar section
      const flattenedMenu = await getFlattenedSidebarMenu({
        topbarSection: item._id
      });
      const urls = flattenedMenu.map(page => page.url).filter(Boolean);
      item.baseURLs = urls;
    });
  }
  return menu;
};


/*
  Topbar Menu that displays to users
*/
export const getTopbarDisplayMenu = async ({ includeURLS = true} = {}) => {
  const menu = clone(topbarDisplayMenu);
  if(includeURLS) {
    await asyncEach(menu, async item => {
      let urls = [];
      const ids = item._ids || [item._id];
      await asyncEach(ids, async (id) => {
        // get all urls that represent this topbar section
        const flattenedMenu = await getFlattenedSidebarMenu({
          topbarSection: id
        });
        const idURLs = flattenedMenu.map(page => page.url).filter(Boolean);
        urls.push(...idURLs);
      });
      item.baseURLs = urls;
    });
  }
  return menu;
};


/*
  Gets In Page Menu
  showing links to each header
*/
export const getRailMenu = (headings) => {
  let menu = [];
  let menuGroup;

  const headingLevels = unique(headings.map(heading => heading.depth)).sort();
  const lowestHeadingLevel = headingLevels[0];

  each(headings, heading => {
    // new grouping
    if(heading.depth == lowestHeadingLevel) {
      if(menuGroup) {
        menu.push(menuGroup);
      }
      menuGroup = {
        id: heading.slug,
        title: heading.text,
        items: []
      };
    }
    else if(menuGroup) {
      // only pay attention to 1 level deeper
      if(heading.depth == headingLevels[1]) {
        menuGroup.items.push({
          id: heading.slug,
          title: heading.text
        });
      }
    }
  });
  menu.push(menuGroup);
  return menu.filter(Boolean);
};



const componentDocs = await getCollection('components');
export const componentPages = componentDocs.map(page => ({
  name: page.data.title,
  image: page.data.image,
  description: page.data.description,
  meta: page.data,
  url: `/ui/${page.slug}`,
}));
