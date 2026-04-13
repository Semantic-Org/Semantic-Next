import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineBlock, nodeSyntax, reportBlockError } from '../../src/engines/native/define-block.js';
import { setTracing } from '../../src/helpers.js';

describe('nodeSyntax', () => {
  it('produces {#if} header for if nodes', () => {
    expect(nodeSyntax({ type: 'if', condition: 'user.name' })).toBe('{#if user.name}');
  });

  it('produces {#each ... as ...} header for each nodes with alias', () => {
    expect(nodeSyntax({ type: 'each', over: 'items', as: 'item' })).toBe('{#each items as item}');
  });

  it('produces {#each ...} header for each nodes without alias', () => {
    expect(nodeSyntax({ type: 'each', over: 'items' })).toBe('{#each items}');
  });

  it('produces {#async ...} header for async nodes', () => {
    expect(nodeSyntax({ type: 'async', expression: 'fetchUser()' })).toBe('{#async fetchUser()}');
  });

  it('produces {#rerender} header for bare rerender nodes', () => {
    expect(nodeSyntax({ type: 'rerender' })).toBe('{#rerender}');
  });

  it('produces {#rerender ...} header for keyed rerender nodes', () => {
    expect(nodeSyntax({ type: 'rerender', expression: 'key' })).toBe('{#rerender key}');
  });

  it('produces {> name} header for template nodes', () => {
    expect(nodeSyntax({ type: 'template', name: 'row' })).toBe('{> row}');
  });

  it('produces {#snippet name} header for snippet nodes', () => {
    expect(nodeSyntax({ type: 'snippet', name: 'badge' })).toBe('{#snippet badge}');
  });

  it('produces {#type} fallback for unknown node types', () => {
    expect(nodeSyntax({ type: 'mystery' })).toBe('{#mystery}');
  });

  it('tolerates object-shaped expression values', () => {
    expect(nodeSyntax({ type: 'if', condition: { value: 'isActive' } })).toBe('{#if isActive}');
  });

  it('tolerates token-array expression values', () => {
    expect(nodeSyntax({ type: 'each', over: { tokens: [{ value: 'users' }] } }))
      .toBe('{#each users}');
  });

  it('returns empty string for null node', () => {
    expect(nodeSyntax(null)).toBe('');
  });
});

describe('reportBlockError', () => {
  beforeEach(() => setTracing(true));
  afterEach(() => setTracing(false));

  it('emits a collapsed group with block header, message, hook, and stack', () => {
    const groupSpy = vi.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const endSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

    const err = new Error("Cannot read properties of undefined (reading 'name')");
    reportBlockError('conditional', { type: 'if', condition: 'user.profile.name' }, 'render', err);

    expect(groupSpy).toHaveBeenCalledWith('🔴 conditional  {#if user.profile.name}');
    expect(errorSpy).toHaveBeenCalledWith("Cannot read properties of undefined (reading 'name')");
    expect(logSpy).toHaveBeenCalledWith('hook: render');
    expect(logSpy).toHaveBeenCalledWith(err.stack);
    expect(endSpy).toHaveBeenCalledOnce();

    groupSpy.mockRestore();
    errorSpy.mockRestore();
    logSpy.mockRestore();
    endSpy.mockRestore();
  });

  it('handles non-Error throws (strings, objects)', () => {
    const groupSpy = vi.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const endSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

    reportBlockError('each', { type: 'each', over: 'rows' }, 'render', 'oops');

    expect(groupSpy).toHaveBeenCalledWith('🔴 each  {#each rows}');
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
    expect(block.evaluateText).toBe(evalText);
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
