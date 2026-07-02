import {
  any,
  arrayFromObject,
  assignInPlace,
  clone,
  deepExtend,
  detectChanges,
  elementKey,
  extend,
  filterObject,
  get,
  hasProperty,
  keyedPath,
  keys,
  mapObject,
  onlyKeys,
  pick,
  proxyObject,
  reverseKeys,
  set,
  some,
  trackReads,
  trackWrites,
  unset,
  values,
  weightedObjectSearch,
} from '@semantic-ui/utils';

import { describe, expect, it, vi } from 'vitest';

describe('Object Utilities', () => {
  describe('trackWrites', () => {
    // 200 records x 4 fields clears the auto budget and forces the proxy strategy
    const makeLarge = () =>
      Array.from({ length: 200 }, (_, i) => ({
        id: i,
        name: `Record ${i}`,
        active: i % 2 === 0,
        meta: { seen: false },
      }));

    describe('equality', () => {
      it('forwards a custom comparator into the snapshot path diff', () => {
        // loose == treats 1 and '1' as equal, so the write is not a change and emits no path
        const result = trackWrites({ a: 1 }, (value) => {
          value.a = '1';
        }, { equality: (x, y) => x == y });
        expect(result.changed).toBe(false);
        expect(result.paths).toEqual([]);
      });

      it('emits the path under the default strict comparator', () => {
        const result = trackWrites({ a: 1 }, (value) => {
          value.a = '1';
        });
        expect(result.changed).toBe(true);
        expect(result.paths).toEqual(['a']);
      });
    });

    describe('strategy selection', () => {
      it('hands the callback the value itself when small', () => {
        const target = { a: { b: 1 } };
        let received;
        trackWrites(target, (value) => {
          received = value;
        });
        expect(received).toBe(target);
      });

      it('snapshots a large value under the default, since keyed paths come from the snapshot diff', () => {
        // keyed is the default and keyed paths are produced by detectChanges over
        // a snapshot, so the auto size-heuristic yields to snapshot — the callback
        // sees the real object, not a wrapper
        const target = makeLarge();
        let received;
        trackWrites(target, (value) => {
          received = value;
        });
        expect(received).toBe(target);
      });

      it('hands the callback a tracked wrapper when large and { keyed: false }', () => {
        const target = makeLarge();
        let wrapped;
        trackWrites(target, (value) => {
          wrapped = value !== target;
        }, { keyed: false });
        expect(wrapped).toBe(true);
      });

      it('uses the proxy strategy when onWrite is passed, even when small', () => {
        const target = { a: 1 };
        let wrapped;
        trackWrites(target, (value) => {
          wrapped = value !== target;
        }, { onWrite: () => {} });
        expect(wrapped).toBe(true);
      });

      it('honors an explicit snapshot strategy on a large value', () => {
        const target = makeLarge();
        let received;
        trackWrites(target, (value) => {
          received = value;
        }, { strategy: 'snapshot' });
        expect(received).toBe(target);
      });

      it('honors an explicit proxy strategy on a small value', () => {
        const target = { a: 1 };
        let wrapped;
        trackWrites(target, (value) => {
          wrapped = value !== target;
        }, { strategy: 'proxy' });
        expect(wrapped).toBe(true);
      });

      it('passes a primitive through untouched', () => {
        let received;
        const { changed, result } = trackWrites(42, (value) => {
          received = value;
          return value + 1;
        });
        expect(received).toBe(42);
        expect(changed).toBe(false);
        expect(result).toBe(43);
      });
    });

    describe('snapshot strategy', () => {
      it('detects an in-place change', () => {
        const { changed } = trackWrites({ meta: { count: 0 } }, (value) => {
          value.meta.count = 1;
        });
        expect(changed).toBe(true);
      });

      it('does not flag a read-only pass', () => {
        const { changed } = trackWrites({ a: { b: 1 } }, (value) => value.a.b);
        expect(changed).toBe(false);
      });

      it('does not flag writing a property to its existing value', () => {
        const { changed } = trackWrites({ a: 1 }, (value) => {
          value.a = 1;
        });
        expect(changed).toBe(false);
      });

      it('detects a change to a Map-valued target', () => {
        const target = new Map();
        const { changed } = trackWrites(target, (map) => {
          map.set('k', 'v');
        });
        expect(changed).toBe(true);
        expect(target.get('k')).toBe('v');
      });

      it('detects a closure write that never touches the callback value', () => {
        const shared = { x: 1 };
        const { changed } = trackWrites({ shared }, () => {
          shared.x = 2;
        });
        expect(changed).toBe(true);
      });
    });

    describe('proxy strategy', () => {
      it('flags writes at any depth and applies them to the raw value', () => {
        const target = makeLarge();
        const { changed } = trackWrites(target, (rows) => {
          rows[0].meta.seen = true;
        });
        expect(changed).toBe(true);
        expect(target[0].meta.seen).toBe(true);
        expect(target[1].meta.seen).toBe(false);
      });

      it('does not flag writing a property to its existing value', () => {
        const target = makeLarge();
        const { changed } = trackWrites(target, (rows) => {
          rows[0].id = 0;
        });
        expect(changed).toBe(false);
      });

      it('flags array methods that write', () => {
        const target = [1, 2, 3];
        const { changed } = trackWrites(target, (arr) => {
          arr.push(4);
        }, { strategy: 'proxy' });
        expect(changed).toBe(true);
        expect(target).toEqual([1, 2, 3, 4]);
      });

      it('flags property deletion, but not deleting an absent or inherited key', () => {
        expect(
          trackWrites({ a: 1 }, (value) => {
            delete value.a;
          }, { strategy: 'proxy' }).changed,
        ).toBe(true);
        expect(
          trackWrites({ a: 1 }, (value) => {
            delete value.b;
          }, { strategy: 'proxy' }).changed,
        ).toBe(false);
        expect(
          trackWrites({ a: 1 }, (value) => {
            delete value.toString;
          }, { strategy: 'proxy' }).changed,
        ).toBe(false);
      });

      it('flags assigning a brand-new key even when the value is undefined', () => {
        const target = { a: 1 };
        const { changed } = trackWrites(target, (value) => {
          value.b = undefined;
        }, { strategy: 'proxy' });
        expect(changed).toBe(true);
        expect(Object.hasOwn(target, 'b')).toBe(true);
      });

      it('mirrors set/delete semantics for defineProperty', () => {
        expect(
          trackWrites({ a: 1 }, (value) => {
            Object.defineProperty(value, 'a', { value: 1 });
          }, { strategy: 'proxy' }).changed,
        ).toBe(false);
        expect(
          trackWrites({ a: 1 }, (value) => {
            Object.defineProperty(value, 'b', { value: 2, configurable: true });
          }, { strategy: 'proxy' }).changed,
        ).toBe(true);
      });

      it('does not flag a no-op reorder of an already-sorted array', () => {
        const { changed } = trackWrites([{ n: 1 }, { n: 2 }, { n: 3 }], (arr) => {
          arr.sort((a, b) => a.n - b.n);
        }, { strategy: 'proxy' });
        expect(changed).toBe(false);
      });

      it('reaches the same wrapper back through a cycle', () => {
        const node = { name: 'a' };
        node.self = node;
        trackWrites(node, (tracked) => {
          expect(tracked.self).toBe(tracked);
        }, { strategy: 'proxy' });
      });

      it('passes class instances through raw inside the callback', () => {
        class Model {
          constructor() {
            this.count = 0;
          }
        }
        const model = new Model();
        trackWrites({ model }, (value) => {
          expect(value.model).toBe(model);
        }, { strategy: 'proxy' });
      });
    });

    describe('proxy strategy - graph hygiene', () => {
      it('reassigning a filtered array leaves no wrappers in the raw value', () => {
        const target = { items: [{ id: 1, done: true }, { id: 2, done: false }] };
        const { changed } = trackWrites(target, (value) => {
          value.items = value.items.filter((item) => !item.done);
        }, { strategy: 'proxy' });
        expect(changed).toBe(true);
        expect(target.items).toHaveLength(1);
        expect(() => JSON.stringify(target)).not.toThrow();
        expect(target.items[0].id).toBe(2);
      });

      it('writing a fresh object that embeds a tracked child stores the raw child', () => {
        const target = { a: null, b: { y: 1 } };
        trackWrites(target, (value) => {
          value.a = { child: value.b };
        }, { strategy: 'proxy' });
        expect(target.a.child).toBe(target.b);
        expect(() => JSON.stringify(target)).not.toThrow();
      });

      it('a returned spread of the tracked value contains no wrappers', () => {
        const target = { inner: { x: 0 }, count: 1 };
        const { result } = trackWrites(
          target,
          (value) => ({ ...value, count: value.count + 1 }),
          { strategy: 'proxy' },
        );
        expect(result.inner).toBe(target.inner);
        expect(result.count).toBe(2);
        expect(() => JSON.stringify(result)).not.toThrow();
      });

      it('mapped items with nested objects come back raw', () => {
        const target = { items: [{ meta: { n: 1 } }, { meta: { n: 2 } }] };
        trackWrites(target, (value) => {
          value.items = value.items.map((item) => ({ ...item, copied: true }));
        }, { strategy: 'proxy' });
        expect(() => JSON.stringify(target)).not.toThrow();
        expect(target.items[0].meta.n).toBe(1);
      });

      it('sorting objects writes raw elements back, never wrappers', () => {
        const target = [{ n: 3 }, { n: 1 }, { n: 2 }];
        const elements = [...target];
        trackWrites(target, (arr) => {
          arr.sort((a, b) => a.n - b.n);
        }, { strategy: 'proxy' });
        expect(target).toEqual([{ n: 1 }, { n: 2 }, { n: 3 }]);
        for (const element of target) {
          expect(elements).toContain(element);
        }
      });

      it('returning the tracked value unwraps to the original', () => {
        const target = { a: 1 };
        const { result } = trackWrites(target, (value) => value, { strategy: 'proxy' });
        expect(result).toBe(target);
      });
    });

    describe('proxy strategy - exotic values', () => {
      it('detects a touched Map mutation by snapshot', () => {
        const target = { lookup: new Map() };
        const { changed } = trackWrites(target, (value) => {
          value.lookup.set('id-1', 'Alice');
        }, { strategy: 'proxy' });
        expect(changed).toBe(true);
      });

      it('detects a touched Date mutation by snapshot', () => {
        const target = { at: new Date('2020-01-01') };
        const { changed } = trackWrites(target, (value) => {
          value.at.setFullYear(2030);
        }, { strategy: 'proxy' });
        expect(changed).toBe(true);
      });

      it('does not flag an exotic that was read but not changed', () => {
        const target = { lookup: new Map([['k', 'v']]) };
        const { changed } = trackWrites(target, (value) => value.lookup.get('k'), { strategy: 'proxy' });
        expect(changed).toBe(false);
      });

      it('detects a write inside a frozen wrapper with mutable children', () => {
        const target = { cfg: Object.freeze({ child: { y: 1 } }) };
        const { changed } = trackWrites(target, (value) => {
          value.cfg.child.y = 2;
        }, { strategy: 'proxy' });
        expect(changed).toBe(true);
        expect(target.cfg.child.y).toBe(2);
      });
    });

    describe('lifecycle', () => {
      it('a tracked value used after the callback throws a clear error', () => {
        let leaked;
        trackWrites({ a: { b: 1 } }, (value) => {
          leaked = value.a;
        }, { strategy: 'proxy' });
        expect(() => leaked.b).toThrow(/after its callback returned/);
        expect(() => {
          leaked.b = 2;
        }).toThrow(/after its callback returned/);
      });

      it('propagates a thrown error and still expires the wrapper', () => {
        let leaked;
        expect(() =>
          trackWrites({ a: { b: 1 } }, (value) => {
            leaked = value.a;
            throw new Error('boom');
          }, { strategy: 'proxy' })
        ).toThrow('boom');
        expect(() => leaked.b).toThrow(/after its callback returned/);
      });

      it('propagates a thrown error on the snapshot strategy', () => {
        expect(() =>
          trackWrites({ a: 1 }, () => {
            throw new Error('boom');
          })
        ).toThrow('boom');
      });
    });

    describe('onWrite', () => {
      it('reports the path, target, and key for each write', () => {
        const writes = [];
        const target = { items: [{ name: 'a' }], count: 0 };
        trackWrites(target, (value) => {
          value.count = 1;
          value.items[0].name = 'b';
        }, { onWrite: (path, object, key) => writes.push([path, object, key]) });
        expect(writes).toEqual([
          [['count'], target, 'count'],
          [['items', '0', 'name'], target.items[0], 'name'],
        ]);
      });

      it('does not fire for writes to an existing value', () => {
        const writes = [];
        trackWrites({ a: 1 }, (value) => {
          value.a = 1;
        }, { onWrite: (path) => writes.push(path) });
        expect(writes).toEqual([]);
      });
    });

    describe('returnPaths', () => {
      it('returns paths by default, small values still see the real object', () => {
        const target = { meta: { count: 0 } };
        let sawReal;
        const { changed, paths } = trackWrites(target, (value) => {
          sawReal = value === target;
          value.meta.count = 1;
        });
        expect(sawReal).toBe(true);
        expect(changed).toBe(true);
        expect(paths).toEqual(['meta.count']);
      });

      it('returnPaths: false skips path collection on both strategies', () => {
        const small = trackWrites({ a: 1 }, (value) => {
          value.a = 2;
        }, { returnPaths: false });
        expect(small.changed).toBe(true);
        expect(small.paths).toBeUndefined();

        const large = trackWrites(makeLarge(), (rows) => {
          rows[0].meta.seen = true;
        }, { returnPaths: false });
        expect(large.changed).toBe(true);
        expect(large.paths).toBeUndefined();
      });

      it('returns written paths deduped in write order on the proxy strategy', () => {
        const target = { title: '', meta: { tags: ['a'] }, count: 0 };
        const { paths } = trackWrites(target, (value) => {
          value.count = 1;
          value.meta.tags[0] = 'b';
          value.count = 2;
        }, { strategy: 'proxy' });
        expect(paths).toEqual(['count', 'meta.tags.0']);
      });

      it('reports net leaf changes on the snapshot strategy, resolvable through get()', () => {
        const target = { items: [{ name: 'a' }, { name: 'b' }] };
        const { paths } = trackWrites(target, (value) => {
          value.items[1].name = 'z';
        });
        expect(paths).toEqual(['items.1.name']);
        expect(get(target, paths[0])).toBe('z');
      });

      it('a write restored to its original value nets out under snapshot', () => {
        const { changed, paths } = trackWrites({ a: 1 }, (value) => {
          value.a = 2;
          value.a = 1;
        });
        expect(changed).toBe(false);
        expect(paths).toEqual([]);
      });

      it('prunes child paths when a parent was also written, either order (proxy)', () => {
        const childFirst = trackWrites({ a: { b: 1 } }, (value) => {
          value.a.b = 2;
          value.a = { b: 3 };
        }, { strategy: 'proxy' });
        expect(childFirst.paths).toEqual(['a']);

        const parentFirst = trackWrites({ a: { b: 1 } }, (value) => {
          value.a = { b: 3 };
          value.a.b = 4;
        }, { strategy: 'proxy' });
        expect(parentFirst.paths).toEqual(['a']);
      });

      it('returns an empty array when nothing was written', () => {
        const { changed, paths } = trackWrites({ a: 1 }, (value) => value.a);
        expect(changed).toBe(false);
        expect(paths).toEqual([]);
      });

      it('records a removed key as a path on both strategies', () => {
        const snapshot = trackWrites({ a: 1, b: 2 }, (value) => {
          delete value.b;
        });
        expect(snapshot.paths).toEqual(['b']);

        const proxy = trackWrites({ a: 1, b: 2 }, (value) => {
          delete value.b;
        }, { strategy: 'proxy' });
        expect(proxy.paths).toEqual(['b']);
      });

      it('reports a wholesale root change as the empty path', () => {
        const date = new Date('2020-01-01');
        const { changed, paths } = trackWrites(date, (value) => {
          value.setFullYear(2030);
        });
        expect(changed).toBe(true);
        expect(paths).toEqual(['']);
      });

      it('counts a symbol-keyed write as changed but skips it in paths (proxy)', () => {
        const key = Symbol('hidden');
        const { changed, paths } = trackWrites({ a: 1 }, (value) => {
          value[key] = 2;
        }, { strategy: 'proxy' });
        expect(changed).toBe(true);
        expect(paths).toEqual([]);
      });
    });

    describe('keyed paths', () => {
      // the marquee case — editing a field on every record of a collection reads
      // back as per-record writes, not array indices, with zero configuration
      it('reports per-record keyed paths for a field edit across a collection', () => {
        const db = {
          todos: [
            { id: 'a', complete: false },
            { id: 'b', complete: false },
            { id: 'c', complete: false },
          ],
        };
        const { changed, paths } = trackWrites(db, (d) => {
          for (const todo of d.todos) {
            todo.complete = true;
          }
        });
        expect(changed).toBe(true);
        expect(paths).toEqual([
          'todos[#a].complete',
          'todos[#b].complete',
          'todos[#c].complete',
        ]);
      });

      it('reports a structural push as a single keyed element add', () => {
        const db = { todos: [{ id: 'a' }, { id: 'b' }] };
        const { paths } = trackWrites(db, (d) => {
          d.todos.push({ id: 'z' });
        });
        expect(paths).toEqual(['todos[#z]']);
      });

      it('forces the snapshot strategy on a large value when keyed paths are wanted', () => {
        // 200 records clears the auto budget, but keyed paths come from the
        // snapshot diff, so the callback still sees the real object
        const db = {
          todos: Array.from({ length: 200 }, (_, i) => ({ id: `t${i}`, complete: false })),
        };
        let sawReal;
        const { paths } = trackWrites(db, (d) => {
          sawReal = d === db;
          d.todos[5].complete = true;
        });
        expect(sawReal).toBe(true);
        expect(paths).toEqual(['todos[#t5].complete']);
      });

      it('yields positional paths under an explicit proxy strategy', () => {
        // the proxy only sees the index a write went through, so its paths are
        // positional by construction — the perf opt-out that drops identity
        const db = { todos: [{ id: 'a', complete: false }, { id: 'b', complete: false }] };
        const { paths } = trackWrites(db, (d) => {
          for (const todo of d.todos) {
            todo.complete = true;
          }
        }, { strategy: 'proxy' });
        expect(paths).toEqual(['todos.0.complete', 'todos.1.complete']);
      });

      it('yields positional paths under { keyed: false }', () => {
        const db = { todos: [{ id: 'a', x: 0 }] };
        const { paths } = trackWrites(db, (d) => {
          d.todos[0].x = 1;
        }, { keyed: false });
        expect(paths).toEqual(['todos.0.x']);
      });

      it('honors a custom key list for the emitted paths', () => {
        const db = { rows: [{ sku: 's1', q: 1 }, { sku: 's2', q: 1 }] };
        const { paths } = trackWrites(db, (d) => {
          d.rows[1].q = 2;
        }, { keys: ['sku'] });
        expect(paths).toEqual(['rows[#s2].q']);
      });

      it('still reports changed with no paths under { returnPaths: false }', () => {
        const db = { todos: [{ id: 'a', complete: false }] };
        const { changed, paths } = trackWrites(db, (d) => {
          d.todos[0].complete = true;
        }, { returnPaths: false });
        expect(changed).toBe(true);
        expect(paths).toBeUndefined();
      });
    });
  });

  describe('trackReads', () => {
    describe('value reads', () => {
      it('reports the path of a leaf read', () => {
        const { reads } = trackReads({ user: { name: 'Alice' } }, (value) => value.user.name);
        expect(reads).toEqual(['user.name']);
      });

      it('reports several independent leaf reads', () => {
        const state = { a: { b: 1 }, c: 2 };
        const { reads } = trackReads(state, (value) => value.a.b + value.c);
        expect(reads).toEqual(['a.b', 'c']);
      });

      it('records a read of a currently-missing property', () => {
        const { reads } = trackReads({ a: 1 }, (value) => value.missing);
        expect(reads).toEqual(['missing']);
      });

      it('prunes an ancestor read when a descendant was also read', () => {
        const state = { user: { name: 'Alice' } };
        const { reads } = trackReads(state, (value) => {
          const user = value.user;
          return user.name;
        });
        expect(reads).toEqual(['user.name']);
      });

      it('keeps a bare container read when nothing under it was read', () => {
        const state = { user: { name: 'Alice' } };
        const { reads } = trackReads(state, (value) => value.user);
        expect(reads).toEqual(['user']);
      });

      it('returns the callback result, with tracked wrappers unwrapped', () => {
        const state = { user: { name: 'Alice' } };
        const { result } = trackReads(state, (value) => value.user);
        expect(result).toBe(state.user);
        expect(() => result.name).not.toThrow();
      });

      it('unwraps tracked wrappers smuggled inside a fresh result container', () => {
        const state = { a: { x: 1 }, b: { y: 2 } };
        const { result } = trackReads(state, (value) => [value.a, value.b]);
        expect(result[0]).toBe(state.a);
        expect(result[1]).toBe(state.b);
      });
    });

    describe('structural reads', () => {
      it('reading length is a structural dependency, not a value read', () => {
        const state = { items: [1, 2, 3] };
        const { reads, structure } = trackReads(state, (value) => value.items.length);
        expect(structure).toContain('items');
        expect(reads).not.toContain('items.length');
      });

      it('iterating an array records structure plus each element value', () => {
        const state = { items: [{ id: 'a', n: 1 }, { id: 'b', n: 2 }] };
        const { reads, structure } = trackReads(state, (value) => {
          let total = 0;
          for (const item of value.items) {
            total += item.n;
          }
          return total;
        });
        expect(structure).toEqual(['items']);
        expect(reads).toEqual(['items[#a].n', 'items[#b].n']);
      });

      it('map records structure (depends on growth) and element values', () => {
        const state = { items: [{ id: 'a', name: 'x' }, { id: 'b', name: 'y' }] };
        const { reads, structure } = trackReads(state, (value) => value.items.map((item) => item.name));
        expect(structure).toEqual(['items']);
        expect(reads).toEqual(['items[#a].name', 'items[#b].name']);
      });

      it('a positional index read is a value read, not structural', () => {
        const state = { items: [10, 20, 30] };
        const { reads, structure } = trackReads(state, (value) => value.items[1]);
        expect(reads).toEqual(['items.1']);
        expect(structure).toEqual([]);
      });

      it('Object.keys records a structural read of the object', () => {
        const state = { config: { a: 1, b: 2 } };
        const { reads, structure } = trackReads(state, (value) => Object.keys(value.config));
        expect(structure).toContain('config');
        // reading the key set is not reading the values
        expect(reads).not.toContain('config.a');
      });

      it('Object.values records structure plus each value read', () => {
        const state = { config: { a: 1, b: 2 } };
        const { reads, structure } = trackReads(state, (value) => Object.values(value.config));
        expect(structure).toEqual(['config']);
        expect(reads).toEqual(['config.a', 'config.b']);
      });

      it('the structure of the root array reports the empty path', () => {
        const { structure } = trackReads([1, 2, 3], (value) => value.length);
        expect(structure).toEqual(['']);
      });
    });

    describe('existence reads', () => {
      it('`in` records the property path as a value dependency', () => {
        const state = { roles: { admin: true } };
        const { reads } = trackReads(state, (value) => 'admin' in value.roles);
        expect(reads).toEqual(['roles.admin']);
      });
    });

    describe('functions and exotics', () => {
      it('reading a method is not a dependency (only the container reached for it)', () => {
        const state = { items: [1, 2] };
        const { reads, structure } = trackReads(state, (value) => {
          const fn = value.items.reduce;
          return typeof fn;
        });
        // value.items is a real value read; the .reduce method itself is not
        expect(reads).toEqual(['items']);
        expect(structure).toEqual([]);
      });

      it('the reads a method performs are tracked', () => {
        const state = { items: [{ id: 'a', n: 1 }, { id: 'b', n: 2 }] };
        const { reads, structure } = trackReads(state, (value) => value.items.reduce((sum, item) => sum + item.n, 0));
        expect(structure).toEqual(['items']);
        expect(reads).toEqual(['items[#a].n', 'items[#b].n']);
      });

      it('reading an exotic is a single read, no recursion into internals', () => {
        const state = { when: new Date(2020, 0, 1), tags: new Set([1, 2]) };
        const { reads } = trackReads(state, (value) => {
          value.when.getFullYear();
          return value.tags.has(1);
        });
        expect(reads).toEqual(['when', 'tags']);
      });

      it('a Map read does not descend into entries', () => {
        const state = { lookup: new Map([['k', { deep: 1 }]]) };
        const { reads } = trackReads(state, (value) => value.lookup.get('k'));
        expect(reads).toEqual(['lookup']);
      });
    });

    describe('keyed addressing', () => {
      it('id-addresses keyed array elements by default', () => {
        const db = { todos: [{ id: 'a', done: false }, { id: 'b', done: true }] };
        const { reads } = trackReads(db, (value) => value.todos.map((t) => t.done));
        expect(reads).toEqual(['todos[#a].done', 'todos[#b].done']);
      });

      it('keyed: false uses positional paths', () => {
        const db = { todos: [{ id: 'a', done: false }, { id: 'b', done: true }] };
        const { reads } = trackReads(db, (value) => value.todos.map((t) => t.done), {
          keyed: false,
        });
        expect(reads).toEqual(['todos.0.done', 'todos.1.done']);
      });

      it('honors a custom key list', () => {
        const db = { rows: [{ sku: 's1', qty: 1 }] };
        const { reads } = trackReads(db, (value) => value.rows[0].qty, { keys: ['sku'] });
        expect(reads).toEqual(['rows[#s1].qty']);
      });

      it('falls back to positional when an element is unkeyed', () => {
        const db = { rows: [{ qty: 1 }] };
        const { reads } = trackReads(db, (value) => value.rows[0].qty);
        expect(reads).toEqual(['rows.0.qty']);
      });

      it('keyed read paths resolve back through get()', () => {
        const db = { todos: [{ id: 'a', done: false }, { id: 'b', done: true }] };
        const { reads } = trackReads(db, (value) => value.todos.map((t) => t.done));
        expect(reads.map((path) => get(db, path))).toEqual([false, true]);
      });
    });

    describe('nesting and cycles', () => {
      it('tracks reads at full depth', () => {
        const state = { a: { b: { c: { d: 1 } } } };
        const { reads } = trackReads(state, (value) => value.a.b.c.d);
        expect(reads).toEqual(['a.b.c.d']);
      });

      it('is safe on a cyclic structure', () => {
        const node = { name: 'root' };
        node.self = node;
        let result;
        const { reads } = trackReads(node, (value) => {
          result = value.self.self.name;
          return result;
        });
        expect(result).toBe('root');
        // a cycle collapses to first-seen paths (same as trackWrites): the
        // self-edge and the leaf, with no runaway
        expect(reads).toEqual(['self', 'name']);
      });

      it('returns the same wrapper for an object reached twice', () => {
        const shared = { x: 1 };
        const state = { a: shared, b: shared };
        let same;
        trackReads(state, (value) => {
          same = value.a === value.b;
        });
        expect(same).toBe(true);
      });
    });

    describe('no mutation', () => {
      it('does not mutate the input', () => {
        const state = { a: { b: 1 }, items: [{ id: 'x', n: 1 }] };
        const before = clone(state);
        trackReads(state, (value) => {
          value.a.b;
          value.items.map((item) => item.n);
          return Object.keys(value);
        });
        expect(state).toEqual(before);
      });

      it('throws if the callback writes through the wrapper', () => {
        expect(() =>
          trackReads({ a: 1 }, (value) => {
            value.a = 2;
          })
        ).toThrow(/read-only/);
      });

      it('throws if the callback deletes through the wrapper', () => {
        expect(() =>
          trackReads({ a: 1 }, (value) => {
            delete value.a;
          })
        ).toThrow(/read-only/);
      });
    });

    describe('lifecycle', () => {
      it('a tracked value used after the callback throws a clear error', () => {
        let leaked;
        trackReads({ a: { b: 1 } }, (value) => {
          leaked = value.a;
        });
        expect(() => leaked.b).toThrow(/after its callback returned/);
      });

      it('propagates a thrown error and still expires the wrapper', () => {
        let leaked;
        expect(() =>
          trackReads({ a: { b: 1 } }, (value) => {
            leaked = value.a;
            throw new Error('boom');
          })
        ).toThrow('boom');
        expect(() => leaked.b).toThrow(/after its callback returned/);
      });
    });

    describe('onRead', () => {
      it('streams each read with its path and type', () => {
        const events = [];
        const state = { count: 1, items: [{ id: 'a', n: 1 }] };
        trackReads(state, (value) => {
          value.count;
          value.items.map((item) => item.n);
        }, { onRead: (path, type) => events.push([type, path]) });
        expect(events).toEqual([
          ['value', 'count'],
          ['value', 'items'],
          ['structure', 'items'],
          ['value', 'items[#a]'],
          ['value', 'items[#a].n'],
        ]);
      });

      it('returnPaths: false skips collection but still streams', () => {
        const events = [];
        const out = trackReads({ a: { b: 1 } }, (value) => value.a.b, {
          returnPaths: false,
          onRead: (path) => events.push(path),
        });
        expect(out.reads).toBeUndefined();
        expect(out.structure).toBeUndefined();
        expect(events).toEqual(['a', 'a.b']);
      });
    });

    describe('non-trackable and frozen roots', () => {
      it('a primitive root tracks nothing and still returns the result', () => {
        const { reads, structure, result } = trackReads(42, (value) => value + 1);
        expect(reads).toEqual([]);
        expect(structure).toEqual([]);
        expect(result).toBe(43);
      });

      it('a frozen root has no dependencies (immutable) and runs raw', () => {
        const frozen = Object.freeze({ a: 1 });
        const { reads, result } = trackReads(frozen, (value) => value.a);
        expect(reads).toEqual([]);
        expect(result).toBe(1);
      });

      it('a frozen subtree is read at its boundary but not descended', () => {
        const state = { config: Object.freeze({ a: 1 }) };
        const { reads } = trackReads(state, (value) => value.config.a);
        expect(reads).toEqual(['config']);
      });
    });
  });

  describe('elementKey', () => {
    it('returns the first present default key field', () => {
      expect(elementKey({ id: 'a', _id: 'x' })).toBe('a');
      expect(elementKey({ _id: 'b' })).toBe('b');
      expect(elementKey({ hash: 'h' })).toBe('h');
      expect(elementKey({ key: 'k' })).toBe('k');
    });

    it('returns undefined for a scalar or an object carrying no key field', () => {
      expect(elementKey('x')).toBeUndefined();
      expect(elementKey(7)).toBeUndefined();
      expect(elementKey(null)).toBeUndefined();
      expect(elementKey({ name: 'n' })).toBeUndefined();
    });

    it('honors a custom key list', () => {
      expect(elementKey({ sku: 's1' }, ['sku'])).toBe('s1');
      expect(elementKey({ id: 'a', sku: 's1' }, ['sku', 'id'])).toBe('s1');
    });

    it('treats null and undefined fields as absent, skipping to the next key', () => {
      expect(elementKey({ id: null, _id: 'b' })).toBe('b');
      expect(elementKey({ id: undefined, key: 'k' })).toBe('k');
      // a falsy-but-present value is still an identity
      expect(elementKey({ id: 0 })).toBe(0);
      expect(elementKey({ id: '' })).toBe('');
    });
  });

  describe('detectChanges', () => {
    it('reports added, removed, and changed paths', () => {
      const before = { name: 'a', temp: true, count: 1 };
      const after = { name: 'b', count: 1, nickname: 'al' };
      expect(detectChanges(before, after)).toEqual({
        added: ['nickname'],
        removed: ['temp'],
        changed: ['name'],
      });
    });

    it('recurses to leaf paths through nested objects', () => {
      const before = { user: { profile: { name: 'a', age: 1 } } };
      const after = { user: { profile: { name: 'b', age: 1 } } };
      expect(detectChanges(before, after).changed).toEqual(['user.profile.name']);
    });

    it('diffs arrays by index, length differences as added or removed', () => {
      expect(detectChanges({ items: [1, 2, 3] }, { items: [1, 9] })).toEqual({
        added: [],
        removed: ['items.2'],
        changed: ['items.1'],
      });
    });

    it('reports a kind change (object to array) as changed without recursing', () => {
      expect(detectChanges({ a: { x: 1 } }, { a: [1] }).changed).toEqual(['a']);
    });

    it('compares unwalkable values by deep equality at their own path', () => {
      const before = { at: new Date('2020-01-01'), lookup: new Map([['k', 'v']]) };
      const after = { at: new Date('2030-01-01'), lookup: new Map([['k', 'v']]) };
      expect(detectChanges(before, after).changed).toEqual(['at']);
    });

    it('does not report deep-equal values with different references', () => {
      expect(detectChanges({ user: { name: 'a' } }, { user: { name: 'a' } }))
        .toEqual({ added: [], removed: [], changed: [] });
    });

    it('reports differing non-container roots as the empty path', () => {
      expect(detectChanges(1, 2).changed).toEqual(['']);
      expect(detectChanges({ a: 1 }, [1]).changed).toEqual(['']);
      expect(detectChanges(1, 1).changed).toEqual([]);
    });

    it('terminates on cyclic structures', () => {
      const before = { name: 'a' };
      before.self = before;
      const after = { name: 'b' };
      after.self = after;
      expect(detectChanges(before, after).changed).toEqual(['name']);
    });

    describe('equality', () => {
      it('uses a custom comparator to decide what counts as changed', () => {
        expect(detectChanges({ a: 1 }, { a: '1' }, { equality: (x, y) => x == y }))
          .toEqual({ added: [], removed: [], changed: [] });
      });

      it('defaults to strict isEqual', () => {
        expect(detectChanges({ a: 1 }, { a: '1' }).changed).toEqual(['a']);
      });

      it('threads the comparator through keyed element fields', () => {
        const near = (x, y) => (typeof x === 'number' ? Math.abs(x - y) < 0.01 : x === y);
        const before = { items: [{ id: 'a', n: 1 }] };
        const after = { items: [{ id: 'a', n: 1.0001 }] };
        expect(detectChanges(before, after, { equality: near }).changed).toEqual([]);
      });
    });

    describe('ignoreKeys', () => {
      it('drops an ignored key from the changeset', () => {
        expect(detectChanges({ a: 1, b: 2 }, { a: 9, b: 2 }, { ignoreKeys: ['a'] }))
          .toEqual({ added: [], removed: [], changed: [] });
      });

      it('drops an ignored key at any depth', () => {
        const before = { u: { updatedAt: 1, name: 'x' } };
        const after = { u: { updatedAt: 2, name: 'y' } };
        expect(detectChanges(before, after, { ignoreKeys: ['updatedAt'] }).changed).toEqual(['u.name']);
      });

      it('drops an ignored field inside keyed array elements', () => {
        const before = { items: [{ id: 'a', updatedAt: 1, v: 1 }] };
        const after = { items: [{ id: 'a', updatedAt: 2, v: 2 }] };
        expect(detectChanges(before, after, { ignoreKeys: ['updatedAt'] }).changed).toEqual(['items[#a].v']);
      });

      it('suppresses an ignored key that was added or removed', () => {
        expect(detectChanges({ keep: 1 }, { keep: 1, _local: 9 }, { ignoreKeys: ['_local'] }).added).toEqual([]);
        expect(detectChanges({ keep: 1, _local: 9 }, { keep: 1 }, { ignoreKeys: ['_local'] }).removed).toEqual([]);
      });
    });

    describe('collapseKeys', () => {
      it('reports a change inside a collapsed key as the key itself', () => {
        // the subtree's own keys are dynamic path strings that would mis-parse as
        // keyed wire paths if descended, so the key reports as one whole value
        const before = { _overrides: { 'contacts[#1].field': true } };
        const after = { _overrides: { 'contacts[#1].field': false } };
        expect(detectChanges(before, after, { collapseKeys: ['_overrides'] }))
          .toEqual({ added: [], removed: [], changed: ['_overrides'] });
      });

      it('still reports a wholesale add or remove of the collapsed key', () => {
        expect(detectChanges({}, { _overrides: { x: 1 } }, { collapseKeys: ['_overrides'] }).added)
          .toEqual(['_overrides']);
        expect(detectChanges({ _overrides: { x: 1 } }, {}, { collapseKeys: ['_overrides'] }).removed)
          .toEqual(['_overrides']);
      });

      it('reports an inside removal as a change to the key, not a removal of it', () => {
        expect(detectChanges({ K: { x: 1, y: 2 } }, { K: { x: 1 } }, { collapseKeys: ['K'] }))
          .toEqual({ added: [], removed: [], changed: ['K'] });
      });

      it('emits nothing for an unchanged collapsed key', () => {
        expect(detectChanges({ K: { x: 1 } }, { K: { x: 1 } }, { collapseKeys: ['K'] }))
          .toEqual({ added: [], removed: [], changed: [] });
      });

      it('collapses by key name at any depth', () => {
        expect(detectChanges({ a: { K: { x: 1 } } }, { a: { K: { x: 2 } } }, { collapseKeys: ['K'] }).changed)
          .toEqual(['a.K']);
      });

      it('collapses a keyed array to the key instead of per-element paths', () => {
        const before = { items: [{ id: 'a', q: 1 }] };
        const after = { items: [{ id: 'a', q: 2 }, { id: 'b' }] };
        expect(detectChanges(before, after, { collapseKeys: ['items'] }))
          .toEqual({ added: [], removed: [], changed: ['items'] });
      });
    });

    describe('keyed mode', () => {
      it('diffs by identity by default, { keyed: false } opts back to the positional cascade', () => {
        const before = { lineItems: [{ id: 'a', qty: 1 }, { id: 'b', qty: 1 }] };
        const after = { lineItems: [{ id: 'z', qty: 9 }, { id: 'a', qty: 1 }, { id: 'b', qty: 5 }] };
        // keyed is the default now — a prepend plus an edit is one add by key
        expect(detectChanges(before, after)).toEqual({
          added: ['lineItems[#z]'],
          removed: [],
          changed: ['lineItems[#b].qty'],
        });
        // the explicit opt-out restores the index walk, where a prepend cascades
        expect(detectChanges(before, after, { keyed: false })).toEqual({
          added: ['lineItems.2'],
          removed: [],
          changed: ['lineItems.0.id', 'lineItems.0.qty', 'lineItems.1.id'],
        });
      });

      it('diffs by identity under an explicit { keyed: true } too', () => {
        const before = { lineItems: [{ id: 'a', qty: 1 }, { id: 'b', qty: 1 }] };
        const after = { lineItems: [{ id: 'z', qty: 9 }, { id: 'a', qty: 1 }, { id: 'b', qty: 5 }] };
        expect(detectChanges(before, after, { keyed: true })).toEqual({
          added: ['lineItems[#z]'],
          removed: [],
          changed: ['lineItems[#b].qty'],
        });
      });

      it('emits the whole-element path for a removed element', () => {
        const before = { items: [{ id: 'a' }, { id: 'b' }] };
        const after = { items: [{ id: 'a' }] };
        expect(detectChanges(before, after, { keyed: true })).toEqual({
          added: [],
          removed: ['items[#b]'],
          changed: [],
        });
      });

      it('recurses through nested keyed arrays', () => {
        const before = { rows: [{ id: 'r1', tags: [{ id: 't1', on: false }] }] };
        const after = { rows: [{ id: 'r1', tags: [{ id: 't1', on: true }] }] };
        expect(detectChanges(before, after, { keyed: true }).changed)
          .toEqual(['rows[#r1].tags[#t1].on']);
      });

      it('honors a custom key list', () => {
        const before = { a: [{ sku: 's1', q: 1 }] };
        const after = { a: [{ sku: 's1', q: 2 }] };
        expect(detectChanges(before, after, { keyed: true, keys: ['sku'] }).changed)
          .toEqual(['a[#s1].q']);
      });

      it('matches a number id against its String-coerced key', () => {
        const before = { a: [{ id: 7, q: 1 }] };
        const after = { a: [{ id: 7, q: 2 }] };
        expect(detectChanges(before, after, { keyed: true }).changed).toEqual(['a[#7].q']);
      });

      it('falls back to positional emit when an array has a duplicate key', () => {
        const before = { a: [{ id: 'x' }] };
        const after = { a: [{ id: 'x' }, { id: 'x' }] };
        // a keyed map can't represent two elements under one key, so the
        // positional walk runs and emits a parseable path instead
        expect(detectChanges(before, after, { keyed: true }).added).toEqual(['a.1']);
      });

      it('falls back to positional emit when a key value carries a dot', () => {
        const before = { a: [{ id: 'x.y', v: 1 }] };
        const after = { a: [{ id: 'x.y', v: 2 }] };
        expect(detectChanges(before, after, { keyed: true }).changed).toEqual(['a.0.v']);
      });

      it('falls back to positional emit when an element is unkeyed', () => {
        const before = { a: [{ id: 'x', v: 1 }, { v: 2 }] };
        const after = { a: [{ id: 'x', v: 1 }, { v: 3 }] };
        expect(detectChanges(before, after, { keyed: true }).changed).toEqual(['a.1.v']);
      });

      it('round-trips an emitted keyed delta onto a replica in a different order', () => {
        const before = { lineItems: [{ id: 'a', qty: 1 }, { id: 'b', qty: 1 }] };
        const after = { lineItems: [{ id: 'z', qty: 9 }, { id: 'a', qty: 1 }, { id: 'b', qty: 5 }] };
        const diff = detectChanges(before, after, { keyed: true });
        // the replica holds the same elements shuffled, the delta still lands by id
        const replica = { lineItems: [{ id: 'b', qty: 1 }, { id: 'a', qty: 1 }] };
        [...diff.added, ...diff.changed].forEach((path) => set(replica, path, get(after, path)));
        diff.removed.forEach((path) => unset(replica, path));
        expect(replica.lineItems).toEqual([
          { id: 'b', qty: 5 },
          { id: 'a', qty: 1 },
          { id: 'z', qty: 9 },
        ]);
      });
    });
  });

  describe('keys', () => {
    it('keys should return the keys of an object', () => {
      expect(keys({ a: 1, b: 2 })).toEqual(['a', 'b']);
      expect(keys([1, 2, 3])).toEqual(['0', '1', '2']);
    });
  });

  describe('values', () => {
    it('values should return the values of an object', () => {
      expect(values({ a: 1, b: 2 })).toEqual([1, 2]);
      expect(values([1, 2, 3])).toEqual([1, 2, 3]);
    });
  });

  describe('mapObject', () => {
    it('mapObject should create an object with the same keys and mapped values', () => {
      const result = mapObject({ a: 1, b: 2 }, (val) => val * 2);
      expect(result).toEqual({ a: 2, b: 4 });
    });
    it('should create a new object without mutating the original', () => {
      const original = { a: 1, b: 2, c: 3 };
      const mapped = mapObject(original, x => x * 2);

      // Check mapped values are correct
      expect(mapped).toEqual({ a: 2, b: 4, c: 6 });

      // Verify original wasn't mutated
      expect(original).toEqual({ a: 1, b: 2, c: 3 });

      // Verify it's a different object reference
      expect(mapped).not.toBe(original);
    });

    it('should pass both value and key to the callback', () => {
      const original = { a: 1, b: 2 };
      const spy = vi.fn((value, key) => value);

      mapObject(original, spy);

      expect(spy).toHaveBeenCalledWith(1, 'a');
      expect(spy).toHaveBeenCalledWith(2, 'b');
    });

    it('should handle empty objects', () => {
      const original = {};
      const mapped = mapObject(original, x => x * 2);
      expect(mapped).toEqual({});
    });

    it('should handle non-numeric values', () => {
      const original = { a: 'hello', b: 'world' };
      const mapped = mapObject(original, str => str.toUpperCase());
      expect(mapped).toEqual({ a: 'HELLO', b: 'WORLD' });
      expect(original).toEqual({ a: 'hello', b: 'world' });
    });

    it('should preserve keys while mapping values', () => {
      const original = { key1: 1, key2: 2, key3: 3 };
      const mapped = mapObject(original, x => x.toString());
      expect(mapped).toEqual({ key1: '1', key2: '2', key3: '3' });
    });
  });

  describe('extend', () => {
    it('extend should merge properties from source into target, including getters and setters', () => {
      const target = { a: 1 };
      const source = {
        get b() {
          return 2;
        },
        set b(val) {
          this.c = val;
        },
      };
      extend(target, source);
      expect(target.b).toBe(2);
      target.b = 3;
      expect(target.c).toBe(3);
    });
  });

  describe('pick', () => {
    it('pick should create an object composed of the picked properties', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(pick(obj, 'a', 'c')).toEqual({ a: 1, c: 3 });
    });
  });

  describe('filterObject', () => {
    it('should filter an object based on a predicate', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const filtered = filterObject(obj, (value) => value > 1);
      expect(filtered).toEqual({ b: 2, c: 3 });
    });

    it('should return an empty object if no properties match the predicate', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const filtered = filterObject(obj, (value) => value > 10);
      expect(filtered).toEqual({});
    });
  });

  describe('arrayFromObject', () => {
    it('should convert an object to an array of key-value pairs', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const array = arrayFromObject(obj);
      expect(array).toEqual([
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
        { key: 'c', value: 3 },
      ]);
    });

    it('should return the original array if the input is already an array', () => {
      const original = [1, 2, 3];
      const array = arrayFromObject(original);
      expect(array).toEqual(original);
    });
  });

  describe('proxyObject', () => {
    it('should create a proxy that reflects changes in the source object', () => {
      const source = { name: 'John', age: 30 };
      const reference = {};
      const proxy = proxyObject(() => source);

      expect(proxy.name).toBe('John');
      expect(proxy.age).toBe(30);

      source.age = 31;

      expect(proxy.age).toBe(31);
    });

    it('should handle nested properties correctly', () => {
      const source = { person: { name: 'John', age: 30 } };
      const reference = {};
      const proxy = proxyObject(() => source);

      expect(proxy.person.name).toBe('John');
      expect(proxy.person.age).toBe(30);

      source.person.age = 31;

      expect(proxy.person.age).toBe(31);
    });

    it('should handle adding new properties to the source object', () => {
      const source = { name: 'John' };
      const reference = {};
      const proxy = proxyObject(() => source);

      expect(proxy.age).toBeUndefined();

      source.age = 30;

      expect(proxy.age).toBe(30);
    });

    it('should handle deleting properties from the source object', () => {
      const source = { name: 'John', age: 30 };
      const reference = {};
      const proxy = proxyObject(() => source);

      expect(proxy.age).toBe(30);

      delete source.age;

      expect(proxy.age).toBeUndefined();
    });

    it('should not affect the original reference object', () => {
      const source = { name: 'John', age: 30 };
      const reference = { name: 'Jane', age: 25 };
      const proxy = proxyObject(() => source);

      expect(reference.name).toBe('Jane');
      expect(reference.age).toBe(25);

      source.age = 31;

      expect(reference.age).toBe(25);
    });

    it('should reflect updates made to the reference object after proxy creation', () => {
      const source = { name: 'John' };
      const reference = { city: 'Atlanta' };
      const proxy = proxyObject(() => source, reference);

      expect(proxy.city).toBe('Atlanta');
      expect(reference.city).toBe('Atlanta');

      reference.city = 'New Orleans';

      expect(proxy.city).toBe('New Orleans');
      expect(reference.city).toBe('New Orleans');
    });
  });

  describe('set', () => {
    it('sets a simple property', () => {
      const obj = { a: 1 };
      expect(set(obj, 'b', 2)).toBe(obj);
      expect(obj.b).toBe(2);
    });

    it('sets a nested field from a dot path', () => {
      const obj = { a: { b: { c: 1 } } };
      set(obj, 'a.b.c', 9);
      expect(obj.a.b.c).toBe(9);
    });

    it('creates missing intermediate objects', () => {
      const obj = {};
      set(obj, 'a.b.c', 1);
      expect(obj).toEqual({ a: { b: { c: 1 } } });
    });

    it('creates arrays when the next segment is an index', () => {
      const obj = {};
      set(obj, 'items.0.name', 'first');
      expect(Array.isArray(obj.items)).toBe(true);
      expect(obj.items[0].name).toBe('first');
    });

    it('supports bracket notation, creating the array when missing', () => {
      const obj = {};
      set(obj, 'items[1].name', 'second');
      expect(Array.isArray(obj.items)).toBe(true);
      expect(obj.items[1].name).toBe('second');
    });

    it('overwrites a primitive midpoint with a container', () => {
      const obj = { a: 5 };
      set(obj, 'a.b', 1);
      expect(obj.a).toEqual({ b: 1 });
    });

    it('assigns to an existing literal dotted key, mirroring get()', () => {
      const obj = { 'a.b': 1 };
      set(obj, 'a.b', 2);
      expect(obj['a.b']).toBe(2);
      expect(obj.a).toBeUndefined();
    });

    it('steps into an existing literal dotted key midway', () => {
      const obj = { 'a.b': { c: 1 } };
      set(obj, 'a.b.c', 9);
      expect(obj['a.b'].c).toBe(9);
      expect(get(obj, 'a.b.c')).toBe(9);
    });

    it('refuses prototype-climbing segments', () => {
      const obj = {};
      set(obj, '__proto__.polluted', true);
      set(obj, 'constructor.prototype.polluted', true);
      expect(obj).toEqual({});
      expect({}.polluted).toBeUndefined();
    });

    it('no-ops on a non-string path, empty path, or primitive target', () => {
      const obj = { a: 1 };
      expect(set(obj, undefined, 2)).toBe(obj);
      expect(set(obj, '', 2)).toBe(obj);
      expect(set(42, 'a', 2)).toBe(42);
      expect(obj).toEqual({ a: 1 });
    });

    it('round-trips trackWrites paths onto a second object', () => {
      const source = { meta: { count: 0 }, items: [{ name: 'a' }] };
      const replica = { meta: { count: 0 }, items: [{ name: 'a' }] };
      const { paths } = trackWrites(source, (value) => {
        value.meta.count = 5;
        value.items[0].name = 'z';
      });
      paths.forEach((path) => set(replica, path, get(source, path)));
      expect(replica).toEqual(source);
    });

    it('applies a detectChanges diff onto a copy of before', () => {
      const before = { name: 'a', count: 1, meta: { temp: true, keep: 1 } };
      const after = { name: 'b', count: 1, nickname: 'al', meta: { keep: 1 } };
      const diff = detectChanges(before, after);
      const replica = structuredClone(before);
      [...diff.added, ...diff.changed].forEach((path) => set(replica, path, get(after, path)));
      diff.removed.forEach((path) => unset(replica, path));
      expect(replica).toEqual(after);
    });

    describe('keyed addressing', () => {
      it('replaces the matched element in place when the key is present', () => {
        const doc = { items: [{ id: 'a', n: 1 }, { id: 'b', n: 2 }] };
        set(doc, 'items[#a]', { id: 'a', n: 100 });
        expect(doc.items).toEqual([{ id: 'a', n: 100 }, { id: 'b', n: 2 }]);
      });

      it('appends a new element when the key is absent', () => {
        const doc = { items: [{ id: 'a', n: 1 }] };
        set(doc, 'items[#d]', { id: 'd', n: 4 });
        expect(doc.items.map((x) => x.id)).toEqual(['a', 'd']);
      });

      it('writes a field through a present key', () => {
        const doc = { items: [{ id: 'a', n: 1 }, { id: 'b', n: 2 }] };
        set(doc, 'items[#b].n', 20);
        expect(doc.items[1].n).toBe(20);
      });

      it('is a no-op for a field write through an absent key', () => {
        const doc = { items: [{ id: 'a', n: 1 }] };
        set(doc, 'items[#gone].n', 999);
        expect(doc.items).toEqual([{ id: 'a', n: 1 }]);
      });

      it('matches a number id against its String-coerced key', () => {
        const doc = { items: [{ id: 7, n: 1 }] };
        set(doc, 'items[#7].n', 9);
        expect(doc.items[0].n).toBe(9);
      });

      it('honors a custom key list', () => {
        const doc = { a: [{ sku: 's1', q: 1 }] };
        set(doc, 'a[#s1].q', 9, ['sku']);
        expect(doc.a[0].q).toBe(9);
      });

      it('appends through a [#__proto__] keyed value without polluting Object.prototype', () => {
        // the proto guard regex is intentionally not extended to keyed bodies — the
        // value only ever ===-compares, it is never used as a property name
        const doc = { a: [{ id: 'real' }] };
        set(doc, 'a[#__proto__]', { id: '__proto__' });
        expect(doc.a).toHaveLength(2);
        expect({}.polluted).toBeUndefined();
        expect(Object.prototype.polluted).toBeUndefined();
      });
    });
  });

  describe('unset', () => {
    it('removes a simple property', () => {
      const obj = { a: 1, b: 2 };
      expect(unset(obj, 'b')).toBe(obj);
      expect(obj).toEqual({ a: 1 });
    });

    it('removes a nested field from a dot path', () => {
      const obj = { a: { b: { c: 1, d: 2 } } };
      unset(obj, 'a.b.c');
      expect(obj).toEqual({ a: { b: { d: 2 } } });
    });

    it('no-ops on a missing path without creating intermediates', () => {
      const obj = { a: 1 };
      unset(obj, 'x.y.z');
      expect(obj).toEqual({ a: 1 });
    });

    it('leaves a hole at a removed array index so sibling paths stay valid', () => {
      const obj = { items: ['a', 'b', 'c'] };
      unset(obj, 'items.1');
      expect(Object.hasOwn(obj.items, 1)).toBe(false);
      expect(obj.items[2]).toBe('c');
      expect(obj.items.length).toBe(3);
    });

    it('supports bracket notation', () => {
      const obj = { items: ['a', 'b'] };
      unset(obj, 'items[0]');
      expect(Object.hasOwn(obj.items, 0)).toBe(false);
    });

    it('removes an existing literal dotted key, mirroring get()', () => {
      const obj = { 'a.b': 1, c: 2 };
      unset(obj, 'a.b');
      expect(Object.hasOwn(obj, 'a.b')).toBe(false);
      expect(obj.c).toBe(2);
    });

    it('refuses prototype-climbing segments', () => {
      const obj = { a: 1 };
      unset(obj, '__proto__.toString');
      unset(obj, 'constructor.prototype');
      expect(typeof obj.toString).toBe('function');
    });

    it('no-ops on a non-string path, empty path, primitive target, or primitive midpoint', () => {
      const obj = { a: 1 };
      expect(unset(obj, undefined)).toBe(obj);
      expect(unset(obj, '')).toBe(obj);
      expect(unset(42, 'a')).toBe(42);
      unset(obj, 'a.b.c');
      expect(obj).toEqual({ a: 1 });
    });

    describe('keyed addressing', () => {
      it('splices the matched element out, leaving no positional hole', () => {
        const doc = { items: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] };
        unset(doc, 'items[#b]');
        expect(doc.items.map((x) => x.id)).toEqual(['a', 'c']);
        expect(doc.items.length).toBe(2);
      });

      it('no-ops when the key is absent', () => {
        const doc = { items: [{ id: 'a' }] };
        unset(doc, 'items[#gone]');
        expect(doc.items).toEqual([{ id: 'a' }]);
      });

      it('removes a field through a present key', () => {
        const doc = { items: [{ id: 'a', n: 1, drop: true }] };
        unset(doc, 'items[#a].drop');
        expect(doc.items[0]).toEqual({ id: 'a', n: 1 });
      });

      it('honors a custom key list', () => {
        const doc = { a: [{ sku: 's1' }, { sku: 's2' }] };
        unset(doc, 'a[#s1]', ['sku']);
        expect(doc.a.map((x) => x.sku)).toEqual(['s2']);
      });
    });
  });

  describe('get', () => {
    it('get should support array like "arr.1.value" notation in lookup', () => {
      const obj = { arr: [{ value: 1 }, { value: 2 }] };
      expect(get(obj, 'arr.1.value')).toBe(2);
    });

    it('get should access a nested object field from a string', () => {
      const obj = { a: { b: { c: 1 } } };
      expect(get(obj, 'a.b.c')).toBe(1);
      expect(get(obj, 'a.b.c.d')).toBeUndefined();
    });

    it('get should support files with "." in the key', () => {
      const obj = { 'a.b': 1 };
      expect(get(obj, 'a.b')).toBe(1);
    });

    it('get should support deeply nested files with "." in the key', () => {
      const obj = { a: { 'b.c': 1 } };
      expect(get(obj, 'a.b.c')).toBe(1);
    });

    it('get should return undefined when accessing a non-existent nested key', () => {
      const obj = { a: { b: { c: 1 } } };
      expect(get(obj, 'a.b.d')).toBeUndefined();
    });

    it('get should support accessing nested keys with dots and array indexes', () => {
      const obj = { 'a.b': [{ 'c.d': 1 }, { 'c.d': 2 }] };
      expect(get(obj, 'a.b.1.c.d')).toBe(2);
    });

    it('get should return undefined when accessing an out-of-bounds array index', () => {
      const obj = { arr: [1, 2, 3] };
      expect(get(obj, 'arr.3')).toBeUndefined();
    });

    it('get should return undefined when accessing a non-existent array index', () => {
      const obj = { a: { b: [1, 2, 3] } };
      expect(get(obj, 'a.c.1')).toBeUndefined();
    });

    it('should support bracket notation for array access', () => {
      const obj = { items: ['a', 'b', 'c'] };
      expect(get(obj, 'items[1]')).toBe('b');
    });

    it('should support bracket notation with nested access', () => {
      const obj = { data: [{ name: 'first' }, { name: 'second' }] };
      expect(get(obj, 'data[1].name')).toBe('second');
    });

    it('should return undefined for bracket access on missing key', () => {
      const obj = { items: ['a'] };
      expect(get(obj, 'missing[0]')).toBeUndefined();
    });

    it('should handle simple property access without dots', () => {
      const obj = { name: 'test' };
      expect(get(obj, 'name')).toBe('test');
    });

    it('should return undefined for non-string path', () => {
      expect(get({ a: 1 }, 123)).toBeUndefined();
      expect(get({ a: 1 }, null)).toBeUndefined();
    });

    it('should return undefined for null or non-object input', () => {
      expect(get(null, 'a')).toBeUndefined();
      expect(get(42, 'a')).toBeUndefined();
      expect(get('string', 'a')).toBeUndefined();
    });

    it('should handle combined dotted keys with further nesting', () => {
      const obj = { 'a.b': { c: 42 } };
      expect(get(obj, 'a.b.c')).toBe(42);
    });

    describe('keyed addressing', () => {
      it('reads a field through a present key', () => {
        const doc = { items: [{ id: 'a', n: 1 }, { id: 'b', n: 2 }] };
        expect(get(doc, 'items[#b].n')).toBe(2);
      });

      it('returns the matched element when the path ends at the key', () => {
        const doc = { items: [{ id: 'a', n: 1 }, { id: 'b', n: 2 }] };
        expect(get(doc, 'items[#a]')).toEqual({ id: 'a', n: 1 });
      });

      it('returns undefined for an absent key', () => {
        const doc = { items: [{ id: 'a', n: 1 }] };
        expect(get(doc, 'items[#zzz].n')).toBeUndefined();
        expect(get(doc, 'items[#zzz]')).toBeUndefined();
      });

      it('selects by identity, not position — [#42] matches id "42", [1] stays positional', () => {
        const doc = { a: [{ id: '42', v: 'by-id' }, { id: 'x', v: 'other' }] };
        expect(get(doc, 'a[#42].v')).toBe('by-id');
        expect(get(doc, 'a[1].v')).toBe('other');
      });

      it('matches a number id against its String-coerced key', () => {
        expect(get({ a: [{ id: 7, v: 'seven' }] }, 'a[#7].v')).toBe('seven');
      });

      it('honors a custom key list', () => {
        const doc = { a: [{ sku: 's1', q: 1 }] };
        expect(get(doc, 'a[#s1].q', ['sku'])).toBe(1);
      });

      it('recurses through nested keyed arrays', () => {
        const doc = { rows: [{ id: 'r1', tags: [{ id: 't1', on: true }] }] };
        expect(get(doc, 'rows[#r1].tags[#t1].on')).toBe(true);
      });
    });
  });

  describe('hasProperty', () => {
    it('hasProperty should return true if the object has the specified property', () => {
      const obj = { a: 1, b: undefined };
      expect(hasProperty(obj, 'a')).toBe(true);
      expect(hasProperty(obj, 'b')).toBe(true);
      expect(hasProperty(obj, 'c')).toBe(false);
    });
  });

  describe('reverseKeys', () => {
    it("reverseKeys should reverse a lookup object's keys and values", () => {
      const obj = { a: 1, b: [1, 2], c: 2 };
      const reversed = reverseKeys(obj);
      expect(reversed).toEqual({ '1': ['a', 'b'], '2': ['b', 'c'] });
    });

    it('reverseKeys should reverse array values', () => {
      const obj = { a: [1, 2], b: [2, 3], c: 1 };
      const reversed = reverseKeys(obj);
      expect(reversed).toEqual({ '1': ['a', 'c'], '2': ['a', 'b'], '3': 'b' });
    });
  });

  describe('weightedObjectSearch', () => {
    const testData = [
      { name: 'Apple iPhone', category: 'phone', tags: ['mobile', 'apple'] },
      { name: 'Samsung Galaxy', category: 'phone', tags: ['mobile', 'android'] },
      { name: 'iPad Pro', category: 'tablet', tags: ['tablet', 'apple'] },
      { name: 'MacBook Air', category: 'laptop', tags: ['laptop', 'apple'] },
    ];

    it('should return all objects when query is empty', () => {
      const result = weightedObjectSearch('', testData, {
        propertiesToMatch: ['name', 'category'],
      });
      expect(result).toEqual(testData);
    });

    it('should filter objects based on query match', () => {
      const result = weightedObjectSearch('apple', testData, {
        propertiesToMatch: ['name', 'category', 'tags'],
      });
      expect(result.length).toBe(3);
      expect(result.some(item => item.name === 'Apple iPhone')).toBe(true);
      expect(result.some(item => item.name === 'iPad Pro')).toBe(true);
      expect(result.some(item => item.name === 'MacBook Air')).toBe(true);
    });

    it('should sort results by relevance (weight)', () => {
      const result = weightedObjectSearch('apple', testData, {
        propertiesToMatch: ['name', 'category', 'tags'],
      });
      expect(result[0].name).toBe('Apple iPhone');
    });

    it('should handle queries with multiple words when matchAllWords is true', () => {
      const multiData = [
        { name: 'Apple laptop', category: 'computer' },
        { name: 'Samsung laptop', category: 'computer' },
        { name: 'Apple tablet', category: 'tablet' },
      ];
      const result = weightedObjectSearch('Apple laptop', multiData, {
        propertiesToMatch: ['name', 'category'],
        matchAllWords: true,
      });
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].name).toBe('Apple laptop');
    });

    it('should return matches with details when returnMatches is true', () => {
      const result = weightedObjectSearch('apple', testData, {
        propertiesToMatch: ['name', 'tags'],
        returnMatches: true,
      });
      expect(result[0].matches).toBeDefined();
      expect(Array.isArray(result[0].matches)).toBe(true);
    });

    it('should handle single word match with case insensitivity', () => {
      const result = weightedObjectSearch('IPHONE', testData, {
        propertiesToMatch: ['name'],
      });
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Apple iPhone');
    });

    it('should find items with ANY word when matchAllWords is false', () => {
      const freshData = [
        { name: 'Apple iPhone' },
        { name: 'Samsung Galaxy' },
      ];
      const result = weightedObjectSearch('apple samsung', freshData, {
        propertiesToMatch: ['name'],
        matchAllWords: false,
      });
      expect(result.length).toBe(2);
      expect(result.some(r => r.name === 'Apple iPhone')).toBe(true);
      expect(result.some(r => r.name === 'Samsung Galaxy')).toBe(true);
    });

    it('should handle special regex characters in query', () => {
      const specialData = [
        { name: 'Test (special)', category: 'test' },
        { name: 'Normal item', category: 'test' },
      ];
      const result = weightedObjectSearch('special', specialData, {
        propertiesToMatch: ['name'],
      });
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Test (special)');
    });

    it('should handle trimmed queries', () => {
      const result = weightedObjectSearch('  iPhone  ', testData, {
        propertiesToMatch: ['name'],
      });
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Apple iPhone');
    });

    it('should return empty array when no matches found', () => {
      const result = weightedObjectSearch('nonexistent', testData, {
        propertiesToMatch: ['name', 'category'],
      });
      expect(result).toEqual([]);
    });

    it('should rank startsWith above wordStartsWith above anywhere', () => {
      const data = [
        { name: 'Snapple Juice' }, // anywhere: "apple" inside "Snapple"
        { name: 'Green Apple' }, // wordStartsWith: "Apple" starts a word
        { name: 'Apple Pie' }, // startsWith: begins with "Apple"
      ];
      const result = weightedObjectSearch('apple', data, {
        propertiesToMatch: ['name'],
      });
      expect(result[0].name).toBe('Apple Pie');
      expect(result[1].name).toBe('Green Apple');
      expect(result[2].name).toBe('Snapple Juice');
    });

    it('should support dot-path property access', () => {
      const data = [
        { user: { profile: { name: 'Alice' } } },
        { user: { profile: { name: 'Bob' } } },
      ];
      const result = weightedObjectSearch('alice', data, {
        propertiesToMatch: ['user.profile.name'],
      });
      expect(result.length).toBe(1);
      expect(result[0].user.profile.name).toBe('Alice');
    });

    it('should search array field values as joined string', () => {
      const data = [
        { name: 'Item A', tags: ['frontend', 'react'] },
        { name: 'Item B', tags: ['backend', 'node'] },
      ];
      const result = weightedObjectSearch('react', data, {
        propertiesToMatch: ['tags'],
      });
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Item A');
    });

    it('should rank more matched words higher with fractional scoring', () => {
      const data = [
        { name: 'red large button primary' },
        { name: 'red button' },
        { name: 'red large button' },
      ];
      const result = weightedObjectSearch('red large button', data, {
        propertiesToMatch: ['name'],
        matchAllWords: false,
      });
      // 3/3 words matched ranks above 2/3 which ranks above 1/3
      expect(result[0].name).toBe('red large button primary');
      expect(result[1].name).toBe('red large button');
    });

    it('should handle regex special characters in the query itself', () => {
      const data = [
        { name: 'price ($5.00)' },
        { name: 'regular item' },
      ];
      const result = weightedObjectSearch('($5.00)', data, {
        propertiesToMatch: ['name'],
      });
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('price ($5.00)');
    });

    it('should not mutate original objects when returnMatches is true', () => {
      const data = [
        { name: 'Apple' },
        { name: 'Banana' },
      ];
      weightedObjectSearch('apple', data, {
        propertiesToMatch: ['name'],
        returnMatches: true,
      });
      expect(data[0].matches).toBeUndefined();
      expect(data[1].matches).toBeUndefined();
    });
  });

  describe('onlyKeys', () => {
    it('should return an object with only the specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = onlyKeys(obj, ['a', 'c']);
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should return an empty object if no keys are specified', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = onlyKeys(obj, []);
      expect(result).toEqual({});
    });
  });

  describe('any', () => {
    it('should be an alias for some', () => {
      expect(any).toBe(some);
    });
  });

  describe('assignInPlace', () => {
    it('should assign source properties to target', () => {
      const target = { a: 1 };
      const source = { b: 2, c: 3 };
      assignInPlace(target, source);
      expect(target).toEqual({ b: 2, c: 3 });
    });

    it('should delete keys from target not present in source', () => {
      const target = { a: 1, b: 2, stale: 'gone' };
      const source = { a: 10, b: 20 };
      assignInPlace(target, source);
      expect(target).toEqual({ a: 10, b: 20 });
      expect('stale' in target).toBe(false);
    });

    it('should preserve existing keys when preserveExistingKeys is true', () => {
      const target = { a: 1, keep: 'me' };
      const source = { a: 10, b: 2 };
      assignInPlace(target, source, { preserveExistingKeys: true });
      expect(target).toEqual({ a: 10, keep: 'me', b: 2 });
    });

    it('should return the same object reference', () => {
      const target = { a: 1 };
      const source = { b: 2 };
      const result = assignInPlace(target, source);
      expect(result).toBe(target);
    });

    it('should clear target when source is empty', () => {
      const target = { a: 1, b: 2 };
      assignInPlace(target, {});
      expect(target).toEqual({});
    });

    it('should populate empty target from source', () => {
      const target = {};
      const source = { a: 1, b: 2 };
      assignInPlace(target, source);
      expect(target).toEqual({ a: 1, b: 2 });
    });
  });

  describe('deepExtend', () => {
    it('should deeply merge objects', () => {
      const target = { a: { b: 1, c: 2 }, d: 3 };
      const source = { a: { b: 4, e: 5 }, f: 6 };

      const result = deepExtend(target, source);

      expect(result).toBe(target); // Should return target reference
      expect(result).toEqual({
        a: { b: 4, c: 2, e: 5 },
        d: 3,
        f: 6,
      });
    });

    it('should handle multiple sources', () => {
      const target = { a: { x: 1 } };
      const source1 = { a: { y: 2 }, b: 1 };
      const source2 = { a: { z: 3 }, c: 2 };

      deepExtend(target, source1, source2);

      expect(target).toEqual({
        a: { x: 1, y: 2, z: 3 },
        b: 1,
        c: 2,
      });
    });

    it('should clone non-plain objects', () => {
      const date = new Date('2023-01-01');
      const regex = /test/g;
      const arr = [1, 2, { nested: true }];

      const target = {};
      const source = { date, regex, arr };

      deepExtend(target, source);

      expect(target.date).toEqual(date);
      expect(target.date).not.toBe(date); // Should be cloned
      expect(target.regex).toEqual(regex);
      expect(target.regex).not.toBe(regex); // Should be cloned
      expect(target.arr).toEqual(arr);
      expect(target.arr).not.toBe(arr); // Should be cloned
      expect(target.arr[2]).not.toBe(arr[2]); // Deep clone
    });

    it('should not preserve custom class instances when preserveNonCloneable is false', () => {
      class CustomClass {
        constructor(value) {
          this.value = value;
        }
        getValue() {
          return this.value;
        }
      }

      const instance = new CustomClass(42);
      const target = {};
      const source = { custom: instance };

      deepExtend(target, source, { preserveNonCloneable: false });

      expect(target.custom).not.toBe(instance); // Same reference
      expect(target.custom instanceof CustomClass).toBe(false);
    });

    it('should preserve custom class instances by default', () => {
      class CustomClass {
        constructor(value) {
          this.value = value;
        }
        getValue() {
          return this.value;
        }
      }

      const instance = new CustomClass(42);
      const target = {};
      const source = { custom: instance };

      deepExtend(target, source);

      expect(target.custom).toBe(instance);
      expect(target.custom instanceof CustomClass).toBe(true);
      expect(target.custom.value).toBe(42);
      expect(target.custom.getValue).toBeDefined();
    });

    it('should skip __proto__ for security', () => {
      const target = {};
      // JSON.parse creates an actual own property named "__proto__"
      // unlike literal { __proto__: ... } which sets the prototype
      const source = JSON.parse('{"__proto__": {"malicious": true}, "safe": "value"}');

      deepExtend(target, source);

      expect(target.safe).toBe('value');
      expect(target.malicious).toBeUndefined();
      // __proto__ should not have been copied as a property
      expect(Object.hasOwnProperty.call(target, '__proto__')).toBe(false);
    });

    it('should prevent recursion', () => {
      const target = { a: 1 };
      const source = { b: 2 };
      source.circular = target; // Create circular reference

      deepExtend(target, source);

      expect(target.a).toBe(1);
      expect(target.b).toBe(2);
      expect(target.circular).toBeUndefined(); // Should not add circular reference
    });

    it('should skip non-plain objects as sources', () => {
      const target = { a: 1 };
      const date = new Date();
      const array = [1, 2, 3];

      deepExtend(target, date, array, null, undefined);

      expect(target).toEqual({ a: 1 }); // Should remain unchanged
    });

    it('should return target unchanged if target is not an object', () => {
      expect(deepExtend(null, { a: 1 })).toBe(null);
      expect(deepExtend(undefined, { a: 1 })).toBe(undefined);
      expect(deepExtend(42, { a: 1 })).toBe(42);
      expect(deepExtend('string', { a: 1 })).toBe('string');
    });

    it('should overwrite target properties when source has non-plain objects', () => {
      const target = { a: { deep: 'value' } };
      const source = { a: [1, 2, 3] };

      deepExtend(target, source);

      expect(target.a).toEqual([1, 2, 3]);
      expect(target.a).not.toBe(source.a); // Should be cloned
    });

    it('should create new objects when target property is non-plain', () => {
      const target = { a: [1, 2, 3] };
      const source = { a: { b: 'value' } };

      deepExtend(target, source);

      expect(target.a).toEqual({ b: 'value' });
    });

    it('should handle deeply nested structures', () => {
      const target = {
        level1: {
          level2: {
            level3: {
              value: 'original',
            },
          },
        },
      };

      const source = {
        level1: {
          level2: {
            level3: {
              newValue: 'added',
            },
            newLevel3: 'also added',
          },
        },
      };

      deepExtend(target, source);

      expect(target).toEqual({
        level1: {
          level2: {
            level3: {
              value: 'original',
              newValue: 'added',
            },
            newLevel3: 'also added',
          },
        },
      });
    });
  });
});

describe('get — bracket notation', () => {
  it('should access array elements with bracket notation', () => {
    const obj = { items: ['zero', 'one', 'two'] };
    expect(get(obj, 'items[1]')).toBe('one');
  });

  it('should access nested properties after bracket notation', () => {
    const obj = { users: [{ name: 'Alice' }, { name: 'Bob' }] };
    expect(get(obj, 'users[0].name')).toBe('Alice');
  });

  it('should return undefined for out-of-bounds bracket index', () => {
    const obj = { arr: [1, 2] };
    expect(get(obj, 'arr[5]')).toBeUndefined();
  });

  it('should return undefined for non-object inputs', () => {
    expect(get(null, 'a')).toBeUndefined();
    expect(get(undefined, 'a')).toBeUndefined();
    expect(get(42, 'a')).toBeUndefined();
  });

  it('should handle simple property access (no dots)', () => {
    expect(get({ name: 'test' }, 'name')).toBe('test');
  });

  it('should return undefined for non-string paths', () => {
    expect(get({ a: 1 }, 42)).toBeUndefined();
    expect(get({ a: 1 }, null)).toBeUndefined();
  });
});

describe('assignInPlace — returnChanged', () => {
  it('should return true when changes were made', () => {
    const target = { a: 1 };
    const source = { a: 2 };
    const changed = assignInPlace(target, source, { returnChanged: true });
    expect(changed).toBe(true);
  });

  it('should return false when no changes were made', () => {
    const target = { a: 1 };
    const source = { a: 1 };
    const changed = assignInPlace(target, source, { returnChanged: true });
    expect(changed).toBe(false);
  });

  it('should detect deletion as a change', () => {
    const target = { a: 1, b: 2 };
    const source = { a: 1 };
    const changed = assignInPlace(target, source, { returnChanged: true });
    expect(changed).toBe(true);
    expect(target).toEqual({ a: 1 });
  });

  it('should detect addition as a change', () => {
    const target = { a: 1 };
    const source = { a: 1, b: 2 };
    const changed = assignInPlace(target, source, { returnChanged: true });
    expect(changed).toBe(true);
    expect(target).toEqual({ a: 1, b: 2 });
  });
});

describe('deepExtend — preserveNonCloneable option', () => {
  it('should accept preserveDOM and preserveNonCloneable as last arg', () => {
    class Custom {
      constructor(v) {
        this.v = v;
      }
    }
    const inst = new Custom(1);
    const target = {};
    deepExtend(target, { custom: inst }, { preserveNonCloneable: true });
    expect(target.custom).toBe(inst);
  });

  it('should clone class instances when preserveNonCloneable is false', () => {
    class Custom {
      constructor(v) {
        this.v = v;
      }
    }
    const inst = new Custom(1);
    const target = {};
    deepExtend(target, { custom: inst }, { preserveNonCloneable: false });
    expect(target.custom).not.toBe(inst);
    expect(target.custom.v).toBe(1);
  });
});

describe('keyedPath', () => {
  const doc = () => ({
    lines: [{ id: 'a', tax: 1, tags: ['x', 'y'] }, { id: 'b' }],
    plain: [{ n: 1 }],
    deep: { rows: [{ _id: 7, cell: { v: 1 } }] },
  });

  it('rewrites positional segments to the keyed form where elements carry identity', () => {
    expect(keyedPath(doc(), 'lines.0.tax')).toBe('lines[#a].tax');
    expect(keyedPath(doc(), 'lines[1]')).toBe('lines[#b]');
    expect(keyedPath(doc(), 'deep.rows.0.cell.v')).toBe('deep.rows[#7].cell.v');
  });

  it('leaves keyless arrays and inner value-lists positional', () => {
    expect(keyedPath(doc(), 'plain.0.n')).toBe('plain.0.n');
    expect(keyedPath(doc(), 'lines.0.tags.1')).toBe('lines[#a].tags.1');
  });

  it('returns the input string itself when nothing rewrites, for reference comparison', () => {
    const keyed = 'lines[#a].tax';
    expect(keyedPath(doc(), keyed)).toBe(keyed);
    const scalar = 'title';
    expect(keyedPath(doc(), scalar)).toBe(scalar);
    const unresolvable = 'nope.0.x';
    expect(keyedPath(doc(), unresolvable)).toBe(unresolvable);
  });

  it('leaves an unsafe or absent identity positional', () => {
    const dotted = { rows: [{ id: 'a.b' }] };
    expect(keyedPath(dotted, 'rows.0')).toBe('rows.0');
    const holes = { rows: [undefined] };
    expect(keyedPath(holes, 'rows.0')).toBe('rows.0');
  });
});

describe('array-root bracket paths', () => {
  it('get resolves a leading bracket segment against an array root', () => {
    const arr = [{ id: 'a', done: false }, { id: 'b', done: true }];
    expect(get(arr, '[0].done')).toBe(false);
    expect(get(arr, '[#b].done')).toBe(true);
    expect(get(arr, '[#zzz].done')).toBe(undefined);
    expect(get({ x: 1 }, '[0].y')).toBe(undefined);
  });

  it('set writes through a leading bracket segment, no-op when the root is not an array', () => {
    const arr = [{ id: 'a', done: false }];
    set(arr, '[#a].done', true);
    expect(arr[0].done).toBe(true);
    set(arr, '[0].qty', 5);
    expect(arr[0].qty).toBe(5);
    const obj = { x: 1 };
    set(obj, '[0].y', 2);
    expect(obj).toEqual({ x: 1 });
  });

  it('unset removes through a leading bracket segment', () => {
    const arr = [{ id: 'a', done: true, note: 'x' }];
    unset(arr, '[#a].note');
    expect(arr[0]).toEqual({ id: 'a', done: true });
    unset(arr, '[#a]');
    expect(arr.length).toBe(0);
  });
});
