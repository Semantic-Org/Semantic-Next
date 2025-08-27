import { $, Query } from '@semantic-ui/query';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Query Dimensions', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('bounds()', () => {
    it('returns DOMRect for single element', () => {
      document.body.innerHTML =
        '<div id="test" style="position: absolute; top: 10px; left: 20px; width: 100px; height: 50px;"></div>';

      const bounds = $('#test').bounds();

      expect(bounds).toBeDefined();
      expect(typeof bounds.top).toBe('number');
      expect(typeof bounds.left).toBe('number');
      expect(typeof bounds.width).toBe('number');
      expect(typeof bounds.height).toBe('number');
      expect(typeof bounds.right).toBe('number');
      expect(typeof bounds.bottom).toBe('number');
    });

    it('returns array of DOMRects for multiple elements', () => {
      document.body.innerHTML = `
        <div class="test" style="position: absolute; top: 10px; left: 20px; width: 100px; height: 50px;"></div>
        <div class="test" style="position: absolute; top: 100px; left: 200px; width: 150px; height: 75px;"></div>
      `;

      const bounds = $('.test').bounds();

      expect(Array.isArray(bounds)).toBe(true);
      expect(bounds).toHaveLength(2);
      expect(bounds[0]).toBeDefined();
      expect(bounds[1]).toBeDefined();
    });

    it('returns undefined for empty selection', () => {
      const bounds = $('.nonexistent').bounds();
      expect(bounds).toBeUndefined();
    });
  });

  // Note: position(), pagePosition(), dimensions() and isInViewport() tests
  // have been moved to /test/browser/dimensions.test.js because they rely on
  // accurate getBoundingClientRect() and scroll behavior which work better
  // in a real browser environment via Playwright

  describe('position() - basic structure tests only', () => {
    // Most position() tests moved to browser tests for accurate measurements
    it('returns correct structure for position() getter', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative;">
          <div id="child" style="position: absolute;"></div>
        </div>
      `;

      const position = $('#child').position();

      // Just verify structure, not actual values
      expect(position).toHaveProperty('global');
      expect(position).toHaveProperty('local');
      expect(position.global).toHaveProperty('top');
      expect(position.global).toHaveProperty('left');
      expect(position.local).toHaveProperty('top');
      expect(position.local).toHaveProperty('left');
    });

    it('adds relative property when relativeTo is specified', () => {
      document.body.innerHTML = `
        <div id="outer" style="position: relative;">
          <div id="child" style="position: absolute;"></div>
        </div>
      `;

      const position = $('#child').position({ relativeTo: '#outer' });

      expect(position).toHaveProperty('global');
      expect(position).toHaveProperty('local');
      expect(position).toHaveProperty('relative');
      expect(position.relative).toHaveProperty('top');
      expect(position.relative).toHaveProperty('left');
    });

    it('returns undefined for empty selection', () => {
      const position = $('.nonexistent').position();
      expect(position).toBeUndefined();
    });

    it('returns undefined when specified relativeTo element not found', () => {
      document.body.innerHTML = '<div id="test" style="position: absolute; top: 100px; left: 200px;"></div>';

      const position = $('#test').position({ relativeTo: '.nonexistent' });

      expect(position).toBeUndefined();
    });

    it('returns Query instance when used as setter', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative;">
          <div id="child" style="position: absolute;"></div>
        </div>
      `;
      const $element = $('#child');

      // Numeric values trigger setter
      const result = $element.position({ top: 50, left: 100 });

      expect(result).toBe($element); // Returns Query for chaining
    });
  });

  describe('positioningParent()', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('returns a Query instance', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative;">
          <div id="child" style="position: absolute;"></div>
        </div>
      `;

      const result = $('#child').positioningParent();
      expect(result).toBeInstanceOf(Query);
    });

    it('returns offsetParent when calculate is false', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative;">
          <div id="child" style="position: absolute;"></div>
        </div>
      `;

      const result = $('#child').positioningParent({ calculate: false });
      expect(result).toBeInstanceOf(Query);
    });
  });

  describe('containingParent()', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('returns a Query instance with offsetParent', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative;">
          <div id="child" style="position: absolute;"></div>
        </div>
      `;

      const result = $('#child').containingParent();
      expect(result).toBeInstanceOf(Query);
    });
  });
});
