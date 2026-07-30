import { defineComponent } from '@semantic-ui/component';
import { beforeEach, describe, expect, it } from 'vitest';

/*
  What a data-context function resolves to inside a JS-style expression. Path
  syntax already resolves one for you ({num} renders its value), and the JS
  proxy already resolves the other container kind (signals), so a function
  consumed by a JS operator is the remaining gap. It reads as a plausible value
  rather than an error: a computed returning false tests as truthy, and a
  computed returning a number concatenates as source text.

  Callee position is the one place the raw function is still wanted, since
  {addOne(1)} has to keep calling it.
*/

let boardCalls = 0;
const boardModel = { id: 'main', count: 2 };

const build = (tagName, template) => {
  defineComponent({
    tagName,
    template,
    defaultState: { sig: 42, dragging: false, currentPercentage: 7 },
    createComponent: () => ({
      num: () => 42,
      isFalse: () => false,
      addOne: (v = 0) => v + 1,
      value: 1,
      list: ['Apple', 'Banana', 'Blueberry'],
      getFiltered: () => ['Apple', 'Banana', 'Blueberry'].filter((n) => n.startsWith('B')),
      ratingPercentage: () => 60,
      board: () => {
        boardCalls += 1;
        return boardModel;
      },
    }),
  });
};

const render = async (tagName, template) => {
  boardCalls = 0;
  build(tagName, template);
  const element = document.createElement(tagName);
  document.body.appendChild(element);
  await element.rendered;
  const text = element.shadowRoot.textContent.trim();
  element.remove();
  return text;
};

describe('native — data functions inside JS-style expressions', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  /*******************************
        Consumed by an operator
  *******************************/

  it('resolves a computed used in arithmetic', async () => {
    expect(await render('jsx-arith', '{num + 1}')).toBe('43');
  });

  it('resolves a computed used as a boolean test', async () => {
    expect(await render('jsx-ternary', '{isFalse ? "y" : "n"}')).toBe('n');
  });

  it('resolves a computed used under negation', async () => {
    expect(await render('jsx-negate', '{!isFalse}')).toBe('true');
  });

  it('resolves an accessor member used in arithmetic', async () => {
    expect(await render('jsx-member-arith', '{board.count + 1}')).toBe('3');
  });

  it('resolves an accessor member used in a comparison', async () => {
    expect(await render('jsx-member-compare', '{board.id == "main" ? "y" : "n"}')).toBe('y');
  });

  it('invokes a path accessor once per expression, not once per mention', async () => {
    expect(await render('jsx-once', '{board.count + board.count}')).toBe('4');
    expect(boardCalls).toBe(1);
  });

  /*******************************
          Callee position
  *******************************/

  it('still calls a component method written with arguments', async () => {
    expect(await render('jsx-callee', '{addOne(1)}')).toBe('2');
  });

  it('still calls a framework helper written with arguments', async () => {
    expect(await render('jsx-helper-callee', '{activeIf(value == 1)}')).toBe('active');
  });

  // a bare identifier handed to a higher-order method resolves like any other, so
  // it arrives as its value and the call fails. no template in the corpus writes
  // that shape — every one uses an inline arrow — and a computed is the way to
  // pass a function through. the degraded output is an artifact of the fallback
  // chain, so only the working form is pinned
  it('passes a function through a computed', async () => {
    expect(await render('jsx-graduated', '{getFiltered.length}')).toBe('2');
  });

  it('leaves an inline arrow argument alone', async () => {
    const out = await render('jsx-arrow', '{list.filter(item => item.startsWith("B")).join(" and ")}');
    expect(out).toBe('Banana and Blueberry');
  });

  /*******************************
       Already resolving today
  *******************************/

  it('keeps invoking a computed returned from a JS expression', async () => {
    expect(await render('jsx-returned', '{dragging ? currentPercentage : ratingPercentage}')).toBe('60');
  });

  it('keeps unwrapping a signal in arithmetic', async () => {
    expect(await render('jsx-signal', '{sig + 1}')).toBe('43');
  });

  it('keeps resolving the same member through path syntax', async () => {
    expect(await render('jsx-path', '{board.id}')).toBe('main');
  });
});
