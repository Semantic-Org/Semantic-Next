import { registerPlugin } from '@semantic-ui/query';

const defaultSettings = {
  duration: 200,
};

const classNames = {
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

const onCreated = ({settings}) => {
  console.log('initialized with', settings);
};

const createPlugin = ({ settings }) => ({

});

export const TransitionPlugin = registerPlugin({
  name: 'transition',
  defaultSettings,
  classNames,
  createPlugin,
  onCreated,
});
