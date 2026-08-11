import { flush, reaction, ReactiveObject, reactiveObject, Scheduler } from '@semantic-ui/reactivity';
import { beforeEach, describe, expect, it } from 'vitest';

// re-run counter for a reaction reading a single path
const trackPath = (ro, path) => {
  const state = { runs: 0, last: undefined };
  const r = reaction(() => {
    state.last = ro.get(path);
    state.runs++;
  });
  state.stop = () => r.stop();
  return state;
};

describe('ReactiveObject', () => {
  beforeEach(() => {
    Scheduler.current = null;
    Scheduler.pendingReactions.clear();
    Scheduler.afterFlushCallbacks = [];
    Scheduler.isFlushScheduled = false;
  });

  describe('factory and brand', () => {
    it('reactiveObject() returns a ReactiveObject instance', () => {
      expect(reactiveObject({})).toBeInstanceOf(ReactiveObject);
      expect(new ReactiveObject({})).toBeInstanceOf(ReactiveObject);
    });

    it('the brand makes instanceof cross-realm safe', () => {
      // a foreign object carrying the same Symbol.for brand reads as an instance
      const foreign = { [Symbol.for('semantic-ui/ReactiveObject')]: true };
      expect(foreign).toBeInstanceOf(ReactiveObject);
      expect({}).not.toBeInstanceOf(ReactiveObject);
    });

    it('defaults the backing object to {}', () => {
      const ro = reactiveObject();
      expect(ro.peek()).toEqual({});
    });
  });

  // requirement 1
  describe('reactive single-path read', () => {
    it('a single-path read wakes only that path; a write elsewhere does not', () => {
      const ro = reactiveObject({ a: 1, b: 2 });
      const a = trackPath(ro, 'a');
      const b = trackPath(ro, 'b');
      expect(a.runs).toBe(1);
      expect(b.runs).toBe(1);

      ro.set('b', 20);
      flush();
      // the disjoint reader of 'a' must NOT have woken
      expect(a.runs).toBe(1);
      expect(b.runs).toBe(2);
      expect(b.last).toBe(20);

      a.stop();
      b.stop();
    });

    it('two readers of the same path share a cell and wake together', () => {
      const ro = reactiveObject({ a: 1 });
      const a1 = trackPath(ro, 'a');
      const a2 = trackPath(ro, 'a');
      ro.set('a', 9);
      flush();
      expect(a1.runs).toBe(2);
      expect(a2.runs).toBe(2);
      a1.stop();
      a2.stop();
    });
  });

  // requirement 2
  describe('untracked whole-value read', () => {
    it('peek() reads the backing object without subscribing', () => {
      const ro = reactiveObject({ a: 1, b: 2 });
      let runs = 0;
      let snapshot;
      const r = reaction(() => {
        snapshot = ro.peek();
        runs++;
      });
      expect(runs).toBe(1);
      expect(snapshot).toEqual({ a: 1, b: 2 });
      ro.set('a', 100);
      flush();
      // peek subscribed to nothing, so no re-run
      expect(runs).toBe(1);
      r.stop();
    });

    it('peek(path) reads a single path untracked', () => {
      const ro = reactiveObject({ a: { b: 5 } });
      let runs = 0;
      const r = reaction(() => {
        ro.peek('a.b');
        runs++;
      });
      ro.set('a.b', 6);
      flush();
      expect(runs).toBe(1);
      r.stop();
    });
  });

  // requirement 3
  describe('single-path write', () => {
    it('an equality-gated no-op write wakes nobody', () => {
      const ro = reactiveObject({ a: { x: 1 } });
      const a = trackPath(ro, 'a');
      expect(a.runs).toBe(1);
      // deep-equal value: gated, no wake, set reports no change
      expect(ro.set('a', { x: 1 })).toBe(false);
      flush();
      expect(a.runs).toBe(1);
      a.stop();
    });

    it('a changing write reports true and wakes the path', () => {
      const ro = reactiveObject({ a: 1 });
      const a = trackPath(ro, 'a');
      expect(ro.set('a', 2)).toBe(true);
      flush();
      expect(a.runs).toBe(2);
      expect(a.last).toBe(2);
      a.stop();
    });

    it('wakes ancestor readers when a leaf write changes the value seen at a container', () => {
      const ro = reactiveObject({ user: { name: 'Ann', age: 30 } });
      const container = trackPath(ro, 'user');
      const sibling = trackPath(ro, 'user.age');
      const leaf = trackPath(ro, 'user.name');

      ro.set('user.name', 'Bob');
      flush();
      expect(leaf.runs).toBe(2);
      expect(container.runs).toBe(2); // the object at 'user' now reads differently
      expect(sibling.runs).toBe(1); // disjoint sibling untouched

      container.stop();
      sibling.stop();
      leaf.stop();
    });

    it('wakes descendant readers whose resolved value changed on a subtree write', () => {
      const ro = reactiveObject({ user: { name: 'Ann', age: 30 } });
      const name = trackPath(ro, 'user.name');
      const age = trackPath(ro, 'user.age');

      // replace the whole subtree at 'user', name changes but age does not
      ro.set('user', { name: 'Bob', age: 30 });
      flush();
      expect(name.runs).toBe(2); // 'Ann' -> 'Bob'
      expect(age.runs).toBe(1); // 30 -> 30, equality-gated, no wake

      name.stop();
      age.stop();
    });
  });

  // requirement 4
  describe('path removal', () => {
    it('removal drops the key so it reads back absent, and wakes that path', () => {
      const ro = reactiveObject({ a: 1, b: 2 });
      const a = trackPath(ro, 'a');
      expect(ro.remove('a')).toBe(true);
      flush();
      expect(a.runs).toBe(2);
      expect(a.last).toBeUndefined();
      // the key actually left the object, not merely set to undefined
      expect(Object.hasOwn(ro.peek(), 'a')).toBe(false);
      a.stop();
    });

    it('removing an already-absent path is a no-op', () => {
      const ro = reactiveObject({ a: 1 });
      const z = trackPath(ro, 'z');
      expect(ro.remove('z')).toBe(false);
      flush();
      expect(z.runs).toBe(1);
      z.stop();
    });

    it('removing a subtree wakes a deep reader to read absent', () => {
      const ro = reactiveObject({ user: { name: 'Ann' } });
      const name = trackPath(ro, 'user.name');
      ro.remove('user');
      flush();
      expect(name.runs).toBe(2);
      expect(name.last).toBeUndefined();
      name.stop();
    });
  });

  // requirement 5
  describe('bulk inbound replace', () => {
    it('reseeds readers of DEEP paths under a wholesale-replaced subtree', () => {
      const ro = reactiveObject({ user: { profile: { name: 'Ann', avatar: 'a.png' } } });
      const name = trackPath(ro, 'user.profile.name');
      const avatar = trackPath(ro, 'user.profile.avatar');

      // fresh data: 'user' is replaced wholesale. a shallow top-key diff would
      // emit only 'user' and miss the deep readers below it.
      ro.replace({ user: { profile: { name: 'Bob', avatar: 'a.png' } } });
      flush();
      expect(name.runs).toBe(2); // 'Ann' -> 'Bob'
      expect(avatar.runs).toBe(1); // unchanged deep value, no wake

      name.stop();
      avatar.stop();
    });

    it('wakes only changed paths across a full replace', () => {
      const ro = reactiveObject({ a: 1, b: 2, c: 3 });
      const a = trackPath(ro, 'a');
      const b = trackPath(ro, 'b');
      const c = trackPath(ro, 'c');
      ro.replace({ a: 1, b: 20, c: 3 });
      flush();
      expect(a.runs).toBe(1);
      expect(b.runs).toBe(2);
      expect(c.runs).toBe(1);
      a.stop();
      b.stop();
      c.stop();
    });

    it('evicts unsubscribed vanished paths on replace', () => {
      const ro = reactiveObject({ stale: 1, keep: 2 });
      const stale = trackPath(ro, 'stale');
      expect(ro.cells.has('stale')).toBe(true);
      // reader goes away, then the path vanishes from the inbound data
      stale.stop();
      ro.replace({ keep: 2 });
      // dead cell for the vanished path is reclaimed in the reseed pass
      expect(ro.cells.has('stale')).toBe(false);
    });

    it('a still-subscribed vanished path wakes to read absent', () => {
      const ro = reactiveObject({ gone: 1 });
      const gone = trackPath(ro, 'gone');
      ro.replace({ other: 2 });
      flush();
      expect(gone.runs).toBe(2);
      expect(gone.last).toBeUndefined();
      gone.stop();
    });
  });

  // requirement 6
  describe('no unbounded growth', () => {
    it('prune() reclaims cells nobody subscribes to', () => {
      const ro = reactiveObject({ a: 1, b: 2 });
      const a = trackPath(ro, 'a');
      const b = trackPath(ro, 'b');
      expect(ro.cells.size).toBe(2);
      a.stop();
      b.stop();
      ro.prune();
      expect(ro.cells.size).toBe(0);
    });

    it('reads never allocate per write, so churn does not grow the cell map', () => {
      const ro = reactiveObject({ n: 0 });
      const n = trackPath(ro, 'n');
      for (let i = 1; i <= 100; i++) {
        ro.set('n', i);
        flush();
      }
      // one cell for 'n' no matter how many writes churned through it
      expect(ro.cells.size).toBe(1);
      expect(n.runs).toBe(101);
      n.stop();
    });

    it('stop() drops every cell and silences live subscribers', () => {
      const ro = reactiveObject({ a: 1 });
      const a = trackPath(ro, 'a');
      ro.stop();
      expect(ro.cells.size).toBe(0);
      ro.set('a', 2); // cell is gone, so the old subscriber is not woken
      flush();
      expect(a.runs).toBe(1);
      a.stop();
    });
  });

  // requirement 7
  describe('a write carries no behavior of its own beyond set + wake', () => {
    it('post-write consumer logic does not re-enter the write synchronously', () => {
      const ro = reactiveObject({ price: 10, qty: 2, total: 0 });
      let computeRuns = 0;
      // a consumer layers its own recompute on top of writes, in a reaction
      const r = reaction(() => {
        const total = ro.get('price') * ro.get('qty');
        computeRuns++;
        ro.set('total', total); // write inside the woken reaction must not recurse
      });
      expect(computeRuns).toBe(1);
      expect(ro.peek('total')).toBe(20);

      ro.set('price', 30);
      flush(); // must terminate, no runaway re-entrancy
      expect(ro.peek('total')).toBe(60);
      expect(computeRuns).toBe(2);
      r.stop();
    });

    it('set schedules rather than runs, so readers fire on flush not inside set', () => {
      const ro = reactiveObject({ a: 1 });
      const a = trackPath(ro, 'a');
      ro.set('a', 2);
      expect(a.runs).toBe(1); // not yet, scheduled rather than synchronous
      flush();
      expect(a.runs).toBe(2);
      a.stop();
    });
  });

  // requirement 8
  describe('path grammar', () => {
    it('dotted keys', () => {
      const ro = reactiveObject({ a: { b: { c: 1 } } });
      const c = trackPath(ro, 'a.b.c');
      ro.set('a.b.c', 2);
      flush();
      expect(c.runs).toBe(2);
      expect(c.last).toBe(2);
      c.stop();
    });

    it('positional [i] indices wake only the written index', () => {
      const ro = reactiveObject({ list: [10, 20, 30] });
      const first = trackPath(ro, 'list[0]');
      const second = trackPath(ro, 'list[1]');
      ro.set('list[1]', 99);
      flush();
      expect(first.runs).toBe(1);
      expect(second.runs).toBe(2);
      expect(second.last).toBe(99);
      first.stop();
      second.stop();
    });

    it('keyed [#id] array segments wake only the matched element', () => {
      const ro = reactiveObject({
        todos: [
          { id: 'a', done: false },
          { id: 'b', done: false },
        ],
      });
      const aDone = trackPath(ro, 'todos[#a].done');
      const bDone = trackPath(ro, 'todos[#b].done');
      ro.set('todos[#a].done', true);
      flush();
      expect(aDone.runs).toBe(2);
      expect(aDone.last).toBe(true);
      expect(bDone.runs).toBe(1); // disjoint keyed element untouched
      aDone.stop();
      bDone.stop();
    });

    it('a wholesale array write wakes a keyed-element descendant whose value changed', () => {
      const ro = reactiveObject({
        todos: [
          { id: 'a', done: false },
          { id: 'b', done: false },
        ],
      });
      const aDone = trackPath(ro, 'todos[#a].done');
      const bDone = trackPath(ro, 'todos[#b].done');
      // replace the whole array in place: #a flips, #b is unchanged
      ro.set('todos', [
        { id: 'a', done: true },
        { id: 'b', done: false },
      ]);
      flush();
      expect(aDone.runs).toBe(2);
      expect(aDone.last).toBe(true);
      expect(bDone.runs).toBe(1); // unchanged keyed element, equality-gated
      aDone.stop();
      bDone.stop();
    });

    it('cells address ids carrying dots — emails, compound ids', () => {
      const ro = reactiveObject({
        users: [
          { id: 'jack@semantic-ui.com', role: 'admin' },
          { id: '200.40.50', role: 'editor' },
        ],
      });
      const jack = trackPath(ro, 'users[#jack@semantic-ui.com].role');
      const compound = trackPath(ro, 'users[#200.40.50].role');
      const all = trackPath(ro, 'users');
      ro.set('users[#jack@semantic-ui.com].role', 'owner');
      flush();
      expect(jack.runs).toBe(2);
      expect(jack.last).toBe('owner');
      expect(compound.runs).toBe(1); // disjoint keyed element untouched
      expect(all.runs).toBe(2); // ancestor wakes through the keyed segment
      jack.stop();
      compound.stop();
      all.stop();
    });

    it('a wholesale array write wakes a dotted-id descendant whose value changed', () => {
      const ro = reactiveObject({ users: [{ id: 'jack@semantic-ui.com', role: 'admin' }] });
      const role = trackPath(ro, 'users[#jack@semantic-ui.com].role');
      ro.set('users', [{ id: 'jack@semantic-ui.com', role: 'owner' }]);
      flush();
      expect(role.runs).toBe(2);
      expect(role.last).toBe('owner');
      role.stop();
    });
  });

  describe('options', () => {
    it("safety 'none' treats every set as a change", () => {
      const ro = reactiveObject({ a: 1 }, { safety: 'none' });
      const a = trackPath(ro, 'a');
      ro.set('a', 1); // same value, but 'none' fires anyway
      flush();
      expect(a.runs).toBe(2);
      a.stop();
    });

    it("safety 'clone' returns defensive copies on read", () => {
      const ro = reactiveObject({ a: { x: 1 } }, { safety: 'clone' });
      const first = ro.peek('a');
      first.x = 999; // mutating the read copy must not leak into the backing object
      expect(ro.peek('a').x).toBe(1);
    });
  });

  describe('write-side safety', () => {
    it("set() under 'clone' safety stores a defensive copy, so a later caller mutation does not leak", () => {
      const ro = reactiveObject({}, { safety: 'clone' });
      const inbound = { x: 1 };
      ro.set('obj', inbound);
      inbound.x = 999;
      expect(ro.peek('obj').x).toBe(1);
    });

    it('a write the backing object drops reports no change and wakes nobody', () => {
      // utils set() no-ops on a field under an absent keyed element
      const ro = reactiveObject({ todos: [{ id: 'a', done: false }] });
      const arr = trackPath(ro, 'todos');
      expect(ro.set('todos[#c].done', true)).toBe(false);
      flush();
      expect(arr.runs).toBe(1);
      arr.stop();
    });

    it("under 'none' safety a dropped write still reports no change and wakes nobody", () => {
      // 'none' skips the equality check, but a write that never lands is not a change
      const ro = reactiveObject({ todos: [{ id: 'a', done: false }] }, { safety: 'none' });
      const arr = trackPath(ro, 'todos');
      expect(ro.set('todos[#c].done', true)).toBe(false);
      flush();
      expect(arr.runs).toBe(1);
      arr.stop();
    });
  });

  describe('keyed-address canonicalization', () => {
    it('a positional write wakes the keyed reader of the same element', () => {
      const ro = reactiveObject({ todos: [{ id: 'a', done: false }, { id: 'b', done: false }] });
      const keyed = trackPath(ro, 'todos[#a].done');
      expect(ro.set('todos.0.done', true)).toBe(true);
      flush();
      expect(keyed.runs).toBe(2);
      expect(keyed.last).toBe(true);
      keyed.stop();
    });

    it('a positional write wakes the keyed reader of a dotted-id element', () => {
      const ro = reactiveObject({ users: [{ id: 'jack@semantic-ui.com', role: 'admin' }] });
      const keyed = trackPath(ro, 'users[#jack@semantic-ui.com].role');
      expect(ro.set('users.0.role', 'owner')).toBe(true);
      flush();
      expect(keyed.runs).toBe(2);
      expect(keyed.last).toBe('owner');
      keyed.stop();
    });

    it('a positional remove wakes the keyed reader, ancestors included', () => {
      const ro = reactiveObject({ todos: [{ id: 'a', done: true }] });
      const keyed = trackPath(ro, 'todos[#a].done');
      const row = trackPath(ro, 'todos[#a]');
      expect(ro.remove('todos.0.done')).toBe(true);
      flush();
      expect(keyed.runs).toBe(2);
      expect(keyed.last).toBe(undefined);
      expect(row.runs).toBe(2);
      keyed.stop();
      row.stop();
    });

    it('a keyless array stays positional: no phantom keyed wake, the literal reader still fires', () => {
      const ro = reactiveObject({ tags: ['x', 'y'] });
      const literal = trackPath(ro, 'tags.1');
      expect(ro.set('tags.1', 'z')).toBe(true);
      flush();
      expect(literal.runs).toBe(2);
      expect(literal.last).toBe('z');
      literal.stop();
    });

    it('a whole-array write wakes a keyed descendant reader whose value moved', () => {
      // the descendant scan resolves the cell's [#id] suffix directly against the old and new
      // subtree values (the array-root bracket path)
      const ro = reactiveObject({ todos: [{ id: 'a', done: false }] });
      const keyed = trackPath(ro, 'todos[#a].done');
      ro.set('todos', [{ id: 'a', done: true }]);
      flush();
      expect(keyed.runs).toBe(2);
      expect(keyed.last).toBe(true);

      ro.set('todos', [{ id: 'a', done: true, note: 'x' }]); // same done value: no re-fire
      flush();
      expect(keyed.runs).toBe(2);
      keyed.stop();
    });

    it('twin resolution is gated on a keyed reader existing, and arms when one appears', () => {
      const ro = reactiveObject({ todos: [{ id: 'a', done: false }] });
      const literal = trackPath(ro, 'todos.0.done');
      ro.set('todos.0.done', true);
      flush();
      expect(ro.hasKeyedCells).toBe(false);

      const keyed = trackPath(ro, 'todos[#a].done');
      expect(ro.hasKeyedCells).toBe(true);
      ro.set('todos.0.done', false);
      flush();
      expect(keyed.runs).toBe(2);
      expect(keyed.last).toBe(false);
      literal.stop();
      keyed.stop();
    });

    it('a keyed write stays single-wake: the keyed reader fires, position stays the reader contract', () => {
      const ro = reactiveObject({ todos: [{ id: 'a', done: false }] });
      const keyed = trackPath(ro, 'todos[#a].done');
      expect(ro.set('todos[#a].done', true)).toBe(true);
      flush();
      expect(keyed.runs).toBe(2);
      keyed.stop();
    });
  });

  describe('api parity', () => {
    it('depend(path) subscribes without a read', () => {
      const ro = reactiveObject({ user: { name: 'Ann' } });
      let runs = 0;
      const r = reaction(() => {
        ro.depend('user.name');
        runs++;
      });

      ro.set('user.name', 'Bea');
      flush();

      expect(runs).toBe(2);
      r.stop();
    });

    it('notify(path) force-wakes the path, its ancestors, and all descendants', () => {
      const ro = reactiveObject({ user: { profile: { name: 'Ann', age: 30 } }, other: 1 });
      const exact = trackPath(ro, 'user.profile');
      const ancestor = trackPath(ro, 'user');
      const descendantA = trackPath(ro, 'user.profile.name');
      const descendantB = trackPath(ro, 'user.profile.age');
      const sibling = trackPath(ro, 'other');

      ro.raw('user.profile').name = 'Bea'; // in-place, invisible to set()
      ro.notify('user.profile');
      flush();

      expect(exact.runs).toBe(2);
      expect(ancestor.runs).toBe(2);
      expect(descendantA.runs).toBe(2);
      expect(descendantA.last).toBe('Bea');
      expect(descendantB.runs).toBe(2); // no before image, every descendant wakes
      expect(sibling.runs).toBe(1);
      [exact, ancestor, descendantA, descendantB, sibling].forEach((tracked) => tracked.stop());
    });

    it('version counts changes and seeds from options', () => {
      const ro = reactiveObject({ a: 1 }, { version: 5 });
      expect(ro.version).toBe(5);

      ro.set('a', 2);
      expect(ro.version).toBe(6);
      ro.set('a', 2); // deduped, no bump
      expect(ro.version).toBe(6);
      ro.remove('a');
      expect(ro.version).toBe(7);
      ro.replace({ b: 1 });
      expect(ro.version).toBe(8);
      ro.notify('b');
      expect(ro.version).toBe(9);
    });

    it('raw() returns the live reference under clone safety', () => {
      const ro = reactiveObject({ list: [1] }, { safety: 'clone' });

      expect(ro.peek('list')).not.toBe(ro.raw('list')); // peek clones, raw does not
      expect(ro.raw('list')).toBe(ro.raw('list'));
      expect(ro.raw().list).toBe(ro.raw('list'));
    });

    it('clone(path) is a tracked, detached copy', () => {
      const ro = reactiveObject({ user: { tags: ['a'] } });
      let copy;
      let runs = 0;
      const r = reaction(() => {
        copy = ro.clone('user.tags');
        runs++;
      });

      copy.push('b'); // detached, the stored value is untouched
      expect(ro.peek('user.tags')).toEqual(['a']);

      ro.set('user.tags', ['c']);
      flush();

      expect(runs).toBe(2);
      expect(copy).toEqual(['c']);
      r.stop();
    });

    it('has(path) distinguishes stored undefined from absent, reactively', () => {
      const ro = reactiveObject({ form: { email: 'a@b.c' } });
      const state = { runs: 0, last: undefined };
      const r = reaction(() => {
        state.last = ro.has('form.email');
        state.runs++;
      });
      expect(state.last).toBe(true);

      ro.set('form.email', undefined); // value to undefined transition stays present
      flush();
      expect(state.runs).toBe(2);
      expect(state.last).toBe(true);

      ro.remove('form.email');
      flush();
      expect(state.runs).toBe(3);
      expect(state.last).toBe(false);

      ro.set('form.email', 'new@b.c');
      flush();
      expect(state.runs).toBe(4);
      expect(state.last).toBe(true);
      r.stop();
    });

    it('remove() removes a key holding a stored undefined', () => {
      const ro = reactiveObject({ a: 'x' });
      ro.set('a', undefined);

      expect(ro.has('a')).toBe(true);
      expect(ro.remove('a')).toBe(true); // the guard keys on presence, not value
      expect(ro.has('a')).toBe(false);
    });
  });
});
