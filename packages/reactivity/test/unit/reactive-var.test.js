import { describe, it, expect, vi } from 'vitest';
import { ReactiveVar, Reaction } from '@semantic-ui/reactivity';

/*******************************
            Creation
*******************************/

describe('ReactiveVar initialization', () => {
  it('provide value', () => {
    const myVar = new ReactiveVar('initial');
    myVar.value = 'updated';
    expect(myVar.value).toBe('updated');
  });
  it('provide get and set helper', () => {
    const myVar = new ReactiveVar('initial');
    myVar.set('updated');
    expect(myVar.value).toBe('updated');
    expect(myVar.get()).toBe('updated');
  });
});

/*******************************
            Equality
*******************************/

describe('ReactiveVar equality', () => {
  it('should update and return the new value correctly', () => {
    const myVar = new ReactiveVar('initial');
    myVar.value = 'updated';
    expect(myVar.value).toBe('updated');
  });
});


/*******************************
          Subscriptions
*******************************/

describe('ReactiveVar subscriptions', () => {
  it('should notify subscribers on value change', async () => {
    const callback = vi.fn();

    const expectReaction = expect.objectContaining({
      stop: expect.any(Function)
    });

    const reactiveVar = new ReactiveVar('initial');
    reactiveVar.subscribe(callback);
    Reaction.flush();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('initial', expectReaction);

    reactiveVar.value = 'updated';
    Reaction.flush();

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith('updated', expectReaction);

    reactiveVar.set('final');
    Reaction.flush();

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenCalledWith('final', expectReaction);

  });
});

/*******************************
            Methods
*******************************/

describe('ReactiveVar subscription', () => {
  it('should notify subscribers on value change', async () => {
    const callback = vi.fn();

    const expectReaction = expect.objectContaining({
      stop: expect.any(Function)
    });

    const reactiveVar = new ReactiveVar('initial');
    reactiveVar.subscribe(callback);
    Reaction.flush();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('initial', expectReaction);

    reactiveVar.value = 'updated';
    Reaction.flush();

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith('updated', expectReaction);

    reactiveVar.set('final');
    Reaction.flush();

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenCalledWith('final', expectReaction);

  });
});


/*******************************
          Reactivity
*******************************/
