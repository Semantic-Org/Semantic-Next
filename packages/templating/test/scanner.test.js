import { describe, expect, it, vi } from 'vitest';

import { StringScanner } from '@semantic-ui/templating';

describe('StringScanner', () => {
  it('should let you consume a regex', () => {
    const scanner = new StringScanner('Hello World');
    expect(scanner.consume(/Hello/)).toBe('Hello');
  });

  it('should let you consume a string', () => {
    const scanner = new StringScanner('Hello World');
    expect(scanner.consume('Hello')).toBe('Hello');
  });

  it('should return the rest of a string with rest', () => {
    const scanner = new StringScanner('Hello World');
    scanner.consume(/Hello/);
    expect(scanner.rest()).toBe(' World');
  });

  it('should consume until a given string', () => {
    const scanner = new StringScanner('Hello World');
    expect(scanner.consumeUntil('Wor')).toBe('Hello ');
  });

  it('should permit peeking at a character', () => {
    const scanner = new StringScanner('Hello World');
    expect(scanner.peek()).toBe('H');
  });

  it('should let you returnTo the first previous instance of pattern', () => {
    const scanner = new StringScanner('Hello Hello World');
    scanner.consumeUntil('World');
    scanner.returnTo(/Hello/);
    expect(scanner.pos).toBe(6);
  });

  it('should let you log errors with fatal', () => {
    const scanner = new StringScanner('Hello World');
    const consoleError = console.error;
    console.error = vi.fn();
    StringScanner.DEBUG_MODE = true;
    expect(() => scanner.fatal('Hello')).toThrow('Hello');
    console.error = consoleError;
  });

  it('should let you check if the scanner is at the end of the input', () => {
    const scanner = new StringScanner('Hello World');
    expect(scanner.isEOF()).toBe(false);
    scanner.consumeUntil('World');
    expect(scanner.isEOF()).toBe(false);
    scanner.consumeUntil(/^$/);
    expect(scanner.isEOF()).toBe(true);
  });

  describe('get context', () => {
    it('getContext should return attribute and tag info inside tag', () => {
      const scanner = new StringScanner('<hello bird="robin"></hello>');
      scanner.consume('<hello bird="');
      const context = scanner.getContext();
      expect(context.insideTag).toBe(true);
      expect(context.attribute).toBe('bird');
      expect(context.booleanAttribute).toBe(false);
    });

    it('getContext should return booleanAttribute when unquoted attribute', () => {
      const scanner = new StringScanner('<hello bird=robin></hello>');
      scanner.consume('<hello bird=');
      const context = scanner.getContext();
      expect(context.insideTag).toBe(true);
      expect(context.attribute).toBe('bird');
      expect(context.booleanAttribute).toBe(true);
    });

    it('getContext should return booleanAttribute when a boolean attribute type', () => {
      const scanner = new StringScanner('<input checked="checked"></hello>');
      scanner.consume('<input checked=');
      const context = scanner.getContext();
      expect(context.insideTag).toBe(true);
      expect(context.attribute).toBe('checked');
      expect(context.booleanAttribute).toBe(true);
    });

    it('getContext should return inside tag false when outside tagz', () => {
      const scanner = new StringScanner('<hello bird="robin"></hello>Other Text');
      scanner.consume('Other');
      const context = scanner.getContext();
      expect(context.insideTag).toBe(false);
    });
  });
});
