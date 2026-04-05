import { resolve } from 'path';
import { beforeAll, describe, expect, it } from 'vitest';
import { SpecRegistry } from '../src/spec-registry.js';

const root = resolve(import.meta.dirname, '../../..');

describe('SpecRegistry — full project scan', () => {
  let registry;

  beforeAll(() => {
    registry = new SpecRegistry();
    registry.scan(root);
  });

  it('discovers all primitive component specs', () => {
    const tags = registry.getTagNames();
    // These are the core primitives that ship with the framework
    expect(tags).toContain('ui-button');
    expect(tags).toContain('ui-input');
    expect(tags).toContain('ui-menu');
    expect(tags).toContain('ui-card');
    expect(tags).toContain('ui-icon');
    expect(tags).toContain('ui-image');
    expect(tags).toContain('ui-label');
    expect(tags).toContain('ui-divider');
    expect(tags).toContain('ui-modal');
    expect(tags).toContain('ui-segment');
    expect(tags).toContain('ui-spinner');
    expect(tags).toContain('ui-container');
    expect(tags).toContain('ui-table');
    expect(tags).toContain('ui-rail');
  });

  it('discovers plural/group component specs', () => {
    const tags = registry.getTagNames();
    // Some components have plural variants (e.g., ui-buttons for button groups)
    expect(tags).toContain('ui-buttons');
    expect(tags).toContain('ui-cards');
    expect(tags).toContain('ui-segments');
  });

  it('discovers sub-component specs', () => {
    const tags = registry.getTagNames();
    expect(tags).toContain('menu-item');
  });
});


describe('SpecRegistry — input component', () => {
  let registry;

  beforeAll(() => {
    registry = new SpecRegistry();
    registry.scan(resolve(root, 'src/primitives'));
  });

  it('reads input attributes', () => {
    const input = registry.get('ui-input');
    expect(input).toBeTruthy();
    expect(input.attributes).toContain('icon');
    expect(input.attributes).toContain('size');
  });

  it('reads input allowed values', () => {
    const input = registry.get('ui-input');
    expect(input.allowedValues.size).toBeDefined();
    expect(input.allowedValues.size.length).toBeGreaterThan(0);
  });

  it('has semantic metadata from spec.json', () => {
    const input = registry.get('ui-input');
    expect(input.name).toBeTruthy();
    expect(input.description).toBeTruthy();
  });
});


describe('SpecRegistry — menu-item sub-component', () => {
  let registry;

  beforeAll(() => {
    registry = new SpecRegistry();
    registry.scan(resolve(root, 'src/primitives'));
  });

  it('discovers menu-item as a standalone tag', () => {
    const menuItem = registry.get('menu-item');
    expect(menuItem).toBeTruthy();
  });

  it('has attributes', () => {
    const menuItem = registry.get('menu-item');
    expect(menuItem.attributes.length).toBeGreaterThan(0);
  });
});


describe('SpecRegistry — attribute completions correctness', () => {
  let registry;

  beforeAll(() => {
    registry = new SpecRegistry();
    registry.scan(resolve(root, 'src/primitives'));
  });

  it('button optionAttributes map values to their parent attribute', () => {
    const btn = registry.get('ui-button');
    // "primary" is a value for the "emphasis" attribute
    expect(btn.optionAttributes.primary).toBe('emphasis');
    // "large" is a value for the "size" attribute
    expect(btn.optionAttributes.large).toBe('size');
    // "flat" is a value for the "styled" attribute
    expect(btn.optionAttributes.flat).toBe('styled');
    // Social media
    expect(btn.optionAttributes.facebook).toBe('social');
  });

  it('button has correct property types', () => {
    const btn = registry.get('ui-button');
    // Boolean attributes
    expect(btn.propertyTypes.link).toBe('boolean');
    expect(btn.propertyTypes.fluid).toBe('boolean');
    expect(btn.propertyTypes.circular).toBe('boolean');
    // String attributes with allowed values
    expect(btn.propertyTypes.size).toBe('string');
    expect(btn.propertyTypes.emphasis).toBe('string');
    expect(btn.propertyTypes.color).toBe('string');
  });

  it('button allowedValues covers size range', () => {
    const btn = registry.get('ui-button');
    const sizes = btn.allowedValues.size;
    expect(sizes).toContain('mini');
    expect(sizes).toContain('tiny');
    expect(sizes).toContain('small');
    expect(sizes).toContain('medium');
    expect(sizes).toContain('large');
    expect(sizes).toContain('big');
    expect(sizes).toContain('huge');
    expect(sizes).toContain('massive');
  });

  it('button allowedValues covers colors', () => {
    const btn = registry.get('ui-button');
    const colors = btn.allowedValues.color;
    expect(colors).toContain('red');
    expect(colors).toContain('blue');
    expect(colors).toContain('green');
  });
});


describe('SpecRegistry — attributeInfo richness', () => {
  let registry;

  beforeAll(() => {
    registry = new SpecRegistry();
    registry.scan(resolve(root, 'src/primitives'));
  });

  it('button emphasis has usage level 1 (most commonly used)', () => {
    const btn = registry.get('ui-button');
    const emphasis = btn.attributeInfo.get('emphasis');
    expect(emphasis).toBeTruthy();
    expect(emphasis.usageLevel).toBe(1);
  });

  it('button has section info for attributes', () => {
    const btn = registry.get('ui-button');
    const emphasis = btn.attributeInfo.get('emphasis');
    expect(emphasis.section).toBe('types');

    const size = btn.attributeInfo.get('size');
    if (size) {
      expect(size.section).toBe('variations');
    }
  });

  it('button per-option info has descriptions and examples', () => {
    const btn = registry.get('ui-button');
    const emphasis = btn.attributeInfo.get('emphasis');
    const primary = emphasis.optionInfo.get('primary');
    expect(primary).toBeTruthy();
    expect(primary.description).toBeTruthy();
    // The spec.json includes example code for common options
    expect(primary.exampleCode).toBeTruthy();
  });

  it('handles components without spec.json gracefully', () => {
    // Some specs might only have .component.js but not .spec.json
    const tags = registry.getTagNames();
    for (const tag of tags) {
      const spec = registry.get(tag);
      // attributeInfo should always be a Map, even if empty
      expect(spec.attributeInfo).toBeInstanceOf(Map);
    }
  });
});


describe('SpecRegistry — isolated instance', () => {
  it('scan is idempotent (scanning same path twice does not duplicate)', () => {
    const reg = new SpecRegistry();
    reg.scan(resolve(root, 'src/primitives'));
    const count1 = reg.getTagNames().length;
    reg.scan(resolve(root, 'src/primitives'));
    const count2 = reg.getTagNames().length;
    // Scanning again should overwrite, not duplicate
    expect(count2).toBe(count1);
  });

  it('works with an empty/nonexistent directory', () => {
    const reg = new SpecRegistry();
    reg.scan('/nonexistent/path/that/does/not/exist');
    expect(reg.getTagNames()).toEqual([]);
  });

  it('can index a single spec file directly', () => {
    const reg = new SpecRegistry();
    reg.indexSpec(resolve(root, 'src/primitives/button/specs/button.component.js'));
    expect(reg.get('ui-button')).toBeTruthy();
    // Only one spec indexed
    expect(reg.getTagNames()).toEqual(['ui-button']);
  });
});
