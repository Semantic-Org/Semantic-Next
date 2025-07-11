import { registerPlugin } from '@semantic-ui/query';

registerPlugin({
  name: 'tooltip',
  defaultSettings: {
    duration: 200,
  },
  createPlugin: (params) => {
    console.log('params are', params.settings.duration);
    return {};
  },
});
