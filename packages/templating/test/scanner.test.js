import { describe, expect, it, vi } from 'vitest';

import { Scanner } from '../src/scanner.js';

describe('Scanner', () => {


    it('should let you consume a regex', () => {
        const scanner = new Scanner('Hello World');
        expect(scanner.consume(/Hello/)).toBe('Hello');
    });

    it('should let you consume a string', () => {
        const scanner = new Scanner('Hello World');
        expect(scanner.consume('Hello')).toBe('Hello');
    });

    it('should return the rest of a string with rest', () => {
        const scanner = new Scanner('Hello World');
        scanner.consume(/Hello/);
        expect(scanner.rest()).toBe(' World');
    });
  
    it('should consume until a given string', () => {
        const scanner = new Scanner('Hello World');
        expect(scanner.consumeUntil('Wor')).toBe('Hello ');
    });
    
    it('should permit peeking at a character', () => {
        const scanner = new Scanner('Hello World');
        expect(scanner.peek()).toBe('H');
    });

    it('should let you returnTo the first previous instance of pattern', () => {
        const scanner = new Scanner('Hello Hello World');
        scanner.consumeUntil('World');
        scanner.returnTo(/Hello/)
        expect(scanner.pos).toBe(6)
    });

    it('should let you log errors with fatal', () => {
        const scanner = new Scanner('Hello World');
        const consoleError = console.error;
        console.error = vi.fn();
        Scanner.DEBUG_MODE = true;
        expect(() => scanner.fatal('Hello')).toThrow('Hello');
        console.error = consoleError;
    });

    it('should let you check if the scanner is at the end of the input', () => {
        const scanner = new Scanner('Hello World');
        expect(scanner.isEOF()).toBe(false);
        scanner.consumeUntil('World');
        expect(scanner.isEOF()).toBe(false);
        scanner.consumeUntil(/^$/);
        expect(scanner.isEOF()).toBe(true);
    });

    it('should always fail', () => {
        expect(false).toBe(true);
    });

});
