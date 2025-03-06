const { Query, $, $$, exportGlobals, restoreGlobals, useAlias } = require('./index.js');

module.exports = {
  Query,
  $,
  $$,
  exportGlobals,
  restoreGlobals,
  useAlias,
  default: $
};
