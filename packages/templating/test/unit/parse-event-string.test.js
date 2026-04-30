import { describe, expect, it } from 'vitest';

import { Template } from '@semantic-ui/templating';

// parseEventString reads no instance state — construct once and reuse.
const tpl = new Template();
const parse = (str) => tpl.parseEventString(str);

describe('Template.parseEventString', () => {
  /*******************************
      Single event
  *******************************/

  describe('single event', () => {
    it('parses an event with a selector', () => {
      expect(parse('click .button')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '.button' },
      ]);
    });

    it('parses an event with no selector (empty selector branch)', () => {
      expect(parse('click')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '' },
      ]);
    });

    it('parses an event with a chained class selector as a single selector', () => {
      expect(parse('click .a.b')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '.a.b' },
      ]);
    });

    it('parses an event with a tag selector', () => {
      expect(parse('submit form')).toEqual([
        { eventName: 'submit', eventType: 'delegate', selector: 'form' },
      ]);
    });

    it('parses an event with an id selector', () => {
      expect(parse('click #target')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '#target' },
      ]);
    });
  });

  /*******************************
      Whitespace tolerance
  *******************************/

  describe('whitespace tolerance', () => {
    it('tolerates leading and trailing whitespace', () => {
      expect(parse('  click  .button  ')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '.button' },
      ]);
    });

    it('tolerates double spaces between event and selector', () => {
      expect(parse('click   .button')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '.button' },
      ]);
    });

    it('tolerates tabs between tokens', () => {
      expect(parse('click\t.button')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '.button' },
      ]);
    });
  });

  /*******************************
      Multiple events
  *******************************/

  describe('multiple events', () => {
    it('splits comma-separated events sharing a selector', () => {
      expect(parse('click, mousedown .x')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '.x' },
        { eventName: 'mousedown', eventType: 'delegate', selector: '.x' },
      ]);
    });

    it('splits three comma-separated events sharing a selector', () => {
      expect(parse('click, mousedown, mouseup .x')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '.x' },
        { eventName: 'mousedown', eventType: 'delegate', selector: '.x' },
        { eventName: 'mouseup', eventType: 'delegate', selector: '.x' },
      ]);
    });

    it('handles multiple events without a selector', () => {
      expect(parse('click, mousedown')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '' },
        { eventName: 'mousedown', eventType: 'delegate', selector: '' },
      ]);
    });
  });

  /*******************************
      Multiple selectors
  *******************************/

  describe('multiple selectors', () => {
    it('splits comma-separated selectors sharing an event', () => {
      expect(parse('click .a, .b')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '.a' },
        { eventName: 'click', eventType: 'delegate', selector: '.b' },
      ]);
    });

    it('splits three comma-separated selectors sharing an event', () => {
      expect(parse('click .a, .b, .c')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '.a' },
        { eventName: 'click', eventType: 'delegate', selector: '.b' },
        { eventName: 'click', eventType: 'delegate', selector: '.c' },
      ]);
    });
  });

  /*******************************
      Cartesian product
  *******************************/

  describe('multiple events x multiple selectors', () => {
    it('produces the cartesian product of events and selectors', () => {
      expect(parse('click, focus .a, .b')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '.a' },
        { eventName: 'click', eventType: 'delegate', selector: '.b' },
        { eventName: 'focusin', eventType: 'delegate', selector: '.a' },
        { eventName: 'focusin', eventType: 'delegate', selector: '.b' },
      ]);
    });

    it('produces 6 entries for 3 events and 2 selectors', () => {
      expect(parse('click, mousedown, mouseup .a, .b')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '.a' },
        { eventName: 'click', eventType: 'delegate', selector: '.b' },
        { eventName: 'mousedown', eventType: 'delegate', selector: '.a' },
        { eventName: 'mousedown', eventType: 'delegate', selector: '.b' },
        { eventName: 'mouseup', eventType: 'delegate', selector: '.a' },
        { eventName: 'mouseup', eventType: 'delegate', selector: '.b' },
      ]);
    });
  });

  /*******************************
      Prefix keywords
  *******************************/

  describe('prefix keywords', () => {
    it('defaults eventType to "delegate" when no prefix is present', () => {
      expect(parse('click .button')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '.button' },
      ]);
    });

    it('strips the "deep" prefix and sets eventType to "deep"', () => {
      expect(parse('deep click .button')).toEqual([
        { eventName: 'click', eventType: 'deep', selector: '.button' },
      ]);
    });

    it('strips the "global" prefix and sets eventType to "global"', () => {
      expect(parse('global click body')).toEqual([
        { eventName: 'click', eventType: 'global', selector: 'body' },
      ]);
    });

    it('strips the "bind" prefix and sets eventType to "bind"', () => {
      expect(parse('bind click .button')).toEqual([
        { eventName: 'click', eventType: 'bind', selector: '.button' },
      ]);
    });

    it('applies the prefix across multiple events', () => {
      expect(parse('global click, mousedown body')).toEqual([
        { eventName: 'click', eventType: 'global', selector: 'body' },
        { eventName: 'mousedown', eventType: 'global', selector: 'body' },
      ]);
    });

    it('applies the prefix with no selector', () => {
      expect(parse('deep click')).toEqual([
        { eventName: 'click', eventType: 'deep', selector: '' },
      ]);
    });

    // The prefix loop iterates ['deep','global','bind'] and applies the LAST
    // match (since eventType = keyword overwrites). After the first replace,
    // the leftover string starts with whitespace, so subsequent prefix words
    // won't match unless they are literally adjacent (no space) to the prior.
    it('only matches a prefix at the very start of the string (space breaks subsequent matches)', () => {
      // 'deep' is matched and stripped, leaving ' global click'. The loop then
      // checks startsWith('global') against ' global click' — false (leading space).
      // 'global' becomes the event name and 'click' the selector.
      expect(parse('deep global click')).toEqual([
        { eventName: 'global', eventType: 'deep', selector: 'click' },
      ]);
    });

    it('matches a later prefix when prefixes are adjacent with no space', () => {
      // 'deep' matches, replace yields 'global click', eventType='deep'.
      // Then 'global' matches against 'global click', replace yields ' click',
      // eventType='global'. Final trim gives 'click'.
      expect(parse('deepglobal click')).toEqual([
        { eventName: 'click', eventType: 'global', selector: '' },
      ]);
    });
  });

  /*******************************
      Bubble map
  *******************************/

  describe('bubble map (non-bubbling event remapping)', () => {
    it('remaps blur to focusout', () => {
      expect(parse('blur input')).toEqual([
        { eventName: 'focusout', eventType: 'delegate', selector: 'input' },
      ]);
    });

    it('remaps focus to focusin', () => {
      expect(parse('focus input')).toEqual([
        { eventName: 'focusin', eventType: 'delegate', selector: 'input' },
      ]);
    });

    it('remaps load to DOMContentLoaded', () => {
      expect(parse('load')).toEqual([
        { eventName: 'DOMContentLoaded', eventType: 'delegate', selector: '' },
      ]);
    });

    it('remaps unload to beforeunload', () => {
      expect(parse('unload')).toEqual([
        { eventName: 'beforeunload', eventType: 'delegate', selector: '' },
      ]);
    });

    it('remaps mouseenter to mouseover', () => {
      expect(parse('mouseenter .item')).toEqual([
        { eventName: 'mouseover', eventType: 'delegate', selector: '.item' },
      ]);
    });

    it('remaps mouseleave to mouseout', () => {
      expect(parse('mouseleave .item')).toEqual([
        { eventName: 'mouseout', eventType: 'delegate', selector: '.item' },
      ]);
    });

    it('applies the bubble map to all comma-separated events', () => {
      expect(parse('mouseenter, mouseleave .item')).toEqual([
        { eventName: 'mouseover', eventType: 'delegate', selector: '.item' },
        { eventName: 'mouseout', eventType: 'delegate', selector: '.item' },
      ]);
    });

    it('applies the bubble map under a "bind" prefix', () => {
      expect(parse('bind blur input')).toEqual([
        { eventName: 'focusout', eventType: 'bind', selector: 'input' },
      ]);
    });

    it('does not remap events that are not in the bubble map', () => {
      expect(parse('click .a')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '.a' },
      ]);
      expect(parse('mousedown .a')).toEqual([
        { eventName: 'mousedown', eventType: 'delegate', selector: '.a' },
      ]);
    });
  });

  /*******************************
      Selector parsing details
  *******************************/

  describe('selector parsing', () => {
    it('treats a chained class selector with no comma as a single selector', () => {
      expect(parse('click .a.b.c')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '.a.b.c' },
      ]);
    });

    it('treats a descendant selector with no comma as a single selector', () => {
      // selectorParts = ['.parent', '.child'].join(' ').split(',') => ['.parent .child']
      expect(parse('click .parent .child')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '.parent .child' },
      ]);
    });

    it('preserves a complex selector with attribute brackets', () => {
      expect(parse('click input[type="text"]')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: 'input[type="text"]' },
      ]);
    });

    it('returns an empty selector when only an event is provided', () => {
      expect(parse('focus')).toEqual([
        { eventName: 'focusin', eventType: 'delegate', selector: '' },
      ]);
    });
  });

  /*******************************
      Combined prefix + bubble map + multiplicity
  *******************************/

  describe('combinations', () => {
    it('combines deep prefix with the bubble map', () => {
      expect(parse('deep mouseenter .item')).toEqual([
        { eventName: 'mouseover', eventType: 'deep', selector: '.item' },
      ]);
    });

    it('combines a prefix with multiple events and selectors', () => {
      expect(parse('global focus, blur .a, .b')).toEqual([
        { eventName: 'focusin', eventType: 'global', selector: '.a' },
        { eventName: 'focusin', eventType: 'global', selector: '.b' },
        { eventName: 'focusout', eventType: 'global', selector: '.a' },
        { eventName: 'focusout', eventType: 'global', selector: '.b' },
      ]);
    });
  });
});
