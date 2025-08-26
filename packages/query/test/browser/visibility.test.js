import { $, $$, Query } from '@semantic-ui/query';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

describe('query', () => {
  describe('isVisible', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    describe('basic functionality', () => {
      it('should return true for visible elements', () => {
        const div = document.createElement('div');
        div.style.width = '100px';
        div.style.height = '100px';
        document.body.appendChild(div);

        const result = $('div').isVisible();
        expect(result).toBe(true);
      });

      it('should return false for display:none elements', () => {
        const div = document.createElement('div');
        div.style.display = 'none';
        document.body.appendChild(div);

        const result = $('div').isVisible();
        expect(result).toBe(false);
      });

      it('should return false for visibility:hidden elements', () => {
        const div = document.createElement('div');
        div.style.visibility = 'hidden';
        document.body.appendChild(div);

        const result = $('div').isVisible();
        expect(result).toBe(false);
      });

      it('should return false for zero-width elements', () => {
        const div = document.createElement('div');
        div.style.width = '0px';
        div.style.height = '100px';
        document.body.appendChild(div);

        const result = $('div').isVisible();
        expect(result).toBe(false);
      });

      it('should return false for zero-height elements', () => {
        const div = document.createElement('div');
        div.style.width = '100px';
        div.style.height = '0px';
        document.body.appendChild(div);

        const result = $('div').isVisible();
        expect(result).toBe(false);
      });
    });

    describe('opacity handling', () => {
      it('should return true for opacity:0 elements by default', () => {
        const div = document.createElement('div');
        div.style.width = '100px';
        div.style.height = '100px';
        div.style.opacity = '0';
        document.body.appendChild(div);

        const result = $('div').isVisible();
        expect(result).toBe(true);
      });

      it('should return false for opacity:0 elements when includeOpacity is true', () => {
        const div = document.createElement('div');
        div.style.width = '100px';
        div.style.height = '100px';
        div.style.opacity = '0';
        document.body.appendChild(div);

        const result = $('div').isVisible({ includeOpacity: true });
        expect(result).toBe(false);
      });

      it('should return true for opacity:0.5 elements when includeOpacity is true', () => {
        const div = document.createElement('div');
        div.style.width = '100px';
        div.style.height = '100px';
        div.style.opacity = '0.5';
        document.body.appendChild(div);

        const result = $('div').isVisible({ includeOpacity: true });
        expect(result).toBe(true);
      });

      it('should return false for opacity:0 with no dimensions when includeOpacity is true', () => {
        const div = document.createElement('div');
        div.style.width = '0px';
        div.style.height = '0px';
        div.style.opacity = '0';
        document.body.appendChild(div);

        const result = $('div').isVisible({ includeOpacity: true });
        expect(result).toBe(false);
      });
    });

    describe('single vs multiple elements', () => {
      it('should return boolean for single element', () => {
        const div = document.createElement('div');
        div.style.width = '100px';
        div.style.height = '100px';
        document.body.appendChild(div);

        const result = $('div').isVisible();
        expect(typeof result).toBe('boolean');
        expect(result).toBe(true);
      });

      it('should return false for multiple elements with different visibility (AND logic)', () => {
        const div1 = document.createElement('div');
        div1.style.width = '100px';
        div1.style.height = '100px';
        div1.className = 'test';
        const div2 = document.createElement('div');
        div2.style.display = 'none';
        div2.className = 'test';
        document.body.appendChild(div1);
        document.body.appendChild(div2);

        const result = $('.test').isVisible();
        expect(typeof result).toBe('boolean');
        expect(result).toBe(false); // false because not ALL are visible
      });

      it('should return single boolean for multiple elements with same visibility', () => {
        const div1 = document.createElement('div');
        div1.style.width = '100px';
        div1.style.height = '100px';
        div1.className = 'test';
        const div2 = document.createElement('div');
        div2.style.width = '50px';
        div2.style.height = '50px';
        div2.className = 'test';
        document.body.appendChild(div1);
        document.body.appendChild(div2);

        const result = $('.test').isVisible();
        expect(typeof result).toBe('boolean');
        expect(result).toBe(true);
      });

      it('should return single false for multiple hidden elements', () => {
        const div1 = document.createElement('div');
        div1.style.display = 'none';
        div1.className = 'test';
        const div2 = document.createElement('div');
        div2.style.visibility = 'hidden';
        div2.className = 'test';
        document.body.appendChild(div1);
        document.body.appendChild(div2);

        const result = $('.test').isVisible();
        expect(typeof result).toBe('boolean');
        expect(result).toBe(false);
      });

      it('should handle mixed visibility states with AND logic', () => {
        const div1 = document.createElement('div');
        div1.style.width = '100px';
        div1.style.height = '100px';
        div1.className = 'test';

        const div2 = document.createElement('div');
        div2.style.opacity = '0';
        div2.style.width = '100px';
        div2.style.height = '100px';
        div2.className = 'test';

        const div3 = document.createElement('div');
        div3.style.display = 'none';
        div3.className = 'test';

        document.body.appendChild(div1);
        document.body.appendChild(div2);
        document.body.appendChild(div3);

        // Without opacity check: div1=true, div2=true, div3=false → false (not all true)
        const result = $('.test').isVisible();
        expect(result).toBe(false);

        // With opacity check: div1=true, div2=false, div3=false → false (not all true)
        const resultWithOpacity = $('.test').isVisible({ includeOpacity: true });
        expect(resultWithOpacity).toBe(false);
      });
    });

    describe('empty selection handling', () => {
      it('should return undefined for empty selection', () => {
        const result = $('.nonexistent').isVisible();
        expect(result).toBeUndefined();
      });

      it('should return undefined for empty selection with includeOpacity', () => {
        const result = $('.nonexistent').isVisible({ includeOpacity: true });
        expect(result).toBeUndefined();
      });
    });

    describe('edge cases', () => {
      it('should handle elements with fractional dimensions', () => {
        const div = document.createElement('div');
        div.style.width = '0.1px';
        div.style.height = '0.1px';
        document.body.appendChild(div);

        const result = $('div').isVisible();
        expect(result).toBe(true);
      });

      it('should handle elements with very small opacity', () => {
        const div = document.createElement('div');
        div.style.width = '100px';
        div.style.height = '100px';
        div.style.opacity = '0.001';
        document.body.appendChild(div);

        const result = $('div').isVisible({ includeOpacity: true });
        expect(result).toBe(true);
      });

      it('should handle elements with inherited styles', () => {
        const parent = document.createElement('div');
        parent.style.opacity = '0.5';
        const child = document.createElement('div');
        child.style.width = '100px';
        child.style.height = '100px';
        child.className = 'child';
        parent.appendChild(child);
        document.body.appendChild(parent);

        const result = $('.child').isVisible({ includeOpacity: true });
        expect(result).toBe(true);
      });
    });

    describe('return value consistency', () => {
      it('should not return Query instance', () => {
        const div = document.createElement('div');
        div.style.width = '100px';
        div.style.height = '100px';
        document.body.appendChild(div);

        const result = $('div').isVisible();
        expect(result).not.toBeInstanceOf(Query);
      });

      it('should handle includeOpacity parameter consistently', () => {
        const div = document.createElement('div');
        div.style.width = '100px';
        div.style.height = '100px';
        div.style.opacity = '0';
        document.body.appendChild(div);

        expect($('div').isVisible()).toBe(true);
        expect($('div').isVisible({ includeOpacity: false })).toBe(true);
        expect($('div').isVisible({ includeOpacity: true })).toBe(false);
      });
    });
  });
});
