import { resolve } from 'path';
import { beforeAll, describe, expect, it } from 'vitest';
import { SpecRegistry } from '../src/spec-registry.js';

const root = resolve(import.meta.dirname, '../../..');

describe('SpecRegistry', () => {
  let registry;

  beforeAll(() => {
    registry = new SpecRegistry();
    registry.scan(resolve(root, 'src/primitives'));
  });

  it('discovers component specs', () => {
    const tags = registry.getTagNames();
    expect(tags).toContain('ui-button');
    expect(tags).toContain('ui-input');
    expect(tags).toContain('ui-menu');
  });

  it('returns null for unknown tags', () => {
    expect(registry.get('ui-nonexistent')).toBeNull();
  });

  describe('structural data (from .component.js)', () => {
    it('reads attributes', () => {
      const btn = registry.get('ui-button');
      expect(btn.attributes).toContain('emphasis');
      expect(btn.attributes).toContain('size');
      expect(btn.attributes).toContain('icon');
    });

    it('reads allowedValues', () => {
      const btn = registry.get('ui-button');
      expect(btn.allowedValues.size).toContain('mini');
      expect(btn.allowedValues.size).toContain('massive');
      expect(btn.allowedValues.emphasis).toContain('primary');
    });

    it('reads optionAttributes', () => {
      const btn = registry.get('ui-button');
      expect(btn.optionAttributes.primary).toBe('emphasis');
      expect(btn.optionAttributes.large).toBe('size');
    });

    it('reads propertyTypes', () => {
      const btn = registry.get('ui-button');
      expect(btn.propertyTypes.emphasis).toBe('string');
      expect(btn.propertyTypes.link).toBe('boolean');
    });
  });

  describe('semantic data (from .spec.json)', () => {
    it('reads component name and description', () => {
      const btn = registry.get('ui-button');
      expect(btn.name).toBe('Button');
      expect(btn.description).toContain('user action');
    });

    it('reads attribute descriptions', () => {
      const btn = registry.get('ui-button');
      const emphasis = btn.attributeInfo.get('emphasis');
      expect(emphasis).toBeTruthy();
      expect(emphasis.description).toContain('emphasized');
    });

    it('reads usage levels', () => {
      const btn = registry.get('ui-button');
      const emphasis = btn.attributeInfo.get('emphasis');
      expect(emphasis.usageLevel).toBe(1);
    });

    it('reads per-option descriptions', () => {
      const btn = registry.get('ui-button');
      const emphasis = btn.attributeInfo.get('emphasis');
      const primary = emphasis.optionInfo.get('primary');
      expect(primary).toBeTruthy();
      expect(primary.description).toContain('first action');
    });

    it('reads example code', () => {
      const btn = registry.get('ui-button');
      const emphasis = btn.attributeInfo.get('emphasis');
      const primary = emphasis.optionInfo.get('primary');
      expect(primary.exampleCode).toContain('ui-button');
    });
  });
});
