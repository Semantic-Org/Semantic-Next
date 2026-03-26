import {
  any,
  asyncEach,
  clone,
  each,
  findIndex,
  firstMatch,
  flatten,
  groupBy,
  isArray,
  isString,
  keys,
  sortBy,
  unique,
} from '@semantic-ui/utils';
import { getCollection } from 'astro:content';
import {
  sidebarMenuAPI,
  sidebarMenuBehaviors,
  sidebarMenuComponents,
  sidebarMenuCSS,
  sidebarMenuFramework,
  sidebarMenuPrimitives,
  sidebarMenuStart,
  standardMenuIcons,
  subCategorySortOrder,
  topbarDisplayMenu,
  topbarMenu,
} from './menus.js';

/* Used to sort lessons */
import semverCompare from 'semver/functions/compare';
import semverMajor from 'semver/functions/major';
import semverMinor from 'semver/functions/minor';
import semverPatch from 'semver/functions/patch';

const examples = await getCollection('examples');
const examplePages = examples
  .filter(doc => !doc?.data?.hidden)
  .map(doc => ({
    ...doc.data,
    url: `/examples/${doc.id}`,
  }));

export const getLessonContent = (lesson) => {
  return {
    id: lesson.id,
    title: lesson.data.title,
    category: lesson.data.category,
    subcategory: lesson.data.subcategory,
    url: `/learn/${lesson.id}`,
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
  .map(getLessonContent);
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
    const group = firstMatch(sidebarMenuFramework, group => group.name == category);
    if (group) {
      return group?.icon;
    }
  };

  each(categories, (examples, category) => {
    let subcategories = groupBy(examples, 'subcategory');
    let pages = [];
    if (keys(subcategories).length) {
      // has subcategories
      each(subcategories, (examples, subcategory) => {
        examples = sortBy(examples, ['sortIndex', 'title']);
        pages.push({
          name: subcategory,
          pages: examples.map(example => ({
            name: example.shortTitle || example.title,
            url: example.url,
          })),
        });
      });
    }
    else {
      // no subcategories
      pages = examples.map(example => ({
        name: example.shortTitle || example.title,
        url: example.url,
      }));
    }
    menu.push({
      name: category,
      icon: getCategoryIcon(category),
      pages,
    });
  });
  return menu.filter(menu => menu);
};
export const sidebarMenuExamples = createExampleMenu();

/* Create filtered example menus for each category */
export const createFilteredExampleMenu = (categoryFilter) => {
  const categorySection = sidebarMenuExamples.find(section => section.name === categoryFilter);
  if (!categorySection || !categorySection.pages) {
    return [];
  }

  // If the category has subcategories (pages with nested pages), return those subcategories as top-level sections
  if (categorySection.pages.length > 0 && categorySection.pages[0].pages) {
    const subcategories = categorySection.pages.map(subcategory => ({
      name: subcategory.name,
      pages: subcategory.pages,
    }));

    // Sort subcategories based on predefined order
    const sortOrder = subCategorySortOrder[categoryFilter] || [];
    const subcategoriesWithOrder = subcategories.map(subcategory => ({
      ...subcategory,
      sortIndex: sortOrder.indexOf(subcategory.name),
    }));

    const sorted = sortBy(subcategoriesWithOrder, 'sortIndex');

    return sorted.map(({ sortIndex, ...subcategory }) => subcategory);
  }

  // If no subcategories, return the pages directly as a single section
  return [{
    name: categorySection.name,
    pages: categorySection.pages,
  }];
};

/* Gets Sidebar Menu for Examples Section */
const createLearnMenu = () => {
  let menu = [];
  let categories = groupBy(lessonPages, 'major');
  each(categories, (lessons, majorVersion) => {
    let subcategories = groupBy(lessons, 'minor');
    let pages = [];
    if (keys(subcategories).length) {
      // has subcategories
      each(subcategories, (lessons, subcategory) => {
        pages.push({
          name: lessons[0].subcategory,
          pages: lessons.map(lesson => ({
            name: lesson.shortTitle || lesson.title,
            url: lesson.url,
          })),
        });
      });
    }
    else {
      // no subcategories
      pages = lessons.map(lesson => ({
        name: lesson.shortTitle || lesson.title,
        url: lesson.url,
      }));
    }
    menu.push({
      name: lessons[0].category,
      pages,
    });
  });
  return menu.filter(menu => menu);
};
export const sidebarMenuLearn = createLearnMenu();

/* Removes trailing slash which can cause issues between build and serve */
export const removeTrailingSlash = (url = '') => {
  return isString(url)
    ? url.replace(/\/$/, '')
    : url;
};

/* Gets active section from topbar display menu based on current URL */
export const getActiveTopbarSection = async (activeURL = '') => {
  activeURL = removeTrailingSlash(activeURL);
  const topbarMenuWithLinks = await getTopbarMenu();
  const isActive = (item) => {
    if (isArray(item.baseURLs) && any(item.baseURLs, baseURL => activeURL.startsWith(baseURL))) {
      return true;
    }
    if (item.baseURL && activeURL.startsWith(item.baseURL)) {
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
  if (sectionId === 'start') {
    menu = sidebarMenuStart;
  }
  else if (sectionId === 'css') {
    menu = sidebarMenuCSS;
  }
  else if (sectionId === 'primitives') {
    menu = sidebarMenuPrimitives;
  }
  else if (sectionId === 'components') {
    menu = sidebarMenuComponents;
  }
  else if (sectionId === 'behaviors') {
    menu = sidebarMenuBehaviors;
  }
  else if (sectionId === 'framework') {
    menu = sidebarMenuFramework;
  }
  else if (sectionId === 'api') {
    menu = sidebarMenuAPI;
  }
  else if (sectionId === 'learn') {
    menu = sidebarMenuLearn;
  }
  else if (sectionId === 'examples') {
    menu = sidebarMenuExamples;
  }
  else if (sectionId?.startsWith('examples-')) {
    // Extract category name from section ID by finding the original category
    const categorySlug = sectionId.replace('examples-', '');
    // Find the actual category name from examplePages that matches this slug
    const categoryName = examplePages.find(example => {
      const exampleSlug = example.category?.toLowerCase().replace(/\s+/g, '-');
      return exampleSlug === categorySlug;
    })?.category;

    if (categoryName) {
      menu = createFilteredExampleMenu(categoryName);
    }
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
          currentPath.startsWith(section.url)
          || isInSectionMenu(section._id, currentPath)
        );
      });
    }
    // For single sections, check if URL matches the section or its menu items
    return item._id && (
      currentPath.startsWith(item.url)
      || isInSectionMenu(item._id, currentPath)
    );
  });

  return activeSection;
};

/* Add standard icons based off nav menu in sidebar */
export const addStandardIcons = (items) => {
  return items.map(item => {
    if (item.label && !item.icon) {
      item.icon = standardMenuIcons[item.label];
    }
    return item;
  });
};

/* Gets items for the top-level navigation in sidebar above sidebar items  */
export const getSidebarNavMenu = (activeSection, currentPath) => {
  if (!activeSection) { return []; }
  currentPath = removeTrailingSlash(currentPath);

  if (activeSection._ids) {
    let items = activeSection._ids
      .map(id => {
        const section = firstMatch(topbarMenu, m => m._id === id);
        return section
          ? {
            label: section.name,
            href: section.url,
            icon: section.icon,
            active: currentPath.startsWith(section.url) || isInSectionMenu(section._id, currentPath),
          }
          : null;
      })
      .filter(Boolean);

    // Only show menu with more than one item
    if (items.length > 1) {
      items = addStandardIcons(items);
      return items;
    }
  }

  if (activeSection._id) {
    // Single sections don't need the Menu
    return [];
  }

  return [];
};

/* Get Sidebar Menu for a given Topbar Section */
export const getSidebarMenu = async ({ url, topbarSection }) => {
  let menu = [];
  if (url && !topbarSection) {
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
  if (topbarSection === 'primitives') {
    menu = sidebarMenuPrimitives;
  }
  else if (topbarSection === 'css') {
    menu = sidebarMenuCSS;
  }
  else if (topbarSection === 'components') {
    menu = sidebarMenuComponents;
  }
  else if (topbarSection === 'behaviors') {
    menu = sidebarMenuBehaviors;
  }
  else if (topbarSection === 'start') {
    menu = sidebarMenuStart;
  }
  else if (topbarSection === 'framework') {
    menu = sidebarMenuFramework;
  }
  else if (topbarSection === 'api') {
    menu = sidebarMenuAPI;
  }
  else if (topbarSection === 'examples') {
    menu = sidebarMenuExamples;
  }
  else if (topbarSection === 'learn') {
    menu = sidebarMenuLearn;
  }
  else if (topbarSection?.startsWith('examples-')) {
    // Extract category name from section ID by finding the original category
    const categorySlug = topbarSection.replace('examples-', '');
    // Find the actual category name from examplePages that matches this slug
    const categoryName = examplePages.find(example => {
      const exampleSlug = example.category?.toLowerCase().replace(/\s+/g, '-');
      return exampleSlug === categorySlug;
    })?.category;

    if (categoryName) {
      menu = createFilteredExampleMenu(categoryName);

      // Update the URL in topbarMenu to point to the first example
      const topbarItem = topbarMenu.find(item => item._id === topbarSection);
      if (topbarItem && menu.length > 0) {
        const firstSection = menu[0];
        if (firstSection.pages && firstSection.pages.length > 0) {
          const firstPage = firstSection.pages[0];
          if (firstPage.pages && firstPage.pages.length > 0) {
            // Has subcategories
            topbarItem.url = firstPage.pages[0].url;
          }
          else {
            // No subcategories
            topbarItem.url = firstPage.url;
          }
        }
      }
    }
  }
  return menu;
};

/* Adds links for prev/next page used at bottom of guide pages */
export const getPageTraversalLinks = async ({ url = '' }) => {
  url = url.replace(/\/$/, '');
  const menu = await await getFlattenedSidebarMenu({ url });
  const currentIndex = findIndex(menu, item => item.url == url);
  let next;
  let previous;
  if (currentIndex >= 0) {
    previous = menu[currentIndex - 1];
    if (currentIndex != menu.length - 1) {
      next = menu[currentIndex + 1];
    }
  }
  return {
    previous,
    next,
  };
};

/*
  Gets Entire Site Menu Deeply Nested
*/
export const getSiteMenu = async () => {
  let menu = await getTopbarDisplayMenu({ includeURLS: false });
  await asyncEach(menu, async item => {
    let menu = [];
    const ids = item._ids || [item._id];
    await asyncEach(ids, async (id) => {
      // get all urls that represent this topbar section
      const menuGroup = await getSidebarMenu({
        topbarSection: id,
      });
      menu = [
        ...menu,
        ...menuGroup,
      ];
    });
    item.menu = menu;
  });
  return menu;
};

/*
  Flattened Version of Sidebar Menu
*/
export const getFlattenedSidebarMenu = async ({ topbarSection, url, menu } = {}) => {
  if (!menu) {
    if (!topbarSection && url) {
      topbarSection = await getActiveTopbarSection(url);
    }
    menu = await getSidebarMenu({ topbarSection });
  }
  const menuArrays = menu.map(section => {
    const parentItem = { name: section.name, url: section.url };
    return [
      parentItem,
      ...(section.pages || []),
    ];
  });
  return flatten(menuArrays).filter(Boolean);
};

/*
  Topbar Menu for mobile and that includes secondary navs
*/
export const getTopbarMenu = async ({ includeURLS = true } = {}) => {
  const menu = clone(topbarMenu);
  if (includeURLS) {
    await asyncEach(menu, async item => {
      // get all urls that represent this topbar section
      const flattenedMenu = await getFlattenedSidebarMenu({
        topbarSection: item._id,
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
export const getTopbarDisplayMenu = async ({ includeURLS = true } = {}) => {
  const menu = clone(topbarDisplayMenu);
  if (includeURLS) {
    await asyncEach(menu, async item => {
      let urls = [];
      const ids = item._ids || [item._id];
      await asyncEach(ids, async (id) => {
        // get all urls that represent this topbar section
        const flattenedMenu = await getFlattenedSidebarMenu({
          topbarSection: id,
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
export const getRailMenu = (headings, pageTitle = null) => {
  let menu = [];
  let menuGroup;

  if (!headings.length) { return menu; }

  const headingLevels = unique(headings.map(heading => heading.depth)).sort();
  const lowestHeadingLevel = headingLevels[0];

  // If first heading is H3+ and we have a page title, inject it as H2 parent
  if (headings.length > 0 && headings[0].depth > 2 && pageTitle) {
    // Find consecutive H3+ headings at the start
    let consecutiveSubheadings = [];
    let i = 0;
    while (i < headings.length && headings[i].depth > 2) {
      consecutiveSubheadings.push(headings[i]);
      i++;
    }

    if (consecutiveSubheadings.length > 0) {
      // Create parent group with page title for the initial subheadings
      const pageGroup = {
        id: 'page-title',
        title: pageTitle,
        items: consecutiveSubheadings.map(heading => ({
          id: heading.slug,
          title: heading.text,
        })),
      };
      menu.push(pageGroup);

      // Process remaining headings with original logic
      const remainingHeadings = headings.slice(i);
      if (remainingHeadings.length > 0) {
        const remainingLevels = unique(remainingHeadings.map(h => h.depth)).sort();
        const remainingLowestLevel = remainingLevels[0];

        each(remainingHeadings, heading => {
          if (heading.depth == remainingLowestLevel) {
            if (menuGroup) {
              menu.push(menuGroup);
            }
            menuGroup = {
              id: heading.slug,
              title: heading.text,
              items: [],
            };
          }
          else if (menuGroup && remainingLevels[1] && heading.depth == remainingLevels[1]) {
            menuGroup.items.push({
              id: heading.slug,
              title: heading.text,
            });
          }
        });
        if (menuGroup) {
          menu.push(menuGroup);
        }
      }

      return menu.filter(Boolean);
    }
  }

  // Original logic for when first heading is H2 or when no page title provided
  each(headings, heading => {
    // new grouping
    if (heading.depth == lowestHeadingLevel) {
      if (menuGroup) {
        menu.push(menuGroup);
      }
      menuGroup = {
        id: heading.slug,
        title: heading.text,
        items: [],
      };
    }
    else if (menuGroup) {
      // only pay attention to 1 level deeper
      if (heading.depth == headingLevels[1]) {
        menuGroup.items.push({
          id: heading.slug,
          title: heading.text,
        });
      }
    }
  });
  menu.push(menuGroup);
  return menu.filter(Boolean);
};

const componentDocs = await getCollection('components');
export const primitivePages = componentDocs.map(page => ({
  name: page.data.title,
  image: page.data.image,
  description: page.data.description,
  meta: page.data,
  url: `/primitives/${page.id}`,
}));
