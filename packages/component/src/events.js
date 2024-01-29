import { $ } from '@semantic-ui/query';
import { each } from '@semantic-ui/utils';

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

    $(el.renderRoot).on(eventName, selector, function(event) {
      const boundEvent = eventHandler.bind(event.target);
      el.call(boundEvent, {firstArg: event });
    });
  });
};
