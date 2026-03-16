import { $ } from '@semantic-ui/query';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Query intersects()', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    window.scrollTo(0, 0);
  });

  describe('basic intersection', () => {
    it('returns true for overlapping elements', () => {
      document.body.innerHTML = `
        <div id="source" style="position: absolute; top: 50px; left: 50px; width: 100px; height: 100px;"></div>
        <div id="target" style="position: absolute; top: 75px; left: 75px; width: 100px; height: 100px;"></div>
      `;

      const result = $('#source').intersects('#target');
      expect(result).toBe(true);
    });

    it('returns false for non-overlapping elements', () => {
      document.body.innerHTML = `
        <div id="source" style="position: absolute; top: 50px; left: 50px; width: 100px; height: 100px;"></div>
        <div id="target" style="position: absolute; top: 200px; left: 200px; width: 100px; height: 100px;"></div>
      `;

      const result = $('#source').intersects('#target');
      expect(result).toBe(false);
    });

    it('returns false for empty source selection', () => {
      document.body.innerHTML = `
        <div id="target" style="position: absolute; top: 50px; left: 50px; width: 100px; height: 100px;"></div>
      `;

      const result = $('.nonexistent').intersects('#target');
      expect(result).toBe(false);
    });

    it('returns false for empty target selection', () => {
      document.body.innerHTML = `
        <div id="source" style="position: absolute; top: 50px; left: 50px; width: 100px; height: 100px;"></div>
      `;

      const result = $('#source').intersects('.nonexistent');
      expect(result).toBe(false);
    });
  });

  describe('threshold parameter', () => {
    it('respects threshold for intersection ratio', () => {
      // Create elements where source is 50% inside target
      // Source: 50,50 -> 150,150 (100x100)
      // Target: 0,0 -> 100,100 (100x100)
      // Intersection: 50,50 -> 100,100 (50x50 = 2500 area)
      // Source area: 100x100 = 10000
      // Ratio: 2500/10000 = 0.25 (25%)
      document.body.innerHTML = `
        <div id="source" style="position: absolute; top: 50px; left: 50px; width: 100px; height: 100px;"></div>
        <div id="target" style="position: absolute; top: 0px; left: 0px; width: 100px; height: 100px;"></div>
      `;

      // 25% intersection should pass 20% threshold
      expect($('#source').intersects('#target', { threshold: 0.2 })).toBe(true);

      // 25% intersection should fail 30% threshold
      expect($('#source').intersects('#target', { threshold: 0.3 })).toBe(false);
    });
  });

  describe('fully parameter', () => {
    it('returns true when source is fully contained in target', () => {
      document.body.innerHTML = `
        <div id="source" style="position: absolute; top: 75px; left: 75px; width: 50px; height: 50px;"></div>
        <div id="target" style="position: absolute; top: 50px; left: 50px; width: 100px; height: 100px;"></div>
      `;

      const result = $('#source').intersects('#target', { fully: true });
      expect(result).toBe(true);
    });

    it('returns false when source is only partially in target', () => {
      document.body.innerHTML = `
        <div id="source" style="position: absolute; top: 50px; left: 50px; width: 100px; height: 100px;"></div>
        <div id="target" style="position: absolute; top: 75px; left: 75px; width: 50px; height: 50px;"></div>
      `;

      const result = $('#source').intersects('#target', { fully: true });
      expect(result).toBe(false);
    });
  });

  describe('sides parameter', () => {
    it('detects top edge intersection', () => {
      document.body.innerHTML = `
        <div id="source" style="position: absolute; top: 75px; left: 50px; width: 100px; height: 100px;"></div>
        <div id="target" style="position: absolute; top: 50px; left: 50px; width: 100px; height: 100px;"></div>
      `;

      const result = $('#source').intersects('#target', { sides: 'top' });
      expect(result).toBe(true);
    });

    it('detects bottom edge intersection', () => {
      document.body.innerHTML = `
        <div id="source" style="position: absolute; top: 25px; left: 50px; width: 100px; height: 100px;"></div>
        <div id="target" style="position: absolute; top: 50px; left: 50px; width: 100px; height: 100px;"></div>
      `;

      const result = $('#source').intersects('#target', { sides: 'bottom' });
      expect(result).toBe(true);
    });

    it('detects multiple sides intersection', () => {
      document.body.innerHTML = `
        <div id="source" style="position: absolute; top: 75px; left: 75px; width: 50px; height: 50px;"></div>
        <div id="target" style="position: absolute; top: 50px; left: 50px; width: 100px; height: 100px;"></div>
      `;

      const result = $('#source').intersects('#target', { sides: ['top', 'left'] });
      expect(result).toBe(true);
    });
  });

  describe('returnDetails parameter', () => {
    it('returns detailed intersection information', () => {
      document.body.innerHTML = `
        <div id="source" style="position: absolute; top: 75px; left: 75px; width: 50px; height: 50px;"></div>
        <div id="target" style="position: absolute; top: 50px; left: 50px; width: 100px; height: 100px;"></div>
      `;

      const result = $('#source').intersects('#target', { returnDetails: true });

      expect(result).toBeTypeOf('object');
      expect(result.intersects).toBe(true);
      expect(result.ratio).toBeGreaterThan(0);
      expect(result.rect).toBeTypeOf('object');
      expect(result.rect.width).toBeGreaterThan(0);
      expect(result.rect.height).toBeGreaterThan(0);
    });

    it('returns false intersection details for non-overlapping elements', () => {
      document.body.innerHTML = `
        <div id="source" style="position: absolute; top: 50px; left: 50px; width: 50px; height: 50px;"></div>
        <div id="target" style="position: absolute; top: 200px; left: 200px; width: 50px; height: 50px;"></div>
      `;

      const result = $('#source').intersects('#target', { returnDetails: true });

      expect(result).toBeTypeOf('object');
      expect(result.intersects).toBe(false);
      expect(result.ratio).toBe(0);
      expect(result.rect).toBe(null);
    });
  });

  describe('scroll container handling', () => {
    it('handles intersection with scrolled content correctly', () => {
      // Create a scroll container with content
      document.body.innerHTML = `
        <div id="container" style="position: relative; overflow: auto; width: 200px; height: 200px; border: 1px solid black;">
          <div id="content" style="height: 400px; width: 400px;">
            <div id="trigger" style="position: absolute; top: 150px; left: 50px; width: 50px; height: 50px; background: red;"></div>
            <div id="popup" style="position: absolute; top: 100px; left: 50px; width: 100px; height: 100px; background: blue;"></div>
          </div>
        </div>
      `;

      const container = document.getElementById('container');
      const trigger = $('#trigger');
      const popup = $('#popup');

      // Before scrolling - elements should intersect
      let result = trigger.intersects(popup);
      expect(result).toBe(true);

      // Scroll the container
      container.scrollTop = 100;

      // After scrolling - intersection should still be detected correctly
      // Note: This test verifies that our coordinate system handling works
      result = trigger.intersects(popup);
      // Elements are still overlapping in document space even after scroll
      expect(result).toBe(true);
    });

    it('handles position calculation with scroll offset', () => {
      // Test the position() method enhancement for scroll containers
      document.body.innerHTML = `
        <div id="container" style="position: relative; overflow: auto; width: 200px; height: 200px;">
          <div style="height: 400px; width: 400px;">
            <div id="child" style="position: absolute; top: 100px; left: 50px; width: 50px; height: 50px;"></div>
          </div>
        </div>
      `;

      const container = document.getElementById('container');
      const child = $('#child');

      // Get position relative to container
      const position = child.position({ relativeTo: container });

      expect(position.relative).toBeDefined();
      expect(typeof position.relative.top).toBe('number');
      expect(typeof position.relative.left).toBe('number');

      // Scroll the container
      container.scrollTop = 50;

      // Position calculation should account for scroll automatically via getBoundingClientRect
      const positionAfterScroll = child.position({ relativeTo: container });

      // After scrolling down 50px, the element appears 50px higher relative to container viewport
      expect(positionAfterScroll.relative.top).toBe(position.relative.top - 50);

      // But local coordinates (relative to positioning parent) should remain the same
      // because the element hasn't moved in its positioning context - it's still at top: 100px
      expect(positionAfterScroll.local.top).toBe(position.local.top);
    });
  });

  describe('edge cases', () => {
    it('handles elements with zero dimensions', () => {
      document.body.innerHTML = `
        <div id="source" style="position: absolute; top: 50px; left: 50px; width: 0px; height: 0px;"></div>
        <div id="target" style="position: absolute; top: 50px; left: 50px; width: 100px; height: 100px;"></div>
      `;

      const result = $('#source').intersects('#target');
      expect(result).toBe(false); // Zero-dimension elements shouldn't intersect
    });

    it('handles identical positioned elements', () => {
      document.body.innerHTML = `
        <div id="source" style="position: absolute; top: 50px; left: 50px; width: 100px; height: 100px;"></div>
        <div id="target" style="position: absolute; top: 50px; left: 50px; width: 100px; height: 100px;"></div>
      `;

      const result = $('#source').intersects('#target');
      expect(result).toBe(true);

      const resultFully = $('#source').intersects('#target', { fully: true });
      expect(resultFully).toBe(true);
    });

    it('handles just-touching elements', () => {
      document.body.innerHTML = `
        <div id="source" style="position: absolute; top: 50px; left: 50px; width: 100px; height: 100px;"></div>
        <div id="target" style="position: absolute; top: 150px; left: 50px; width: 100px; height: 100px;"></div>
      `;

      const result = $('#source').intersects('#target');
      expect(result).toBe(false); // Just touching edges shouldn't count as intersection
    });
  });

  describe('target with borders', () => {
    it('detects intersection within border area', () => {
      // Target: border-box (50,50) → (190,190), 20px border, 100x100 content
      // Source at (175,90), 10x10 — overlaps the right border area
      // Borders are part of the visual footprint, so this should intersect
      document.body.innerHTML = `
        <div id="source" style="position: absolute; top: 90px; left: 175px; width: 10px; height: 10px;"></div>
        <div id="target" style="position: absolute; top: 50px; left: 50px; width: 100px; height: 100px; border: 20px solid black; box-sizing: content-box;"></div>
      `;

      const result = $('#source').intersects('#target');
      expect(result).toBe(true);
    });

    it('returns false for element outside border-box', () => {
      // Target border-box: (50,50) → (190,190)
      // Source at (195,90), 10x10 — completely outside border-box
      document.body.innerHTML = `
        <div id="source" style="position: absolute; top: 90px; left: 195px; width: 10px; height: 10px;"></div>
        <div id="target" style="position: absolute; top: 50px; left: 50px; width: 100px; height: 100px; border: 20px solid black; box-sizing: content-box;"></div>
      `;

      const result = $('#source').intersects('#target');
      expect(result).toBe(false);
    });

    it('reports fully contained correctly when target has borders', () => {
      // Target border-box: (50,50) → (190,190), outerWidth/Height = 140
      // Source at (55,55) 130x130 — fits inside border-box
      document.body.innerHTML = `
        <div id="source" style="position: absolute; top: 55px; left: 55px; width: 130px; height: 130px;"></div>
        <div id="target" style="position: absolute; top: 50px; left: 50px; width: 100px; height: 100px; border: 20px solid black; box-sizing: content-box;"></div>
      `;

      const result = $('#source').intersects('#target', { fully: true });
      expect(result).toBe(true);

      // Source at (55,55) 140x140 — right/bottom at 195, past border-box (190)
      document.body.innerHTML = `
        <div id="source" style="position: absolute; top: 55px; left: 55px; width: 140px; height: 140px;"></div>
        <div id="target" style="position: absolute; top: 50px; left: 50px; width: 100px; height: 100px; border: 20px solid black; box-sizing: content-box;"></div>
      `;

      const resultOverflow = $('#source').intersects('#target', { fully: true });
      expect(resultOverflow).toBe(false);
    });

    it('calculates correct intersection ratio with bordered target', () => {
      // Target border-box: (50,50) → (190,190), outerWidth/Height = 140
      // Source: (50,50) 70x70 — fully inside border-box, ratio should be 1.0
      document.body.innerHTML = `
        <div id="source" style="position: absolute; top: 50px; left: 50px; width: 70px; height: 70px;"></div>
        <div id="target" style="position: absolute; top: 50px; left: 50px; width: 100px; height: 100px; border: 20px solid black; box-sizing: content-box;"></div>
      `;

      const details = $('#source').intersects('#target', { returnDetails: true });
      expect(details.intersects).toBe(true);
      expect(details.ratio).toBe(1);
    });

    it('works correctly with border-box sizing on target', () => {
      // Target: border-box sizing, total 140x140, border 20px
      // Target border-box: (50,50) → (190,190) — same geometry as content-box tests
      // Source at (175,90), 10x10 — in the border area, should intersect
      document.body.innerHTML = `
        <div id="source" style="position: absolute; top: 90px; left: 175px; width: 10px; height: 10px;"></div>
        <div id="target" style="position: absolute; top: 50px; left: 50px; width: 140px; height: 140px; border: 20px solid black; box-sizing: border-box;"></div>
      `;

      const result = $('#source').intersects('#target');
      expect(result).toBe(true);
    });
  });
});
