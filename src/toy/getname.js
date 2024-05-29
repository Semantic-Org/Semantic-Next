import getConfig from './configmap.js';

export function getName(id) {
  return getConfig[id]?.name;
}
