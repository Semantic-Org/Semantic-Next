import { $ } from './query';
import { each } from './utils';

export const attachEvents = ({
  el,
  events = {}
} = {}) => {
  each(events, (eventHandler, eventType) => {

    // format like 'click .foo baz'
    const parts = eventType.split(' ');
    const eventName = parts[0];
    parts.shift();
    const selector = parts.join(' ');

    $(el.shadowRoot).on(eventName, selector, function(event) {
      eventHandler.call(this, event, el);
    });
  });
};
