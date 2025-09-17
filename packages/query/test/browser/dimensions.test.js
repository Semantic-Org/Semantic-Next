import { $, $$, Query } from '@semantic-ui/query';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

describe('query', () => {
  describe('position()', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
      // Reset scroll position
      window.scrollTo(0, 0);
    });

    it('gets position object with global and local coordinates by default', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative; top: 50px; left: 100px; padding: 20px;">
          <div id="child" style="position: absolute; top: 25px; left: 30px; width: 50px; height: 50px;"></div>
        </div>
      `;

      const position = $('#child').position();

      expect(position).toEqual({
        global: {
          top: expect.any(Number),
          left: expect.any(Number),
        },
        local: {
          top: expect.any(Number),
          left: expect.any(Number),
        },
      });

      // Local coordinates should be relative to container
      expect(position.local.top).toBe(25);
      expect(position.local.left).toBe(30);
    });

    it('gets position relative to specified element using relativeTo', () => {
      document.body.innerHTML = `
        <div id="outer" style="position: absolute; top: 10px; left: 20px; width: 500px; height: 500px;">
          <div id="inner" style="position: relative; top: 30px; left: 40px; width: 400px; height: 400px;">
            <div id="child" style="position: absolute; top: 15px; left: 25px; width: 50px; height: 50px;"></div>
          </div>
        </div>
      `;

      const position = $('#child').position({ relativeTo: '#outer' });

      expect(position).toEqual({
        global: {
          top: expect.any(Number),
          left: expect.any(Number),
        },
        local: {
          top: expect.any(Number),
          left: expect.any(Number),
        },
        relative: {
          top: expect.any(Number),
          left: expect.any(Number),
        },
      });

      // Verify relative positioning makes sense
      expect(position.relative.top).toBeGreaterThan(0);
      expect(position.relative.left).toBeGreaterThan(0);
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

    it('sets position relative to offsetParent by default', async () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative; width: 500px; height: 500px;">
          <div id="child" style="position: absolute; width: 50px; height: 50px;"></div>
        </div>
      `;
      const $element = $('#child');

      const result = $element.position({ top: 50, left: 100 });

      // Should return Query instance for chaining
      expect(result).toBe($element);

      // Get the actual computed position
      const newPosition = $element.position();
      expect(newPosition.local.top).toBeCloseTo(50, 0);
      expect(newPosition.local.left).toBeCloseTo(100, 0);
    });

    it('sets position relative to specified element', async () => {
      document.body.innerHTML = `
        <div id="target" style="position: absolute; top: 100px; left: 100px; width: 200px; height: 200px;">
        </div>
        <div id="container" style="position: relative; width: 500px; height: 500px;">
          <div id="child" style="position: absolute; width: 50px; height: 50px;"></div>
        </div>
      `;
      const $element = $('#child');

      const result = $element.position({ relativeTo: '#target', top: 25, left: 50 });

      // Should return Query instance for chaining
      expect(result).toBe($element);

      // Verify position is relative to target
      const newPosition = $element.position({ relativeTo: '#target' });
      expect(newPosition.relative.top).toBeCloseTo(25, 0);
      expect(newPosition.relative.left).toBeCloseTo(50, 0);
    });

    it('handles Query object as relativeTo parameter', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative; top: 50px; left: 100px; width: 200px; height: 200px;">
          <div id="child" style="position: absolute; top: 10px; left: 20px;"></div>
        </div>
      `;

      const $container = $('#container');
      const position = $('#child').position({ relativeTo: $container });

      expect(position).toHaveProperty('relative');
      expect(position.relative).toEqual({
        top: expect.any(Number),
        left: expect.any(Number),
      });
    });

    it('handles DOM element as relativeTo parameter', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative; top: 50px; left: 100px; width: 200px; height: 200px;">
          <div id="child" style="position: absolute; top: 10px; left: 20px;"></div>
        </div>
      `;

      const containerElement = document.getElementById('container');
      const position = $('#child').position({ relativeTo: containerElement });

      expect(position).toHaveProperty('relative');
      expect(position.relative).toEqual({
        top: expect.any(Number),
        left: expect.any(Number),
      });
    });

    it('gets positions for multiple elements', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative; width: 500px; height: 500px;">
          <div class="child" style="position: absolute; top: 10px; left: 20px; width: 50px; height: 50px;"></div>
          <div class="child" style="position: absolute; top: 30px; left: 40px; width: 50px; height: 50px;"></div>
        </div>
      `;

      const positions = $('.child').position({ relativeTo: '#container' });

      expect(Array.isArray(positions)).toBe(true);
      expect(positions).toHaveLength(2);
      positions.forEach(pos => {
        expect(pos).toHaveProperty('global');
        expect(pos).toHaveProperty('local');
        expect(pos).toHaveProperty('relative');
      });

      // Verify different positions
      expect(positions[0].local.top).toBe(10);
      expect(positions[1].local.top).toBe(30);
    });

    it('returns only global coordinates when type is "global"', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative; top: 50px; left: 100px;">
          <div id="child" style="position: absolute; top: 20px; left: 30px;"></div>
        </div>
      `;

      const position = $('#child').position({ type: 'global' });

      expect(position).toEqual({
        top: expect.any(Number),
        left: expect.any(Number),
      });
      expect(position).not.toHaveProperty('local');
      expect(position).not.toHaveProperty('relative');
    });

    it('returns only local coordinates when type is "local"', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative; top: 50px; left: 100px;">
          <div id="child" style="position: absolute; top: 20px; left: 30px;"></div>
        </div>
      `;

      const position = $('#child').position({ type: 'local' });

      expect(position).toEqual({
        top: 20,
        left: 30,
      });
      expect(position).not.toHaveProperty('global');
      expect(position).not.toHaveProperty('relative');
    });

    it('returns only relative coordinates when type is "relative" and relativeTo is set', () => {
      document.body.innerHTML = `
        <div id="target" style="position: absolute; top: 100px; left: 100px;">
          <div id="child" style="position: absolute; top: 50px; left: 50px;"></div>
        </div>
      `;

      const position = $('#child').position({ type: 'relative', relativeTo: '#target' });

      expect(position).toEqual({
        top: expect.any(Number),
        left: expect.any(Number),
      });
      expect(position).not.toHaveProperty('global');
      expect(position).not.toHaveProperty('local');
    });

    it('supports precision parameter for rounding', () => {
      document.body.innerHTML = `
        <div id="container" style="position: relative;">
          <div id="child" style="position: absolute; top: 10.7px; left: 20.3px;"></div>
        </div>
      `;

      const pixelPosition = $('#child').position({ precision: 'pixel' });
      const subpixelPosition = $('#child').position({ precision: 'subpixel' });

      // Pixel precision should return integers
      expect(Number.isInteger(pixelPosition.global.top)).toBe(true);
      expect(Number.isInteger(pixelPosition.global.left)).toBe(true);
      expect(Number.isInteger(pixelPosition.local.top)).toBe(true);
      expect(Number.isInteger(pixelPosition.local.left)).toBe(true);

      // Subpixel precision may return floats
      expect(typeof subpixelPosition.global.top).toBe('number');
      expect(typeof subpixelPosition.global.left).toBe('number');
    });

    it('handles transform-based containing parent correctly', () => {
      document.body.innerHTML = `
        <div id="transformed" style="transform: translateZ(0); position: relative; top: 50px; left: 100px;">
          <div id="child" style="position: absolute; top: 20px; left: 30px;"></div>
        </div>
      `;

      const position = $('#child').position({ type: 'local' });

      // Should measure relative to #transformed
      expect(position.top).toBe(20);
      expect(position.left).toBe(30);
    });

    it('handles filter-based containing parent correctly', () => {
      document.body.innerHTML = `
        <div id="filtered" style="filter: blur(0px); position: relative; top: 25px; left: 50px;">
          <div id="child" style="position: absolute; top: 15px; left: 25px;"></div>
        </div>
      `;

      const position = $('#child').position({ type: 'local' });

      // Should measure relative to #filtered
      expect(position.top).toBe(15);
      expect(position.left).toBe(25);
    });
  });

  describe('pagePosition()', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
      window.scrollTo(0, 0);
    });

    it('gets position relative to document for single element', () => {
      document.body.innerHTML =
        '<div id="test" style="position: absolute; top: 100px; left: 200px; width: 50px; height: 50px;"></div>';

      const position = $('#test').pagePosition();

      expect(position).toEqual({
        top: expect.any(Number),
        left: expect.any(Number),
      });

      // Should be at least the CSS position values
      expect(position.top).toBeGreaterThanOrEqual(100);
      expect(position.left).toBeGreaterThanOrEqual(200);
    });

    it('gets positions for multiple elements', () => {
      document.body.innerHTML = `
        <div class="test" style="position: absolute; top: 100px; left: 200px; width: 50px; height: 50px;"></div>
        <div class="test" style="position: absolute; top: 150px; left: 250px; width: 50px; height: 50px;"></div>
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

      // Second element should be lower and to the right
      expect(positions[1].top).toBeGreaterThan(positions[0].top);
      expect(positions[1].left).toBeGreaterThan(positions[0].left);
    });

    it('returns undefined for empty selection', () => {
      const position = $('.nonexistent').pagePosition();
      expect(position).toBeUndefined();
    });

    it('supports precision parameter for rounding', () => {
      document.body.innerHTML = '<div id="test" style="position: absolute; top: 100.5px; left: 200.7px;"></div>';

      const pixelPosition = $('#test').pagePosition({ precision: 'pixel' });
      const subpixelPosition = $('#test').pagePosition({ precision: 'subpixel' });

      // Pixel precision should return integers
      expect(Number.isInteger(pixelPosition.top)).toBe(true);
      expect(Number.isInteger(pixelPosition.left)).toBe(true);

      // Subpixel precision may return floats
      expect(typeof subpixelPosition.top).toBe('number');
      expect(typeof subpixelPosition.left).toBe('number');
    });

    it('accounts for scroll offset in page position', async () => {
      // Create a tall page to enable scrolling
      document.body.innerHTML = `
        <div style="height: 2000px; width: 2000px;">
          <div id="test" style="position: absolute; top: 500px; left: 600px; width: 50px; height: 50px;"></div>
        </div>
      `;

      // Scroll the page
      window.scrollTo(100, 200);

      // Wait for scroll to take effect
      await new Promise(resolve => setTimeout(resolve, 100));

      const position = $('#test').pagePosition();

      // Position should be the absolute position on the page
      // (not affected by scroll, since it's page position not viewport position)
      expect(position.top).toBeCloseTo(500, -1);
      expect(position.left).toBeCloseTo(600, -1);
    });
  });

  describe('dimensions()', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('returns comprehensive dimension data for single element', () => {
      document.body.innerHTML = `
        <div id="test" style="
          position: absolute;
          top: 100px;
          left: 200px;
          width: 300px;
          height: 400px;
          padding: 10px;
          border: 5px solid black;
          margin: 20px;
        "></div>
      `;

      const dims = $('#test').dimensions();

      expect(dims).toHaveProperty('top');
      expect(dims).toHaveProperty('left');
      expect(dims).toHaveProperty('right');
      expect(dims).toHaveProperty('bottom');
      expect(dims).toHaveProperty('pageTop');
      expect(dims).toHaveProperty('pageLeft');
      expect(dims).toHaveProperty('width');
      expect(dims).toHaveProperty('innerWidth');
      expect(dims).toHaveProperty('outerWidth');
      expect(dims).toHaveProperty('marginWidth');
      expect(dims).toHaveProperty('height');
      expect(dims).toHaveProperty('innerHeight');
      expect(dims).toHaveProperty('outerHeight');
      expect(dims).toHaveProperty('marginHeight');
      expect(dims).toHaveProperty('scrollTop');
      expect(dims).toHaveProperty('scrollLeft');
      expect(dims).toHaveProperty('scrollHeight');
      expect(dims).toHaveProperty('scrollWidth');
      expect(dims).toHaveProperty('box');

      // Verify box model calculations
      expect(dims.width).toBe(300); // content width
      expect(dims.innerWidth).toBe(320); // content + padding
      expect(dims.outerWidth).toBe(330); // content + padding + border
      expect(dims.marginWidth).toBe(370); // content + padding + border + margin

      expect(dims.height).toBe(400); // content height
      expect(dims.innerHeight).toBe(420); // content + padding
      expect(dims.outerHeight).toBe(430); // content + padding + border
      expect(dims.marginHeight).toBe(470); // content + padding + border + margin

      // Verify box details
      expect(dims.box.padding).toEqual({ top: 10, right: 10, bottom: 10, left: 10 });
      expect(dims.box.border).toEqual({ top: 5, right: 5, bottom: 5, left: 5 });
      expect(dims.box.margin).toEqual({ top: 20, right: 20, bottom: 20, left: 20 });
    });

    it('returns array of dimensions for multiple elements', () => {
      document.body.innerHTML = `
        <div class="test" style="position: absolute; top: 100px; left: 200px; width: 100px; height: 100px;"></div>
        <div class="test" style="position: absolute; top: 300px; left: 400px; width: 200px; height: 200px;"></div>
      `;

      const dims = $('.test').dimensions();

      expect(Array.isArray(dims)).toBe(true);
      expect(dims).toHaveLength(2);

      expect(dims[0].width).toBe(100);
      expect(dims[0].height).toBe(100);
      expect(dims[1].width).toBe(200);
      expect(dims[1].height).toBe(200);
    });

    it('returns special values for window/global object', () => {
      const dims = $(window).dimensions();

      expect(dims.top).toBe(0);
      expect(dims.left).toBe(0);
      expect(dims.width).toBe(window.innerWidth);
      expect(dims.height).toBe(window.innerHeight);
      expect(dims.scrollTop).toBe(window.scrollY);
      expect(dims.scrollLeft).toBe(window.scrollX);
    });

    it('returns undefined for empty selection', () => {
      const dims = $('.nonexistent').dimensions();
      expect(dims).toBeUndefined();
    });
  });

  describe('isInView()', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
      window.scrollTo(0, 0);
    });

    it('returns true for fully visible element', () => {
      document.body.innerHTML =
        '<div id="test" style="position: fixed; top: 10px; left: 10px; width: 50px; height: 50px;"></div>';

      const result = $('#test').isInView();
      expect(result).toBe(true);
    });

    it('returns false for element outside viewport', () => {
      document.body.innerHTML =
        '<div id="test" style="position: absolute; top: -200px; left: 10px; width: 50px; height: 50px;"></div>';

      const result = $('#test').isInView();
      expect(result).toBe(false);
    });

    it('returns true for partially visible element by default', () => {
      const viewportHeight = window.innerHeight;
      document.body.innerHTML = `<div id="test" style="position: absolute; top: ${
        viewportHeight - 25
      }px; left: 10px; width: 50px; height: 50px;"></div>`;

      const result = $('#test').isInView();
      expect(result).toBe(true);
    });

    it('returns false for partially visible element when fully=true', () => {
      const viewportHeight = window.innerHeight;
      document.body.innerHTML = `<div id="test" style="position: absolute; top: ${
        viewportHeight - 25
      }px; left: 10px; width: 50px; height: 50px;"></div>`;

      const result = $('#test').isInView({ fully: true });
      expect(result).toBe(false);
    });

    it('respects threshold parameter', () => {
      const viewportHeight = window.innerHeight;
      // Element is 50% visible
      document.body.innerHTML = `<div id="test" style="position: absolute; top: ${
        viewportHeight - 25
      }px; left: 10px; width: 50px; height: 50px;"></div>`;

      expect($('#test').isInView({ threshold: 0.3 })).toBe(true); // 30% threshold
      expect($('#test').isInView({ threshold: 0.7 })).toBe(false); // 70% threshold
    });

    it('returns true only if ALL elements meet criteria for multiple elements', () => {
      document.body.innerHTML = `
        <div class="test" style="position: fixed; top: 10px; left: 10px; width: 50px; height: 50px;"></div>
        <div class="test" style="position: absolute; top: -200px; left: 10px; width: 50px; height: 50px;"></div>
      `;

      const result = $('.test').isInView({ all: true });
      expect(result).toBe(false); // One element is out of viewport
    });

    it('returns false for empty selection', () => {
      const result = $('.nonexistent').isInView();
      expect(result).toBe(false);
    });

    it('handles elements at viewport edges correctly', () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Element just touching right edge
      document.body.innerHTML = `<div id="right" style="position: absolute; top: 10px; left: ${
        viewportWidth - 1
      }px; width: 50px; height: 50px;"></div>`;
      expect($('#right').isInView()).toBe(true);

      // Element just touching bottom edge
      document.body.innerHTML = `<div id="bottom" style="position: absolute; top: ${
        viewportHeight - 1
      }px; left: 10px; width: 50px; height: 50px;"></div>`;
      expect($('#bottom').isInView()).toBe(true);

      // Element just outside left edge
      document.body.innerHTML =
        `<div id="left" style="position: absolute; top: 10px; left: -51px; width: 50px; height: 50px;"></div>`;
      expect($('#left').isInView()).toBe(false);

      // Element just outside top edge
      document.body.innerHTML =
        `<div id="top" style="position: absolute; top: -51px; left: 10px; width: 50px; height: 50px;"></div>`;
      expect($('#top').isInView()).toBe(false);
    });

    it('uses clipping parent as default viewport', () => {
      document.body.innerHTML = `
        <div id="container" style="width: 200px; height: 100px; overflow: auto; position: relative;">
          <div id="content" style="height: 300px;">
            <div id="test" style="position: absolute; top: 150px; left: 10px; width: 50px; height: 50px;"></div>
          </div>
        </div>
      `;

      // Element is outside the clipping parent's viewport
      const container = document.getElementById('container');
      container.scrollTop = 0;
      expect($('#test').isInView()).toBe(false);

      // Scroll to make element visible within clipping parent
      container.scrollTop = 100;
      expect($('#test').isInView()).toBe(true);
    });

    it('accepts custom viewport element', () => {
      document.body.innerHTML = `
        <div id="viewport" style="position: absolute; top: 0; left: 0; width: 100px; height: 100px;">
        </div>
        <div id="test" style="position: absolute; top: 50px; left: 50px; width: 50px; height: 50px;"></div>
      `;

      // Element overlaps with custom viewport
      expect($('#test').isInView({ viewport: '#viewport' })).toBe(true);

      // Move element outside custom viewport
      document.getElementById('test').style.top = '150px';
      expect($('#test').isInView({ viewport: '#viewport' })).toBe(false);
    });

    it('accepts custom viewport as Query object', () => {
      document.body.innerHTML = `
        <div id="viewport" style="position: absolute; top: 0; left: 0; width: 100px; height: 100px;">
        </div>
        <div id="test" style="position: absolute; top: 50px; left: 50px; width: 50px; height: 50px;"></div>
      `;

      const $viewport = $('#viewport');
      expect($('#test').isInView({ viewport: $viewport })).toBe(true);

      // Move element outside custom viewport
      document.getElementById('test').style.top = '150px';
      expect($('#test').isInView({ viewport: $viewport })).toBe(false);
    });

    it('falls back to browser viewport when no clipping parent exists', () => {
      document.body.innerHTML = `
        <div id="test" style="position: absolute; top: 10px; left: 10px; width: 50px; height: 50px;"></div>
      `;

      // Element is within browser viewport (no clipping parent)
      expect($('#test').isInView()).toBe(true);

      // Move element outside browser viewport
      document.getElementById('test').style.top = '-100px';
      expect($('#test').isInView()).toBe(false);
    });
  });
});
