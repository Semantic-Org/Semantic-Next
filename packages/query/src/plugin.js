import { noop } from '@semantic-ui/utils';

export const Plugin = class Plugin {

  construct({
    onCreated = noop,
    onDestroyed = noop,
  })

};
