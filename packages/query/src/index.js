import { Query } from './query.js';

export function $(selector, root = document) {
  return new Query(selector, root);
}
