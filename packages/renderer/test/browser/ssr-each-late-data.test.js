import { defineComponent, renderToString } from '@semantic-ui/component';
import { $ } from '@semantic-ui/query';
import { flush, signal } from '@semantic-ui/reactivity';
import { Template } from '@semantic-ui/templating';
import { beforeEach, describe, expect, it } from 'vitest';

/*******************************
    SSR Each — Late Data
*******************************/

// A server-rendered each hydrated against data that has not arrived yet (a
// fetch in flight, a sync snapshot pending) holds the server DOM between the
// block's own text anchors and, when the data lands, renders each item into
// its anchors keyed by the server's markers — the naive update path, no
// duplication, no whole-list teardown, no else flash. The two failure shapes
// were reproduced red before the hold landed: duplication (no else branch)
// and full teardown (else branch). Items resolvable at hydrate keep the
// eager adopt-in-place path untouched; only the cold path re-renders innards,
// which is invisible when the arriving data matches what the server drew.

let tagCounter = 0;
function uniqueTag() {
  return `ssr-late-${++tagCounter}`;
}

async function ssrAndHydrate(opts) {
  const tag = uniqueTag();
  const Component = defineComponent({ tagName: tag, renderingEngine: 'native', ...opts });
  const wasServer = Template.isServer;
  Template.isServer = true;
  let html;
  try {
    html = renderToString(Component, {});
  }
  finally {
    Template.isServer = wasServer;
  }
  const wrapper = document.createElement('div');
  wrapper.setHTMLUnsafe(html);
  const el = wrapper.firstElementChild;
  const serverItems = [...el.shadowRoot.querySelectorAll('li')];
  const rendered = $(el).onNext('rendered');
  document.body.appendChild(el);
  await rendered;
  return { el, serverItems };
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 20));
const itemsOf = (el) => [...el.shadowRoot.querySelectorAll('li')];

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('each hydration with late-arriving data', () => {
  it('items resolvable at hydrate keep the eager adopt-in-place path', async () => {
    const items = signal(['a', 'b', 'c']);
    const { el, serverItems } = await ssrAndHydrate({
      template: '<ul>{#each item in items}<li>{item}</li>{/each}</ul>',
      createComponent: () => ({ items }),
    });
    await settle();
    const after = itemsOf(el);
    expect(after.length).toBe(3);
    expect(after[0]).toBe(serverItems[0]);
    expect(after[1]).toBe(serverItems[1]);
    expect(after[2]).toBe(serverItems[2]);
  });

  it('empty at hydrate, no else: the server list holds, then re-renders keyed at data arrival', async () => {
    const serverData = signal(['a', 'b', 'c']);
    const clientData = signal([]);
    const { el, serverItems } = await ssrAndHydrate({
      template: '<ul>{#each item in items}<li>{item}</li>{/each}</ul>',
      createComponent: ({ isServer }) => ({ items: isServer ? serverData : clientData }),
    });
    await settle();
    expect(itemsOf(el).length).toBe(3); // held, not destroyed

    clientData.set(['a', 'b', 'c']);
    flush();
    await settle();
    const after = itemsOf(el);
    expect(after.length).toBe(3); // no duplication beside the held DOM
    expect(after.map((n) => n.textContent)).toEqual(['a', 'b', 'c']);
    // the innards re-render into the held anchors (the naive path): the
    // server's nodes are replaced, never orphaned
    expect(serverItems.every((n) => !n.isConnected)).toBe(true);
  });

  it('empty at hydrate, with else: same hold, no else flash, keyed render at arrival', async () => {
    const serverData = signal(['a', 'b', 'c']);
    const clientData = signal([]);
    const { el, serverItems } = await ssrAndHydrate({
      template: '<ul>{#each item in items}<li>{item}</li>{else}<p class="empty">none</p>{/each}</ul>',
      createComponent: ({ isServer }) => ({ items: isServer ? serverData : clientData }),
    });
    await settle();
    expect(itemsOf(el).length).toBe(3);
    expect(el.shadowRoot.querySelector('.empty')).toBeNull();

    clientData.set(['a', 'b', 'c']);
    flush();
    await settle();
    const after = itemsOf(el);
    expect(after.length).toBe(3);
    expect(after.map((n) => n.textContent)).toEqual(['a', 'b', 'c']);
    expect(el.shadowRoot.querySelector('.empty')).toBeNull();
  });

  it('arrival is keyed: survivors render into their anchors, dropped items dispose, new items append', async () => {
    const serverData = signal([{ id: 1, label: 'a' }, { id: 2, label: 'b' }, { id: 3, label: 'c' }]);
    const clientData = signal([]);
    const { el, serverItems } = await ssrAndHydrate({
      template: '<ul>{#each item in items}<li>{item.label}</li>{/each}</ul>',
      createComponent: ({ isServer }) => ({ items: isServer ? serverData : clientData }),
    });
    await settle();

    clientData.set([{ id: 2, label: 'b' }, { id: 3, label: 'c' }, { id: 4, label: 'd' }]);
    flush();
    await settle();
    const after = itemsOf(el);
    expect(after.map((n) => n.textContent)).toEqual(['b', 'c', 'd']);
    expect(serverItems[0].isConnected).toBe(false); // dropped id's DOM is gone, no orphans
  });

  it('materialized items are wired: a later field change updates in place', async () => {
    const serverData = signal([{ id: 1, label: 'a' }]);
    const clientData = signal([]);
    const { el, serverItems } = await ssrAndHydrate({
      template: '<ul>{#each item in items}<li>{item.label}</li>{/each}</ul>',
      createComponent: ({ isServer }) => ({ items: isServer ? serverData : clientData }),
    });
    await settle();
    clientData.set([{ id: 1, label: 'a' }]);
    flush();
    await settle();

    clientData.set([{ id: 1, label: 'A' }]);
    flush();
    await settle();
    const after = itemsOf(el);
    expect(after.length).toBe(1);
    expect(after[0].textContent).toBe('A');
  });

  it('a change whose truth is empty releases the held DOM into the else branch', async () => {
    const serverData = signal(['a', 'b', 'c']);
    const clientData = signal([]);
    const { el } = await ssrAndHydrate({
      template: '<ul>{#each item in items}<li>{item}</li>{else}<p class="empty">none</p>{/each}</ul>',
      createComponent: ({ isServer }) => ({ items: isServer ? serverData : clientData }),
    });
    await settle();
    // the only way truth-empty can ARRIVE is via a real change (an equal []
    // never notifies) — data comes and goes again
    clientData.set(['x']);
    flush();
    await settle();
    clientData.set([]);
    flush();
    await settle();
    expect(itemsOf(el).length).toBe(0);
    expect(el.shadowRoot.querySelector('.empty')).not.toBeNull();
  });

  it('a server-rendered else branch still hydrates, and items arriving later replace it', async () => {
    const serverData = signal([]);
    const clientData = signal([]);
    const { el } = await ssrAndHydrate({
      template: '<ul>{#each item in items}<li>{item}</li>{else}<p class="empty">none</p>{/each}</ul>',
      createComponent: ({ isServer }) => ({ items: isServer ? serverData : clientData }),
    });
    await settle();
    expect(el.shadowRoot.querySelector('.empty')).not.toBeNull();

    clientData.set(['x']);
    flush();
    await settle();
    expect(itemsOf(el).map((n) => n.textContent)).toEqual(['x']);
    expect(el.shadowRoot.querySelector('.empty')).toBeNull();
  });
});
