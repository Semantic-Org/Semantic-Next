/**
 * Custom Expressive Code themes for Semantic UI documentation
 * Colors derived from code-formatting.css and CodePlayground.css
 */

// Light theme colors from code-formatting.css
const lightColors = {
  purple: '#6F42C1',
  grey: '#24292E',
  default: '#54595E',
  blue: '#005CC5',
  green: '#116329', // functions - green for light mode
  red: '#D73A49',
  white: '#a1a1a1',
  background: '#F6F6F7',
  comment: '#6A737D',
  lineNumber: '#6A737D',
};

// Dark theme colors from code-formatting.css
const darkColors = {
  purple: '#D2A8FF',
  grey: '#656565',
  default: '#C9D1D9',
  blue: '#73B9E1', // --primary-text-color
  green: '#7EE787', // functions - soft green
  red: '#F97583',
  white: '#FFFFFF',
  background: '#080C10',
  comment: '#444444',
  lineNumber: '#25272B',
};

export const semanticLight = {
  name: 'semantic-light',
  type: 'light',
  colors: {
    'editor.background': lightColors.background,
    'editor.foreground': lightColors.default,
    'editorLineNumber.foreground': lightColors.lineNumber,
  },
  tokenColors: [
    // Default
    {
      settings: {
        background: lightColors.background,
        foreground: lightColors.default,
      },
    },
    // Comments
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: {
        foreground: lightColors.comment,
        fontStyle: 'italic',
      },
    },
    // Keywords (if, else, return, etc.)
    {
      scope: ['keyword', 'keyword.control', 'storage.type', 'storage.modifier'],
      settings: {
        foreground: lightColors.red,
      },
    },
    // Strings
    {
      scope: ['string', 'string.quoted'],
      settings: {
        foreground: lightColors.blue,
      },
    },
    // Numbers
    {
      scope: ['constant.numeric'],
      settings: {
        foreground: lightColors.blue,
      },
    },
    // Constants and booleans
    {
      scope: ['constant.language', 'constant.language.boolean'],
      settings: {
        foreground: lightColors.blue,
      },
    },
    // Variables
    {
      scope: ['variable', 'variable.other'],
      settings: {
        foreground: lightColors.purple,
      },
    },
    // Shell commands (npm, git, etc.)
    {
      scope: ['entity.name.command.shell'],
      settings: {
        foreground: lightColors.purple,
      },
    },
    // Function names and calls
    {
      scope: ['entity.name.function', 'support.function', 'meta.function-call'],
      settings: {
        foreground: lightColors.blue,
      },
    },
    // Properties
    {
      scope: ['variable.other.property', 'support.type.property-name'],
      settings: {
        foreground: lightColors.blue,
      },
    },
    {
      scope: ['meta.object-literal.key'],
      settings: {
        foreground: lightColors.white,
      },
    },
    // Operators
    {
      scope: ['keyword.operator'],
      settings: {
        foreground: lightColors.default,
      },
    },
    // Punctuation and brackets
    {
      scope: ['punctuation', 'meta.brace'],
      settings: {
        foreground: lightColors.grey,
      },
    },
    // HTML/XML Tags
    {
      scope: ['entity.name.tag', 'punctuation.definition.tag'],
      settings: {
        foreground: lightColors.purple,
      },
    },
    // HTML/XML Attributes
    {
      scope: ['entity.other.attribute-name'],
      settings: {
        foreground: lightColors.blue,
      },
    },
    // CSS property names
    {
      scope: ['support.type.property-name.css'],
      settings: {
        foreground: lightColors.blue,
      },
    },
    // CSS values
    {
      scope: ['support.constant.property-value.css', 'meta.property-value.css'],
      settings: {
        foreground: lightColors.purple,
      },
    },
    // Class names
    {
      scope: ['entity.name.type', 'entity.name.class', 'support.class'],
      settings: {
        foreground: lightColors.purple,
      },
    },
    // JSON keys
    {
      scope: ['support.type.property-name.json'],
      settings: {
        foreground: lightColors.purple,
      },
    },
    // Template expression delimiters
    {
      scope: [
        'punctuation.definition.template-expression',
        'punctuation.section.embedded',
      ],
      settings: {
        foreground: lightColors.red,
      },
    },
    // SUI Templating - keywords
    {
      scope: ['keyword.control.sui', 'keyword.operator.logical.sui'],
      settings: {
        foreground: lightColors.red,
      },
    },
    // SUI Templating - strings
    {
      scope: ['string.quoted.single.sui', 'string.quoted.double.sui'],
      settings: {
        foreground: lightColors.white,
      },
    },
    // SUI Templating - variables
    {
      scope: ['variable.other.sui', 'variable.language.this.sui'],
      settings: {
        foreground: lightColors.blue,
      },
    },
    // SUI Templating - functions
    {
      scope: ['entity.name.function.sui'],
      settings: {
        foreground: lightColors.purple,
      },
    },
    // SUI Templating - template delimiters
    {
      scope: [
        'punctuation.definition.template-expression.begin.sui',
        'punctuation.definition.template-expression.end.sui',
      ],
      settings: {
        foreground: lightColors.grey,
      },
    },
    // SUI Templating - meta embedded content
    {
      scope: ['meta.embedded', 'meta.template.expression.sui'],
      settings: {
        foreground: lightColors.default,
      },
    },
  ],
};

export const semanticDark = {
  name: 'semantic-dark',
  type: 'dark',
  colors: {
    'editor.background': darkColors.background,
    'editor.foreground': darkColors.default,
    'editorLineNumber.foreground': darkColors.lineNumber,
  },
  tokenColors: [
    // Default
    {
      settings: {
        background: darkColors.background,
        foreground: darkColors.default,
      },
    },
    // Comments
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: {
        foreground: darkColors.comment,
        fontStyle: 'italic',
      },
    },
    // Keywords (if, else, return, etc.)
    {
      scope: ['keyword', 'keyword.control', 'storage.type', 'storage.modifier'],
      settings: {
        foreground: darkColors.red,
      },
    },
    // Strings
    {
      scope: ['string', 'string.quoted'],
      settings: {
        foreground: darkColors.blue,
      },
    },
    // Numbers
    {
      scope: ['constant.numeric'],
      settings: {
        foreground: darkColors.blue,
      },
    },
    // Constants and booleans
    {
      scope: ['constant.language', 'constant.language.boolean'],
      settings: {
        foreground: darkColors.blue,
      },
    },
    // Variables
    {
      scope: ['variable', 'variable.other'],
      settings: {
        foreground: darkColors.purple,
      },
    },
    // Shell commands (npm, git, etc.)
    {
      scope: ['entity.name.command.shell'],
      settings: {
        foreground: darkColors.purple,
      },
    },
    // Function names and calls
    {
      scope: ['entity.name.function', 'support.function', 'meta.function-call'],
      settings: {
        foreground: darkColors.blue,
      },
    },
    // Properties
    {
      scope: ['variable.other.property', 'support.type.property-name'],
      settings: {
        foreground: darkColors.blue,
      },
    },
    // obj props
    {
      scope: ['meta.object-literal.key'],
      settings: {
        foreground: darkColors.white,
      },
    },
    // Operators
    {
      scope: ['keyword.operator'],
      settings: {
        foreground: darkColors.default,
      },
    },
    // Punctuation and brackets
    {
      scope: ['punctuation', 'meta.brace'],
      settings: {
        foreground: darkColors.grey,
      },
    },
    // HTML/XML Tags
    {
      scope: ['entity.name.tag', 'punctuation.definition.tag'],
      settings: {
        foreground: darkColors.purple,
      },
    },
    // HTML/XML Attributes
    {
      scope: ['entity.other.attribute-name'],
      settings: {
        foreground: darkColors.blue,
      },
    },
    // CSS property names
    {
      scope: ['support.type.property-name.css'],
      settings: {
        foreground: darkColors.blue,
      },
    },
    // CSS values
    {
      scope: ['support.constant.property-value.css', 'meta.property-value.css'],
      settings: {
        foreground: darkColors.purple,
      },
    },
    // Class names
    {
      scope: ['entity.name.type', 'entity.name.class', 'support.class'],
      settings: {
        foreground: darkColors.purple,
      },
    },
    // JSON keys
    {
      scope: ['support.type.property-name.json'],
      settings: {
        foreground: darkColors.purple,
      },
    },
    // Template expression delimiters
    {
      scope: [
        'punctuation.definition.template-expression',
        'punctuation.section.embedded',
      ],
      settings: {
        foreground: darkColors.red,
      },
    },
    // SUI Templating - keywords
    {
      scope: ['keyword.control.sui', 'keyword.operator.logical.sui'],
      settings: {
        foreground: darkColors.red,
      },
    },
    // SUI Templating - strings
    {
      scope: ['string.quoted.single.sui', 'string.quoted.double.sui'],
      settings: {
        foreground: darkColors.white,
      },
    },
    // SUI Templating - variables
    {
      scope: ['variable.other.sui', 'variable.language.this.sui'],
      settings: {
        foreground: darkColors.blue,
      },
    },
    // SUI Templating - functions
    {
      scope: ['entity.name.function.sui'],
      settings: {
        foreground: darkColors.purple,
      },
    },
    // SUI Templating - template delimiters
    {
      scope: [
        'punctuation.definition.template-expression.begin.sui',
        'punctuation.definition.template-expression.end.sui',
      ],
      settings: {
        foreground: darkColors.grey,
      },
    },
    // SUI Templating - meta embedded content
    {
      scope: ['meta.embedded', 'meta.template.expression.sui'],
      settings: {
        foreground: darkColors.default,
      },
    },
  ],
};

export default [semanticLight, semanticDark];
