import { defineComponent } from '@semantic-ui/component';
import { Reaction } from '@semantic-ui/reactivity';
import { beforeEach, describe, expect, it } from 'vitest';

/*******************************
         Test Helpers
*******************************/

let tagCounter = 0;
function uniqueTag(prefix) {
  return `${prefix}-${++tagCounter}`;
}

function shadowText(el) {
  return el.shadowRoot.innerHTML.replace(/<!--[\s\S]*?-->/g, '').trim();
}

async function flush(el) {
  Reaction.flush();
  await el.updateComplete;
  await new Promise(r => setTimeout(r, 0));
}

/*******************************
        Test Suite
*******************************/

beforeEach(() => {
  document.body.innerHTML = '';
});

/*******************************
   1. Async inside Rerender
*******************************/

describe('1. Async inside Rerender', () => {
  it('should preserve async resolved content when rerender key changes', async () => {
    const tag = uniqueTag('async-rerender');
    defineComponent({
      tagName: tag,
      template: '{#rerender darkMode}{#async formatMessage as msg}<span>{msg}</span>{/async}{/rerender}',
      defaultState: { darkMode: false },
      createComponent: ({ state }) => ({
        async formatMessage(dark = state.darkMode.get()) {
          await new Promise(r => setTimeout(r, 50));
          return `dark=${dark}`;
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    await new Promise(r => setTimeout(r, 100));
    await flush(el);
    expect(shadowText(el)).toContain('dark=false');

    el.template.state.darkMode.set(true);
    await flush(el);

    // Should preserve old resolved content while new promise is pending
    expect(shadowText(el)).toContain('dark=false');

    await new Promise(r => setTimeout(r, 100));
    await flush(el);
    expect(shadowText(el)).toContain('dark=true');
  });
});

/*******************************
   2. Async Stale Promise
*******************************/

describe('2. Async stale promise', () => {
  it('should discard stale promise results and show only the latest', async () => {
    const tag = uniqueTag('async-stale');
    defineComponent({
      tagName: tag,
      template: '{#async fetchWithDelay as result}<span>{result}</span>{/async}',
      defaultState: { version: 0 },
      createComponent: ({ state }) => ({
        async fetchWithDelay(v = state.version.get()) {
          await new Promise(r => setTimeout(r, 200));
          return `v${v}`;
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    el.template.state.version.set(1);
    await flush(el);
    el.template.state.version.set(2);
    await flush(el);
    el.template.state.version.set(3);
    await flush(el);

    await new Promise(r => setTimeout(r, 350));
    await flush(el);

    const content = shadowText(el);
    expect(content).toContain('v3');
    expect(content).not.toContain('v1');
    expect(content).not.toContain('v2');
  });
});

/*******************************
   5. Each with Filter Toggle
*******************************/

describe('5. Each with filter toggle', () => {
  it('should update item list when filter signal changes', async () => {
    const tag = uniqueTag('each-filter');
    const allItems = [
      { name: 'Alpha', active: true },
      { name: 'Beta', active: false },
      { name: 'Gamma', active: true },
    ];
    defineComponent({
      tagName: tag,
      template: '{#each item in getFilteredItems}<span>{item.name}</span>{/each}',
      defaultState: { filterActive: false },
      createComponent: ({ state }) => ({
        getFilteredItems: () =>
          state.filterActive.get()
            ? allItems.filter(i => i.active)
            : allItems,
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('Alpha');
    expect(shadowText(el)).toContain('Beta');

    el.template.state.filterActive.set(true);
    await flush(el);

    expect(shadowText(el)).toContain('Alpha');
    expect(shadowText(el)).toContain('Gamma');
    expect(shadowText(el)).not.toContain('Beta');

    el.template.state.filterActive.set(false);
    await flush(el);

    expect(shadowText(el)).toContain('Beta');
  });
});

/*******************************
   7. Each Empty/Populated
*******************************/

describe('7. Each empty/populated transition', () => {
  it('should transition cleanly between populated and else branch', async () => {
    const tag = uniqueTag('each-empty');
    defineComponent({
      tagName: tag,
      template: '{#each item in getList}<span>{item.text}</span>{else}<span>empty</span>{/each}',
      defaultState: { populated: true },
      createComponent: ({ state }) => ({
        getList: () =>
          state.populated.get()
            ? [{ text: 'Apple' }, { text: 'Banana' }]
            : [],
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('Apple');
    expect(shadowText(el)).not.toContain('empty');

    el.template.state.populated.set(false);
    await flush(el);

    expect(shadowText(el)).toContain('empty');
    expect(shadowText(el)).not.toContain('Apple');

    el.template.state.populated.set(true);
    await flush(el);

    expect(shadowText(el)).toContain('Apple');
  });
});

/*******************************
   8. Conditional inside Each
*******************************/

describe('8. Conditional inside each', () => {
  it('should update conditional branches when item data changes', async () => {
    const tag = uniqueTag('cond-each');
    const items = [
      { name: 'Alpha', active: true },
      { name: 'Beta', active: false },
    ];
    defineComponent({
      tagName: tag,
      template:
        '{#each item in getItems}{#if item.active}<span>Y:{item.name}</span>{else}<span>N:{item.name}</span>{/if}{/each}',
      defaultState: { tick: 0 },
      createComponent: ({ state }) => ({
        getItems: () => {
          state.tick.get();
          return items;
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('Y:Alpha');
    expect(shadowText(el)).toContain('N:Beta');

    items[0].active = false;
    items[1].active = true;
    el.template.state.tick.increment();
    await flush(el);

    expect(shadowText(el)).toContain('N:Alpha');
    expect(shadowText(el)).toContain('Y:Beta');
  });
});

/*******************************
   9. External Signal in Each
*******************************/

describe('9. External signal controls conditionals in each', () => {
  it('should react to signal changes external to each data context', async () => {
    const tag = uniqueTag('ext-signal');
    defineComponent({
      tagName: tag,
      template: '{#each item in items}{#if isAbove item.level}[{item.name}]{else}({item.name}){/if}{/each}',
      defaultState: { threshold: 0 },
      createComponent: ({ state }) => ({
        items: [
          { name: 'Alpha', level: 1 },
          { name: 'Bravo', level: 2 },
        ],
        isAbove: (level) => state.threshold.get() >= level,
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('(Alpha)');
    expect(shadowText(el)).toContain('(Bravo)');

    el.template.state.threshold.set(1);
    await flush(el);

    expect(shadowText(el)).toContain('[Alpha]');
    expect(shadowText(el)).toContain('(Bravo)');

    el.template.state.threshold.set(2);
    await flush(el);

    expect(shadowText(el)).toContain('[Alpha]');
    expect(shadowText(el)).toContain('[Bravo]');
  });
});

/*******************************
   10. Nested Each with Filter
*******************************/

describe('10. Nested each with filter', () => {
  it('should update inner each items when outer data changes', async () => {
    const tag = uniqueTag('nested-each');
    const groups = [
      { name: 'A', entries: [{ name: 'Setup' }, { name: 'Select' }, { name: 'Start' }] },
      { name: 'B', entries: [{ name: 'Search' }, { name: 'Settings' }] },
    ];
    defineComponent({
      tagName: tag,
      template:
        '{#each group in getGroups}<div>{group.name}:{#each entry in group.entries}<span>{entry.name}</span>{/each}</div>{/each}',
      defaultState: { filtered: false },
      createComponent: ({ state }) => ({
        getGroups: () => {
          if (!state.filtered.get()) { return groups; }
          return groups.map(g => ({
            ...g,
            entries: g.entries.filter(e => e.name.toLowerCase().includes('se')),
          })).filter(g => g.entries.length > 0);
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('Setup');
    expect(shadowText(el)).toContain('Start');
    expect(shadowText(el)).toContain('Search');

    el.template.state.filtered.set(true);
    await flush(el);

    expect(shadowText(el)).toContain('Setup');
    expect(shadowText(el)).toContain('Search');
    expect(shadowText(el)).toContain('Settings');
    expect(shadowText(el)).not.toContain('Start');

    el.template.state.filtered.set(false);
    await flush(el);

    expect(shadowText(el)).toContain('Start');
  });
});

/*******************************
   12. Snippet Called Per Item
*******************************/

describe('12. Snippet called per item', () => {
  it('should render distinct content for each snippet invocation', async () => {
    const tag = uniqueTag('snippet-each');
    defineComponent({
      tagName: tag,
      template: '{#snippet badge}<b>{label}</b>{/snippet}{#each item in items}{>badge label=item.name}{/each}',
      createComponent: () => ({
        items: [{ name: 'Red' }, { name: 'Green' }, { name: 'Blue' }],
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    const content = shadowText(el);
    expect(content).toContain('Red');
    expect(content).toContain('Green');
    expect(content).toContain('Blue');
  });

  it('should update snippet content when reactive data changes', async () => {
    const tag = uniqueTag('snippet-reactive');
    defineComponent({
      tagName: tag,
      template: '{#snippet badge}<b>{label}</b>{/snippet}{#each item in getItems}{>badge label=item.name}{/each}',
      defaultState: { version: 0 },
      createComponent: ({ state }) => ({
        getItems: () => {
          const v = state.version.get();
          return v === 0
            ? [{ name: 'Red' }, { name: 'Green' }]
            : [{ name: 'Cyan' }, { name: 'Magenta' }];
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('Red');
    expect(shadowText(el)).toContain('Green');

    el.template.state.version.set(1);
    await flush(el);

    expect(shadowText(el)).toContain('Cyan');
    expect(shadowText(el)).toContain('Magenta');
    expect(shadowText(el)).not.toContain('Red');
    expect(shadowText(el)).not.toContain('Green');
  });
});

/*******************************
   13. Attribute-driven Re-render
*******************************/

describe('13. Attribute-driven re-render with async', () => {
  it('should preserve async content when a setting attribute changes', async () => {
    const tag = uniqueTag('attr-async');
    defineComponent({
      tagName: tag,
      template: '{#async formatLabel as result}<span>{result}</span>{/async}',
      defaultSettings: { label: 'initial' },
      createComponent: ({ settings }) => ({
        async formatLabel(lbl = settings.label) {
          await new Promise(r => setTimeout(r, 50));
          return `formatted:${lbl}`;
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    await new Promise(r => setTimeout(r, 100));
    await flush(el);

    expect(shadowText(el)).toContain('formatted:initial');

    // Change via attribute (the path from Problem 1)
    el.setAttribute('label', 'updated');
    await flush(el);

    // Should preserve old content, not flash empty
    expect(shadowText(el)).toContain('formatted:initial');

    await new Promise(r => setTimeout(r, 100));
    await flush(el);

    expect(shadowText(el)).toContain('formatted:updated');
  });
});

/*******************************
   14. Each Item Reorder
*******************************/

describe('14. Each item reorder', () => {
  it('should maintain correct data-to-DOM binding after reorder', async () => {
    const tag = uniqueTag('each-reorder');
    const orderedItems = [
      { id: 'a', name: 'Alpha', color: 'red' },
      { id: 'b', name: 'Beta', color: 'blue' },
      { id: 'c', name: 'Gamma', color: 'green' },
    ];
    defineComponent({
      tagName: tag,
      template: '{#each item in getItems}<span>{item.name}:{item.color}</span>{/each}',
      defaultState: { reversed: false },
      createComponent: ({ state }) => ({
        getItems: () =>
          state.reversed.get()
            ? [...orderedItems].reverse()
            : orderedItems,
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    const initial = shadowText(el);
    expect(initial).toContain('Alpha:red');
    expect(initial).toContain('Gamma:green');

    el.template.state.reversed.set(true);
    await flush(el);

    const reversed = shadowText(el);
    // Gamma should come first, Alpha last
    const gammaPos = reversed.indexOf('Gamma:green');
    const alphaPos = reversed.indexOf('Alpha:red');
    expect(gammaPos).toBeLessThan(alphaPos);

    // Colors must stay with their names
    expect(reversed).toContain('Alpha:red');
    expect(reversed).toContain('Beta:blue');
    expect(reversed).toContain('Gamma:green');
    expect(reversed).not.toContain('Alpha:green');
    expect(reversed).not.toContain('Gamma:red');
  });
});

/*******************************
   15. Non-reactive data in cached subtree
*******************************/

describe('15a. Non-reactive expressions in each', () => {
  it('should update plain object properties in cached each items', async () => {
    const tag = uniqueTag('nr-each');
    defineComponent({
      tagName: tag,
      template: '{#each item in getItems}<span>{item.name}:{item.status}</span>{/each}',
      defaultState: { version: 0 },
      createComponent: ({ state }) => ({
        getItems: () => {
          const v = state.version.get();
          return [
            { id: 'x', name: 'X', status: v === 0 ? 'pending' : 'done' },
            { id: 'y', name: 'Y', status: v === 0 ? 'pending' : 'done' },
          ];
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('X:pending');
    expect(shadowText(el)).toContain('Y:pending');

    el.template.state.version.set(1);
    await flush(el);

    expect(shadowText(el)).toContain('X:done');
    expect(shadowText(el)).toContain('Y:done');
    expect(shadowText(el)).not.toContain('pending');
  });
});

describe('15b. Non-reactive conditionals in each', () => {
  it('should update conditional branches based on plain data changes', async () => {
    const tag = uniqueTag('nr-cond');
    defineComponent({
      tagName: tag,
      template:
        '{#each item in getItems}{#if item.visible}<span>SHOW:{item.name}</span>{else}<span>HIDE:{item.name}</span>{/if}{/each}',
      defaultState: { version: 0 },
      createComponent: ({ state }) => ({
        getItems: () => {
          const v = state.version.get();
          return [
            { id: 'a', name: 'A', visible: v === 0 },
            { id: 'b', name: 'B', visible: v !== 0 },
          ];
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('SHOW:A');
    expect(shadowText(el)).toContain('HIDE:B');

    el.template.state.version.set(1);
    await flush(el);

    expect(shadowText(el)).toContain('HIDE:A');
    expect(shadowText(el)).toContain('SHOW:B');
  });
});

describe('15c. Non-reactive snippet data in each', () => {
  it('should update snippet content when plain data changes across renders', async () => {
    const tag = uniqueTag('nr-snippet');
    defineComponent({
      tagName: tag,
      template:
        '{#snippet tag}<span class="tag">[{label}]</span>{/snippet}{#each item in getItems}{>tag label=item.tag}{/each}',
      defaultState: { version: 0 },
      createComponent: ({ state }) => ({
        getItems: () => {
          const v = state.version.get();
          return [
            { id: 'a', tag: v === 0 ? 'old-A' : 'new-A' },
            { id: 'b', tag: v === 0 ? 'old-B' : 'new-B' },
          ];
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('[old-A]');
    expect(shadowText(el)).toContain('[old-B]');

    el.template.state.version.set(1);
    await flush(el);

    expect(shadowText(el)).toContain('[new-A]');
    expect(shadowText(el)).toContain('[new-B]');
    expect(shadowText(el)).not.toContain('old');
  });
});

describe('15c2. Snippet with multiple snippets and shared each', () => {
  it('should update snippet data when other snippets coexist in template', async () => {
    const tag = uniqueTag('nr-snippet-multi');
    defineComponent({
      tagName: tag,
      template: [
        '{#snippet badge}<b>{label}</b>{/snippet}',
        '{#snippet pill}<span>[{text}]</span>{/snippet}',
        '{#each item in getItems}',
        '  {>badge label=item.name}',
        '  {>pill text=item.status}',
        '{/each}',
      ].join(''),
      defaultState: { version: 0 },
      createComponent: ({ state }) => ({
        getItems: () => {
          const v = state.version.get();
          return [
            { id: 'x', name: v === 0 ? 'Alpha' : 'Changed', status: v === 0 ? 'pending' : 'done' },
            { id: 'y', name: v === 0 ? 'Beta' : 'Also Changed', status: v === 0 ? 'pending' : 'done' },
          ];
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('Alpha');
    expect(shadowText(el)).toContain('[pending]');
    expect(shadowText(el)).toContain('Beta');

    el.template.state.version.set(1);
    await flush(el);

    expect(shadowText(el)).toContain('Changed');
    expect(shadowText(el)).toContain('[done]');
    expect(shadowText(el)).toContain('Also Changed');
    expect(shadowText(el)).not.toContain('Alpha');
    expect(shadowText(el)).not.toContain('pending');
  });
});

describe('15c3. Same snippet called at multiple call sites', () => {
  it('should render distinct content for each call site after reactive update', async () => {
    const tag = uniqueTag('snippet-callsite');
    defineComponent({
      tagName: tag,
      template: [
        '{#snippet label}<span>[{text}]</span>{/snippet}',
        '{>label text=getTitle}',
        '{>label text=getSubtitle}',
      ].join(''),
      defaultState: { version: 0 },
      createComponent: ({ state }) => ({
        getTitle: () => state.version.get() === 0 ? 'Title-A' : 'Title-B',
        getSubtitle: () => state.version.get() === 0 ? 'Sub-A' : 'Sub-B',
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('[Title-A]');
    expect(shadowText(el)).toContain('[Sub-A]');

    el.template.state.version.set(1);
    await flush(el);

    // Both call sites must show their OWN updated content
    expect(shadowText(el)).toContain('[Title-B]');
    expect(shadowText(el)).toContain('[Sub-B]');
    // Must NOT show Title-B in both positions (collision would cause this)
    expect(shadowText(el)).not.toContain('[Title-A]');
    expect(shadowText(el)).not.toContain('[Sub-A]');
  });
});

describe('15d. Non-reactive data in rerender content', () => {
  it('should update plain expressions when rerender block re-fires', async () => {
    const tag = uniqueTag('nr-rerender');
    defineComponent({
      tagName: tag,
      template: '{#rerender tick}<span>{getLabel}</span>{/rerender}',
      defaultState: { tick: 0, label: 'initial' },
      createComponent: ({ state }) => ({
        getLabel: () => `${state.label.get()}:${state.tick.get()}`,
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('initial:0');

    const state = el.template.state;
    state.label.set('updated');
    state.tick.increment();
    await flush(el);

    expect(shadowText(el)).toContain('updated:1');
  });
});

/*******************************
   16. Subtemplate inside each — focus preservation
*******************************/

describe('16. Subtemplate inside each', () => {
  it('should not destroy subtemplate DOM when sibling item data changes', async () => {
    const tag = uniqueTag('sub-each');

    const itemTemplate = defineComponent({
      template: '<li><input class="toggle" type="checkbox" checked={todo.completed}><span>{todo.text}</span></li>',
    });

    defineComponent({
      tagName: tag,
      template: '{#each todo in getTodos}{>itemTemplate todo=todo}{/each}',
      defaultState: { version: 0 },
      createComponent: ({ state, signal }) => {
        const todos = signal([
          { _id: 'a', text: 'First', completed: false },
          { _id: 'b', text: 'Second', completed: false },
          { _id: 'c', text: 'Third', completed: false },
        ]);
        return {
          todos,
          getTodos() {
            state.version.get(); // track for reactivity
            return todos.get();
          },
          toggleItem(id) {
            todos.setProperty(id, 'completed', !todos.getItem(id).completed);
          },
        };
      },
      subTemplates: { itemTemplate },
    });

    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    const content = shadowText(el);
    expect(content).toContain('First');
    expect(content).toContain('Second');
    expect(content).toContain('Third');

    // Focus an input in the second item
    const inputs = el.shadowRoot.querySelectorAll('input.toggle');
    expect(inputs.length).toBe(3);
    inputs[1].focus();
    expect(document.activeElement === el || el.shadowRoot.activeElement === inputs[1]).toBe(true);

    // Toggle first item — should NOT destroy second item's DOM
    el.component.toggleItem('a');
    await flush(el);

    // Second item's input should still exist and be focusable
    const inputsAfter = el.shadowRoot.querySelectorAll('input.toggle');
    expect(inputsAfter.length).toBe(3);
    expect(shadowText(el)).toContain('Second');

    // The key test: focus should be preserved on the second input
    // If the subtemplate was destroyed and recreated, focus is lost
    const activeEl = el.shadowRoot.activeElement;
    expect(activeEl).toBe(inputsAfter[1]);
  });

  it('should preserve focus on the CHANGED item after toggle', async () => {
    const tag = uniqueTag('sub-focus-self');

    const itemTemplate = defineComponent({
      template: '<li><input class="toggle" type="checkbox" checked={todo.completed}><span>{todo.text}</span></li>',
    });

    defineComponent({
      tagName: tag,
      template: '{#each todo in getTodos}{>itemTemplate todo=todo}{/each}',
      createComponent: ({ signal }) => {
        const todos = signal([
          { _id: 'a', text: 'Alpha', completed: false },
          { _id: 'b', text: 'Beta', completed: false },
        ]);
        return {
          todos,
          getTodos: () => todos.get(),
          toggleItem(id) {
            todos.setProperty(id, 'completed', !todos.getItem(id).completed);
          },
        };
      },
      subTemplates: { itemTemplate },
    });

    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    // Focus the first item's checkbox
    const inputs = el.shadowRoot.querySelectorAll('input.toggle');
    inputs[0].focus();

    // Toggle the focused item
    el.component.toggleItem('a');
    await flush(el);

    // The first item's checkbox should still be focused
    const inputsAfter = el.shadowRoot.querySelectorAll('input.toggle');
    expect(inputsAfter.length).toBe(2);
    expect(el.shadowRoot.activeElement).toBe(inputsAfter[0]);
  });

  it('should update sibling subtemplate that reads shared state', async () => {
    const tag = uniqueTag('sub-shared-state');

    const itemTemplate = defineComponent({
      template: '<li>{todo.text}: {todo.completed ? "done" : "pending"}</li>',
    });

    const footerTemplate = defineComponent({
      template: '<footer>{getRemaining} items left</footer>',
    });

    defineComponent({
      tagName: tag,
      template: '{#each todo in getTodos}{>itemTemplate todo=todo}{/each}{>footerTemplate getRemaining=getRemaining}',
      createComponent: ({ signal }) => {
        const todos = signal([
          { _id: 'a', text: 'Alpha', completed: false },
          { _id: 'b', text: 'Beta', completed: false },
          { _id: 'c', text: 'Gamma', completed: false },
        ]);
        return {
          todos,
          getTodos: () => todos.get(),
          getRemaining: () => todos.get().filter(t => !t.completed).length,
          toggleItem(id) {
            todos.setProperty(id, 'completed', !todos.getItem(id).completed);
          },
        };
      },
      subTemplates: { itemTemplate, footerTemplate },
    });

    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('3 items left');

    // Toggle one item
    el.component.toggleItem('a');
    await flush(el);

    // Footer should update to reflect 2 remaining
    expect(shadowText(el)).toContain('2 items left');
    expect(shadowText(el)).not.toContain('3 items left');

    // Toggle another
    el.component.toggleItem('b');
    await flush(el);

    expect(shadowText(el)).toContain('1 items left');
  });
});

/*******************************
   17. Settings-driven conditional and ternary updates
*******************************/

describe('17. Settings-driven conditional and ternary', () => {
  it('should update {#if} branch when setting changes via proxy', async () => {
    const tag = uniqueTag('settings-if');
    defineComponent({
      tagName: tag,
      template: '{#if collapsed}SHOW{else}HIDE{/if}',
      defaultSettings: { collapsed: false },
      createComponent: ({ settings }) => ({
        toggle() {
          settings.collapsed = !settings.collapsed;
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('HIDE');

    el.component.toggle();
    await flush(el);

    expect(shadowText(el)).toContain('SHOW');
    expect(shadowText(el)).not.toContain('HIDE');

    el.component.toggle();
    await flush(el);

    expect(shadowText(el)).toContain('HIDE');
  });

  it('should update ternary expression when setting changes via proxy', async () => {
    const tag = uniqueTag('settings-ternary');
    defineComponent({
      tagName: tag,
      template: '<span>{collapsed ? "expanded" : "collapsed"}</span>',
      defaultSettings: { collapsed: false },
      createComponent: ({ settings }) => ({
        toggle() {
          settings.collapsed = !settings.collapsed;
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('collapsed');

    el.component.toggle();
    await flush(el);

    expect(shadowText(el)).toContain('expanded');
    expect(shadowText(el)).not.toContain('collapsed');
  });

  it('should update expressions inside conditional branches when setting changes', async () => {
    const tag = uniqueTag('settings-branch-content');
    defineComponent({
      tagName: tag,
      template: '{#if active}<span>{onLabel}</span>{else}<span>{offLabel}</span>{/if}',
      defaultSettings: { active: false, onLabel: 'ON', offLabel: 'OFF' },
      createComponent: ({ settings }) => ({
        toggle() {
          settings.active = !settings.active;
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('OFF');

    el.component.toggle();
    await flush(el);

    expect(shadowText(el)).toContain('ON');
    expect(shadowText(el)).not.toContain('OFF');
  });
});

/*******************************
   18. Subtemplate data context wins over parent settings
*******************************/

describe('18. Subtemplate data overrides parent setting', () => {
  it('should use subtemplate-provided value, not parent setting Signal', async () => {
    const tag = uniqueTag('sub-override');

    const child = defineComponent({
      template: '<span>{label}</span>',
    });

    defineComponent({
      tagName: tag,
      template: '{>child label=getOverride}',
      defaultSettings: { label: 'parent-setting' },
      createComponent: ({ state }) => ({
        getOverride: () => state.version.get() === 0 ? 'override-A' : 'override-B',
      }),
      defaultState: { version: 0 },
      subTemplates: { child },
    });

    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    // Subtemplate should show the override, NOT the parent setting
    expect(shadowText(el)).toContain('override-A');
    expect(shadowText(el)).not.toContain('parent-setting');

    el.template.state.version.set(1);
    await flush(el);

    expect(shadowText(el)).toContain('override-B');
    expect(shadowText(el)).not.toContain('override-A');
  });
});

/*******************************
   19. Subtemplate spurious re-evaluation inside each

   Pattern: detecting spurious re-evaluation in subtemplates
   ─────────────────────────────────────────────────────────
   To test whether a subtemplate's expressions re-fire, define a marker
   function in the subtemplate's own createComponent and call it from the
   template. This works because createComponent return values live on the
   template instance — they bypass the parent→child data packing layer
   (which resolves functions to their return values via wrapFunction).

     const child = defineComponent({
       template: '<span>{marker}{value}</span>',
       createComponent: ({ data }) => ({
         marker: () => { callLog.push(data.item._id); return ''; },
       }),
     });

   The marker expression becomes a reactiveData directive inside the
   subtemplate's own LitRenderer. It re-fires only when that renderer's
   dataVersion changes — making it a direct probe of whether the
   subtemplate actually re-evaluated, not just whether the parent
   considered re-rendering it.

   Do NOT pass spy functions through subtemplate data props (e.g.
   {>child spy=spy}). The packing mechanism calls wrapFunction(fn)()
   during unpacking, which invokes the function with no arguments and
   passes the return value instead of the function itself.
*******************************/

describe('19. Subtemplate isolation inside each', () => {
  it('should not re-evaluate unchanged item subtemplates when sibling item changes', async () => {
    const tag = uniqueTag('sub-spurious');
    let evaluatedIds = [];

    const itemTemplate = defineComponent({
      template: '<span>{markEvaluated}{todo.text}</span>',
      createComponent: ({ data }) => ({
        markEvaluated: () => {
          evaluatedIds.push(data.todo?._id);
          return '';
        },
      }),
    });

    defineComponent({
      tagName: tag,
      template: '{#each todo in getTodos}{>itemTemplate todo=todo}{/each}',
      createComponent: ({ signal }) => {
        const todos = signal([
          { _id: 'a', text: 'First', completed: false },
          { _id: 'b', text: 'Second', completed: false },
          { _id: 'c', text: 'Third', completed: false },
        ]);
        return {
          todos,
          getTodos: () => todos.get(),
          toggleItem(id) {
            todos.setProperty(id, 'completed', !todos.getItem(id).completed);
          },
        };
      },
      subTemplates: { itemTemplate },
    });

    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    // All 3 items should have evaluated initially
    expect(evaluatedIds).toContain('a');
    expect(evaluatedIds).toContain('b');
    expect(evaluatedIds).toContain('c');

    // Clear and toggle item A only
    evaluatedIds = [];
    el.component.toggleItem('a');
    await flush(el);

    // Unchanged items should NOT have re-evaluated
    expect(evaluatedIds).not.toContain('b');
    expect(evaluatedIds).not.toContain('c');
  });
});

/*******************************
   20. DOM node identity for unchanged items
*******************************/

describe('20. DOM node identity preservation', () => {
  it('should preserve DOM node references for unchanged items in each', async () => {
    const tag = uniqueTag('dom-identity');

    const itemTemplate = defineComponent({
      template: '<li><input class="toggle" type="checkbox"><span>{todo.text}</span></li>',
    });

    defineComponent({
      tagName: tag,
      template: '{#each todo in getTodos}{>itemTemplate todo=todo}{/each}',
      createComponent: ({ signal }) => {
        const todos = signal([
          { _id: 'a', text: 'First', completed: false },
          { _id: 'b', text: 'Second', completed: false },
          { _id: 'c', text: 'Third', completed: false },
        ]);
        return {
          todos,
          getTodos: () => todos.get(),
          toggleItem(id) {
            todos.setProperty(id, 'completed', !todos.getItem(id).completed);
          },
        };
      },
      subTemplates: { itemTemplate },
    });

    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    // Capture DOM node references before mutation
    const inputsBefore = el.shadowRoot.querySelectorAll('input.toggle');
    const secondInput = inputsBefore[1];
    const thirdInput = inputsBefore[2];
    expect(inputsBefore.length).toBe(3);

    // Mutate first item only
    el.component.toggleItem('a');
    await flush(el);

    const inputsAfter = el.shadowRoot.querySelectorAll('input.toggle');
    expect(inputsAfter.length).toBe(3);

    // Unchanged items should be the exact same DOM nodes
    expect(inputsAfter[1]).toBe(secondInput);
    expect(inputsAfter[2]).toBe(thirdInput);
  });
});

/*******************************
   21. Subtemplate internal state preservation
*******************************/

describe('21. Subtemplate internal state preservation', () => {
  it('should preserve subtemplate state when sibling item changes', async () => {
    const tag = uniqueTag('sub-internal-state');

    const itemTemplate = defineComponent({
      templateName: 'itemTemplate',
      template:
        '<li>{#if editing}<input class="edit" value={todo.text}>{else}<span class="view">{todo.text}</span>{/if}</li>',
      defaultState: { editing: false },
      createComponent: ({ state }) => ({
        startEditing() {
          state.editing.set(true);
        },
      }),
    });

    defineComponent({
      tagName: tag,
      template: '{#each todo in getTodos}{>itemTemplate todo=todo}{/each}',
      createComponent: ({ signal }) => {
        const todos = signal([
          { _id: 'a', text: 'First', completed: false },
          { _id: 'b', text: 'Second', completed: false },
        ]);
        return {
          todos,
          getTodos: () => todos.get(),
          toggleItem(id) {
            todos.setProperty(id, 'completed', !todos.getItem(id).completed);
          },
        };
      },
      subTemplates: { itemTemplate },
    });

    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    // No edit inputs initially
    expect(el.shadowRoot.querySelectorAll('input.edit').length).toBe(0);
    expect(el.shadowRoot.querySelectorAll('.view').length).toBe(2);

    // Start editing on item B via its subtemplate instance
    const children = el.template.findChildren('itemTemplate');
    children[1].startEditing();
    await flush(el);

    // Item B should now be in editing mode
    expect(el.shadowRoot.querySelectorAll('input.edit').length).toBe(1);

    // Toggle item A — should NOT reset item B's editing state
    el.component.toggleItem('a');
    await flush(el);

    // Item B should still be in editing mode
    expect(el.shadowRoot.querySelectorAll('input.edit').length).toBe(1);
    expect(el.shadowRoot.querySelectorAll('.view').length).toBe(1);
  });
});

/*******************************
   22. Rapid successive mutations
*******************************/

describe('22. Rapid successive mutations', () => {
  it('should handle rapid mutations to different items without losing updates', async () => {
    const tag = uniqueTag('rapid-mutate');

    const itemTemplate = defineComponent({
      template: '<span>{todo.text}:{todo.completed ? "done" : "pending"}</span>',
    });

    defineComponent({
      tagName: tag,
      template: '{#each todo in getTodos}{>itemTemplate todo=todo}{/each}',
      createComponent: ({ signal }) => {
        const todos = signal([
          { _id: 'a', text: 'First', completed: false },
          { _id: 'b', text: 'Second', completed: false },
          { _id: 'c', text: 'Third', completed: false },
        ]);
        return {
          todos,
          getTodos: () => todos.get(),
          toggleItem(id) {
            todos.setProperty(id, 'completed', !todos.getItem(id).completed);
          },
        };
      },
      subTemplates: { itemTemplate },
    });

    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('First:pending');
    expect(shadowText(el)).toContain('Second:pending');
    expect(shadowText(el)).toContain('Third:pending');

    // Toggle A and B before flushing
    el.component.toggleItem('a');
    el.component.toggleItem('b');
    await flush(el);

    expect(shadowText(el)).toContain('First:done');
    expect(shadowText(el)).toContain('Second:done');
    expect(shadowText(el)).toContain('Third:pending');
  });
});

/*******************************
   23. Subtemplate lifecycle callbacks
*******************************/

describe('23. Subtemplate lifecycle callbacks', () => {
  it('should not fire onRendered on data-only updates', async () => {
    let renderCount = 0;
    const tag = uniqueTag('sub-lifecycle');

    const itemTemplate = defineComponent({
      template: '<span>{todo.text}</span>',
      onRendered: () => {
        renderCount++;
      },
    });

    defineComponent({
      tagName: tag,
      template: '{#each todo in getTodos}{>itemTemplate todo=todo}{/each}',
      createComponent: ({ signal }) => {
        const todos = signal([
          { _id: 'a', text: 'First', completed: false },
          { _id: 'b', text: 'Second', completed: false },
        ]);
        return {
          todos,
          getTodos: () => todos.get(),
          toggleItem(id) {
            todos.setProperty(id, 'completed', !todos.getItem(id).completed);
          },
        };
      },
      subTemplates: { itemTemplate },
    });

    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;
    // onRendered fires in setTimeout — wait for it
    await new Promise(r => setTimeout(r, 10));

    const countAfterInitial = renderCount;
    expect(countAfterInitial).toBe(2); // one per item

    el.component.toggleItem('a');
    await flush(el);
    await new Promise(r => setTimeout(r, 10));

    // Data-only update should NOT re-trigger onRendered
    expect(renderCount).toBe(countAfterInitial);
  });

  it('should fire onDestroyed when item is removed from each', async () => {
    let destroyCount = 0;
    const tag = uniqueTag('sub-destroy');

    const itemTemplate = defineComponent({
      template: '<span>{todo.text}</span>',
      onDestroyed: () => {
        destroyCount++;
      },
    });

    defineComponent({
      tagName: tag,
      template: '{#each todo in getTodos}{>itemTemplate todo=todo}{/each}',
      createComponent: ({ signal }) => {
        const todos = signal([
          { _id: 'a', text: 'First' },
          { _id: 'b', text: 'Second' },
          { _id: 'c', text: 'Third' },
        ]);
        return {
          todos,
          getTodos: () => todos.get(),
          removeItem(id) {
            todos.removeItem(id);
          },
        };
      },
      subTemplates: { itemTemplate },
    });

    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('Second');

    el.component.removeItem('b');
    await flush(el);

    expect(shadowText(el)).not.toContain('Second');
    expect(shadowText(el)).toContain('First');
    expect(shadowText(el)).toContain('Third');
    // Removed item's subtemplate should fire onDestroyed
    expect(destroyCount).toBe(1);
  });
});

/*******************************
   24. Subtemplate using findParent for reactive data
*******************************/

describe('24. Subtemplate with findParent reactivity', () => {
  it('should update expression that reads parent signal via findParent', async () => {
    const tag = uniqueTag('sub-findparent');

    const footerTemplate = defineComponent({
      templateName: 'footerTemplate',
      template: '<footer>{getIncompleteCount} items left</footer>',
      createComponent: ({ self, findParent }) => ({
        getIncompleteCount() {
          const parent = findParent('todoList');
          return parent.todos.get().filter(t => !t.completed).length;
        },
      }),
    });

    const itemTemplate = defineComponent({
      template: '<li><input class="toggle" type="checkbox" checked={todo.completed}><span>{todo.text}</span></li>',
    });

    defineComponent({
      tagName: tag,
      templateName: 'todoList',
      template: '{#each todo in getTodos}{>itemTemplate todo=todo}{/each}{>footerTemplate}',
      createComponent: ({ signal }) => {
        const todos = signal([
          { _id: 'a', text: 'First', completed: false },
          { _id: 'b', text: 'Second', completed: false },
          { _id: 'c', text: 'Third', completed: false },
        ]);
        return {
          todos,
          getTodos: () => todos.get(),
          toggleItem(id) {
            todos.setProperty(id, 'completed', !todos.getItem(id).completed);
          },
        };
      },
      subTemplates: { itemTemplate, footerTemplate },
    });

    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('3 items left');

    // Toggle one item complete
    el.component.toggleItem('a');
    await flush(el);

    expect(shadowText(el)).toContain('2 items left');
    expect(shadowText(el)).not.toContain('3 items left');

    // Toggle another
    el.component.toggleItem('b');
    await flush(el);

    expect(shadowText(el)).toContain('1 items left');
  });
});

/*******************************
   25. Closure-captured data in subtemplate createComponent
*******************************/

describe('25. Closure-captured data in subtemplate', () => {
  it('should update classMap when data.todo.completed changes via setProperty', async () => {
    const tag = uniqueTag('sub-classmap');

    const itemTemplate = defineComponent({
      template: '<li class="{classMap getClasses} item"><span>{todo.text}</span></li>',
      createComponent: ({ data }) => ({
        getClasses() {
          return { completed: data.todo.completed };
        },
      }),
    });

    defineComponent({
      tagName: tag,
      template: '{#each todo in getTodos}{>itemTemplate todo=todo}{/each}',
      createComponent: ({ signal }) => {
        const todos = signal([
          { _id: 'a', text: 'First', completed: false },
          { _id: 'b', text: 'Second', completed: false },
        ]);
        return {
          todos,
          getTodos: () => todos.get(),
          toggleItem(id) {
            todos.setProperty(id, 'completed', !todos.getItem(id).completed);
          },
        };
      },
      subTemplates: { itemTemplate },
    });

    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    // Initial: no completed class
    const li = el.shadowRoot.querySelector('li');
    expect(li.className).toContain('item');
    expect(li.className).not.toContain('completed');

    // Toggle first item complete
    el.component.toggleItem('a');
    await flush(el);

    const liAfter = el.shadowRoot.querySelector('li');
    expect(liAfter.className).toContain('completed');

    // Toggle back to incomplete
    el.component.toggleItem('a');
    await flush(el);

    const liAfter2 = el.shadowRoot.querySelector('li');
    expect(liAfter2.className).not.toContain('completed');
  });
});

/*******************************
   26. Subtemplate settings — reactive external data
*******************************/

describe('26. Subtemplate settings', () => {
  it('should reactively update classMap via settings.todo when parent data changes', async () => {
    const tag = uniqueTag('sub-settings');

    const itemTemplate = defineComponent({
      defaultSettings: { todo: null },
      template: '<li class="{classMap getClasses} item"><span>{todo.text}</span></li>',
      createComponent: ({ settings }) => ({
        getClasses() {
          return { completed: settings.todo.completed };
        },
      }),
    });

    defineComponent({
      tagName: tag,
      template: '{#each todo in getTodos}{>itemTemplate todo=todo}{/each}',
      createComponent: ({ signal }) => {
        const todos = signal([
          { _id: 'a', text: 'First', completed: false },
          { _id: 'b', text: 'Second', completed: false },
        ]);
        return {
          todos,
          getTodos: () => todos.get(),
          toggleItem(id) {
            todos.setProperty(id, 'completed', !todos.getItem(id).completed);
          },
        };
      },
      subTemplates: { itemTemplate },
    });

    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    const li = el.shadowRoot.querySelector('li');
    expect(li.className).toContain('item');
    expect(li.className).not.toContain('completed');

    // Toggle complete
    el.component.toggleItem('a');
    await flush(el);

    expect(el.shadowRoot.querySelector('li').className).toContain('completed');

    // Toggle back — the specific failure case with stale data
    el.component.toggleItem('a');
    await flush(el);

    expect(el.shadowRoot.querySelector('li').className).not.toContain('completed');

    // Third toggle to confirm stable cycling
    el.component.toggleItem('a');
    await flush(el);

    expect(el.shadowRoot.querySelector('li').className).toContain('completed');
  });

  it('should use default value when parent does not pass a setting', async () => {
    const tag = uniqueTag('sub-defaults');

    const child = defineComponent({
      defaultSettings: { label: 'default-label', showIcon: true },
      template: '<span>{label}:{showIcon ? "icon" : "no-icon"}</span>',
    });

    defineComponent({
      tagName: tag,
      template: '{>child label=getMessage}',
      defaultState: { version: 0 },
      createComponent: ({ state }) => ({
        getMessage: () => `v${state.version.get()}`,
      }),
      subTemplates: { child },
    });

    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    // label is passed, showIcon uses default
    expect(shadowText(el)).toContain('v0');
    expect(shadowText(el)).toContain('icon');

    el.template.state.version.set(1);
    await flush(el);

    // label updates reactively, showIcon still default
    expect(shadowText(el)).toContain('v1');
    expect(shadowText(el)).toContain('icon');
  });

  it('should merge own settings with parent web component settings', async () => {
    const tag = uniqueTag('sub-merged');

    const child = defineComponent({
      defaultSettings: { itemData: null },
      template: '<span>{itemData.name}:{parentLabel}</span>',
      createComponent: ({ settings }) => ({
        // Access own setting
        getItemName: () => settings.itemData?.name,
        // Access parent WC setting via fallback
        getParentLabel: () => settings.parentLabel,
      }),
    });

    defineComponent({
      tagName: tag,
      defaultSettings: { parentLabel: 'from-parent' },
      template: '{>child itemData=getItem}',
      defaultState: { version: 0 },
      createComponent: ({ state }) => ({
        getItem: () => ({ name: state.version.get() === 0 ? 'Alpha' : 'Beta' }),
      }),
      subTemplates: { child },
    });

    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    // Own setting from passed data + parent WC setting via fallback
    expect(shadowText(el)).toContain('Alpha');
    expect(shadowText(el)).toContain('from-parent');

    el.template.state.version.set(1);
    await flush(el);

    expect(shadowText(el)).toContain('Beta');
    expect(shadowText(el)).toContain('from-parent');
  });

  it('should overlay settings signals into data context for template expressions', async () => {
    const tag = uniqueTag('sub-overlay');

    const child = defineComponent({
      defaultSettings: { count: 0 },
      template: '<span>{count} items</span>',
    });

    defineComponent({
      tagName: tag,
      template: '{>child count=getCount}',
      defaultState: { version: 0 },
      createComponent: ({ state }) => ({
        getCount: () => state.version.get() * 10,
      }),
      subTemplates: { child },
    });

    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('0 items');

    el.template.state.version.set(1);
    await flush(el);

    expect(shadowText(el)).toContain('10 items');

    el.template.state.version.set(3);
    await flush(el);

    expect(shadowText(el)).toContain('30 items');
  });

  it('should not break naive subtemplates without defaultSettings', async () => {
    // Regression guard: subtemplates that don't declare defaultSettings
    // should continue to work exactly as before
    const tag = uniqueTag('sub-naive-guard');

    const row = defineComponent({
      template: '<span>{name}:{status}</span>',
    });

    defineComponent({
      tagName: tag,
      template: '{#each item in getItems}{>row name=item.name status=item.status}{/each}',
      defaultState: { version: 0 },
      createComponent: ({ state }) => ({
        getItems: () => {
          const v = state.version.get();
          return [
            { name: 'A', status: v === 0 ? 'pending' : 'done' },
            { name: 'B', status: v === 0 ? 'waiting' : 'complete' },
          ];
        },
      }),
      subTemplates: { row },
    });

    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('A:pending');
    expect(shadowText(el)).toContain('B:waiting');

    el.template.state.version.set(1);
    await flush(el);

    expect(shadowText(el)).toContain('A:done');
    expect(shadowText(el)).toContain('B:complete');
  });
});
