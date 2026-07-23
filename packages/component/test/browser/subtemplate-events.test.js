// An event key with no selector binds on the host. Inside a shadow root that
// makes event.target useless for placing the event — retargeting reports the
// host for anything raised in the tree — so subtemplates listen at the render
// root instead and the top-level tag treats its own host as in-template.

import { afterEach, describe, expect, it, vi } from 'vitest';

import { defineComponent } from '../../src/index.js';

const mounted = [];

afterEach(() => {
  mounted.forEach((element) => element.remove());
  mounted.length = 0;
});

function mount(tagName) {
  const element = document.createElement(tagName);
  document.body.appendChild(element);
  mounted.push(element);
  return element;
}

// components render on a microtask, and handlers fire through the same queue
const settle = () => new Promise((resolve) => setTimeout(resolve, 30));

function click(element) {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
}

/*******************************
      Naked Events — Scoping
*******************************/

describe('subtemplate events — no selector', () => {
  it('fires for a click inside the subtemplate', async () => {
    const handler = vi.fn();
    defineComponent({
      tagName: 'sub-event-inside',
      template: '<div>{> item}</div>',
      subTemplates: {
        item: {
          template: '<button class="btn">go</button>',
          events: { click: handler },
        },
      },
    });
    const element = mount('sub-event-inside');
    await settle();

    click(element.shadowRoot.querySelector('.btn'));
    await settle();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('stays silent for a click elsewhere in the same render root', async () => {
    const handler = vi.fn();
    defineComponent({
      tagName: 'sub-event-outside',
      template: '<div>{> item}<button class="outside">out</button></div>',
      subTemplates: {
        item: {
          template: '<button class="btn">go</button>',
          events: { click: handler },
        },
      },
    });
    const element = mount('sub-event-outside');
    await settle();

    click(element.shadowRoot.querySelector('.outside'));
    await settle();
    expect(handler).not.toHaveBeenCalled();
  });

  // one listener per row instance, so a leak shows up as a second call
  it('scopes each row to its own instance', async () => {
    const clicked = [];
    defineComponent({
      tagName: 'sub-event-each',
      template: '<div>{#each rows}{> row label=label}{/each}</div>',
      defaultState: { rows: [{ label: 'A' }, { label: 'B' }] },
      subTemplates: {
        row: {
          template: '<button class="btn">{label}</button>',
          events: {
            click({ target }) {
              clicked.push(target.textContent.trim());
            },
          },
        },
      },
    });
    const element = mount('sub-event-each');
    await settle();

    const buttons = element.shadowRoot.querySelectorAll('.btn');
    expect(buttons.length).toBe(2);

    click(buttons[0]);
    await settle();
    expect(clicked).toEqual(['A']);

    click(buttons[1]);
    await settle();
    expect(clicked).toEqual(['A', 'B']);
  });
});

/*******************************
     Dispatched Custom Events
*******************************/

describe('custom events dispatched from a subtemplate', () => {
  it('reaches a listener on the top-level tag', async () => {
    const handler = vi.fn();
    defineComponent({
      tagName: 'sub-emit-to-tag',
      template: '<div>{> sender}</div>',
      subTemplates: {
        sender: {
          template: '<button class="btn">emit</button>',
          events: {
            'click .btn'({ dispatchEvent }) {
              dispatchEvent('custom', { n: 1 });
            },
          },
        },
      },
      events: { custom: handler },
    });
    const element = mount('sub-emit-to-tag');
    await settle();

    click(element.shadowRoot.querySelector('.btn'));
    await settle();
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].data.n).toBe(1);
  });

  // tag > shop > list, where list emits and shop listens — the event has to
  // travel through shop's range to be heard, so dispatching from the host misses it
  it('reaches a listener one level up, and the tag above that', async () => {
    const shopHeard = vi.fn();
    const tagHeard = vi.fn();

    const list = defineComponent({
      template: '<div class="list"><button class="add">add</button></div>',
      events: {
        'click .add'({ dispatchEvent }) {
          dispatchEvent('addToCart', { itemId: 'apple' });
        },
      },
    });
    const shop = defineComponent({
      template: '<div class="shop">{> list}</div>',
      subTemplates: { list },
      events: { addToCart: shopHeard },
    });
    defineComponent({
      tagName: 'sub-emit-up-two',
      template: '<div class="app">{> shop}</div>',
      subTemplates: { shop },
      events: { addToCart: tagHeard },
    });

    const element = mount('sub-emit-up-two');
    await settle();

    click(element.shadowRoot.querySelector('.add'));
    await settle();
    expect(shopHeard).toHaveBeenCalledTimes(1);
    expect(shopHeard.mock.calls[0][0].data.itemId).toBe('apple');
    expect(tagHeard).toHaveBeenCalledTimes(1);

    // re-dispatching inside a handler keeps the element that started it
    expect(shopHeard.mock.calls[0][0].target).toBe(element.shadowRoot.querySelector('.add'));
  });

  // the event fires on the host, which is outside every subtemplate's range
  it('does not reach a sibling subtemplate', async () => {
    const handler = vi.fn();
    defineComponent({
      tagName: 'sub-emit-to-sibling',
      template: '<div>{> sender}{> listener}</div>',
      subTemplates: {
        sender: {
          template: '<button class="btn">emit</button>',
          events: {
            'click .btn'({ dispatchEvent }) {
              dispatchEvent('custom', { n: 1 });
            },
          },
        },
        listener: {
          template: '<span></span>',
          events: { custom: handler },
        },
      },
    });
    const element = mount('sub-emit-to-sibling');
    await settle();

    click(element.shadowRoot.querySelector('.btn'));
    await settle();
    expect(handler).not.toHaveBeenCalled();
  });
});

/*******************************
        Unchanged Paths
*******************************/

describe('bindings that already worked', () => {
  it('fires a selector-scoped subtemplate handler', async () => {
    const handler = vi.fn();
    defineComponent({
      tagName: 'sub-event-selector',
      template: '<div>{> item}</div>',
      subTemplates: {
        item: {
          template: '<button class="btn">go</button>',
          events: { 'click .btn': handler },
        },
      },
    });
    const element = mount('sub-event-selector');
    await settle();

    click(element.shadowRoot.querySelector('.btn'));
    await settle();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('fires a naked handler on the top-level tag for a click in its tree', async () => {
    const handler = vi.fn();
    defineComponent({
      tagName: 'tag-event-naked',
      template: '<div><button class="btn">go</button></div>',
      events: { click: handler },
    });
    const element = mount('tag-event-naked');
    await settle();

    click(element.shadowRoot.querySelector('.btn'));
    await settle();
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
