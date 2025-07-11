import { registerPlugin } from '@semantic-ui/query';

const defaultSettings = {
  duration: 200,
};

const className = {
  animating: 'animating',
  disabled: 'disabled',
  hidden: 'hidden',
  inward: 'in',
  loading: 'loading',
  looping: 'looping',
  outward: 'out',
  transition: 'transition',
  visible: 'visible',
};

const error = {
  repeated: 'That animation is already occurring, cancelling repeated animation',
};

const createPlugin = ({ settings }) => ({});

registerPlugin('transition', {
  defaultSettings,
  createPlugin,
});
