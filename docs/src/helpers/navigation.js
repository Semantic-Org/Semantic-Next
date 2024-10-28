import { getCollection } from 'astro:content';
import { topbarMenu, sidebarMenuUI, sidebarMenuFramework, sidebarMenuAPI } from './menus.js';
import { firstMatch, groupBy, asyncEach, each, flatten, keys, isArray, clone, isString, any, sortBy, unique } from '@semantic-ui/utils';

/* Used to sort lessons */
import semverMajor from 'semver/functions/major';
import semverMinor from 'semver/functions/minor';
import semverPatch from 'semver/functions/patch';
import semverCompare from 'semver/functions/compare';

const examples = await getCollection('examples');
const examplePages = examples.map(doc => ({
  ...doc.data,
  url: `/examples/${doc.slug}`,
}));

const lessons = await getCollection('lessons');
const lessonDocs = lessons.map((lesson) => {
  return {
    ...lesson.data,
    url: `/learn/${lesson.slug}`,
    sort: lesson.data.sort,
    hint: lesson.data.hint,
    category: lesson.data.category,
    subcategory: lesson.data.subcategory,
    major: semverMajor(lesson.data.sort),
    minor: semverMinor(lesson.data.sort),
    patch: semverPatch(lesson.data.sort),
  };
});
const lessonPages = lessonDocs.sort((a, b) => {
  return semverCompare(a.sort, b.sort);
});



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
          pages: lessons.map(example => ({
            name: example.shortTitle || example.title,
            url: example.url
          }))
        });
      });
    }
    else {
      // no subcategories
      pages = lessons.map(example => ({
        name: example.shortTitle || example.title,
        url: example.url
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

/* Gets currently active topbar menu from url */
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


/* Get Sidebar Menu for a given Topbar Section */
export const getSidebarMenu = async ({url, topbarSection}) => {
  let menu = [];
  if(url && !topbarSection) {
    topbarSection = await getActiveTopbarSection(url);
  }
  if(topbarSection == 'ui') {
    menu = sidebarMenuUI;
  }
  else if(topbarSection == 'framework') {
    menu = sidebarMenuFramework;
  }
  else if(topbarSection == 'api') {
    menu = sidebarMenuAPI;
  }
  else if(topbarSection == 'examples') {
    menu = sidebarMenuExamples;
  }
  else if(topbarSection == 'learn') {
    menu = sidebarMenuLearn;
  }
  return menu;
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
export const getFlattenedSidebarMenu = async (topbarSection) => {
  const menu = await getSidebarMenu({ topbarSection: topbarSection });
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
  Topbar Menu
*/
export const getTopbarMenu = async ({ includeURLS = true} = {}) => {
  const menu = clone(topbarMenu);
  if(includeURLS) {
    await asyncEach(menu, async item => {
      // get all urls that represent this topbar section
      const flattenedMenu = await getFlattenedSidebarMenu(item._id);
      const urls = flattenedMenu.map(page => page.url).filter(Boolean);
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

