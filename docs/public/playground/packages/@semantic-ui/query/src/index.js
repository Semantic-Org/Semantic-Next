import { Query } from './query.js';

const $ = function (selector, args = {}) {
  const isClient = typeof window !== 'undefined';
  if(!args?.root && isClient) {
    args.root = document;
  }
  return new Query(selector, args);
};

export { Query, $ };
