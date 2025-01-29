'use strict';

const { Query, $, $$ } = require('./index.js');

// Bundlers can require ESM modules from CommonJS ones
module.exports = {
  Query,
  $,
  $$,
  default: $
};
