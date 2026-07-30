import { defineComponent } from '@semantic-ui/component';
import { beforeEach, describe, expect, it } from 'vitest';

/*
  What `this` is when a template calls a method on a model. Templates reach a
  model two ways — through a zero-arg accessor returned by createComponent, or
  as an {#each} item — and in both the method is bound to whatever the parent
  path resolved to. When that is a container (the accessor itself, a Signal) or
  the each block's item proxy, the method still runs and still returns a
  plausible value, so a wrong receiver reads as real data on the screen.
*/

const cheers = [
  { boardId: 'main' },
  { boardId: 'main' },
  { boardId: 'archive' },
];

const boardFor = (id) => ({
  id,
  closedAt: (id === 'archive') ? new Date() : null,
  cheerCount() {
    return cheers.filter((cheer) => cheer.boardId === this.id).length;
  },
  isClosed() {
    return this.closedAt != null;
  },
});

// a model that keeps its collection private — the shape any class-based model
// takes. the receiver has to be the instance itself, not a stand-in that
// forwards property reads
class PrivateBoard {
  #cheers;

  constructor(id, all) {
    this.id = id;
    this.#cheers = all.filter((cheer) => cheer.boardId === id);
  }

  cheerCount() {
    return this.#cheers.length;
  }
}

const textOf = (root, selector) => Array.from(root.querySelectorAll(selector)).map((node) => node.textContent);

const mount = async (tagName) => {
  const element = document.createElement(tagName);
  document.body.appendChild(element);
  await element.rendered;
  return element.shadowRoot;
};

describe('native — method receivers in templates', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('calls a model helper reached through a createComponent accessor', async () => {
    const tagName = 'test-receiver-accessor';
    defineComponent({
      tagName,
      template: '<b class="count">{board.cheerCount}</b><i class="closed">{archived.isClosed}</i>',
      createComponent: () => ({
        board: () => boardFor('main'),
        // closedAt is a Date here, so a wrong receiver reads undefined and
        // reports false — the assertion only discriminates on the archived board
        archived: () => boardFor('archive'),
      }),
    });

    const shadow = await mount(tagName);
    expect(shadow.querySelector('.count').textContent).toBe('2');
    expect(shadow.querySelector('.closed').textContent).toBe('true');
  });

  it('calls a model helper on an {#each ... as} item', async () => {
    const tagName = 'test-receiver-each-as';
    defineComponent({
      tagName,
      template: '<ul>{#each board in boards}<li>{board.cheerCount}</li>{/each}</ul>',
      defaultState: {
        boards: [boardFor('main'), boardFor('archive')],
      },
    });

    const shadow = await mount(tagName);
    expect(textOf(shadow, 'li')).toEqual(['2', '1']);
  });

  it('calls a model helper on a spread {#each} item through this', async () => {
    const tagName = 'test-receiver-each-spread';
    defineComponent({
      tagName,
      template: '<ul>{#each boards}<li>{this.cheerCount}</li>{/each}</ul>',
      defaultState: {
        boards: [boardFor('main'), boardFor('archive')],
      },
    });

    const shadow = await mount(tagName);
    expect(textOf(shadow, 'li')).toEqual(['2', '1']);
  });

  it('calls a built-in method on an {#each ... as} item', async () => {
    const tagName = 'test-receiver-each-builtin';
    defineComponent({
      tagName,
      template: '<ul>{#each date in dates}<li>{date.getFullYear}</li>{/each}</ul>',
      defaultState: {
        dates: [new Date('2024-03-01T12:00:00Z'), new Date('2026-07-29T12:00:00Z')],
      },
    });

    const shadow = await mount(tagName);
    expect(textOf(shadow, 'li')).toEqual(['2024', '2026']);
  });

  it('calls a helper that reads a private field on an {#each ... as} item', async () => {
    const tagName = 'test-receiver-each-private';
    defineComponent({
      tagName,
      template: '<ul>{#each board in boards}<li>{board.cheerCount}</li>{/each}</ul>',
      defaultState: {
        boards: [new PrivateBoard('main', cheers), new PrivateBoard('archive', cheers)],
      },
    });

    const shadow = await mount(tagName);
    expect(textOf(shadow, 'li')).toEqual(['2', '1']);
  });
});
