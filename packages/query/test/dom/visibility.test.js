import { $ } from '@semantic-ui/query';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Visibility Methods', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('show', () => {
    it('should show a hidden element by removing display: none', () => {
      document.body.innerHTML = '<div style="display: none"></div>';
      const $div = $('div');

      $div.show();

      expect($div.css('display')).not.toBe('none');
    });

    it('should set proper display value using naturalDisplay by default', () => {
      document.body.innerHTML = '<div style="display: none"></div>';
      const $div = $('div');

      $div.show();

      expect($div.css('display')).toBe('block');
    });

    it('should work with inline elements', () => {
      document.body.innerHTML = '<span style="display: none"></span>';
      const $span = $('span');

      $span.show();

      expect($span.css('display')).toBe('inline');
    });

    it('should work with table elements', () => {
      document.body.innerHTML =
        '<table style="display: none"><tr style="display: none"><td style="display: none"></td></tr></table>';

      $('table').show();
      $('tr').show();
      $('td').show();

      expect($('table').css('display')).toBe('table');
      expect($('tr').css('display')).toBe('table-row');
      expect($('td').css('display')).toBe('table-cell');
    });

    it('should return Query instance for chaining', () => {
      document.body.innerHTML = '<div style="display: none"></div>';
      const $div = $('div');

      const result = $div.show();

      expect(result).toBe($div);
    });

    it('should work with multiple elements', () => {
      document.body.innerHTML = '<div style="display: none"></div><span style="display: none"></span>';

      $('div, span').show();

      expect($('div').css('display')).toBe('block');
      expect($('span').css('display')).toBe('inline');
    });

    it('should respect calculate: false option for performance', () => {
      document.body.innerHTML = '<div style="display: none"></div>';
      const $div = $('div');

      $div.show({ calculate: false });

      expect($div.css('display')).toBe('block'); // Should use tag-based lookup
    });

    it('should handle elements with existing inline display styles', () => {
      document.body.innerHTML = '<div style="display: flex"></div>';
      const $div = $('div');

      $div.show();

      expect($div.css('display')).toBe('flex'); // Should preserve existing display value
    });
  });

  describe('hide', () => {
    it('should hide a visible element by setting display: none', () => {
      document.body.innerHTML = '<div></div>';
      const $div = $('div');

      $div.hide();

      expect($div.css('display')).toBe('none');
    });

    it('should hide elements with existing display styles', () => {
      document.body.innerHTML = '<div style="display: flex"></div>';
      const $div = $('div');

      $div.hide();

      expect($div.css('display')).toBe('none');
    });

    it('should return Query instance for chaining', () => {
      document.body.innerHTML = '<div></div>';
      const $div = $('div');

      const result = $div.hide();

      expect(result).toBe($div);
    });

    it('should work with multiple elements', () => {
      document.body.innerHTML = '<div></div><span></span>';

      $('div, span').hide();

      expect($('div').css('display')).toBe('none');
      expect($('span').css('display')).toBe('none');
    });
  });

  describe('toggle', () => {
    it('should show a hidden element', () => {
      document.body.innerHTML = '<div style="display: none"></div>';
      const $div = $('div');

      $div.toggle();

      expect($div.css('display')).toBe('block');
    });

    it('should hide a visible element', () => {
      document.body.innerHTML = '<div></div>';
      const $div = $('div');

      $div.toggle();

      expect($div.css('display')).toBe('none');
    });

    it('should properly toggle between hidden and visible states', () => {
      document.body.innerHTML = '<div></div>';
      const $div = $('div');

      // Initially visible, should hide
      $div.toggle();
      expect($div.css('display')).toBe('none');

      // Now hidden, should show
      $div.toggle();
      expect($div.css('display')).toBe('block');

      // Visible again, should hide
      $div.toggle();
      expect($div.css('display')).toBe('none');
    });

    it('should return Query instance for chaining', () => {
      document.body.innerHTML = '<div></div>';
      const $div = $('div');

      const result = $div.toggle();

      expect(result).toBe($div);
    });

    it('should work with multiple elements independently', () => {
      document.body.innerHTML = '<div style="display: none"></div><span></span>';

      $('div, span').toggle();

      expect($('div').css('display')).toBe('block'); // Was hidden, now shown
      expect($('span').css('display')).toBe('none'); // Was visible, now hidden
    });

    it('should respect calculate: false option', () => {
      document.body.innerHTML = '<div style="display: none"></div>';
      const $div = $('div');

      $div.toggle({ calculate: false });

      expect($div.css('display')).toBe('block');
    });

    it('should handle elements with custom display values', () => {
      document.body.innerHTML = '<div style="display: flex"></div>';
      const $div = $('div');

      $div.toggle(); // Should hide
      expect($div.css('display')).toBe('none');

      $div.toggle(); // Should show with natural display (block, not flex)
      expect($div.css('display')).toBe('block');
    });
  });

  describe('isVisible enhancements', () => {
    it('should check visibility: hidden by default', () => {
      document.body.innerHTML = '<div style="visibility: hidden; width: 100px; height: 100px;"></div>';
      const div = document.querySelector('div');
      div.getBoundingClientRect = () => ({ width: 100, height: 100 });

      const result = $('div').isVisible();

      expect(result).toBe(false);
    });

    it('should check content-visibility: hidden by default', () => {
      document.body.innerHTML = '<div style="content-visibility: hidden; width: 100px; height: 100px;"></div>';
      const div = document.querySelector('div');
      div.getBoundingClientRect = () => ({ width: 100, height: 100 });

      const result = $('div').isVisible();

      expect(result).toBe(false);
    });

    it('should skip visibility checks when includeVisibility: false', () => {
      // Create element and mock getBoundingClientRect to simulate element with dimensions
      document.body.innerHTML = '<div style="visibility: hidden; width: 100px; height: 100px;"></div>';
      const div = document.querySelector('div');
      div.getBoundingClientRect = () => ({ width: 100, height: 100 });

      const result = $('div').isVisible({ includeVisibility: false });

      expect(result).toBe(true); // Should ignore visibility: hidden
    });

    it('should combine visibility and opacity checks', () => {
      document.body.innerHTML = '<div style="visibility: hidden; opacity: 0; width: 100px; height: 100px;"></div>';
      const div = document.querySelector('div');
      div.getBoundingClientRect = () => ({ width: 100, height: 100 });

      const result = $('div').isVisible({ includeOpacity: true });

      expect(result).toBe(false); // Hidden by both visibility and opacity
    });

    it('should return true for fully visible elements', () => {
      document.body.innerHTML = '<div style="width: 100px; height: 100px; visibility: visible; opacity: 1;"></div>';
      const div = document.querySelector('div');
      div.getBoundingClientRect = () => ({ width: 100, height: 100 });

      const result = $('div').isVisible({ includeOpacity: true });

      expect(result).toBe(true);
    });

    it('should handle empty selection', () => {
      const result = $('.nonexistent').isVisible();

      expect(result).toBeUndefined();
    });

    it('should return true only if ALL elements are visible', () => {
      document.body.innerHTML = `
        <div class="test" style="width: 100px; height: 100px;"></div>
        <div class="test" style="visibility: hidden; width: 100px; height: 100px;"></div>
      `;

      // Mock getBoundingClientRect for both elements
      const divs = document.querySelectorAll('.test');
      divs[0].getBoundingClientRect = () => ({ width: 100, height: 100 });
      divs[1].getBoundingClientRect = () => ({ width: 100, height: 100 });

      const result = $('.test').isVisible();

      expect(result).toBe(false); // One element is hidden
    });
  });

  describe('naturalDisplay enhancements', () => {
    it('should accept calculate: false option', () => {
      document.body.innerHTML = '<div></div>';
      const $div = $('div');

      const result = $div.naturalDisplay({ calculate: false });

      expect(result).toBe('block'); // Should use tag-based lookup
    });

    it('should default to calculate: true', () => {
      document.body.innerHTML = '<div></div>';
      const $div = $('div');

      const result = $div.naturalDisplay();

      expect(typeof result).toBe('string');
      expect(result).toBeTruthy();
    });

    it('should handle different element types with calculate: false', () => {
      document.body.innerHTML = `
        <div></div>
        <span></span>
        <table></table>
        <button></button>
      `;

      expect($('div').naturalDisplay({ calculate: false })).toBe('block');
      expect($('span').naturalDisplay({ calculate: false })).toBe('inline');
      expect($('table').naturalDisplay({ calculate: false })).toBe('table');
      expect($('button').naturalDisplay({ calculate: false })).toBe('inline-block');
    });

    it('should return array for multiple elements', () => {
      document.body.innerHTML = '<div></div><span></span>';

      const result = $('div, span').naturalDisplay({ calculate: false });

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(['block', 'inline']);
    });

    it('should return single value for single element', () => {
      document.body.innerHTML = '<div></div>';

      const result = $('div').naturalDisplay({ calculate: false });

      expect(typeof result).toBe('string');
      expect(result).toBe('block');
    });
  });
});
