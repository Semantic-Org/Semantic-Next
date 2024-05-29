const configCache = {};

const getConfig = new Proxy({}, {
  get: (target, id) => {
    if (id in configCache) {
      return configCache[id];
    }

    try {
      const config = require(`./configs/${id}.js`).default;
      configCache[id] = config;
      return config;
    } catch (error) {
      throw new Error(`Configuration not found for ID: ${id}`);
    }
  },
});

export default getConfig;
