import { defineGlobal, isDevelopment } from '@semantic-ui/utils';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('defineGlobal', () => {
  let warn;
  const names = [];
  const fresh = (label) => {
    const name = `__defineGlobal_${label}_${names.length}`;
    names.push(name);
    return name;
  };

  beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
    names.forEach((name) => delete globalThis[name]);
    names.length = 0;
  });

  it('should put a value on globalThis and return it', () => {
    const name = fresh('store');
    const store = { count: 1 };
    expect(defineGlobal(name, store)).toBe(store);
    expect(globalThis[name]).toBe(store);
  });

  it('should make a plain writable enumerable configurable property', () => {
    const name = fresh('shape');
    defineGlobal(name, 1);
    expect(Object.getOwnPropertyDescriptor(globalThis, name)).toEqual({
      value: 1,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  });

  it('should treat the same value again as no conflict', () => {
    const name = fresh('same');
    const store = {};
    defineGlobal(name, store);
    expect(defineGlobal(name, store)).toBe(store);
    expect(warn).not.toHaveBeenCalled();
  });

  it('should keep the existing value and warn once per name by default', () => {
    expect(isDevelopment).toBe(true);
    const name = fresh('taken');
    const first = {};
    defineGlobal(name, first);
    expect(defineGlobal(name, {})).toBe(first);
    expect(defineGlobal(name, {})).toBe(first);
    expect(globalThis[name]).toBe(first);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain(`'${name}' is already defined`);
  });

  it('should warn separately for each name', () => {
    const one = fresh('one');
    const two = fresh('two');
    defineGlobal(one, 1);
    defineGlobal(two, 2);
    defineGlobal(one, 'x');
    defineGlobal(two, 'x');
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it('should count a held undefined as defined', () => {
    const name = fresh('undefined');
    globalThis[name] = undefined;
    expect(defineGlobal(name, 1)).toBeUndefined();
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('should keep the existing value quietly with onConflict keep', () => {
    const name = fresh('keep');
    const queue = [1];
    globalThis[name] = queue;
    expect(defineGlobal(name, [], { onConflict: 'keep' })).toBe(queue);
    expect(warn).not.toHaveBeenCalled();
  });

  it('should get or create with onConflict keep', () => {
    const name = fresh('singleton');
    const created = defineGlobal(name, { id: 1 }, { onConflict: 'keep' });
    expect(defineGlobal(name, { id: 2 }, { onConflict: 'keep' })).toBe(created);
  });

  it('should keep a built-in by default', () => {
    expect(defineGlobal('structuredClone', () => 'polyfill', { onConflict: 'keep' })).toBe(structuredClone);
    expect(defineGlobal('Array', class {})).toBe(Array);
  });

  it('should overwrite with onConflict replace', () => {
    const name = fresh('replace');
    globalThis[name] = 'real';
    expect(defineGlobal(name, 'mock', { onConflict: 'replace' })).toBe('mock');
    expect(globalThis[name]).toBe('mock');
    expect(warn).not.toHaveBeenCalled();
  });

  it('should replace a getter or a read-only value that assignment cannot', () => {
    const host = {};
    Object.defineProperty(host, 'navigator', { get: () => 'node', configurable: true, enumerable: false });
    Object.defineProperty(host, 'version', { value: 1, writable: false, configurable: true });
    expect(defineGlobal('navigator', 'mock', { host, onConflict: 'replace' })).toBe('mock');
    expect(defineGlobal('version', 2, { host, onConflict: 'replace' })).toBe(2);
    expect(host.navigator).toBe('mock');
    expect(host.version).toBe(2);
    expect(Object.getOwnPropertyDescriptor(host, 'navigator').enumerable).toBe(false);
  });

  it('should throw when replacing a property that cannot change', () => {
    const host = Object.freeze({ locked: 1 });
    expect(() => defineGlobal('locked', 2, { host, onConflict: 'replace' })).toThrow(TypeError);
  });

  it('should define on a chosen host object', () => {
    const library = { version: 1 };
    const plugins = [];
    expect(defineGlobal('plugins', plugins, { host: library })).toBe(plugins);
    expect(library.plugins).toBe(plugins);
    expect(defineGlobal('plugins', [], { host: library, onConflict: 'keep' })).toBe(plugins);
  });

  it('should accept a function as a host', () => {
    const Library = () => {};
    defineGlobal('register', 1, { host: Library });
    expect(Library.register).toBe(1);
  });

  it('should see a name inherited by the host as taken', () => {
    const host = Object.create({ inherited: 'parent' });
    expect(defineGlobal('inherited', 'child', { host })).toBe('parent');
    expect(Object.hasOwn(host, 'inherited')).toBe(false);
  });

  it('should warn once per host, not once per name across hosts', () => {
    const first = { shared: 1 };
    const second = { shared: 1 };
    defineGlobal('shared', 2, { host: first });
    defineGlobal('shared', 2, { host: second });
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it('should accept a symbol name', () => {
    const host = {};
    const key = Symbol('hook');
    defineGlobal(key, 1, { host });
    defineGlobal(key, 2, { host });
    expect(host[key]).toBe(1);
    expect(warn.mock.calls[0][0]).toContain('Symbol(hook)');
  });

  it('should refuse an unknown onConflict', () => {
    expect(() => defineGlobal(fresh('typo'), 1, { onConflict: 'replce' }))
      .toThrow("defineGlobal: onConflict is 'warn', 'keep' or 'replace', got replce");
  });

  it('should refuse a host that cannot hold a property', () => {
    expect(() => defineGlobal('x', 1, { host: null })).toThrow(TypeError);
    expect(() => defineGlobal('x', 1, { host: 5 })).toThrow(TypeError);
  });
});
