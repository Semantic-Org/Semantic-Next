import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineBlock, reportBlockError } from '../../src/engines/native/define-block.js';
import { setTracing } from '../../src/helpers.js';

describe('reportBlockError', () => {
  beforeEach(() => setTracing(true));
  afterEach(() => setTracing(false));

  it('emits a collapsed group with block header, message, hook, and stack', () => {
    const groupSpy = vi.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const endSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

    const err = new Error("Cannot read properties of undefined (reading 'name')");
    reportBlockError({ name: 'conditional', syntax: '{#if user.profile.name}', hook: 'render', err });

    expect(groupSpy).toHaveBeenCalledWith('[sui] conditional {#if user.profile.name}');
    expect(errorSpy).toHaveBeenCalledWith("Cannot read properties of undefined (reading 'name')");
    expect(logSpy).toHaveBeenCalledWith('hook: render');
    expect(logSpy).toHaveBeenCalledWith(err.stack);
    expect(endSpy).toHaveBeenCalledOnce();

    groupSpy.mockRestore();
    errorSpy.mockRestore();
    logSpy.mockRestore();
    endSpy.mockRestore();
  });

  it('omits the syntax suffix when no syntax fn is provided', () => {
    const groupSpy = vi.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const endSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

    reportBlockError({ name: 'each', hook: 'render', err: 'oops' });

    expect(groupSpy).toHaveBeenCalledWith('[sui] each');
    expect(errorSpy).toHaveBeenCalledWith('oops');
    expect(logSpy).toHaveBeenCalledWith('hook: render');

    groupSpy.mockRestore();
    errorSpy.mockRestore();
    logSpy.mockRestore();
    endSpy.mockRestore();
  });
});

describe('defineBlock', () => {
  it('returns a dispatch function with .definition and optional .evaluateText attached', () => {
    const config = {
      name: 'test',
      render() {},
    };
    const block = defineBlock(config);
    expect(typeof block).toBe('function');
    expect(block.definition).toBe(config);
    expect(block.evaluateText).toBeUndefined();
  });

  it('attaches evaluateText static when config provides it', () => {
    const evalText = ({ node, data }) => `static:${node.type}`;
    const block = defineBlock({
      name: 'test',
      render() {},
      evaluateText: evalText,
    });
    // dispatch.evaluateText wraps so `this === config` inside the hook,
    // letting authors call sibling helpers via `this.helperName(...)`.
    // The wrapper forwards the bag verbatim and returns the result.
    expect(typeof block.evaluateText).toBe('function');
    expect(block.evaluateText({ node: { type: 'if' }, data: {} })).toBe('static:if');
  });

  it('preserves definition reference for debugging', () => {
    const config = {
      name: 'rerender',
      render() {},
      update() {},
    };
    const block = defineBlock(config);
    expect(block.definition.name).toBe('rerender');
    expect(block.definition.update).toBe(config.update);
  });
});
