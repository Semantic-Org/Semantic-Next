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

  /*******************************
      Documented forms from events.mdx and component-events skill
  *******************************/

  describe('documented forms', () => {
    // events.mdx "Inside Component" — basic form
    it('parses "click .submit" (events.mdx Inside Component)', () => {
      expect(parse('click .submit')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '.submit' },
      ]);
    });

    // events.mdx "Inside Component" — descendant selector
    it('parses "click .menu ui-button" (events.mdx Inside Component)', () => {
      expect(parse('click .menu ui-button')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '.menu ui-button' },
      ]);
    });

    // events.mdx "Multiple Events + One Selector"
    it('parses "mouseup, mouseleave .selector" (events.mdx Multiple Events + One Selector)', () => {
      expect(parse('mouseup, mouseleave .selector')).toEqual([
        { eventName: 'mouseup', eventType: 'delegate', selector: '.selector' },
        { eventName: 'mouseout', eventType: 'delegate', selector: '.selector' },
      ]);
    });

    // events.mdx "Component-Wide Events"
    it('parses "mouseover" with no selector (events.mdx Component-Wide Events)', () => {
      expect(parse('mouseover')).toEqual([
        { eventName: 'mouseover', eventType: 'delegate', selector: '' },
      ]);
    });

    it('parses "mouseout" with no selector (events.mdx Component-Wide Events)', () => {
      expect(parse('mouseout')).toEqual([
        { eventName: 'mouseout', eventType: 'delegate', selector: '' },
      ]);
    });

    // events.mdx "Global Events"
    it('parses "global scroll window" (events.mdx Global Events)', () => {
      expect(parse('global scroll window')).toEqual([
        { eventName: 'scroll', eventType: 'global', selector: 'window' },
      ]);
    });

    // events.mdx "Bound events"
    it('parses "bind customevent some-component" (events.mdx Bound events)', () => {
      expect(parse('bind customevent some-component')).toEqual([
        { eventName: 'customevent', eventType: 'bind', selector: 'some-component' },
      ]);
    });

    // component-events skill — deep with child component selector
    it('parses "deep click menu-item" (component-events skill)', () => {
      expect(parse('deep click menu-item')).toEqual([
        { eventName: 'click', eventType: 'deep', selector: 'menu-item' },
      ]);
    });

    // component-events skill — global with window
    it('parses "global resize window" (component-events skill)', () => {
      expect(parse('global resize window')).toEqual([
        { eventName: 'resize', eventType: 'global', selector: 'window' },
      ]);
    });

    // component-events skill — multi-event sharing one selector
    it('parses "mouseup, mouseleave .handle" (component-events skill)', () => {
      expect(parse('mouseup, mouseleave .handle')).toEqual([
        { eventName: 'mouseup', eventType: 'delegate', selector: '.handle' },
        { eventName: 'mouseout', eventType: 'delegate', selector: '.handle' },
      ]);
    });

    // events.mdx "Custom Event Data" — camelCase custom event name
    it('parses "resizeStart custom-component" (events.mdx Custom Event Data)', () => {
      expect(parse('resizeStart custom-component')).toEqual([
        { eventName: 'resizeStart', eventType: 'delegate', selector: 'custom-component' },
      ]);
    });

    // events.mdx "Listening to Custom Events" — lowercase custom event
    it('parses "itemactive inpage-menu" (events.mdx Listening to Custom Events)', () => {
      expect(parse('itemactive inpage-menu')).toEqual([
        { eventName: 'itemactive', eventType: 'delegate', selector: 'inpage-menu' },
      ]);
    });

    // events.mdx "Lifecycle Events"
    it('parses "rendered inpage-menu" (events.mdx Lifecycle Events)', () => {
      expect(parse('rendered inpage-menu')).toEqual([
        { eventName: 'rendered', eventType: 'delegate', selector: 'inpage-menu' },
      ]);
    });

    it('parses "destroyed inpage-menu" (events.mdx Lifecycle Events)', () => {
      expect(parse('destroyed inpage-menu')).toEqual([
        { eventName: 'destroyed', eventType: 'delegate', selector: 'inpage-menu' },
      ]);
    });
  });

  /*******************************
      Documented multi-selector form: "event sel1, event sel2"
  *******************************/

  describe('documented "event sel, event sel" form (events.mdx Multiple Events + Multiple Selectors)', () => {
    // events.mdx writes:
    //   'click .selector1, click .selector2'() { /* binds click to .selector1 AND .selector2 */ }
    // The component-events skill likewise writes:
    //   'click .save, click .apply'({ self }) { self.persist(); }
    //
    // Per docs both forms must produce two click bindings, one per selector.
    // Current parser treats the second "click" as part of the second selector,
    // producing a malformed selector "click .selector2" — these tests document
    // the gap and will FAIL until the parser is fixed.

    it('parses "click .selector1, click .selector2" as two click bindings (events.mdx)', () => {
      expect(parse('click .selector1, click .selector2')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '.selector1' },
        { eventName: 'click', eventType: 'delegate', selector: '.selector2' },
      ]);
    });

    it('parses "click .save, click .apply" as two click bindings (component-events skill)', () => {
      expect(parse('click .save, click .apply')).toEqual([
        { eventName: 'click', eventType: 'delegate', selector: '.save' },
        { eventName: 'click', eventType: 'delegate', selector: '.apply' },
      ]);
    });
  });
});
