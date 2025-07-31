import { registerBehavior } from '@semantic-ui/query';
import css from 'transition.css?raw';

const defaultSettings = {
  // example content
  duration: 200,
};

const classNames = {
  // example content
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
  // example content
  repeated: 'That animation is already occurring, cancelling repeated animation',
};

const onCreated = ({settings}) => {
};

const createPlugin = ({ settings }) => ({

});

export const TransitionBehavior = registerBehavior({
  name: 'transition',
  defaultSettings,
  classNames,
  createPlugin,
  onCreated,
  classNames,
  css,
  error,
});
