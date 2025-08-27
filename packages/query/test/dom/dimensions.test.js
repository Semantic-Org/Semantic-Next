import { $ } from '@semantic-ui/query';
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

  describe('pagePosition()', () => {
    it('gets position relative to document for single element', () => {
      document.body.innerHTML = '<div id="test" style="position: absolute; top: 100px; left: 200px;"></div>';

      const position = $('#test').pagePosition();

      expect(position).toEqual({
        top: expect.any(Number),
        left: expect.any(Number),
      });
    });

    it('gets positions for multiple elements', () => {
      document.body.innerHTML = `
        <div class="test" style="position: absolute; top: 100px; left: 200px;"></div>
        <div class="test" style="position: absolute; top: 150px; left: 250px;"></div>
      `;

      const positions = $('.test').pagePosition();

      expect(Array.isArray(positions)).toBe(true);
      expect(positions).toHaveLength(2);
      expect(positions[0]).toEqual({
        top: expect.any(Number),
        left: expect.any(Number),
      });
      expect(positions[1]).toEqual({
        top: expect.any(Number),
        left: expect.any(Number),
      });
    });

    it('returns undefined for empty selection', () => {
      const position = $('.nonexistent').pagePosition();
      expect(position).toBeUndefined();
    });

    it('sets position via top and left coordinates', () => {
      document.body.innerHTML = '<div id="test" style="position: absolute;"></div>';
      const $element = $('#test');

      const result = $element.pagePosition({ top: 100, left: 200 });

      // Should return Query instance for chaining
      expect(result).toBe($element);

      // Should set CSS properties
      const element = $element[0];
      expect(element.style.top).toBe('100px');
      expect(element.style.left).toBe('200px');
    });

    it('sets only top when left not provided', () => {
      document.body.innerHTML = '<div id="test" style="position: absolute;"></div>';
      const $element = $('#test');

      $element.pagePosition({ top: 100 });

      const element = $element[0];
      expect(element.style.top).toBe('100px');
      expect(element.style.left).toBe('');
    });

    it('sets only left when top not provided', () => {
      document.body.innerHTML = '<div id="test" style="position: absolute;"></div>';
      const $element = $('#test');

      $element.pagePosition({ left: 200 });

      const element = $element[0];
      expect(element.style.top).toBe('');
      expect(element.style.left).toBe('200px');
    });

    it('sets position for multiple elements', () => {
      document.body.innerHTML = `
        <div class="test" style="position: absolute;"></div>
        <div class="test" style="position: absolute;"></div>
      `;

      $('.test').pagePosition({ top: 50, left: 75 });

      const elements = document.querySelectorAll('.test');
      expect(elements[0].style.top).toBe('50px');
      expect(elements[0].style.left).toBe('75px');
      expect(elements[1].style.top).toBe('50px');
      expect(elements[1].style.left).toBe('75px');
    });

    it('handles string values without adding px', () => {
      document.body.innerHTML = '<div id="test" style="position: absolute;"></div>';
      const $element = $('#test');

      $element.pagePosition({ top: '10%', left: 'auto' });

      const element = $element[0];
      expect(element.style.top).toBe('10%');
      expect(element.style.left).toBe('auto');
    });

    it('handles mixed number and string values', () => {
      document.body.innerHTML = '<div id="test" style="position: absolute;"></div>';
      const $element = $('#test');

      $element.pagePosition({ top: 100, left: 'calc(50% - 25px)' });

      const element = $element[0];
      expect(element.style.top).toBe('100px');
      expect(element.style.left).toBe('calc(50% - 25px)');
    });
  });

  describe('containerPosition()', () => {
    it('gets position relative to containingParent by default', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative; top: 50px; left: 100px;">
          <div id="child" style="position: absolute; top: 25px; left: 30px;"></div>
        </div>
      `;

      const position = $('#child').containerPosition();

      expect(position).toEqual({
        top: expect.any(Number),
        left: expect.any(Number),
      });
    });

    it('gets position relative to specified container', () => {
      document.body.innerHTML = `
        <div id="outer" style="position: relative; top: 10px; left: 20px;">
          <div id="inner" style="position: relative; top: 30px; left: 40px;">
            <div id="child" style="position: absolute; top: 15px; left: 25px;"></div>
          </div>
        </div>
      `;

      const position = $('#child').containerPosition({ container: '#outer' });

      expect(position).toEqual({
        top: expect.any(Number),
        left: expect.any(Number),
      });
    });

    it('returns undefined for empty selection', () => {
      const position = $('.nonexistent').containerPosition();
      expect(position).toBeUndefined();
    });

    it('returns undefined when specified container not found', () => {
      document.body.innerHTML = '<div id="test" style="position: absolute; top: 100px; left: 200px;"></div>';

      const position = $('#test').containerPosition({ container: '.nonexistent' });

      expect(position).toBeUndefined();
    });

    it('sets position relative to containingParent', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative;">
          <div id="child" style="position: absolute;"></div>
        </div>
      `;
      const $element = $('#child');

      const result = $element.containerPosition({ top: 50, left: 100 });

      // Should return Query instance for chaining
      expect(result).toBe($element);

      // Should set CSS properties
      const element = $element[0];
      expect(element.style.top).toBe('50px');
      expect(element.style.left).toBe('100px');
    });

    it('sets position relative to specified container', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative;">
          <div id="child" style="position: absolute;"></div>
        </div>
      `;
      const $element = $('#child');

      const result = $element.containerPosition({ container: '#container', top: 25, left: 50 });

      // Should return Query instance for chaining
      expect(result).toBe($element);

      // Should set CSS properties
      const element = $element[0];
      expect(element.style.top).toBe('25px');
      expect(element.style.left).toBe('50px');
    });

    it('handles Query object as container parameter', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative;">
          <div id="child" style="position: absolute;"></div>
        </div>
      `;

      const $container = $('#container');
      const position = $('#child').containerPosition($container);

      expect(position).toEqual({
        top: expect.any(Number),
        left: expect.any(Number),
      });
    });

    it('handles DOM element as container parameter', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative;">
          <div id="child" style="position: absolute;"></div>
        </div>
      `;

      const containerElement = document.getElementById('container');
      const position = $('#child').containerPosition(containerElement);

      expect(position).toEqual({
        top: expect.any(Number),
        left: expect.any(Number),
      });
    });

    it('gets positions for multiple elements', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative;">
          <div class="child" style="position: absolute; top: 10px; left: 20px;"></div>
          <div class="child" style="position: absolute; top: 30px; left: 40px;"></div>
        </div>
      `;

      const positions = $('.child').containerPosition({ container: '#container' });

      expect(Array.isArray(positions)).toBe(true);
      expect(positions).toHaveLength(2);
      expect(positions[0]).toEqual({
        top: expect.any(Number),
        left: expect.any(Number),
      });
      expect(positions[1]).toEqual({
        top: expect.any(Number),
        left: expect.any(Number),
      });
    });

    it('works with transform-based containing parent', () => {
      document.body.innerHTML = `
        <div id="transformed" style="transform: translateZ(0); position: relative; top: 50px; left: 100px;">
          <div id="child" style="position: absolute; top: 20px; left: 30px;"></div>
        </div>
      `;

      const position = $('#child').containerPosition();

      // Should measure relative to #transformed, not document
      expect(position).toEqual({
        top: expect.any(Number),
        left: expect.any(Number),
      });
    });

    it('works with filter-based containing parent', () => {
      document.body.innerHTML = `
        <div id="filtered" style="filter: blur(0px); position: relative; top: 25px; left: 50px;">
          <div id="child" style="position: absolute; top: 15px; left: 25px;"></div>
        </div>
      `;

      const position = $('#child').containerPosition();

      // Should measure relative to #filtered
      expect(position).toEqual({
        top: expect.any(Number),
        left: expect.any(Number),
      });
    });

    it('works with will-change containing parent', () => {
      document.body.innerHTML = `
        <div id="willchange" style="will-change: transform; position: relative; top: 75px; left: 150px;">
          <div id="child" style="position: absolute; top: 10px; left: 20px;"></div>
        </div>
      `;

      const position = $('#child').containerPosition();

      // Should measure relative to #willchange
      expect(position).toEqual({
        top: expect.any(Number),
        left: expect.any(Number),
      });
    });

    it('works with contain-based containing parent', () => {
      document.body.innerHTML = `
        <div id="contained" style="contain: layout; position: relative; top: 40px; left: 80px;">
          <div id="child" style="position: absolute; top: 12px; left: 18px;"></div>
        </div>
      `;

      const position = $('#child').containerPosition();

      // Should measure relative to #contained
      expect(position).toEqual({
        top: expect.any(Number),
        left: expect.any(Number),
      });
    });

    it('works with perspective-based containing parent', () => {
      document.body.innerHTML = `
        <div id="perspective" style="perspective: 1000px; position: relative; top: 60px; left: 120px;">
          <div id="child" style="position: absolute; top: 8px; left: 16px;"></div>
        </div>
      `;

      const position = $('#child').containerPosition();

      // Should measure relative to #perspective
      expect(position).toEqual({
        top: expect.any(Number),
        left: expect.any(Number),
      });
    });

    it('handles string values in setter without adding px', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative;">
          <div id="child" style="position: absolute;"></div>
        </div>
      `;
      const $element = $('#child');

      $element.containerPosition({ top: '10%', left: 'auto' });

      const element = $element[0];
      expect(element.style.top).toBe('10%');
      expect(element.style.left).toBe('auto');
    });

    it('handles mixed number and string values in setter', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative;">
          <div id="child" style="position: absolute;"></div>
        </div>
      `;
      const $element = $('#child');

      $element.containerPosition({ top: 50, left: 'calc(100% - 20px)' });

      const element = $element[0];
      expect(element.style.top).toBe('50px');
      expect(element.style.left).toBe('calc(100% - 20px)');
    });
  });
});
