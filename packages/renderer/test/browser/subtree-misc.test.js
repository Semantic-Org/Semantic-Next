import { defineComponent } from '@semantic-ui/component';
import { beforeEach, describe, expect, it } from 'vitest';

/*******************************
         Test Helpers
*******************************/

let tagCounter = 0;
function uniqueTag() {
  return `test-misc-${++tagCounter}`;
}

function shadowText(el) {
  return el.shadowRoot.innerHTML.replace(/<!--[\s\S]*?-->/g, '').trim();
}

async function waitForUpdate(el) {
  await el.updateComplete;
  await new Promise(r => setTimeout(r, 0));
  await el.updateComplete;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

/*******************************
   Conditional → Each → Expression
*******************************/

describe('if → each → expression', () => {
  it('should update each items inside a conditional when reactive data changes', async () => {
    const tag = uniqueTag();
    defineComponent({
      tagName: tag,
      template: '{#if showList}{#each item in getItems}<span>{item.name}</span>{/each}{/if}',
      defaultState: { showList: true, version: 0 },
      createComponent: ({ state }) => ({
        getItems: () => {
          const v = state.version.get();
          return v === 0
            ? [{ name: 'Alpha' }, { name: 'Beta' }]
            : [{ name: 'Gamma' }, { name: 'Delta' }];
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('Alpha');
    expect(shadowText(el)).toContain('Beta');

    el.template.state.version.set(1);
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('Gamma');
    expect(shadowText(el)).toContain('Delta');
    expect(shadowText(el)).not.toContain('Alpha');
  });

  it('should show/hide each block when conditional toggles', async () => {
    const tag = uniqueTag();
    defineComponent({
      tagName: tag,
      template: '{#if showList}{#each item in items}<span>{item.name}</span>{/each}{else}<span>hidden</span>{/if}',
      defaultState: { showList: true },
      createComponent: () => ({
        items: [{ name: 'One' }, { name: 'Two' }],
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('One');
    expect(shadowText(el)).toContain('Two');
    expect(shadowText(el)).not.toContain('hidden');

    el.template.state.showList.set(false);
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('hidden');
    expect(shadowText(el)).not.toContain('One');

    el.template.state.showList.set(true);
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('One');
    expect(shadowText(el)).toContain('Two');
  });
});

/*******************************
   Conditional → Async → Expression
*******************************/

describe('if → async → expression', () => {
  it('should render async content inside a conditional with reactive re-execution', async () => {
    const tag = uniqueTag();
    defineComponent({
      tagName: tag,
      template:
        '{#if showData}{#async fetchData as result}<span>{result}</span>{loading}<span>loading</span>{/async}{/if}',
      defaultState: { showData: true, query: 'first' },
      createComponent: ({ state }) => ({
        async fetchData(q = state.query.get()) {
          await new Promise(r => setTimeout(r, 50));
          return `result:${q}`;
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    // Wait for async to resolve
    await new Promise(r => setTimeout(r, 100));
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('result:first');

    // Change the reactive signal feeding the async
    el.template.state.query.set('second');
    await waitForUpdate(el);

    // Wait for new promise to resolve
    await new Promise(r => setTimeout(r, 100));
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('result:second');
  });

  it('should remove async content when conditional becomes false', async () => {
    const tag = uniqueTag();
    defineComponent({
      tagName: tag,
      template: '{#if showData}{#async fetchData as result}<span>{result}</span>{/async}{else}<span>off</span>{/if}',
      defaultState: { showData: true },
      createComponent: () => ({
        async fetchData() {
          await new Promise(r => setTimeout(r, 50));
          return 'loaded';
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    await new Promise(r => setTimeout(r, 100));
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('loaded');

    el.template.state.showData.set(false);
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('off');
    expect(shadowText(el)).not.toContain('loaded');
  });
});

/*******************************
   Snippet → If → Expression
*******************************/

describe('snippet → if → expression', () => {
  it('should update conditional inside snippet when reactive data changes', async () => {
    const tag = uniqueTag();
    defineComponent({
      tagName: tag,
      template: [
        '{#snippet status}{#if active}<b>ON</b>{else}<b>OFF</b>{/if}{/snippet}',
        '{>status}',
      ].join(''),
      defaultState: { active: true },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('ON');
    expect(shadowText(el)).not.toContain('OFF');

    el.template.state.active.set(false);
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('OFF');
    expect(shadowText(el)).not.toContain('ON');
  });

  it('should update conditional inside snippet when passed non-reactive data changes', async () => {
    const tag = uniqueTag();
    defineComponent({
      tagName: tag,
      template: [
        '{#snippet row}{#if isActive}<b>Y:{label}</b>{else}<b>N:{label}</b>{/if}{/snippet}',
        '{>row label=(getLabel) isActive=(getActive)}',
      ].join(''),
      defaultState: { version: 0 },
      createComponent: ({ state }) => ({
        getLabel: () => state.version.get() === 0 ? 'first' : 'second',
        getActive: () => state.version.get() === 0,
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('Y:first');

    el.template.state.version.set(1);
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('N:second');
    expect(shadowText(el)).not.toContain('Y:first');
  });
});

/*******************************
   Snippet → Each → Expression
*******************************/

describe('snippet → each → expression', () => {
  it('should render each items inside a snippet with reactive list changes', async () => {
    const tag = uniqueTag();
    defineComponent({
      tagName: tag,
      template: [
        '{#snippet list}{#each item in getItems}<span>{item.name}</span>{/each}{/snippet}',
        '{>list}',
      ].join(''),
      defaultState: { version: 0 },
      createComponent: ({ state }) => ({
        getItems: () => {
          return state.version.get() === 0
            ? [{ name: 'A' }, { name: 'B' }]
            : [{ name: 'X' }, { name: 'Y' }, { name: 'Z' }];
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('A');
    expect(shadowText(el)).toContain('B');

    el.template.state.version.set(1);
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('X');
    expect(shadowText(el)).toContain('Y');
    expect(shadowText(el)).toContain('Z');
    expect(shadowText(el)).not.toContain('A');
  });

  it('should pass data to snippet used inside each and update when items change', async () => {
    const tag = uniqueTag();
    defineComponent({
      tagName: tag,
      template: [
        '{#snippet badge}<b>[{label}]</b>{/snippet}',
        '{#each item in getItems}{>badge label=item.tag}{/each}',
      ].join(''),
      defaultState: { version: 0 },
      createComponent: ({ state }) => ({
        getItems: () => {
          return state.version.get() === 0
            ? [{ tag: 'alpha' }, { tag: 'beta' }]
            : [{ tag: 'gamma' }];
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('[alpha]');
    expect(shadowText(el)).toContain('[beta]');

    el.template.state.version.set(1);
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('[gamma]');
    expect(shadowText(el)).not.toContain('[alpha]');
    expect(shadowText(el)).not.toContain('[beta]');
  });
});

/*******************************
   Snippet → Snippet (nested)
*******************************/

describe('snippet → snippet (nested invocation)', () => {
  it('should render nested snippet invocations with reactive data', async () => {
    const tag = uniqueTag();
    defineComponent({
      tagName: tag,
      template: [
        '{#snippet inner}<i>{text}</i>{/snippet}',
        '{#snippet outer}<div>{>inner text=label}</div>{/snippet}',
        '{>outer label=message}',
      ].join(''),
      defaultState: { message: 'hello' },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('hello');

    el.template.state.message.set('world');
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('world');
    expect(shadowText(el)).not.toContain('hello');
  });

  it('should render deeply nested snippets with computed data', async () => {
    const tag = uniqueTag();
    defineComponent({
      tagName: tag,
      template: [
        '{#snippet leaf}<span>{value}</span>{/snippet}',
        '{#snippet branch}{>leaf value=data}{/snippet}',
        '{>branch data=(getLabel)}',
      ].join(''),
      defaultState: { count: 0 },
      createComponent: ({ state }) => ({
        getLabel: () => `count:${state.count.get()}`,
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('count:0');

    el.template.state.count.set(5);
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('count:5');
    expect(shadowText(el)).not.toContain('count:0');
  });
});

/*******************************
   Subtemplate with reactiveData
*******************************/

describe('subtemplate with reactiveData (verbose syntax)', () => {
  it('should update subtemplate when reactiveData signal changes', async () => {
    const tag = uniqueTag();
    const child = defineComponent({
      template: '<span>{label}</span>',
    });
    defineComponent({
      tagName: tag,
      template: "{>template name='child' reactiveData={label: getMessage}}",
      defaultState: { greeting: 'hi' },
      createComponent: ({ state }) => ({
        getMessage: () => `msg:${state.greeting.get()}`,
      }),
      subTemplates: { child },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('msg:hi');

    el.template.state.greeting.set('bye');
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('msg:bye');
    expect(shadowText(el)).not.toContain('msg:hi');
  });

  it('should update subtemplate with shorthand reactive props', async () => {
    const tag = uniqueTag();
    const child = defineComponent({
      template: '<span>{name} - {status}</span>',
    });
    defineComponent({
      tagName: tag,
      template: '{>child name=(getName) status=(getStatus)}',
      defaultState: { version: 0 },
      createComponent: ({ state }) => ({
        getName: () => state.version.get() === 0 ? 'Alice' : 'Bob',
        getStatus: () => state.version.get() === 0 ? 'active' : 'inactive',
      }),
      subTemplates: { child },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('Alice');
    expect(shadowText(el)).toContain('active');

    el.template.state.version.set(1);
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('Bob');
    expect(shadowText(el)).toContain('inactive');
    expect(shadowText(el)).not.toContain('Alice');
  });
});

/*******************************
   Subtemplate with static data
*******************************/

describe('subtemplate with static data (verbose syntax)', () => {
  it('should render subtemplate with static data object', async () => {
    const tag = uniqueTag();
    const child = defineComponent({
      template: '<span>{title}: {count}</span>',
    });
    defineComponent({
      tagName: tag,
      template: "{>template name='child' data={title: 'Items', count: 42}}",
      subTemplates: { child },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('Items');
    expect(shadowText(el)).toContain('42');
  });

  it('should NOT reactively update when static data references change', async () => {
    const tag = uniqueTag();
    const child = defineComponent({
      template: '<span>{label}</span>',
    });
    defineComponent({
      tagName: tag,
      template: "{>template name='child' data={label: getMessage}}",
      defaultState: { version: 0 },
      createComponent: ({ state }) => ({
        getMessage: () => `v${state.version.get()}`,
      }),
      subTemplates: { child },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    const initial = shadowText(el);
    expect(initial).toContain('v0');

    el.template.state.version.set(1);
    await waitForUpdate(el);

    // Static data should NOT update reactively
    expect(shadowText(el)).toContain('v0');
  });
});

/*******************************
   Subtemplate with dynamic name
*******************************/

describe('subtemplate with dynamic name=expression', () => {
  it('should swap subtemplate when name expression changes', async () => {
    const tag = uniqueTag();
    const viewA = defineComponent({
      template: '<span>View A</span>',
    });
    const viewB = defineComponent({
      template: '<span>View B</span>',
    });
    defineComponent({
      tagName: tag,
      template: '{>template name=currentView}',
      defaultState: { activeView: 'viewA' },
      createComponent: ({ state }) => ({
        currentView: () => state.activeView.get(),
      }),
      subTemplates: { viewA, viewB },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('View A');

    el.template.state.activeView.set('viewB');
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('View B');
    expect(shadowText(el)).not.toContain('View A');
  });

  it('should pass reactive data to dynamically swapped subtemplate', async () => {
    const tag = uniqueTag();
    const card = defineComponent({
      template: '<div>Card: {title}</div>',
    });
    const row = defineComponent({
      template: '<div>Row: {title}</div>',
    });
    defineComponent({
      tagName: tag,
      template: '{>template name=currentLayout reactiveData={title: getTitle}}',
      defaultState: { layout: 'card', label: 'hello' },
      createComponent: ({ state }) => ({
        currentLayout: () => state.layout.get(),
        getTitle: () => `${state.label.get()}!`,
      }),
      subTemplates: { card, row },
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    expect(shadowText(el)).toContain('Card: hello!');

    // Change data
    el.template.state.label.set('world');
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('Card: world!');

    // Swap template
    el.template.state.layout.set('row');
    await waitForUpdate(el);

    expect(shadowText(el)).toContain('Row: world!');
    expect(shadowText(el)).not.toContain('Card');
  });
});
