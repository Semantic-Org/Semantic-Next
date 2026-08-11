import {
  detectChanges,
  eachPath,
  elementKey,
  elementPath,
  expandPath,
  get,
  has,
  isPathKey,
  keyedPath,
  parsePath,
  pathCovers,
  pathFrom,
  pathKey,
  pathsOverlap,
  patternFrom,
  set,
  splitPath,
  trackWrites,
  unset,
} from '@semantic-ui/utils';

import { describe, expect, it } from 'vitest';

describe('Path Utilities', () => {
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

      it('writes through ids carrying dots', () => {
        const doc = { users: [{ id: 'jack@semantic-ui.com', role: 'admin' }, { id: '200.40.50', role: 'editor' }] };
        set(doc, 'users[#jack@semantic-ui.com].role', 'owner');
        set(doc, 'users[#200.40.50].role', 'viewer');
        expect(doc.users.map((u) => u.role)).toEqual(['owner', 'viewer']);
      });

      it('a dotted id carrying a prototype word is identity, not a climb', () => {
        const doc = { users: [{ id: 'mail.constructor.dev', role: 'admin' }] };
        set(doc, 'users[#mail.constructor.dev].role', 'owner');
        expect(doc.users[0].role).toBe('owner');
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

      it('splices through an id carrying dots', () => {
        const doc = { users: [{ id: 'jack@semantic-ui.com' }, { id: 'sara@semantic-ui.com' }] };
        unset(doc, 'users[#jack@semantic-ui.com]');
        expect(doc.users.map((u) => u.id)).toEqual(['sara@semantic-ui.com']);
      });
    });
  });

  describe('has', () => {
    it('distinguishes a stored undefined from a missing path', () => {
      const obj = { a: undefined, b: { c: undefined } };
      expect(has(obj, 'a')).toBe(true);
      expect(has(obj, 'b.c')).toBe(true);
      expect(has(obj, 'missing')).toBe(false);
      expect(has(obj, 'b.missing')).toBe(false);
      expect(has(obj, 'a.deeper')).toBe(false);
    });

    it('resolves array indices and keyed segments', () => {
      const obj = { items: [{ id: 'x', done: undefined }, { id: 'y' }] };
      expect(has(obj, 'items[0]')).toBe(true);
      expect(has(obj, 'items[2]')).toBe(false);
      expect(has(obj, 'items[#x].done')).toBe(true);
      expect(has(obj, 'items[#x].missing')).toBe(false);
      expect(has(obj, 'items[#z]')).toBe(false);
      expect(has({ u: [{ id: 'a@b.co', v: undefined }] }, 'u[#a@b.co].v')).toBe(true);
    });

    it('resolves literal dotted keys like get does', () => {
      const obj = { 'a.b': 1, outer: { 'x.y': undefined } };
      expect(has(obj, 'a.b')).toBe(true);
      expect(has(obj, 'outer.x.y')).toBe(true);
    });

    it('resolves consecutive literal dotted keys', () => {
      // a combined-key hop must advance the remainder cursor past both parts,
      // or the next literal-key probe substrings from mid-key
      const obj = { 'a.b': { 'c.d.e': 1 } };
      expect(get(obj, 'a.b.c.d.e')).toBe(1);
      expect(has(obj, 'a.b.c.d.e')).toBe(true);
      expect(has(obj, 'a.b.c.d.x')).toBe(false);
    });

    it('rejects non-object roots and non-string paths', () => {
      expect(has(null, 'a')).toBe(false);
      expect(has(5, 'a')).toBe(false);
      expect(has({ a: 1 }, 42)).toBe(false);
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

      it('an id may carry any character except "]"', () => {
        const doc = {
          items: [
            { id: '200.40.50', n: 1 },
            { id: 'jack@semantic-ui.com', n: 2 },
            { id: 'a[0', n: 3 },
            { id: 'v 2.0 (beta)', n: 4 },
          ],
        };
        expect(get(doc, 'items[#200.40.50].n')).toBe(1);
        expect(get(doc, 'items[#jack@semantic-ui.com].n')).toBe(2);
        expect(get(doc, 'items[#a[0].n')).toBe(3);
        expect(get(doc, 'items[#v 2.0 (beta)].n')).toBe(4);
      });

      it('a leading "#" in an id doubles in the path — [##launch] matches id "#launch"', () => {
        const doc = { tags: [{ id: '#launch', n: 1 }] };
        expect(get(doc, 'tags[##launch].n')).toBe(1);
      });

      it('recurses through nested keyed arrays with dotted ids', () => {
        const doc = { teams: [{ id: 'core.ui', members: [{ id: 'jack@semantic-ui.com', role: 'owner' }] }] };
        expect(get(doc, 'teams[#core.ui].members[#jack@semantic-ui.com].role')).toBe('owner');
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

  it('rewrites to ids carrying dots', () => {
    const dotted = { rows: [{ id: 'a.b' }] };
    expect(keyedPath(dotted, 'rows.0')).toBe('rows[#a.b]');
    const team = { members: [{ id: 'jack@semantic-ui.com', role: 'owner' }] };
    expect(keyedPath(team, 'members.0.role')).toBe('members[#jack@semantic-ui.com].role');
  });

  it('a digit inside a keyed id is not a positional segment', () => {
    const doc = { items: [{ id: '200.40.50', qty: 1 }] };
    const keyed = 'items[#200.40.50].qty';
    expect(keyedPath(doc, keyed)).toBe(keyed);
  });

  it('leaves an unsafe or absent identity positional', () => {
    const unsafe = { rows: [{ id: 'a]b' }] };
    expect(keyedPath(unsafe, 'rows.0')).toBe('rows.0');
    const holes = { rows: [undefined] };
    expect(keyedPath(holes, 'rows.0')).toBe('rows.0');
  });
});

describe('eachPath', () => {
  const walk = (path, options) => {
    const visited = [];
    eachPath(path, (containing) => visited.push(containing), options);
    return visited;
  };

  it('visits each path a path passes through, shortest first', () => {
    expect(walk('a.b.c')).toEqual(['a', 'a.b', 'a.b.c']);
    expect(walk('todos[#a].done')).toEqual(['todos', 'todos[#a]', 'todos[#a].done']);
    expect(walk('items[2].qty')).toEqual(['items', 'items[2]', 'items[2].qty']);
  });

  it('self: false visits only the ancestors above the target', () => {
    expect(walk('todos[#a].done', { self: false })).toEqual(['todos', 'todos[#a]']);
    expect(walk('title', { self: false })).toEqual([]);
  });

  it('a dot inside a keyed id is identity, not a boundary', () => {
    expect(walk('users[#jack@semantic-ui.com].role')).toEqual([
      'users',
      'users[#jack@semantic-ui.com]',
      'users[#jack@semantic-ui.com].role',
    ]);
  });

  it('passes the index and full path, and returning false stops the walk', () => {
    const seen = [];
    eachPath('a.b.c', (containing, index, path) => {
      seen.push([containing, index, path]);
      return index < 1;
    });
    expect(seen).toEqual([
      ['a', 0, 'a.b.c'],
      ['a.b', 1, 'a.b.c'],
    ]);
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

describe('malformed bracket segments', () => {
  it('an unclosed bracket is not a path — nothing resolves, nothing writes', () => {
    const doc = { items: [{ id: 'a', n: 1 }] };
    expect(get(doc, 'items[#a')).toBeUndefined();
    expect(has(doc, 'items[#a')).toBe(false);
    expect(set(doc, 'items[#a', 9)).toBe(doc);
    unset(doc, 'items[#a');
    expect(doc.items).toEqual([{ id: 'a', n: 1 }]);
  });

  it('a positional body that is not a whole index addresses nothing', () => {
    const doc = { items: [{ id: 'a', n: 1 }] };
    expect(has(doc, 'items[abc]')).toBe(false);
    expect(get(doc, 'items[1x].n')).toBeUndefined();
    set(doc, 'items[abc]', 9);
    // no junk 'NaN' or 'abc' key lands on the array
    expect(Object.keys(doc.items)).toEqual(['0']);
    expect(keyedPath(doc, 'items[abc].n')).toBe('items[abc].n');
  });
});

describe('elementKey.config.keys', () => {
  it('the vocabulary extends by mutation like every configured util, the fast path stays true', () => {
    elementKey.config.keys.push('sku');
    try {
      expect(elementKey({ sku: 'A1' })).toBe('A1');
      expect(elementKey({ id: 'x', sku: 'A1' })).toBe('x');
    }
    finally {
      elementKey.config.keys.pop();
    }
    expect(elementKey({ sku: 'A1' })).toBe(undefined);
  });

  it('the configured vocabulary reaches the whole keyed grammar, per-call keys still win', () => {
    const original = [...elementKey.config.keys];
    elementKey.config.keys = ['sku', ...original];
    try {
      const doc = { rows: [{ sku: 'A1', qty: 1 }] };
      expect(elementKey(doc.rows[0])).toBe('A1');
      expect(get(doc, 'rows[#A1].qty')).toBe(1);
      expect(keyedPath(doc, 'rows.0.qty')).toBe('rows[#A1].qty');
      set(doc, 'rows[#A1].qty', 2);
      expect(doc.rows[0].qty).toBe(2);
      const diff = detectChanges({ rows: [{ sku: 'A1', qty: 1 }] }, doc);
      expect(diff.changed).toContain('rows[#A1].qty');
      expect(elementKey(doc.rows[0], ['qty'])).toBe(2);
    }
    finally {
      elementKey.config.keys = original;
    }
  });
});

describe('splitPath', () => {
  it('splits on dots outside brackets only', () => {
    expect(splitPath('a.b.c')).toEqual(['a', 'b', 'c']);
    expect(splitPath('users[#jack@semantic-ui.com].role')).toEqual(['users[#jack@semantic-ui.com]', 'role']);
    expect(splitPath('items[2].qty')).toEqual(['items[2]', 'qty']);
  });

  it('segments are contiguous substrings of the source', () => {
    const path = 'a[#x.y].b.c';
    expect(splitPath(path).join('.')).toBe(path);
  });
});

describe('parsePath', () => {
  it('parses fields, keys, indexes, and wildcards', () => {
    expect(parsePath('lines[#a.b].tax')).toEqual([
      { type: 'field', name: 'lines' },
      { type: 'key', key: 'a.b' },
      { type: 'field', name: 'tax' },
    ]);
    expect(parsePath('items.2')).toEqual([
      { type: 'field', name: 'items' },
      { type: 'index', index: 2 },
    ]);
    expect(parsePath('lines.*.cost')).toEqual([
      { type: 'field', name: 'lines' },
      { type: 'wildcard' },
      { type: 'field', name: 'cost' },
    ]);
  });

  it('bracket and dot index spellings parse to the same segment', () => {
    expect(parsePath('items[2].qty')).toEqual(parsePath('items.2.qty'));
  });

  it('a key carries any character except "]"', () => {
    expect(parsePath('users[#jack@semantic-ui.com].role')[1]).toEqual({
      type: 'key',
      key: 'jack@semantic-ui.com',
    });
    expect(parsePath('items[#a[0]')[1]).toEqual({ type: 'key', key: 'a[0' });
  });

  it('chained brackets in one part parse in order', () => {
    expect(parsePath('a[#x][#y].b')).toEqual([
      { type: 'field', name: 'a' },
      { type: 'key', key: 'x' },
      { type: 'key', key: 'y' },
      { type: 'field', name: 'b' },
    ]);
  });

  it('a leading bracket parses without a field', () => {
    expect(parsePath('[#a].done')).toEqual([
      { type: 'key', key: 'a' },
      { type: 'field', name: 'done' },
    ]);
  });

  it('a path that does not parse is null, not a guess', () => {
    expect(parsePath('items[#a')).toBeNull(); // unclosed
    expect(parsePath('items[abc]')).toBeNull(); // positional body that is not an index
    expect(parsePath('items[0]x.y')).toBeNull(); // trailing text after a bracket
    expect(parsePath('a..b')).toBeNull(); // empty part
    expect(parsePath(42)).toBeNull();
  });

  it('the empty path parses to no segments', () => {
    expect(parsePath('')).toEqual([]);
  });

  it('repeated parses return the same shared segments', () => {
    expect(parsePath('a.b[#x].c')).toBe(parsePath('a.b[#x].c'));
  });
});

describe('pathFrom', () => {
  it('inverts parsePath', () => {
    for (const path of ['a.b.c', 'users[#jack@semantic-ui.com].role', 'lines.*.cost', '[#a].done', 'a[#x][#y].b']) {
      expect(pathFrom(parsePath(path))).toBe(path);
    }
  });

  it('normalizes a bracket index to the dot form', () => {
    expect(pathFrom(parsePath('items[2].qty'))).toBe('items.2.qty');
  });

  it('inverts splitPath, and accepts mixed strings and segments', () => {
    expect(pathFrom(splitPath('a[#x.y].b'))).toBe('a[#x.y].b');
    expect(pathFrom(['order.lines', { type: 'key', key: 'a1' }, 'qty'])).toBe('order.lines[#a1].qty');
  });
});

describe('elementPath', () => {
  it('addresses by key in bracket form, by index in dot form', () => {
    expect(elementPath('order.lines', { key: 'a1' })).toBe('order.lines[#a1]');
    expect(elementPath('order.lines', { index: 2 })).toBe('order.lines.2');
  });

  it('a key and an index are different address spaces', () => {
    expect(elementPath('a', { key: '2' })).toBe('a[#2]');
    expect(elementPath('a', { index: 2 })).toBe('a.2');
  });

  it('an empty list path addresses the root', () => {
    expect(elementPath('', { key: 'a1' })).toBe('[#a1]');
    expect(elementPath('', { index: 2 })).toBe('2');
  });

  it('throws on a key carrying "]" and on a missing flavor', () => {
    expect(() => elementPath('a', { key: 'x]y' })).toThrow(/can't appear in a path/);
    expect(() => elementPath('a', {})).toThrow(/key.*or.*index/);
  });
});

describe('pathKey', () => {
  it('spells an element key for a path, String-coerced', () => {
    expect(pathKey({ id: 'jack@semantic-ui.com' })).toBe('jack@semantic-ui.com');
    expect(pathKey({ id: 7 })).toBe('7');
  });

  it('null for an unkeyed element or a key that cannot ride', () => {
    expect(pathKey({ name: 'n' })).toBeNull();
    expect(pathKey({ id: 'a]b' })).toBeNull();
    expect(pathKey(null)).toBeNull();
  });

  it('honors a custom key list', () => {
    expect(pathKey({ sku: 'A1' }, ['sku'])).toBe('A1');
  });

  it('isPathKey accepts whatever pathKey returned', () => {
    expect(isPathKey(pathKey({ id: 'jack@semantic-ui.com' }))).toBe(true);
    expect(isPathKey('a]b')).toBe(false);
    expect(isPathKey(7)).toBe(true);
  });
});

describe('pathCovers', () => {
  it('a covers b at or under it, segment-aligned', () => {
    expect(pathCovers('contact', 'contact.taxId')).toBe(true);
    expect(pathCovers('contact', 'contacts')).toBe(false);
    expect(pathCovers('items', 'items[#r7].amount')).toBe(true);
    expect(pathCovers('a.b.c', 'a.b')).toBe(false);
    expect(pathCovers('a.b', 'a.b')).toBe(true);
  });

  it('a wildcard covers any single segment', () => {
    expect(pathCovers('lines.*.cost', 'lines[#a].cost')).toBe(true);
    expect(pathCovers('lines.*.cost', 'lines.2.cost')).toBe(true);
    expect(pathCovers('lines.*.cost', 'lines[#a].fee')).toBe(false);
  });

  it('keyed and positional indexes stay apart — [#7] never means [7]', () => {
    expect(pathCovers('a[#7]', 'a[#7].x')).toBe(true);
    expect(pathCovers('a[#7]', 'a.7.x')).toBe(false);
  });

  it('covers through keys carrying dots', () => {
    expect(pathCovers('users', 'users[#jack@semantic-ui.com].role')).toBe(true);
    expect(pathCovers('users[#jack@semantic-ui.com]', 'users[#jack@semantic-ui.com].role')).toBe(true);
  });

  it('no relation to a path that does not parse, itself included', () => {
    expect(pathCovers('a', 'a[#x')).toBe(false);
    expect(pathCovers('a[#x', 'a')).toBe(false);
    expect(pathCovers('a[#x', 'a[#x')).toBe(false);
    expect(pathsOverlap('a[#x', 'a[#x')).toBe(false);
  });
});

describe('pathsOverlap', () => {
  it('true when the paths lie on one line, either direction', () => {
    expect(pathsOverlap('items', 'items[#r7].amount')).toBe(true);
    expect(pathsOverlap('items[#r7].amount', 'items')).toBe(true);
    expect(pathsOverlap('items', 'itemsLog')).toBe(false);
    expect(pathsOverlap('a.b', 'a.c')).toBe(false);
  });
});

describe('patternFrom', () => {
  it('collapses element addresses to the wildcard, keeps fields', () => {
    expect(patternFrom('lines[#a].tax')).toBe('lines.*.tax');
    expect(patternFrom('lines.2.tax')).toBe('lines.*.tax');
    expect(patternFrom('a.b.c')).toBe('a.b.c');
  });

  it('the collapsed pattern covers the concrete path it came from', () => {
    const path = 'users[#jack@semantic-ui.com].role';
    expect(pathCovers(patternFrom(path), path)).toBe(true);
  });
});

describe('expandPath', () => {
  const doc = {
    lines: [
      { id: 'a', cost: 1, rates: [{ n: 1 }] },
      { id: 'b', cost: 2, rates: [] },
    ],
    plain: [{ n: 1 }, { n: 2 }],
  };

  it('a path with no relative dots or wildcards returns itself', () => {
    expect(expandPath('a.b.c')).toEqual(['a.b.c']);
  });

  it('resolves a relative spelling against from, one dot per trailing segment', () => {
    expect(expandPath('.tax', { from: 'lines[#a].qty' })).toEqual(['lines[#a].tax']);
    expect(expandPath('..total', { from: 'lines[#a].qty' })).toEqual(['lines.total']);
    expect(expandPath('...total', { from: 'lines[#a].qty' })).toEqual(['total']);
  });

  it('a keyed segment counts one level, whatever its key carries', () => {
    expect(expandPath('.role', { from: 'users[#jack@semantic-ui.com].plan' }))
      .toEqual(['users[#jack@semantic-ui.com].role']);
  });

  it('a wildcard enumerates keyed elements by key, keyless by position', () => {
    expect(expandPath('lines.*.cost', { doc })).toEqual(['lines[#a].cost', 'lines[#b].cost']);
    expect(expandPath('plain.*.n', { doc })).toEqual(['plain.0.n', 'plain.1.n']);
  });

  it('relative and wildcard compose in one call', () => {
    expect(expandPath('..*.cost', { from: 'lines[#a].qty', doc })).toEqual([
      'lines[#a].cost',
      'lines[#b].cost',
    ]);
  });

  it('a level that is not an array contributes nothing', () => {
    expect(expandPath('missing.*.x', { doc })).toEqual([]);
    expect(expandPath('lines.*.rates.*.n', { doc })).toEqual(['lines[#a].rates.0.n']);
  });

  it('honors a custom key list during enumeration', () => {
    const bySku = { rows: [{ sku: 'A1', q: 1 }] };
    expect(expandPath('rows.*.q', { doc: bySku, keys: ['sku'] })).toEqual(['rows[#A1].q']);
  });

  it('throws when the spelling needs context it was not given', () => {
    expect(() => expandPath('.tax', {})).toThrow(/needs \{ from \}/);
    expect(() => expandPath('lines.*.cost', {})).toThrow(/need \{ doc \}/);
  });
});
