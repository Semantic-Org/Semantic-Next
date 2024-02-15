const Configuration = {
  /*
   * Resolve and load @commitlint/config-conventional from node_modules.
   * Referenced packages must be installed
   */
  //extends: ['@commitlint/config-conventional'],

  /*
   * Any rules defined here will override rules from @commitlint/config-conventional
   */
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'component',
        'examples',
        'query',
        'reactivity',
        'templating',
        'utils',
        'tests',
        'ui',
        'ci',
        'tooling',
        'docs',
      ],
    ],
    //'type-enum': [2, 'always', ['foo']],
  },

  /*
   * Whether commitlint uses the default ignore rules, see the description above.
   */
  defaultIgnores: true,

  /*
   * Custom URL to show upon failure
   */
  //helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
};

module.exports = Configuration;
