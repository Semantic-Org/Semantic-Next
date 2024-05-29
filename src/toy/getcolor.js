import getConfig from './configmap.js';

export function getColor(id) {
  return getConfig[id]?.color;
}
