import { resolve } from 'path';
import { describe, expect, it } from 'vitest';
import { getCompletions, getHover } from '../src/language-service.js';
import { analyzeComponent } from '../src/component-analyzer.js';
import { SpecRegistry } from '../src/spec-registry.js';

const root = resolve(import.meta.dirname, '../../..');

function getModel(relativePath) {
  return analyzeComponent(resolve(root, relativePath));
}

function getRegistry() {
  const reg = new SpecRegistry();
  reg.scan(resolve(root, 'src/primitives'));
  return reg;
}

describe('getCompletions', () => {
  const model = getModel('src/primitives/button/button.js');
  const specRegistry = getRegistry();

  it('returns helpers for expression context', () => {
    const items = getCompletions('<div>{}</div>', 6, { model, specRegistry });
    const names = items.map(i => i.label);
    expect(names).toContain('classIf');
    expect(names).toContain('formatDate');
  });

  it('returns component methods for expression context', () => {
    const items = getCompletions('<div>{}</div>', 6, { model, specRegistry });
    const names = items.map(i => i.label);
    expect(names).toContain('isIconBefore');
    expect(names).toContain('performAction');
    expect(names).toContain('getForm');
  });

  it('returns block completions for {#', () => {
    const items = getCompletions('<div>{#}</div>', 7, {});
    const names = items.map(i => i.label);
    expect(names).toContain('if');
    expect(names).toContain('each');
    expect(names).toContain('async');
    expect(names).toContain('snippet');
  });

  it('returns spec attributes for <ui-button', () => {
    const items = getCompletions('<ui-button  >', 11, { specRegistry });
    const names = items.map(i => i.label);
    expect(names).toContain('emphasis');
    expect(names).toContain('size');
    expect(names).toContain('primary');
  });

  it('returns attribute values for size="', () => {
    const items = getCompletions('<ui-button size="">', 17, { specRegistry });
    const names = items.map(i => i.label);
    expect(names).toContain('mini');
    expect(names).toContain('large');
    expect(names).toContain('massive');
  });

  it('returns empty for unknown component', () => {
    const items = getCompletions('<my-custom  >', 11, { specRegistry });
    expect(items).toHaveLength(0);
  });

  it('returns slot for reference context', () => {
    const items = getCompletions('<div>{>}</div>', 7, { model });
    const names = items.map(i => i.label);
    expect(names).toContain('slot');
  });
});

describe('getHover', () => {
  const model = getModel('src/primitives/menu/menu.js');

  it('returns helper signature on hover', () => {
    const result = getHover('{classIf}', 4, { model });
    expect(result.contents.value).toContain('classIf');
    expect(result.contents.value).toContain('expr');
  });

  it('returns method info on hover', () => {
    const result = getHover('{setValue}', 4, { model });
    expect(result.contents.value).toContain('setValue');
    expect(result.contents.value).toContain('Component method');
  });

  it('returns state info on hover', () => {
    const result = getHover('{activeIndex}', 5, { model });
    expect(result.contents.value).toContain('Signal');
    expect(result.contents.value).toContain('number');
  });

  it('returns null for unknown word', () => {
    const result = getHover('{unknownThing}', 5, { model });
    expect(result).toBeNull();
  });
});
