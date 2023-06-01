module.exports = {

  parser: '@babel/eslint-parser',

  parserOptions: {
    requireConfigFile: false,
    ecmaVersion : 11,
    ecmaFeatures: {
      binaryLiterals                   : true,     // enable binary literals
      blockBindings                    : true,     // enable let and const (aka block bindings)
      defaultParams                    : true,     // enable default function parameters
      forOf                            : true,     // enable for-of loops
      generators                       : true,     // enable generators
      jsx                              : true,     // enable JSX
      modules                          : true,
      objectLiteralComputedProperties  : true,     // enable computed object literal property names
      objectLiteralDuplicateProperties : true,     // enable duplicate object literal properties in strict mode
      objectLiteralShorthandMethods    : true,     // enable object literal shorthand methods
      objectLiteralShorthandProperties : true,     // enable object literal shorthand properties
      octalLiterals                    : true,     // enable octal literals
      regexUFlag                       : true,     // enable the regular expression u flag
      regexYFlag                       : true,     // enable the regular expression y flag
      templateStrings                  : true,     // enable template strings
      unicodeCodePointEscapes          : false,    // enable code point escapes
      experimentalObjectRestSpread     : true      // enable object spread
    },
    sourceType  : 'module'
  },

  env: {
    browser   : true,
    es6       : true,
    mongo     : true,
    meteor    : true,
    node      : true,
    jquery    : true,

    commonjs  : false,
    amd       : false,
    worker    : false,
    mocha     : false,
    jasmine   : false,
    phantomjs : false
  },

  globals: {

    // Monolith libs
    _ : true,

  },


  plugins: [],

  /*******************************
               Rules
  *******************************/

  // Value of "0" is off, 1" is warning, "2" is error
  // http://eslint.org/docs/rules/

  rules: {

    /*--------------
         Enabled
    ---------------*/

    /* Important Enforced Rules */
    'no-eval'                 : 2,                             // disallow use of eval() (escrow is secure yall)
    'no-implied-eval'         : 2,                             // disallow use of eval()-like methods
    'no-script-url'           : 2,                             // disallow use of javascript: urls.

    /* Gotchas */
    'no-delete-var'           : 2,                             // disallow deletion of variables
    'no-dupe-keys'            : 2,                             // disallow duplicate keys when creating object literals
    'no-eq-null'              : 2,                             // disallow null eq, use undefined instead
    'no-label-var'            : 2,                             // disallow labels that share a name with a variable
    radix                     : 2,                             // require use of the second argument for parseInt()
    'no-unreachable'          : 2,                             // disallow unreachable statements after a return, throw, continue, or break statement
    'no-extra-boolean-cast'   : 1,                             // disallow redundant negation !!baz etc.
    'no-invalid-regexp'       : 1,                             // disallow invalid regular expression strings in the RegExp constructor
    'no-redeclare'            : 1,                             // disallow declaring the same variable more then once
    'no-self-compare'         : 1,                             // disallow comparisons where both sides are exactly the same
    'no-sparse-arrays'        : 1,                             // disallow array init like [,foo,,] but allow []
    'no-use-before-define'    : [1, { functions: false }],     // disallow use of variables before they are defined
    'no-sequences'            : 1,                             // disallow use of comma operator
    'no-lone-blocks'          : 1,                             // disallow unnecessary {}
    'no-empty'                : 1,                             // disallow empty statements
    'no-constant-condition'   : 1,                             // disallow use of constant expressions in conditions

    /* Code Style */
    'brace-style'             : [0, 'stroustrup'],             // enforce if/else new line (stoustrup-style)
    'comma-style'             : [2, 'last'],                   // enforce one true comma style (off by default)
    camelcase                 : [1, {properties: 'never'}],  // require camel case names (but not for properties)
    quotes                    : [1, 'single', {
      allowTemplateLiterals   : true
    }],                                                        // specify whether double or single quotes should be used
    'quote-props'             : [1, 'as-needed'],              // requires { "foo baz": '' } but not { foo: ''}
    semi                      : [2, 'always'],                 // require semicolons whenever possible
    'comma-spacing'           : 1,                             // enforce spacing before and after comma
    curly                     : [1, 'multi-line'],                             // prevents if/else with implicit curly brackets
    'eol-last'                : 1,                             // enforce newline at the end of file, with no multiple empty lines
    'no-irregular-whitespace' : 1,
    'no-var'                  : 1,                             // require let or const instead of var (off by default)
    yoda                      : 2,                             // allow (foo == 'red') but not ('red' == foo)
    'no-multi-spaces'         : [2, {                          // disallow irregular whitespace outside of strings and comments
      ignoreEOLComments       : true,
      exceptions: {
        VariableDeclarator    : true,
        LogicalExpression     : true,
        AssignmentExpression  : true,
        BinaryExpression      : true
      }
    }],
    'no-unused-vars'          : [1, {                          // disallow declaration of variables that are not used in the code
      argsIgnorePattern: '.*'
    }],
    'no-magic-numbers'        : [0, {                          // prevents use of numbers without variable declarations
      ignore: [-1, 0, 1, 2, 100, 1000]
    }],

    /* Warnings that are not important */
    'no-alert'                : 1,                             // disallow the use of alert, confirm, and prompt (not available in app)
    'no-caller'               : 1,                             // disallow use of arguments.caller or arguments.callee
    'no-extra-semi'           : 1,                             // disallow unnecessary semicolons
    'no-new-wrappers'         : 1,                             // disallows new String() when can do String()
    'no-path-concat'          : 1,                             // disallow string concatenation with __dirname and __filename to prevent win/unix sep issues (node env)
    'no-trailing-spaces'      : 0,                             // disallow trailing whitespace at the end of lines

    /* Should implement (but lets not freak us out) */
    'one-var'                 : 0,                             // allow just one var statement per function (off by default)
    'key-spacing'             : [0, { align: 'colon' }],     // require colons to be aligned (valign colon)
    complexity                : 0,                             // specify the maximum cyclomatic complexity allowed in a program (off by default)

    /*--------------
         Disabled
    ---------------*/

    /* Errors */
    'no-comma-dangle'            : 0,     // disallow trailing commas in object literals
    'no-cond-assign'             : 0,     // disallow assignment in conditional expressions
    'no-console'                 : 0,     // disallow use of console (off by default in the node environment)
    'no-control-regex'           : 0,     // disallow control characters in regular expressions
    'no-debugger'                : 0,     // disallow use of debugger
    'no-ex-assign'               : 0,     // disallow assigning to the exception in a catch block
    'no-func-assign'             : 0,     // disallow overwriting functions written as function declarations
    'no-inner-declarations'      : 0,     // disallow function or variable declarations in nested blocks
    'no-negated-in-lhs'          : 0,     // disallow negation of the left operand of an in expression
    'no-obj-calls'               : 0,     // disallow the use of object properties of the global object (Math and JSON) as functions
    'no-regex-spaces'            : 0,     // disallow multiple spaces in a regular expression literal
    'use-isnan'                  : 0,     // disallow comparisons with the value NaN
    'valid-jsdoc'                : 0,     // Ensure JSDoc comments are valid (off by default)
    'valid-typeof'               : 0,     // Ensure that the results of typeof are compared against a valid string

    /* Best Practices */
    'block-scoped-var'           : 0,     // treat var statements as if they were block scoped (off by default)
    'consistent-return'          : 0,     // require return statements to either always or never specify values
    'default-case'               : 0,     // require default case in switch statements (off by default)
    'dot-notation'               : 0,     // encourages use of dot notation whenever possible
    eqeqeq                       : 0,     // require the use of === and !==
    'guard-for-in'               : 0,     // make sure for-in loops have an if statement (off by default)
    'no-div-regex'               : 0,     // disallow division operators explicitly at beginning of regular expression (off by default)
    'no-else-return'             : 0,     // disallow else after a return in an if (off by default)
    'no-empty-label'             : 0,     // disallow use of labels for anything other then loops and switches
    'no-extend-native'           : 0,     // disallow adding to native types
    'no-extra-bind'              : 0,     // disallow unnecessary function binding
    'no-fallthrough'             : 0,     // disallow fallthrough of case statements
    'no-floating-decimal'        : 0,     // disallow the use of leading or trailing decimal points in numeric literals (off by default)
    'no-iterator'                : 0,     // disallow usage of __iterator__ property
    'no-labels'                  : 0,     // disallow use of labeled statements
    'no-lonely-if'               : 0,     // require "else if {" intead of nested "else { if {" if possible
    'no-loop-func'               : 0,     // disallow creation of functions within loops
    'no-multi-str'               : 0,     // disallow use of multiline strings
    'no-native-reassign'         : 0,     // disallow reassignments of native objects
    'no-new'                     : 0,     // disallow use of new operator when not part of the assignment or comparison
    'no-new-func'                : 0,     // disallow use of new operator for Function object
    'no-octal'                   : 0,     // disallow use of octal literals
    'no-octal-escape'            : 0,     // disallow use of octal escape sequences in string literals, such as var foo = "Copyright \251";
    'no-process-env'             : 0,     // disallow use of process.env (off by default)
    'no-proto'                   : 0,     // disallow usage of __proto__ property
    'no-return-assign'           : 0,     // disallow use of assignment in return statement
    'no-unused-expressions'      : 0,     // disallow usage of expressions in statement position
    'no-void'                    : 0,     // disallow use of void operator (off by default)
    'no-warning-comments'        : 0,     // disallow usage of configurable warning terms in comments, e.g. TODO or FIXME (off by default)
    'no-with'                    : 0,     // disallow use of the with statement
    'wrap-iife'                  : 0,     // require immediate function invocation to be wrapped in parentheses (off by default)

    /* Variables */
    'no-catch-shadow'            : 0,     // disallow the catch clause parameter name being the same as a variable in the outer scope (off by default in the node environment)
    'no-shadow'                  : 0,     // disallow declaration of variables already declared in the outer scope
    'no-shadow-restricted-names' : 0,     // disallow shadowing of names such as arguments
    'no-undefined'               : 0,     // disallow use of undefined variable (off by default)
    'no-undef'                   : 0,     // disallow use of undeclared variables unless mentioned in a /*global */ block
    'no-undef-init'              : 0,     // disallow use of undefined when initializing variables


    /* Node.js Stuff */
    'handle-callback-err'        : 0,     // enforces error handling in callbacks (off by default) (on by default in the node environment)
    'no-mixed-requires'          : 0,     // disallow mixing regular variable and require declarations (off by default) (on by default in the node environment)
    'no-new-require'             : 0,     // disallow use of new operator with the require function (off by default) (on by default in the node environment)
    'no-process-exit'            : 0,     // disallow process.exit() (on by default in the node environment)
    'no-restricted-modules'      : 0,     // restrict usage of specified node modules (off by default)
    'no-sync'                    : 0,     // disallow use of synchronous methods (off by default)

    /* Stylistic Choices */
    'consistent-this'            : 0,     // enforces consistent naming when capturing the current execution context (off by default)
    'func-names'                 : 0,     // require function expressions to have a name (off by default)
    'func-style'                 : 0,     // enforces use of function declarations or expressions (off by default)
    'max-nested-callbacks'       : 0,     // specify the maximum depth callbacks can be nested (off by default)
    'new-cap'                    : 0,     // require a capital letter for constructors
    'new-parens'                 : 0,     // disallow the omission of parentheses when invoking a constructor with no arguments
    'no-array-constructor'       : 0,     // disallow use of the Array constructor
    'no-inline-comments'         : 0,     // disallow comments inline after code (off by default)
    'no-mixed-spaces-and-tabs'   : 0,     // disallow mixed spaces and tabs for indentation
    'no-multiple-empty-lines'    : 0,     // disallow multiple empty lines (off by default)
    'no-nested-ternary'          : 0,     // disallow nested ternary expressions (off by default)
    'no-new-object'              : 0,     // disallow use of the Object constructor
    'no-space-before-semi'       : 0,     // disallow space before semicolon
    'no-spaced-func'             : 0,     // disallow space between function identifier and application
    'no-ternary'                 : 0,     // disallow the use of ternary operators (off by default)
    'no-underscore-dangle'       : 0,     // disallow dangling underscores in identifiers
    'no-wrap-func'               : 0,     // disallow wrapping of non-IIFE statements in parens
    'operator-assignment'        : 0,     // require assignment operator shorthand where possible or prohibit it entirely (off by default)
    'padded-blocks'              : 0,     // enforce padding within blocks (off by default)
    'sort-vars'                  : 0,     // sort variables within the same declaration block (off by default)
    'space-after-function-name'  : 0,     // require a space after function names (off by default)
    'space-after-keywords'       : 0,     // require a space after certain keywords (off by default)
    'space-before-blocks'        : 0,     // require or disallow space before blocks (off by default)
    'space-in-brackets'          : 0,     // require or disallow spaces inside brackets (off by default)
    'space-in-parens'            : 0,     // require or disallow spaces inside parentheses (off by default)
    'space-infix-ops'            : 0,     // require spaces around operators
    'space-return-throw-case'    : 0,     // require a space after return, throw, and case
    'space-unary-ops'            : 0,     // Require or disallow spaces before/after unary operators (words on by default, nonwords off by default)
    'wrap-regex'                 : 0,     // require regex literals to be wrapped in parentheses (off by default)
    // removing this rule until we can agree on a max length "max-len"                    : [1, { "code": 100, "ignoreComments": true }],
    'object-curly-newline'       : [1, { consistent: true }],
    indent                       : [1, 2, { MemberExpression: 1, SwitchCase: 1, VariableDeclarator: 'first' }],
    /* ECMAScipt 6 */
    'generator-star'             : 0     // enforce the position of the * in generator functions (off by default)
  }
};
