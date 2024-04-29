import { Query } from './query.js';

const $ = function (selector, root = document) {
  return new Query(selector, root);
};

export { Query, $ };
