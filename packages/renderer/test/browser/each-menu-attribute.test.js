import { defineComponent } from '@semantic-ui/component';
import { beforeEach, describe, expect, it } from 'vitest';
import { waitForUpdate } from './test-utils.js';

/*
  Integration shape from mobile-menu → nav-menu: parent state holds
  { header, menu }, the child receives the array through a serialized
  attribute binding and eaches over it with nested pages sublists.
  Menu items carry no id fields, so records key positionally and
  navigation reuses them across unrelated menus — dropped fields
  (like `pages`) must clear on the reused records.
*/

describe('native — menu passed by attribute to child each', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('swaps nested menu content when parent navigation replaces the menu', async () => {
    const childTag = 'test-menu-child-a';
    const parentTag = 'test-menu-parent-a';

    defineComponent({
      tagName: childTag,
      template:
        '<ul>{#each item in getItems}<li>{item.name}{#if item.pages}<span>{#each page in item.pages}<i>{page.name}</i>{/each}</span>{/if}</li>{/each}</ul>',
      defaultSettings: { menu: [] },
      createComponent: ({ settings }) => ({
        getItems() {
          let menu = settings.menu;
          if (typeof menu === 'string') {
            try {
              menu = JSON.parse(menu);
            }
            catch {
              menu = [];
            }
          }
          return menu || [];
        },
      }),
    });

    defineComponent({
      tagName: parentTag,
      template: `<${childTag} menu={activeMenu.menu}></${childTag}>`,
      defaultState: {
        activeMenu: {
          header: 'Docs',
          menu: [
            {
              name: 'Overview',
              url: '/overview',
              pages: [{ name: 'Creating', url: '/creating' }, { name: 'Lifecycle', url: '/lifecycle' }],
            },
            { name: 'Components', url: '/components', pages: [{ name: 'Settings', url: '/settings' }] },
          ],
        },
      },
    });

    const parent = document.createElement(parentTag);
    document.body.appendChild(parent);
    await parent.rendered;

    const child = parent.shadowRoot.querySelector(childTag);
    await child.rendered;
    const listText = () => Array.from(child.shadowRoot.querySelectorAll('li')).map((n) => n.textContent);
    expect(listText()).toEqual(['OverviewCreatingLifecycle', 'ComponentsSettings']);

    // navigate back to the root menu — flat items, no pages
    parent.template.state.activeMenu.set({
      header: undefined,
      menu: [
        { name: 'UI Framework', url: '/' },
        { name: 'Docs', url: '/docs', menu: [], navIcon: 'right-chevron' },
        { name: 'Learn', url: '/learn', menu: [], navIcon: 'right-chevron' },
      ],
    });
    await waitForUpdate(parent);
    await waitForUpdate(child);
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(listText()).toEqual(['UI Framework', 'Docs', 'Learn']);
    expect(child.shadowRoot.querySelectorAll('i').length).toBe(0);
  });
});
